document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const jobData = {
        jobTitle: document.getElementById('job-title').value,
        jobDescription: document.getElementById('job-description').value,
        jobSalary: Number(document.getElementById('job-salary').value), 
        jobRole: document.getElementById('job-role').value,
        company: document.getElementById('company').value,
        jobGrade: document.getElementById('job-grade').value,
        country: document.getElementById('country').value,
        region: document.getElementById('region').value,
        city: document.getElementById('city').value,
        publishedDate: document.getElementById('published-date').value,
        currency: document.getElementById('currency').value,
        jobStatus: document.getElementById('job-status').value,
        contactEmail: document.getElementById('email').value,
        skills: document.getElementById('skills').value.split(',').map(skill => skill.trim())
    };

    fetch('/api/vacancies/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(jobData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Вакансия успешно добавлена!');
        event.target.reset(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Произошла ошибка при добавлении вакансии.');
    });
});
