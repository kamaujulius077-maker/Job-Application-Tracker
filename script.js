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

/**
 * Show error message from a form field
 * @param {string} erroElementId - ID of the error message elelment
 * @param {string} message - Error message to display
 */

function showError(errorElementId, message) {
    const errorElement = document.getElementById(errorElementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Clear all error messages from the form
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show')
    })
}

/**
 * Show success message
 */
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.classList.add('show');
    }
}


/**
 * Initialize the dashboard page
 */
function initializeDashboard() {
    // Display applications
    displayApplications();
    
    // Set up filter
    const filterSelect = document.getElementById('status-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            displayApplications(this.value);
        });
    }
}

/**
 * Display applications in the table
 * @param {string} filterStatus - Filter by status (optional)
 */
function displayApplications(filterStatus = 'all') {
    const applications = getAllApplications();
    const applicationsBody = document.getElementById('applications-body');
    const applicationsTable = document.getElementById('applications-table');
    const emptyState = document.getElementById('empty-state');
    
    // Clear the table
    applicationsBody.innerHTML = '';
    
    // Filter applications
    let filteredApplications = applications;
    if (filterStatus !== 'all') {
        filteredApplications = applications.filter(app => app.status === filterStatus);
    }
    
    // Show/hide empty state
    if (filteredApplications.length === 0) {
        emptyState.style.display = 'block';
        applicationsTable.classList.add('hidden');
        return;
    }
    
    emptyState.style.display = 'none';
    applicationsTable.classList.remove('hidden');
    
    // Sort by date (newest first)
    filteredApplications.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    // Populate table
    filteredApplications.forEach(application => {
        const row = createApplicationRow(application);
        applicationsBody.appendChild(row);
    });
}

/**
 * Create a table row for an application
 * @param {Object} application - Application object
 * @returns {HTMLElement} Table row element
 */
