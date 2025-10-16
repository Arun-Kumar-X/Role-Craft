document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.employee-form');
    const cancelBtn = document.querySelector('.btn-secondary');
    
    // Generate employee ID automatically
    const employeeIdInput = document.getElementById('employeeId');
    employeeIdInput.value = 'EMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    // Generate username automatically based on name
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const usernameInput = document.getElementById('username');
    
    function generateUsername() {
        if (firstNameInput.value && lastNameInput.value) {
            const first = firstNameInput.value.toLowerCase();
            const last = lastNameInput.value.toLowerCase();
            usernameInput.value = first.charAt(0) + last;
        }
    }
    
    firstNameInput.addEventListener('blur', generateUsername);
    lastNameInput.addEventListener('blur', generateUsername);
    
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
            
            alert('Employee added successfully!\n\nEmployee ID: ' + employeeData.employeeId + '\nName: ' + employeeData.firstName + ' ' + employeeData.lastName);
            
            // Reset form
            form.reset();
            employeeIdInput.value = 'EMP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
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
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        // Remove existing strength classes
        this.classList.remove('weak', 'medium', 'strong');
        
        // Add appropriate class
        if (strength > 0) {
            if (strength <= 2) {
                this.classList.add('weak');
            } else if (strength <= 4) {
                this.classList.add('medium');
            } else {
                this.classList.add('strong');
            }
        }
    });
});