document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form-container');
    const searchBtn = document.getElementById('searchBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const archiveBtn = document.getElementById('archiveBtn');

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const searchTerm = document.getElementById('employeeSearch').value.trim();
        if (searchTerm) {
            // Simulate search results
            alert(`Searching for employee: ${searchTerm}\n\nIn a real application, this would fetch employee data from the server.`);
            
            // Show the employee info card and form (simulated)
            document.querySelector('.employee-info-card').style.display = 'block';
            document.querySelector('.alert-success').style.display = 'flex';
            document.querySelector('.tab-header').style.display = 'block';
            document.querySelector('.form-container').style.display = 'block';
        } else {
            alert('Please enter an employee name or ID to search.');
        }
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--danger)';
            } else {
                field.style.borderColor = '#ddd';
            }
        });
        
        if (isValid) {
            // Simulate form submission
            const formData = new FormData(form);
            const employeeData = {};
            formData.forEach((value, key) => {
                employeeData[key] = value;
            });
            
            alert('Employee details updated successfully!\n\nEmployee: ' + employeeData.editName + '\nDepartment: ' + employeeData.editDepartment);
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Cancel button
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            window.location.href = 'employee_list.html';
        }
    });

    // Password reset functionality
    resetPasswordBtn.addEventListener('click', function() {
        const newPassword = document.getElementById('resetPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (newPassword && confirmPassword) {
            if (newPassword === confirmPassword) {
                if (confirm('Are you sure you want to reset this employee\'s password?')) {
                    alert('Password reset successfully! The employee will be required to set a new password upon next login.');
                    // Clear password fields
                    document.getElementById('resetPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                }
            } else {
                alert('Passwords do not match. Please try again.');
            }
        } else {
            alert('Please enter and confirm the new temporary password.');
        }
    });

    // Archive employee functionality
    archiveBtn.addEventListener('click', function() {
        const employeeName = document.getElementById('editName').value;
        if (confirm(`Are you sure you want to archive ${employeeName}? This action cannot be undone and will remove the employee from active lists.`)) {
            alert(`${employeeName} has been archived successfully.`);
            // In real application, this would update the employee status in the database
        }
    });

    // Initially hide the form until an employee is searched
    document.querySelector('.employee-info-card').style.display = 'none';
    document.querySelector('.alert-success').style.display = 'none';
    document.querySelector('.tab-header').style.display = 'none';
    document.querySelector('.form-container').style.display = 'none';
});