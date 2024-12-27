document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    const userRole = localStorage.getItem('userRole') || 'worker';

    if (!jobId) {
        document.getElementById('job-details').innerHTML = '<p>Неверный формат ID вакансии.</p>';
        return;
    }

    function fetchJobDetails(jobId) {
        fetch(`/api/vacancies/find/${jobId}`, { 
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
        .then(job => displayJobDetails(job))
        .catch(error => {
            console.error('Ошибка загрузки данных:', error);
            document.getElementById('job-details').innerHTML = '<p>Произошла ошибка при загрузке данных.</p>';
        });
    }

    function displayJobDetails(job) {
        const jobDetails = document.getElementById('job-details');
        const jobStatus = job.status || 'Неактивно';

        jobDetails.innerHTML = `
            <div class="job-status ${jobStatus === 'Активно' ? 'active' : 'inactive'}">
                <p><strong>Статус:</strong> ${jobStatus}</p>
            </div>
            <h2>${job.position}</h2>
            <p><strong>Компания:</strong> ${job.company}</p>
            <p><strong>Зарплата:</strong> ${job.salary} ${job.currency}</p>
            <p><strong>Дата публикации:</strong> ${job.publishedDate}</p>
            <p><strong>Грейд:</strong> ${job.grade}</p>
            <p><strong>Описание:</strong> ${job.jobDescription}</p>
            <p><strong>Скиллы:</strong> ${job.skills ? job.skills.join(', ') : 'Не указаны'}</p>
            <p><strong>Локация:</strong> ${job.country}, ${job.region}, ${job.city}</p>
            <p><strong>Mail для связи:</strong> ${job.contactEmail}</p>
        `;

        if (userRole === 'hr') {
            const deleteButton = document.createElement('button');
            deleteButton.id = 'delete-job-button';
            deleteButton.textContent = 'Удалить вакансию';
            jobDetails.appendChild(deleteButton);

            deleteButton.addEventListener('click', () => deleteJob(job.id));
        }
    }

    function deleteJob(jobId) {
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
                document.getElementById('job-details').innerHTML = '<p>Вакансия успешно удалена.</p>';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при удалении вакансии.');
            });
        }
    }

    fetchJobDetails(jobId); 
});
