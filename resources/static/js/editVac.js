document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    function getJobById(id) {
        return fetch(`/api/vacancies/find/${id}`, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
            return null;
        });
    }

    function displayJob(job) {
        if (!job) {
            document.getElementById('job-details').innerHTML = '<p>Вакансия не найдена.</p>';
            return;
        }

        const form = document.getElementById('add-job-form');
        form.innerHTML = `
            <input type="hidden" id="job-id" value="${job.id}">
            <label for="job-title">Название вакансии:</label>
            <input type="text" id="job-title" value="${job.jobTitle}" required>

            <label for="job-description">Описание вакансии:</label>
            <textarea id="job-description" required>${job.jobDescription}</textarea>

            <label for="job-salary">Зарплата:</label>
            <input type="text" id="job-salary" value="${job.jobSalary}" required>

            <label for="job-role">Позиция:</label>
            <input type="text" id="job-role" value="${job.jobRole}" required>

            <label for="company">Компания:</label>
            <input type="text" id="company" value="${job.company}" required>

            <label for="job-grade">Грейд:</label>
            <select id="job-grade" required>
                <option value="Junior" ${job.jobGrade === 'Junior' ? 'selected' : ''}>Junior</option>
                <option value="Middle" ${job.jobGrade === 'Middle' ? 'selected' : ''}>Middle</option>
                <option value="Senior" ${job.jobGrade === 'Senior' ? 'selected' : ''}>Senior</option>
            </select>

            <label for="country">Страна:</label>
            <input type="text" id="country" value="${job.country}" required>

            <label for="region">Регион:</label>
            <input type="text" id="region" value="${job.region}" required>

            <label for="city">Город:</label>
            <input type="text" id="city" value="${job.city}" required>

            <label for="published-date">Дата публикации:</label>
            <input type="date" id="published-date" value="${job.publishedDate}" required>

            <label for="currency">Валюта:</label>
            <select id="currency" required>
                <option value="RUB" ${job.currency === 'RUB' ? 'selected' : ''}>RUB</option>
                <option value="USD" ${job.currency === 'USD' ? 'selected' : ''}>USD</option>
                <option value="EUR" ${job.currency === 'EUR' ? 'selected' : ''}>EUR</option>
            </select>

            <label for="job-status">Статус вакансии:</label>
            <select id="job-status" required>
                <option value="Активна" ${job.jobStatus === 'Активна' ? 'selected' : ''}>Активна</option>
                <option value="Закрыта" ${job.jobStatus === 'Закрыта' ? 'selected' : ''}>Закрыта</option>
            </select>

            <button type="submit">Сохранить изменения</button>
        `;

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            updateJob();
        });
    }

    function updateJob() {
        const updatedJob = {
            id: document.getElementById('job-id').value,
            jobTitle: document.getElementById('job-title').value.trim(),
            jobDescription: document.getElementById('job-description').value.trim(),
            jobSalary: Number(document.getElementById('job-salary').value.trim()), 
            jobRole: document.getElementById('job-role').value.trim(),
            company: document.getElementById('company').value.trim(),
            jobGrade: document.getElementById('job-grade').value,
            country: document.getElementById('country').value.trim(),
            region: document.getElementById('region').value.trim(),
            city: document.getElementById('city').value.trim(),
            publishedDate: document.getElementById('published-date').value,
            currency: document.getElementById('currency').value,
            jobStatus: document.getElementById('job-status').value
        };

        for (let key in updatedJob) {
            if (updatedJob[key] === '') {
                alert(`Поле "${key}" не может быть пустым!`);
                return;
            }
        }

        fetch(`/api/vacancies/update`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(updatedJob)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Вакансия успешно обновлена!');
            window.location.href = 'jobs.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при обновлении вакансии');
        });
    }

    getJobById(jobId).then(displayJob);
});
