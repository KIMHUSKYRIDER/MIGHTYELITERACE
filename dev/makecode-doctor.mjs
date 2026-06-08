#!/usr/bin/env node

/**
 * makecode-doctor.mjs — generic MakeCode-extension repo auditor.
 *
 * SOURCE: vendored from sister project Codex.dex (MIT, by KIMHUSKYRIDER).
 * Upstream: https://github.com/KIMHUSKYRIDER/Codex.dex/blob/main/tools/makecode-doctor.mjs
 *
 * We pulled this in because it complements our internal `validate.mjs`:
 *   - validate.mjs is hardcoded to the wonder-*.ts file list (deep checks)
 *   - this doctor is generic + works on any MakeCode extension repo (broad checks)
 *
 * Run in CI as a second-opinion sanity check on every push.
 * Original credit and any upstream improvements belong to Codex.dex.
 *
 * Usage:
 *   node dev/makecode-doctor.mjs .
 *   node dev/makecode-doctor.mjs ../other-repo --markdown report.md
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_FILES = ['README.md', 'pxt.json']

function usage() {
    console.log(`Usage: node tools/makecode-doctor.mjs <extension-path> [--markdown <report-path>]

Checks a MakeCode extension repo for common fresh-clone problems:
- missing pxt.json and README
- invalid or incomplete manifest files list
- missing TypeScript source files
- duplicate block labels
- wonderracer-style wrapper calls without matching exports
- dev scripts that accidentally validate from the wrong folder
- dev build scripts that reference moved source files
`)
}

function normalizeSlash(value) {
    return value.replace(/\\/g, '/')
}

function readText(file) {
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
}

function readJson(file, issues) {
    try {
        return JSON.parse(readText(file))
    } catch (error) {
        issues.push(issue('fail', 'manifest', `Could not parse ${path.basename(file)}: ${error.message}`, file))
        return null
    }
}

function issue(level, area, message, file = '', detail = '') {
    return { level, area, message, file, detail }
}

function findFiles(root, predicate, out = []) {
    if (!fs.existsSync(root)) return out
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (entry.name === '.git' || entry.name === 'node_modules') continue
        const full = path.join(root, entry.name)
        if (entry.isDirectory()) {
            findFiles(full, predicate, out)
        } else if (predicate(full)) {
            out.push(full)
        }
    }
    return out
}

function isPackagedSource(root, file) {
    const rel = normalizeSlash(path.relative(root, file))
    if (rel.startsWith('dev/')) return false
    if (rel.startsWith('makecode/')) return false
    return file.endsWith('.ts')
}

function findBlockDefs(text, file) {
    const blocks = []
    let namespace = '(global)'
    let inEnum = false
    const lines = text.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim()
        const ns = trimmed.match(/^namespace\s+([A-Za-z0-9_]+)\s*\{/)
        if (ns) namespace = ns[1]
        if (/^enum\s+[A-Za-z0-9_]+/.test(trimmed)) inEnum = true
        if (inEnum && trimmed === '}') inEnum = false

        const block = trimmed.match(/^\/\/%\s*block\s*=\s*"([^"]+)"/)
        if (block) {
            blocks.push({
                label: block[1],
                namespace,
                file,
                line: i + 1,
                kind: inEnum ? 'enum' : 'function',
            })
        }
    }
    return blocks
}

function findCalls(text, objectName) {
    const calls = new Set()
    const re = new RegExp(`\\b${objectName}\\.(\\w+)\\s*\\(`, 'g')
    let match
    while ((match = re.exec(text))) calls.add(match[1])
    return calls
}

function findExports(text) {
    const exports = new Set()
    const re = /\bexport\s+function\s+(\w+)\s*\(/g
    let match
    while ((match = re.exec(text))) exports.add(match[1])
    return exports
}

function checkManifest(root, issues) {
    const pxtPath = path.join(root, 'pxt.json')
    if (!fs.existsSync(pxtPath)) {
        issues.push(issue('fail', 'manifest', 'Missing pxt.json', pxtPath))
        return null
    }

    const pxt = readJson(pxtPath, issues)
    if (!pxt) return null

    for (const key of ['name', 'version', 'description', 'files']) {
        if (!(key in pxt)) issues.push(issue('fail', 'manifest', `pxt.json is missing "${key}"`, pxtPath))
    }

    if (!Array.isArray(pxt.files)) {
        issues.push(issue('fail', 'manifest', 'pxt.json "files" must be an array', pxtPath))
        return pxt
    }

    const listed = new Set(pxt.files.map(normalizeSlash))
    for (const file of pxt.files) {
        const full = path.join(root, file)
        if (!fs.existsSync(full)) {
            issues.push(issue('fail', 'manifest', `Listed file does not exist: ${file}`, pxtPath, file))
        }
    }

    const tsFiles = findFiles(root, f => isPackagedSource(root, f))
    for (const full of tsFiles) {
        const rel = normalizeSlash(path.relative(root, full))
        if (!listed.has(rel)) {
            issues.push(issue('warn', 'manifest', `TypeScript file is not listed in pxt.json: ${rel}`, pxtPath, rel))
        }
    }

    return pxt
}

function checkDocs(root, issues) {
    for (const file of ROOT_FILES) {
        const full = path.join(root, file)
        if (!fs.existsSync(full)) issues.push(issue(file === 'pxt.json' ? 'fail' : 'warn', 'docs', `Missing ${file}`, full))
    }

    const readme = readText(path.join(root, 'README.md'))
    if (readme && !/makecode\.microbit\.org/i.test(readme)) {
        issues.push(issue('warn', 'docs', 'README does not mention makecode.microbit.org install flow', path.join(root, 'README.md')))
    }
}

function checkBlocks(root, issues) {
    const tsFiles = findFiles(root, f => isPackagedSource(root, f))
    const blocks = tsFiles.flatMap(file => findBlockDefs(readText(file), file))
    const seen = new Map()

    for (const block of blocks) {
        if (block.kind === 'enum') continue
        const key = `${block.namespace}::${block.label}`
        const existing = seen.get(key)
        if (existing) {
            issues.push(issue(
                'fail',
                'blocks',
                `Duplicate block label in ${block.namespace}: "${block.label}"`,
                block.file,
                `Also defined at ${path.relative(root, existing.file)}:${existing.line}`
            ))
        } else {
            seen.set(key, block)
        }
    }

    if (blocks.length === 0) {
        issues.push(issue('warn', 'blocks', 'No MakeCode block annotations found', root))
    }

    return { tsFiles, blockCount: blocks.length }
}

function checkWrapperExports(root, issues, tsFiles) {
    const racer = path.join(root, 'wonderracer.ts')
    if (!fs.existsSync(racer)) return

    const exports = findExports(readText(racer))
    const calls = new Set()
    for (const file of tsFiles) {
        if (path.basename(file) === 'wonderracer.ts') continue
        for (const call of findCalls(readText(file), 'wonderracer')) calls.add(call)
    }

    for (const call of calls) {
        if (!exports.has(call)) {
            issues.push(issue('fail', 'api', `wonderracer.${call}(...) is called but not exported`, racer))
        }
    }
}

function checkDevScripts(root, issues) {
    const devDir = path.join(root, 'dev')
    if (!fs.existsSync(devDir)) return

    // Local patch (vendored from Codex.dex): exclude the doctor file itself so its own
    // self-describing regex literals don't trigger false-positive warnings about itself.
    const scripts = findFiles(devDir, f =>
        (f.endsWith('.mjs') || f.endsWith('.js')) &&
        path.basename(f) !== 'makecode-doctor.mjs'
    )
    for (const script of scripts) {
        const text = readText(script)
        const rel = normalizeSlash(path.relative(root, script))

        if (/const\s+root\s*=\s*__dirname\b/.test(text)) {
            issues.push(issue('warn', 'dev-tooling', `${rel} sets root to dev/ instead of the repo root`, script))
        }

        if (/validate\(__dirname\)/.test(text)) {
            issues.push(issue('warn', 'dev-tooling', `${rel} calls validate(__dirname), so validation runs from dev/`, script))
        }

        const sourceRefs = [...text.matchAll(/path\.join\(root,\s*['"]([^'"]+\.ts)['"]\)/g)]
        for (const match of sourceRefs) {
            const referenced = match[1]
            const atRoot = path.join(root, referenced)
            const inDev = path.join(devDir, referenced)
            if (!fs.existsSync(atRoot) && fs.existsSync(inDev)) {
                issues.push(issue(
                    'fail',
                    'dev-tooling',
                    `${rel} references ${referenced} at repo root, but it exists under dev/`,
                    script,
                    `Use path.join(__dirname, '${referenced}') or move the file.`
                ))
            }
        }
    }
}

function summarize(issues) {
    const counts = { fail: 0, warn: 0, info: 0 }
    for (const item of issues) counts[item.level]++
    return counts
}

function toMarkdown(root, displayTarget, pxt, stats, issues) {
    const counts = summarize(issues)
    const title = pxt?.name ? `MakeCode Doctor Report: ${pxt.name}` : 'MakeCode Doctor Report'
    let md = `# ${title}\n\n`
    md += `Target: \`${displayTarget}\`\n\n`
    if (pxt) {
        md += `Package: \`${pxt.name || '(missing)'}\`  \n`
        md += `Version: \`${pxt.version || '(missing)'}\`\n\n`
    }
    md += `Result: ${counts.fail} fail, ${counts.warn} warn, ${counts.info} info  \n`
    md += `Blocks found: ${stats.blockCount}\n\n`

    for (const level of ['fail', 'warn', 'info']) {
        const rows = issues.filter(item => item.level === level)
        if (!rows.length) continue
        md += `## ${level.toUpperCase()}\n\n`
        for (const item of rows) {
            const rel = item.file ? normalizeSlash(path.relative(root, item.file)) : ''
            md += `- **${item.area}**: ${item.message}`
            if (rel && !rel.startsWith('..')) md += ` (\`${rel}\`)`
            if (item.detail) md += ` - ${item.detail}`
            md += '\n'
        }
        md += '\n'
    }

    if (!issues.length) md += 'No issues found.\n'
    return md
}

function printConsole(root, pxt, stats, issues) {
    const counts = summarize(issues)
    console.log(`MakeCode Doctor: ${pxt?.name || path.basename(root)}`)
    console.log(`Version: ${pxt?.version || '(unknown)'}`)
    console.log(`Result: ${counts.fail} fail, ${counts.warn} warn, ${counts.info} info`)
    console.log(`Blocks found: ${stats.blockCount}`)
    console.log('')

    for (const item of issues) {
        const rel = item.file ? normalizeSlash(path.relative(root, item.file)) : ''
        const where = rel && !rel.startsWith('..') ? ` ${rel}` : ''
        console.log(`${item.level.toUpperCase()} [${item.area}]${where}: ${item.message}`)
        if (item.detail) console.log(`  ${item.detail}`)
    }

    if (!issues.length) console.log('No issues found.')
}

function main() {
    const args = process.argv.slice(2)
    if (!args.length || args.includes('--help') || args.includes('-h')) {
        usage()
        return
    }

    const targetArg = args[0]
    const markdownIdx = args.indexOf('--markdown')
    const markdownPath = markdownIdx >= 0 ? args[markdownIdx + 1] : ''
    const root = path.resolve(process.cwd(), targetArg)
    const issues = []

    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
        console.error(`Target is not a directory: ${root}`)
        process.exit(2)
    }

    const pxt = checkManifest(root, issues)
    checkDocs(root, issues)
    const stats = checkBlocks(root, issues)
    checkWrapperExports(root, issues, stats.tsFiles)
    checkDevScripts(root, issues)

    printConsole(root, pxt, stats, issues)

    if (markdownPath) {
        const out = path.resolve(process.cwd(), markdownPath)
        fs.mkdirSync(path.dirname(out), { recursive: true })
        fs.writeFileSync(out, toMarkdown(root, targetArg, pxt, stats, issues))
        console.log(`\nWrote ${out}`)
    }

    const counts = summarize(issues)
    process.exit(counts.fail > 0 ? 1 : 0)
}

main()
