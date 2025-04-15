const lights = {
    red: document.getElementById('red'),
    yellow: document.getElementById('yellow'),
    green: document.getElementById('green'),
};
const statusElement = document.getElementById('status');
const nextBtn = document.getElementById('nextBtn');
const changeDurationBtn = document.getElementById('changeDurationBtn');

let currentState = 'red';
let durations = { red: 5000, yellow: 3000, green: 7000 };
let timer;
let blinkCount = 0;
let isBlinking = false;

function updateStatus(text) {
    statusElement.textContent = text;
}

function resetLights() {
    Object.values(lights).forEach(light => light.classList.remove('active', 'blinking'));
}

function changeState(newState) {
    resetLights();
    currentState = newState;

    switch(newState) {
        case 'red':
            lights.red.classList.add('active');
            updateStatus('Червоний');
            timer = setTimeout(() => changeState('yellow'), durations.red);
            break;

        case 'yellow':
            lights.yellow.classList.add('active');
            updateStatus('Жовтий');
            timer = setTimeout(() => changeState('green'), durations.yellow);
            break;

        case 'green':
            lights.green.classList.add('active');
            updateStatus('Зелений');
            timer = setTimeout(startBlinking, durations.green);
            break;
    }
}

function startBlinking() {
    isBlinking = true;
    blinkCount = 0;
    resetLights();
    lights.yellow.classList.add('active', 'blinking');
    updateStatus('Жовтий (blinking)');
    const blinkInterval = setInterval(() => {
        blinkCount++;
        if(blinkCount >= 3) {
            clearInterval(blinkInterval);
            isBlinking = false;
            lights.yellow.classList.remove('blinking');
            changeState('red');
        }
    }, 1000);
}

function changeDuration() {
    const newRed = parseInt(prompt('Червоний (секунди):', durations.red / 1000));
    const newYellow = parseInt(prompt('Жовтий (секунди):', durations.yellow / 1000));
    const newGreen = parseInt(prompt('Зелений (секунди):', durations.green / 1000));

    if([newRed, newYellow, newGreen].every(t => !isNaN(t) && t > 0)) {
        durations = {
            red: newRed * 1000,
            yellow: newYellow * 1000,
            green: newGreen * 1000
        };
        alert('Тривалість оновлено!');
    } else {
        alert('Невірні значення!');
    }
}

nextBtn.addEventListener('click', () => {
    if(isBlinking) return;

    clearTimeout(timer);
    switch(currentState) {
        case 'red': changeState('yellow'); break;
        case 'yellow': changeState('green'); break;
        case 'green': startBlinking(); break;
    }
});

changeDurationBtn.addEventListener('click', changeDuration);

changeState('red');