// Performance Trend Chart
const ctx = document.getElementById('curveChart').getContext('2d');
const curveChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [{
      label: 'Overall Performance',
      data: [70, 75, 80, 78, 85, 88, 90, 92],
      fill: true,
      borderColor: '#2D336B',
      backgroundColor: 'rgba(45, 51, 107, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#FFF2F2',
      pointBorderColor: '#2D336B',
      pointRadius: 6,
      borderWidth: 3,
    },
    {
      label: 'Department Average',
      data: [65, 70, 72, 75, 78, 80, 82, 85],
      fill: false,
      borderColor: '#7886C7',
      backgroundColor: 'rgba(120, 134, 199, 0.1)',
      tension: 0.4,
      pointBackgroundColor: '#FFF2F2',
      pointBorderColor: '#7886C7',
      pointRadius: 5,
      borderWidth: 2,
      borderDash: [5, 5],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: { 
          color: '#2D336B',
          font: { size: 14 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 242, 242, 0.9)',
        titleColor: '#2D336B',
        bodyColor: '#2D336B',
        borderColor: '#7886C7',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          color: 'rgba(45, 51, 107, 0.1)'
        }
      },
      y: {
        min: 50,
        max: 100,
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          color: 'rgba(45, 51, 107, 0.1)'
        }
      }
    }
  }
});

// Skill Distribution Chart
const skillCtx = document.getElementById('skillChart').getContext('2d');
const skillChart = new Chart(skillCtx, {
  type: 'doughnut',
  data: {
    labels: ['Machine Operation', 'Quality Control', 'Maintenance', 'Safety', 'Teamwork'],
    datasets: [{
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        '#2D336B',
        '#7886C7',
        '#A9B5DF',
        '#FFF2F2',
        '#D1D9F0'
      ],
      borderColor: '#FFF2F2',
      borderWidth: 3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#2D336B',
          padding: 20,
          font: { size: 12 }
        }
      }
    },
    cutout: '60%'
  }
});

// Department Comparison Chart
const deptCtx = document.getElementById('departmentChart').getContext('2d');
const departmentChart = new Chart(deptCtx, {
  type: 'bar',
  data: {
    labels: ['Production', 'Quality', 'Maintenance', 'Safety', 'Logistics'],
    datasets: [{
      label: 'Performance Score',
      data: [87, 92, 79, 96, 83],
      backgroundColor: [
        '#2D336B',
        '#7886C7',
        '#A9B5DF',
        '#FFF2F2',
        '#D1D9F0'
      ],
      borderColor: '#FFF2F2',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          display: false
        }
      },
      y: {
        min: 50,
        max: 100,
        ticks: { 
          color: '#2D336B',
          font: { size: 12 }
        },
        grid: { 
          color: 'rgba(45, 51, 107, 0.1)'
        }
      }
    }
  }
});

// Heatmap data and generation
const performanceData = [
  [80, 85, 70, 90, 95, 92],
  [65, 70, 75, 80, 85, 88],
  [90, 85, 88, 92, 91, 94],
  [100, 95, 98, 97, 99, 100]
];

