'use strict';
import * as sound from './sound.js';
import Field from './field.js';

export const Reason = Object.freeze({
    win : 'win' ,
    lose : 'lose',
    cancle : 'cancle',
});

// Builder Pattern
export class GameBuilder {
    withGameDuration(duration) {
        this.gameDuration = duration;
        return this;
    }

    withNoMaskCount(num) {
        this.noMaskCount = num;
        return this;
    }

    withMaskedCount(num) {
        this.maskedCount = num;
        return this;
    }

    build() {
        console.log(this);
        return new Game(
            this.gameDuration,
            this.noMaskCount,
            this.maskedCount
        );
    }
}

class Game {
    constructor(gameDuration, noMaskCount , maskedCount) {
        this.gameDuration = gameDuration;
        this.noMaskCount = noMaskCount;
        this.maskedCount = maskedCount;

        this.gameTimer = document.querySelector('.game__timer');
        this.gameScore = document.querySelector('.game__score');
        this.gameBtn = document.querySelector('.game__button');
        this.gameBtn.addEventListener('click' , ()=>{
            if(this.started){
                this.stop();
            }else {
                this.start();
            }
        });

        this.gameField = new Field(noMaskCount , maskedCount);
        this.gameField.setClickListener(this.onItemClick);

        this.started = false;
        this.score = 0;
        this.timer = undefined;        
    }

    setGameStopListener(onGameStop){
        this.onGameStop = onGameStop;
    }

    start(){
        this.started = true;
        this.initGame();
        this.showStopBtn();
        this.showTimerAndScore();
        this.startGameTimer();
        sound.playBackground();
    }
    
    stop(){
        this.started = false;
        this.stopGameTimer();
        this.hideGameBtn();
        sound.playAlert();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(Reason.cancle);

    }
    

    finish(win){
        this.started = false;
        this.hideGameBtn();
        if(win){
            sound.playWin();
        }else{
            sound.playMasked();
        }
        this.stopGameTimer();
        sound.stopBackground();
        this.onGameStop && this.onGameStop(win? Reason.win : Reason.lose);
    
}


    onItemClick = item => {
        if(!this.started){
            return;
        }
        if(item === 'noMask'){
            this.score++;
            this.updateScoreBoard();
            if(this.score === this.noMaskCount){
                this.finish(true);
            }
        }else if(item ==='masked'){
            this.finish(false);
        }
    };

    showTimerAndScore() {
        this.gameTimer.style.visibility = 'visible';
        this.gameScore.style.visibility = 'visible';
    }
    
    startGameTimer(){
        let remainingTimeSec = this.gameDuration;
        this.updateTimerText(remainingTimeSec);
        this.timer = setInterval(() => {
            if(remainingTimeSec <= 0){
                clearInterval(this.timer);
                this.finish(this.noMaskCount === this.score);
                return;
            }
            this.updateTimerText(--remainingTimeSec);
        }, 1000 );
    }
    
    
    stopGameTimer(){
        clearInterval(this.timer);
    }
    
    updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        this.gameTimer.innerHTML = `${minutes}:${seconds}`;
    }
    
    showStopBtn(){
        const icon = this.gameBtn.querySelector('.fas');
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
        this.gameBtn.style.visibility = 'visible';
    }
    
    hideGameBtn (){
        this.gameBtn.style.visibility = 'hidden';
    }
    
    
    initGame() {
        this.score = 0;
        this.gameScore.innerText = this.noMaskCount;
        this.gameField.init();
       
    }
    
    updateScoreBoard(){
        this.gameScore.innerText = this.noMaskCount - this.score;
    }
    
    
}