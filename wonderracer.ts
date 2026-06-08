/**
 * BitBot Wonder — elite racer core (auto-generated from bitbot-xl-competition.ts)
 */
namespace wonderracer {
// BitBot XL — Elite U18 competition racer
// Predictive corners, sonar-line fusion, anti-interference, adaptive elite speed
// No controller / no radio — fully autonomous

// ---------------- CONFIG ----------------
const LOOP_MS = 10

let NORMAL_BASE_SPEED = 58
let MIN_SPEED = 30
let FAST_BOOST = 12
let ELITE_SPEED = 82
let ELITE_STRAIGHT_LOOPS = 14
const WIDE_LINE_LOOPS = 10
const CORNER_PREDICT_DERIV = 26
const CORNER_PREDICT_ERROR = 42
const CORNER_PREDICT_ACCEL = 14
let CORNER_BRAKE_MAX = 22
const START_BIAS_MS = 2500
const START_BIAS_GAIN = 6

let GAP_SPEED = 24
let SEARCH_SPEED = 16
let SEARCH_TIMEOUT_MS = 1400
const ARC_SWITCH_MS = 350
let GAP_RECOVER_MS = 350

// Dual-gain PID: calm on straights, sharper on turns
let KP_STRAIGHT = 18
let KD_STRAIGHT = 11
let KP_TURN = 30
let KD_TURN = 18
const KI = 2
const DERIV_NEW_WEIGHT = 0.75
const ERROR_SMOOTH = 0.6
const INTEGRAL_CLAMP = 8

// Line sensor detection (majority vote resists IR / electrical glitches)
const LINE_BURST_SAMPLES = 5
const LINE_VOTES_REQUIRED = 3
const LINE_ON_CONFIRM = 1
const LINE_OFF_CONFIRM = 3
const LINE_LOSS_CONFIRM = 4

// Sonar detection (crosstalk-resistant in crowded arenas)
const SONAR_BURST_SAMPLES = 3
const SONAR_BUFFER_LEN = 3
const SONAR_MAX_JUMP_CM = 12
const SONAR_BURST_AGREE_CM = 6
const SONAR_VALID_MAX_CM = 120
const SONAR_TREND_SAMPLES = 3
const SONAR_STAGGER_MAX_MS = 9
const SONAR_PING_GAP_MS = 5
const SONAR_HIT_COUNT_NOISY = 3
const SONAR_CLEAR_COUNT_NOISY = 4
const SONAR_QUALITY_MIN_HIT = 55
const SONAR_QUALITY_MIN_CLEAR = 60
const OBSTACLE_APPROACH_CM = 28

// Unique radio band if you ever re-enable radio on a remote (not used while racing)
const RADIO_GROUP_ID = 73
const RADIO_FREQ_BAND = 47

let OBSTACLE_ON_CM = 14
let OBSTACLE_OFF_CM = 18
const OBSTACLE_HIT_COUNT = 2
const OBSTACLE_CLEAR_COUNT = 3

let LOST_LIMIT = 12
let sonarFusionVeto = true
let speedOverride = 0
let bypassAdaptive = false
let sonarFastMode = false
let lapStartMs = 0
let autoBiasLearn = true
let raceBiasDir = BBRobotDirection.Left
let raceBiasAmount = 5
let turboZoneEndMs = 0
let turboAtRaceMs = -1
let turboRaceDurationMs = 0
let liveTuneMode = false
let practiceSaveOnAb = false
let arenaReportOnShake = false
let bestArenaScore = 0
let lastArenaScore = 0
let raceMusicOn = false
let histScore0 = 0
let histScore1 = 0
let histScore2 = 0
let remoteStopEnabled = false
let classroomRadioGroup = RADIO_GROUP_ID
let miniFollowKp = 20
let obstacleScore = 0

let lastRunMaxSpeed = 0
let lastRunTimeSec = 0
let lastRunObstacles = 0
let lastRunLineLosses = 0

let tune0_base = 58
let tune0_elite = 82
let tune0_obOn = 14
let tune0_obOff = 18
let tune1_base = 58
let tune1_elite = 82
let tune1_obOn = 14
let tune1_obOff = 18
let tune2_base = 62
let tune2_elite = 88
let tune2_obOn = 12
let tune2_obOff = 16
let lapLedAuto = false
let lastLapShown = -1
let debugDriveLed = false
let lastStateShown = 0
const STRAIGHT_BOOST_LOOPS = 8
const ERROR_HISTORY_LEN = 5

const CONFIDENCE_MIN = 0
const CONFIDENCE_MAX = 100

enum DriveState {
    Stopped,
    FollowLine,
    ObstacleStop,
    GapRecover,
    LineLost,
    SearchPivot,
}

// ---------------- STATE ----------------
let countdownSec = 3
let raceModel = BBModel.XL
let state = DriveState.FollowLine
let running = true

let lastError = 0
let smoothedError = 0
let lastDerivative = 0
let errorAccel = 0
let integral = 0
let wideLineCount = 0
let startLineBias = 0
let raceStartMs = 0
let deadReckonCm = 0

let lostCount = 0
let lastSeenDir = 1
let straightCount = 0

let obstacleLatched = false
let obstacleHitStreak = 0
let obstacleClearStreak = 0
let obstacleCount = 0

let gapRecoverStartMs = 0
let searchStartMs = 0
let lastArcSwitchMs = 0
let arcDir = 1

let confidence = 85
let lineLosses = 0
let maxSpeedReached = 0

let currentLeft = 0
let currentRight = 0

// Line sensor fusion
let stableLeft = 0
let stableRight = 0
let instantLeft = 0
let instantRight = 0
let leftVoteScore = 0
let rightVoteScore = 0
let leftOnStreak = 0
let leftOffStreak = 0
let rightOnStreak = 0
let rightOffStreak = 0
let lineLossStreak = 0
let sensorQuality = 100

// Sonar fusion
let sonarBuf0 = 0
let sonarBuf1 = 0
let sonarBuf2 = 0
let sonarBufFill = 0
let sonarTrend0 = 0
let sonarTrend1 = 0
let sonarTrend2 = 0
let sonarTrendFill = 0
let lastSonarCm = 0
let sonarQuality = 100
let sonarInvalidStreak = 0
let sonarCrosstalkStreak = 0
let interferenceLevel = 0

// Per-loop sensor snapshot (read once per tick)
let snapLeft = 0
let snapRight = 0
let snapDistance = 0

// Error history for predictive search
let errHist0 = 0
let errHist1 = 0
let errHist2 = 0
let errHist3 = 0
let errHist4 = 0
let errHistIdx = 0

// ---------------- ANTI-INTERFERENCE ----------------
function initAntiInterference(): void {
    // Autonomous racer: kill radio unless teacher remote-stop is enabled.
    if (!remoteStopEnabled) {
        radio.off()
    }
}

function setupClassroomRadioListen(): void {
    if (!remoteStopEnabled) {
        return
    }
    radio.on()
    radio.setGroup(classroomRadioGroup)
    radio.onReceivedNumber(function (receivedNumber: number) {
        if (receivedNumber == 99) {
            running = false
            enterState(DriveState.Stopped)
            stopAll()
            basic.showIcon(IconNames.Skull)
        }
    })
}

function enableRadioForRemoteOnly(): void {
    // Call this only on a separate remote micro:bit — never on the race car.
    radio.on()
    radio.setGroup(RADIO_GROUP_ID)
    radio.setFrequencyBand(RADIO_FREQ_BAND)
    radio.setTransmitPower(3)
    radio.setTransmitSerialNumber(false)
}

function sonarStaggerPause(): void {
    let jitter = input.runningTime() % SONAR_STAGGER_MAX_MS
    basic.pause(jitter + 2)
}

function isNoisySonar(): boolean {
    return sonarCrosstalkStreak >= 2 || sonarQuality < 55
}

function requiredHitCount(): number {
    if (isNoisySonar()) {
        return SONAR_HIT_COUNT_NOISY
    }
    return OBSTACLE_HIT_COUNT
}

function requiredClearCount(): number {
    if (isNoisySonar()) {
        return SONAR_CLEAR_COUNT_NOISY
    }
    return OBSTACLE_CLEAR_COUNT
}

function sonarBurstSpread(valid: number, s0: number, s1: number, s2: number): number {
    if (valid <= 1) {
        return 0
    }

    let lo = s0
    let hi = s0

    if (valid >= 2) {
        if (s1 < lo) {
            lo = s1
        }
        if (s1 > hi) {
            hi = s1
        }
    }

    if (valid >= 3) {
        if (s2 < lo) {
            lo = s2
        }
        if (s2 > hi) {
            hi = s2
        }
    }

    return hi - lo
}

function markInterference(level: number): void {
    interferenceLevel = clamp(level, 0, 100)
}

// ---------------- HELPERS ----------------
function clamp(v: number, min: number, max: number): number {
    if (v < min) return min
    if (v > max) return max
    return v
}

function stopAll(): void {
    bitbot.stop(BBStopMode.Brake)
    currentLeft = 0
    currentRight = 0
}

function driveMotor(motor: BBMotor, speed: number): void {
    speed = clamp(speed, -100, 100)
    if (speed >= 0) {
        bitbot.move(motor, BBDirection.Forward, speed)
    } else {
        bitbot.move(motor, BBDirection.Reverse, -speed)
    }
}

function driveSmooth(targetLeft: number, targetRight: number, sharpTurn: boolean, eliteRamp: boolean): void {
    targetLeft = clamp(targetLeft, -100, 100)
    targetRight = clamp(targetRight, -100, 100)

    let rampStep = 6
    if (eliteRamp) {
        rampStep = 8
    }
    if (sharpTurn) {
        rampStep = 3
    }

    if (currentLeft < targetLeft) currentLeft = Math.min(currentLeft + rampStep, targetLeft)
    else if (currentLeft > targetLeft) currentLeft = Math.max(currentLeft - rampStep, targetLeft)

    if (currentRight < targetRight) currentRight = Math.min(currentRight + rampStep, targetRight)
    else if (currentRight > targetRight) currentRight = Math.max(currentRight - rampStep, targetRight)

    driveMotor(BBMotor.Left, currentLeft)
    driveMotor(BBMotor.Right, currentRight)

    let absLeft = Math.abs(currentLeft)
    let absRight = Math.abs(currentRight)
    if (absLeft > maxSpeedReached) maxSpeedReached = absLeft
    if (absRight > maxSpeedReached) maxSpeedReached = absRight
}

function readLeftRaw(): number {
    return bitbot.readLine(BBLineSensor.Left)
}

function readRightRaw(): number {
    return bitbot.readLine(BBLineSensor.Right)
}

function median3(a: number, b: number, c: number): number {
    if ((a <= b && b <= c) || (c <= b && b <= a)) return b
    if ((b <= a && a <= c) || (c <= a && a <= b)) return a
    return c
}

function burstVoteLine(side: BBLineSensor): number {
    let votes = 0
    let i = 0

    while (i < LINE_BURST_SAMPLES) {
        if (bitbot.readLine(side) == 1) {
            votes++
        }
        basic.pause(1)
        i++
    }

    if (votes >= LINE_VOTES_REQUIRED) {
        return 1
    }
    return 0
}

function updateLineSide(voted: number, stable: number, onStreak: number, offStreak: number): number[] {
    if (voted == 1) {
        offStreak = 0
        if (stable == 0) {
            onStreak++
        } else {
            onStreak = LINE_ON_CONFIRM
        }
        if (onStreak >= LINE_ON_CONFIRM) {
            stable = 1
        }
    } else {
        onStreak = 0
        if (stable == 1) {
            offStreak++
        } else {
            offStreak = LINE_OFF_CONFIRM
        }
        if (offStreak >= LINE_OFF_CONFIRM) {
            stable = 0
        }
    }

    return [stable, onStreak, offStreak]
}

function updateLineSensors(): void {
    let votedLeft = burstVoteLine(BBLineSensor.Left)
    let votedRight = burstVoteLine(BBLineSensor.Right)

    instantLeft = votedLeft
    instantRight = votedRight
    leftVoteScore = votedLeft * 100
    rightVoteScore = votedRight * 100

    let leftResult = updateLineSide(votedLeft, stableLeft, leftOnStreak, leftOffStreak)
    stableLeft = leftResult[0]
    leftOnStreak = leftResult[1]
    leftOffStreak = leftResult[2]

    let rightResult = updateLineSide(votedRight, stableRight, rightOnStreak, rightOffStreak)
    stableRight = rightResult[0]
    rightOnStreak = rightResult[1]
    rightOffStreak = rightResult[2]

    if (stableLeft == 0 && stableRight == 0) {
        lineLossStreak++
    } else {
        lineLossStreak = 0
    }

    let agree = 0
    if (votedLeft == stableLeft) agree++
    if (votedRight == stableRight) agree++
    sensorQuality = clamp(agree * 40 + 20, 20, 100)
}

function lineSeenFast(): boolean {
    return instantLeft == 1 || instantRight == 1
}

function lineConfirmed(): boolean {
    return stableLeft == 1 || stableRight == 1
}

function lineFullyLost(): boolean {
    return stableLeft == 0 && stableRight == 0 && lineLossStreak >= LINE_LOSS_CONFIRM
}

function lineSeen(): boolean {
    return lineSeenFast()
}

function sonarOutlier(sample: number, reference: number): boolean {
    if (sample <= 0 || reference <= 0) {
        return false
    }

    // Reject spurious far echoes only; rolling median handles close glitches.
    return sample > reference + SONAR_MAX_JUMP_CM
}

function pushSonarBuffer(cm: number): void {
    if (sonarBufFill == 0) {
        sonarBuf0 = cm
        sonarBuf1 = cm
        sonarBuf2 = cm
        sonarBufFill = SONAR_BUFFER_LEN
    } else {
        sonarBuf0 = sonarBuf1
        sonarBuf1 = sonarBuf2
        sonarBuf2 = cm
    }
}

function pushSonarTrend(cm: number): void {
    sonarTrend0 = sonarTrend1
    sonarTrend1 = sonarTrend2
    sonarTrend2 = cm
    if (sonarTrendFill < SONAR_TREND_SAMPLES) {
        sonarTrendFill++
    }
}

function sonarApproaching(): boolean {
    if (sonarTrendFill < SONAR_TREND_SAMPLES) {
        return false
    }
    return sonarTrend0 > sonarTrend1 && sonarTrend1 > sonarTrend2
}

function readSonarInstantCm(): number {
    let d = bitbot.sonar(BBPingUnit.Centimeters)
    if (d > 0 && d <= SONAR_VALID_MAX_CM) {
        lastSonarCm = d
        pushSonarBuffer(d)
        pushSonarTrend(d)
        sonarQuality = clamp(sonarQuality + 10, 70, 100)
        sonarInvalidStreak = 0
    }
    return lastSonarCm
}

function readSonarBurstCm(): number {
    if (sonarFastMode) {
        return readSonarInstantCm()
    }

    let s0 = 0
    let s1 = 0
    let s2 = 0
    let valid = 0
    let i = 0
    let ref = lastSonarCm

    sonarStaggerPause()

    if (sonarBufFill >= SONAR_BUFFER_LEN) {
        ref = median3(sonarBuf0, sonarBuf1, sonarBuf2)
    }

    while (i < SONAR_BURST_SAMPLES) {
        let d = bitbot.sonar(BBPingUnit.Centimeters)

        if (d > 0 && d <= SONAR_VALID_MAX_CM) {
            if (!sonarOutlier(d, ref)) {
                if (valid == 0) {
                    s0 = d
                } else if (valid == 1) {
                    s1 = d
                } else {
                    s2 = d
                }
                valid++
            }
        }

        basic.pause(SONAR_PING_GAP_MS)
        i++
    }

    if (valid == 0) {
        sonarInvalidStreak++
        sonarCrosstalkStreak++
        sonarQuality = clamp(sonarQuality - 15, 10, 100)
        markInterference(sonarQuality)
        return lastSonarCm
    }

    if (sonarInvalidStreak > 2) {
        sonarBufFill = 0
    }
    sonarInvalidStreak = 0

    let spread = sonarBurstSpread(valid, s0, s1, s2)

    if (valid >= 2 && spread > SONAR_BURST_AGREE_CM) {
        sonarCrosstalkStreak++
        sonarQuality = clamp(sonarQuality - 20, 10, 100)
        markInterference(sonarQuality)
        return lastSonarCm
    }

    sonarCrosstalkStreak = 0

    let burst = 0
    if (valid == 1) {
        burst = s0
    } else if (valid == 2) {
        burst = Math.idiv(s0 + s1, 2)
    } else {
        burst = median3(s0, s1, s2)
    }

    sonarQuality = clamp(valid * 30 + 20 - spread * 2, 30, 100)
    markInterference(sonarQuality)
    pushSonarBuffer(burst)
    pushSonarTrend(burst)
    lastSonarCm = burst

    if (sonarBufFill < SONAR_BUFFER_LEN) {
        return burst
    }

    return median3(sonarBuf0, sonarBuf1, sonarBuf2)
}

function scanAllSensors(): void {
    updateLineSensors()
    snapLeft = stableLeft
    snapRight = stableRight
    snapDistance = readSonarBurstCm()
}

function primeSonarInstant(): void {
    sonarBufFill = 0
    sonarInvalidStreak = 0
    sonarCrosstalkStreak = 0
    let i = 0
    while (i < 5) {
        readSonarInstantCm()
        basic.pause(1)
        i++
    }
    snapDistance = lastSonarCm
}

function primeSensors(): void {
    let i = 0
    while (i < 2) {
        updateLineSensors()
        if (sonarFastMode) {
            readSonarInstantCm()
        } else {
            readSonarBurstCm()
        }
        i++
    }
    snapLeft = stableLeft
    snapRight = stableRight
    snapDistance = lastSonarCm
}

function pushErrorHistory(e: number): void {
    let slot = errHistIdx % ERROR_HISTORY_LEN
    errHistIdx++

    if (slot == 0) errHist0 = e
    else if (slot == 1) errHist1 = e
    else if (slot == 2) errHist2 = e
    else if (slot == 3) errHist3 = e
    else errHist4 = e
}

function predictedSearchDir(): number {
    let sum = errHist0 + errHist1 + errHist2 + errHist3 + errHist4

    if (sum < -20) return -1
    if (sum > 20) return 1
    return lastSeenDir
}

function resetPid(): void {
    lastError = 0
    smoothedError = 0
    lastDerivative = 0
    errorAccel = 0
    integral = 0
    straightCount = 0
    wideLineCount = 0
    deadReckonCm = 0
    errHist0 = 0
    errHist1 = 0
    errHist2 = 0
    errHist3 = 0
    errHist4 = 0
    errHistIdx = 0
}

function setConfidence(delta: number): void {
    confidence = clamp(confidence + delta, CONFIDENCE_MIN, CONFIDENCE_MAX)
}

function enterState(next: DriveState): void {
    if (next != DriveState.FollowLine) {
        integral = 0
    }
    state = next
}

function computeFusedLineError(left: number, right: number): number {
    if (left == 1 && right == 0) {
        return -100
    }
    if (left == 0 && right == 1) {
        return 100
    }
    if (left == 1 && right == 1) {
        return smoothedError * 0.25
    }

    // Transition / noisy reads: use vote scores before stable state catches up
    if (leftVoteScore != rightVoteScore) {
        return (rightVoteScore - leftVoteScore) / 2
    }

    return smoothedError
}

function getAdaptiveGains(absError: number, absDeriv: number, motorSpeed: number): number[] {
    let turnBlend = clamp(absError + absDeriv * 25, 0, 100)
    let kp = KP_STRAIGHT + Math.idiv((KP_TURN - KP_STRAIGHT) * turnBlend, 100)
    let kd = KD_STRAIGHT + Math.idiv((KD_TURN - KD_STRAIGHT) * turnBlend, 100)

    if (motorSpeed > 65) {
        kp = Math.idiv(kp * 88, 100)
        kd = Math.idiv(kd * 115, 100)
    }

    return [kp, kd]
}

function sampleStartLineBias(): void {
    updateLineSensors()

    if (stableLeft == 1 && stableRight == 0) {
        startLineBias = startLineBias - 1
    } else if (stableLeft == 0 && stableRight == 1) {
        startLineBias = startLineBias + 1
    }
}

function getStartBiasError(): number {
    if (input.runningTime() - raceStartMs > START_BIAS_MS) {
        return 0
    }
    return clamp(startLineBias * START_BIAS_GAIN, -20, 20)
}

function applyLearnedMotorBias(dir: BBRobotDirection, amount: number): void {
    if (!autoBiasLearn) {
        bitbot.BBBias(dir, clamp(amount, 0, 20))
        return
    }
    let extra = clamp(Math.abs(startLineBias) * 2, 0, 8)
    let learnDir = dir
    if (startLineBias < 0) {
        learnDir = BBRobotDirection.Left
    } else if (startLineBias > 0) {
        learnDir = BBRobotDirection.Right
    }
    bitbot.BBBias(learnDir, clamp(amount + extra, 0, 20))
}

function saveLastRunStats(): void {
    if (raceStartMs > 0) {
        let prevPbSec = pbRunSec
        let prevPbSpeed = pbMaxSpeed
        lastRunMaxSpeed = maxSpeedReached
        lastRunTimeSec = Math.idiv(input.runningTime() - raceStartMs, 1000)
        lastRunObstacles = obstacleCount
        lastRunLineLosses = lineLosses
        updatePersonalBest()
        if (persistenceEnabled && (pbRunSec != prevPbSec || pbMaxSpeed != prevPbSpeed)) {
            persistPB()
        }
    }
}

function getLapSeconds(): number {
    if (lapStartMs <= 0) {
        return 0
    }
    return Math.idiv(input.runningTime() - lapStartMs, 1000)
}

function calcArenaScore(): number {
    let sec = 0
    if (raceStartMs > 0) {
        sec = Math.idiv(input.runningTime() - raceStartMs, 1000)
    }
    let score = obstacleScore + maxSpeedReached * 2 - lineLosses * 30 - sec * 3
  if (score < 0) {
        score = 0
    }
    return score
}

function playCountdownTick(): void {
    music.playTone(587, music.beat(BeatFraction.Sixteenth))
}

function playGoChime(): void {
    if (!raceMusicOn) {
        return
    }
    music.playMelody("c5 e5 g5 c6", 220)
}

function playVictoryJingle(): void {
    music.playMelody("c5 e5 g5 c6 g5 e5 c5", 165)
}

function playTopScoreJingle(): void {
    music.playMelody("e5 g5 b5 e6 c6", 175)
}

function playRaceStartFanfare(): void {
    music.playMelody("g4 c5 e5 g5 e5 c5 g4", 190)
}

function playPowerUpJingle(): void {
    music.playTone(988, music.beat(BeatFraction.Eighth))
    music.playTone(1175, music.beat(BeatFraction.Eighth))
}

function playStopJingle(): void {
    music.playMelody("g4 e4 c4", 140)
}

function playMelodyByPreset(preset: number): void {
    if (preset == 0) {
        playRaceStartFanfare()
    } else if (preset == 1) {
        playVictoryJingle()
    } else if (preset == 2) {
        playTopScoreJingle()
    } else if (preset == 3) {
        playCountdownTick()
    } else if (preset == 4) {
        playStopJingle()
    } else {
        playPowerUpJingle()
    }
}

function playCustomMelodyString(melody: string, bpm: number): void {
    if (melody.length == 0) {
        return
    }
    music.playMelody(melody, clamp(bpm, 60, 320))
}

function pushRunHistory(score: number): void {
    histScore2 = histScore1
    histScore1 = histScore0
    histScore0 = score
}

function displayArenaScore(): void {
    lastArenaScore = calcArenaScore()
    pushRunHistory(lastArenaScore)
    if (lastArenaScore > bestArenaScore) {
        bestArenaScore = lastArenaScore
        basic.showString("TOP")
        if (raceMusicOn) {
            playTopScoreJingle()
        } else {
            basic.pause(400)
        }
    }
    basic.showString("PTS")
    basic.pause(300)
    basic.showNumber(lastArenaScore)
    basic.pause(500)
    basic.showString("BST")
    basic.pause(300)
    basic.showNumber(bestArenaScore)
    basic.pause(500)
}

function displayPostRunReport(): void {
    if (arenaReportOnShake) {
        displayArenaScore()
        return
    }
    basic.showNumber(getLapSeconds())
    basic.pause(500)
    basic.showNumber(maxSpeedReached)
    basic.pause(500)
    basic.showNumber(obstacleCount)
    basic.pause(500)
    basic.showNumber(lineLosses)
    basic.pause(500)
}

function showDriveStateLetter(): void {
    if (state == DriveState.FollowLine) {
        basic.showString("F")
    } else if (state == DriveState.ObstacleStop) {
        basic.showString("O")
    } else if (state == DriveState.GapRecover) {
        basic.showString("G")
    } else if (state == DriveState.LineLost || state == DriveState.SearchPivot) {
        basic.showString("S")
    }
}

function plotConfidenceBar(): void {
    let row = Math.idiv(confidence, 20)
    if (row > 4) {
        row = 4
    }
    for (let x = 0; x < 5; x++) {
        led.plot(x, 4)
    }
    for (let y = 0; y <= row; y++) {
        led.plot(2, 4 - y)
    }
}

function copyTuneToSlot(slot: number): void {
    if (slot == 0) {
        tune0_base = NORMAL_BASE_SPEED
        tune0_elite = ELITE_SPEED
        tune0_obOn = OBSTACLE_ON_CM
        tune0_obOff = OBSTACLE_OFF_CM
    } else if (slot == 1) {
        tune1_base = NORMAL_BASE_SPEED
        tune1_elite = ELITE_SPEED
        tune1_obOn = OBSTACLE_ON_CM
        tune1_obOff = OBSTACLE_OFF_CM
    } else {
        tune2_base = NORMAL_BASE_SPEED
        tune2_elite = ELITE_SPEED
        tune2_obOn = OBSTACLE_ON_CM
        tune2_obOff = OBSTACLE_OFF_CM
    }
}

function applyTuneFromSlot(slot: number): void {
    if (slot == 0) {
        NORMAL_BASE_SPEED = tune0_base
        ELITE_SPEED = tune0_elite
        OBSTACLE_ON_CM = tune0_obOn
        OBSTACLE_OFF_CM = tune0_obOff
    } else if (slot == 1) {
        NORMAL_BASE_SPEED = tune1_base
        ELITE_SPEED = tune1_elite
        OBSTACLE_ON_CM = tune1_obOn
        OBSTACLE_OFF_CM = tune1_obOff
    } else {
        NORMAL_BASE_SPEED = tune2_base
        ELITE_SPEED = tune2_elite
        OBSTACLE_ON_CM = tune2_obOn
        OBSTACLE_OFF_CM = tune2_obOff
    }
}

function miniFollowStepCore(speed: number, reverse: boolean): void {
    updateLineSensors()
    let err = computeFusedLineError(stableLeft, stableRight)
    if (reverse) {
        err = -err
    }
    let corr = miniFollowKp * err / 100
    let left = clamp(speed + corr, -100, 100)
    let right = clamp(speed - corr, -100, 100)
    if (reverse) {
        driveSmooth(-left, -right, false, false)
    } else {
        driveSmooth(left, right, false, false)
    }
}

function tickLapLed(): void {
    if (!lapLedAuto || !running) {
        return
    }
    let sec = getLapSeconds()
    if (sec != lastLapShown) {
        lastLapShown = sec
        basic.showNumber(sec)
    }
}

function tickDebugDriveLed(): void {
    if (!debugDriveLed) {
        return
    }
    if (state != lastStateShown) {
        lastStateShown = state
        showDriveStateLetter()
    }
}

function isEliteStraight(): boolean {
    return straightCount >= ELITE_STRAIGHT_LOOPS
        && wideLineCount >= WIDE_LINE_LOOPS
        && sensorQuality >= 82
        && interferenceLevel >= 65
        && Math.abs(smoothedError) < 10
        && Math.abs(lastDerivative) < 12
        && confidence >= 80
        && !sonarApproaching()
}

function getCornerBrakePercent(): number {
    let brake = 0

    if (Math.abs(lastDerivative) > CORNER_PREDICT_DERIV) {
        brake = brake + 8
    }
    if (Math.abs(smoothedError) > CORNER_PREDICT_ERROR) {
        brake = brake + 10
    }
    if (Math.abs(errorAccel) > CORNER_PREDICT_ACCEL) {
        brake = brake + 8
    }

    return clamp(brake, 0, CORNER_BRAKE_MAX)
}

function shouldVetoObstacleHit(): boolean {
    if (!sonarFusionVeto) {
        return false
    }

    if (stableLeft != 1 || stableRight != 1) {
        return false
    }

    if (straightCount < 4) {
        return false
    }

    if (sonarApproaching() && sonarQuality >= 60) {
        return false
    }

    if (isNoisySonar()) {
        return true
    }

    if (sonarCrosstalkStreak >= 1 && snapDistance > OBSTACLE_ON_CM - 3) {
        return true
    }

    return false
}

function approachSpeedPercent(distance: number): number {
    if (distance <= 0 || distance >= OBSTACLE_APPROACH_CM) {
        return 100
    }

    let span = OBSTACLE_APPROACH_CM - OBSTACLE_ON_CM
    if (span <= 0) {
        return 100
    }

    let pct = Math.idiv((distance - OBSTACLE_ON_CM) * 50, span) + 50

    if (sonarApproaching()) {
        pct -= 8
    }

    if (sonarQuality < 50) {
        pct -= 5
    }

    return clamp(pct, 40, 100)
}

function isTurboZoneActive(): boolean {
    if (input.runningTime() < turboZoneEndMs) {
        return true
    }
    if (turboAtRaceMs >= 0 && raceStartMs > 0) {
        let elapsed = input.runningTime() - raceStartMs
        if (elapsed >= turboAtRaceMs && elapsed < turboAtRaceMs + turboRaceDurationMs) {
            return true
        }
    }
    return false
}

function getFollowBaseSpeed(distance: number): number {
    if (isTurboZoneActive()) {
        return clamp(ELITE_SPEED, MIN_SPEED, 100)
    }

    if (bypassAdaptive) {
        let fixed = NORMAL_BASE_SPEED
        if (speedOverride > 0) {
            fixed = speedOverride
        } else if (isEliteStraight()) {
            fixed = ELITE_SPEED
        }
        return clamp(fixed, MIN_SPEED, 100)
    }

    if (speedOverride > 0) {
        return clamp(speedOverride, MIN_SPEED, 100)
    }

    let base = NORMAL_BASE_SPEED

    if (isEliteStraight()) {
        base = ELITE_SPEED
    } else if (confidence >= 85 && straightCount >= STRAIGHT_BOOST_LOOPS) {
        base += FAST_BOOST
    } else if (confidence >= 65 && straightCount >= Math.idiv(STRAIGHT_BOOST_LOOPS, 2)) {
        base += 6
    }

    if (confidence <= 55) {
        base -= 6
    }
    if (confidence <= 35) {
        base -= 12
    }

    let cornerBrake = getCornerBrakePercent()
    base = Math.idiv(base * (100 - cornerBrake), 100)
    base = Math.idiv(base * approachSpeedPercent(distance), 100)
    return clamp(base, MIN_SPEED, ELITE_SPEED)
}

function speedForCorrection(correction: number, base: number): number {
    if (bypassAdaptive || speedOverride > 0) {
        return base
    }

    let a = Math.abs(correction)

    if (a > 50) {
        return MIN_SPEED - 4
    }
    if (a > 35) {
        return MIN_SPEED
    }
    if (a > 18) {
        return base - 10
    }
    return base
}

// ---------------- SONAR ----------------
function tryDetectObstacle(): boolean {
    let distance = snapDistance
    let hitThreshold = OBSTACLE_ON_CM

    if (sonarApproaching() && sonarQuality >= 60) {
        hitThreshold += 2
    }

    let minQuality = SONAR_QUALITY_MIN_HIT
    if (isNoisySonar()) {
        minQuality = 65
    }

    if (distance > 0 && distance < hitThreshold && sonarQuality >= minQuality) {
        if (shouldVetoObstacleHit()) {
            obstacleHitStreak = 0
        } else {
            obstacleHitStreak++
        }
    } else {
        obstacleHitStreak = 0
    }

    if (obstacleHitStreak < requiredHitCount()) {
        return false
    }

    obstacleLatched = true
    obstacleClearStreak = 0
    obstacleCount++

    stopAll()
    enterState(DriveState.ObstacleStop)
    resetPid()

    basic.showIcon(IconNames.No)
    basic.pause(LOOP_MS)
    setConfidence(-6)
    return true
}

function tryClearObstacle(): boolean {
    stopAll()

    let distance = snapDistance

    let minQuality = SONAR_QUALITY_MIN_CLEAR
    if (isNoisySonar()) {
        minQuality = 70
    }

    if (distance >= OBSTACLE_OFF_CM && sonarQuality >= minQuality) {
        obstacleClearStreak++
    } else {
        obstacleClearStreak = 0
    }

    if (obstacleClearStreak < requiredClearCount()) {
        basic.showIcon(IconNames.No)
        basic.pause(80)
        return true
    }

    obstacleLatched = false
    obstacleHitStreak = 0
    obstacleClearStreak = 0
    obstacleScore += 10 + Math.idiv(maxSpeedReached, 5)

    playPowerUpJingle()
    basic.showIcon(IconNames.Happy)

    gapRecoverStartMs = input.runningTime()
    lostCount = 0
    arcDir = predictedSearchDir()
    lastSeenDir = arcDir
    resetPid()
    enterState(DriveState.GapRecover)

    setConfidence(3)
    basic.pause(100)
    return true
}

// ---------------- STATE HANDLERS ----------------
function doFollowLine(): void {
    let left = snapLeft
    let right = snapRight
    let distance = snapDistance

    if (lineFullyLost()) {
        lineLosses++
        lostCount = 1
        arcDir = predictedSearchDir()
        lastSeenDir = arcDir
        setConfidence(-5)
        enterState(DriveState.LineLost)
        basic.pause(LOOP_MS)
        return
    }

    if (!lineConfirmed()) {
        setConfidence(-2)
    } else {
        lostCount = 0
        setConfidence(1)
    }

    let rawError = computeFusedLineError(left, right)

    if (rawError < 0) {
        lastSeenDir = -1
        straightCount = 0
        wideLineCount = 0
    } else if (rawError > 0) {
        lastSeenDir = 1
        straightCount = 0
        wideLineCount = 0
    } else {
        straightCount++
        if (left == 1 && right == 1) {
            wideLineCount++
        } else {
            wideLineCount = 0
        }
    }

    smoothedError = ERROR_SMOOTH * rawError + (1 - ERROR_SMOOTH) * smoothedError
    smoothedError = smoothedError + getStartBiasError()
    pushErrorHistory(smoothedError)

    let rawDerivative = smoothedError - lastError
    let derivative = rawDerivative * DERIV_NEW_WEIGHT + lastDerivative * (1 - DERIV_NEW_WEIGHT)
    errorAccel = derivative - lastDerivative
    lastDerivative = derivative
    lastError = smoothedError

    if (Math.abs(smoothedError) < 8) {
        integral = 0
    } else {
        integral = clamp(integral + smoothedError / 25, -INTEGRAL_CLAMP, INTEGRAL_CLAMP)
    }

    let motorSpeed = Math.idiv(Math.abs(currentLeft) + Math.abs(currentRight), 2)
    let gains = getAdaptiveGains(Math.abs(smoothedError), Math.abs(derivative), motorSpeed)
    let kp = gains[0]
    let kd = gains[1]

    let correction = kp * smoothedError / 100 + kd * derivative + KI * integral
    correction = Math.idiv(correction * sensorQuality, 100)

    let base = getFollowBaseSpeed(distance)
    base = speedForCorrection(correction, base)

    let targetLeft = clamp(base + correction, -100, 100)
    let targetRight = clamp(base - correction, -100, 100)

    if (Math.abs(correction) > 40) {
        setConfidence(-1)
    }

    let sharpTurn = Math.abs(smoothedError) > 55 || Math.abs(derivative) > 35
    let eliteRamp = isEliteStraight()
    driveSmooth(targetLeft, targetRight, sharpTurn, eliteRamp)
    basic.pause(LOOP_MS)
}

function doGapRecover(): void {
    if (lineSeen()) {
        lostCount = 0
        enterState(DriveState.FollowLine)
        basic.pause(LOOP_MS)
        return
    }

    if (input.runningTime() - gapRecoverStartMs >= GAP_RECOVER_MS) {
        searchStartMs = input.runningTime()
        lastArcSwitchMs = searchStartMs
        arcDir = predictedSearchDir()
        lastSeenDir = arcDir
        enterState(DriveState.SearchPivot)
        basic.pause(LOOP_MS)
        return
    }

    deadReckonCm = deadReckonCm + Math.idiv(GAP_SPEED * LOOP_MS, 12)

    if (deadReckonCm > 18) {
        driveSmooth(GAP_SPEED + 2, GAP_SPEED + 2, false, false)
    } else {
        driveSmooth(GAP_SPEED, GAP_SPEED, false, false)
    }

    basic.showIcon(IconNames.Happy)
    basic.pause(LOOP_MS)
}

function doLineLost(): void {
    if (lineSeen()) {
        lostCount = 0
        enterState(DriveState.FollowLine)
        basic.pause(LOOP_MS)
        return
    }

    lostCount++
    setConfidence(-1)

    if (lostCount <= LOST_LIMIT) {
        let coast = NORMAL_BASE_SPEED - 15
        if (confidence < 45) {
            coast = NORMAL_BASE_SPEED - 20
        }
        coast = clamp(coast, 20, 70)

        // Bias coast toward last predicted line side
        let bias = Math.idiv(coast, 8) * lastSeenDir
        driveSmooth(coast + bias, coast - bias, false, false)
        basic.showIcon(IconNames.Square)
        basic.pause(LOOP_MS)
        return
    }

    searchStartMs = input.runningTime()
    lastArcSwitchMs = searchStartMs
    arcDir = predictedSearchDir()
    lastSeenDir = arcDir
    enterState(DriveState.SearchPivot)
    basic.pause(LOOP_MS)
}

function doSearchPivot(): void {
    if (lineSeen()) {
        lostCount = 0
        enterState(DriveState.FollowLine)
        basic.pause(LOOP_MS)
        return
    }

    let now = input.runningTime()

    if (now - searchStartMs >= SEARCH_TIMEOUT_MS) {
        if (now - lastArcSwitchMs >= ARC_SWITCH_MS) {
            arcDir = arcDir * -1
            lastArcSwitchMs = now
        }

        let arcSpeed = SEARCH_SPEED
        if (confidence < 35) {
            arcSpeed = 14
        }

        driveSmooth(arcSpeed * arcDir, Math.idiv(arcSpeed, 2) * arcDir, true, false)
        basic.showIcon(IconNames.Asleep)
    } else if (arcDir < 0) {
        driveSmooth(-SEARCH_SPEED, SEARCH_SPEED, true, false)
        basic.showIcon(IconNames.Confused)
    } else {
        driveSmooth(SEARCH_SPEED, -SEARCH_SPEED, true, false)
        basic.showIcon(IconNames.Confused)
    }

    basic.pause(LOOP_MS)
}

// ---------------- v5 ELITE FEATURES ----------------

let bestLapTimeSec = -1
let lastLapDeltaSec = 0
let ghostLapStartMs = 0

const CORNER_MEM_SIZE = 32
let cornerMemTimes: number[] = []
let cornerMemRecord = false
let cornerMemReplay = false
let lastCornerLogMs = -10000
let cornerMemSavedOverride = -1
let cornerMemBrakePct = 65

let preflightLastResult = "?"

let pbRunSec = -1
let pbMaxSpeed = -1

// v5.1: user-selectable model (XL default, but supports Classic / PRO / Auto)
let userSelectedModel: BBModel = BBModel.XL
let modelTuneApplied = false

// v5.1: persistent best-lap storage (survives reset on micro:bit V2)
const PERSIST_KEY_BEST_LAP = "wonderBestLap"
const PERSIST_KEY_TOP_SPEED = "wonderTopSpeed"
let persistenceEnabled = false

function setUserModel(model: BBModel): void {
    userSelectedModel = model
    modelTuneApplied = false
    bitbot.select_model(model)
}

function applyModelTune(): void {
    if (modelTuneApplied) {
        return
    }
    modelTuneApplied = true
    let m = userSelectedModel
    if (m == BBModel.Classic) {
        NORMAL_BASE_SPEED = Math.idiv(NORMAL_BASE_SPEED * 75, 100)
        ELITE_SPEED = Math.idiv(ELITE_SPEED * 75, 100)
        MIN_SPEED = Math.idiv(MIN_SPEED * 80, 100)
        KP_STRAIGHT = Math.idiv(KP_STRAIGHT * 85, 100)
        KP_TURN = Math.idiv(KP_TURN * 85, 100)
    } else if (m == BBModel.PRO) {
        NORMAL_BASE_SPEED = Math.idiv(NORMAL_BASE_SPEED * 110, 100)
        ELITE_SPEED = clamp(Math.idiv(ELITE_SPEED * 110, 100), 30, 100)
        KP_STRAIGHT = Math.idiv(KP_STRAIGHT * 120, 100)
        KP_TURN = Math.idiv(KP_TURN * 120, 100)
        KD_STRAIGHT = Math.idiv(KD_STRAIGHT * 110, 100)
        KD_TURN = Math.idiv(KD_TURN * 110, 100)
    }
}

function getDetectedModelName(): string {
    let m = bitbot.getModel()
    if (m == BBModel.Classic) return "CLAS"
    if (m == BBModel.XL) return "XL"
    if (m == BBModel.PRO) return "PRO"
    return "AUTO"
}

function enablePersistence(): void {
    persistenceEnabled = true
    let saved = settings.readNumber(PERSIST_KEY_BEST_LAP)
    if (saved && saved > 0 && saved < 10000) {
        pbRunSec = saved
    }
    let sv = settings.readNumber(PERSIST_KEY_TOP_SPEED)
    if (sv && sv > 0 && sv <= 100) {
        pbMaxSpeed = sv
    }
}

function persistPB(): void {
    if (!persistenceEnabled) {
        return
    }
    if (pbRunSec > 0) {
        settings.writeNumber(PERSIST_KEY_BEST_LAP, pbRunSec)
    }
    if (pbMaxSpeed > 0) {
        settings.writeNumber(PERSIST_KEY_TOP_SPEED, pbMaxSpeed)
    }
}

function clearPersistedPB(): void {
    pbRunSec = -1
    pbMaxSpeed = -1
    if (persistenceEnabled) {
        settings.writeNumber(PERSIST_KEY_BEST_LAP, 0)
        settings.writeNumber(PERSIST_KEY_TOP_SPEED, 0)
    }
}

// v5.1: famous game/movie melodies (transcribed for buzzer monophonic)
function playMarioCoin(): void {
    music.playTone(988, music.beat(BeatFraction.Sixteenth))
    music.playTone(1319, music.beat(BeatFraction.Quarter))
}

function playStarWars(): void {
    music.playMelody("d4 d4 d4 g4 d5 c5 b4 a4 g5 d5 c5 b4 a4 g5", 180)
}

function playTetris(): void {
    music.playMelody("e5 b4 c5 d5 c5 b4 a4 a4 c5 e5 d5 c5 b4 c5 d5 e5", 200)
}

function playPirates(): void {
    music.playMelody("d4 e4 f4 f4 f4 g4 a4 a4 a4 b4 c5 c5 c5 b4 a4 b4 g4", 180)
}

function playFinalCountdown(): void {
    music.playMelody("e5 d5 e5 b4 c5 b4 c5 e5 a4 g4 a4 b4 a4 b4 c5", 200)
}

function autoCelebrate(): void {
    basic.showIcon(IconNames.Heart)
    basic.pause(200)
    basic.showString("PB!")
    basic.pause(200)
    if (raceMusicOn) {
        playVictoryJingle()
    }
    for (let i = 0; i < 3; i++) {
        led.plot(2, 2)
        basic.pause(80)
        basic.clearScreen()
        basic.pause(80)
    }
    basic.showIcon(IconNames.Yes)
}

function ghostLapBegin(): void {
    ghostLapStartMs = input.runningTime()
    basic.showString("L")
    basic.pause(150)
    basic.clearScreen()
}

function ghostLapEnd(): void {
    if (ghostLapStartMs <= 0) {
        basic.showIcon(IconNames.No)
        return
    }
    let sec = Math.idiv(input.runningTime() - ghostLapStartMs, 1000)
    if (bestLapTimeSec < 0) {
        bestLapTimeSec = sec
        lastLapDeltaSec = 0
        basic.showString("PB")
        basic.pause(300)
        basic.showNumber(sec)
        basic.pause(400)
        return
    }
    lastLapDeltaSec = sec - bestLapTimeSec
    if (sec < bestLapTimeSec) {
        bestLapTimeSec = sec
        basic.showString("PB")
        basic.pause(300)
    }
    if (lastLapDeltaSec < 0) {
        basic.showArrow(ArrowNames.North)
    } else if (lastLapDeltaSec > 0) {
        basic.showArrow(ArrowNames.South)
    } else {
        basic.showIcon(IconNames.Yes)
    }
    basic.pause(250)
    basic.showNumber(sec)
}

function getBestLapSec(): number { return bestLapTimeSec }
function getLastLapDeltaSec(): number { return lastLapDeltaSec }
function clearBestLap(): void {
    bestLapTimeSec = -1
    lastLapDeltaSec = 0
}

function startCornerLearn(): void {
    cornerMemTimes = []
    cornerMemRecord = true
    cornerMemReplay = false
    lastCornerLogMs = -10000
    if (lapStartMs <= 0) {
        lapStartMs = input.runningTime()
    } else {
        lapStartMs = input.runningTime()
    }
    basic.showString("LRN")
    basic.pause(200)
}

function stopCornerLearn(): void {
    cornerMemRecord = false
    basic.showString("OK")
    basic.pause(200)
    basic.showNumber(cornerMemTimes.length)
    basic.pause(400)
}

function enableCornerReplay(on: boolean): void {
    cornerMemReplay = on
    if (on) {
        lapStartMs = input.runningTime()
    }
    if (!on && cornerMemSavedOverride != -1) {
        speedOverride = cornerMemSavedOverride
        cornerMemSavedOverride = -1
    }
}

function clearCornerMemory(): void {
    cornerMemTimes = []
    lastCornerLogMs = -10000
}

function getCornerMemoryCount(): number {
    return cornerMemTimes.length
}

function setCornerMemBrakePercent(pct: number): void {
    cornerMemBrakePct = clamp(pct, 30, 95)
}

function tickRecordCorners(): void {
    if (!cornerMemRecord || lapStartMs <= 0) {
        return
    }
    if (state != DriveState.FollowLine) {
        return
    }
    let nowFromLap = input.runningTime() - lapStartMs
    if (Math.abs(smoothedError) < CORNER_PREDICT_ERROR && Math.abs(lastDerivative) < CORNER_PREDICT_DERIV) {
        return
    }
    if (nowFromLap - lastCornerLogMs < 350) {
        return
    }
    if (cornerMemTimes.length >= CORNER_MEM_SIZE) {
        return
    }
    cornerMemTimes.push(nowFromLap)
    lastCornerLogMs = nowFromLap
}

function tickReplayCorners(): void {
    if (!cornerMemReplay || lapStartMs <= 0) {
        return
    }
    let nowFromLap = input.runningTime() - lapStartMs
    let braking = false
    for (let i = 0; i < cornerMemTimes.length; i++) {
        let t = cornerMemTimes[i]
        if (nowFromLap > t - 100 && nowFromLap < t + 200) {
            braking = true
            break
        }
    }
    if (braking && cornerMemSavedOverride == -1) {
        cornerMemSavedOverride = speedOverride
        speedOverride = clamp(Math.idiv(NORMAL_BASE_SPEED * cornerMemBrakePct, 100), 20, 70)
    } else if (!braking && cornerMemSavedOverride != -1) {
        speedOverride = cornerMemSavedOverride
        cornerMemSavedOverride = -1
    }
}

function runAutoTune(dir: BBRobotDirection, bias: number): number {
    classroomReady(dir, bias)
    setRobotSlow()
    let speeds = [35, 50, 65]
    let losses0 = 0
    let losses1 = 0
    let losses2 = 0
    for (let i = 0; i < 3; i++) {
        basic.showString("T")
        basic.pause(150)
        basic.showNumber(i + 1)
        basic.pause(250)
        lineLosses = 0
        let end = input.runningTime() + 8000
        while (input.runningTime() < end) {
            miniFollowStepCore(speeds[i], false)
            basic.pause(LOOP_MS)
        }
        stopAll()
        if (i == 0) {
            losses0 = lineLosses
        } else if (i == 1) {
            losses1 = lineLosses
        } else {
            losses2 = lineLosses
        }
        basic.pause(700)
    }
    let bestIdx = 0
    let bestLoss = losses0
    if (losses1 < bestLoss || (losses1 == bestLoss && speeds[1] > speeds[bestIdx])) {
        bestLoss = losses1
        bestIdx = 1
    }
    if (losses2 < bestLoss || (losses2 == bestLoss && speeds[2] > speeds[bestIdx])) {
        bestLoss = losses2
        bestIdx = 2
    }
    NORMAL_BASE_SPEED = speeds[bestIdx]
    ELITE_SPEED = clamp(speeds[bestIdx] + 20, 30, 100)
    basic.showString("PICK")
    basic.pause(300)
    basic.showNumber(speeds[bestIdx])
    basic.pause(500)
    return speeds[bestIdx]
}

function runPreflightCheck(): string {
    let issues = ""
    bitbot.select_model(BBModel.XL)
    primeSonarInstant()
    updateLineSensors()
    basic.showString("CHK")
    basic.pause(300)
    let d = getSonarInstantCm()
    if (d <= 0 || d > 200) {
        issues = issues + "S"
    }
    driveSmooth(28, 28, false, false)
    basic.pause(450)
    stopAll()
    let leftScan = false
    let rightScan = false
    let t0 = input.runningTime()
    while (input.runningTime() - t0 < 1500) {
        updateLineSensors()
        if (stableLeft == 1) {
            leftScan = true
        }
        if (stableRight == 1) {
            rightScan = true
        }
        basic.pause(80)
    }
    if (!leftScan) {
        issues = issues + "L"
    }
    if (!rightScan) {
        issues = issues + "R"
    }
    if (issues.length == 0) {
        preflightLastResult = "GO"
        basic.showIcon(IconNames.Yes)
        basic.pause(400)
        basic.showString("GO")
        basic.pause(300)
    } else {
        preflightLastResult = issues
        basic.showIcon(IconNames.No)
        basic.pause(400)
        basic.showString(issues)
        basic.pause(400)
    }
    return preflightLastResult
}

function getPreflightResult(): string {
    return preflightLastResult
}

function runRaceCoach(): void {
    basic.showString("COACH")
    basic.pause(300)
    if (startLineBias <= -2) {
        basic.showString("BIAS R")
        basic.pause(350)
        basic.showNumber(Math.abs(startLineBias) * 2)
        basic.pause(450)
    } else if (startLineBias >= 2) {
        basic.showString("BIAS L")
        basic.pause(350)
        basic.showNumber(startLineBias * 2)
        basic.pause(450)
    } else {
        basic.showString("BIAS OK")
        basic.pause(300)
    }
    if (lineLosses >= 3) {
        basic.showString("SLOW")
        basic.pause(300)
    } else if (lineLosses == 0 && maxSpeedReached < 75) {
        basic.showString("FASTER")
        basic.pause(300)
    } else {
        basic.showString("PACE OK")
        basic.pause(300)
    }
    if (obstacleCount >= 2) {
        basic.showString("OBS+")
        basic.pause(300)
        basic.showNumber(obstacleCount)
        basic.pause(400)
    }
    basic.showIcon(IconNames.Heart)
    basic.pause(300)
}

function updatePersonalBest(): void {
    if (raceStartMs <= 0) {
        return
    }
    let sec = Math.idiv(input.runningTime() - raceStartMs, 1000)
    if (sec > 0 && (pbRunSec < 0 || (sec < pbRunSec && lineLosses < 3))) {
        pbRunSec = sec
    }
    if (maxSpeedReached > pbMaxSpeed) {
        pbMaxSpeed = maxSpeedReached
    }
}

function getPersonalBestSec(): number {
    return pbRunSec
}

function getPersonalBestSpeed(): number {
    return pbMaxSpeed
}

function clearPersonalBest(): void {
    pbRunSec = -1
    pbMaxSpeed = -1
}

function showPersonalBest(): void {
    basic.showString("PB T")
    basic.pause(250)
    if (pbRunSec >= 0) {
        basic.showNumber(pbRunSec)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(400)
    basic.showString("PB S")
    basic.pause(250)
    if (pbMaxSpeed >= 0) {
        basic.showNumber(pbMaxSpeed)
    } else {
        basic.showIcon(IconNames.No)
    }
    basic.pause(400)
}

function showBootBannerV5(): void {
    basic.showString("WONDER v5")
    basic.pause(150)
    basic.showIcon(IconNames.Heart)
    basic.pause(300)
}

function runLiveSpeedometer(seconds: number): void {
    let end = input.runningTime() + clamp(seconds, 1, 60) * 1000
    while (input.runningTime() < end) {
        let s = Math.idiv(Math.abs(currentLeft) + Math.abs(currentRight), 2)
        basic.showNumber(s)
        basic.pause(400)
    }
}

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

}
