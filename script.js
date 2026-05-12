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
    
