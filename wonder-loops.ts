/**
 * Wonder Loops (løkker) — beat classmates' forever loops with smarter steps
 */

//% color=#2563EB weight=91 icon="\uf01e"
//% groups=["Setup", "Loop body", "Read in loop"]
namespace wonderloops {

    // ========== SETUP (once before forever) ==========

    //% block="løkke oppsett|balanse $dir med $amount"
    //% group="Setup"
    //% weight=120
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function setup(dir: BBRobotDirection, amount: number): void {
        wonderracer.loopSetup(dir, amount)
    }

    //% block="vent 10 ms (bruk i løkke)"
    //% group="Setup"
    export function waitTick(): void {
        wonderracer.loopWait()
    }

    // ========== LOOP BODY (put inside forever) ==========

    //% block="løkke smart følg|fart %speed|stopp hvis nærmere enn %cm cm"
    //% group="Loop body"
    //% weight=110
    //% speed.min=10 speed.max=60 speed.defl=35
    //% cm.min=8 cm.max=40 cm.defl=15
    export function smartFollow(speed: number, cm: number): void {
        wonderracer.loopSmartFollow(speed, cm)
    }

    //% block="løkke følg linje ett steg|fart %speed"
    //% group="Loop body"
    //% weight=109
    //% speed.min=10 speed.max=60 speed.defl=35
    export function followStep(speed: number): void {
        wonderracer.miniFollowStep(speed)
    }

    //% block="løkke følg eller søk linje|fart %speed"
    //% group="Loop body"
    //% weight=108
    //% speed.min=10 speed.max=60 speed.defl=35
    export function followOrSearch(speed: number): void {
        wonderracer.loopFollowOrSearch(speed)
    }

    //% block="løkke følg og vis confidence|fart %speed"
    //% group="Loop body"
    //% weight=107
    //% speed.min=10 speed.max=60 speed.defl=35
    export function followShowConfidence(speed: number): void {
        wonderracer.loopFollowShowConfidence(speed)
    }

    // ========== READ IN LOOP (for if/else you build yourself) ==========

    //% block="linje funnet"
    //% group="Read in loop"
    export function lineFound(): boolean {
        wonderracer.scanSensorsNow()
        return wonderracer.isLineSeen()
    }

    //% block="linje til venstre"
    //% group="Read in loop"
    export function lineLeft(): boolean {
        wonderracer.scanSensorsNow()
        return wonderracer.isLineLeft()
    }

    //% block="linje til høyre"
    //% group="Read in loop"
    export function lineRight(): boolean {
        wonderracer.scanSensorsNow()
        return wonderracer.isLineRight()
    }

    //% block="hinder nærmere enn %cm cm"
    //% group="Read in loop"
    //% cm.min=5 cm.max=80 cm.defl=15
    export function closerThan(cm: number): boolean {
        return wonderracer.isCloserThan(cm)
    }

    //% block="avstand cm"
    //% group="Read in loop"
    export function distanceCm(): number {
        return wonderracer.getSonarInstantCm()
    }

    //% block="stopp robot"
    //% group="Read in loop"
    export function stop(): void {
        wonderracer.emergencyStop()
    }

    //% block="kjør frem %speed i %ms ms"
    //% group="Read in loop"
    //% speed.min=10 speed.max=60 speed.defl=30
    //% ms.min=50 ms.max=2000 ms.defl=200
    export function driveMs(speed: number, ms: number): void {
        wonderracer.driveStraightTimed(speed, ms)
    }

    //% block="sving venstre %speed i %ms ms"
    //% group="Read in loop"
    //% speed.min=10 speed.max=50 speed.defl=22
    //% ms.min=50 ms.max=2000 ms.defl=200
    export function turnLeftMs(speed: number, ms: number): void {
        wonderracer.turnLeftTimed(speed, ms)
    }
}
