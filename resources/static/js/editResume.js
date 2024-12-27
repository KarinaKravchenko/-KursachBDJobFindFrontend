document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('id');

    fetch(`/api/resumes/find/${resumeId}`, {
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
    .then(resume => {
        document.getElementById('first-name').value = resume.firstName;
        document.getElementById('last-name').value = resume.lastName;
        document.getElementById('patronymic').value = resume.patronymic;
        document.getElementById('position').value = resume.position;
        document.getElementById('grade').value = resume.grade;
        document.getElementById('salary').value = resume.salary;
        document.getElementById('skills').value = resume.skills.join(', ');
        document.getElementById('location').value = `${resume.country}, ${resume.region}, ${resume.city}`;
        document.getElementById('email').value = resume.contactEmail;
        document.getElementById('status').value = resume.status;
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Ошибка при загрузке данных резюме');
    });

    document.querySelector('#resume-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const updatedResume = {
            id: resumeId, 
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            patronymic: document.getElementById('patronymic').value,
            position: document.getElementById('position').value,
            grade: document.getElementById('grade').value,
            salary: Number(document.getElementById('salary').value),
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
            contactEmail: document.getElementById('email').value,
            status: document.getElementById('status').value
        };

        const [country, region, city] = document.getElementById('location').value.split(',').map(part => part.trim());
        updatedResume.country = country || '';
        updatedResume.region = region || '';
        updatedResume.city = city || '';

        fetch('/api/resumes/update', { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(updatedResume)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Резюме успешно обновлено!');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при обновлении резюме');
        });
    });
});
