// Task Review JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTaskReview();
    setupEventListeners();
    loadReviewTasks();
});

let reviewTasks = [];
let currentTask = null;
let currentRating = 0;

function initializeTaskReview() {
    console.log('Task Review initialized');
}

function setupEventListeners() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTasks(this.dataset.tab);
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(filterTasks, 300));

    // Filter functionality
    const reviewFilter = document.getElementById('reviewFilter');
    reviewFilter.addEventListener('change', filterTasks);

    // Modal functionality
    const closeReview = document.getElementById('closeReview');
    const reviewModal = document.getElementById('reviewModal');
    
    closeReview.addEventListener('click', () => reviewModal.classList.remove('active'));
    reviewModal.addEventListener('click', (e) => {
        if (e.target === reviewModal) {
            reviewModal.classList.remove('active');
        }
    });
}

function loadReviewTasks() {
    // Simulate API call
    const sampleTasks = [
        {
            id: 1,
            title: "Website Redesign Completion",
            description: "Completed the homepage redesign with new branding elements and improved user experience. All responsive breakpoints have been tested.",
            priority: "high",
            status: "pending",
            assignee: "John Doe",
            assigneeInitials: "JD",
            submittedDate: "2024-02-14",
            estimatedHours: 40,
            actualHours: 38,
            category: "Development",
            quality: 4,
            comments: "Great work on the responsive design!",
            attachments: ["design-mockups.zip", "test-results.pdf"]
        },
        {
            id: 2,
            title: "Database Migration",
            description: "Successfully migrated customer database to new server with zero downtime. All data integrity checks passed.",
            priority: "urgent",
            status: "pending",
            assignee: "Sarah Wilson",
            assigneeInitials: "SW",
            submittedDate: "2024-02-13",
            estimatedHours: 24,
            actualHours: 22,
            category: "Operations",
            quality: 5,
            comments: "",
            attachments: ["migration-log.txt"]
        },
        {
            id: 3,
            title: "API Documentation Update",
            description: "Updated API documentation for version 2.0 with comprehensive examples and tutorials.",
            priority: "medium",
            status: "approved",
            assignee: "Mike Johnson",
            assigneeInitials: "MJ",
            submittedDate: "2024-02-10",
            approvedDate: "2024-02-12",
            estimatedHours: 16,
            actualHours: 14,
            category: "Documentation",
            quality: 4,
            comments: "Well documented with good examples.",
            attachments: ["api-docs-v2.pdf"]
        },
        {
            id: 4,
            title: "Security Audit Report",
            description: "Completed security audit and vulnerability assessment. Found 3 minor issues that need addressing.",
            priority: "high",
            status: "revisions",
            assignee: "Emma Davis",
            assigneeInitials: "ED",
            submittedDate: "2024-02-11",
            estimatedHours: 32,
            actualHours: 35,
            category: "Security",
            quality: 3,
            comments: "Please address the identified vulnerabilities before final approval.",
            attachments: ["security-audit.pdf", "vulnerability-list.xlsx"]
        }
    ];

    reviewTasks = sampleTasks;
    renderTasks(reviewTasks);
    updateReviewStats(reviewTasks);
}

function renderTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-check-circle"></i>
                <h3>No tasks to review</h3>
                <p>All caught up! Great work.</p>
            </div>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksList.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `review-task-card ${task.status}`;
    card.setAttribute('data-task-id', task.id);
    
    const submittedDate = formatDate(task.submittedDate);
    const daysAgo = getDaysAgo(task.submittedDate);
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title-section">
                <h3>${task.title}</h3>
                <div class="task-meta">
                    <span class="task-assignee">${task.assignee}</span>
                    <span class="task-category">${task.category}</span>
                    <span class="task-submitted">Submitted ${daysAgo}</span>
                </div>
            </div>
            <div class="task-actions">
                ${task.status === 'pending' ? `
                <button class="btn-review btn-approve" onclick="approveTask(${task.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="btn-review btn-revision" onclick="requestRevision(${task.id})">
                    <i class="fas fa-redo"></i> Revision
                </button>
                ` : ''}
                <button class="btn-review btn-details" onclick="openReviewModal(${task.id})">
                    <i class="fas fa-eye"></i> Details
                </button>
            </div>
        </div>
        <div class="task-details-preview">
            <p class="task-description">${task.description}</p>
            <div class="task-info">
                <div class="info-item">
                    <span class="info-label">Priority</span>
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Estimated Hours</span>
                    <span class="info-value">${task.estimatedHours}h</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Actual Hours</span>
                    <span class="info-value">${task.actualHours}h</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Status</span>
                    <span class="status-badge status-${task.status}">${task.status}</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

