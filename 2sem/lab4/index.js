// Task 1
function task1() {
    console.log('\n=== Task 1 ===');
    let fruits = ['apple', 'banana', 'orange', 'pear'];

    fruits.pop();
    console.log('1.1 Array after removing the last element:', fruits);

    fruits.unshift('pineapple');
    console.log('1.2 Array after adding pineapple:', fruits);

    fruits.sort((a, b) => b.localeCompare(a));
    console.log('1.3 Sorted array:', fruits);

    const appleIndex = fruits.indexOf('apple');
    console.log('1.4 Index of "apple":', appleIndex !== -1 ? appleIndex : 'Not found');
}

// Task 2
function task2() {
    console.log('\n=== Task 2 ===');
    const colors = ['red', 'blue', 'green', 'light blue', 'dark blue'];

    const lengths = colors.map(color => color.length);
    const longest = colors[lengths.indexOf(Math.max(...lengths))];
    const shortest = colors[lengths.indexOf(Math.min(...lengths))];
    console.log('2.1 Longest:', longest, '| Shortest:', shortest);

    const filteredColors = colors.filter(color => color.includes('blue'));
    console.log('2.2 Filtered array:', filteredColors);

    console.log('2.3 Result of join():', filteredColors.join(', '));
}

// Task 3
function task3() {
    console.log('\n=== Task 3 ===');
    let employees = [
        { name: 'John', age: 30, position: 'manager' },
        { name: 'Peter', age: 25, position: 'developer' },
        { name: 'Mary', age: 55, position: 'developer' },
        { name: 'Helen', age: 35, position: 'designer' }
    ];

    employees.sort((a, b) => a.name.localeCompare(b.name));
    console.log('3.1 Sorted by name:', employees);

    const developers = employees.filter(emp => emp.position === 'developer');
    console.log('3.2 All developers:', developers);


    employees = employees.filter(emp => emp.age >= 35);
    console.log('3.3 After removing employees younger than 35:', employees);


    employees.push({ name: 'Andrew', age: 40, position: 'tester' });
    console.log('3.4 Updated array:', employees);
}

// Task 4
function task4() {
    console.log('\n=== Task 4 ===');
    let students = [
        { name: 'Alex', age: 20, course: 2 },
        { name: 'Natalia', age: 22, course: 3 },
        { name: 'Victor', age: 19, course: 1 },
        { name: 'Irina', age: 21, course: 3 }
    ];


    students = students.filter(student => student.name !== 'Alex');
    console.log('4.1 After removing Alex:', students);

    students.push({ name: 'Maxim', age: 23, course: 4 });
    console.log('4.2 After adding Maxim:', students);

    students.sort((a, b) => b.age - a.age);
    console.log('4.3 Sorted by age (oldest to youngest):', students);

    const thirdCourseStudent = students.find(student => student.course === 3);
    console.log('4.4 Student in the 3rd course:', thirdCourseStudent);
}

// Task 5
function task5() {
    console.log('\n=== Task 5 ===');
    let numbers = [1, 2, 3, 4, 5];

    const squared = numbers.map(n => n ** 2);
    console.log('5.1 Squared numbers:', squared);

    const evenNumbers = numbers.filter(n => n % 2 === 0);
    console.log('5.2 Even numbers:', evenNumbers);

    const sum = numbers.reduce((acc, n) => acc + n);
    console.log('5.3 Sum of numbers:', sum);

    const newNumbers = [6, 7, 8, 9, 10];
    numbers = [...newNumbers, ...numbers];
    console.log('5.4 Array after adding new numbers:', numbers);

    numbers.splice(0, 3);
    console.log('5.5 Array after removing the first 3 elements:', numbers);
}

// Task 6
function task6() {
    console.log('\n=== Task 6 ===');
    const library = {
        books: [
            { title: 'Book 1', author: 'Author 1', genre: 'Genre 1', pages: 100, isAvailable: true }
        ],

        addBook(title, author, genre, pages) {
            this.books.push({ title, author, genre, pages, isAvailable: true });
            console.log(`6.1 Added book: ${title}`);
        },

        removeBook(title) {
            this.books = this.books.filter(book => book.title !== title);
            console.log(`6.2 Removed book: ${title}`);
        },

        findBooksByAuthor(author) {
            const booksByAuthor = this.books.filter(book => book.author === author);
            console.log(`6.3 Books by ${author}:`, booksByAuthor);
            return booksByAuthor;
        },

        toggleBookAvailability(title, isBorrowed) {
            const book = this.books.find(book => book.title === title);
            if (book) {
                book.isAvailable = !isBorrowed;
                console.log(`6.4 Toggled availability of ${title}:`, book.isAvailable ? 'Available' : 'Borrowed');
            }
        },

        sortBooksByPages() {
            this.books.sort((a, b) => a.pages - b.pages);
            console.log('6.5 Books sorted by pages:', this.books);
        },

        getBooksStatistics() {
            const total = this.books.length;
            const available = this.books.filter(book => book.isAvailable).length;
            const borrowed = total - available;
            const avgPages = this.books.reduce((acc, book) => acc + book.pages, 0) / total;
            console.log('6.6 Library statistics:', { total, available, borrowed, avgPages });
            return { total, available, borrowed, avgPages };
        }
    };

    // Test Task 6
    library.addBook('Book 2', 'Author 2', 'Genre 2', 200);
    library.addBook('Book 3', 'Book 1', 200, 300);
    library.addBook('Book 1', 'Book 4', 'Book 5', 600);
    library.removeBook('Book 1');
    library.findBooksByAuthor('Author 2');
    library.toggleBookAvailability('Book 2', true);
    library.sortBooksByPages();
    library.getBooksStatistics();
}

// Task 7
function task7() {
    console.log('\n=== Task 7 ===');
    const student = { name: 'John', age: 20, course: 3 };

    student.subjects = ['Math', 'History', 'Programming'];
    console.log('7.1 Student with subjects:', student);

    delete student.age;
    console.log('7.2 Student after removing age:', student);
}


(function main() {
    console.log('===== Execution Results =====');
    task1();
    task2();
    task3();
    task4();
    task5();
    task6();
    task7();
})();