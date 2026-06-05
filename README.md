# MIGHTY Elite Race — BitBot Wonder Extension v2

Elite autonomous line-following blocks for **BitBot XL** (micro:bit v1.5, 2 line sensors + sonar).

## Install

1. Open [makecode.microbit.org](https://makecode.microbit.org) → **New Project**
2. **Extensions** → search `bitbot` → add **BitBot** by 4tronix
3. **Extensions** → paste in the search box:

```
https://github.com/KIMHUSKYRIDER/MIGHTYELITERACE
```

4. Press Enter → wait → click the result
5. **Wonder** (purple) appears in the toolbox

**One-click link:** [makecode.microbit.org/_pkg/KIMHUSKYRIDER/MIGHTYELITERACE](https://makecode.microbit.org/_pkg/KIMHUSKYRIDER/MIGHTYELITERACE)

## Quick start (one block)

**On Start** → **Wonder start elite racer** → Left, **5**

Or JavaScript (delete all other code in `{}`):

```typescript
wonder.startEliteRacer(BBRobotDirection.Left, 5)
```

## Full setup (blocks)

On **On Start**, stack in order:

1. **Wonder select model** → XL
2. **Wonder tuning preset** → competition
3. **Wonder start countdown** → 3 sec
4. **Wonder start elite racer** → Left, 5

## Block groups

| Group | What it does |
|-------|----------------|
| **Setup** | Model, prepare racer, tuning preset, disable radio |
| **Speed** | Base / elite / min speed, PID straight & turn |
| **Obstacles** | Stop and clear distances (cm) |
| **Race** | Countdown, start, emergency stop, soft reset |
| **Sensors** | Line position, sonar, quality readings |
| **Status** | Line seen, at obstacle, elite mode, drive state |

## Built-in controls

| Button | Action |
|--------|--------|
| A | Telemetry / Elite "E" |
| B | Emergency stop |
| A+B | Soft reset |
| Logo | Show confidence |
| Shake | Max speed + obstacle count |

## Important — avoid errors

- **Do not** paste `bitbot-xl-competition.ts` into the same project
- **Do not** import [race-car-21](https://github.com/KIMHUSKYRIDER/race-car-21) and this extension together
- Use the extension **or** pasted code — not both (fixes "redeclared" errors)

## Requires

[BitBot extension](https://makecode.microbit.org/pkg/4tronix/BitBot) by 4tronix (added automatically).

## License

MIT
