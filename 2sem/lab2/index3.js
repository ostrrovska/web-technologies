function getGradeIf(score) {
    if (score >= 90) return 'відмінно';
    else if (score >= 70) return 'добре';
    else if (score >= 50) return 'задовільно';
    else return 'незадовільно';
}

const getGradeTernary = (score) =>
    score >= 90 ? 'відмінно' :
        score >= 70 ? 'добре' :
            score >= 50 ? 'задовільно' : 'незадовільно';

console.log(getGradeIf(85));
console.log(getGradeTernary(45));

function getSeason(month) {
    if (month < 1 || month > 12) return 'Невірний місяць';
    if (month === 12 || month <= 2) return 'зима';
    else if (month <= 5) return 'весна';
    else if (month <= 8) return 'літо';
    else return 'осінь';
}

console.log(getSeason(6));

const getSeasonTernary = (month) =>
    month < 1 || month > 12 ? 'Невірний місяць' :
        month === 12 || month <= 2 ? 'зима' :
            month <= 5 ? 'весна' :
                month <= 8 ? 'літо' : 'осінь';

console.log(getSeasonTernary(11));