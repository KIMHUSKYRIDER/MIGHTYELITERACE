# Contributing to bitbot-wonder

Pull requests and issues are welcome. This is a teacher-friendly MakeCode
extension for the 4tronix BitBot Classic / XL / PRO — keep that audience in
mind when adding blocks.

## Project layout

```
bitbot-xl-competition.ts    Race engine (~3000 lines, PID, state machine, sensors)
wonder*.ts                  One file per block category (~21 namespaces, 283 blocks)
wonderracer.ts              Auto-generated API wrapper (DO NOT edit by hand)
build-extension.mjs         Build script: regen wonderracer.ts + validate + gen docs
validate.mjs                Sanity checker (run on every build)
gen-docs.mjs                Auto-generates BLOCKS.md from sources
pxt.json                    MakeCode extension manifest
```

## Add a new block

1. Pick the right `wonder-*.ts` file (or create a new one)
2. Add a block annotation + exported function:

```ts
//% block="my new block %arg"
//% group="My group"
//% weight=100
export function myBlock(arg: number): void {
    wonderracer.myEngineFunction(arg)
}
```

3. If you need a new engine function, add it inside `racerApiBody` in
   `build-extension.mjs` so it gets exported as `wonderracer.myEngineFunction`.
4. Run the build:

```bash
node build-extension.mjs
```

The build will:
- Regenerate `wonderracer.ts`
- Run `validate.mjs` (fails build on broken refs / duplicates / forbidden patterns)
- Regenerate `BLOCKS.md`
- Sync everything to `MIGHTYELITERACE/`

5. Commit and push.

## Rules the validator enforces

The validator catches common mistakes before they reach MakeCode. If you
get an error:

| Error | Fix |
|-------|-----|
| `duplicate block name "X"` | Rename one — same toolbox label in same namespace |
| `wonderracer.X(...) called but no matching export` | Add the export inside `racerApiBody` in `build-extension.mjs` |
| `led.plotBar does not exist` | Use `led.plotBarGraph(value, high)` |
| `led.plotBrightness needs 3 args` | Use `led.setBrightness(value)` for overall brightness |
| `Math.map has inconsistent arg-count` | Inline the formula or use a `constrain` helper |
| `settings dependency was found to break HEX flash` | Keep persistence in RAM only |
| `icon may not exist in MakeCode FA4 subset` | Pick a Font Awesome 4 codepoint (< 0xf3e2) |

## Style

- Block names: lowercase except for namespace prefix (`Wonder line losses`)
- Group names: short and noun-like (`"Race"`, `"Setup"`, `"Pre-flight"`)
- Numbers must use `clamp()` if user-facing — robot range from 0-100
- Never use top-level `basic.onStart` (conflicts with MakeCode's auto-generated start)
- Top-level statements run at start automatically — use those
- Comments in TS files describe non-obvious intent, not the obvious

## Testing on hardware

The race engine has no simulator. To test:

1. `node build-extension.mjs` (no errors)
2. Open MakeCode → load extension from your fork → flash to micro:bit on BitBot
3. Place on a track, run the program

For non-driving tests (LED + sound), the validator + build is enough.

## Pull requests

Make a focused PR — one feature or fix per PR. Include:
- Updated `CHANGELOG.md` with a one-line entry under a new version
- A note about which block(s) you added/changed

Issues and feature requests welcome under any of the existing v5 themes:
**models, tracks, save, elite, teacher, pro, music, stats, arena, loops**.