function createApplicationRow(application) {
    const row = document.createElement('tr');
    
    // Format date
    const dateObj = new Date(application.dateApplied);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Status badge
    const statusClass = `status-${application.status.toLowerCase()}`;
    
    // Notes preview (truncate to 50 characters)
    const notesPreview = application.notes ? application.notes.substring(0, 50) + 
                         (application.notes.length > 50 ? '...' : '') : '-';
    
    row.innerHTML = `
        <td><strong>${escapeHtml(application.company)}</strong></td>
        <td>${escapeHtml(application.position)}</td>
        <td>${formattedDate}</td>
        <td><span class="status-badge ${statusClass}">${application.status}</span></td>
        <td title="${escapeHtml(application.notes)}">${escapeHtml(notesPreview)}</td>
        <td>
            <div class="actions-cell">
                <button class="btn btn-edit" onclick="editApplication(${application.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteApplication(${application.id})">Delete</button>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Delete an application
 * @param {number} id - Application ID
 */
function deleteApplication(id) {
    if (confirm('Are you sure you want to delete this application?')) {
        removeApplication(id);
        displayApplications();
    }
}

/**
 * Edit an application (placeholder for future implementation)
 * @param {number} id - Application ID
 */
function editApplication(id) {
    const application = getApplicationById(id);
    if (application) {
        // Store the application in sessionStorage for editing
        sessionStorage.setItem('editingApplication', JSON.stringify(application));
        
        // Redirect to add application page (which would need to check for editing mode)
        // For now, just show an alert
        alert('Edit functionality: You can edit application:\n' + 
              'Company: ' + application.company + '\n' +
              'Position: ' + application.position);
    }
}

/**
 * Initialize the statistics page
 */
function initializeStatistics() {
    updateStatistics();
}

/**
 * Update statistics display
 */
function updateStatistics() {
    const applications = getAllApplications();
    
    if (applications.length === 0) {
        // Show empty state
        document.querySelector('.insights-container').innerHTML = 
            '<p class="insight-empty">No applications yet. Start adding applications to see insights!</p>';
        return;
    }
    
    // Count by status
    const counts = {
        total: applications.length,
        applied: 0,
        interviewed: 0,
        offered: 0,
        rejected: 0
    };
    
    applications.forEach(app => {
        if (app.status === 'Applied') counts.applied++;
        else if (app.status === 'Interviewed') counts.interviewed++;
        else if (app.status === 'Offered') counts.offered++;
        else if (app.status === 'Rejected') counts.rejected++;
    });
    
    // Update stat cards
    document.getElementById('total-applications').textContent = counts.total;
    document.getElementById('applied-count').textContent = counts.applied;
    document.getElementById('interviewed-count').textContent = counts.interviewed;
    document.getElementById('offered-count').textContent = counts.offered;
    document.getElementById('rejected-count').textContent = counts.rejected;
    
    // Calculate success rate (offered / total)
    const successRate = counts.total > 0 ? 
        Math.round((counts.offered / counts.total) * 100) : 0;
    document.getElementById('success-rate').textContent = successRate + '%';
    
    // Update breakdown
    updateBreakdown(counts);
    
    // Update insights
    updateInsights(counts, applications);
}

/**
 * Update the status breakdown section
 * @param {Object} counts - Count object with status breakdowns
 */
function updateBreakdown(counts) {
    const breakdownContainer = document.getElementById('status-breakdown');
    const total = counts.total;
    
    const breakdownHTML = `
        <div class="breakdown-item">
            <span class="breakdown-label">Applied</span>
            <div class="breakdown-bar">
                <div class="breakdown-fill" style="width: ${(counts.applied / total) * 100}%">
                    <span>${counts.applied}</span>
                </div>
            </div>
            <span class="breakdown-count">${counts.applied}</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">Interviewed</span>
            <div class="breakdown-bar">
                <div class="breakdown-fill" style="width: ${(counts.interviewed / total) * 100}%; background: linear-gradient(90deg, #f39c12, #e67e22);">
                    <span>${counts.interviewed}</span>
                </div>
            </div>
            <span class="breakdown-count">${counts.interviewed}</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">Offered</span>
            <div class="breakdown-bar">
                <div class="breakdown-fill" style="width: ${(counts.offered / total) * 100}%; background: linear-gradient(90deg, #27ae60, #229954);">
                    <span>${counts.offered}</span>
                </div>
            </div>
            <span class="breakdown-count">${counts.offered}</span>
        </div>
        <div class="breakdown-item">
            <span class="breakdown-label">Rejected</span>
            <div class="breakdown-bar">
                <div class="breakdown-fill" style="width: ${(counts.rejected / total) * 100}%; background: linear-gradient(90deg, #e74c3c, #c0392b);">
                    <span>${counts.rejected}</span>
                </div>
            </div>
            <span class="breakdown-count">${counts.rejected}</span>
        </div>
    `;
    
    breakdownContainer.innerHTML = breakdownHTML;
}

/**
 * Update insights section
 * @param {Object} counts - Count object with status breakdowns
 * @param {Array} applications - Array of all applications
 */
function updateInsights(counts, applications) {
    const insightsContainer = document.getElementById('insights-container');
    const insights = [];
    
    // Insight 1: Total applications
    insights.push(`You have applied to <strong>${counts.total}</strong> positions so far.`);
    
    // Insight 2: Interview rate
    if (counts.applied > 0) {
        const interviewRate = Math.round((counts.interviewed / counts.applied) * 100);
        insights.push(`Your interview rate is <strong>${interviewRate}%</strong> (${counts.interviewed} interviews from ${counts.applied} applications).`);
    }
    
    // Insight 3: Offers
    if (counts.offered > 0) {
        insights.push(`Congratulations! You have received <strong>${counts.offered}</strong> offer${counts.offered > 1 ? 's' : ''}.`);
    }
    
    // Insight 4: Most recent application
    const mostRecent = applications[0];
    if (mostRecent) {
        const dateObj = new Date(mostRecent.dateAdded);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        insights.push(`Your most recent application was on <strong>${formattedDate}</strong> at <strong>${mostRecent.company}</strong>.`);
    }
    
    // Render insights
    insightsContainer.innerHTML = insights
        .map(insight => `<div class="insight-item">${insight}</div>`)
        .join('');
}