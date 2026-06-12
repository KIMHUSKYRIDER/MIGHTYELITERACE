import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { validate } from './validate.mjs'
import { generateDocs } from './gen-docs.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Detect layout: source repo (pxt-bitbot-wonder/) vs published release (MIGHTYELITERACE/dev/).
// In release layout the engine source lives next to the script, and the wonder-*.ts
// block files live one level up at the repo root.
const isReleaseLayout = path.basename(__dirname) === 'dev'
const blockSourceDir = isReleaseLayout ? path.join(__dirname, '..') : __dirname
const competitionPath = isReleaseLayout
    ? path.join(__dirname, 'bitbot-xl-competition.ts')
    : path.join(__dirname, '..', 'bitbot-xl-competition.ts')
// wonder-paste.ts is a dev-only helper that lives next to the script in both layouts.
const wonderPastePath = path.join(__dirname, 'wonder-paste.ts')
const marker = '// ---------------- WONDER API (auto-generated — run: node build-extension.mjs) ----------------'

const src = fs.readFileSync(competitionPath, 'utf8')
const markerIdx = src.indexOf(marker)
if (markerIdx === -1) {
    console.error('Marker not found in bitbot-xl-competition.ts')
    process.exit(1)
}

const racerApiBody = `
    export function getLinePosition(): number {
        if (snapLeft == 1 && snapRight == 0) return -100
        if (snapLeft == 0 && snapRight == 1) return 100
        return 0
    }
    export function getSonarCm(): number { return snapDistance }
    export function getSensorQuality(): number { return sensorQuality }
    export function getSonarQuality(): number { return sonarQuality }
    export function getInterference(): number { return interferenceLevel }
    export function getConfidence(): number { return confidence }
    export function getObstacleCount(): number { return obstacleCount }
    export function getMaxSpeed(): number { return maxSpeedReached }
    export function isEliteMode(): boolean { return isEliteStraight() }
    export function isRunning(): boolean { return running }
    export function isLineLeft(): boolean { return snapLeft == 1 }
    export function isLineRight(): boolean { return snapRight == 1 }
    export function isLineSeen(): boolean { return lineSeenFast() }
    export function isLineConfirmed(): boolean { return lineConfirmed() }
    export function isAtObstacle(): boolean { return obstacleLatched || state == DriveState.ObstacleStop }
    export function isSearching(): boolean { return state == DriveState.LineLost || state == DriveState.SearchPivot }
    export function getDriveState(): number { return state }
    export function getLineLosses(): number { return lineLosses }

    export function setModel(model: BBModel): void { raceModel = model }
    export function setCountdown(seconds: number): void {
        countdownSec = clamp(seconds, 0, 9)
    }
    export function setBaseSpeed(speed: number): void {
        NORMAL_BASE_SPEED = clamp(speed, 20, 90)
    }
    export function setEliteSpeed(speed: number): void {
        ELITE_SPEED = clamp(speed, 30, 100)
    }
    export function setMinSpeed(speed: number): void {
        MIN_SPEED = clamp(speed, 10, 60)
    }
    export function setObstacleCm(onCm: number, offCm: number): void {
        OBSTACLE_ON_CM = clamp(onCm, 8, 40)
        OBSTACLE_OFF_CM = clamp(offCm, OBSTACLE_ON_CM + 2, 50)
    }
    export function setPidStraight(kp: number, kd: number): void {
        KP_STRAIGHT = clamp(kp, 5, 50)
        KD_STRAIGHT = clamp(kd, 5, 40)
    }
    export function setPidTurn(kp: number, kd: number): void {
        KP_TURN = clamp(kp, 10, 60)
        KD_TURN = clamp(kd, 10, 50)
    }
    export function applyTuningPreset(preset: number): void {
        if (preset == 0) {
            NORMAL_BASE_SPEED = 48
            ELITE_SPEED = 68
            MIN_SPEED = 28
            OBSTACLE_ON_CM = 16
            OBSTACLE_OFF_CM = 22
            KP_STRAIGHT = 14
            KD_STRAIGHT = 9
            KP_TURN = 24
            KD_TURN = 14
        } else if (preset == 2) {
            NORMAL_BASE_SPEED = 62
            ELITE_SPEED = 88
            MIN_SPEED = 32
            OBSTACLE_ON_CM = 12
            OBSTACLE_OFF_CM = 16
            KP_STRAIGHT = 22
            KD_STRAIGHT = 13
            KP_TURN = 34
            KD_TURN = 22
        } else {
            NORMAL_BASE_SPEED = 58
            ELITE_SPEED = 82
            MIN_SPEED = 30
            OBSTACLE_ON_CM = 14
            OBSTACLE_OFF_CM = 18
            KP_STRAIGHT = 18
            KD_STRAIGHT = 11
            KP_TURN = 30
            KD_TURN = 18
        }
    }

    export function applyRaceProfile(profile: number): void {
        applyTuningPreset(1)
        sonarFusionVeto = true
        if (profile == 0) {
            applyTuningPreset(0)
            OBSTACLE_ON_CM = 15
            OBSTACLE_OFF_CM = 21
            GAP_RECOVER_MS = 420
            SEARCH_TIMEOUT_MS = 1600
            sonarFusionVeto = true
        } else if (profile == 1) {
            applyTuningPreset(2)
            ELITE_STRAIGHT_LOOPS = 10
            CORNER_BRAKE_MAX = 18
            GAP_SPEED = 26
        } else if (profile == 2) {
            NORMAL_BASE_SPEED = 54
            ELITE_SPEED = 76
            CORNER_BRAKE_MAX = 28
            KP_TURN = 34
            KD_TURN = 20
            GAP_RECOVER_MS = 280
            LOST_LIMIT = 10
        } else if (profile == 3) {
            ELITE_SPEED = 85
            ELITE_STRAIGHT_LOOPS = 12
            CORNER_BRAKE_MAX = 24
            GAP_SPEED = 28
            SEARCH_SPEED = 18
        }
    }

    export function setCornerBrakeMax(pct: number): void {
        CORNER_BRAKE_MAX = clamp(pct, 0, 40)
    }
    export function setGapRecoverMs(ms: number): void {
        GAP_RECOVER_MS = clamp(ms, 150, 800)
    }
    export function setGapSpeed(speed: number): void {
        GAP_SPEED = clamp(speed, 12, 40)
    }
    export function setSearchSpeed(speed: number): void {
        SEARCH_SPEED = clamp(speed, 10, 30)
    }
    export function setSearchTimeoutMs(ms: number): void {
        SEARCH_TIMEOUT_MS = clamp(ms, 800, 2500)
    }
    export function setLostLimit(count: number): void {
        LOST_LIMIT = clamp(count, 4, 24)
    }
    export function setEliteStraightLoops(loops: number): void {
        ELITE_STRAIGHT_LOOPS = clamp(loops, 6, 24)
    }
    export function setSonarFusionVeto(on: boolean): void {
        sonarFusionVeto = on
    }
    export function getRunTimeSec(): number {
        if (raceStartMs <= 0) return 0
        return Math.idiv(input.runningTime() - raceStartMs, 1000)
    }
    export function isApproachingObstacle(): boolean {
        return sonarApproaching()
    }
    export function getCurrentSpeed(): number {
        return Math.idiv(Math.abs(currentLeft) + Math.abs(currentRight), 2)
    }
    export function getSpeedOverride(): number { return speedOverride }
    export function isBypassAdaptive(): boolean { return bypassAdaptive }

    export function setSpeedOverride(speed: number): void {
        speedOverride = clamp(speed, 0, 100)
    }
    export function setBypassAdaptive(on: boolean): void {
        bypassAdaptive = on
    }
    export function clearSpeedOverride(): void {
        speedOverride = 0
        bypassAdaptive = false
    }
    export function showSpeedNow(): void {
        basic.showNumber(getCurrentSpeed())
        basic.pause(600)
        basic.showNumber(maxSpeedReached)
        basic.pause(600)
    }

    export function setRobotSlow(): void {
        applyTuningPreset(0)
        NORMAL_BASE_SPEED = 42
        ELITE_SPEED = 52
        clearSpeedOverride()
    }
    export function setRobotMedium(): void {
        applyTuningPreset(1)
        clearSpeedOverride()
    }
    export function setRobotFast(): void {
        applyTuningPreset(2)
        clearSpeedOverride()
    }

    export function schoolPracticeStart(dir: BBRobotDirection, bias: number): void {
        raceModel = BBModel.XL
        sonarFastMode = true
        setRobotSlow()
        countdownSec = 3
        startEliteRacer(dir, bias)
    }
    export function schoolRaceStart(dir: BBRobotDirection, bias: number): void {
        sonarFastMode = false
        startMightyRacer(3, dir, bias)
    }
    export function easyStart(pace: number, dir: BBRobotDirection, bias: number): void {
        raceModel = BBModel.XL
        sonarFastMode = true
        if (pace == 0) {
            setRobotSlow()
        } else if (pace == 2) {
            setRobotFast()
        } else {
            setRobotMedium()
        }
        countdownSec = 3
        startEliteRacer(dir, bias)
    }

    export function testMotorsForward(): void {
        bitbot.select_model(BBModel.XL)
        driveSmooth(35, 35, false, false)
        basic.pause(800)
        stopAll()
        basic.showIcon(IconNames.Yes)
    }
    export function testLineSensorsShow(): void {
        let i = 0
        while (i < 25) {
            scanAllSensors()
            if (snapLeft == 1 && snapRight == 1) {
                basic.showIcon(IconNames.Square)
            } else if (snapLeft == 1) {
                basic.showArrow(ArrowNames.West)
            } else if (snapRight == 1) {
                basic.showArrow(ArrowNames.East)
            } else {
                basic.showIcon(IconNames.Asleep)
            }
            basic.pause(200)
            i++
        }
    }
    export function testSonarShow(): void {
        sonarFastMode = true
        primeSonarInstant()
        let i = 0
        while (i < 25) {
            basic.showNumber(getSonarInstantCm())
            basic.pause(150)
            i++
        }
    }
    export function setSonarFastMode(on: boolean): void {
        sonarFastMode = on
        if (on) {
            primeSonarInstant()
        }
    }
    export function isSonarFastMode(): boolean { return sonarFastMode }
    export function getSonarInstantCm(): number {
        snapDistance = readSonarInstantCm()
        return snapDistance
    }
    export function classroomReady(dir: BBRobotDirection, bias: number): void {
        prepareRacer(BBModel.XL, dir, bias)
        sonarFastMode = true
        primeSonarInstant()
        updateLineSensors()
        snapLeft = stableLeft
        snapRight = stableRight
        basic.showString("OK")
        basic.pause(400)
    }
    export function isCloserThan(cm: number): boolean {
        let d = getSonarInstantCm()
        return d > 0 && d < cm
    }
    export function waitCloserThan(cm: number, timeoutMs: number): boolean {
        let start = input.runningTime()
        while (input.runningTime() - start < timeoutMs) {
            if (isCloserThan(cm)) {
                return true
            }
            basic.pause(30)
        }
        return false
    }
    export function waitForLine(timeoutMs: number): boolean {
        let start = input.runningTime()
        while (input.runningTime() - start < timeoutMs) {
            updateLineSensors()
            if (lineSeenFast()) {
                return true
            }
            basic.pause(30)
        }
        return false
    }
    export function showAllSensorsOnce(): void {
        updateLineSensors()
        let d = getSonarInstantCm()
        if (snapLeft == 1 && snapRight == 1) {
            basic.showIcon(IconNames.Square)
        } else if (snapLeft == 1) {
            basic.showArrow(ArrowNames.West)
        } else if (snapRight == 1) {
            basic.showArrow(ArrowNames.East)
        } else {
            basic.showIcon(IconNames.Asleep)
        }
        basic.pause(400)
        basic.showNumber(d)
        basic.pause(500)
    }
    export function runClassroomTests(): void {
        testMotorsForward()
        testLineSensorsShow()
        testSonarShow()
    }
    export function countdownOnly(): void {
        basic.showString("READY")
        basic.pause(300)
        for (let i = countdownSec; i > 0; i--) {
            basic.showNumber(i)
            basic.pause(600)
        }
        basic.showIcon(IconNames.Heart)
    }
    export function driveBackTimed(speed: number, ms: number): void {
        bitbot.select_model(BBModel.XL)
        speed = clamp(speed, 10, 60)
        ms = clamp(ms, 100, 5000)
        driveSmooth(-speed, -speed, false, false)
        basic.pause(ms)
        stopAll()
    }
    export function turnLeftTimed(speed: number, ms: number): void {
        bitbot.select_model(BBModel.XL)
        speed = clamp(speed, 10, 50)
        ms = clamp(ms, 100, 3000)
        driveSmooth(-speed, speed, true, false)
        basic.pause(ms)
        stopAll()
    }
    export function turnRightTimed(speed: number, ms: number): void {
        bitbot.select_model(BBModel.XL)
        speed = clamp(speed, 10, 50)
        ms = clamp(ms, 100, 3000)
        driveSmooth(speed, -speed, true, false)
        basic.pause(ms)
        stopAll()
    }
    export function driveStraightTimed(speed: number, ms: number): void {
        bitbot.select_model(BBModel.XL)
        speed = clamp(speed, 10, 80)
        ms = clamp(ms, 100, 5000)
        driveSmooth(speed, speed, false, false)
        basic.pause(ms)
        stopAll()
    }

    export function enableLapTimerLed(on: boolean): void {
        lapLedAuto = on
        lastLapShown = -1
    }
    export function showLapSecondsOnLed(): void {
        basic.showNumber(getLapSeconds())
    }
    export function resetLapTimer(): void {
        lapStartMs = input.runningTime()
        lastLapShown = -1
    }
    export function setAutoBiasLearn(on: boolean): void {
        autoBiasLearn = on
    }
    export function getLearnedBias(): number {
        return startLineBias
    }
    export function activateTurboZone(ms: number): void {
        turboZoneEndMs = input.runningTime() + clamp(ms, 100, 15000)
    }
    export function turboZoneAtRaceMs(startAtMs: number, durationMs: number): void {
        turboAtRaceMs = clamp(startAtMs, 0, 600000)
        turboRaceDurationMs = clamp(durationMs, 100, 15000)
    }
    export function saveTune(slot: number): void {
        copyTuneToSlot(clamp(slot, 0, 2))
    }
    export function loadTune(slot: number): void {
        applyTuneFromSlot(clamp(slot, 0, 2))
    }
    export function saveTuneSlow(): void { saveTune(0) }
    export function loadTuneSlow(): void { loadTune(0) }
    export function saveTuneMedium(): void { saveTune(1) }
    export function loadTuneMedium(): void { loadTune(1) }
    export function saveTuneRace(): void { saveTune(2) }
    export function loadTuneRace(): void { loadTune(2) }
    export function showPostRunReport(): void { displayPostRunReport() }
    export function getLastRunMaxSpeed(): number { return lastRunMaxSpeed }
    export function getLastRunTimeSec(): number { return lastRunTimeSec }
    export function getLastRunObstacles(): number { return lastRunObstacles }
    export function getLastRunLineLosses(): number { return lastRunLineLosses }
    export function compareMaxSpeedDelta(): number {
        return maxSpeedReached - lastRunMaxSpeed
    }
    export function showCompareRuns(): void {
        basic.showString("L")
        basic.pause(300)
        basic.showNumber(lastRunMaxSpeed)
        basic.pause(400)
        basic.showString("N")
        basic.pause(300)
        basic.showNumber(maxSpeedReached)
    }
    export function getObstacleScore(): number { return obstacleScore }
    export function setLiveTuneMode(on: boolean): void { liveTuneMode = on }
    export function isLiveTuneMode(): boolean { return liveTuneMode }
    export function setDebugDriveLed(on: boolean): void {
        debugDriveLed = on
        lastStateShown = state
    }
    export function showDriveStateOnLed(): void { showDriveStateLetter() }
    export function graphConfidenceOnLed(): void { plotConfidenceBar() }
    export function setMiniFollowKp(kp: number): void {
        miniFollowKp = clamp(kp, 5, 50)
    }
    export function miniFollowStep(speed: number): void {
        miniFollowStepCore(speed, false)
    }
    export function miniFollowStepReverse(speed: number): void {
        miniFollowStepCore(speed, true)
    }
    export function runMiniFollowMs(speed: number, ms: number): void {
        bitbot.select_model(BBModel.XL)
        let end = input.runningTime() + clamp(ms, 100, 120000)
        while (input.runningTime() < end) {
            miniFollowStepCore(speed, false)
            basic.pause(LOOP_MS)
        }
        stopAll()
    }
    export function runReverseFollowMs(speed: number, ms: number): void {
        bitbot.select_model(BBModel.XL)
        let end = input.runningTime() + clamp(ms, 100, 120000)
        while (input.runningTime() < end) {
            miniFollowStepCore(speed, true)
            basic.pause(LOOP_MS)
        }
        stopAll()
    }
    export function listenForClassroomStop(group: number): void {
        remoteStopEnabled = true
        classroomRadioGroup = clamp(group, 0, 255)
        setupClassroomRadioListen()
    }
    export function sendClassroomStopRemote(group: number): void {
        radio.on()
        radio.setGroup(clamp(group, 0, 255))
        input.onButtonPressed(Button.A, function () {
            radio.sendNumber(99)
            basic.showIcon(IconNames.Yes)
        })
    }
    export function wizardSetup(pace: number, dir: BBRobotDirection, bias: number): void {
        raceModel = BBModel.XL
        sonarFastMode = true
        autoBiasLearn = true
        if (pace == 0) {
            setRobotSlow()
        } else if (pace == 2) {
            setRobotFast()
        } else {
            setRobotMedium()
        }
        countdownSec = 3
        startEliteRacer(dir, bias)
    }
    export function lesson4Follow30(dir: BBRobotDirection, bias: number): void {
        classroomReady(dir, bias)
        setRobotSlow()
        runMiniFollowMs(38, 30000)
        basic.showIcon(IconNames.Yes)
    }
    export function lesson5ObstacleCourse(dir: BBRobotDirection, bias: number): void {
        schoolPracticeStart(dir, bias)
    }
    export function lesson6LineMaze(dir: BBRobotDirection, bias: number): void {
        classroomReady(dir, bias)
        setRobotSlow()
        miniFollowKp = 16
        runMiniFollowMs(28, 60000)
        basic.showIcon(IconNames.Yes)
    }
    export function demoFigure8(): void {
        bitbot.select_model(BBModel.XL)
        driveStraightTimed(40, 700)
        turnRightTimed(28, 550)
        driveStraightTimed(35, 700)
        turnLeftTimed(28, 550)
        driveStraightTimed(40, 700)
        basic.showIcon(IconNames.Heart)
    }
    export function demoZigzag(): void {
        bitbot.select_model(BBModel.XL)
        let i = 0
        while (i < 4) {
            turnLeftTimed(25, 350)
            driveStraightTimed(35, 500)
            turnRightTimed(25, 350)
            driveStraightTimed(35, 500)
            i++
        }
        basic.showIcon(IconNames.Yes)
    }

    export function startTeacherDemo(dir: BBRobotDirection, bias: number): void {
        raceMusicOn = true
        wizardSetup(0, dir, bias)
    }

    export function startRacePractice(dir: BBRobotDirection, bias: number): void {
        practiceSaveOnAb = true
        liveTuneMode = true
        autoBiasLearn = true
        raceModel = BBModel.XL
        applyRaceProfile(3)
        countdownSec = 3
        startEliteRacer(dir, bias)
    }

    export function setRaceMusic(on: boolean): void {
        raceMusicOn = on
    }
    export function isRaceMusicOn(): boolean {
        return raceMusicOn
    }
    export function playMusicPreset(preset: number): void {
        playMelodyByPreset(clamp(preset, 0, 5))
    }
    export function playCustomMelody(melody: string, bpm: number): void {
        playCustomMelodyString(melody, bpm)
    }
    export function playRaceStartMusic(): void {
        playRaceStartFanfare()
    }
    export function playVictoryMusic(): void {
        playVictoryJingle()
    }

    export function loopSetup(dir: BBRobotDirection, bias: number): void {
        classroomReady(dir, bias)
        setRobotSlow()
        setSonarFastMode(true)
        setMiniFollowKp(20)
    }

    export function loopWait(): void {
        basic.pause(LOOP_MS)
    }

    export function loopSmartFollow(speed: number, stopCm: number): void {
        if (isCloserThan(stopCm)) {
            emergencyStop()
        } else {
            miniFollowStepCore(speed, false)
        }
    }

    export function loopFollowOrSearch(speed: number): void {
        updateLineSensors()
        if (!lineSeenFast()) {
            driveSmooth(speed - 10, speed - 10, false, false)
            basic.pause(120)
            driveSmooth(-22, 22, true, false)
            basic.pause(160)
            stopAll()
        } else {
            miniFollowStepCore(speed, false)
        }
    }

    export function loopFollowShowConfidence(speed: number): void {
        miniFollowStepCore(speed, false)
        if (input.runningTime() % 800 < LOOP_MS) {
            basic.showNumber(confidence)
        }
    }

    export function showFullDashboard(): void {
        scanAllSensors()
        basic.showNumber(confidence)
        basic.pause(450)
        basic.showNumber(snapDistance)
        basic.pause(450)
        basic.showNumber(Math.idiv(Math.abs(currentLeft) + Math.abs(currentRight), 2))
        basic.pause(450)
        basic.showNumber(lineLosses)
        basic.pause(450)
    }

    export function getHistoryScore(index: number): number {
        if (index == 1) return histScore1
        if (index == 2) return histScore2
        return histScore0
    }

    export function showRunHistory(): void {
        basic.showNumber(histScore0)
        basic.pause(450)
        basic.showNumber(histScore1)
        basic.pause(450)
        basic.showNumber(histScore2)
        basic.pause(450)
    }

    export function runDecathlon(dir: BBRobotDirection, bias: number): void {
        raceMusicOn = true
        let total = 0
        basic.showString("D1")
        basic.pause(400)
        challengeReaction(dir, bias)
        total += lastArenaScore
        basic.pause(700)
        basic.showString("D2")
        basic.pause(400)
        challengePrecisionPark(15, dir, bias)
        total += lastArenaScore
        basic.pause(700)
        basic.showString("D3")
        basic.pause(400)
        classroomReady(dir, bias)
        setRobotSlow()
        miniFollowKp = 16
        let t0 = input.runningTime()
        runMiniFollowMs(32, 20000)
        lastArenaScore = clamp(400 - Math.idiv(input.runningTime() - t0, 80), 0, 400)
        total += lastArenaScore
        lastArenaScore = total
        pushRunHistory(total)
        if (total > bestArenaScore) {
            bestArenaScore = total
            basic.showString("TOP")
            playVictoryJingle()
        } else {
            basic.showString("SUM")
            basic.pause(400)
        }
        basic.showNumber(total)
        basic.pause(800)
    }

    export function startUltimateRacer(dir: BBRobotDirection, bias: number): void {
        raceMusicOn = true
        arenaReportOnShake = true
        startRaceWin(dir, bias)
    }

    export function startLoopsChampion(dir: BBRobotDirection, bias: number): void {
        loopSetup(dir, bias)
        raceMusicOn = true
        basic.showString("GO")
        basic.pause(300)
        basic.forever(function () {
            loopSmartFollow(38, 14)
            loopWait()
        })
    }

    export function bitbotSelectXl(): void {
        bitbot.select_model(BBModel.XL)
    }

    export function bitbotBias(dir: BBRobotDirection, amount: number): void {
        bitbot.BBBias(dir, clamp(amount, 0, 20))
    }

    export function bitbotStop(): void {
        stopAll()
    }

    export function bitbotMove(speed: number): void {
        bitbot.select_model(BBModel.XL)
        speed = clamp(speed, -100, 100)
        if (speed >= 0) {
            bitbot.move(BBMotor.Both, BBDirection.Forward, speed)
        } else {
            bitbot.move(BBMotor.Both, BBDirection.Reverse, -speed)
        }
    }

    export function bitbotReadLineLeft(): number {
        return bitbot.readLine(BBLineSensor.Left)
    }

    export function bitbotReadLineRight(): number {
        return bitbot.readLine(BBLineSensor.Right)
    }

    export function bitbotSonarCm(): number {
        bitbot.select_model(BBModel.XL)
        let d = bitbot.sonar(BBPingUnit.Centimeters)
        if (d <= 0) return 0
        return d
    }

    export function getArenaScore(): number { return lastArenaScore }
    export function getBestArenaScore(): number { return bestArenaScore }
    export function showArenaScore(): void { displayArenaScore() }

    export function startClassKing(dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = true
        raceMusicOn = true
        practiceSaveOnAb = false
        liveTuneMode = false
        autoBiasLearn = true
        raceModel = BBModel.XL
        applyRaceProfile(3)
        OBSTACLE_ON_CM = 12
        OBSTACLE_OFF_CM = 16
        ELITE_STRAIGHT_LOOPS = 9
        countdownSec = 3
        startEliteRacer(dir, bias)
    }

    export function challengeObstaclePoints(dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = true
        schoolPracticeStart(dir, bias)
    }

    export function challengePrecisionPark(targetCm: number, dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = false
        classroomReady(dir, bias)
        sonarFastMode = true
        setRobotSlow()
        targetCm = clamp(targetCm, 8, 40)
        let deadline = input.runningTime() + 15000
        while (input.runningTime() < deadline) {
            let d = getSonarInstantCm()
            if (d > 0 && d <= targetCm) {
                stopAll()
                let err = Math.abs(d - targetCm)
                lastArenaScore = clamp(100 - err * 6, 0, 100)
                if (lastArenaScore > bestArenaScore) {
                    bestArenaScore = lastArenaScore
                    basic.showString("TOP")
                    basic.pause(400)
                }
                basic.showNumber(lastArenaScore)
                basic.pause(600)
                return
            }
            driveSmooth(22, 22, false, false)
            basic.pause(LOOP_MS)
        }
        stopAll()
        basic.showIcon(IconNames.No)
    }

    export function challengeMazeSprint(dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = false
        classroomReady(dir, bias)
        setRobotSlow()
        miniFollowKp = 16
        let t0 = input.runningTime()
        runMiniFollowMs(28, 60000)
        let sec = Math.idiv(input.runningTime() - t0, 1000)
        lastArenaScore = clamp(1000 - sec * 8, 0, 1000)
        if (lastArenaScore > bestArenaScore) {
            bestArenaScore = lastArenaScore
            basic.showString("TOP")
            basic.pause(400)
        }
        displayArenaScore()
    }

    export function challengeReaction(dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = false
        classroomReady(dir, bias)
        sonarFastMode = true
        basic.showString("GO")
        basic.pause(500)
        driveSmooth(38, 38, false, false)
        let t0 = input.runningTime()
        while (input.runningTime() - t0 < 8000) {
            if (isCloserThan(12)) {
                let react = input.runningTime() - t0
                stopAll()
                lastArenaScore = clamp(220 - Math.idiv(react, 8), 0, 220)
                if (lastArenaScore > bestArenaScore) {
                    bestArenaScore = lastArenaScore
                    basic.showString("TOP")
                    basic.pause(400)
                }
                basic.showNumber(lastArenaScore)
                basic.pause(600)
                return
            }
            basic.pause(LOOP_MS)
        }
        stopAll()
        basic.showIcon(IconNames.No)
    }

    export function challengeSpeedTrial(dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = true
        applyRaceProfile(1)
        ELITE_SPEED = 88
        NORMAL_BASE_SPEED = 62
        countdownSec = 3
        startEliteRacer(dir, bias)
    }

    export function startRaceWin(dir: BBRobotDirection, bias: number): void {
        arenaReportOnShake = false
        practiceSaveOnAb = false
        liveTuneMode = false
        lapLedAuto = true
        autoBiasLearn = true
        raceModel = BBModel.XL
        applyRaceProfile(3)
        OBSTACLE_ON_CM = 13
        OBSTACLE_OFF_CM = 17
        CORNER_BRAKE_MAX = 24
        GAP_RECOVER_MS = 280
        GAP_SPEED = 28
        SEARCH_SPEED = 18
        ELITE_STRAIGHT_LOOPS = 10
        ELITE_SPEED = 85
        sonarFusionVeto = true
        countdownSec = 3
        applyTuneFromSlot(2)
        turboAtRaceMs = 8000
        turboRaceDurationMs = 2500
        startEliteRacer(dir, bias)
    }

    export function prepareRacer(model: BBModel, dir: BBRobotDirection, bias: number): void {
        raceModel = model
        userSelectedModel = model
        modelTuneApplied = false
        initAntiInterference()
        setupClassroomRadioListen()
        bitbot.select_model(model)
        applyModelTune()
        raceBiasDir = dir
        raceBiasAmount = bias
        bitbot.BBBias(dir, clamp(bias, 0, 20))
        primeSonarInstant()
    }

    export function setObstacleStopEnabled(on: boolean): void {
        obstacleStopEnabled = on
    }

    export function emergencyStop(): void {
        running = false
        enterState(DriveState.Stopped)
        stopAll()
        basic.showIcon(IconNames.Skull)
    }

    export function softResetRace(): void {
        running = true
        obstacleLatched = false
        obstacleHitStreak = 0
        obstacleClearStreak = 0
        lostCount = 0
        lineLossStreak = 0
        resetPid()
        primeSensors()
        resetLapTimer()
        enterState(DriveState.FollowLine)
        basic.showIcon(IconNames.Yes)
    }

    function registerInputs(): void {
        input.onButtonPressed(Button.B, function () {
            if (liveTuneMode) {
                NORMAL_BASE_SPEED = clamp(NORMAL_BASE_SPEED - 2, 20, 90)
                ELITE_SPEED = clamp(ELITE_SPEED - 2, 30, 100)
                basic.showNumber(NORMAL_BASE_SPEED)
                basic.pause(200)
            } else {
                emergencyStop()
            }
        })
        input.onButtonPressed(Button.AB, function () {
            if (practiceSaveOnAb) {
                copyTuneToSlot(2)
                basic.showString("OK")
                basic.pause(300)
            }
            softResetRace()
        })
        input.onButtonPressed(Button.A, function () {
            if (liveTuneMode) {
                NORMAL_BASE_SPEED = clamp(NORMAL_BASE_SPEED + 2, 20, 90)
                ELITE_SPEED = clamp(ELITE_SPEED + 2, 30, 100)
                basic.showNumber(NORMAL_BASE_SPEED)
                basic.pause(200)
            } else {
                if (isEliteStraight()) {
                    basic.showString("E")
                    basic.pause(300)
                }
                basic.showNumber(getCurrentSpeed())
                basic.pause(400)
                basic.showNumber(maxSpeedReached)
                basic.pause(400)
                basic.showNumber(interferenceLevel)
            }
        })
        input.onLogoEvent(TouchButtonEvent.Pressed, function () {
            if (debugDriveLed) {
                showDriveStateLetter()
            } else {
                basic.showNumber(confidence)
            }
        })
        input.onGesture(Gesture.Shake, function () {
            displayPostRunReport()
        })
    }

    function startupSequence(): void {
        startLineBias = 0
        basic.showString("READY")
        basic.pause(300)
        for (let i = countdownSec; i > 0; i--) {
            basic.showNumber(i)
            if (raceMusicOn) {
                playCountdownTick()
            }
            sampleStartLineBias()
            basic.pause(300)
            sampleStartLineBias()
            basic.pause(300)
        }
        basic.showIcon(IconNames.Heart)
        if (raceMusicOn) {
            playGoChime()
        } else {
            basic.pause(300)
        }
        applyLearnedMotorBias(raceBiasDir, raceBiasAmount)
        primeSensors()
        raceStartMs = input.runningTime()
        lapStartMs = raceStartMs
        lastLapShown = -1
        maxSpeedReached = 0
        obstacleCount = 0
        lineLosses = 0
        obstacleScore = 0
        enterState(DriveState.FollowLine)
    }

    function mainLoop(): void {
        basic.forever(function () {
            if (!running) { stopAll(); basic.pause(50); return }
            scanAllSensors()
            tickLapLed()
            tickDebugDriveLed()
            tickRecordCorners()
            tickReplayCorners()
            if (state == DriveState.ObstacleStop) {
                if (tryClearObstacle()) return
            } else if (!obstacleLatched) {
                if (tryDetectObstacle()) return
            }
            if (state == DriveState.FollowLine) doFollowLine()
            else if (state == DriveState.GapRecover) doGapRecover()
            else if (state == DriveState.LineLost) doLineLost()
            else if (state == DriveState.SearchPivot) doSearchPivot()
            else basic.pause(LOOP_MS)
        })
    }

    export function startEliteRacer(dir: BBRobotDirection, bias: number): void {
        saveLastRunStats()
        raceBiasDir = dir
        raceBiasAmount = bias
        prepareRacer(raceModel, dir, bias)
        registerInputs()
        startupSequence()
        mainLoop()
    }

    export function startMightyRacer(profile: number, dir: BBRobotDirection, bias: number): void {
        raceModel = BBModel.XL
        applyRaceProfile(profile)
        countdownSec = 3
        startEliteRacer(dir, bias)
    }

    export function scanSensorsNow(): void { scanAllSensors() }

    // ---------- v5 ELITE: Ghost Lap ----------
    export function ghostLapStart(): void { ghostLapBegin() }
    export function ghostLapFinish(): void { ghostLapEnd() }
    export function getBestLap(): number { return getBestLapSec() }
    export function getLastLapDelta(): number { return getLastLapDeltaSec() }
    export function clearGhostLap(): void { clearBestLap() }

    // ---------- v5 ELITE: Corner Memory ----------
    export function cornerLearnStart(): void { startCornerLearn() }
    export function cornerLearnStop(): void { stopCornerLearn() }
    export function cornerReplayOn(): void { enableCornerReplay(true) }
    export function cornerReplayOff(): void { enableCornerReplay(false) }
    export function cornerMemoryClear(): void { clearCornerMemory() }
    export function cornerMemoryCount(): number { return getCornerMemoryCount() }
    export function cornerBrakeStrength(pct: number): void { setCornerMemBrakePercent(pct) }

    // ---------- v5 ELITE: Auto-Tune ----------
    export function autoTune(dir: BBRobotDirection, bias: number): number {
        return runAutoTune(dir, bias)
    }

    // ---------- v5 ELITE: Pre-flight ----------
    export function preflight(): string { return runPreflightCheck() }
    export function preflightResult(): string { return getPreflightResult() }
    export function preflightOk(): boolean { return getPreflightResult() == "GO" }

    // ---------- v5 ELITE: Race Coach ----------
    export function coachReview(): void { runRaceCoach() }

    // ---------- v5 ELITE: Personal Best ----------
    export function pbBestSec(): number { return getPersonalBestSec() }
    export function pbTopSpeed(): number { return getPersonalBestSpeed() }
    export function pbShow(): void { showPersonalBest() }
    export function pbClear(): void { clearPersonalBest() }

    // ---------- v5 ELITE: Polish ----------
    export function bootBannerV5(): void { showBootBannerV5() }
    export function speedometerLive(seconds: number): void { runLiveSpeedometer(seconds) }

    // ---------- v5 ELITE: Ultimate one-block ----------
    export function startWonderV5(dir: BBRobotDirection, bias: number): void {
        showBootBannerV5()
        runPreflightCheck()
        if (getPreflightResult() != "GO") {
            basic.showString("STOP")
            basic.pause(400)
            return
        }
        raceMusicOn = true
        lapLedAuto = true
        autoBiasLearn = true
        arenaReportOnShake = false
        practiceSaveOnAb = false
        liveTuneMode = false
        raceModel = BBModel.XL
        applyRaceProfile(3)
        OBSTACLE_ON_CM = 13
        OBSTACLE_OFF_CM = 17
        CORNER_BRAKE_MAX = 26
        GAP_RECOVER_MS = 280
        GAP_SPEED = 28
        SEARCH_SPEED = 18
        ELITE_STRAIGHT_LOOPS = 10
        ELITE_SPEED = 85
        sonarFusionVeto = true
        countdownSec = 3
        applyTuneFromSlot(2)
        turboAtRaceMs = 8000
        turboRaceDurationMs = 2500
        enableCornerReplay(true)
        startEliteRacer(dir, bias)
    }

    // ---------- v5 ELITE: Learn-then-race two-stage one-block ----------
    export function startLearnLap(dir: BBRobotDirection, bias: number): void {
        classroomReady(dir, bias)
        setRobotSlow()
        startCornerLearn()
        runMiniFollowMs(40, 25000)
        stopCornerLearn()
        basic.showString("READY RACE")
        basic.pause(400)
    }

    // ---------- v5.1: Model selection ----------
    export function useModel(model: BBModel): void {
        setUserModel(model)
        applyModelTune()
    }
    export function getSelectedModel(): number { return userSelectedModel }
    export function getDetectedModel(): number { return bitbot.getModel() }
    export function showDetectedModel(): void {
        basic.showString(getDetectedModelName())
    }

    // ---------- v5.1: Per-model one-block starters ----------
    export function startXl(dir: BBRobotDirection, bias: number): void {
        setUserModel(BBModel.XL)
        startWonderV5(dir, bias)
    }
    export function startClassic(dir: BBRobotDirection, bias: number): void {
        setUserModel(BBModel.Classic)
        applyModelTune()
        raceMusicOn = true
        lapLedAuto = true
        autoBiasLearn = true
        raceModel = BBModel.Classic
        applyRaceProfile(0)
        countdownSec = 3
        startEliteRacer(dir, bias)
    }
    export function startPro(dir: BBRobotDirection, bias: number): void {
        setUserModel(BBModel.PRO)
        applyModelTune()
        raceMusicOn = true
        lapLedAuto = true
        autoBiasLearn = true
        raceModel = BBModel.PRO
        applyRaceProfile(2)
        ELITE_SPEED = 90
        countdownSec = 3
        startEliteRacer(dir, bias)
    }
    export function startAutoModel(dir: BBRobotDirection, bias: number): void {
        setUserModel(BBModel.Auto)
        applyModelTune()
        startWonderV5(dir, bias)
    }

    // ---------- v5.1: Track-type profiles ----------
    export function useShortTrack(): void {
        NORMAL_BASE_SPEED = 45
        ELITE_SPEED = 60
        ELITE_STRAIGHT_LOOPS = 18
        CORNER_BRAKE_MAX = 32
        KP_TURN = 38
        GAP_RECOVER_MS = 240
    }
    export function useLongTrack(): void {
        NORMAL_BASE_SPEED = 65
        ELITE_SPEED = 92
        ELITE_STRAIGHT_LOOPS = 8
        CORNER_BRAKE_MAX = 22
        KP_TURN = 28
        GAP_RECOVER_MS = 280
    }
    export function useObstacleTrack(): void {
        NORMAL_BASE_SPEED = 48
        ELITE_SPEED = 68
        OBSTACLE_ON_CM = 18
        OBSTACLE_OFF_CM = 24
        sonarFusionVeto = true
        sonarFastMode = true
    }
    export function useTimeTrialTrack(): void {
        NORMAL_BASE_SPEED = 70
        ELITE_SPEED = 95
        ELITE_STRAIGHT_LOOPS = 7
        CORNER_BRAKE_MAX = 18
        OBSTACLE_ON_CM = 10
        sonarFusionVeto = true
    }
    export function useBeginnerTrack(): void {
        NORMAL_BASE_SPEED = 35
        ELITE_SPEED = 45
        MIN_SPEED = 22
        KP_STRAIGHT = 14
        KP_TURN = 22
        CORNER_BRAKE_MAX = 30
    }

    // ---------- v5.1: Persistent storage ----------
    export function enablePersistentBest(): void { enablePersistence() }
    export function savePersistedBest(): void { persistPB() }
    export function clearPersistedBest(): void { clearPersistedPB() }

    // ---------- v5.1: Extra music ----------
    export function playMarioCoinJingle(): void { playMarioCoin() }
    export function playStarWarsJingle(): void { playStarWars() }
    export function playTetrisJingle(): void { playTetris() }
    export function playPiratesJingle(): void { playPirates() }
    export function playFinalCountdownJingle(): void { playFinalCountdown() }

    // ---------- v5.1: Auto-celebrate ----------
    export function celebratePb(): void { autoCelebrate() }
    export function celebrateOnPb(): void {
        let prev = pbRunSec
        updatePersonalBest()
        if (pbRunSec < prev || prev < 0) {
            autoCelebrate()
        }
    }
`

