/**
 * Wonder Control — on start, background, reset
 */

//% color=#6B7280 weight=83 icon="\uf013"
//% groups=["Start", "System"]
namespace wondercontrol {

    //% block="Wonder run in background"
    //% group="System"
    //% handlerStatement=1
    export function runInBackground(handler: () => void): void {
        control.inBackground(handler)
    }

    //% block="Wonder reset micro:bit"
    //% group="System"
    export function reset(): void {
        control.reset()
    }

    //% block="Wonder wait micros %us"
    //% group="System"
    //% us.min=0 us.max=20000 us.defl=100
    export function waitMicros(us: number): void {
        control.waitMicros(us)
    }
}
