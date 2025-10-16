// Task List JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTaskList();
    setupEventListeners();
    loadTasks();
});

let allTasks = [];

function initializeTaskList() {
    // Initialize any default settings
    console.log('Task List initialized');
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(filterTasks, 300));

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    statusFilter.addEventListener('change', filterTasks);
    priorityFilter.addEventListener('change', filterTasks);

    // Export functionality
    const exportBtn = document.getElementById('exportTasks');
    exportBtn.addEventListener('click', exportTasks);

    // Modal functionality
    const modal = document.getElementById('taskModal');
    const closeBtn = document.getElementById('closeModal');
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function loadTasks() {
    // Simulate API call
    const sampleTasks = [
        {
            id: 1,
            title: "Website Redesign",
            description: "Complete the homepage redesign with new branding elements and improved user experience.",
            priority: "high",
            status: "in-progress",
            assignee: "John Doe",
            assigneeInitials: "JD",
            deadline: "2024-02-15",
            createdAt: "2024-01-20",
            estimatedHours: 40,
            category: "Development"
        },
        {
            id: 2,
            title: "Database Migration",
            description: "Migrate customer database to new server with zero downtime.",
            priority: "urgent",
            status: "pending",
            assignee: "Sarah Wilson",
            assigneeInitials: "SW",
            deadline: "2024-02-10",
            createdAt: "2024-01-25",
            estimatedHours: 24,
            category: "Operations"
        },
        {
            id: 3,
            title: "API Documentation",
            description: "Update API documentation for version 2.0 release with examples and tutorials.",
            priority: "medium",
            status: "completed",
            assignee: "Mike Johnson",
            assigneeInitials: "MJ",
            deadline: "2024-02-05",
            createdAt: "2024-01-15",
            estimatedHours: 16,
            category: "Documentation"
        },
        {
            id: 4,
            title: "Security Audit",
            description: "Perform comprehensive security audit and vulnerability assessment.",
            priority: "high",
            status: "in-progress",
            assignee: "Emma Davis",
            assigneeInitials: "ED",
            deadline: "2024-02-20",
            createdAt: "2024-01-18",
            estimatedHours: 32,
            category: "Security"
        },
        {
            id: 5,
            title: "Mobile App Testing",
            description: "Test new mobile app features across different devices and platforms.",
            priority: "medium",
            status: "pending",
            assignee: "David Brown",
            assigneeInitials: "DB",
            deadline: "2024-02-12",
            createdAt: "2024-01-22",
            estimatedHours: 20,
            category: "Testing"
        }
    ];

    allTasks = sampleTasks;
    renderTasks(allTasks);
    updateTaskStats(allTasks);
}

