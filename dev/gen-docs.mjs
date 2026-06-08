// gen-docs.mjs — generates BLOCKS.md by parsing wonder-*.ts
// Auto-runs from build-extension.mjs after each successful build.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const FILES = [
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

function parseFile(filePath) {
    const text = fs.readFileSync(filePath, 'utf8')
    const lines = text.split(/\r?\n/)
    const namespaces = []
    let cur = null
    let pendingBlock = null
    let pendingGroup = null
    let pendingJsdoc = []
    let inJsdoc = false

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const trimmed = line.trim()

        if (trimmed.startsWith('/**')) { inJsdoc = true; pendingJsdoc = []; continue }
        if (inJsdoc) {
            if (trimmed.endsWith('*/')) { inJsdoc = false; continue }
            const cleaned = trimmed.replace(/^\*\s?/, '').trim()
            if (cleaned) pendingJsdoc.push(cleaned)
            continue
        }

        const nsMatch = trimmed.match(/^namespace\s+(\w+)\s*\{/)
        if (nsMatch) {
            cur = { name: nsMatch[1], file: path.basename(filePath), blocks: [] }
            namespaces.push(cur)
            continue
        }

        const blockMatch = trimmed.match(/^\/\/%\s*block\s*=\s*"([^"]+)"/)
        if (blockMatch) { pendingBlock = blockMatch[1]; continue }

        const groupMatch = trimmed.match(/^\/\/%\s*group\s*=\s*"([^"]+)"/)
        if (groupMatch) { pendingGroup = groupMatch[1]; continue }

        const fnMatch = trimmed.match(/^export\s+function\s+(\w+)\s*\(([^)]*)\)\s*:?\s*(\w+)?/)
        if (fnMatch && cur) {
            const fnName = fnMatch[1]
            const fnArgs = fnMatch[2].trim()
            const fnRet = fnMatch[3] || 'void'
            const doc = pendingJsdoc.join(' ').trim()
            cur.blocks.push({
                block: pendingBlock || fnName,
                group: pendingGroup || '',
                fn: fnName,
                args: fnArgs,
                ret: fnRet,
                doc: doc,
            })
            pendingBlock = null
            pendingGroup = null
            pendingJsdoc = []
        }
    }

    return namespaces
}

export function generateDocs(rootDir) {
    const allNs = []
    for (const f of FILES) {
        const full = path.join(rootDir, f)
        if (!fs.existsSync(full)) continue
        const parsed = parseFile(full)
        allNs.push(...parsed)
    }

    let totalBlocks = 0
    for (const ns of allNs) totalBlocks += ns.blocks.length

    let md = `# BLOCKS.md — auto-generated API reference\n\n`
    md += `_Auto-generated from \`wonder-*.ts\` source files. Do not edit by hand — run \`node build-extension.mjs\` to regenerate._\n\n`
    md += `**${allNs.length} namespaces · ${totalBlocks} blocks**\n\n`
    md += `## Table of contents\n\n`
    for (const ns of allNs) {
        md += `- [${ns.name}](#${ns.name.toLowerCase()}) (${ns.blocks.length} blocks)\n`
    }
    md += `\n---\n\n`

    for (const ns of allNs) {
        md += `## ${ns.name}\n\n`
        md += `_From \`${ns.file}\`_\n\n`

        const groups = {}
        for (const b of ns.blocks) {
            const g = b.group || '(default)'
            if (!groups[g]) groups[g] = []
            groups[g].push(b)
        }

        for (const gName of Object.keys(groups)) {
            md += `### ${gName}\n\n`
            for (const b of groups[gName]) {
                const sig = `\`${ns.name}.${b.fn}(${b.args})\``
                md += `- **${b.block}** — ${sig}`
                if (b.ret && b.ret !== 'void') md += ` → \`${b.ret}\``
                md += `\n`
                if (b.doc) md += `  - ${b.doc}\n`
            }
            md += `\n`
        }

        md += `\n`
    }

    const outPath = path.join(rootDir, 'BLOCKS.md')
    fs.writeFileSync(outPath, md, 'utf8')
    return { count: totalBlocks, namespaces: allNs.length, path: outPath }
}

if (process.argv[1] && path.basename(process.argv[1]) === 'gen-docs.mjs') {
    const result = generateDocs(__dirname)
    console.log(`BLOCKS.md generated: ${result.namespaces} namespaces, ${result.count} blocks`)
}
