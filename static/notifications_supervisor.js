// Notifications JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeNotifications();
    setupEventListeners();
    loadNotifications();
});

let notifications = [];
let currentFilter = 'all';

function initializeNotifications() {
    console.log('Notifications initialized');
}

function setupEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterNotifications();
        });
    });

    // Mark all as read
    const markAllReadBtn = document.getElementById('markAllRead');
    markAllReadBtn.addEventListener('click', markAllAsRead);

    // Clear all notifications
    const clearAllBtn = document.getElementById('clearAll');
    clearAllBtn.addEventListener('click', clearAllNotifications);

    // Broadcast modal
    const closeBroadcast = document.getElementById('closeBroadcast');
    const broadcastModal = document.getElementById('broadcastModal');
    const broadcastForm = document.getElementById('broadcastForm');
    
    closeBroadcast.addEventListener('click', () => broadcastModal.classList.remove('active'));
    broadcastModal.addEventListener('click', (e) => {
        if (e.target === broadcastModal) {
            broadcastModal.classList.remove('active');
        }
    });
    
    broadcastForm.addEventListener('submit', handleBroadcastSubmit);
}

function loadNotifications() {
    // Simulate API call
    const sampleNotifications = [
        {
            id: 1,
            type: 'task',
            title: 'Task Completed',
            message: 'John Doe has completed "Website Redesign" task',
            priority: 'normal',
            read: false,
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            action: 'review',
            relatedId: 101
        },
        {
            id: 2,
            type: 'urgent',
            title: 'Overdue Task',
            message: '"Database Migration" is overdue and requires immediate attention',
            priority: 'urgent',
            read: false,
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            action: 'view',
            relatedId: 102
        },
        {
            id: 3,
            type: 'performance',
            title: 'Performance Alert',
            message: 'Sarah Wilson has exceeded performance targets for this quarter',
            priority: 'important',
            read: true,
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
            action: 'analyze',
            relatedId: 201
        },
        {
            id: 4,
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance this weekend from 2:00 AM to 6:00 AM',
            priority: 'normal',
            read: true,
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            action: 'dismiss',
            relatedId: null
        },
        {
            id: 5,
            type: 'task',
            title: 'Task Assignment',
            message: 'New task "Security Audit" has been assigned to you',
            priority: 'important',
            read: true,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            action: 'view',
            relatedId: 103
        },
        {
            id: 6,
            type: 'reminder',
            title: 'Team Meeting Reminder',
            message: 'Weekly team meeting starts in 30 minutes',
            priority: 'normal',
            read: true,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            action: 'dismiss',
            relatedId: null
        }
    ];

    notifications = sampleNotifications;
    renderNotifications(notifications);
    updateNotificationStats();
}

function renderNotifications(notificationsToRender) {
    const notificationsList = document.getElementById('notificationsList');
    
    if (notificationsToRender.length === 0) {
        notificationsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h3>No Notifications</h3>
                <p>You're all caught up! Check back later for new updates.</p>
            </div>
        `;
        return;
    }

    notificationsList.innerHTML = notificationsToRender.map(notification => `
        <div class="notification-item ${notification.read ? '' : 'unread'} ${notification.priority === 'urgent' ? 'urgent' : ''}" 
             data-notification-id="${notification.id}">
            <div class="notification-icon ${notification.type} ${notification.priority}">
                <i class="${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">
                    ${notification.title}
                    ${notification.priority !== 'normal' ? `
                        <span class="badge badge-${notification.priority}">${notification.priority}</span>
                    ` : ''}
                </div>
                <p class="notification-message">${notification.message}</p>
                <div class="notification-meta">
                    <span class="notification-time">
                        <i class="fas fa-clock"></i>
                        ${formatTimeAgo(notification.timestamp)}
                    </span>
                    <span class="notification-type">${notification.type}</span>
                </div>
            </div>
            <div class="notification-actions">
                ${!notification.read ? `
                <button class="btn-action btn-mark-read" onclick="markAsRead(${notification.id})">
                    <i class="fas fa-check"></i> Read
                </button>
                ` : ''}
                <button class="btn-action btn-delete" onclick="deleteNotification(${notification.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');

    // Add click handlers for notification items
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.notification-actions')) {
                const notificationId = parseInt(this.dataset.notificationId);
                handleNotificationClick(notificationId);
            }
        });
    });
}

function getNotificationIcon(type) {
    const icons = {
        'task': 'fas fa-tasks',
        'performance': 'fas fa-chart-line',
        'system': 'fas fa-cog',
        'urgent': 'fas fa-exclamation-triangle',
        'reminder': 'fas fa-clock'
    };
    return icons[type] || 'fas fa-bell';
}

function handleNotificationClick(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Mark as read if unread
    if (!notification.read) {
        markAsRead(notificationId);
    }

    // Handle action based on notification type
    switch (notification.action) {
        case 'review':
            window.location.href = `task_review.html?task=${notification.relatedId}`;
            break;
        case 'view':
            window.location.href = `task_list.html?highlight=${notification.relatedId}`;
            break;
        case 'analyze':
            window.location.href = `worker_performance.html?worker=${notification.relatedId}`;
            break;
        case 'dismiss':
            // Just dismiss (mark as read)
            break;
        default:
            console.log('Notification clicked:', notification);
    }
}