const wonderPaste = fs.existsSync(wonderPastePath) ? fs.readFileSync(wonderPastePath, 'utf8') : ''
const pasteStart = `

// Start the elite racer (same as Wonder extension block)
wonder.startEliteRacer(BBRobotDirection.Left, 5)
`

// Extension: core + API inside a single wonderracer namespace
const body = src.slice(0, markerIdx).trimEnd()
const wonderracerOut = `/**
 * BitBot Wonder — elite racer core (auto-generated from bitbot-xl-competition.ts)
 */
namespace wonderracer {
${body}
${racerApiBody}
}
`
fs.writeFileSync(path.join(blockSourceDir, 'wonderracer.ts'), wonderracerOut)

// Paste file: core at top level + one wonderracer namespace + wonder wrappers + start
const competitionOut = `${body}\n\n${marker}\n\nnamespace wonderracer {${racerApiBody}\n}\n\n${wonderPaste.trim()}${pasteStart}`
fs.writeFileSync(competitionPath, competitionOut)

// Sync release folder
// In source layout: sync to ../MIGHTYELITERACE release folder.
// In release layout: nothing to sync — we're already at the release folder.
const releaseDir = isReleaseLayout ? null : path.join(__dirname, '..', 'MIGHTYELITERACE')
if (releaseDir && fs.existsSync(releaseDir)) {
    fs.copyFileSync(path.join(__dirname, 'wonder.ts'), path.join(releaseDir, 'wonder.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-teacher.ts'), path.join(releaseDir, 'wonder-teacher.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-extras.ts'), path.join(releaseDir, 'wonder-extras.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-arena.ts'), path.join(releaseDir, 'wonder-arena.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-music.ts'), path.join(releaseDir, 'wonder-music.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-loops.ts'), path.join(releaseDir, 'wonder-loops.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-builtins.ts'), path.join(releaseDir, 'wonder-builtins.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-bitbot.ts'), path.join(releaseDir, 'wonder-bitbot.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-pro.ts'), path.join(releaseDir, 'wonder-pro.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-stats.ts'), path.join(releaseDir, 'wonder-stats.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-control.ts'), path.join(releaseDir, 'wonder-control.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-elite.ts'), path.join(releaseDir, 'wonder-elite.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-models.ts'), path.join(releaseDir, 'wonder-models.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-tracks.ts'), path.join(releaseDir, 'wonder-tracks.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonder-save.ts'), path.join(releaseDir, 'wonder-save.ts'))
    fs.copyFileSync(path.join(__dirname, 'wonderracer.ts'), path.join(releaseDir, 'wonderracer.ts'))
    fs.copyFileSync(path.join(__dirname, 'pxt.json'), path.join(releaseDir, 'pxt.json'))
    fs.copyFileSync(path.join(__dirname, 'README.md'), path.join(releaseDir, 'README.md'))
    if (fs.existsSync(path.join(__dirname, 'CHANGELOG.md'))) {
        fs.copyFileSync(path.join(__dirname, 'CHANGELOG.md'), path.join(releaseDir, 'CHANGELOG.md'))
    }
    if (fs.existsSync(path.join(__dirname, 'BLOCKS.md'))) {
        fs.copyFileSync(path.join(__dirname, 'BLOCKS.md'), path.join(releaseDir, 'BLOCKS.md'))
    }
    if (fs.existsSync(path.join(__dirname, 'LICENSE'))) {
        fs.copyFileSync(path.join(__dirname, 'LICENSE'), path.join(releaseDir, 'LICENSE'))
    }
    if (fs.existsSync(path.join(__dirname, 'CONTRIBUTING.md'))) {
        fs.copyFileSync(path.join(__dirname, 'CONTRIBUTING.md'), path.join(releaseDir, 'CONTRIBUTING.md'))
    }
    const devDir = path.join(releaseDir, 'dev')
    if (!fs.existsSync(devDir)) fs.mkdirSync(devDir)
    fs.copyFileSync(path.join(__dirname, 'build-extension.mjs'), path.join(devDir, 'build-extension.mjs'))
    fs.copyFileSync(path.join(__dirname, 'validate.mjs'), path.join(devDir, 'validate.mjs'))
    fs.copyFileSync(path.join(__dirname, 'gen-docs.mjs'), path.join(devDir, 'gen-docs.mjs'))
    if (fs.existsSync(path.join(__dirname, 'makecode-doctor.mjs'))) {
        fs.copyFileSync(path.join(__dirname, 'makecode-doctor.mjs'), path.join(devDir, 'makecode-doctor.mjs'))
    }
    if (fs.existsSync(competitionPath)) {
        fs.copyFileSync(competitionPath, path.join(devDir, 'bitbot-xl-competition.ts'))
    }
    if (fs.existsSync(wonderPastePath)) {
        fs.copyFileSync(wonderPastePath, path.join(devDir, 'wonder-paste.ts'))
    }
    // Sync GitHub Actions workflows
    const ghSrcDir = path.join(blockSourceDir, '.github')
    if (fs.existsSync(ghSrcDir)) {
        const ghDstDir = path.join(releaseDir, '.github')
        const copyRecursive = (src, dst) => {
            if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true })
            for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
                const s = path.join(src, entry.name)
                const d = path.join(dst, entry.name)
                if (entry.isDirectory()) copyRecursive(s, d)
                else fs.copyFileSync(s, d)
            }
        }
        copyRecursive(ghSrcDir, ghDstDir)
    }
    const makecodeSrc = path.join(blockSourceDir, '..', 'makecode')
    const makecodeDst = path.join(releaseDir, 'makecode')
    if (fs.existsSync(makecodeSrc)) {
        fs.mkdirSync(makecodeDst, { recursive: true })
        for (const sub of fs.readdirSync(makecodeSrc)) {
            const srcSub = path.join(makecodeSrc, sub)
            const dstSub = path.join(makecodeDst, sub)
            fs.mkdirSync(dstSub, { recursive: true })
            for (const f of fs.readdirSync(srcSub)) {
                fs.copyFileSync(path.join(srcSub, f), path.join(dstSub, f))
            }
        }
    }
}

