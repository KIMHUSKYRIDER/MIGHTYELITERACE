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
const ELITE_STRAIGHT_LOOPS = 14
const WIDE_LINE_LOOPS = 10
const CORNER_PREDICT_DERIV = 26
const CORNER_PREDICT_ERROR = 42
const CORNER_PREDICT_ACCEL = 14
const CORNER_BRAKE_MAX = 22
const START_BIAS_MS = 2500
const START_BIAS_GAIN = 6

const GAP_SPEED = 24
const SEARCH_SPEED = 16
const SEARCH_TIMEOUT_MS = 1400
const ARC_SWITCH_MS = 350
const GAP_RECOVER_MS = 350

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

const LOST_LIMIT = 12
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
    // Autonomous racer: kill micro:bit radio so other teams' packets cannot affect us.
    radio.off()
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

function readSonarBurstCm(): number {
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

function primeSensors(): void {
    let i = 0
    while (i < 2) {
        updateLineSensors()
        readSonarBurstCm()
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

function getFollowBaseSpeed(distance: number): number {
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

    music.playTone(988, music.beat(BeatFraction.Eighth))
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

namespace wonderracer {
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

    export function prepareRacer(model: BBModel, dir: BBRobotDirection, bias: number): void {
        raceModel = model
        initAntiInterference()
        bitbot.select_model(model)
        bitbot.BBBias(dir, clamp(bias, 0, 20))
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
        enterState(DriveState.FollowLine)
        basic.showIcon(IconNames.Yes)
    }

    function registerInputs(): void {
        input.onButtonPressed(Button.B, function () {
            emergencyStop()
        })
        input.onButtonPressed(Button.AB, function () {
            softResetRace()
        })
        input.onButtonPressed(Button.A, function () {
            if (isEliteStraight()) basic.showString("E")
            else basic.showNumber(interferenceLevel)
            basic.pause(350)
            basic.showNumber(sonarQuality)
            basic.pause(350)
            basic.showNumber(sensorQuality)
        })
        input.onLogoEvent(TouchButtonEvent.Pressed, function () {
            basic.showNumber(confidence)
        })
        input.onGesture(Gesture.Shake, function () {
            basic.showNumber(maxSpeedReached)
            basic.pause(400)
            basic.showNumber(obstacleCount)
        })
    }

    function startupSequence(): void {
        basic.showString("READY")
        basic.pause(300)
        for (let i = countdownSec; i > 0; i--) {
            basic.showNumber(i)
            sampleStartLineBias()
            basic.pause(300)
            sampleStartLineBias()
            basic.pause(300)
        }
        basic.showIcon(IconNames.Heart)
        basic.pause(300)
        primeSensors()
        raceStartMs = input.runningTime()
        enterState(DriveState.FollowLine)
    }

    function mainLoop(): void {
        basic.forever(function () {
            if (!running) { stopAll(); basic.pause(50); return }
            scanAllSensors()
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
        prepareRacer(raceModel, dir, bias)
        registerInputs()
        startupSequence()
        mainLoop()
    }

    export function scanSensorsNow(): void { scanAllSensors() }
}

}
