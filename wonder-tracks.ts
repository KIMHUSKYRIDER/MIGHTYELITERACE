/**
 * Wonder Tracks v5.1 — pick the track style and engine retunes automatically
 * Call ONE of these before starting the racer.
 */

//% color=#0F766E weight=98 icon="\uf279"
//% groups=["Track type", "Bundle starts"]
namespace wondertracks {

    //% block="use SHORT track (tight corners, low speed)"
    //% group="Track type"
    //% weight=120
    export function shortTrack(): void {
        wonderracer.useShortTrack()
    }

    //% block="use LONG track (high speed, gentle corners)"
    //% group="Track type"
    //% weight=119
    export function longTrack(): void {
        wonderracer.useLongTrack()
    }

    //% block="use OBSTACLE track (more sonar focus)"
    //% group="Track type"
    //% weight=118
    export function obstacleTrack(): void {
        wonderracer.useObstacleTrack()
    }

    //% block="use TIME TRIAL track (max speed, accept risk)"
    //% group="Track type"
    //% weight=117
    export function timeTrial(): void {
        wonderracer.useTimeTrialTrack()
    }

    //% block="use BEGINNER track (slow safe)"
    //% group="Track type"
    //% weight=116
    export function beginner(): void {
        wonderracer.useBeginnerTrack()
    }

    //% block="SHORT track race|balance $dir by $amount"
    //% group="Bundle starts"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function shortRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.useShortTrack()
        wonderracer.startWonderV5(dir, amount)
    }

    //% block="LONG track race|balance $dir by $amount"
    //% group="Bundle starts"
    //% weight=119
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function longRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.useLongTrack()
        wonderracer.startWonderV5(dir, amount)
    }

    //% block="OBSTACLE track race|balance $dir by $amount"
    //% group="Bundle starts"
    //% weight=118
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function obstacleRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.useObstacleTrack()
        wonderracer.startWonderV5(dir, amount)
    }

    //% block="TIME TRIAL race|balance $dir by $amount"
    //% group="Bundle starts"
    //% weight=117
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function timeTrialRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.useTimeTrialTrack()
        wonderracer.startWonderV5(dir, amount)
    }

    //% block="BEGINNER race|balance $dir by $amount"
    //% group="Bundle starts"
    //% weight=116
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function beginnerRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.useBeginnerTrack()
        wonderracer.startEliteRacer(dir, amount)
    }
}
