function isInRange(number, min, max) {
    return number >= min && number <= max;
}

console.log(isInRange(5, 1, 10));

// let isActive = true;
// isActive = !isActive;

function toggle(value) {
    return !value;
}

console.log(toggle(true));