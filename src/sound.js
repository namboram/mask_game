const noMaskSound = new Audio('./sound/noMask.mp3');
const maskedSound = new Audio('./sound/masked.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');

export function playNoMask () {
    playSound(noMaskSound);
}

export function playMasked () {
    playSound(maskedSound);
}

export function playAlert () {
    playSound(alertSound);
}

export function playWin () {
    playSound(winSound);
}

export function playBackground () {
    playSound(bgSound);
}

export function stopBackground () {
    stopSound(bgSound);
}

function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}