function openReviewModal(taskId) {
    const task = reviewTasks.find(t => t.id === taskId);
    if (!task) return;
    
    currentTask = task;
    const modal = document.getElementById('reviewModal');
    const taskDetails = document.getElementById('taskDetails');
    const reviewForm = document.getElementById('reviewForm');
    
    // Load task details
    taskDetails.innerHTML = `
        <div class="task-detail-section">
            <h4>Task Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Title:</span>
                    <span class="detail-value">${task.title}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${task.description}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Assignee:</span>
                    <span class="detail-value">${task.assignee}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">${task.category}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority:</span>
                    <span class="detail-value task-priority priority-${task.priority}">${task.priority}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Submitted:</span>
                    <span class="detail-value">${formatDate(task.submittedDate)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Hours (Est/Act):</span>
                    <span class="detail-value">${task.estimatedHours}h / ${task.actualHours}h</span>
                </div>
            </div>
        </div>
        
        ${task.attachments && task.attachments.length > 0 ? `
        <div class="task-detail-section">
            <h4>Attachments</h4>
            <div class="attachments-list">
                ${task.attachments.map(file => `
                    <div class="attachment-item">
                        <i class="fas fa-file"></i>
                        <span>${file}</span>
                        <button class="btn-download" onclick="downloadAttachment('${file}')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
    `;
    
    // Load review form based on task status
    if (task.status === 'pending') {
        reviewForm.innerHTML = `
            <h4>Review & Feedback</h4>
            <div class="rating-section">
                <label>Quality Rating</label>
                <div class="rating-stars" id="ratingStars">
                    ${[1,2,3,4,5].map(star => `
                        <span class="star ${star <= currentRating ? 'active' : ''}" 
                              data-rating="${star}" 
                              onclick="setRating(${star})">★</span>
                    `).join('')}
                </div>
            </div>
            <div class="form-group">
                <label for="reviewComments">Comments & Feedback</label>
                <textarea id="reviewComments" placeholder="Provide constructive feedback...">${task.comments || ''}</textarea>
            </div>
            <div class="revision-options" id="revisionOptions" style="display: none;">
                <label>Revision Requirements</label>
                <div class="revision-option" onclick="selectRevisionOption('minor')">
                    <input type="radio" name="revisionType" value="minor">
                    <span>Minor Revisions</span>
                </div>
                <div class="revision-option" onclick="selectRevisionOption('major')">
                    <input type="radio" name="revisionType" value="major">
                    <span>Major Revisions</span>
                </div>
                <div class="revision-option" onclick="selectRevisionOption('specific')">
                    <input type="radio" name="revisionType" value="specific">
                    <span>Specific Changes</span>
                </div>
            </div>
            <div class="review-actions">
                <button class="btn btn-secondary" onclick="closeReviewModal()">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button class="btn btn-warning" id="revisionBtn" onclick="submitRevision()" style="display: none;">
                    <i class="fas fa-redo"></i> Request Revision
                </button>
                <button class="btn btn-success" onclick="submitApproval()">
                    <i class="fas fa-check"></i> Approve Task
                </button>
            </div>
        `;
        
        // Initialize rating with task's existing quality if available
        if (task.quality) {
            setRating(task.quality);
        }
    } else {
        reviewForm.innerHTML = `
            <h4>Review Details</h4>
            <div class="review-details">
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="status-badge status-${task.status}">${task.status}</span>
                </div>
                ${task.quality ? `
                <div class="detail-item">
                    <span class="detail-label">Quality Rating:</span>
                    <span class="detail-value">
                        ${'★'.repeat(task.quality)}${'☆'.repeat(5 - task.quality)}
                    </span>
                </div>
                ` : ''}
                ${task.comments ? `
                <div class="detail-item">
                    <span class="detail-label">Comments:</span>
                    <span class="detail-value">${task.comments}</span>
                </div>
                ` : ''}
                ${task.approvedDate ? `
                <div class="detail-item">
                    <span class="detail-label">Approved Date:</span>
                    <span class="detail-value">${formatDate(task.approvedDate)}</span>
                </div>
                ` : ''}
            </div>
            <div class="review-actions">
                <button class="btn btn-secondary" onclick="closeReviewModal()">
                    <i class="fas fa-times"></i> Close
                </button>
                ${task.status !== 'approved' ? `
                <button class="btn btn-success" onclick="approveTask(${task.id})">
                    <i class="fas fa-check"></i> Approve Now
                </button>
                ` : ''}
            </div>
        `;
    }
    
    modal.classList.add('active');
}

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
}

function selectRevisionOption(type) {
    const options = document.querySelectorAll('.revision-option');
    options.forEach(opt => opt.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    const revisionBtn = document.getElementById('revisionBtn');
    revisionBtn.style.display = 'block';
}

function submitApproval() {
    if (!currentTask) return;
    
    const comments = document.getElementById('reviewComments')?.value || '';
    
    // Update task status
    currentTask.status = 'approved';
    currentTask.approvedDate = new Date().toISOString().split('T')[0];
    currentTask.quality = currentRating;
    currentTask.comments = comments;
    
    showNotification(`Task "${currentTask.title}" approved successfully!`, 'success');
    closeReviewModal();
    refreshTaskList();
}

function submitRevision() {
    if (!currentTask) return;
    
    const comments = document.getElementById('reviewComments')?.value || '';
    const revisionType = document.querySelector('input[name="revisionType"]:checked')?.value;
    
    if (!revisionType) {
        showNotification('Please select a revision type', 'error');
        return;
    }
    
    // Update task status
    currentTask.status = 'revisions';
    currentTask.quality = currentRating;
    currentTask.comments = comments;
    currentTask.revisionType = revisionType;
    
    showNotification(`Revision requested for "${currentTask.title}"`, 'warning');
    closeReviewModal();
    refreshTaskList();
}

function approveTask(taskId) {
    const task = reviewTasks.find(t => t.id === taskId);
    if (task) {
        currentTask = task;
        currentRating = task.quality || 5;
        submitApproval();
    }
}

function requestRevision(taskId) {
    const task = reviewTasks.find(t => t.id === taskId);
    if (task) {
        currentTask = task;
        currentRating = task.quality || 3;
        openReviewModal(taskId);
        
        // Show revision options
        setTimeout(() => {
            const revisionOptions = document.getElementById('revisionOptions');
            const revisionBtn = document.getElementById('revisionBtn');
            if (revisionOptions) {
                revisionOptions.style.display = 'block';
                revisionBtn.style.display = 'block';
            }
        }, 100);
    }
}

function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('active');
    currentTask = null;
    currentRating = 0;
}

function filterTasks(filter = 'all') {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('reviewFilter').value;
    
    let filteredTasks = reviewTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                            task.description.toLowerCase().includes(searchTerm) ||
                            task.assignee.toLowerCase().includes(searchTerm);
        
        const matchesTab = filter === 'all' || task.status === filter;
        const matchesFilter = statusFilter === 'all' || task.status === statusFilter;
        
        return matchesSearch && matchesTab && matchesFilter;
    });
    
    renderTasks(filteredTasks);
}

