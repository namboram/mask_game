'use strict';


const IMG_SIZE = 120;
const MASKED_COUND = 8;
const NOMASK_COUNT = 5;
const GAME_CURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popup = document.querySelector('.pop-up');
const popupRefresh = document.querySelector('.pop-up__refresh');
const popupMsg = document.querySelector('.pop-up__message');

const noMaskSound = new Audio('./sound/noMask.mp3');
const maskedSound = new Audio('./sound/masked.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const alertSound = new Audio('./sound/alert.wav');
const bgSound = new Audio('./sound/bg.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener( 'click' , onFieldClick);

gameBtn.addEventListener('click' , ()=>{
    if(started){
        stopGame();
    }else {
        startGame();
    }
})

popupRefresh.addEventListener('click' , ()=>{
    startGame();
    hidePopup();
    showStopBtn();

    
})

function finishGame(win){
    started = false;
    hideGameBtn();
    if(win){
        playSound(winSound);
    }else{
        playSound(maskedSound);
    }
    stopGameTimer();
    stopSound(bgSound);
    showPopupWithText(win ? '💯COVID-19 방역 success💯' : '🚨You become a zombie🧟‍♀️🧟‍♂️🧨');
}

function startGame(){
    started = true;
    initGame();
    showStopBtn();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);

}

function stopGame(){
    started = false;
    stopGameTimer();
    hideGameBtn();
    showPopupWithText('일시정지 🚫');
    playSound(alertSound);
    stopSound(bgSound);
}


function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function startGameTimer(){
    let remainingTimeSec = GAME_CURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if(remainingTimeSec <= 0){
            clearInterval(timer);
            finishGame(NOMASK_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000 );
}


function stopGameTimer(){
    clearInterval(timer);
}

function updateTimerText(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerHTML = `${minutes}:${seconds}`;
}

function showPopupWithText(text){
    popupMsg.innerText = text ;
    popup.classList.remove('pop-up--hide');
}

function hidePopup(){
    popup.classList.add('pop-up--hide');
}

function showStopBtn(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
}

function hideGameBtn (){
    gameBtn.style.visibility = 'hidden';
}


function initGame() {
    score = 0;
    field.innerHTML ='';
    gameScore.innerText = NOMASK_COUNT;
    additem('masked' , MASKED_COUND , 'img/masked.png');
    additem('noMask' , NOMASK_COUNT , 'img/noMask.png');
}

function onFieldClick(event){
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches('.noMask')){
        target.remove();
        score++;
        playSound(noMaskSound);
        updateScoreBoard();
        if(score === NOMASK_COUNT){
            finishGame(true);
        }
    }else if(target.matches('.masked')){
        finishGame(false);
    }
}

function updateScoreBoard(){
    gameScore.innerText = NOMASK_COUNT - score;
}

function additem(className , count , imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - IMG_SIZE;
    const y2 = fieldRect.height - IMG_SIZE;
    
    for(let i = 0; i < count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class' , className);
        item.setAttribute('src' , imgPath);
        item.style.position = 'absolute';

        const x = randomNumber(x1 , x2);
        const y = randomNumber(y1 , y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min , max) {
    return Math.random() * (max - min) + min;
}

function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}
