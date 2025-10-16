// Supervisor Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEventListeners();
    loadPerformanceChart();
});

function initializeDashboard() {
    // Set current date in header if needed
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Update any date displays
    console.log('Dashboard initialized on:', currentDate);
}

function setupEventListeners() {
    // Quick Assign Button
    const quickAssignBtn = document.getElementById('quickAssign');
    if (quickAssignBtn) {
        quickAssignBtn.addEventListener('click', function() {
            window.location.href = 'task_assign.html';
        });
    }
    
    // Time filter change
    const timeFilter = document.querySelector('.time-filter');
    if (timeFilter) {
        timeFilter.addEventListener('change', function() {
            updatePerformanceData(this.value);
        });
    }
    
    // Card hover effects
    const cards = document.querySelectorAll('.card, .stat-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Task action buttons
    document.querySelectorAll('.task-actions .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const taskItem = this.closest('.task-item');
            const taskName = taskItem.querySelector('h4').textContent;
            
            if (this.classList.contains('btn-warning')) {
                handleUrgentTask(taskName);
            } else if (this.classList.contains('btn-secondary')) {
                reviewTask(taskName);
            }
        });
    });
    
    // Member card clicks
    document.querySelectorAll('.member-card').forEach(card => {
        card.addEventListener('click', function() {
            const memberName = this.querySelector('h4').textContent;
            viewMemberDetails(memberName);
        });
    });
}

function loadPerformanceChart() {
    const chartContainer = document.getElementById('performanceChart');
    if (!chartContainer) return;
    
    // Simple SVG-based chart (in real app, use Chart.js or similar)
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 400 200");
    
    // Sample data points
    const data = [65, 59, 80, 81, 56, 55, 70, 75, 82, 78, 85, 90];
    const maxData = Math.max(...data);
    const padding = 40;
    const chartWidth = 400 - padding * 2;
    const chartHeight = 200 - padding * 2;
    
    // Create gradient
    const gradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    gradient.setAttribute("id", "chartGradient");
    gradient.setAttribute("x1", "0%");
    gradient.setAttribute("y1", "0%");
    gradient.setAttribute("x2", "0%");
    gradient.setAttribute("y2", "100%");
    
    const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop1.setAttribute("offset", "0%");
    stop1.setAttribute("stop-color", "#7886C7");
    stop1.setAttribute("stop-opacity", "0.8");
    
    const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
    stop2.setAttribute("offset", "100%");
    stop2.setAttribute("stop-color", "#7886C7");
    stop2.setAttribute("stop-opacity", "0.1");
    
    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    svg.appendChild(gradient);
    
    // Create area path
    let pathData = `M ${padding},${chartHeight + padding} `;
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - (value / maxData) * chartHeight;
        
        if (index === 0) {
            pathData += `L ${x},${y} `;
        } else {
            pathData += `L ${x},${y} `;
        }
    });
    
    pathData += `L ${padding + chartWidth},${chartHeight + padding} Z`;
    
    const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    areaPath.setAttribute("d", pathData);
    areaPath.setAttribute("fill", "url(#chartGradient)");
    areaPath.setAttribute("stroke", "#7886C7");
    areaPath.setAttribute("stroke-width", "2");
    areaPath.setAttribute("fill-opacity", "0.6");
    
    svg.appendChild(areaPath);
    
    // Add data points
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - (value / maxData) * chartHeight;
        
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", "4");
        circle.setAttribute("fill", "#2D336B");
        circle.setAttribute("stroke", "white");
        circle.setAttribute("stroke-width", "2");
        
        svg.appendChild(circle);
    });
    
    chartContainer.appendChild(svg);
}

function updatePerformanceData(timeRange) {
    // Simulate data loading
    console.log('Updating performance data for:', timeRange);
    
    // Show loading state
    const chartContainer = document.getElementById('performanceChart');
    if (chartContainer) {
        chartContainer.innerHTML = '<div class="loading">Loading data...</div>';
        
        // Simulate API call delay
        setTimeout(() => {
            loadPerformanceChart();
            showNotification(`Performance data updated for ${timeRange}`, 'success');
        }, 1000);
    }
}

function handleUrgentTask(taskName) {
    showNotification(`Taking action on: ${taskName}`, 'warning');
    
    // Simulate action
    setTimeout(() => {
        showNotification(`Action completed for: ${taskName}`, 'success');
    }, 2000);
}

function reviewTask(taskName) {
    showNotification(`Reviewing task: ${taskName}`, 'info');
    // Redirect to review page in real implementation
    // window.location.href = `task_review.html?task=${encodeURIComponent(taskName)}`;
}

function viewMemberDetails(memberName) {
    showNotification(`Viewing details for: ${memberName}`, 'info');
    // Redirect to performance page in real implementation
    // window.location.href = `worker_performance.html?member=${encodeURIComponent(memberName)}`;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'exclamation-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'warning': '#FF9800',
        'error': '#f44336',
        'info': '#2D336B'
    };
    return colors[type] || '#2D336B';
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: var(--text-light);
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Auto-refresh data every 5 minutes
setInterval(() => {
    console.log('Auto-refreshing dashboard data...');
    // In real implementation, this would fetch new data from API
}, 300000);