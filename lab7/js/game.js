'use strict';

let level = 1;
let timeToDuel = 500;
let readyToDuel = 'false';

let time;
let score;

const elements = {
    startButton: document.querySelector('.button-start-game'),
    restartButton: document.querySelector('.button-restart'),
    nextButton: document.querySelector('.button-next-level'),
    gameMenu: document.querySelector('.menu'),
    wrapper: document.querySelector('.wrapper'),
    gamePanels: document.querySelector('.game-panels'),
    gameScreen: document.querySelector('.game-screen'),
    winScreen: document.querySelector('.win-screen'),
    gunman: document.querySelector('.gunman'),
    timeYou: document.querySelector('.you-time'),
    timeGunman: document.querySelector('.gunman-time'),
    showLevel: document.querySelector('.score-panel__level'),
    message: document.querySelector('.message'),
};

const sounds = {
    intro: new Audio('sfx/intro.m4a'),
    wait: new Audio('sfx/wait.m4a'),
    fire: new Audio('sfx/fire.m4a'),
    shot: new Audio('sfx/shot.m4a'),
    win: new Audio('sfx/win.m4a'),
    death: new Audio('sfx/death.m4a'),
};

elements.startButton.addEventListener('click', startGame);
elements.restartButton.addEventListener('click', restartGame);
elements.nextButton.addEventListener('click', nextLevel);

function startGame() {
    toggleVisibility([elements.gameMenu], 'none');
    toggleVisibility([elements.gamePanels, elements.gameScreen, elements.wrapper], 'block');

    elements.timeGunman.innerHTML = (timeToDuel / 1000).toFixed(2);
    elements.timeYou.innerHTML = '0.00';

    score = +document.querySelector('.score-panel__score_num').innerHTML;
    elements.showLevel.textContent = `level: ${level}`;

    elements.gunman.classList.add(`gunman-level-${level}`);
    elements.gunman.addEventListener('transitionend', prepareForDuel);

    const side = Math.random() > 0.5 ? 'left' : 'right';
    if (side === 'right') elements.gunman.classList.add('gunman-right');

    setTimeout(() => moveGunman(side), 500);
}

function restartGame() {
    sounds.death.pause();
    elements.restartButton.style.display = 'none';
    resetMessage();

    elements.gameScreen.classList.remove('game-screen--death');
    removeGunmanClasses();

    setTimeout(startGame, 1000);
}

function nextLevel() {
    if (level < 5) {
        elements.nextButton.style.display = 'none';
        resetMessage();
        removeGunmanClasses();

        level++;
        timeToDuel = 1000 - level * 100;

        startGame();
    } else {
        showVictoryScreen();
    }
}

function moveGunman(side) {
    setTimeout(() => {
        elements.gunman.classList.add(`moving-${side}`);
        playSound(sounds.intro, true);
    }, 10);
}

function prepareForDuel() {
    playSound(sounds.intro, false);
    playSound(sounds.wait, true);

    elements.gunman.classList.remove('moving-right', 'gunman-right', 'moving-left');
    elements.gunman.classList.add('standing', `gunman-level-${level}__standing`);

    setTimeout(() => {
        playSound(sounds.wait, false);

        elements.gunman.classList.add(`gunman-level-${level}__ready`);
        elements.message.classList.add('message--fire');
        playSound(sounds.fire);

        elements.gunman.addEventListener('mousedown', playerShootsGunman);

        readyToDuel = true;
        timeCounter(Date.now());
        setTimeout(gunmanShootsPlayer, timeToDuel);
    }, 1000);
}

function timeCounter(start) {
    const updateTime = () => {
        if (!readyToDuel) return;
        time = ((Date.now() - start + 10) / 1000).toFixed(2);
        elements.timeYou.innerHTML = time;
        setTimeout(updateTime, 10);
    };
    updateTime();
}

function gunmanShootsPlayer() {
    if (!readyToDuel) return;

    readyToDuel = false;
    elements.gunman.classList.remove('standing');
    elements.gunman.classList.add(`gunman-level-${level}__shooting`);

    setTimeout(() => {
        playSound(sounds.shot);
        elements.message.classList.replace('message--fire', 'message--dead');
        elements.message.innerHTML = 'You are dead!';
        elements.gameScreen.classList.add('game-screen--death');
    }, timeToDuel / 3);

    elements.gunman.removeEventListener('mousedown', playerShootsGunman);

    setTimeout(() => {
        playSound(sounds.death);
        elements.restartButton.style.display = 'block';
    }, 1000);
}

function playerShootsGunman() {
    if (!readyToDuel) return;

    readyToDuel = false;
    playSound(sounds.shot);

    elements.message.classList.remove('message--fire');
    elements.gunman.classList.remove('standing', `gunman-level-${level}__shooting`);
    elements.gunman.classList.add(`gunman-level-${level}__death`);

    elements.gunman.removeEventListener('mousedown', playerShootsGunman);
    playSound(sounds.win);

    setTimeout(() => {
        elements.message.classList.add('message--win');
        elements.message.innerHTML = 'You Win!';
        scoreCount();
        elements.nextButton.style.display = 'block';
    }, 1000);
}

function scoreCount() {
    const scoreDisplay = document.querySelector('.score-panel__score_num');
    const points = +((timeToDuel - parseFloat(elements.timeYou.innerHTML)) * level * 10).toFixed(0);

    scoreDisplay.innerHTML = score + points;
}

function resetMessage() {
    elements.message.innerHTML = '';
    elements.message.classList.remove('message--dead', 'message--win');
}

function removeGunmanClasses() {
    const states = ['__standing', '__ready', '__shooting', '__death'];
    elements.gunman.classList.remove(`gunman-level-${level}`, ...states.map(state => `gunman-level-${level}${state}`));
}

function showVictoryScreen() {
    toggleVisibility([elements.message, elements.gameScreen, elements.gamePanels], 'none');
    score = +document.querySelector('.score-panel__score_num').innerHTML;
    document.querySelector('.score-panel__win-score_num').innerHTML = score;
    elements.winScreen.style.display = 'block';
}

function toggleVisibility(elements, display) {
    elements.forEach(element => element.style.display = display);
}

function playSound(sound, loop = false) {
    if (!sound) {
        console.error('Sound object is not defined!');
        return;
    }
    try {
        sound.pause(); 
        sound.currentTime = 0; 
        sound.loop = loop; 
        sound.play().catch((e) => console.error('Playback failed:', sound.src, e));
    } catch (e) {
        console.error('Audio playback error:', e);
    }

}
