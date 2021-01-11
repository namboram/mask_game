'use strict';

import Popup from './popup.js';
import * as sound from './sound.js';
import { GameBuilder, Reason } from './game.js';

const gameFinishBanner = new Popup();
const game = new GameBuilder()
.withGameDuration(5)
.withNoMaskCount(5)
.withMaskedCount(8)
.build();

game.setGameStopListener(reason => {
    let message;
    switch(reason){
        case Reason.cancle:
            message = 'Replay ❓';
            sound.playAlert();
            break;
        case Reason.win :
            message = '💯COVID-19 방역 success💯';
            sound.playWin();
            break;
        case Reason.lose :
            message = '🚨You become a zombie🧟‍♀️🧟‍♂️🧨';
            sound.playMasked();
            break;
        default :
                throw new Error('not valid reasen');
    }   
    gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(()=> {
    game.start();
    game.showStopBtn();
});
