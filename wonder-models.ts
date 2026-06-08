/**
 * Wonder Models v5.1 — pick your BitBot (XL, Classic, PRO, Auto)
 * Then use any Wonder racer block and it adapts to your hardware.
 */

//% color=#10B981 weight=99 icon="\uf1b9"
//% groups=["Pick", "Start", "Info"]
namespace wondermodels {

    //% block="use BitBot %model"
    //% group="Pick"
    //% weight=120
    export function useModel(model: BBModel): void {
        wonderracer.useModel(model)
    }

    //% block="use BitBot XL"
    //% group="Pick"
    //% weight=115
    export function useXl(): void {
        wonderracer.useModel(BBModel.XL)
    }

    //% block="use BitBot Classic"
    //% group="Pick"
    //% weight=114
    export function useClassic(): void {
        wonderracer.useModel(BBModel.Classic)
    }

    //% block="use BitBot PRO"
    //% group="Pick"
    //% weight=113
    export function usePro(): void {
        wonderracer.useModel(BBModel.PRO)
    }

    //% block="use Auto-detect"
    //% group="Pick"
    //% weight=112
    export function useAuto(): void {
        wonderracer.useModel(BBModel.Auto)
    }

    //% block="START race XL|balance $dir by $amount"
    //% group="Start"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startXl(dir: BBRobotDirection, amount: number): void {
        wonderracer.startXl(dir, amount)
    }

    //% block="START race Classic|balance $dir by $amount"
    //% group="Start"
    //% weight=119
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startClassic(dir: BBRobotDirection, amount: number): void {
        wonderracer.startClassic(dir, amount)
    }

    //% block="START race PRO|balance $dir by $amount"
    //% group="Start"
    //% weight=118
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startPro(dir: BBRobotDirection, amount: number): void {
        wonderracer.startPro(dir, amount)
    }

    //% block="START race Auto-detect|balance $dir by $amount"
    //% group="Start"
    //% weight=117
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startAuto(dir: BBRobotDirection, amount: number): void {
        wonderracer.startAutoModel(dir, amount)
    }

    //% block="show detected model on LED"
    //% group="Info"
    //% weight=110
    export function showDetected(): void {
        wonderracer.showDetectedModel()
    }
}
