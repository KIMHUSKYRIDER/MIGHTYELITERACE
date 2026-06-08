# MIGHTYELITERACE — BitBot Wonder  ·  v5.1

A MakeCode extension for **BBC micro:bit + 4tronix BitBot Classic / XL / PRO**
that turns the racer into an autonomous, competition-ready,
classroom-friendly robot with one-block start programs.

## What's new in v5.1 — "Pick your BitBot"

- **All three BitBot models**: Classic, XL, PRO (plus Auto-detect)
  — engine auto-tunes PID, base speed and elite speed per model
- **Track-type presets**: short / long / obstacle / time-trial / beginner
  — each retunes the racer for that style of track in one block
- **Persistent best lap** — uses micro:bit V2 flash so your PB survives
  power-off and reset
- **Auto-celebrate** — animation + Mario-coin / Star Wars / Tetris /
  Pirates / Final Countdown jingle when you beat your PB

> **Made by Kim** — full source, no AI auto-pilot, no Scratch templates.
> Every block in `wonder*` is wrapping the elite racer engine in
> `wonderracer.ts` that runs predictive corner braking, sonar-line fusion,
> anti-interference and adaptive elite speed.

## What's new in v5.0 — "The Racing Edge"

Features built specifically to **beat the class**:

- **Ghost Lap** — race against your own best lap, arrow up = faster, down = slower
- **Corner Memory** — drive one slow practice lap, robot learns every corner, then pre-brakes on race lap
- **Auto-Tune** — robot tests 3 speeds for itself and picks the fastest one that doesn't lose the line
- **Pre-flight Check** — verifies sonar + both line sensors + motors, gives GO or letter codes (S/L/R) for what's broken
- **Race Coach** — after the run, tells you what to fix: `BIAS R 4`, `SLOW`, `FASTER`, `PACE OK`
- **Personal Best** — remembers fastest valid run and top speed across the session
- **Speedometer** — live speed % on the LED
- **Boot Banner** — "WONDER v5" intro animation
- **`WONDER V5` one-block** — pre-flight + race profile + tune + music + corner replay + lap LED in a single block

---

## Quick start

