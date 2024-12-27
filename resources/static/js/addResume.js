document.querySelector('#resume-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const resumeData = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        patronymic: document.getElementById('patronymic').value,
        position: document.getElementById('position').value,
        grade: document.getElementById('grade').value,
        salary: Number(document.getElementById('salary').value),
        skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
        country: document.getElementById('location').value.split(',')[0].trim(),
        region: document.getElementById('location').value.split(',')[1]?.trim() || '',
        city: document.getElementById('location').value.split(',')[2]?.trim() || '',
        contactEmail: document.getElementById('email').value,
        status: document.getElementById('status').value
    };

    fetch('/api/resumes/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(resumeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Резюме успешно добавлено!');
        event.target.reset(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка при добавлении резюме.');
    });
});
