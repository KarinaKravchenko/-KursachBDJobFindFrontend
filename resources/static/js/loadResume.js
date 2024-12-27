document.addEventListener('DOMContentLoaded', () => {
    const resumeList = document.querySelector('.resume-list');
    const resumeForm = document.getElementById('resume-form');

    function fetchResumes() {
        fetch('/api/resumes', {
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
        .then(resumes => {
            resumeList.innerHTML = '';
            resumes.forEach(resume => displayResume(resume));
        })
        .catch(error => {
            console.error('Ошибка загрузки резюме:', error);
            resumeList.innerHTML = '<p>Произошла ошибка при загрузке резюме.</p>';
        });
    }

    function displayResume(resume) {
        const resumeItem = document.createElement('div');
        resumeItem.classList.add('resume-item');

        resumeItem.innerHTML = `
            <h3>${resume.firstName} ${resume.lastName}</h3>
            <p><strong>Позиция:</strong> ${resume.position}</p>
            <p><strong>Грейд:</strong> ${resume.grade}</p>
            <p><strong>Навыки:</strong> ${resume.skills.join(', ')}</p>
            <div class="resume-status-wrapper">
                <div class="re-status ${resume.status === 'Активно' ? 'active' : 'inactive'}">
                    <p>${resume.status}</p>
                </div>
                <a href="resume-details.html?id=${resume.id}" class="button">Подробнее</a>
            </div>
        `;

        resumeList.appendChild(resumeItem);
    }

    resumeForm.addEventListener('submit', event => {
        event.preventDefault();

        const formData = new FormData(resumeForm);
        const newResume = {
            firstName: formData.get('first-name'),
            lastName: formData.get('last-name'),
            patronymic: formData.get('patronymic'),
            position: formData.get('position'),
            grade: formData.get('grade'),
            salary: Number(formData.get('salary')), 
            skills: formData.get('skills').split(',').map(skill => skill.trim()),
            country: formData.get('location').split(',')[0]?.trim() || '',
            region: formData.get('location').split(',')[1]?.trim() || '',
            city: formData.get('location').split(',')[2]?.trim() || '',
            contactEmail: formData.get('email'),
            status: 'Активно',
        };

        fetch('/api/resumes/add', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(newResume)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(savedResume => {
            displayResume(savedResume);
            resumeForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при добавлении резюме');
        });
    });

    fetchResumes(); 
});
