
function displayStudentName() {
    const studentName = "Kateryna";
    const button = document.querySelector("#displayButton");
    button.textContent = studentName;
}

const button = document.querySelector("#displayButton");
button.addEventListener("mousedown", displayStudentName);