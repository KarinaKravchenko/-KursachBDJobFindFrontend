document.addEventListener("DOMContentLoaded", () => {
    const jobList = document.querySelector('.job-list');
    const userRole = localStorage.getItem('userRole') || 'worker'; 

    function fetchJobs() {
        fetch('/api/vacancies', { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка загрузки: ${response.status}`);
            }
            return response.json();
        })
        .then(jobs => {
            jobList.innerHTML = '';
            jobs.forEach(job => displayJob(job));
        })
        .catch(error => {
            console.error('Ошибка при загрузке вакансий:', error);
            jobList.innerHTML = '<p>Не удалось загрузить вакансии.</p>';
        });
    }

    function displayJob(job) {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-card-header">
                <h3>${job.position}</h3>
            </div>
            <div class="job-card-body">
                <p><strong>Компания:</strong> ${job.company}</p>
                <p><strong>Позиция:</strong> ${job.grade}</p>
                <p><strong>Зарплата:</strong> ${job.salary} ${job.currency}</p>
                <p><strong>Дата публикации:</strong> ${job.publishedDate}</p>
                <p><strong>Статус:</strong> ${job.status || 'Не указано'}</p>
            </div>
            <div class="job-card-footer">
                <a href="job-details.html?id=${job.id}" class="button">Подробнее</a>
                ${userRole === "hr" ? `
                    <button class="edit-button button">Изменить</button>
                    <button class="delete-button">Удалить</button>` : ''}
            </div>
        `;

        if (userRole === "hr") {
            const editButton = jobCard.querySelector('.edit-button');
            const deleteButton = jobCard.querySelector('.delete-button');

            editButton.addEventListener('click', () => {
                window.location.href = `edit-job.html?id=${job.id}`;
            });

            deleteButton.addEventListener('click', () => deleteJob(job.id, jobCard));
        }

        jobList.appendChild(jobCard);
    }

    function deleteJob(jobId, jobCard) {
        if (confirm('Вы уверены, что хотите удалить эту вакансию?')) {
            fetch(`/api/vacancies/delete/${jobId}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                jobCard.remove();
                alert('Вакансия успешно удалена.');
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при удалении вакансии.');
            });
        }
    }

    fetchJobs();
});
