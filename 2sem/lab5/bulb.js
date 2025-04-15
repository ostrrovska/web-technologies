const bulb = document.getElementById('bulb');
const toggleBtn = document.getElementById('toggleBtn');
const bulbTypeSelect = document.getElementById('bulbType');
const brightnessBtn = document.getElementById('brightnessBtn');

let isOn = false;
let brightness = 100;
let autoOffTimer;

function init() {
    bulb.classList.add(bulbTypeSelect.value);
    updateBrightnessButton();

    toggleBtn.addEventListener('click', toggleBulb);
    bulbTypeSelect.addEventListener('change', changeBulbType);
    brightnessBtn.addEventListener('click', changeBrightness);

    document.addEventListener('mousemove', resetAutoOffTimer);
    document.addEventListener('keydown', resetAutoOffTimer);
    document.addEventListener('click', resetAutoOffTimer);
}

function toggleBulb() {
    isOn = !isOn;
    bulb.classList.toggle('on', isOn);
    toggleBtn.textContent = isOn ? 'Вимкнути' : 'Увімкнути';
    resetAutoOffTimer();
}

function changeBulbType() {
    bulb.className = 'bulb';
    bulb.classList.add(this.value);
    if (isOn) bulb.classList.add('on');
    updateBrightnessButton();
    resetAutoOffTimer();
}

function changeBrightness() {
    if (!supportsBrightness()) {
        alert('Цей тип лампочки не підтримує регулювання яскравості');
        return;
    }

    const input = prompt('Введіть яскравість (0-100):', brightness);
    const value = parseInt(input);

    if (!isNaN(value) && value >= 0 && value <= 100) {
        brightness = value;
        bulb.style.filter = `brightness(${brightness}%)`;
    } else {
        alert('Будь ласка, введіть число від 0 до 100');
    }
    resetAutoOffTimer();
}

function supportsBrightness() {
    return ['energy-saving', 'led'].includes(bulbTypeSelect.value);
}

function updateBrightnessButton() {
    brightnessBtn.disabled = !supportsBrightness();
}

function resetAutoOffTimer() {
    clearTimeout(autoOffTimer);
    if (isOn) {
        autoOffTimer = setTimeout(() => {
            toggleBulb();
        }, 300000);
    }
}

document.addEventListener('DOMContentLoaded', init);