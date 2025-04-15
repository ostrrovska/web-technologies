function task1() {
    let a = 0, b = 1, next;
    let sum = a + b;
    let count = 2;

    while (count < 10) {
        next = a + b;
        sum += next;
        a = b;
        b = next;
        count++;
    }
    return sum;
}

function task2() {
    function isPrime(n) {
        if (n <= 1) return false;
        if (n === 2) return true;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    let sum = 0;
    for (let i = 2; i <= 1000; i++) {
        if (isPrime(i)) sum += i;
    }
    return sum;
}

function task3() {
    const number = parseInt(prompt(' Enter the number(1-7):'));
    let day;
    switch (number) {
        case 1: day = 'Mon'; break;
        case 2: day = 'Tue'; break;
        case 3: day = 'Wed'; break;
        case 4: day = 'Thu'; break;
        case 5: day = 'Fri'; break;
        case 6: day = 'Sat'; break;
        case 7: day = 'Sun'; break;
        default: day = 'Wrong number'; break;
    }
    console.log(day);
}

function task4(arr) {
    return arr.filter(str => str.length % 2 !== 0);
}

const task5 = arr => arr.map(num => num + 1);

function task6(a, b) {
    return a + b === 10 || Math.abs(a - b) === 10;
}