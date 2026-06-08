# MIGHTYELITERACE — BitBot Wonder

A MakeCode extension for **BBC micro:bit + 4tronix BitBot XL** that turns
the racer into an autonomous, competition-ready, classroom-friendly robot
with one-block start programs.

> **Made by Kim** — full source, no AI auto-pilot, no Scratch templates.
> Every block in `wonder*` is wrapping the elite racer engine in
> `wonderracer.ts` that runs predictive corner braking, sonar-line fusion,
> anti-interference and adaptive elite speed.

---

## Quick start

1. Open [makecode.microbit.org](https://makecode.microbit.org)
2. **Extensions** → paste this URL:
   `https://github.com/KIMHUSKYRIDER/MIGHTYELITERACE`
3. **Blocks**: drag **Wonderpro → ULTIMATE racer** under **on start**
4. **Download** → flash → put car on the line → wait for 3-2-1 → GO

### One line of code does it all

```typescript
wonderpro.ultimateRacer(BBRobotDirection.Left, 5)
```

This activates: lap timer LED, auto motor-bias learning during 3-2-1,
U18 race profile, sonar-line fusion, saved tune, scheduled turbo zone
on the long straight, music, arena scoring.

---

## What's inside (12 categories, ~150 blocks)

| Toolbox | Color | For |
|---------|-------|-----|
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

### Race day
```typescript
wonderpro.ultimateRacer(BBRobotDirection.Left, 5)
```

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
wonderracer.ts        Engine (~1100 lines, auto-generated from competition source)
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
