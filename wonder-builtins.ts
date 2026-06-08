/**
 * Wonder Built-ins — Wonder versions of MakeCode micro:bit blocks
 * Use these instead of Basic / Input / Led when teaching with Wonder.
 */

// ========== BASIC ==========

//% color=#3B82F6 weight=88 icon="\uf0eb"
//% groups=["Show", "Pause", "Loop"]
namespace wonderbasic {

    //% block="Wonder show number %n"
    //% group="Show"
    //% weight=100
    export function showNumber(n: number): void {
        basic.showNumber(n)
    }

    //% block="Wonder show string %s"
    //% group="Show"
    export function showString(s: string): void {
        basic.showString(s)
    }

    //% block="Wonder show icon %icon"
    //% group="Show"
    //% icon.fieldEditor="grid"
    export function showIcon(icon: IconNames): void {
        basic.showIcon(icon)
    }

    //% block="Wonder show arrow %arrow"
    //% group="Show"
    //% arrow.fieldEditor="grid"
    export function showArrow(arrow: ArrowNames): void {
        basic.showArrow(arrow)
    }

    //% block="Wonder clear screen"
    //% group="Show"
    export function clearScreen(): void {
        basic.clearScreen()
    }

    //% block="Wonder show leds %leds"
    //% group="Show"
    export function showLeds(leds: string): void {
        basic.showLeds(leds)
    }

    //% block="Wonder pause (ms) %ms"
    //% group="Pause"
    //% ms.min=0 ms.max=60000 ms.defl=500
    export function pause(ms: number): void {
        basic.pause(ms)
    }

    //% block="Wonder forever"
    //% group="Loop"
    //% blockGap=8
    //% handlerStatement=1
    export function forever(handler: () => void): void {
        basic.forever(handler)
    }
}

// ========== INPUT ==========

//% color=#EAB308 weight=87 icon="\uf11c"
//% groups=["Buttons", "Gesture", "Logo", "Read"]
namespace wonderinput {

    //% block="Wonder on button %button pressed"
    //% group="Buttons"
    //% handlerStatement=1
    export function onButtonPressed(button: Button, handler: () => void): void {
        input.onButtonPressed(button, handler)
    }

    //% block="Wonder button %button is pressed"
    //% group="Buttons"
    export function buttonIsPressed(button: Button): boolean {
        return input.buttonIsPressed(button)
    }

    //% block="Wonder on gesture %gesture"
    //% group="Gesture"
    //% gesture.fieldEditor="grid"
    //% handlerStatement=1
    export function onGesture(gesture: Gesture, handler: () => void): void {
        input.onGesture(gesture, handler)
    }

    //% block="Wonder on logo pressed"
    //% group="Logo"
    //% handlerStatement=1
    export function onLogoPressed(handler: () => void): void {
        input.onLogoEvent(TouchButtonEvent.Pressed, handler)
    }

    //% block="Wonder on logo released"
    //% group="Logo"
    //% handlerStatement=1
    export function onLogoReleased(handler: () => void): void {
        input.onLogoEvent(TouchButtonEvent.Released, handler)
    }

    //% block="Wonder running time (ms)"
    //% group="Read"
    export function runningTime(): number {
        return input.runningTime()
    }

    //% block="Wonder acceleration (mg) %dimension"
    //% group="Read"
    //% dimension.fieldEditor="grid"
    export function acceleration(dimension: Dimension): number {
        return input.acceleration(dimension)
    }

    //% block="Wonder light level"
    //% group="Read"
    export function lightLevel(): number {
        return input.lightLevel()
    }

    //% block="Wonder temperature (C)"
    //% group="Read"
    export function temperature(): number {
        return input.temperature()
    }
}

// ========== LED ==========

//% color=#22C55E weight=86 icon="\uf0eb"
//% groups=["Plot", "Control"]
namespace wonderled {

    //% block="Wonder plot x %x y %y"
    //% group="Plot"
    //% x.min=0 x.max=4 x.defl=2
    //% y.min=0 y.max=4 y.defl=2
    export function plot(x: number, y: number): void {
        led.plot(x, y)
    }

    //% block="Wonder unplot x %x y %y"
    //% group="Plot"
    export function unplot(x: number, y: number): void {
        led.unplot(x, y)
    }

    //% block="Wonder toggle x %x y %y"
    //% group="Plot"
    export function toggle(x: number, y: number): void {
        led.toggle(x, y)
    }

    //% block="Wonder point %x %y is on"
    //% group="Plot"
    export function pointOn(x: number, y: number): boolean {
        return led.point(x, y)
    }

    //% block="Wonder plot bar graph %value up to %high"
    //% group="Plot"
    export function plotBarGraph(value: number, high: number): void {
        led.plotBarGraph(value, high)
    }

