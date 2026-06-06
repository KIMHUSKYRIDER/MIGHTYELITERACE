/**
 * Wonder Teacher — simple blocks for classrooms (plain English)
 */

enum WonderPace {
    //% block="slow (practice)"
    Slow = 0,
    //% block="medium"
    Medium = 1,
    //% block="fast"
    Fast = 2,
}

//% color=#0D9488 weight=100 icon="\uf19d"
//% groups=["Start", "Sonar", "Drive", "Test", "Read", "Lesson", "Wizard"]
namespace wonderteacher {

    // ========== START ==========

    //% block="klar for klasserom|balanse $dir med $amount"
    //% group="Start"
    //% weight=110
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function classroomReady(dir: BBRobotDirection, amount: number): void {
        wonderracer.classroomReady(dir, amount)
    }

    //% block="start øvelses robot|balanse $dir med $amount"
    //% group="Start"
    //% weight=100
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startPractice(dir: BBRobotDirection, amount: number): void {
        wonderracer.schoolPracticeStart(dir, amount)
    }

    //% block="start løp robot|balanse $dir med $amount"
    //% group="Start"
    //% weight=99
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function startRace(dir: BBRobotDirection, amount: number): void {
        wonderracer.schoolRaceStart(dir, amount)
    }

    //% block="enkel start|fart %pace|balanse $dir med $amount"
    //% group="Start"
    //% weight=98
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function easyStart(pace: WonderPace, dir: BBRobotDirection, amount: number): void {
        wonderracer.easyStart(pace, dir, amount)
    }

    //% block="countdown 3 2 1 only"
    //% group="Start"
    export function countdown(): void {
        wonderracer.countdownOnly()
    }

    //% block="stopp robot"
    //% group="Start"
    export function stopRobot(): void {
        wonderracer.emergencyStop()
    }

    //% block="nullstill robot"
    //% group="Start"
    export function resetRobot(): void {
        wonderracer.softResetRace()
    }

