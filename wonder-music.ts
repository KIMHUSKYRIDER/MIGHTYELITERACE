/**
 * Wonder Music — race jingles and custom melodies
 * Note: micro:bit cannot play YouTube or URLs — use melody text instead.
 */

enum WonderMusicPreset {
    //% block="race start fanfare"
    RaceStart = 0,
    //% block="victory"
    Victory = 1,
    //% block="top score"
    TopScore = 2,
    //% block="countdown tick"
    Countdown = 3,
    //% block="stop"
    Stop = 4,
    //% block="power up"
    PowerUp = 5,
}

//% color=#9333EA weight=92 icon="\uf001"
//% groups=["Play", "Race", "Custom"]
namespace wondermusic {

    // ========== RACE ==========

    //% block="race music on"
    //% group="Race"
    export function musicOn(): void {
        wonderracer.setRaceMusic(true)
    }

    //% block="race music off"
    //% group="Race"
    export function musicOff(): void {
        wonderracer.setRaceMusic(false)
    }

    // ========== PLAY ==========

    //% block="play music %preset"
    //% group="Play"
    export function playPreset(preset: WonderMusicPreset): void {
        wonderracer.playMusicPreset(preset)
    }

    //% block="play race start fanfare"
    //% group="Play"
    export function raceStart(): void {
        wonderracer.playRaceStartMusic()
    }

    //% block="play victory jingle"
    //% group="Play"
    export function victory(): void {
        wonderracer.playVictoryMusic()
    }

    // ========== CUSTOM ==========

    /**
     * Paste melody notes from MakeCode Music editor (not YouTube URLs).
     * Example: "c5 d5 e5 c5 d5 e5 c5"
     */
    //% block="play melody %melody|tempo %bpm"
    //% group="Custom"
    //% melody.defl="c5 e5 g5 c6"
    //% bpm.min=60 bpm.max=320 bpm.defl=180
    export function playMelody(melody: string, bpm: number): void {
        wonderracer.playCustomMelody(melody, bpm)
    }
}
