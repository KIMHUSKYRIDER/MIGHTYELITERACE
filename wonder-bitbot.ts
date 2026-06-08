/**
 * Wonder BitBot — BitBot blocks with Wonder labels (no raw bitbot namespace)
 */

//% color=#0891B2 weight=89 icon="\uf544"
//% groups=["Setup", "Drive", "Sensors"]
namespace wonderbitbot {

    //% block="Wonder BitBot XL selected"
    //% group="Setup"
    export function selectXl(): void {
        wonderracer.bitbotSelectXl()
    }

    //% block="Wonder motor balance $dir by $amount"
    //% group="Setup"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function motorBias(dir: BBRobotDirection, amount: number): void {
        wonderracer.bitbotBias(dir, amount)
    }

    //% block="Wonder motors stop"
    //% group="Drive"
    export function stop(): void {
        wonderracer.bitbotStop()
    }

    //% block="Wonder motors speed %speed"
    //% group="Drive"
    //% speed.min=-100 speed.max=100 speed.defl=40
    export function move(speed: number): void {
        wonderracer.bitbotMove(speed)
    }

    //% block="Wonder line sensor left"
    //% group="Sensors"
    export function lineLeft(): number {
        return wonderracer.bitbotReadLineLeft()
    }

    //% block="Wonder line sensor right"
    //% group="Sensors"
    export function lineRight(): number {
        return wonderracer.bitbotReadLineRight()
    }

    //% block="Wonder sonar cm"
    //% group="Sensors"
    export function sonarCm(): number {
        return wonderracer.bitbotSonarCm()
    }
}