const skills = ['Machine Operation', 'Quality Control', 'Maintenance', 'Safety'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const heatmap = document.getElementById('heatmap');

// Create header row
heatmap.innerHTML = '<div class="heatmap-header"></div>';
months.forEach(m => {
  const headerCell = document.createElement('div');
  headerCell.className = 'heatmap-header';
  headerCell.textContent = m;
  headerCell.style.backgroundColor = '#2D336B';
  heatmap.appendChild(headerCell);
});

// Create data rows
performanceData.forEach((row, i) => {
  const skillCell = document.createElement('div');
  skillCell.className = 'heatmap-header';
  skillCell.textContent = skills[i];
  skillCell.style.backgroundColor = '#2D336B';
  heatmap.appendChild(skillCell);
  
  row.forEach(value => {
    const cell = document.createElement('div');
    
    // Create gradient based on performance value
    if (value >= 90) {
      cell.style.backgroundColor = '#2D336B';
    } else if (value >= 80) {
      cell.style.backgroundColor = '#7886C7';
    } else if (value >= 70) {
      cell.style.backgroundColor = '#A9B5DF';
    } else {
      cell.style.backgroundColor = '#D1D9F0';
    }
    
    cell.innerHTML = `<span class="heatmap-value">${value}</span>`;
    heatmap.appendChild(cell);
  });
});

// Add interactivity to filter buttons
document.querySelectorAll('.filter-btn').forEach(button => {
  button.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    this.classList.add('active');
    
    // In a real application, this would filter the data
    // For this demo, we'll just show a message
    console.log(`Filtering by: ${this.textContent}`);
  });
});
// Sample data for the dashboard
const sampleTasks = [
    {
        id: 1,
        title: "Design System Implementation",
        description: "Create and implement design system for new product features",
        priority: "high",
        assignee: "john",
        dueDate: "2024-02-15",
        status: "in-progress",
        createdAt: "2024-01-20"
    },
    {
        id: 2,
        title: "API Documentation",
        description: "Update API documentation for version 2.0 release",
        priority: "medium",
        assignee: "sarah",
        dueDate: "2024-02-10",
        status: "pending",
        createdAt: "2024-01-25"
    },
    {
        id: 3,
        title: "Performance Optimization",
        description: "Optimize database queries and improve application performance",
        priority: "urgent",
        assignee: "mike",
        dueDate: "2024-02-05",
        status: "overdue",
        createdAt: "2024-01-15"
    },
    {
        id: 4,
        title: "User Testing Session",
        description: "Conduct user testing for new feature feedback",
        priority: "low",
        assignee: "emma",
        dueDate: "2024-02-20",
        status: "completed",
        createdAt: "2024-01-18"
    },
    {
        id: 5,
        title: "Security Audit",
        description: "Perform comprehensive security audit of the application",
        priority: "high",
        assignee: "john",
        dueDate: "2024-02-12",
        status: "in-progress",
        createdAt: "2024-01-22"
    }
];

const teamMembers = [
    { id: "john", name: "John Doe", role: "Frontend Developer", tasksCompleted: 12 },
    { id: "sarah", name: "Sarah Wilson", role: "Technical Writer", tasksCompleted: 8 },
    { id: "mike", name: "Mike Johnson", role: "Backend Developer", tasksCompleted: 15 },
    { id: "emma", name: "Emma Davis", role: "UX Designer", tasksCompleted: 10 }
];

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    updateStatistics();
    renderTasks();
    renderTeamPerformance();
    initializeCharts();
});

function initializeDashboard() {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = currentDate;
}

function setupEventListeners() {
    // Modal functionality
    const addTaskBtn = document.getElementById('addTaskBtn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelTaskBtn = document.getElementById('cancelTask');
    const modal = document.getElementById('addTaskModal');
    const taskForm = document.getElementById('taskForm');

    addTaskBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', closeModal);
    cancelTaskBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    taskForm.addEventListener('submit', handleTaskSubmit);

    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', renderTasks);

    // Chart filter buttons
    const chartFilters = document.querySelectorAll('.btn-filter');
    chartFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            chartFilters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateCharts(this.textContent.toLowerCase());
        });
    });
}

function closeModal() {
    const modal = document.getElementById('addTaskModal');
    modal.classList.remove('active');
    document.getElementById('taskForm').reset();
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newTask = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        priority: document.getElementById('taskPriority').value,
        assignee: document.getElementById('taskAssignee').value,
        dueDate: document.getElementById('taskDueDate').value,
        status: document.getElementById('taskStatus').value,
        createdAt: new Date().toISOString().split('T')[0]
    };

    sampleTasks.unshift(newTask);
    renderTasks();
    updateStatistics();
    initializeCharts();
    closeModal();
    
    // Show success message
    showNotification('Task added successfully!', 'success');
}

function updateStatistics() {
    const totalTasks = sampleTasks.length;
    const completedTasks = sampleTasks.filter(task => task.status === 'completed').length;
    const pendingTasks = sampleTasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
    const overdueTasks = sampleTasks.filter(task => {
        if (task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        return dueDate < today;
    }).length;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('overdueTasks').textContent = overdueTasks;
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const statusFilter = document.getElementById('statusFilter').value;
    
    let filteredTasks = sampleTasks;
    if (statusFilter !== 'all') {
        filteredTasks = sampleTasks.filter(task => task.status === statusFilter);
    }

    tasksList.innerHTML = '';

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="no-tasks">No tasks found</div>';
        return;
    }

    filteredTasks.forEach(task => {
        const taskItem = createTaskElement(task);
        tasksList.appendChild(taskItem);
    });
}