1. Open [makecode.microbit.org](https://makecode.microbit.org)
2. **Extensions** → paste this URL:
   `https://github.com/KIMHUSKYRIDER/MIGHTYELITERACE`
3. **Blocks**: drag **Wonderelite → WONDER V5 ultimate racer** under **on start**
4. **Download** → flash → put car on the line → wait for 3-2-1 → GO

### One line of code does it all (v5)

```typescript
wonderelite.ultimateV5(BBRobotDirection.Left, 5)
```

This runs pre-flight, then activates: lap timer LED, auto motor-bias learning
during 3-2-1, U18 race profile, sonar-line fusion, saved tune, scheduled turbo
zone, music, learned corner pre-braking (if you ran a learn lap first), arena
scoring.

### Two-stage learn-then-race (the killer combo)

```typescript
wonderelite.learnThenRace(BBRobotDirection.Left, 5)
```

Drives one 25-second slow lap memorizing where every corner is, then immediately
starts the v5 race using those learned corner times to pre-brake. **No one else
in your class will have this.**

---

## What's inside (16 categories, ~220 blocks)

| Toolbox | Color | For |
|---------|-------|-----|
| **Wonderelite** | rose | v5 racing edge: Ghost Lap, Corner Memory, Auto-Tune, Pre-flight, Coach, PB |
| **Wondermodels** | emerald | **v5.1**: pick Classic / XL / PRO / Auto + per-model race starters |
| **Wondertracks** | teal | **v5.1**: short / long / obstacle / time-trial / beginner presets |
| **Wondersave** | sky blue | **v5.1**: persistent PB + Mario/Tetris/Star Wars/Pirates jingles |
| **Wonderpro** | red | One-block ultimate programs (`ultimateRacer`, `loopsChampion`, `decathlon`) |
| **Wonder** | purple | Elite racer setup, speed, PID, profiles |
| **Wonderextras** | crimson | Race win, practice + tune, lap timer, turbo zone |
| **Wonderarena** | brown | Class challenges & scoring (`classKing`, `precisionPark`, `reactionStop`) |
| **Wonderteacher** | teal | Classroom lessons + Norwegian labels |
| **Wonderloops** | blue | Smart `forever` loop bodies (smartFollow, followOrSearch) |
| **Wondermusic** | violet | Race jingles + custom melodies |
| **Wonderstats** | slate | Dashboard, history, arena score |
| **Wonderbitbot** | cyan | BitBot motors & sensors with Wonder names |
| **Wondercontrol** | gray | Background tasks |
| **Wonderbasic / input / led / sound / logic / math / radio** | various | Wonder mirrors of built-in MakeCode blocks |

---

## The racer engine (`wonderracer.ts`)

The full autonomous racer runs in a single forever loop with a state machine:

```
FollowLine ──obstacle──► ObstacleStop ──clear──► GapRecover ──no line──► SearchPivot
     ▲                                                                       │
     └──────────────────── line confirmed ──────────────────────────────────┘
```

Features layered on top:

- **PID line follow** with dual gain (calm on straights, sharp on turns)
- **Predictive corner braking** — slows *before* line loss using error
  acceleration + derivative
- **Adaptive elite speed** — boosts to 82–88% only when sensor quality,
  confidence and straight-loop counters all agree
- **Sonar-line fusion** — vetoes phantom sonar hits on confirmed line
- **Anti-interference** — kills micro:bit radio on the car; majority-vote
  line sampling resists IR / electrical glitches
- **Auto motor-bias learning** — samples the start line during 3-2-1 and
  applies a learned `BBBias` at GO
- **In-memory tune slots** — slow / medium / race (saved with A+B in
  practice mode)
- **Live tuning** — A=+speed, B=-speed without reflashing
- **Lap timer + arena scoring** + post-run report on shake

---

## Programs for different days

### Race day — v5.1 winning combo (recommended)
```typescript
wondersave.enablePersistent()    // PB survives reset
wondermodels.useXl()             // or useClassic / usePro / useAuto
wondertracks.longRace(BBRobotDirection.Left, 5)
```
PB stored in flash, model auto-tuned, track style applied, race starts. Three blocks.

### Race day — single-block ultimate
```typescript
wonderelite.learnThenRace(BBRobotDirection.Left, 5)
```
One block. Runs pre-flight, drives a 25-sec slow learn lap to memorize corners,
then immediately starts the v5 race using corner pre-braking.

### Race day — fast and simple
```typescript
wonderelite.ultimateV5(BBRobotDirection.Left, 5)
```
Pre-flight + race profile + tune + music + lap LED. No learn lap needed.

### Auto-tune session (figure out best speed for THIS track)
```typescript
wonderelite.autoTune(BBRobotDirection.Left, 5)
```
Robot tests 3 speeds for 8 sec each, picks the fastest one that didn't lose
the line, then sets `NORMAL_BASE_SPEED` for the next race.

### Post-race review
```typescript
wonderelite.coach()           // BIAS R 4 / SLOW / FASTER / PACE OK
wonderelite.showPb()          // Personal best time + top speed
```

### Teacher demo
```typescript
wonderteacher.startTeacherDemo(BBRobotDirection.Left, 5)
```
Slow safe wizard, music on, full 3-2-1.

### Beat classmates' `forever` loops
```typescript
wonderpro.loopsChampion(BBRobotDirection.Left, 5)
```
Same `forever` structure they use, but with PID follow + sonar inside.

### Win the whole class on points
```typescript
wonderpro.classKing(BBRobotDirection.Left, 5)
```

### Three events in one program
```typescript
wonderpro.decathlon(BBRobotDirection.Left, 5)
```

---

## Buttons during a run

| Input | Action |
|-------|--------|
| **B** | Emergency stop (or `-speed` in live tune) |
| **A** | Show speed → max → interference (or `+speed` in live tune) |
| **A+B** | Soft reset + lap timer reset (saves tune in practice mode) |
| **Logo** | Show confidence |
| **Shake** | Post-run report — time, max speed, obstacles, line losses (or arena PTS/BST) |

---

## File layout

```
wonderracer.ts        Engine (~1300 lines, auto-generated from competition source)
wonder-elite.ts       v5 racing edge (Ghost, Corner Memory, Auto-Tune, Coach, PB)
wonder.ts             Elite racer tuning
wonder-pro.ts         One-block ultimate programs
wonder-extras.ts      Race / practice / tune / lap
wonder-arena.ts       Class challenges + points
wonder-teacher.ts     Classroom lessons (Norwegian)
wonder-loops.ts       Smart løkker
wonder-music.ts       Jingles
wonder-stats.ts       Dashboard
wonder-bitbot.ts      BitBot wrappers
wonder-control.ts     Background tasks
wonder-builtins.ts    Wonder mirrors of basic/input/led/etc.
pxt.json              Extension manifest
```

---

## For the teacher

This is not a one-block toy. The same student program that fits on one
line (`wonderpro.ultimateRacer(Left, 5)`) is calling into ~1100 lines of
hand-written control code: state machine, PID, sensor fusion,
anti-interference, scheduling. The Wonder layer hides all that behind
classroom-safe blocks so younger kids can use it too — but it's there if
you open the JavaScript tab.

**Dependency:** `bitbot` by 4tronix — only used for raw motor and sensor
access. Every higher-level behaviour (line follow, obstacle handling,
race start, scoring, music) is implemented in this repo.

---

## License

MIT.
