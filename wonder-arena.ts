/**
 * Wonder Arena — beat the class (more than lap racing)
 * Points, precision, reaction, maze, obstacle scoring
 */

//% color=#7C2D12 weight=93 icon="\uf091"
//% groups=["King", "Challenges", "Score"]
namespace wonderarena {

    // ========== KING (best all-round class score) ==========

    //% block="CLASS KING mode|balance $dir by $amount|shake = points"
    //% group="King"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function classKing(dir: BBRobotDirection, amount: number): void {
        wonderracer.startClassKing(dir, amount)
    }

    // ========== CHALLENGES (one block each) ==========

    //% block="challenge obstacle points|balance $dir by $amount"
    //% group="Challenges"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function obstaclePoints(dir: BBRobotDirection, amount: number): void {
        wonderracer.challengeObstaclePoints(dir, amount)
    }

    //% block="challenge precision park at %cm cm|balance $dir by $amount"
    //% group="Challenges"
    //% cm.min=10 cm.max=35 cm.defl=15
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function precisionPark(cm: number, dir: BBRobotDirection, amount: number): void {
        wonderracer.challengePrecisionPark(cm, dir, amount)
    }

    //% block="challenge maze sprint 60s|balance $dir by $amount"
    //% group="Challenges"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function mazeSprint(dir: BBRobotDirection, amount: number): void {
        wonderracer.challengeMazeSprint(dir, amount)
    }

    //% block="challenge reaction stop|balance $dir by $amount"
    //% group="Challenges"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function reactionStop(dir: BBRobotDirection, amount: number): void {
        wonderracer.challengeReaction(dir, amount)
    }

    //% block="challenge speed trial|balance $dir by $amount|shake = score"
    //% group="Challenges"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function speedTrial(dir: BBRobotDirection, amount: number): void {
        wonderracer.challengeSpeedTrial(dir, amount)
    }

    // ========== SCORE ==========

    //% block="show arena score on LED"
    //% group="Score"
    export function showScore(): void {
        wonderracer.showArenaScore()
    }

    //% block="arena points this run"
    //% group="Score"
    export function pointsThisRun(): number {
        return wonderracer.getArenaScore()
    }

    //% block="arena best score"
    //% group="Score"
    export function bestScore(): number {
        return wonderracer.getBestArenaScore()
    }
}
