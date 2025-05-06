// Configuration
const config = {
    username: 'Mazharuddin-Mohammed',
    typingPhrases: ['Computational Scientist', 'Developer', 'Problem Solver', 'Tech Enthusiast'],
    typingSpeed: {
        type: 100,
        delete: 50,
        pauseBetweenPhrases: 1000
    },
    formSubmission: {
        successMessageDuration: 3000,
        errorMessageDuration: 3000
    }
};

// Global variables
let projectList;

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
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingText = document.getElementById('typing-text');

    function type() {
        const currentPhrase = config.typingPhrases[phraseIndex];
        typingText.textContent = currentPhrase.substring(0, charIndex);

        if (!isDeleting && charIndex < currentPhrase.length) {
            charIndex++;
            setTimeout(type, config.typingSpeed.type);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, config.typingSpeed.delete);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                phraseIndex = (phraseIndex + 1) % config.typingPhrases.length;
            }
            setTimeout(type, isDeleting ? config.typingSpeed.delete : config.typingSpeed.pauseBetweenPhrases);
        }
    }

    type();

    // Project Filter
    projectList = document.getElementById('project-list');
    let allRepos = [];

    console.log('Fetching repos for username:', config.username);
    fetch(`https://api.github.com/users/${config.username}/repos`)
        .then(response => {
            console.log('API response status:', response.status);
            if (!response.ok) {
                throw new Error(`GitHub API responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(repos => {
            console.log('Repos fetched successfully:', repos.length);
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
            console.error('Detailed error fetching repos:', error);
            projectList.innerHTML = '<p class="text-red-500">Failed to load projects.</p>';
            console.error('Error fetching repos:', error);
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
                setTimeout(() => formSuccess.classList.add('hidden'), config.formSubmission.successMessageDuration);
            } else {
                formError.classList.remove('hidden');
                setTimeout(() => formError.classList.add('hidden'), config.formSubmission.errorMessageDuration);
            }
        } catch (error) {
            formError.classList.remove('hidden');
            setTimeout(() => formError.classList.add('hidden'), config.formSubmission.errorMessageDuration);
            console.error('Form submission error:', error);
        }
    }
});

function displayProjects(repos) {
    console.log('displayProjects called with', repos.length, 'repos');
    console.log('projectList element:', projectList);

    if (!projectList) {
        console.error('projectList is undefined or null!');
        return;
    }

    projectList.innerHTML = '';
    repos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card bg-white p-6 rounded-lg shadow-md';
        projectCard.dataset.language = repo.language || 'Unknown';
        projectCard.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${repo.name}</h3>
            <p class="text-gray-600 mb-2">${repo.description || 'No description available.'}</p>
            <p class="text-sm text-gray-500 mb-4">Language: ${repo.language || 'N/A'}</p>
            <a href="${repo.html_url}" target="_blank" class="text-blue-500 hover:underline" onclick="gtag('event', 'click_project', { 'project_name': '${repo.name}', 'language': '${repo.language || 'N/A'}' });">View on GitHub</a>
        `;
        projectList.appendChild(projectCard);
    });

    try {
        // Add dynamic meta description for projects
        const metaDescription = document.querySelector('meta[name="description"]');
        const projectNames = repos.slice(0, 5).map(repo => repo.name).join(', '); // Limit to first 5 projects for meta description
        metaDescription.content = `Portfolio of Dr. Mazharuddin Mohammed, featuring projects like ${projectNames}. Specializing in Quantum Technologies, Full Stack, C++/Python, JavaScript web and app development.`;
    } catch (error) {
        console.error('Error updating meta description:', error);
    }
}

