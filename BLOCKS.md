# BLOCKS.md — auto-generated API reference

_Auto-generated from `wonder-*.ts` source files. Do not edit by hand — run `node build-extension.mjs` to regenerate._

**21 namespaces · 283 blocks**

## Table of contents

- [wonder](#wonder) (54 blocks)
- [wonderteacher](#wonderteacher) (46 blocks)
- [wonderextras](#wonderextras) (26 blocks)
- [wonderarena](#wonderarena) (9 blocks)
- [wondermusic](#wondermusic) (6 blocks)
- [wonderloops](#wonderloops) (14 blocks)
- [wonderbasic](#wonderbasic) (8 blocks)
- [wonderinput](#wonderinput) (9 blocks)
- [wonderled](#wonderled) (7 blocks)
- [wondersound](#wondersound) (5 blocks)
- [wonderlogic](#wonderlogic) (5 blocks)
- [wondermath](#wondermath) (7 blocks)
- [wonderradio](#wonderradio) (7 blocks)
- [wonderbitbot](#wonderbitbot) (7 blocks)
- [wonderpro](#wonderpro) (4 blocks)
- [wonderstats](#wonderstats) (11 blocks)
- [wondercontrol](#wondercontrol) (3 blocks)
- [wonderelite](#wonderelite) (25 blocks)
- [wondermodels](#wondermodels) (10 blocks)
- [wondertracks](#wondertracks) (10 blocks)
- [wondersave](#wondersave) (10 blocks)

---

## wonder

_From `wonder.ts`_

### Setup

- **Wonder select model %model** — `wonder.selectModel(model: BBModel)`
  - Pick BitBot model before starting the race.
- **Wonder prepare racer|model %model|bias $dir by $amount** — `wonder.prepareRacer(model: BBModel, dir: BBRobotDirection, amount: number)`
  - Calibrate left/right motor balance (run before start).
- **Wonder disable radio (crowded hall)** — `wonder.disableRadio()`
- **Wonder tuning preset %preset** — `wonder.tuningPreset(preset: WonderTuning)`
- **Wonder race profile %profile** — `wonder.raceProfile(profile: WonderRaceProfile)`

### Speed

- **Wonder set base speed %speed** — `wonder.setBaseSpeed(speed: number)`
- **Wonder set elite speed %speed** — `wonder.setEliteSpeed(speed: number)`
- **Wonder set min speed %speed** — `wonder.setMinSpeed(speed: number)`
- **Wonder force speed %speed|0=off use adaptive** — `wonder.forceSpeed(speed: number)`
- **Wonder bypass adaptive speed %on** — `wonder.bypassAdaptiveSpeed(on: boolean)`
- **Wonder use normal adaptive speed** — `wonder.useAdaptiveSpeed()`
- **Wonder set PID straight|Kp %kp|Kd %kd** — `wonder.setPidStraight(kp: number, kd: number)`
- **Wonder set PID turn|Kp %kp|Kd %kd** — `wonder.setPidTurn(kp: number, kd: number)`

### Obstacles

- **Wonder set obstacle|stop at %onCm cm|clear at %offCm cm** — `wonder.setObstacle(onCm: number, offCm: number)`

### Race

- **Wonder start countdown %seconds sec** — `wonder.setCountdown(seconds: number)`
- **Wonder start elite racer|bias $dir by $amount** — `wonder.startEliteRacer(dir: BBRobotDirection, amount: number)`
  - Start the full autonomous elite racer (countdown, buttons, forever loop).
- **Wonder MIGHTY start|profile %profile|bias $dir by $amount** — `wonder.startMightyRacer(profile: WonderRaceProfile, dir: BBRobotDirection, amount: number)`
  - One block: XL model, race profile, countdown, full autonomous racer.
- **Wonder emergency stop** — `wonder.emergencyStop()`
- **Wonder soft reset race** — `wonder.softReset()`

### Advanced

- **Wonder set corner brake max %pct** — `wonder.setCornerBrake(pct: number)`
- **Wonder set gap recover %ms ms** — `wonder.setGapRecover(ms: number)`
- **Wonder set gap speed %speed** — `wonder.setGapSpeed(speed: number)`
- **Wonder set search speed %speed** — `wonder.setSearchSpeed(speed: number)`
- **Wonder set search timeout %ms ms** — `wonder.setSearchTimeout(ms: number)`
- **Wonder set line loss limit %count** — `wonder.setLineLossLimit(count: number)`
- **Wonder set elite straight loops %loops** — `wonder.setEliteStraightLoops(loops: number)`
- **Wonder sonar fusion veto %on** — `wonder.setSonarFusionVeto(on: boolean)`

### Sensors

- **Wonder sonar instant mode %on** — `wonder.sonarInstantMode(on: boolean)`
- **Wonder read sonar now (cm)** — `wonder.sonarNow()` → `number`
- **Wonder scan sensors** — `wonder.scanSensors()`
- **Wonder line position** — `wonder.linePosition()` → `number`
- **Wonder sonar distance (cm)** — `wonder.sonarDistance()` → `number`
- **Wonder line sensor quality** — `wonder.lineQuality()` → `number`
- **Wonder sonar quality** — `wonder.sonarQuality()` → `number`
- **Wonder interference level** — `wonder.interference()` → `number`

### Status

- **Wonder confidence** — `wonder.confidence()` → `number`
- **Wonder obstacle count** — `wonder.obstacleCount()` → `number`
- **Wonder max speed reached** — `wonder.maxSpeed()` → `number`
- **Wonder current speed** — `wonder.currentSpeed()` → `number`
- **Wonder speed override active** — `wonder.speedOverrideActive()` → `number`
- **Wonder bypass adaptive on** — `wonder.bypassAdaptiveOn()` → `boolean`
- **Wonder show speed on LED** — `wonder.showSpeedOnLed()`
- **Wonder elite mode active** — `wonder.eliteMode()` → `boolean`
- **Wonder racer running** — `wonder.isRunning()` → `boolean`
- **Wonder line left on** — `wonder.lineLeftOn()` → `boolean`
- **Wonder line right on** — `wonder.lineRightOn()` → `boolean`
- **Wonder line seen** — `wonder.lineSeen()` → `boolean`
- **Wonder line confirmed** — `wonder.lineConfirmed()` → `boolean`
- **Wonder at obstacle** — `wonder.atObstacle()` → `boolean`
- **Wonder searching for line** — `wonder.searching()` → `boolean`
- **Wonder drive state is %state** — `wonder.driveStateIs(state: WonderDriveState)` → `boolean`
- **Wonder line losses** — `wonder.lineLosses()` → `number`
- **Wonder run time (sec)** — `wonder.runTimeSec()` → `number`
- **Wonder approaching obstacle** — `wonder.approachingObstacle()` → `boolean`


## wonderteacher

_From `wonder-teacher.ts`_

### Start

- **TEACHER DEMO start|balance $dir by $amount** — `wonderteacher.startTeacherDemo(dir: BBRobotDirection, amount: number)`
  - Wonder Teacher — simple blocks for classrooms (plain English)
- **klar for klasserom|balanse $dir med $amount** — `wonderteacher.classroomReady(dir: BBRobotDirection, amount: number)`
- **start øvelses robot|balanse $dir med $amount** — `wonderteacher.startPractice(dir: BBRobotDirection, amount: number)`
- **start løp robot|balanse $dir med $amount** — `wonderteacher.startRace(dir: BBRobotDirection, amount: number)`
- **enkel start|fart %pace|balanse $dir med $amount** — `wonderteacher.easyStart(pace: WonderPace, dir: BBRobotDirection, amount: number)`
- **countdown 3 2 1 only** — `wonderteacher.countdown()`
- **stopp robot** — `wonderteacher.stopRobot()`
- **nullstill robot** — `wonderteacher.resetRobot()`
- **setup BitBot XL|bias $dir by $amount** — `wonderteacher.setupRobot(dir: BBRobotDirection, amount: number)`

### Sonar

- **sonar instant mode on** — `wonderteacher.sonarInstantOn()`
- **sonar instant mode off** — `wonderteacher.sonarInstantOff()`
- **read distance now (cm)** — `wonderteacher.distanceNow()` → `number`
- **object closer than %cm cm** — `wonderteacher.closerThan(cm: number)` → `boolean`
- **wait until closer than %cm cm|timeout %ms ms** — `wonderteacher.waitUntilCloser(cm: number, ms: number)` → `boolean`

### Drive

- **set robot slow** — `wonderteacher.robotSlow()`
- **set robot medium speed** — `wonderteacher.robotMedium()`
- **set robot fast** — `wonderteacher.robotFast()`
- **drive straight|speed %speed|for %ms ms** — `wonderteacher.driveStraight(speed: number, ms: number)`
- **drive back|speed %speed|for %ms ms** — `wonderteacher.driveBack(speed: number, ms: number)`
- **turn left|speed %speed|for %ms ms** — `wonderteacher.turnLeft(speed: number, ms: number)`
- **turn right|speed %speed|for %ms ms** — `wonderteacher.turnRight(speed: number, ms: number)`

### Test

- **run all classroom tests** — `wonderteacher.runAllTests()`
- **test motors (short forward)** — `wonderteacher.testMotors()`
- **test line sensors on LED** — `wonderteacher.testLineSensors()`
- **test sonar distance on LED** — `wonderteacher.testSonar()`
- **show line and distance on LED** — `wonderteacher.showSensors()`
- **show speed on LED** — `wonderteacher.showSpeed()`

### Read

- **line on left sensor** — `wonderteacher.lineOnLeft()` → `boolean`
- **line on right sensor** — `wonderteacher.lineOnRight()` → `boolean`
- **line found** — `wonderteacher.lineFound()` → `boolean`
- **wait until line found|timeout %ms ms** — `wonderteacher.waitForLine(ms: number)` → `boolean`
- **obstacle ahead** — `wonderteacher.obstacleAhead()` → `boolean`
- **distance in cm** — `wonderteacher.distanceCm()` → `number`
- **robot speed now** — `wonderteacher.speedNow()` → `number`
- **max speed this run** — `wonderteacher.maxSpeed()` → `number`

### Lesson

- **lesson 1 first robot|bias $dir by $amount** — `wonderteacher.lesson1FirstRobot(dir: BBRobotDirection, amount: number)`
- **lesson 2 test hardware|bias $dir by $amount** — `wonderteacher.lesson2TestHardware(dir: BBRobotDirection, amount: number)`
- **lesson 3 sonar stop|stop if closer than %cm cm|bias $dir by $amount** — `wonderteacher.lesson3SonarStop(cm: number, dir: BBRobotDirection, amount: number)`
- **leksjon 4 følg linje 30 sek|balanse $dir med $amount** — `wonderteacher.lesson4Follow30(dir: BBRobotDirection, amount: number)`
- **leksjon 5 hinderbane|balanse $dir med $amount** — `wonderteacher.lesson5ObstacleCourse(dir: BBRobotDirection, amount: number)`
- **leksjon 6 linjelabyrint intro|balanse $dir med $amount** — `wonderteacher.lesson6LineMaze(dir: BBRobotDirection, amount: number)`

### Wizard

- **veiviser oppsett|fart %pace|balanse $dir med $amount** — `wonderteacher.wizardSetup(pace: WonderPace, dir: BBRobotDirection, amount: number)`
- **mini følg linje steg|fart %speed** — `wonderteacher.miniFollowStep(speed: number)`
- **mini følg linje i %ms ms|fart %speed** — `wonderteacher.miniFollowFor(speed: number, ms: number)`
- **lytt etter stopp fra lærer|gruppe %group** — `wonderteacher.listenTeacherStop(group: number)`
- **fjernkontroll send stopp|gruppe %group** — `wonderteacher.remoteSendStop(group: number)`


## wonderextras

_From `wonder-extras.ts`_

### Race

- **RACE WIN start|balance $dir by $amount** — `wonderextras.startRaceWin(dir: BBRobotDirection, amount: number)`
  - Wonder Extras — competition, debug, and demo blocks (v4)
- **RACE practice tune|balance $dir by $amount|A up B down A+B save** — `wonderextras.startRacePractice(dir: BBRobotDirection, amount: number)`

### Lap

- **lap timer LED on** — `wonderextras.lapTimerLedOn()`
- **lap timer LED off** — `wonderextras.lapTimerLedOff()`
- **show lap seconds on LED** — `wonderextras.showLapTime()`
- **reset lap timer** — `wonderextras.resetLap()`
- **auto bias learn on** — `wonderextras.autoBiasOn()`
- **auto bias learn off** — `wonderextras.autoBiasOff()`

### Tune

- **save tune %slot** — `wonderextras.saveTune(slot: WonderTuneSlot)`
- **load tune %slot** — `wonderextras.loadTune(slot: WonderTuneSlot)`

### Turbo

- **turbo zone elite speed for %ms ms** — `wonderextras.turboZone(ms: number)`
- **turbo on straight at %startMs ms after GO for %durationMs ms** — `wonderextras.turboAtRaceMs(startMs: number, durationMs: number)`

### Report

- **show post-run report (shake also)** — `wonderextras.postRunReport()`
- **last run max speed** — `wonderextras.lastRunMaxSpeed()` → `number`
- **compare max speed (this minus last)** — `wonderextras.compareMaxSpeed()` → `number`
- **show compare runs on LED** — `wonderextras.showCompareRuns()`
- **obstacle score** — `wonderextras.obstacleScore()` → `number`

### Debug

- **live tune on A+B speed (A up B down)** — `wonderextras.liveTuneOn()`
- **live tune off (A speed B stop)** — `wonderextras.liveTuneOff()`
- **drive state letters on LED (F O G S)** — `wonderextras.driveStateLedOn()`
- **drive state letters off** — `wonderextras.driveStateLedOff()`
- **show drive state letter now** — `wonderextras.showDriveState()`
- **graph confidence bar on LED** — `wonderextras.graphConfidence()`

### Demo

- **demo figure-8 drive** — `wonderextras.figure8()`
- **demo zigzag drive** — `wonderextras.zigzag()`
- **reverse line follow %speed for %ms ms** — `wonderextras.reverseFollow(speed: number, ms: number)`


## wonderarena

_From `wonder-arena.ts`_

### King

- **CLASS KING mode|balance $dir by $amount|shake = points** — `wonderarena.classKing(dir: BBRobotDirection, amount: number)`
  - Wonder Arena — beat the class (more than lap racing) Points, precision, reaction, maze, obstacle scoring

### Challenges

- **challenge obstacle points|balance $dir by $amount** — `wonderarena.obstaclePoints(dir: BBRobotDirection, amount: number)`
- **challenge precision park at %cm cm|balance $dir by $amount** — `wonderarena.precisionPark(cm: number, dir: BBRobotDirection, amount: number)`
- **challenge maze sprint 60s|balance $dir by $amount** — `wonderarena.mazeSprint(dir: BBRobotDirection, amount: number)`
- **challenge reaction stop|balance $dir by $amount** — `wonderarena.reactionStop(dir: BBRobotDirection, amount: number)`
- **challenge speed trial|balance $dir by $amount|shake = score** — `wonderarena.speedTrial(dir: BBRobotDirection, amount: number)`

### Score

- **show arena score on LED** — `wonderarena.showScore()`
- **arena points this run** — `wonderarena.pointsThisRun()` → `number`
- **arena best score** — `wonderarena.bestScore()` → `number`


## wondermusic

_From `wonder-music.ts`_

### Race

- **race music on** — `wondermusic.musicOn()`
  - Wonder Music — race jingles and custom melodies Note: micro:bit cannot play YouTube or URLs — use melody text instead.
- **race music off** — `wondermusic.musicOff()`

### Play

- **play music %preset** — `wondermusic.playPreset(preset: WonderMusicPreset)`
- **play race start fanfare** — `wondermusic.raceStart()`
- **play victory jingle** — `wondermusic.victory()`

### Custom

- **play melody %melody|tempo %bpm** — `wondermusic.playMelody(melody: string, bpm: number)`
  - Paste melody notes from MakeCode Music editor (not YouTube URLs). Example: "c5 d5 e5 c5 d5 e5 c5"


## wonderloops

_From `wonder-loops.ts`_

### Setup

- **løkke oppsett|balanse $dir med $amount** — `wonderloops.setup(dir: BBRobotDirection, amount: number)`
  - Wonder Loops (løkker) — beat classmates' forever loops with smarter steps
- **vent 10 ms (bruk i løkke)** — `wonderloops.waitTick()`

### Loop body

- **løkke smart følg|fart %speed|stopp hvis nærmere enn %cm cm** — `wonderloops.smartFollow(speed: number, cm: number)`
- **løkke følg linje ett steg|fart %speed** — `wonderloops.followStep(speed: number)`
- **løkke følg eller søk linje|fart %speed** — `wonderloops.followOrSearch(speed: number)`
- **løkke følg og vis confidence|fart %speed** — `wonderloops.followShowConfidence(speed: number)`

### Read in loop

- **linje funnet** — `wonderloops.lineFound()` → `boolean`
- **linje til venstre** — `wonderloops.lineLeft()` → `boolean`
- **linje til høyre** — `wonderloops.lineRight()` → `boolean`
- **hinder nærmere enn %cm cm** — `wonderloops.closerThan(cm: number)` → `boolean`
- **avstand cm** — `wonderloops.distanceCm()` → `number`
- **stop loop robot** — `wonderloops.stop()`
- **kjør frem %speed i %ms ms** — `wonderloops.driveMs(speed: number, ms: number)`
- **sving venstre %speed i %ms ms** — `wonderloops.turnLeftMs(speed: number, ms: number)`


## wonderbasic

_From `wonder-builtins.ts`_

### Show

- **Wonder show number %n** — `wonderbasic.showNumber(n: number)`
  - Wonder Built-ins — Wonder versions of MakeCode micro:bit blocks Use these instead of Basic / Input / Led when teaching with Wonder.
- **Wonder show string %s** — `wonderbasic.showString(s: string)`
- **Wonder show icon %icon** — `wonderbasic.showIcon(icon: IconNames)`
- **Wonder show arrow %arrow** — `wonderbasic.showArrow(arrow: ArrowNames)`
- **Wonder clear screen** — `wonderbasic.clearScreen()`
- **Wonder show leds %leds** — `wonderbasic.showLeds(leds: string)`

### Pause

- **Wonder pause (ms) %ms** — `wonderbasic.pause(ms: number)`

### Loop

- **Wonder forever** — `wonderbasic.forever(handler: ()`


## wonderinput

_From `wonder-builtins.ts`_

### Buttons

- **Wonder on button %button pressed** — `wonderinput.onButtonPressed(button: Button, handler: ()`
- **Wonder button %button is pressed** — `wonderinput.buttonIsPressed(button: Button)` → `boolean`

### Gesture

- **Wonder on gesture %gesture** — `wonderinput.onGesture(gesture: Gesture, handler: ()`

### Logo

- **Wonder on logo pressed** — `wonderinput.onLogoPressed(handler: ()`
- **Wonder on logo released** — `wonderinput.onLogoReleased(handler: ()`

### Read

- **Wonder running time (ms)** — `wonderinput.runningTime()` → `number`
- **Wonder acceleration (mg) %dimension** — `wonderinput.acceleration(dimension: Dimension)` → `number`
- **Wonder light level** — `wonderinput.lightLevel()` → `number`
- **Wonder temperature (C)** — `wonderinput.temperature()` → `number`


## wonderled

_From `wonder-builtins.ts`_

### Plot

- **Wonder plot x %x y %y** — `wonderled.plot(x: number, y: number)`
- **Wonder unplot x %x y %y** — `wonderled.unplot(x: number, y: number)`
- **Wonder toggle x %x y %y** — `wonderled.toggle(x: number, y: number)`
- **Wonder point %x %y is on** — `wonderled.pointOn(x: number, y: number)` → `boolean`
- **Wonder plot bar graph %value up to %high** — `wonderled.plotBarGraph(value: number, high: number)`
- **Wonder set LED brightness %value** — `wonderled.setBrightness(value: number)`

### Control

- **Wonder LED enable %on** — `wonderled.enable(on: boolean)`


## wondersound

_From `wonder-builtins.ts`_

### Play

- **Wonder play tone %note for %beat beats** — `wondersound.playTone(note: number, beat: number)`
- **Wonder play melody %melody|tempo %bpm** — `wondersound.playMelody(melody: string, bpm: number)`
- **Wonder rest %ms ms** — `wondersound.rest(ms: number)`
- **Wonder stop all sounds** — `wondersound.stopAllSounds()`

### Beat

- **Wonder beat %fraction** — `wondersound.beat(fraction: BeatFraction)` → `number`


## wonderlogic

_From `wonder-builtins.ts`_

### (default)

- **Wonder if %cond then** — `wonderlogic.ifThen(cond: boolean, handler: ()`
- **Wonder if %cond then else** — `wonderlogic.ifThenElse(cond: boolean, thenHandler: ()`
- **Wonder not %bool** — `wonderlogic.not(bool: boolean)` → `boolean`
- **Wonder true** — `wonderlogic.trueBool()` → `boolean`
- **Wonder false** — `wonderlogic.falseBool()` → `boolean`


## wondermath

_From `wonder-builtins.ts`_

### (default)

- **Wonder pick random 0 to %limit** — `wondermath.random(limit: number)` → `number`
- **Wonder pick random %min to %max** — `wondermath.randomRange(min: number, max: number)` → `number`
- **Wonder min of %a and %b** — `wondermath.min(a: number, b: number)` → `number`
- **Wonder max of %a and %b** — `wondermath.max(a: number, b: number)` → `number`
- **Wonder absolute of %n** — `wondermath.abs(n: number)` → `number`
- **Wonder square root of %n** — `wondermath.sqrt(n: number)` → `number`
- **Wonder constrain %value between %low and %high** — `wondermath.constrain(value: number, low: number, high: number)` → `number`


## wonderradio

_From `wonder-builtins.ts`_

### Setup

- **Wonder radio on group %group** — `wonderradio.setGroup(group: number)`
- **Wonder radio off** — `wonderradio.off()`

### Send

- **Wonder radio send number %value** — `wonderradio.sendNumber(value: number)`
- **Wonder radio send string %msg** — `wonderradio.sendString(msg: string)`

### Receive

- **Wonder on radio received** — `wonderradio.onReceived(handler: ()`
- **Wonder received number** — `wonderradio.receivedNumber()` → `number`
- **Wonder received string** — `wonderradio.receivedString()` → `string`


## wonderbitbot

_From `wonder-bitbot.ts`_

### Setup

- **Wonder BitBot XL selected** — `wonderbitbot.selectXl()`
  - Wonder BitBot — BitBot blocks with Wonder labels (no raw bitbot namespace)
- **Wonder motor balance $dir by $amount** — `wonderbitbot.motorBias(dir: BBRobotDirection, amount: number)`

### Drive

- **Wonder motors stop** — `wonderbitbot.stop()`
- **Wonder motors speed %speed** — `wonderbitbot.move(speed: number)`

### Sensors

- **Wonder line sensor left** — `wonderbitbot.lineLeft()` → `number`
- **Wonder line sensor right** — `wonderbitbot.lineRight()` → `number`
- **Wonder sonar cm** — `wonderbitbot.sonarCm()` → `number`


## wonderpro

_From `wonder-pro.ts`_

### Ultimate

- **ULTIMATE racer|balance $dir by $amount|music + lap + turbo + tune** — `wonderpro.ultimateRacer(dir: BBRobotDirection, amount: number)`
  - Wonder Pro — one-block ultimate programs
- **CLASS KING + music|balance $dir by $amount** — `wonderpro.classKing(dir: BBRobotDirection, amount: number)`

### Loops

- **LOOPS champion|balance $dir by $amount|smart forever loop** — `wonderpro.loopsChampion(dir: BBRobotDirection, amount: number)`

### Decathlon

- **DECATHLON 3 events|balance $dir by $amount|reaction + park + maze** — `wonderpro.decathlon(dir: BBRobotDirection, amount: number)`


## wonderstats

_From `wonder-stats.ts`_

### Dashboard

- **Wonder show full dashboard** — `wonderstats.showDashboard()`
  - Wonder Stats — dashboard and run history
- **Wonder max speed** — `wonderstats.maxSpeed()` → `number`
- **Wonder run time sec** — `wonderstats.runTimeSec()` → `number`
- **Wonder stats line losses** — `wonderstats.lineLosses()` → `number`
- **Wonder stats obstacle count** — `wonderstats.obstacles()` → `number`
- **Wonder stats confidence** — `wonderstats.confidence()` → `number`

### History

- **Wonder show run history (last 3 scores)** — `wonderstats.showHistory()`
- **Wonder history score %index ago** — `wonderstats.historyScore(index: number)` → `number`

### Arena

- **Wonder arena score now** — `wonderstats.arenaScore()` → `number`
- **Wonder arena best score** — `wonderstats.arenaBest()` → `number`
- **Wonder show arena score** — `wonderstats.showArenaScore()`


## wondercontrol

_From `wonder-control.ts`_

### System

- **Wonder run in background** — `wondercontrol.runInBackground(handler: ()`
  - Wonder Control — on start, background, reset
- **Wonder reset micro:bit** — `wondercontrol.reset()`
- **Wonder wait micros %us** — `wondercontrol.waitMicros(us: number)`


## wonderelite

_From `wonder-elite.ts`_

### Ultimate

- **WONDER V5 ultimate racer|balance $dir by $amount|pre-flight + corner replay + tune + music + lap LED** — `wonderelite.ultimateV5(dir: BBRobotDirection, amount: number)`
  - Wonder Elite v5 — the racing edge nobody else has Ghost Lap, Corner Memory, Auto-Tune, Pre-flight, Race Coach, Personal Best
- **LEARN lap then race|balance $dir by $amount|25s slow lap to learn corners** — `wonderelite.learnThenRace(dir: BBRobotDirection, amount: number)`

### Ghost lap

- **ghost lap start** — `wonderelite.ghostStart()`
- **ghost lap finish (show delta)** — `wonderelite.ghostFinish()`
- **best lap seconds** — `wonderelite.bestLap()` → `number`
- **last lap delta seconds (- is faster)** — `wonderelite.lastDelta()` → `number`
- **clear best lap** — `wonderelite.ghostClear()`

### Corner memory

- **learn corners ON (drive a practice lap)** — `wonderelite.learnCornersOn()`
- **learn corners OFF (save what we found)** — `wonderelite.learnCornersOff()`
- **replay learned corners ON (race lap)** — `wonderelite.replayOn()`
- **replay learned corners OFF** — `wonderelite.replayOff()`
- **corners memorized** — `wonderelite.cornersFound()` → `number`
- **clear corner memory** — `wonderelite.clearCorners()`
- **corner brake strength %pct percent of normal** — `wonderelite.brakeStrength(pct: number)`

### Auto-tune

- **AUTO-TUNE base speed|balance $dir by $amount|tries 3 speeds picks best** — `wonderelite.autoTune(dir: BBRobotDirection, amount: number)` → `number`

### Pre-flight

- **run pre-flight check** — `wonderelite.preflight()` → `string`
- **last pre-flight result** — `wonderelite.preflightResult()` → `string`
- **pre-flight passed (GO)** — `wonderelite.preflightOk()` → `boolean`

### Coach

- **race coach review (bias, pace, obstacles)** — `wonderelite.coach()`

### PB

- **show personal best (time + speed)** — `wonderelite.showPb()`
- **PB best seconds** — `wonderelite.pbSec()` → `number`
- **PB top speed** — `wonderelite.pbSpeed()` → `number`
- **clear personal best** — `wonderelite.clearPb()`

### Polish

- **WONDER v5 boot banner** — `wonderelite.bootBanner()`
- **live speedometer for %seconds seconds** — `wonderelite.speedo(seconds: number)`


## wondermodels

_From `wonder-models.ts`_

### Pick

- **use BitBot %model** — `wondermodels.useModel(model: BBModel)`
  - Wonder Models v5.1 — pick your BitBot (XL, Classic, PRO, Auto) Then use any Wonder racer block and it adapts to your hardware.
- **use BitBot XL** — `wondermodels.useXl()`
- **use BitBot Classic** — `wondermodels.useClassic()`
- **use BitBot PRO** — `wondermodels.usePro()`
- **use Auto-detect** — `wondermodels.useAuto()`

### Start

- **START race XL|balance $dir by $amount** — `wondermodels.startXl(dir: BBRobotDirection, amount: number)`
- **START race Classic|balance $dir by $amount** — `wondermodels.startClassic(dir: BBRobotDirection, amount: number)`
- **START race PRO|balance $dir by $amount** — `wondermodels.startPro(dir: BBRobotDirection, amount: number)`
- **START race Auto-detect|balance $dir by $amount** — `wondermodels.startAuto(dir: BBRobotDirection, amount: number)`

### Info

- **show detected model on LED** — `wondermodels.showDetected()`


## wondertracks

_From `wonder-tracks.ts`_

### Track type

- **use SHORT track (tight corners, low speed)** — `wondertracks.shortTrack()`
  - Wonder Tracks v5.1 — pick the track style and engine retunes automatically Call ONE of these before starting the racer.
- **use LONG track (high speed, gentle corners)** — `wondertracks.longTrack()`
- **use OBSTACLE track (more sonar focus)** — `wondertracks.obstacleTrack()`
- **use TIME TRIAL track (max speed, accept risk)** — `wondertracks.timeTrial()`
- **use BEGINNER track (slow safe)** — `wondertracks.beginner()`

### Bundle starts

- **SHORT track race|balance $dir by $amount** — `wondertracks.shortRace(dir: BBRobotDirection, amount: number)`
- **LONG track race|balance $dir by $amount** — `wondertracks.longRace(dir: BBRobotDirection, amount: number)`
- **OBSTACLE track race|balance $dir by $amount** — `wondertracks.obstacleRace(dir: BBRobotDirection, amount: number)`
- **TIME TRIAL race|balance $dir by $amount** — `wondertracks.timeTrialRace(dir: BBRobotDirection, amount: number)`
- **BEGINNER race|balance $dir by $amount** — `wondertracks.beginnerRace(dir: BBRobotDirection, amount: number)`


## wondersave

_From `wonder-save.ts`_

### Setup

- **enable best lap tracking** — `wondersave.enablePersistent()`
  - Wonder Save v5.1.1 — best lap stored in RAM (kept while powered on) Plus celebration animation + 5 melodies.

### Save

- **save best lap now** — `wondersave.saveNow()`
- **reset best lap tracking** — `wondersave.clearSaved()`

### Celebrate

- **celebrate now (PB animation + jingle)** — `wondersave.celebrate()`
- **check + celebrate if new PB** — `wondersave.checkPb()`

### Music

- **play Mario coin jingle** — `wondersave.marioCoin()`
- **play Star Wars theme** — `wondersave.starWars()`
- **play Tetris theme** — `wondersave.tetris()`
- **play Pirates theme** — `wondersave.pirates()`
- **play Final Countdown** — `wondersave.finalCountdown()`