function renderTasks(tasks) {
    const tasksGrid = document.getElementById('tasksGrid');
    tasksGrid.innerHTML = '';

    if (tasks.length === 0) {
        tasksGrid.innerHTML = `
            <div class="no-tasks">
                <i class="fas fa-tasks"></i>
                <h3>No tasks found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksGrid.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = `task-card priority-${task.priority}`;
    card.setAttribute('data-task-id', task.id);
    
    const deadlineClass = getDeadlineClass(task.deadline);
    const deadlineText = formatDeadline(task.deadline);
    
    card.innerHTML = `
        <div class="task-header">
            <div>
                <h3 class="task-title">${task.title}</h3>
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
            </div>
        </div>
        <p class="task-description">${task.description}</p>
        <div class="task-meta">
            <div class="task-assignee">
                <div class="assignee-avatar">${task.assigneeInitials}</div>
                ${task.assignee}
            </div>
            <div class="task-deadline ${deadlineClass}">${deadlineText}</div>
        </div>
        <div class="task-status status-${task.status}">
            ${task.status.replace('-', ' ')}
        </div>
    `;

    card.addEventListener('click', () => openTaskModal(task));
    return card;
}

function openTaskModal(task) {
    const modal = document.getElementById('taskModal');
    const modalBody = document.getElementById('taskModalBody');
    
    const deadlineClass = getDeadlineClass(task.deadline);
    const deadlineText = formatDeadline(task.deadline);
    
    modalBody.innerHTML = `
        <div class="task-detail-item">
            <h4>Description</h4>
            <p>${task.description}</p>
        </div>
        <div class="task-detail-item">
            <h4>Details</h4>
            <p><strong>Category:</strong> ${task.category}</p>
            <p><strong>Priority:</strong> <span class="task-priority priority-${task.priority}">${task.priority}</span></p>
            <p><strong>Status:</strong> <span class="task-status status-${task.status}">${task.status.replace('-', ' ')}</span></p>
            <p><strong>Assignee:</strong> ${task.assignee}</p>
            <p><strong>Deadline:</strong> <span class="${deadlineClass}">${deadlineText}</span></p>
            <p><strong>Estimated Hours:</strong> ${task.estimatedHours}h</p>
            <p><strong>Created:</strong> ${formatDate(task.createdAt)}</p>
        </div>
        <div class="task-detail-item">
            <h4>Actions</h4>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn btn-primary" onclick="editTask(${task.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-secondary" onclick="reassignTask(${task.id})">
                    <i class="fas fa-user-friends"></i> Reassign
                </button>
                ${task.status !== 'completed' ? `
                <button class="btn btn-success" onclick="markComplete(${task.id})">
                    <i class="fas fa-check"></i> Complete
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('taskModal');
    modal.classList.remove('active');
}

function filterTasks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    
    let filteredTasks = allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                            task.description.toLowerCase().includes(searchTerm) ||
                            task.assignee.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    renderTasks(filteredTasks);
    updateTaskStats(filteredTasks);
}

function updateTaskStats(tasks) {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => t.status === 'pending').length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.status === 'completed').length;
}

function exportTasks() {
    // Simple CSV export implementation
    const headers = ['Title', 'Description', 'Priority', 'Status', 'Assignee', 'Deadline', 'Category'];
    const csvContent = [
        headers.join(','),
        ...allTasks.map(task => [
            `"${task.title}"`,
            `"${task.description}"`,
            task.priority,
            task.status,
            `"${task.assignee}"`,
            task.deadline,
            task.category
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Tasks exported successfully!', 'success');
}

// Utility functions
function getDeadlineClass(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'deadline-overdue';
    if (diffDays === 0) return 'deadline-today';
    if (diffDays <= 3) return 'deadline-today';
    return 'deadline-future';
}

function formatDeadline(deadline) {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `Due in ${diffDays} days`;
    return `Due ${deadlineDate.toLocaleDateString()}`;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
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

// Action functions
function editTask(taskId) {
    showNotification(`Editing task ${taskId}`, 'info');
    // In real implementation, open edit form
}

function reassignTask(taskId) {
    showNotification(`Reassigning task ${taskId}`, 'info');
    // In real implementation, open reassignment dialog
}

function markComplete(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'completed';
        renderTasks(allTasks);
        updateTaskStats(allTasks);
        closeModal();
        showNotification(`Task "${task.title}" marked as completed!`, 'success');
    }
}

function showNotification(message, type = 'info') {
    // Implementation same as in supervisor_dashboard.js
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Add CSS for no-tasks state
const style = document.createElement('style');
style.textContent = `
    .no-tasks {
        grid-column: 1 / -1;
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
    
    .btn-success {
        background: var(--success);
        color: white;
    }
    
    .btn-success:hover {
        background: #45a049;
    }
`;
document.head.appendChild(style);

function openTaskModal(taskId) {
    fetch(`/supervisor/task_details/${taskId}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById("taskModalBody").innerHTML = html;
            document.getElementById("taskModal").style.display = "block";
        });
}

document.getElementById("closeModal").onclick = function() {
    document.getElementById("taskModal").style.display = "none";
};
