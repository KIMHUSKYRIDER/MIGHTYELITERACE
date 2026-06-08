/**
 * Wonder API for paste-only projects (no extension).
 */
namespace wonder {
    export function selectModel(model: BBModel): void { wonderracer.setModel(model) }
    export function prepareRacer(model: BBModel, dir: BBRobotDirection, amount: number): void {
        wonderracer.prepareRacer(model, dir, amount)
    }
    export function disableRadio(): void { radio.off() }
    export function tuningPreset(preset: number): void { wonderracer.applyTuningPreset(preset) }
    export function raceProfile(profile: number): void { wonderracer.applyRaceProfile(profile) }
    export function setBaseSpeed(speed: number): void { wonderracer.setBaseSpeed(speed) }
    export function setEliteSpeed(speed: number): void { wonderracer.setEliteSpeed(speed) }
    export function setMinSpeed(speed: number): void { wonderracer.setMinSpeed(speed) }
    export function forceSpeed(speed: number): void { wonderracer.setSpeedOverride(speed) }
    export function bypassAdaptiveSpeed(on: boolean): void { wonderracer.setBypassAdaptive(on) }
    export function useAdaptiveSpeed(): void { wonderracer.clearSpeedOverride() }
    export function setPidStraight(kp: number, kd: number): void { wonderracer.setPidStraight(kp, kd) }
    export function setPidTurn(kp: number, kd: number): void { wonderracer.setPidTurn(kp, kd) }
    export function setObstacle(onCm: number, offCm: number): void { wonderracer.setObstacleCm(onCm, offCm) }
    export function setCountdown(seconds: number): void { wonderracer.setCountdown(seconds) }
    export function startEliteRacer(dir: BBRobotDirection, amount: number): void {
        wonderracer.startEliteRacer(dir, amount)
    }
    export function startMightyRacer(profile: number, dir: BBRobotDirection, amount: number): void {
        wonderracer.startMightyRacer(profile, dir, amount)
    }
    export function emergencyStop(): void { wonderracer.emergencyStop() }
    export function softReset(): void { wonderracer.softResetRace() }
    export function setCornerBrake(pct: number): void { wonderracer.setCornerBrakeMax(pct) }
    export function setGapRecover(ms: number): void { wonderracer.setGapRecoverMs(ms) }
    export function setGapSpeed(speed: number): void { wonderracer.setGapSpeed(speed) }
    export function setSearchSpeed(speed: number): void { wonderracer.setSearchSpeed(speed) }
    export function setSearchTimeout(ms: number): void { wonderracer.setSearchTimeoutMs(ms) }
    export function setLineLossLimit(count: number): void { wonderracer.setLostLimit(count) }
    export function setEliteStraightLoops(loops: number): void { wonderracer.setEliteStraightLoops(loops) }
    export function setSonarFusionVeto(on: boolean): void { wonderracer.setSonarFusionVeto(on) }
    export function scanSensors(): void { wonderracer.scanSensorsNow() }
    export function linePosition(): number { return wonderracer.getLinePosition() }
    export function sonarDistance(): number { return wonderracer.getSonarCm() }
    export function lineQuality(): number { return wonderracer.getSensorQuality() }
    export function sonarQuality(): number { return wonderracer.getSonarQuality() }
    export function interference(): number { return wonderracer.getInterference() }
    export function confidence(): number { return wonderracer.getConfidence() }
    export function obstacleCount(): number { return wonderracer.getObstacleCount() }
    export function maxSpeed(): number { return wonderracer.getMaxSpeed() }
    export function currentSpeed(): number { return wonderracer.getCurrentSpeed() }
    export function speedOverrideActive(): number { return wonderracer.getSpeedOverride() }
    export function bypassAdaptiveOn(): boolean { return wonderracer.isBypassAdaptive() }
    export function showSpeedOnLed(): void { wonderracer.showSpeedNow() }
    export function eliteMode(): boolean { return wonderracer.isEliteMode() }
    export function isRunning(): boolean { return wonderracer.isRunning() }
    export function lineLeftOn(): boolean { return wonderracer.isLineLeft() }
    export function lineRightOn(): boolean { return wonderracer.isLineRight() }
    export function lineSeen(): boolean { return wonderracer.isLineSeen() }
    export function lineConfirmed(): boolean { return wonderracer.isLineConfirmed() }
    export function atObstacle(): boolean { return wonderracer.isAtObstacle() }
    export function searching(): boolean { return wonderracer.isSearching() }
    export function driveStateIs(state: number): boolean { return wonderracer.getDriveState() == state }
    export function lineLosses(): number { return wonderracer.getLineLosses() }
    export function runTimeSec(): number { return wonderracer.getRunTimeSec() }
    export function approachingObstacle(): boolean { return wonderracer.isApproachingObstacle() }
}
