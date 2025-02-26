function displayStudentName(event) {
    const studentName = "Kateryna";
    event.target.textContent = studentName;
}

const buttons = document.querySelectorAll("ul li .displayButton");

buttons.forEach(button => {
    button.addEventListener("mousedown", displayStudentName);
});