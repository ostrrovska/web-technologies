
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    document.getElementById('clock').innerHTML =
        `${hours}<span class="blink">:</span>${minutes}<span class="blink">:</span>${seconds}`;
}

function updateCountdown() {
    const targetDate = new Date(document.getElementById('targetDate').value);
    const now = new Date();

    if(!document.getElementById('targetDate').value || targetDate < now) {
        document.getElementById('countdown').textContent = '';
        return;
    }

    const difference = targetDate - now;
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('countdown').textContent =
        `${days}д ${hours}г ${minutes}хв ${seconds}с`;
}

function generateCalendar() {
    const picker = document.getElementById('monthPicker');
    const [year, month] = picker.value.split('-').map(Number);
    const date = new Date(year, month - 1)
    const calendar = document.getElementById('calendar');

    calendar.innerHTML = '';

    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    days.forEach(day => {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = day;
        calendar.appendChild(div);
    });

    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();

    for(let i = 0; i < firstDay; i++) {
        calendar.appendChild(createDayElement(''));
    }

    for(let day = 1; day <= lastDate; day++) {
        calendar.appendChild(createDayElement(day));
    }
}

function createDayElement(content) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    div.textContent = content;
    return div;
}

function updateBirthdayCountdown() {
    const birthday = document.getElementById('birthdayDate').value;
    if(!birthday) return;

    const now = new Date();
    const [year, month, day] = birthday.split('-');
    let nextBirthday = new Date(now.getFullYear(), month - 1, day);

    if(nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    const difference = nextBirthday - now;
    const months = Math.floor(difference / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('birthdayCountdown').textContent =
        `${months}м ${days}д ${hours}г ${minutes}хв ${seconds}с`;
}

document.addEventListener('DOMContentLoaded', () => {

    const now = new Date();
    document.getElementById('monthPicker').value =
        `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;

    setInterval(updateClock, 1000);
    setInterval(updateCountdown, 1000);
    setInterval(updateBirthdayCountdown, 1000);

    document.getElementById('monthPicker').addEventListener('change', generateCalendar);
    document.getElementById('targetDate').addEventListener('change', updateCountdown);
    document.getElementById('birthdayDate').addEventListener('change', updateBirthdayCountdown);

    generateCalendar();
    updateClock();
    updateCountdown();
    updateBirthdayCountdown();
});