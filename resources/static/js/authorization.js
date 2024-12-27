document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login form");
    const registerForm = document.querySelector("#register form");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const email = loginForm.querySelector('input[name="email"]').value;
        const password = loginForm.querySelector('input[name="password"]').value;

        const authRequest = { email, password };

        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authRequest)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            window.location.href = "index.html";
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка входа. Проверьте email и пароль.');
        });
    });

    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const firstName = registerForm.querySelector('input[name="first_name"]').value;
        const lastName = registerForm.querySelector('input[name="last_name"]').value;
        const middleName = registerForm.querySelector('input[name="middle_name"]').value;
        const email = registerForm.querySelector('input[name="email"]').value;
        const password = registerForm.querySelector('input[name="new_password"]').value;
        const role = registerForm.querySelector('input[name="selected_role"]').value;

        const registerRequest = { firstName, lastName, middleName, email, password, role };

        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerRequest)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.json();
        })
        .then(data => {
            alert('Регистрация успешна! Теперь вы можете войти.');
            showTab('login');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка регистрации. Попробуйте еще раз.');
        });
    });
});

function showTab(tabName) {
    const tabs = document.querySelectorAll('.form-container');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    document.querySelector(`.tab-button[onclick="showTab('${tabName}')"]`).classList.add('active');
}
