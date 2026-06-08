/**
 * Wonder Save v5.1.1 — best lap stored in RAM (kept while powered on)
 * Plus celebration animation + 5 melodies.
 */

//% color=#0369A1 weight=81 icon="\uf0c7"
//% groups=["Setup", "Save", "Celebrate", "Music"]
namespace wondersave {

    //% block="enable best lap tracking"
    //% group="Setup"
    //% weight=120
    export function enablePersistent(): void {
        wonderracer.enablePersistentBest()
    }

    //% block="save best lap now"
    //% group="Save"
    //% weight=120
    export function saveNow(): void {
        wonderracer.savePersistedBest()
    }

    //% block="reset best lap tracking"
    //% group="Save"
    //% weight=110
    export function clearSaved(): void {
        wonderracer.clearPersistedBest()
    }

    //% block="celebrate now (PB animation + jingle)"
    //% group="Celebrate"
    //% weight=120
    export function celebrate(): void {
        wonderracer.celebratePb()
    }

    //% block="check + celebrate if new PB"
    //% group="Celebrate"
    //% weight=119
    export function checkPb(): void {
        wonderracer.celebrateOnPb()
    }

    //% block="play Mario coin jingle"
    //% group="Music"
    //% weight=120
    export function marioCoin(): void {
        wonderracer.playMarioCoinJingle()
    }

    //% block="play Star Wars theme"
    //% group="Music"
    //% weight=119
    export function starWars(): void {
        wonderracer.playStarWarsJingle()
    }

    //% block="play Tetris theme"
    //% group="Music"
    //% weight=118
    export function tetris(): void {
        wonderracer.playTetrisJingle()
    }

    //% block="play Pirates theme"
    //% group="Music"
    //% weight=117
    export function pirates(): void {
        wonderracer.playPiratesJingle()
    }

    //% block="play Final Countdown"
    //% group="Music"
    //% weight=116
    export function finalCountdown(): void {
        wonderracer.playFinalCountdownJingle()
    }
}
