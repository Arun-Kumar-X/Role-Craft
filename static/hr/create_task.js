document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taskForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const addAssigneeBtn = document.getElementById('addAssigneeBtn');
    const assigneeTags = document.getElementById('assigneeTags');
    const fileUpload = document.getElementById('fileUpload');
    const fileList = document.getElementById('fileList');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const reminderEnabled = document.getElementById('reminderEnabled');
    const reminderSettings = document.getElementById('reminderSettings');
    const descriptionTextarea = document.getElementById('taskDescription');
    const descriptionCount = document.getElementById('descriptionCount');

    // Set default dates
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    document.getElementById('startDate').valueAsDate = today;
    document.getElementById('dueDate').valueAsDate = nextWeek;

    // Description character counter
    descriptionTextarea.addEventListener('input', function() {
        const count = this.value.length;
        descriptionCount.textContent = count;
        
        if (count > 500) {
            descriptionCount.style.color = 'var(--danger)';
        } else if (count > 400) {
            descriptionCount.style.color = 'var(--warning)';
        } else {
            descriptionCount.style.color = '#777';
        }
    });

    // Add assignee functionality
    addAssigneeBtn.addEventListener('click', function() {
        const assigneeSelect = document.getElementById('assignTo');
        const selectedOption = assigneeSelect.options[assigneeSelect.selectedIndex];
        
        if (selectedOption.value && !isAssigneeAdded(selectedOption.value)) {
            addAssigneeTag(selectedOption.value, selectedOption.text);
        }
    });

    function isAssigneeAdded(employeeId) {
        const existingTags = assigneeTags.querySelectorAll('.assignee-tag');
        return Array.from(existingTags).some(tag => 
            tag.getAttribute('data-employee-id') === employeeId
        );
    }

    function addAssigneeTag(employeeId, employeeName) {
        const tag = document.createElement('div');
        tag.className = 'assignee-tag';
        tag.setAttribute('data-employee-id', employeeId);
        tag.innerHTML = `
            ${employeeName}
            <button type="button" class="remove-tag" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        assigneeTags.appendChild(tag);
    }

    // File upload functionality
    fileUpload.addEventListener('change', handleFileUpload);
    
    fileUploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = 'var(--accent)';
        this.style.backgroundColor = 'var(--secondary)';
    });

    fileUploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'white';
    });

    fileUploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#ddd';
        this.style.backgroundColor = 'white';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    function handleFileUpload(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                alert(`File ${file.name} is too large. Maximum size is 10MB.`);
                return;
            }

            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas fa-file file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="file-remove" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            fileList.appendChild(fileItem);
        });
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Reminder settings toggle
    reminderEnabled.addEventListener('change', function() {
        reminderSettings.style.display = this.checked ? 'flex' : 'none';
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const formData = collectFormData();
            alert('Task created successfully!\n\nTask: ' + formData.taskTitle + 
                  '\nAssigned to: ' + formData.assignTo + 
                  '\nDue: ' + formData.dueDate);
            
            // In real application, this would submit to the server
            form.reset();
            assigneeTags.innerHTML = '';
            fileList.innerHTML = '';
            descriptionCount.textContent = '0';
        }
    });

    function validateForm() {
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

        // Validate due date is after start date
        const startDate = new Date(document.getElementById('startDate').value);
        const dueDate = new Date(document.getElementById('dueDate').value);
        
        if (dueDate <= startDate) {
            alert('Due date must be after start date.');
            isValid = false;
        }

        return isValid;
    }

    function collectFormData() {
        const assignees = Array.from(assigneeTags.querySelectorAll('.assignee-tag')).map(tag => 
            tag.getAttribute('data-employee-id')
        );
        
        return {
            taskTitle: document.getElementById('taskTitle').value,
            taskDescription: document.getElementById('taskDescription').value,
            assignTo: document.getElementById('assignTo').value,
            additionalAssignees: assignees,
            startDate: document.getElementById('startDate').value,
            dueDate: document.getElementById('dueDate').value,
            taskPriority: document.getElementById('taskPriority').value,
            sendNotification: document.getElementById('sendNotification').checked
        };
    }

    // Cancel button
    cancelBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
            window.location.href = 'task_list_admin.html';
        }
    });

    // Save draft button
    saveDraftBtn.addEventListener('click', function() {
        alert('Task saved as draft successfully!');
        // In real application, this would save to local storage or send to server
    });

    // Template buttons
    document.querySelectorAll('.template-card .btn').forEach(button => {
        button.addEventListener('click', function() {
            const template = this.closest('.template-card').getAttribute('data-template');
            loadTemplate(template);
        });
    });

    function loadTemplate(template) {
        const templates = {
            onboarding: {
                title: 'Employee Onboarding - New Hire',
                description: 'Complete onboarding process for new employee including paperwork, system access setup, and initial training.',
                category: 'administrative',
                priority: 'high'
            },
            training: {
                title: 'Training Session Preparation',
                description: 'Prepare and schedule training session including materials, venue booking, and participant notifications.',
                category: 'training',
                priority: 'medium'
            },
            report: {
                title: 'Monthly Department Report',
                description: 'Compile and analyze monthly performance data, generate reports, and prepare presentation for management review.',
                category: 'reporting',
                priority: 'medium'
            }
        };

        const templateData = templates[template];
        if (templateData) {
            document.getElementById('taskTitle').value = templateData.title;
            document.getElementById('taskDescription').value = templateData.description;
            document.getElementById('taskCategory').value = templateData.category;
            document.getElementById('taskPriority').value = templateData.priority;
            
            alert(`"${templateData.title}" template loaded! Please review and customize the details.`);
        }
    }
});