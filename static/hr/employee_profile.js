document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.profile-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-profile-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById('profile-' + tabId).classList.add('active');
        });
    });

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    searchBtn.addEventListener('click', function() {
        const searchTerm = document.getElementById('employeeSearch').value.trim();
        if (searchTerm) {
            alert(`Searching for employee: ${searchTerm}\n\nIn a real application, this would load the employee profile.`);
            
            // Show profile content (simulated)
            document.querySelector('.profile-card').style.display = 'block';
            document.querySelector('.profile-tabs').style.display = 'block';
        } else {
            alert('Please enter an employee name or ID to search.');
        }
    });

    // Edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    editProfileBtn.addEventListener('click', function() {
        const employeeName = document.querySelector('.profile-info h2').textContent;
        alert(`Redirecting to edit page for ${employeeName}...`);
        // In real application: window.location.href = 'edit_employee.html?id=EMP-001';
    });

    // Export PDF button
    const exportPdfBtn = document.getElementById('exportPdfBtn');
    exportPdfBtn.addEventListener('click', function() {
        const employeeName = document.querySelector('.profile-info h2').textContent;
        alert(`Generating PDF report for ${employeeName}...`);
        // In real application, this would generate and download a PDF
    });

    // Assign task button
    const assignTaskBtn = document.getElementById('assignTaskBtn');
    assignTaskBtn.addEventListener('click', function() {
        const employeeName = document.querySelector('.profile-info h2').textContent;
        alert(`Opening task assignment form for ${employeeName}...`);
        // In real application: window.location.href = 'create_task.html?employee=EMP-001';
    });

    // Schedule assessment button
    const scheduleAssessmentBtn = document.getElementById('scheduleAssessmentBtn');
    scheduleAssessmentBtn.addEventListener('click', function() {
        const employeeName = document.querySelector('.profile-info h2').textContent;
        alert(`Scheduling assessment for ${employeeName}...`);
    });

    // Upload document button
    const uploadDocumentBtn = document.getElementById('uploadDocumentBtn');
    uploadDocumentBtn.addEventListener('click', function() {
        alert('Opening document upload dialog...');
        // In real application, this would open a file upload dialog
    });

    // Filter functionality
    const logFilter = document.getElementById('logFilter');
    const attendanceFilter = document.getElementById('attendanceFilter');
    
    logFilter.addEventListener('change', function() {
        alert(`Filtering machine logs for: ${this.value}`);
    });
    
    attendanceFilter.addEventListener('change', function() {
        alert(`Loading attendance data for: ${this.value}`);
    });

    // View details buttons
    document.querySelectorAll('.btn-small.btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const context = this.closest('.task-item, .log-item, .assessment-item');
            if (context) {
                const title = context.querySelector('.task-title, .log-machine, .assessment-period').textContent;
                alert(`Viewing details for: ${title}`);
            }
        });
    });

    // Download document buttons
    document.querySelectorAll('.document-actions .btn').forEach(button => {
        button.addEventListener('click', function() {
            const documentName = this.closest('.document-item').querySelector('.document-name').textContent;
            alert(`Downloading: ${documentName}`);
        });
    });

    // Initially hide profile content until search is performed
    document.querySelector('.profile-card').style.display = 'none';
    document.querySelector('.profile-tabs').style.display = 'none';
});