# Changelog

All notable changes to the **MIGHTYELITERACE / bitbot-wonder** extension.

Versioning: `MAJOR.MINOR.PATCH` where MAJOR is a feature era, MINOR adds blocks/groups, PATCH is a bug-fix.

---

## v5.2.1 — Open source
- Added [`LICENSE`](LICENSE) (MIT) — free to use, modify, redistribute
- Added [`CONTRIBUTING.md`](CONTRIBUTING.md) — how to add new Wonder blocks
- Release folder now includes `dev/` with `build-extension.mjs`, `validate.mjs`, `gen-docs.mjs`, and the source `bitbot-xl-competition.ts` so anyone can fork & build
- README badges + open-source signaling + clear install / develop sections

## v5.2.0 — Documentation & validation
- Added auto-generated `BLOCKS.md` reference (regenerated on every build)
- Added `validate.mjs` build-time sanity checker:
  - Detects duplicate `//% block=` names
  - Verifies every `wonderracer.X(...)` call has a matching `export function X`
  - Flags unsupported Font Awesome icon codes
  - Catches stray references to removed functions
- Added this `CHANGELOG.md`
- Build pipeline now: rebuild → validate → gen-docs → sync release

## v5.1.2 — Bugfix
- Fixed `led.plotBrightness` arg count error (it needs 3 args, was called with 1)
- Replaced with `led.setBrightness` which correctly takes 1 arg
- All Wonder builtin blocks now compile to HEX cleanly

## v5.1.1 — Hotfix
- Removed `settings` dependency from `pxt.json` (was breaking HEX flash on micro:bit V1 and some V2 builds)
- Persistent best-lap is now RAM-only (kept while powered on, lost on reset)
- Updated `wondersave` block labels to reflect new behavior

## v5.1.0 — Pick your BitBot
- **Wondermodels** namespace: select Classic / XL / PRO / Auto-detect
- Per-model engine auto-tuning (Classic 75% softer PID, PRO 110% more aggressive)
- Per-model one-block starters: `startXl` / `startClassic` / `startPro` / `startAuto`
- **Wondertracks** namespace: short / long / obstacle / time-trial / beginner presets
- **Wondersave** namespace: PB tracking + celebration animation
- 5 new music jingles: Mario Coin, Star Wars, Tetris, Pirates, Final Countdown

## v5.0.0 — The Racing Edge
- **Wonderelite** namespace with 6 v5 features:
  - **Ghost Lap**: real-time delta vs your best lap
  - **Corner Memory**: learn corner positions on slow lap, replay with pre-braking on race lap
  - **Auto-Tune**: tries 3 speeds, automatically picks the fastest stable
  - **Pre-flight Check**: validates sensors and motors before race
  - **Race Coach**: post-race feedback (bias, pace, obstacles)
  - **Personal Best**: tracks best time + top speed
- `bootBannerV5()` and `liveSpeedometer()` polish blocks
- `ultimateV5(dir, amount)` one-block ultimate racer
- `learnThenRace(dir, amount)` learn-lap + race in one block

## v4.4.0 — Wonder Built-ins
- Wrappers for MakeCode core blocks under `wonderbasic`, `wonderinput`, `wonderled`, `wondersound`, `wonderlogic`, `wondermath`, `wonderradio`
- `wonderbitbot` wrappers for raw BitBot commands
- `wondercontrol` for event hooks
- `wonderpro` one-block decathlon and ultimate racer
- `wonderstats` for run statistics readouts

## v4.3.0 — Loops & themes
- **Wonderloops**: loop-friendly mini follow steps for use inside `forever`
- **Wondermusic**: race-start, victory, top-score, countdown, stop, power-up jingles
- **Wonderextras**: lap timer LED, auto bias learn, turbo zone, post-run report, track presets
- Norwegian block labels via teacher namespace

## v4.2.0 — Teacher mode
- **Wonderteacher** lesson blocks (lesson1FirstRobot, lesson2TestHardware … lesson6LineMaze)
- Wizard setup with auto bias learn during 3-2-1 countdown
- Classroom remote stop via radio
- Mini-follow forever-friendly PID step

## v4.1.0 — Arena and Pro
- **Wonderarena**: forecasted lap finish, weighted obstacle scoring, figure-8 / zigzag demo
- **Wonderpro**: one-block start for practice, race, and ultimate combinations
- Anti-interference radio sweep
- Sonar fusion veto and predictive corner braking

## v4.0.0 — Refactor
- Split monolithic extension into per-category block files
- Build pipeline (`build-extension.mjs`) auto-generates `wonderracer.ts` API wrapper
- Adaptive elite speed and state-machine driver

## v3.x and earlier — Single-file prototype
- Original PID line follower with sonar obstacle stop
- Hard-coded XL model only
- No build script, single `bitbot-xl-competition.ts` file
