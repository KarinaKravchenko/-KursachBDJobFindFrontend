document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('id');

    let userRole = ''; 

    function fetchUserRole() {
        return fetch('/api/user/role', { 
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
        })
        .then(data => {
            userRole = data.role; 
        });
    }

    function displayResume(resume) {
        const resumeDetails = document.getElementById('resume-details');
        let html = `
        <div class="resume-status ${resume.status === 'Активно' ? 'active' : 'inactive'}">
            <p><strong>Статус:</strong> ${resume.status}</p>
        </div>
        <h2>${resume.lastName} ${resume.firstName} ${resume.patronymic}</h2>
        <p><strong>Позиция:</strong> ${resume.position}</p>
        <p><strong>Грейд:</strong> ${resume.grade}</p>
        <p><strong>Желаемая зарплата:</strong> ${resume.salary} руб.</p>
        <p><strong>Навыки:</strong> ${resume.skills.join(', ')}</p>
        <p><strong>Местоположение:</strong> ${resume.country}, ${resume.region}, ${resume.city}</p>
        <p><strong>Контактный email:</strong> ${resume.contactEmail}</p>
        `;

        if (userRole !== 'HR') {
            html += `
            <div class="resume-actions">
                <button id="edit-resume" class="action-button edit-button">Изменить резюме</button>
                <button id="delete-resume" class="action-button delete-button">Удалить резюме</button>
            </div>
            `;
        }

        resumeDetails.innerHTML = html;

        if (userRole !== 'hr') {
            document.getElementById('edit-resume').addEventListener('click', () => editResume(resume.id));
            document.getElementById('delete-resume').addEventListener('click', () => deleteResume(resume.id));
        }
    }

    function editResume(id) {
        window.location.href = `edit-resume.html?id=${id}`;
    }

    function deleteResume(id) {
        if (confirm('Вы уверены, что хотите удалить это резюме?')) {
            fetch(`/api/resumes/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                alert('Резюме успешно удалено.');
                window.location.href = 'index.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Произошла ошибка при удалении резюме.');
            });
        }
    }

    fetchUserRole()
    .then(() => {
        return fetch(`/api/resumes/find/${resumeId}`, { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(resume => {
        displayResume(resume);
    })
    .catch(error => {
        console.error('Ошибка загрузки данных:', error);
        document.getElementById('resume-details').innerHTML = '<p>Произошла ошибка при загрузке данных.</p>';
    });
});
