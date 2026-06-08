/**
 * Wonder Stats — dashboard and run history
 */

//% color=#475569 weight=84 icon="\uf201"
//% groups=["Dashboard", "History", "Arena"]
namespace wonderstats {

    //% block="Wonder show full dashboard"
    //% group="Dashboard"
    export function showDashboard(): void {
        wonderracer.showFullDashboard()
    }

    //% block="Wonder show run history (last 3 scores)"
    //% group="History"
    export function showHistory(): void {
        wonderracer.showRunHistory()
    }

    //% block="Wonder history score %index ago"
    //% group="History"
    //% index.min=0 index.max=2 index.defl=0
    export function historyScore(index: number): number {
        return wonderracer.getHistoryScore(index)
    }

    //% block="Wonder arena score now"
    //% group="Arena"
    export function arenaScore(): number {
        return wonderracer.getArenaScore()
    }

    //% block="Wonder arena best score"
    //% group="Arena"
    export function arenaBest(): number {
        return wonderracer.getBestArenaScore()
    }

    //% block="Wonder show arena score"
    //% group="Arena"
    export function showArenaScore(): void {
        wonderracer.showArenaScore()
    }

    //% block="Wonder max speed"
    //% group="Dashboard"
    export function maxSpeed(): number {
        return wonderracer.getMaxSpeed()
    }

    //% block="Wonder run time sec"
    //% group="Dashboard"
    export function runTimeSec(): number {
        return wonderracer.getRunTimeSec()
    }

    //% block="Wonder line losses"
    //% group="Dashboard"
    export function lineLosses(): number {
        return wonderracer.getLineLosses()
    }

    //% block="Wonder obstacle count"
    //% group="Dashboard"
    export function obstacles(): number {
        return wonderracer.getObstacleCount()
    }

    //% block="Wonder confidence"
    //% group="Dashboard"
    export function confidence(): number {
        return wonderracer.getConfidence()
    }
}
