/**
 * Wonder Elite v5 — the racing edge nobody else has
 * Ghost Lap, Corner Memory, Auto-Tune, Pre-flight, Race Coach, Personal Best
 */

//% color=#E11D48 weight=100 icon="\uf0e7"
//% groups=["Ultimate", "Ghost lap", "Corner memory", "Auto-tune", "Pre-flight", "Coach", "PB", "Polish"]
namespace wonderelite {

    // ========== ULTIMATE ONE-BLOCK ==========

    //% block="WONDER V5 ultimate racer|balance $dir by $amount|pre-flight + corner replay + tune + music + lap LED"
    //% group="Ultimate"
    //% weight=200
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function ultimateV5(dir: BBRobotDirection, amount: number): void {
        wonderracer.startWonderV5(dir, amount)
    }

    //% block="LEARN lap then race|balance $dir by $amount|25s slow lap to learn corners"
    //% group="Ultimate"
    //% weight=190
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function learnThenRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.startLearnLap(dir, amount)
        wonderracer.startWonderV5(dir, amount)
    }

    // ========== GHOST LAP ==========

    //% block="ghost lap start"
    //% group="Ghost lap"
    //% weight=120
    export function ghostStart(): void {
        wonderracer.ghostLapStart()
    }

    //% block="ghost lap finish (show delta)"
    //% group="Ghost lap"
    //% weight=119
    export function ghostFinish(): void {
        wonderracer.ghostLapFinish()
    }

    //% block="best lap seconds"
    //% group="Ghost lap"
    //% weight=110
    export function bestLap(): number {
        return wonderracer.getBestLap()
    }

    //% block="last lap delta seconds (- is faster)"
    //% group="Ghost lap"
    //% weight=109
    export function lastDelta(): number {
        return wonderracer.getLastLapDelta()
    }

    //% block="clear best lap"
    //% group="Ghost lap"
    //% weight=100
    export function ghostClear(): void {
        wonderracer.clearGhostLap()
    }

    // ========== CORNER MEMORY ==========

    //% block="learn corners ON (drive a practice lap)"
    //% group="Corner memory"
    //% weight=120
    export function learnCornersOn(): void {
        wonderracer.cornerLearnStart()
    }

    //% block="learn corners OFF (save what we found)"
    //% group="Corner memory"
    //% weight=119
    export function learnCornersOff(): void {
        wonderracer.cornerLearnStop()
    }

    //% block="replay learned corners ON (race lap)"
    //% group="Corner memory"
    //% weight=118
    export function replayOn(): void {
        wonderracer.cornerReplayOn()
    }

    //% block="replay learned corners OFF"
    //% group="Corner memory"
    //% weight=117
    export function replayOff(): void {
        wonderracer.cornerReplayOff()
    }

    //% block="corners memorized"
    //% group="Corner memory"
    //% weight=110
    export function cornersFound(): number {
        return wonderracer.cornerMemoryCount()
    }

    //% block="clear corner memory"
    //% group="Corner memory"
    //% weight=105
    export function clearCorners(): void {
        wonderracer.cornerMemoryClear()
    }

    //% block="corner brake strength %pct percent of normal"
    //% group="Corner memory"
    //% pct.min=30 pct.max=95 pct.defl=65
    //% weight=100
    export function brakeStrength(pct: number): void {
        wonderracer.cornerBrakeStrength(pct)
    }

    // ========== AUTO-TUNE ==========

    //% block="AUTO-TUNE base speed|balance $dir by $amount|tries 3 speeds picks best"
    //% group="Auto-tune"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function autoTune(dir: BBRobotDirection, amount: number): number {
        return wonderracer.autoTune(dir, amount)
    }

    // ========== PRE-FLIGHT ==========

    //% block="run pre-flight check"
    //% group="Pre-flight"
    //% weight=120
    export function preflight(): string {
        return wonderracer.preflight()
    }

    //% block="last pre-flight result"
    //% group="Pre-flight"
    //% weight=110
    export function preflightResult(): string {
        return wonderracer.preflightResult()
    }

    //% block="pre-flight passed (GO)"
    //% group="Pre-flight"
    //% weight=105
    export function preflightOk(): boolean {
        return wonderracer.preflightOk()
    }

    // ========== RACE COACH ==========

    //% block="race coach review (bias, pace, obstacles)"
    //% group="Coach"
    //% weight=120
    export function coach(): void {
        wonderracer.coachReview()
    }

    // ========== PERSONAL BEST ==========

    //% block="show personal best (time + speed)"
    //% group="PB"
    //% weight=120
    export function showPb(): void {
        wonderracer.pbShow()
    }

    //% block="PB best seconds"
    //% group="PB"
    //% weight=110
    export function pbSec(): number {
        return wonderracer.pbBestSec()
    }

    //% block="PB top speed"
    //% group="PB"
    //% weight=109
    export function pbSpeed(): number {
        return wonderracer.pbTopSpeed()
    }

    //% block="clear personal best"
    //% group="PB"
    //% weight=100
    export function clearPb(): void {
        wonderracer.pbClear()
    }

    // ========== POLISH ==========

    //% block="WONDER v5 boot banner"
    //% group="Polish"
    //% weight=120
    export function bootBanner(): void {
        wonderracer.bootBannerV5()
    }

    //% block="live speedometer for %seconds seconds"
    //% group="Polish"
    //% seconds.min=1 seconds.max=60 seconds.defl=10
    //% weight=110
    export function speedo(seconds: number): void {
        wonderracer.speedometerLive(seconds)
    }
}
