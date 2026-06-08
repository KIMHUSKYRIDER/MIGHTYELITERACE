// validate.mjs — sanity checks for the bitbot-wonder extension
// Catches the kind of bugs we hit during v5.0/v5.1 development before they reach MakeCode.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BLOCK_FILES = [
    'wonder.ts',
    'wonder-teacher.ts',
    'wonder-extras.ts',
    'wonder-arena.ts',
    'wonder-music.ts',
    'wonder-loops.ts',
    'wonder-builtins.ts',
    'wonder-bitbot.ts',
    'wonder-pro.ts',
    'wonder-stats.ts',
    'wonder-control.ts',
    'wonder-elite.ts',
    'wonder-models.ts',
    'wonder-tracks.ts',
    'wonder-save.ts',
]

const RACER_FILE = 'wonderracer.ts'

// Font Awesome 4 codepoints known to render in MakeCode's bundled FA subset.
// MakeCode ships only FA 4.x. FA 5+ glyphs render as empty boxes.
const SAFE_ICON_CODES_RE = /^[\\uf]/i

function readSafe(file) {
    if (!fs.existsSync(file)) return null
    return fs.readFileSync(file, 'utf8')
}

function findBlockNames(text, fileName) {
    const lines = text.split(/\r?\n/)
    const blocks = []
    let currentNs = '(none)'
    let inEnum = 0
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
        const nsMatch = trimmed.match(/^namespace\s+(\w+)\s*\{/)
        if (nsMatch) { currentNs = nsMatch[1]; continue }
        const enumMatch = trimmed.match(/^enum\s+\w+/)
        if (enumMatch) { inEnum = 1; continue }
        if (inEnum && trimmed.includes('}')) { inEnum = 0; continue }
        const m = trimmed.match(/^\/\/%\s*block\s*=\s*"([^"]+)"/)
        if (m) {
            blocks.push({
                name: m[1],
                file: fileName,
                line: i + 1,
                ns: currentNs,
                kind: inEnum ? 'enum' : 'function',
            })
        }
    }
    return blocks
}

function findRacerCalls(text) {
    const calls = new Set()
    const re = /wonderracer\.(\w+)\s*\(/g
    let m
    while ((m = re.exec(text)) !== null) calls.add(m[1])
    return calls
}

function findRacerExports(text) {
    const exp = new Set()
    const re = /export\s+function\s+(\w+)\s*\(/g
    let m
    while ((m = re.exec(text)) !== null) exp.add(m[1])
    return exp
}

function findNamespaceIcons(text) {
    const lines = text.split(/\r?\n/)
    const out = []
    for (let i = 0; i < lines.length; i++) {
        const m = lines[i].match(/icon\s*=\s*"(\\u[0-9a-fA-F]{4,})"/)
        if (m) out.push({ icon: m[1], line: i + 1 })
    }
    return out
}

export function validate(rootDir) {
    const errors = []
    const warnings = []

    const allBlocks = []
    const racerCalls = new Set()

    for (const f of BLOCK_FILES) {
        const full = path.join(rootDir, f)
        const text = readSafe(full)
        if (!text) {
            warnings.push(`missing source file: ${f}`)
            continue
        }
        const blocks = findBlockNames(text, f)
        allBlocks.push(...blocks)

        const calls = findRacerCalls(text)
        for (const c of calls) racerCalls.add(c)

        const icons = findNamespaceIcons(text)
        for (const { icon, line } of icons) {
            const code = parseInt(icon.slice(2), 16)
            if (code >= 0xf3e2) {
                warnings.push(`${f}:${line}  icon "${icon}" (0x${code.toString(16)}) may not exist in MakeCode's FA4 subset`)
            }
        }
    }

    // duplicate block names — only function blocks, within same namespace is error, cross-namespace is warn
    const seen = new Map()
    for (const b of allBlocks) {
        if (b.kind === 'enum') continue
        const prev = seen.get(b.name)
        if (prev) {
            const msg = `block "${b.name}" appears twice: ${prev.file}:${prev.line} [${prev.ns}]  and  ${b.file}:${b.line} [${b.ns}]`
            if (prev.ns === b.ns) {
                errors.push(`duplicate in same namespace — ${msg}`)
            } else {
                warnings.push(`same block in two namespaces — ${msg}`)
            }
        } else {
            seen.set(b.name, b)
        }
    }

    // wonderracer.X() calls vs exports
    const racerText = readSafe(path.join(rootDir, RACER_FILE))
    if (!racerText) {
        errors.push(`missing ${RACER_FILE} — run build-extension.mjs first`)
    } else {
        const exp = findRacerExports(racerText)
        for (const call of racerCalls) {
            if (!exp.has(call)) {
                errors.push(`wonderracer.${call}(...) is called but no matching export in ${RACER_FILE}`)
            }
        }
    }

    // forbidden references caught in past bug-fix rounds
    const forbidden = [
        { pat: /\bled\.plotBar\b(?!Graph)/, msg: 'led.plotBar does not exist - use led.plotBarGraph or led.setBrightness' },
        { pat: /\bled\.plotBrightness\s*\([^,)]*\)/, msg: 'led.plotBrightness needs (x, y, brightness) - use led.setBrightness(v) for overall brightness' },
        { pat: /\bMath\.map\b/, msg: 'Math.map has inconsistent arg-count across MakeCode versions - inline the formula or use a constrain helper' },
        { pat: /"settings"\s*:\s*"\*"/, msg: 'settings dependency was found to break HEX flash on some boards - keep persistence in RAM' },
    ]
    for (const f of [...BLOCK_FILES, RACER_FILE]) {
        const full = path.join(rootDir, f)
        const text = readSafe(full)
        if (!text) continue
        const lines = text.split(/\r?\n/)
        for (let i = 0; i < lines.length; i++) {
            for (const rule of forbidden) {
                if (rule.pat.test(lines[i])) {
                    errors.push(`${f}:${i + 1}  ${rule.msg}`)
                }
            }
        }
    }
    // check pxt.json separately for the settings dep
    const pxtJsonPath = path.join(rootDir, 'pxt.json')
    if (fs.existsSync(pxtJsonPath)) {
        const txt = fs.readFileSync(pxtJsonPath, 'utf8')
        if (/"settings"\s*:\s*"\*"/.test(txt)) {
            errors.push(`pxt.json contains "settings": "*" - this dependency broke HEX flash in v5.1, do not re-add`)
        }
    }

    return { errors, warnings, blockCount: allBlocks.length, callCount: racerCalls.size }
}

if (process.argv[1] && path.basename(process.argv[1]) === 'validate.mjs') {
    // Detect layout: if we are in a `dev/` folder, the source files live one level up.
    const isReleaseLayout = path.basename(__dirname) === 'dev'
    const rootDir = isReleaseLayout ? path.join(__dirname, '..') : __dirname
    const r = validate(rootDir)
    console.log(`Validated ${r.blockCount} blocks, ${r.callCount} wonderracer calls`)
    if (r.warnings.length) {
        console.log(`\nWarnings (${r.warnings.length}):`)
        for (const w of r.warnings) console.log(`  WARN: ${w}`)
    }
    if (r.errors.length) {
        console.log(`\nERRORS (${r.errors.length}):`)
        for (const e of r.errors) console.log(`  FAIL: ${e}`)
        process.exit(1)
    }
    console.log(`\nAll checks passed.`)
}
