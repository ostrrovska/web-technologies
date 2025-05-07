document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Form submission and validation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {

            } catch (error) {
                console.error('Error submitting the form:', error);
                showMessage(errorMessage, "An error occurred. Please try again.");
            }
        }
    });

    // Real-time validation for input fields
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => validateField(input));
    });

    // "Forgot Password?" handler
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMessage(successMessage, "Instructions for password recovery have been sent to email, linked to your account.");
    });
});

function validateForm() {
    let isValid = true;

    const username = document.getElementById('username');
    if (!validateField(username)) {
        isValid = false;
    }

    const password = document.getElementById('password');
    if (!validateField(password)) {
        isValid = false;
    }

    return isValid;
}


function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldId}Error`);

    // Reset error state
    hideError(errorElement);
    field.classList.remove('invalid', 'valid');

    // Check if required fields are filled
    if (field.required && !value) {
        showError(errorElement, 'This field is required');
        field.classList.add('invalid');
        return false;
    }

    // Specific validation for each field
    switch (fieldId) {
        case 'username':
            if (value.length < 3) {
                showError(errorElement, 'Username must be at least 3 characters long');
                field.classList.add('invalid');
                return false;
            }
            break;

        case 'password':
            if (value.length < 6) {
                showError(errorElement, 'Password must be at least 6 characters long');
                field.classList.add('invalid');
                return false;
            }
            break;
    }

    field.classList.add('valid');
    return true;
}

// Displays error messages
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

// Hides error messages
function hideError(element) {
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
    }
}

// Shows a message element with a given message
function showMessage(element, message) {
    document.querySelectorAll('.success-message, .error-message').forEach(msg => {
        msg.style.display = 'none';
    });

    if (element) {
        element.textContent = message;
        element.style.display = 'block';

        // Auto-hide message after 5 seconds
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}


