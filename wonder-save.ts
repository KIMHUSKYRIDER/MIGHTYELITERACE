/**
 * Wonder Save v5.1 — persistent best lap that survives power off
 * Uses micro:bit V2 flash settings. On V1 the data is lost on reset.
 */

//% color=#0369A1 weight=81 icon="\uf0c7"
//% groups=["Setup", "Save", "Celebrate", "Music"]
namespace wondersave {

    //% block="enable persistent best lap"
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

    //% block="clear saved best lap forever"
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
