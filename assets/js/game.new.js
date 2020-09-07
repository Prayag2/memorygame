////////////////////////////////////DOM///////////////////////////////////////////////////////
const cards = document.querySelectorAll('.card');
const button = document.getElementById('reset');
const overlay = document.getElementById('overlay');
const overlayText = document.querySelector('#overlay > h1');
const minuteDisplay = document.getElementById('minute');
const secondDisplay = document.getElementById('second');
const intro = document.getElementById('intro');
const pauseButton = document.getElementById('pause_button');

// sound
const clickSound = document.getElementById('click');
const wrongSound = document.getElementById('wrong');
const correctSound = document.getElementById('correct');
const shuffleSound = document.getElementById('shuffle');
const victorySound = document.getElementById('victory');

////////////////////////////////////VARIABLES/////////////////////////////////////////////////
let hasClicked = false;
let fCard, sCard;
let lockBoard = false;
let score = 0;
let second, minute, timer;
let mainSecond, mainMinute;
const totalScore = 16;
let randomNumber = Math.floor(Math.random() * 5);
const messages = ['Amazing! Play Again?', 'Fantabulous! Play Again?', 'Well Played! Play Again?', 'Fast As Lightning! Play Again?', 'Nice Job! Play Again?', 'Game Over! Play Again?'];

///////////////////////////////EVENT LISTENERS////////////////////////////////////////////////
cards.forEach(card => card.addEventListener('click', flip));
button.addEventListener('click', ()=>{
    clearInterval(timer);
    shuffle();
    timer = setInterval(timerFunction, 1000);
});

////////////////////////////////////FUNCTIONS/////////////////////////////////////////////////



function timerFunction() {
    second--;
    secondDisplay.textContent = second;
    minuteDisplay.textContent = minute;
    if(minute === 0 && second === 0) {
        clearInterval(timer);
        timesUp();
    } else if(second <= 0) {
        second = 60;
        minute--;
    }
}


//times up function
function timesUp() {
    fadeOverlayIn();
    overlayText.textContent = "TIMES UP! PLAY AGAIN?";
}

// flip function
function flip(){
    clickSound.play();
    if(lockBoard || this === fCard) {
        clickSound.pause();
        return;
    };
    this.classList.add('flip');

    // calling match function 
    match(this);
}

// check if they match or not
function match(card){
    if(!hasClicked || this === fCard) {
        hasClicked = true;
        fCard = card;
    } else {
        hasClicked = false;
        sCard = card;

        // check if both are the same cards
        if(fCard.dataset.card === sCard.dataset.card) {
            setTimeout(()=>{
                correctSound.play();
            }, 500);
            score++;
            fCard.removeEventListener('click', flip);
            sCard.removeEventListener('click', flip);
            resetVariables();
        } else {
            setTimeout(()=>{
                wrongSound.play();
            }, 500);
            lockBoard = true;
            setTimeout(()=>{
                lockBoard = false;
                fCard.classList.remove('flip');
                sCard.classList.remove('flip');
                resetVariables();
            }, 700);
        }
    }
}

// fadeIn overlay function
function fadeOverlayIn(){
    overlay.style.display = "flex";
    setTimeout(()=>{
        overlay.style.opacity = "1";
    },100);
}

// fadeOut overlay function
function fadeOverlayOut(){
    overlay.style.opacity = "0";
    setTimeout(()=>{
        overlay.style.display = "none";
    },100);
}

// shuffle function
function shuffle(){
    minute = mainMinute;
    second = mainSecond;
    shuffleSound.play();
    overlayText.textContent = "Shuffling Your Cards..."
    randomNumber = Math.floor(Math.random() * 7);
    hasClicked = false;
    fCard = null;
    // editing cards
    cards.forEach(card => {
        card.classList.remove('flip');
        card.addEventListener('click', flip);
        setTimeout(()=>{
            card.style.order = Math.floor(Math.random() * 17);
        }, 300);
    });

    // adding overlay
    fadeOverlayIn();
    setTimeout(()=>{
        fadeOverlayOut();
    },1500);
}

// check for win
let winInterval = setInterval(()=>{
    if(score=== totalScore) {
        setTimeout(()=>{
            victorySound.play();
        }, 300);
        score = 0;
        fadeOverlayIn();
        overlayText.innerHTML = messages[randomNumber] + "<br><p>You did it in " + minute + " minutes and " + second + " seconds!</p>";
        button.textContent = "Play Again?";
        clearInterval(timer);
        button.onclick = ()=>{
            shuffle();
            button.textContent = "Shuffle Cards";
        };
    }
}, 500);


// reset variables function
function resetVariables(){
    [fCard, sCard] = [null, null];
    [lockBoard, hasClicked] = [false, false];
}


// fadeOutIntro 
function fadeOutIntro() {
    intro.style.opacity = 0;
    setTimeout(()=>{
        intro.style.display = "none";
    }, 350);
}
function fadeInIntro() {
    intro.style.display = "flex";
    setTimeout(()=>{
        intro.style.opacity = 1;
    }, 350);
}

//start game 
function start(s, m){
    mainMinute = m;
    mainSecond = s;
    setTimeout(()=>{
        shuffle();
        timer = setInterval(timerFunction, 1000);
    }, 600);
    fadeOutIntro();
}


// pause function
function changeDiff() {
    clearInterval(timer);
    fadeInIntro();
}