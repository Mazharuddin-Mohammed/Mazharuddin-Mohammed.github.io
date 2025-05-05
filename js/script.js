document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        const isDark = htmlElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        htmlElement.classList.add('dark');
    }

    // Typing Effect
    const phrases = ['Computational Scientist', 'Developer', 'Problem Solver', 'Tech Enthusiast'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingText = document.getElementById('typing-text');

    function type() {
        const currentPhrase = phrases[phraseIndex];
        typingText.textContent = currentPhrase.substring(0, charIndex);

        if (!isDeleting && charIndex < currentPhrase.length) {
            charIndex++;
            setTimeout(type, 100);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 50);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(type, isDeleting ? 50 : 1000);
        }
    }

    type();

    // Project Filter
    const projectList = document.getElementById('project-list');
    const username = 'Mazharuddin-Mohammed'; 
    let allRepos = [];

    function displayProjects(repos) {
        projectList.innerHTML = '';
        repos.forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card bg-white p-6 rounded-lg shadow-md';
            projectCard.dataset.language = repo.language || 'Unknown';
            projectCard.innerHTML = `
                <h3 class="text-xl font-semibold mb-2">${repo.name}</h3>
                <p class="text-gray-600 mb-2">${repo.description || 'No description available.'}</p>
                <p class="text-sm text-gray-500 mb-4">Language: ${repo.language || 'N/A'}</p>
                <a href="${repo.html_url}" target="_blank" class="text-blue-500 hover:underline">View on GitHub</a>
            `;
            projectList.appendChild(projectCard);
        });
    }

    fetch(`https://api.github.com/users/${username}/repos`)
        .then(response => response.json())
        .then(repos => {
            allRepos = repos;
            displayProjects(allRepos);

            // Filter Buttons
            document.querySelectorAll('.filter-btn').forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('bg-blue-500', 'text-white');
                        btn.classList.add('bg-gray-200', 'text-gray-800');
                    });
                    button.classList.remove('bg-gray-200', 'text-gray-800');
                    button.classList.add('bg-blue-500', 'text-white');

                    const filter = button.dataset.filter;
                    const filteredRepos = filter === 'all' ? allRepos : allRepos.filter(repo => repo.language === filter);
                    displayProjects(filteredRepos);
                });
            });
        })
        .catch(error => {
            projectList.innerHTML = '<p class="text-red-500">Failed to load projects.</p>';
            console.error('Error fetching repos:', error);
        });

    // Contact Form Validation
    const contactForm = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        nameError.classList.add('hidden');
        emailError.classList.add('hidden');
        messageError.classList.add('hidden');
        formSuccess.classList.add('hidden');

        // Validate inputs
        if (!nameInput.value.trim()) {
            nameError.classList.remove('hidden');
            isValid = false;
        }
        if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            emailError.classList.remove('hidden');
            isValid = false;
        }
        if (!messageInput.value.trim()) {
            messageError.classList.remove('hidden');
            isValid = false;
        }

        if (isValid) {
            formSuccess.classList.remove('hidden');
            contactForm.reset();
            setTimeout(() => formSuccess.classList.add('hidden'), 3000);
        }
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// Contact Form Validation and Submission
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Reset errors and messages
    nameError.classList.add('hidden');
    emailError.classList.add('hidden');
    messageError.classList.add('hidden');
    formSuccess.classList.add('hidden');
    formError.classList.add('hidden');

    // Validate inputs
    if (!nameInput.value.trim()) {
        nameError.classList.remove('hidden');
        isValid = false;
    }
    if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        emailError.classList.remove('hidden');
        isValid = false;
    }
    if (!messageInput.value.trim()) {
        messageError.classList.remove('hidden');
        isValid = false;
    }

    if (isValid) {
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                formSuccess.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => formSuccess.classList.add('hidden'), 3000);
            } else {
                formError.classList.remove('hidden');
                setTimeout(() => formError.classList.add('hidden'), 3000);
            }
        } catch (error) {
            formError.classList.remove('hidden');
            setTimeout(() => formError.classList.add('hidden'), 3000);
            console.error('Form submission error:', error);
        }
    }
});