function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item priority-${task.priority}`;
    
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const isOverdue = dueDate < today && task.status !== 'completed';
    
    const assignee = teamMembers.find(member => member.id === task.assignee);
    
    taskItem.innerHTML = `
        <div class="task-header">
            <div class="task-title">${task.title}</div>
            <div class="task-priority priority-${task.priority}">${task.priority}</div>
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-meta">
            <div class="task-assignee">
                <div class="assignee-avatar">${assignee.name.split(' ').map(n => n[0]).join('')}</div>
                ${assignee.name}
            </div>
            <div class="task-due ${isOverdue ? 'overdue' : ''}">
                <i class="fas fa-calendar"></i>
                ${formatDate(task.dueDate)}
            </div>
            <div class="task-status status-${task.status}">
                ${task.status.replace('-', ' ')}
            </div>
        </div>
    `;
    
    return taskItem;
}

function renderTeamPerformance() {
    const performanceList = document.getElementById('teamPerformance');
    
    teamMembers.forEach(member => {
        const memberTasks = sampleTasks.filter(task => task.assignee === member.id);
        const completed = memberTasks.filter(task => task.status === 'completed').length;
        const inProgress = memberTasks.filter(task => task.status === 'in-progress').length;
        const pending = memberTasks.filter(task => task.status === 'pending').length;
        
        const performanceItem = document.createElement('div');
        performanceItem.className = 'performance-item';
        
        performanceItem.innerHTML = `
            <div class="member-avatar">${member.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="member-info">
                <div class="member-name">${member.name}</div>
                <div class="member-role">${member.role}</div>
            </div>
            <div class="member-stats">
                <div class="member-tasks">${completed}/${memberTasks.length}</div>
                <div class="member-label">Tasks Done</div>
            </div>
        `;
        
        performanceList.appendChild(performanceItem);
    });
}

function initializeCharts() {
    // Progress Chart
    const progressCtx = document.getElementById('progressChart').getContext('2d');
    const progressChart = new Chart(progressCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
            datasets: [{
                label: 'Tasks Completed',
                data: [8, 12, 15, 18, 22],
                borderColor: '#7886C7',
                backgroundColor: 'rgba(120, 134, 199, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }, {
                label: 'Tasks Created',
                data: [12, 15, 14, 16, 20],
                borderColor: '#2D336B',
                backgroundColor: 'rgba(45, 51, 107, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#2D336B',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(45, 51, 107, 0.1)'
                    },
                    ticks: {
                        color: '#2D336B'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(45, 51, 107, 0.1)'
                    },
                    ticks: {
                        color: '#2D336B'
                    }
                }
            }
        }
    });

    // Distribution Chart
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    const distributionChart = new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['High Priority', 'Medium Priority', 'Low Priority', 'Urgent'],
            datasets: [{
                data: [
                    sampleTasks.filter(task => task.priority === 'high').length,
                    sampleTasks.filter(task => task.priority === 'medium').length,
                    sampleTasks.filter(task => task.priority === 'low').length,
                    sampleTasks.filter(task => task.priority === 'urgent').length
                ],
                backgroundColor: [
                    '#f44336',
                    '#FF9800',
                    '#4CAF50',
                    '#9C27B0'
                ],
                borderColor: '#FFF2F2',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#2D336B',
                        padding: 20,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // Store chart instances for updates
    window.progressChart = progressChart;
    window.distributionChart = distributionChart;
}

function updateCharts(timeframe) {
    // This function would update chart data based on the selected timeframe
    // For demo purposes, we'll just log the selection
    console.log(`Updating charts for: ${timeframe}`);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .no-tasks {
        text-align: center;
        color: #7886C7;
        padding: 40px 20px;
        font-style: italic;
    }
`;
document.head.appendChild(style);