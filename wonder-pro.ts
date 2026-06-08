/**
 * Wonder Pro — one-block ultimate programs
 */

//% color=#BE123C weight=95 icon="\uf135"
//% groups=["Ultimate", "Loops", "Decathlon"]
namespace wonderpro {

    //% block="ULTIMATE racer|balance $dir by $amount|music + lap + turbo + tune"
    //% group="Ultimate"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function ultimateRacer(dir: BBRobotDirection, amount: number): void {
        wonderracer.startUltimateRacer(dir, amount)
    }

    //% block="LOOPS champion|balance $dir by $amount|smart forever loop"
    //% group="Loops"
    //% weight=119
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function loopsChampion(dir: BBRobotDirection, amount: number): void {
        wonderracer.startLoopsChampion(dir, amount)
    }

    //% block="CLASS KING + music|balance $dir by $amount"
    //% group="Ultimate"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function classKing(dir: BBRobotDirection, amount: number): void {
        wonderracer.startClassKing(dir, amount)
    }

    //% block="DECATHLON 3 events|balance $dir by $amount|reaction + park + maze"
    //% group="Decathlon"
    //% weight=118
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function decathlon(dir: BBRobotDirection, amount: number): void {
        wonderracer.runDecathlon(dir, amount)
    }
}
