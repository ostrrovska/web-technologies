document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const countrySelect = document.getElementById('country');
    const citySelect = document.getElementById('city');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const successMessage = document.getElementById('successMessage');

    countrySelect.addEventListener('change', () => {
        citySelect.disabled = !countrySelect.value;
        citySelect.innerHTML = '<option value="">Виберіть місто</option>';

        if (countrySelect.value) {
            const cities = getCitiesByCountry(countrySelect.value);
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city.value;
                option.textContent = city.name;
                citySelect.appendChild(option);
            });
        }
    });

    togglePassword.addEventListener('click', () => togglePasswordVisibility(passwordInput, togglePassword));
    toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility(confirmPasswordInput, toggleConfirmPassword));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                showSuccessMessage("Реєстрація успішна! Вітаємо у нашій системі.");
                form.reset();
                citySelect.disabled = true;
                citySelect.innerHTML = '<option value="">Спочатку виберіть країну</option>';
            } catch (error) {
                console.error('Помилка при відправці форми:', error);
            }
        }
    });

    //validating in real time
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => validateField(input));
    });

    countrySelect.addEventListener('change', () => validateField(countrySelect));
    citySelect.addEventListener('change', () => validateField(citySelect));
});

function getCitiesByCountry(countryCode) {
    const cities = {
        'UA': [
            { value: 'KYIV', name: 'Київ' },
            { value: 'Lviv', name: 'Львів' },
            { value: 'Kharkiv', name: 'Харків' }
        ],
        'PL': [
            { value: 'Warsaw', name: 'Варшава' },
            { value: 'Krakow', name: 'Краків' },
            { value: 'Gdansk', name: 'Гданськ' }
        ],
        'DE': [
            { value: 'Berlin', name: 'Берлін' },
            { value: 'Munich', name: 'Мюнхен' },
            { value: 'Hamburg', name: 'Гамбург' }
        ]
    };
    return cities[countryCode] || [];
}

function togglePasswordVisibility(input, icon) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('fa-eye-slash');
}

function validateForm() {
    let isValid = true;
    const form = document.getElementById('registerForm');

    const fieldsToValidate = [
        'firstName', 'lastName', 'email', 'password',
        'confirmPassword', 'phone', 'birthDate',
        'country', 'city'
    ];

    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });

    const genderSelected = document.querySelector('input[name="gender"]:checked');
    if (!genderSelected) {
        showError(document.getElementById('genderError'), 'Будь ласка, оберіть стать');
        isValid = false;
    } else {
        hideError(document.getElementById('genderError'));
    }


    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showError(document.getElementById('confirmPasswordError'), 'Паролі не збігаються');
        document.getElementById('confirmPassword').classList.add('invalid');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldId}Error`);

    hideError(errorElement);
    field.classList.remove('invalid', 'valid');


    if (field.required && !value) {
        showError(errorElement, 'Це поле обов\'язкове для заповнення');
        field.classList.add('invalid');
        return false;
    }


    switch (fieldId) {
        case 'firstName':
        case 'lastName':
            if (value.length < 3 || value.length > 15) {
                showError(errorElement, 'Повинно бути від 3 до 15 символів');
                field.classList.add('invalid');
                return false;
            }
            break;

        case 'email':
            if (!validateEmail(value)) {
                showError(errorElement, 'Будь ласка, введіть коректний email');
                field.classList.add('invalid');
                return false;
            }
            break;

        case 'password':
            if (value.length < 6) {
                showError(errorElement, 'Пароль повинен містити щонайменше 6 символів');
                field.classList.add('invalid');
                return false;
            }
            break;

        case 'phone':
            if (!validatePhone(value)) {
                showError(errorElement, 'Будь ласка, введіть коректний номер телефону (+380XXXXXXXXX)');
                field.classList.add('invalid');
                return false;
            }
            break;

        case 'birthDate':
            if (!validateBirthDate(value)) {
                showError(errorElement, 'Некоректна дата народження або вам менше 12 років');
                field.classList.add('invalid');
                return false;
            }
            break;

        case 'country':
        case 'city':
            if (!value) {
                showError(errorElement, 'Будь ласка, оберіть значення');
                field.classList.add('invalid');
                return false;
            }
            break;
    }

    field.classList.add('valid');
    return true;
}

function validateEmail(email) {
    // Regex explanation:
// ^             : Start of the string.
// [a-zA-Z0-9._-]: Matches any alphanumeric character (a-z, A-Z, 0-9), dot (.), underscore (_), or hyphen (-).
// +             : One or more of the previous characters.
// @             : Matches the "@" symbol.
// [a-zA-Z0-9.-] : Matches any alphanumeric character (a-z, A-Z, 0-9), dot (.), or hyphen (-).
// +             : One or more of the previous characters.
// \.            : Matches a literal dot.
// [a-zA-Z]{2,6} : Matches between 2 and 6 alphabetic characters (a-z, A-Z).
// $             : End of the string.

    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+380\d{9}$/;
    return re.test(phone);
}

function validateBirthDate(dateString) {
    if (!dateString) return false;

    const birthDate = new Date(dateString);
    const today = new Date();


    if (birthDate > today) return false;


    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 12;
}

function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function hideError(element) {
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
    }
}

function showSuccessMessage(message) {
    const successElement = document.getElementById('successMessage');
    successElement.textContent = message;
    successElement.style.display = 'block';

    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000);
}