    //% block="Wonder plot brightness %value"
    //% group="Plot"
    //% value.min=0 value.max=255 value.defl=128
    export function plotBrightness(value: number): void {
        led.plotBrightness(value)
    }

    //% block="Wonder LED enable %on"
    //% group="Control"
    export function enable(on: boolean): void {
        led.enable(on)
    }
}

// ========== MUSIC (built-in tones) ==========

//% color=#A855F7 weight=85 icon="\uf001"
//% groups=["Play", "Beat"]
namespace wondersound {

    //% block="Wonder play tone %note for %beat beats"
    //% group="Play"
    //% note.fieldEditor="note"
    //% beat.fieldEditor="grid"
    export function playTone(note: number, beat: number): void {
        music.playTone(note, beat)
    }

    //% block="Wonder play melody %melody|tempo %bpm"
    //% group="Play"
    //% melody.defl="c5 d5 e5 c5"
    //% bpm.min=60 bpm.max=320 bpm.defl=120
    export function playMelody(melody: string, bpm: number): void {
        music.playMelody(melody, bpm)
    }

    //% block="Wonder rest %ms ms"
    //% group="Play"
    export function rest(ms: number): void {
        music.rest(ms)
    }

    //% block="Wonder beat %fraction"
    //% group="Beat"
    //% fraction.fieldEditor="grid"
    export function beat(fraction: BeatFraction): number {
        return music.beat(fraction)
    }

    //% block="Wonder stop all sounds"
    //% group="Play"
    export function stopAllSounds(): void {
        music.stopAllSounds()
    }
}

// ========== LOGIC ==========

//% color=#64748B weight=84 icon="\uf074"
namespace wonderlogic {

    //% block="Wonder if %cond then"
    //% handlerStatement=1
    export function ifThen(cond: boolean, handler: () => void): void {
        if (cond) {
            handler()
        }
    }

    //% block="Wonder if %cond then else"
    //% handlerStatement=1
    //% elseStatement=1
    export function ifThenElse(cond: boolean, thenHandler: () => void, elseHandler: () => void): void {
        if (cond) {
            thenHandler()
        } else {
            elseHandler()
        }
    }

    //% block="Wonder not %bool"
    export function not(bool: boolean): boolean {
        return !bool
    }

    //% block="Wonder true"
    export function trueBool(): boolean {
        return true
    }

    //% block="Wonder false"
    export function falseBool(): boolean {
        return false
    }
}

// ========== MATH ==========

//% color=#0EA5E9 weight=83 icon="\uf1ec"
namespace wondermath {

    //% block="Wonder pick random 0 to %limit"
    //% limit.min=2 limit.max=1000 limit.defl=10
    export function random(limit: number): number {
        return Math.randomRange(0, limit)
    }

    //% block="Wonder pick random %min to %max"
    export function randomRange(min: number, max: number): number {
        return Math.randomRange(min, max)
    }

    //% block="Wonder min of %a and %b"
    export function min(a: number, b: number): number {
        return Math.min(a, b)
    }

    //% block="Wonder max of %a and %b"
    export function max(a: number, b: number): number {
        return Math.max(a, b)
    }

    //% block="Wonder absolute of %n"
    export function abs(n: number): number {
        return Math.abs(n)
    }

    //% block="Wonder square root of %n"
    export function sqrt(n: number): number {
        return Math.sqrt(n)
    }

    //% block="Wonder constrain %value between %low and %high"
    export function constrain(value: number, low: number, high: number): number {
        if (value < low) return low
        if (value > high) return high
        return value
    }
}

// ========== RADIO ==========

//% color=#F97316 weight=82 icon="\uf1eb"
//% groups=["Setup", "Send", "Receive"]
namespace wonderradio {

    //% block="Wonder radio on group %group"
    //% group="Setup"
    //% group.min=0 group.max=255 group.defl=1
    export function setGroup(group: number): void {
        radio.setGroup(group)
        radio.on()
    }

    //% block="Wonder radio off"
    //% group="Setup"
    export function off(): void {
        radio.off()
    }

    //% block="Wonder radio send number %value"
    //% group="Send"
    export function sendNumber(value: number): void {
        radio.sendNumber(value)
    }

    //% block="Wonder radio send string %msg"
    //% group="Send"
    export function sendString(msg: string): void {
        radio.sendString(msg)
    }

    //% block="Wonder on radio received"
    //% group="Receive"
    //% handlerStatement=1
    export function onReceived(handler: () => void): void {
        radio.onReceivedNumber(function (_value: number) {
            handler()
        })
    }

    //% block="Wonder received number"
    //% group="Receive"
    export function receivedNumber(): number {
        return radio.receivedNumber()
    }

    //% block="Wonder received string"
    //% group="Receive"
    export function receivedString(): string {
        return radio.receivedString()
    }
}
