/**
 * Wonder Extras — competition, debug, and demo blocks (v4)
 */

enum WonderTuneSlot {
    //% block="slow (practice)"
    Slow = 0,
    //% block="medium"
    Medium = 1,
    //% block="race (fast)"
    Race = 2,
}

//% color=#DC2626 weight=94 icon="\uf091"
//% groups=["Race", "Lap", "Tune", "Turbo", "Report", "Debug", "Demo"]
namespace wonderextras {

    // ========== RACE (one block — no paste issues) ==========

    //% block="RACE WIN start|balance $dir by $amount"
    //% group="Race"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startRaceWin(dir: BBRobotDirection, amount: number): void {
        wonderracer.startRaceWin(dir, amount)
    }

    //% block="RACE practice tune|balance $dir by $amount|A up B down A+B save"
    //% group="Race"
    //% weight=119
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startRacePractice(dir: BBRobotDirection, amount: number): void {
        wonderracer.startRacePractice(dir, amount)
    }

    // ========== LAP ==========

    //% block="lap timer LED on"
    //% group="Lap"
    export function lapTimerLedOn(): void {
        wonderracer.enableLapTimerLed(true)
    }

    //% block="lap timer LED off"
    //% group="Lap"
    export function lapTimerLedOff(): void {
        wonderracer.enableLapTimerLed(false)
    }

    //% block="show lap seconds on LED"
    //% group="Lap"
    export function showLapTime(): void {
        wonderracer.showLapSecondsOnLed()
    }

    //% block="reset lap timer"
    //% group="Lap"
    export function resetLap(): void {
        wonderracer.resetLapTimer()
    }

    //% block="auto bias learn on"
    //% group="Lap"
    export function autoBiasOn(): void {
        wonderracer.setAutoBiasLearn(true)
    }

    //% block="auto bias learn off"
    //% group="Lap"
    export function autoBiasOff(): void {
        wonderracer.setAutoBiasLearn(false)
    }

    // ========== TUNE ==========

    //% block="save tune %slot"
    //% group="Tune"
    export function saveTune(slot: WonderTuneSlot): void {
        wonderracer.saveTune(slot)
    }

    //% block="load tune %slot"
    //% group="Tune"
    export function loadTune(slot: WonderTuneSlot): void {
        wonderracer.loadTune(slot)
    }

    // ========== TURBO ==========

    //% block="turbo zone elite speed for %ms ms"
    //% group="Turbo"
    //% ms.min=200 ms.max=15000 ms.defl=2000
    export function turboZone(ms: number): void {
        wonderracer.activateTurboZone(ms)
    }

    //% block="turbo on straight at %startMs ms after GO for %durationMs ms"
    //% group="Turbo"
    //% startMs.min=0 startMs.max=120000 startMs.defl=8000
    //% durationMs.min=200 durationMs.max=15000 durationMs.defl=2500
    export function turboAtRaceMs(startMs: number, durationMs: number): void {
        wonderracer.turboZoneAtRaceMs(startMs, durationMs)
    }

    // ========== REPORT ==========

    //% block="show post-run report (shake also)"
    //% group="Report"
    export function postRunReport(): void {
        wonderracer.showPostRunReport()
    }

    //% block="last run max speed"
    //% group="Report"
    export function lastRunMaxSpeed(): number {
        return wonderracer.getLastRunMaxSpeed()
    }

    //% block="compare max speed (this minus last)"
    //% group="Report"
    export function compareMaxSpeed(): number {
        return wonderracer.compareMaxSpeedDelta()
    }

    //% block="show compare runs on LED"
    //% group="Report"
    export function showCompareRuns(): void {
        wonderracer.showCompareRuns()
    }

    //% block="obstacle score"
    //% group="Report"
    export function obstacleScore(): number {
        return wonderracer.getObstacleScore()
    }

    // ========== DEBUG ==========

    //% block="live tune on A+B speed (A up B down)"
    //% group="Debug"
    export function liveTuneOn(): void {
        wonderracer.setLiveTuneMode(true)
    }

    //% block="live tune off (A speed B stop)"
    //% group="Debug"
    export function liveTuneOff(): void {
        wonderracer.setLiveTuneMode(false)
    }

    //% block="drive state letters on LED (F O G S)"
    //% group="Debug"
    export function driveStateLedOn(): void {
        wonderracer.setDebugDriveLed(true)
    }

    //% block="drive state letters off"
    //% group="Debug"
    export function driveStateLedOff(): void {
        wonderracer.setDebugDriveLed(false)
    }

    //% block="show drive state letter now"
    //% group="Debug"
    export function showDriveState(): void {
        wonderracer.showDriveStateOnLed()
    }

    //% block="graph confidence bar on LED"
    //% group="Debug"
    export function graphConfidence(): void {
        wonderracer.graphConfidenceOnLed()
    }

    // ========== DEMO ==========

    //% block="demo figure-8 drive"
    //% group="Demo"
    export function figure8(): void {
        wonderracer.demoFigure8()
    }

    //% block="demo zigzag drive"
    //% group="Demo"
    export function zigzag(): void {
        wonderracer.demoZigzag()
    }

    //% block="reverse line follow %speed for %ms ms"
    //% group="Demo"
    //% speed.min=10 speed.max=50 speed.defl=25
    //% ms.min=500 ms.max=60000 ms.defl=5000
    export function reverseFollow(speed: number, ms: number): void {
        wonderracer.runReverseFollowMs(speed, ms)
    }
}
