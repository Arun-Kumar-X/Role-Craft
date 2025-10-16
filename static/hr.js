// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            document.querySelectorAll('.menu-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Hide all content tabs
            document.querySelectorAll('.content-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show the selected content tab
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Profile tab switching
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tab buttons
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked tab button
            this.classList.add('active');
            
            // Hide all profile tab content
            document.querySelectorAll('.profile-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected profile tab content
            const tabId = this.getAttribute('data-profile-tab');
            document.getElementById('profile-' + tabId).classList.add('active');
        });
    });

    // Simulate loading data
    setTimeout(() => {
        // This is where you would typically fetch data from an API
        console.log('Dashboard data loaded');
    }, 500);
    
    // Add some sample animations for KPI cards
    document.querySelectorAll('.kpi-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});