function refreshTaskList() {
    renderTasks(reviewTasks);
    updateReviewStats(reviewTasks);
}

function updateReviewStats(tasks) {
    const pending = tasks.filter(t => t.status === 'pending').length;
    const approved = tasks.filter(t => t.status === 'approved').length;
    const revisions = tasks.filter(t => t.status === 'revisions').length;
    
    document.getElementById('pendingReviews').textContent = pending;
    document.getElementById('approvedTasks').textContent = approved;
    document.getElementById('revisionTasks').textContent = revisions;
    
    // Calculate average review time (simplified)
    const avgTime = tasks.length > 0 ? Math.round(tasks.reduce((sum, task) => sum + (task.actualHours || 0), 0) / tasks.length) : 0;
    document.getElementById('avgReviewTime').textContent = `${avgTime}h`;
}

function downloadAttachment(filename) {
    showNotification(`Downloading ${filename}...`, 'info');
    // In real implementation, this would download the actual file
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getDaysAgo(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Add CSS for additional styles
const style = document.createElement('style');
style.textContent = `
    .no-tasks {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-light);
    }
    
    .no-tasks i {
        font-size: 48px;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .no-tasks h3 {
        font-size: 24px;
        margin-bottom: 10px;
        color: var(--text);
    }
    
    .task-detail-section {
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border);
    }
    
    .task-detail-section:last-child {
        border-bottom: none;
    }
    
    .task-detail-section h4 {
        color: var(--primary);
        margin-bottom: 15px;
        font-size: 18px;
    }
    
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    
    .detail-label {
        font-weight: 600;
        color: var(--primary);
        font-size: 14px;
    }
    
    .detail-value {
        color: var(--text);
        font-size: 14px;
    }
    
    .attachments-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .attachment-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 15px;
        background: var(--background);
        border-radius: 6px;
        border: 1px solid var(--border);
    }
    
    .btn-download {
        background: none;
        border: none;
        color: var(--secondary);
        cursor: pointer;
        padding: 5px;
        border-radius: 4px;
    }
    
    .btn-download:hover {
        background: rgba(120, 134, 199, 0.1);
    }
    
    .review-details {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
`;
document.head.appendChild(style);