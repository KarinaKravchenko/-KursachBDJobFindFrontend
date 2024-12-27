document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.getElementById("nav-links");

    function checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (!token) {
            return Promise.resolve(null);
        }

        return fetch('/api/auth/check', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            return null;
        });
    }

    function fetchUserRole(userId) {
        return fetch(`/api/user/role/${userId}`, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Не удалось получить роль пользователя');
            }
            return response.json();
        });
    }

    function updateNavigation(user) {
        const isOnJobPage = location.pathname.endsWith("jobs.html");
        const isOnEmployersPage = location.pathname.endsWith("employers.html");

        if (user) {
            navLinks.innerHTML = `
                <li class="nav-item">
                    ${isOnJobPage && user.role === "HR" ? '<a href="add-job.html" class="add-job-link">Добавить вакансию</a>' : ''}
                    ${isOnEmployersPage && user.role === "WORKER" ? '<a href="add-resume.html" class="add-resume-link">Добавить резюме</a>' : ''}
                    <a href="profile.html" class="user-name">${user.name}</a>
                </li>
                ${location.pathname !== "index.html" && location.pathname !== "/" ? `<li><a href="index.html" class="home-button">На главную</a></li>` : ""}
                <li><a href="#" class="logout-button">Выйти</a></li>
            `;

            document.querySelector(".logout-button").addEventListener("click", logout);
        } else {
            navLinks.innerHTML = `
                <li><a href="login.html">Войти</a></li>
                <li><a href="register.html">Регистрация</a></li>
            `;
        }
    }

    function logout() {
        const token = localStorage.getItem('authToken');
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            localStorage.removeItem('authToken');
            alert("Вы вышли из аккаунта!");
            location.reload();
        })
        .catch(error => {
            console.error('Logout failed:', error);
            localStorage.removeItem('authToken');
            location.reload();
        });
    }

    checkAuthStatus()
    .then(user => {
        if (user) {
            return fetchUserRole(user.id).then(roleData => ({
                ...user,
                role: roleData.role 
            }));
        }
        return null;
    })
    .then(userWithRole => updateNavigation(userWithRole))
    .catch(error => console.error('Ошибка:', error));
});