    //% block="setup BitBot XL|bias $dir by $amount"
    //% group="Start"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function setupRobot(dir: BBRobotDirection, amount: number): void {
        wonderracer.prepareRacer(BBModel.XL, dir, amount)
    }

    // ========== SONAR (instant) ==========

    //% block="sonar instant mode on"
    //% group="Sonar"
    export function sonarInstantOn(): void {
        wonderracer.setSonarFastMode(true)
    }

    //% block="sonar instant mode off"
    //% group="Sonar"
    export function sonarInstantOff(): void {
        wonderracer.setSonarFastMode(false)
    }

    //% block="read distance now (cm)"
    //% group="Sonar"
    export function distanceNow(): number {
        return wonderracer.getSonarInstantCm()
    }

    //% block="object closer than %cm cm"
    //% group="Sonar"
    //% cm.min=5 cm.max=80 cm.defl=20
    export function closerThan(cm: number): boolean {
        return wonderracer.isCloserThan(cm)
    }

    //% block="wait until closer than %cm cm|timeout %ms ms"
    //% group="Sonar"
    //% cm.min=5 cm.max=80 cm.defl=15
    //% ms.min=500 ms.max=10000 ms.defl=3000
    export function waitUntilCloser(cm: number, ms: number): boolean {
        return wonderracer.waitCloserThan(cm, ms)
    }

    // ========== DRIVE ==========

    //% block="set robot slow"
    //% group="Drive"
    export function robotSlow(): void {
        wonderracer.setRobotSlow()
    }

    //% block="set robot medium speed"
    //% group="Drive"
    export function robotMedium(): void {
        wonderracer.setRobotMedium()
    }

    //% block="set robot fast"
    //% group="Drive"
    export function robotFast(): void {
        wonderracer.setRobotFast()
    }

    //% block="drive straight|speed %speed|for %ms ms"
    //% group="Drive"
    //% speed.min=10 speed.max=80 speed.defl=40
    //% ms.min=100 ms.max=5000 ms.defl=1000
    export function driveStraight(speed: number, ms: number): void {
        wonderracer.driveStraightTimed(speed, ms)
    }

    //% block="drive back|speed %speed|for %ms ms"
    //% group="Drive"
    //% speed.min=10 speed.max=60 speed.defl=30
    //% ms.min=100 ms.max=5000 ms.defl=500
    export function driveBack(speed: number, ms: number): void {
        wonderracer.driveBackTimed(speed, ms)
    }

    //% block="turn left|speed %speed|for %ms ms"
    //% group="Drive"
    //% speed.min=10 speed.max=50 speed.defl=25
    //% ms.min=100 ms.max=3000 ms.defl=400
    export function turnLeft(speed: number, ms: number): void {
        wonderracer.turnLeftTimed(speed, ms)
    }

    //% block="turn right|speed %speed|for %ms ms"
    //% group="Drive"
    //% speed.min=10 speed.max=50 speed.defl=25
    //% ms.min=100 ms.max=3000 ms.defl=400
    export function turnRight(speed: number, ms: number): void {
        wonderracer.turnRightTimed(speed, ms)
    }

    // ========== TEST ==========

    //% block="run all classroom tests"
    //% group="Test"
    export function runAllTests(): void {
        wonderracer.runClassroomTests()
    }

    //% block="test motors (short forward)"
    //% group="Test"
    export function testMotors(): void {
        wonderracer.testMotorsForward()
    }

    //% block="test line sensors on LED"
    //% group="Test"
    export function testLineSensors(): void {
        wonderracer.testLineSensorsShow()
    }

    //% block="test sonar distance on LED"
    //% group="Test"
    export function testSonar(): void {
        wonderracer.testSonarShow()
    }

    //% block="show line and distance on LED"
    //% group="Test"
    export function showSensors(): void {
        wonderracer.showAllSensorsOnce()
    }

    //% block="show speed on LED"
    //% group="Test"
    export function showSpeed(): void {
        wonderracer.showSpeedNow()
    }

    // ========== READ ==========

    //% block="line on left sensor"
    //% group="Read"
    export function lineOnLeft(): boolean {
        wonderracer.scanSensorsNow()
        return wonderracer.isLineLeft()
    }

    //% block="line on right sensor"
    //% group="Read"
    export function lineOnRight(): boolean {
        wonderracer.scanSensorsNow()
        return wonderracer.isLineRight()
    }

    //% block="line found"
    //% group="Read"
    export function lineFound(): boolean {
        wonderracer.scanSensorsNow()
        return wonderracer.isLineSeen()
    }

    //% block="wait until line found|timeout %ms ms"
    //% group="Read"
    //% ms.min=500 ms.max=10000 ms.defl=3000
    export function waitForLine(ms: number): boolean {
        return wonderracer.waitForLine(ms)
    }

    //% block="obstacle ahead"
    //% group="Read"
    export function obstacleAhead(): boolean {
        return wonderracer.isAtObstacle()
    }

    //% block="distance in cm"
    //% group="Read"
    export function distanceCm(): number {
        return wonderracer.getSonarInstantCm()
    }

    //% block="robot speed now"
    //% group="Read"
    export function speedNow(): number {
        return wonderracer.getCurrentSpeed()
    }

    //% block="max speed this run"
    //% group="Read"
    export function maxSpeed(): number {
        return wonderracer.getMaxSpeed()
    }

    // ========== LESSON (one-block workflows) ==========

    //% block="lesson 1 first robot|bias $dir by $amount"
    //% group="Lesson"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function lesson1FirstRobot(dir: BBRobotDirection, amount: number): void {
        wonderracer.classroomReady(dir, amount)
        wonderracer.schoolPracticeStart(dir, amount)
    }

    //% block="lesson 2 test hardware|bias $dir by $amount"
    //% group="Lesson"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function lesson2TestHardware(dir: BBRobotDirection, amount: number): void {
        wonderracer.classroomReady(dir, amount)
        wonderracer.runClassroomTests()
    }

    //% block="lesson 3 sonar stop|stop if closer than %cm cm|bias $dir by $amount"
    //% group="Lesson"
    //% cm.min=8 cm.max=40 cm.defl=15
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function lesson3SonarStop(cm: number, dir: BBRobotDirection, amount: number): void {
        wonderracer.classroomReady(dir, amount)
        while (true) {
            wonderracer.driveStraightTimed(35, 200)
            if (wonderracer.isCloserThan(cm)) {
                wonderracer.emergencyStop()
                basic.showIcon(IconNames.No)
                break
            }
        }
    }

    //% block="leksjon 4 følg linje 30 sek|balanse $dir med $amount"
    //% group="Lesson"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function lesson4Follow30(dir: BBRobotDirection, amount: number): void {
        wonderracer.lesson4Follow30(dir, amount)
    }

    //% block="leksjon 5 hinderbane|balanse $dir med $amount"
    //% group="Lesson"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function lesson5ObstacleCourse(dir: BBRobotDirection, amount: number): void {
        wonderracer.lesson5ObstacleCourse(dir, amount)
    }

    //% block="leksjon 6 linjelabyrint intro|balanse $dir med $amount"
    //% group="Lesson"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function lesson6LineMaze(dir: BBRobotDirection, amount: number): void {
        wonderracer.lesson6LineMaze(dir, amount)
    }

    // ========== WIZARD ==========

    //% block="veiviser oppsett|fart %pace|balanse $dir med $amount"
    //% group="Wizard"
    //% dir.fieldEditor="grid"
    //% amount.min=0 amount.max=20 amount.defl=5
    export function wizardSetup(pace: WonderPace, dir: BBRobotDirection, amount: number): void {
        wonderracer.wizardSetup(pace, dir, amount)
    }

    //% block="mini følg linje steg|fart %speed"
    //% group="Wizard"
    //% speed.min=10 speed.max=60 speed.defl=35
    export function miniFollowStep(speed: number): void {
        wonderracer.miniFollowStep(speed)
    }

    //% block="mini følg linje i %ms ms|fart %speed"
    //% group="Wizard"
    //% speed.min=10 speed.max=60 speed.defl=35
    //% ms.min=500 ms.max=120000 ms.defl=10000
    export function miniFollowFor(speed: number, ms: number): void {
        wonderracer.runMiniFollowMs(speed, ms)
    }

    //% block="lytt etter stopp fra lærer|gruppe %group"
    //% group="Wizard"
    //% group.min=0 group.max=255 group.defl=73
    export function listenTeacherStop(group: number): void {
        wonderracer.listenForClassroomStop(group)
    }

    //% block="fjernkontroll send stopp|gruppe %group"
    //% group="Wizard"
    //% group.min=0 group.max=255 group.defl=73
    export function remoteSendStop(group: number): void {
        wonderracer.sendClassroomStopRemote(group)
    }
}
