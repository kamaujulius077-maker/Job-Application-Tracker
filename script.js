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


/**
 * Initialize the form page
 */
function initializeFormPage() {
    const form = document.getElementById('application-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous error messages
        clearErrors();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = new FormData(form);
        const application = {
            id: Date.now(), // Unique ID based on timestamp
            company: formData.get('company').trim(),
            position: formData.get('position').trim(),
            dateApplied: formData.get('dateApplied'),
            status: formData.get('status'),
            notes: formData.get('notes').trim(),
            dateAdded: new Date().toISOString()
        };
        
        // Save to localStorage
        saveApplication(application);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });
    
    // Reset button handling
    form.addEventListener('reset', function() {
        clearErrors();
    });
}

/**
 * Validate the form inputs
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateForm() {
    let isValid = true;
    
    // Company name validation
    const company = document.getElementById('company-name');
    if (!company.value.trim()) {
        showError('company-error', 'Company name is required');
        isValid = false;
    } else if (company.value.trim().length < 2) {
        showError('company-error', 'Company name must be at least 2 characters');
        isValid = false;
    }
    
    // Position title validation
    const position = document.getElementById('position-title');
    if (!position.value.trim()) {
        showError('position-error', 'Position title is required');
        isValid = false;
    } else if (position.value.trim().length < 2) {
        showError('position-error', 'Position title must be at least 2 characters');
        isValid = false;
    }
    
    // Date validation
    const dateApplied = document.getElementById('date-applied');
    if (!dateApplied.value) {
        showError('date-error', 'Date applied is required');
        isValid = false;
    } else {
        const selectedDate = new Date(dateApplied.value);
        const today = new Date();
        if (selectedDate > today) {
            showError('date-error', 'Date cannot be in the future');
            isValid = false;
        }
    }
    
    // Status validation
    const status = document.getElementById('application-status');
    if (!status.value) {
        showError('status-error', 'Status is required');
        isValid = false;
    }
    
    return isValid;
}
