/**
 * Job Application Tracker - JavaScript
 * Handles form validation, LocalStorage persistence, DOM manipulation and dynamic interactions
 */

// APPLICATION STATE AND STORAGE

// Key for localStorage
const STORAGE_KEY = 'jobApplications';

/**
 * Initialize the application on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form if on add-application page
    const formElement = document.getElementById('application-form');
    if (formElement) {
        initializePage();
    }

    // Initialize dashboard 
   const applicationsTable = document.getElementById('applications-table');
    if (applicationsTable) {
        initializeDashboard();
    } 

    // Initialize statistics page
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) {
        initializeStatistics();
    }

    // Set active link
    setActiveLink();
});


/**
 * Set the active navigation link 
 */
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link')

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.remove('active');

        if ((currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === href)) {
             link.classList.add('active');   
            }
    });
}