console.log('Wrote wonderracer.ts', wonderracerOut.length, 'chars')
console.log('Updated bitbot-xl-competition.ts with Wonder API', competitionOut.length, 'chars')

// ---------- VALIDATE ----------
const valResult = validate(blockSourceDir)
console.log(`\nValidator: checked ${valResult.blockCount} blocks, ${valResult.callCount} wonderracer calls`)
if (valResult.warnings.length) {
    console.log(`  ${valResult.warnings.length} warning(s):`)
    for (const w of valResult.warnings) console.log(`    WARN: ${w}`)
}
if (valResult.errors.length) {
    console.log(`  ${valResult.errors.length} error(s):`)
    for (const e of valResult.errors) console.log(`    FAIL: ${e}`)
    console.log('\nBUILD FAILED — fix errors above before committing.')
    process.exit(1)
}
console.log('  All validation checks passed.')

// ---------- GEN DOCS ----------
const docResult = generateDocs(blockSourceDir)
console.log(`\nBLOCKS.md regenerated: ${docResult.namespaces} namespaces, ${docResult.count} blocks`)
if (releaseDir && fs.existsSync(releaseDir) && fs.existsSync(docResult.path)) {
    fs.copyFileSync(docResult.path, path.join(releaseDir, 'BLOCKS.md'))
}
