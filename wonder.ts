/**
 * BitBot Wonder — MakeCode blocks (Wonder-style easy blocks)
 */

enum WonderTuning {
    //% block="safe (practice)"
    Safe = 0,
    //% block="competition"
    Competition = 1,
    //% block="elite (max speed)"
    Elite = 2,
}

enum WonderDriveState {
    //% block="stopped"
    WsStopped = 0,
    //% block="following line"
    WsFollowLine = 1,
    //% block="obstacle stop"
    WsObstacleStop = 2,
    //% block="gap recover"
    WsGapRecover = 3,
    //% block="line lost"
    WsLineLost = 4,
    //% block="search pivot"
    WsSearchPivot = 5,
}

//% color=#7C3AED weight=96 icon="\uf135" advanced=true
//% groups=["Setup", "Speed", "Obstacles", "Race", "Sensors", "Status"]
namespace wonder {

    // ========== SETUP ==========

    /**
     * Pick BitBot model before starting the race.
     */
    //% block="Wonder select model %model"
    //% group="Setup"
    //% model.fieldEditor="grid"
    export function selectModel(model: BBModel): void {
        wonderracer.setModel(model)
    }

    /**
     * Calibrate left/right motor balance (run before start).
     */
    //% block="Wonder prepare racer|model %model|bias $dir by $amount"
    //% group="Setup"
    //% model.fieldEditor="grid"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function prepareRacer(model: BBModel, dir: BBRobotDirection, amount: number): void {
        wonderracer.prepareRacer(model, dir, amount)
    }

    //% block="Wonder disable radio (crowded hall)"
    //% group="Setup"
    export function disableRadio(): void {
        radio.off()
    }

    //% block="Wonder tuning preset %preset"
    //% group="Setup"
    export function tuningPreset(preset: WonderTuning): void {
        wonderracer.applyTuningPreset(preset)
    }

    // ========== SPEED ==========

    //% block="Wonder set base speed %speed"
    //% group="Speed"
    //% speed.min=20 speed.max=90 speed.defl=58
    export function setBaseSpeed(speed: number): void {
        wonderracer.setBaseSpeed(speed)
    }

    //% block="Wonder set elite speed %speed"
    //% group="Speed"
    //% speed.min=30 speed.max=100 speed.defl=82
    export function setEliteSpeed(speed: number): void {
        wonderracer.setEliteSpeed(speed)
    }

    //% block="Wonder set min speed %speed"
    //% group="Speed"
    //% speed.min=10 speed.max=60 speed.defl=30
    export function setMinSpeed(speed: number): void {
        wonderracer.setMinSpeed(speed)
    }

    //% block="Wonder set PID straight|Kp %kp|Kd %kd"
    //% group="Speed"
    //% kp.min=5 kp.max=50 kp.defl=18
    //% kd.min=5 kd.max=40 kd.defl=11
    export function setPidStraight(kp: number, kd: number): void {
        wonderracer.setPidStraight(kp, kd)
    }

    //% block="Wonder set PID turn|Kp %kp|Kd %kd"
    //% group="Speed"
    //% kp.min=10 kp.max=60 kp.defl=30
    //% kd.min=10 kd.max=50 kd.defl=18
    export function setPidTurn(kp: number, kd: number): void {
        wonderracer.setPidTurn(kp, kd)
    }

    // ========== OBSTACLES ==========

    //% block="Wonder set obstacle|stop at %onCm cm|clear at %offCm cm"
    //% group="Obstacles"
    //% onCm.min=8 onCm.max=40 onCm.defl=14
    //% offCm.min=10 offCm.max=50 offCm.defl=18
    export function setObstacle(onCm: number, offCm: number): void {
        wonderracer.setObstacleCm(onCm, offCm)
    }

    // ========== RACE ==========

    //% block="Wonder start countdown %seconds sec"
    //% group="Race"
    //% seconds.min=0 seconds.max=9 seconds.defl=3
    export function setCountdown(seconds: number): void {
        wonderracer.setCountdown(seconds)
    }

    /**
     * Start the full autonomous elite racer (countdown, buttons, forever loop).
     */
    //% block="Wonder start elite racer|bias $dir by $amount"
    //% group="Race"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    //% blockGap=16
    export function startEliteRacer(dir: BBRobotDirection, amount: number): void {
        wonderracer.startEliteRacer(dir, amount)
    }

    //% block="Wonder emergency stop"
    //% group="Race"
    export function emergencyStop(): void {
        wonderracer.emergencyStop()
    }

    //% block="Wonder soft reset race"
    //% group="Race"
    export function softReset(): void {
        wonderracer.softResetRace()
    }

    // ========== SENSORS ==========

    //% block="Wonder scan sensors"
    //% group="Sensors"
    export function scanSensors(): void {
        wonderracer.scanSensorsNow()
    }

    //% block="Wonder line position"
    //% group="Sensors"
    export function linePosition(): number {
        return wonderracer.getLinePosition()
    }

    //% block="Wonder sonar distance (cm)"
    //% group="Sensors"
    export function sonarDistance(): number {
        return wonderracer.getSonarCm()
    }

    //% block="Wonder line sensor quality"
    //% group="Sensors"
    export function lineQuality(): number {
        return wonderracer.getSensorQuality()
    }

    //% block="Wonder sonar quality"
    //% group="Sensors"
    export function sonarQuality(): number {
        return wonderracer.getSonarQuality()
    }

    //% block="Wonder interference level"
    //% group="Sensors"
    export function interference(): number {
        return wonderracer.getInterference()
    }

    // ========== STATUS ==========

    //% block="Wonder confidence"
    //% group="Status"
    export function confidence(): number {
        return wonderracer.getConfidence()
    }

    //% block="Wonder obstacle count"
    //% group="Status"
    export function obstacleCount(): number {
        return wonderracer.getObstacleCount()
    }

    //% block="Wonder max speed reached"
    //% group="Status"
    export function maxSpeed(): number {
        return wonderracer.getMaxSpeed()
    }

    //% block="Wonder elite mode active"
    //% group="Status"
    export function eliteMode(): boolean {
        return wonderracer.isEliteMode()
    }

    //% block="Wonder racer running"
    //% group="Status"
    export function isRunning(): boolean {
        return wonderracer.isRunning()
    }

    //% block="Wonder line left on"
    //% group="Status"
    export function lineLeftOn(): boolean {
        return wonderracer.isLineLeft()
    }

    //% block="Wonder line right on"
    //% group="Status"
    export function lineRightOn(): boolean {
        return wonderracer.isLineRight()
    }

    //% block="Wonder line seen"
    //% group="Status"
    export function lineSeen(): boolean {
        return wonderracer.isLineSeen()
    }

    //% block="Wonder line confirmed"
    //% group="Status"
    export function lineConfirmed(): boolean {
        return wonderracer.isLineConfirmed()
    }

    //% block="Wonder at obstacle"
    //% group="Status"
    export function atObstacle(): boolean {
        return wonderracer.isAtObstacle()
    }

    //% block="Wonder searching for line"
    //% group="Status"
    export function searching(): boolean {
        return wonderracer.isSearching()
    }

    //% block="Wonder drive state is %state"
    //% group="Status"
    export function driveStateIs(state: WonderDriveState): boolean {
        return wonderracer.getDriveState() == state
    }

    //% block="Wonder line losses"
    //% group="Status"
    export function lineLosses(): number {
        return wonderracer.getLineLosses()
    }
}
