'use strict';

import * as sound from './sound.js';
const IMG_SIZE = 120;

export default class Field {
    constructor(noMaskCount , maskedCount) {
        this.noMaskCount = noMaskCount;
        this.maskedCount = maskedCount;
        this.field = document.querySelector('.game__field');
        this.fieldRect = this.field.getBoundingClientRect();
        this.field.addEventListener('click' , (event) => this.onClick(event));
    }
    
    init() {
        this.field.innerHTML ='';
        this._additem('masked' , this.maskedCount , 'img/masked.png');
        this._additem('noMask' , this.noMaskCount , 'img/noMask.png');
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }

    _additem(className , count , imgPath){
        const x1 = 0;
        const y1 = 0;
        const x2 = this.fieldRect.width - IMG_SIZE;
        const y2 = this.fieldRect.height - IMG_SIZE;
        
        for(let i = 0; i < count; i++) {
            const item = document.createElement('img');
            item.setAttribute('class' , className);
            item.setAttribute('src' , imgPath);
            item.style.position = 'absolute';
    
            const x = randomNumber(x1 , x2);
            const y = randomNumber(y1 , y2);
            item.style.left = `${x}px`;
            item.style.top = `${y}px`;
            this.field.appendChild(item);
        }
    }
    
    onClick(event) {
        const target = event.target;
        if(target.matches('.noMask')){
            target.remove();
            sound.playNoMask();
            this.onItemClick && this.onItemClick('noMask');
        }else if(target.matches('.masked')){
            this.onItemClick && this.onItemClick('masked');
        }
    }
}

function randomNumber(min , max) {
    return Math.random() * (max - min) + min;
}