function filterNotifications() {
    let filteredNotifications = notifications;

    switch (currentFilter) {
        case 'unread':
            filteredNotifications = notifications.filter(n => !n.read);
            break;
        case 'urgent':
            filteredNotifications = notifications.filter(n => n.priority === 'urgent');
            break;
        case 'tasks':
            filteredNotifications = notifications.filter(n => n.type === 'task');
            break;
        case 'performance':
            filteredNotifications = notifications.filter(n => n.type === 'performance');
            break;
        case 'system':
            filteredNotifications = notifications.filter(n => n.type === 'system');
            break;
    }

    renderNotifications(filteredNotifications);
}

function markAsRead(notificationId) {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
        notification.read = true;
        renderNotifications(getFilteredNotifications());
        updateNotificationStats();
        showNotification('Notification marked as read', 'success');
    }
}

function markAllAsRead() {
    let hasUnread = false;
    
    notifications.forEach(notification => {
        if (!notification.read) {
            notification.read = true;
            hasUnread = true;
        }
    });

    if (hasUnread) {
        renderNotifications(getFilteredNotifications());
        updateNotificationStats();
        showNotification('All notifications marked as read', 'success');
    } else {
        showNotification('No unread notifications', 'info');
    }
}

function deleteNotification(notificationId) {
    if (confirm('Are you sure you want to delete this notification?')) {
        notifications = notifications.filter(n => n.id !== notificationId);
        renderNotifications(getFilteredNotifications());
        updateNotificationStats();
        showNotification('Notification deleted', 'success');
    }
}

function clearAllNotifications() {
    if (notifications.length === 0) {
        showNotification('No notifications to clear', 'info');
        return;
    }

    if (confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
        notifications = [];
        renderNotifications([]);
        updateNotificationStats();
        showNotification('All notifications cleared', 'success');
    }
}

function getFilteredNotifications() {
    switch (currentFilter) {
        case 'unread': return notifications.filter(n => !n.read);
        case 'urgent': return notifications.filter(n => n.priority === 'urgent');
        case 'tasks': return notifications.filter(n => n.type === 'task');
        case 'performance': return notifications.filter(n => n.type === 'performance');
        case 'system': return notifications.filter(n => n.type === 'system');
        default: return notifications;
    }
}

function updateNotificationStats() {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const urgent = notifications.filter(n => n.priority === 'urgent').length;
    const today = notifications.filter(n => {
        const notificationDate = new Date(n.timestamp);
        const today = new Date();
        return notificationDate.toDateString() === today.toDateString();
    }).length;

    document.getElementById('totalNotifications').textContent = total;
    document.getElementById('unreadNotifications').textContent = unread;
    document.getElementById('urgentNotifications').textContent = urgent;
    document.getElementById('todayNotifications').textContent = today;
}

// Quick Actions
function createBroadcast() {
    const modal = document.getElementById('broadcastModal');
    modal.classList.add('active');
}

function closeBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    modal.classList.remove('active');
    document.getElementById('broadcastForm').reset();
}

function handleBroadcastSubmit(e) {
    e.preventDefault();
    
    const message = document.getElementById('broadcastMessage').value;
    const priority = document.getElementById('broadcastPriority').value;
    
    // Simulate sending broadcast
    showNotification('Broadcast sent to team successfully!', 'success');
    closeBroadcastModal();
    
    // Add notification for the broadcast
    const newNotification = {
        id: Date.now(),
        type: 'system',
        title: 'Broadcast Sent',
        message: `Your broadcast has been sent to the team: "${message.substring(0, 50)}..."`,
        priority: 'normal',
        read: true,
        timestamp: new Date(),
        action: 'dismiss',
        relatedId: null
    };
    
    notifications.unshift(newNotification);
    renderNotifications(getFilteredNotifications());
    updateNotificationStats();
}

function scheduleReminder() {
    showNotification('Reminder scheduling feature coming soon!', 'info');
}

function openSettings() {
    showNotification('Notification settings feature coming soon!', 'info');
}

// Utility functions
function formatTimeAgo(timestamp) {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return timestamp.toLocaleDateString();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `floating-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationTypeIcon(type)}"></i>
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
        max-width: 400px;
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

function getNotificationTypeIcon(type) {
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

// Add CSS for floating notifications
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
    
    .floating-notification {
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
    }
`;
document.head.appendChild(style);

// Simulate real-time notifications
function simulateNewNotification() {
    const notificationTypes = ['task', 'performance', 'system'];
    const priorities = ['normal', 'important', 'urgent'];
    
    const newNotification = {
        id: Date.now(),
        type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
        title: 'New Update',
        message: 'This is a simulated real-time notification',
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        read: false,
        timestamp: new Date(),
        action: 'dismiss',
        relatedId: null
    };
    
    notifications.unshift(newNotification);
    renderNotifications(getFilteredNotifications());
    updateNotificationStats();
    
    // Show desktop notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Role-Craft', {
            body: newNotification.message,
            icon: '/logo.png'
        });
    }
}

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}

// Simulate notifications every 2 minutes for demo
// setInterval(simulateNewNotification, 120000);