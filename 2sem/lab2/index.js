function findMinMax(arr) {
    if (arr.length === 0) return { min: undefined, max: undefined };
    return {
        min: Math.min(...arr),
        max: Math.max(...arr)
    };
}

console.log(findMinMax([3, 1, 4, 1, 5, 9]));

function compareObjects(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (obj1[key] !== obj2[key]) return false;
    }

    return true;
}

const objA = { name: 'Ivan', age: 25 };
const objB = { name: 'Ivan', age: 25 };
console.log(compareObjects(objA, objB));
