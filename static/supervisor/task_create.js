// Task Assign JavaScript

const form = document.getElementById("taskAssignForm");
const tagsInput = document.getElementById("taskTags");
const tagsHidden = document.getElementById("tagsHidden");
const tagsContainer = document.getElementById("tagsContainer");

let tags = [];

tagsInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        const tag = tagsInput.value.trim();
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tag;
            tagsContainer.appendChild(span);
            tagsInput.value = "";
        }
    }
});

form.addEventListener("submit", function() {
    tagsHidden.value = tags.join(",");
});

document.addEventListener('DOMContentLoaded', function() {
    initializeTaskAssign();
    setupEventListeners();
    setDefaultDates();
});

let selectedTags = [];
let selectedFiles = [];

function initializeTaskAssign() {
    console.log('Task Assign initialized');
}

function setupEventListeners() {
    const form = document.getElementById('taskAssignForm');
    form.addEventListener('submit', handleFormSubmit);

    // Save draft
    const saveDraftBtn = document.getElementById('saveDraft');
    saveDraftBtn.addEventListener('click', saveAsDraft);

    // Preview
    const previewBtn = document.getElementById('previewTask');
    previewBtn.addEventListener('click', showPreview);

    // Reset form
    const resetBtn = document.getElementById('resetForm');
    resetBtn.addEventListener('click', resetForm);

    // Tags input
    const tagsInput = document.getElementById('taskTags');
    tagsInput.addEventListener('keydown', handleTagInput);

    // File upload
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('taskAttachments');
    uploadBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);

    // Assignee change
    const assigneeSelect = document.getElementById('taskAssignee');
    assigneeSelect.addEventListener('change', updateAssigneePreview);

    // Due date validation
    const startDateInput = document.getElementById('taskStartDate');
    const dueDateInput = document.getElementById('taskDueDate');
    startDateInput.addEventListener('change', validateDates);
    dueDateInput.addEventListener('change', validateDates);

    // Modal
    const closePreview = document.getElementById('closePreview');
    const previewModal = document.getElementById('previewModal');
    
    closePreview.addEventListener('click', () => previewModal.classList.remove('active'));
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
        }
    });
}

function setDefaultDates() {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    document.getElementById('taskStartDate').valueAsDate = today;
    document.getElementById('taskDueDate').valueAsDate = nextWeek;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    const formData = getFormData();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Assigning...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // In real implementation, send to backend
        console.log('Assigning task:', formData);
        
        showNotification('Task assigned successfully!', 'success');
        resetForm();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Redirect to task list
        setTimeout(() => {
            window.location.href = 'task_list.html';
        }, 1500);
        
    }, 2000);
}

function validateForm() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const assignee = document.getElementById('taskAssignee').value;
    const startDate = document.getElementById('taskStartDate').value;
    const dueDate = document.getElementById('taskDueDate').value;
    
    if (!title) {
        showNotification('Please enter a task title', 'error');
        return false;
    }
    
    if (!description) {
        showNotification('Please enter a task description', 'error');
        return false;
    }
    
    if (!assignee) {
        showNotification('Please select an assignee', 'error');
        return false;
    }
    
    if (!startDate || !dueDate) {
        showNotification('Please select both start and due dates', 'error');
        return false;
    }
    
    if (!validateDates()) {
        return false;
    }
    
    return true;
}

function validateDates() {
    const startDate = new Date(document.getElementById('taskStartDate').value);
    const dueDate = new Date(document.getElementById('taskDueDate').value);
    
    if (dueDate < startDate) {
        showNotification('Due date cannot be before start date', 'error');
        document.getElementById('taskDueDate').style.borderColor = 'var(--danger)';
        return false;
    }
    
    document.getElementById('taskDueDate').style.borderColor = 'var(--border)';
    return true;
}

function getFormData() {
    return {
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        category: document.getElementById('taskCategory').value,
        priority: document.getElementById('taskPriority').value,
        assignee: document.getElementById('taskAssignee').value,
        startDate: document.getElementById('taskStartDate').value,
        dueDate: document.getElementById('taskDueDate').value,
        estimatedHours: document.getElementById('taskEstimatedHours').value || null,
        tags: selectedTags,
        attachments: selectedFiles.map(f => f.name)
    };
}

function saveAsDraft() {
    const formData = getFormData();
    formData.status = 'draft';
    
    // In real implementation, save to localStorage or send to backend
    localStorage.setItem('taskDraft', JSON.stringify(formData));
    showNotification('Task saved as draft', 'success');
}

function showPreview() {
    if (!validateForm()) {
        return;
    }
    
    const formData = getFormData();
    const previewContent = document.getElementById('previewContent');
    const modal = document.getElementById('previewModal');
    
    const assigneeName = document.getElementById('taskAssignee').options[document.getElementById('taskAssignee').selectedIndex].text;
    
    previewContent.innerHTML = `
        <div class="preview-section">
            <h4>Task Information</h4>
            <div class="preview-item">
                <span class="preview-label">Title:</span>
                <span class="preview-value">${formData.title}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Description:</span>
                <span class="preview-value">${formData.description}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Category:</span>
                <span class="preview-value">${formData.category}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Priority:</span>
                <span class="preview-value task-priority priority-${formData.priority}">${formData.priority}</span>
            </div>
        </div>
        
        <div class="preview-section">
            <h4>Assignment Details</h4>
            <div class="preview-item">
                <span class="preview-label">Assignee:</span>
                <span class="preview-value">${assigneeName}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Start Date:</span>
                <span class="preview-value">${formatDate(formData.startDate)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Due Date:</span>
                <span class="preview-value">${formatDate(formData.dueDate)}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Estimated Hours:</span>
                <span class="preview-value">${formData.estimatedHours || 'Not specified'}</span>
            </div>
        </div>
        
        <div class="preview-section">
            <h4>Additional Information</h4>
            <div class="preview-item">
                <span class="preview-label">Tags:</span>
                <span class="preview-value">${selectedTags.length > 0 ? selectedTags.join(', ') : 'None'}</span>
            </div>
            <div class="preview-item">
                <span class="preview-label">Attachments:</span>
                <span class="preview-value">${selectedFiles.length > 0 ? selectedFiles.map(f => f.name).join(', ') : 'None'}</span>
            </div>
        </div>
        
        <div class="form-actions" style="margin-top: 30px;">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('previewModal').classList.remove('active')">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button type="button" class="btn btn-primary" onclick="document.getElementById('taskAssignForm').requestSubmit()">
                <i class="fas fa-paper-plane"></i> Confirm & Assign
            </button>
        </div>
    `;
    
    modal.classList.add('active');
}

function resetForm() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
        document.getElementById('taskAssignForm').reset();
        selectedTags = [];
        selectedFiles = [];
        updateTagsDisplay();
        updateFileDisplay();
        setDefaultDates();
        updateAssigneePreview();
        showNotification('Form reset successfully', 'info');
    }
}

function handleTagInput(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const tag = e.target.value.trim();
        if (tag && !selectedTags.includes(tag)) {
            selectedTags.push(tag);
            updateTagsDisplay();
            e.target.value = '';
        }
    }
}

function updateTagsDisplay() {
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = '';
    
    selectedTags.forEach((tag, index) => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <button type="button" class="tag-remove" onclick="removeTag(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        tagsContainer.appendChild(tagElement);
    });
}

function removeTag(index) {
    selectedTags.splice(index, 1);
    updateTagsDisplay();
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    selectedFiles = [...selectedFiles, ...files];
    updateFileDisplay();
}

function updateFileDisplay() {
    const fileInfo = document.getElementById('fileInfo');
    const attachmentsList = document.getElementById('attachmentsList');
    
    fileInfo.textContent = `${selectedFiles.length} file(s) selected`;
    attachmentsList.innerHTML = '';
    
    selectedFiles.forEach((file, index) => {
        const attachmentItem = document.createElement('div');
        attachmentItem.className = 'attachment-item';
        attachmentItem.innerHTML = `
            <i class="fas fa-file attachment-icon"></i>
            <span class="attachment-name">${file.name}</span>
            <button type="button" class="attachment-remove" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        attachmentsList.appendChild(attachmentItem);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileDisplay();
}

function updateAssigneePreview() {
    const assigneeSelect = document.getElementById('taskAssignee');
    const assigneePreview = document.getElementById('assigneePreview');
    const selectedValue = assigneeSelect.value;
    
    if (selectedValue) {
        // Simulate workload data
        const workloads = {
            'john': { level: 'high', tasks: 8 },
            'sarah': { level: 'medium', tasks: 5 },
            'mike': { level: 'low', tasks: 2 },
            'emma': { level: 'medium', tasks: 6 },
            'david': { level: 'low', tasks: 3 }
        };
        
        const workload = workloads[selectedValue] || { level: 'low', tasks: 0 };
        const selectedText = assigneeSelect.options[assigneeSelect.selectedIndex].text;
        
        assigneePreview.innerHTML = `
            <i class="fas fa-user-check"></i>
            <div>
                <strong>${selectedText}</strong>
                <div style="font-size: 12px; color: var(--text-light); margin-top: 2px;">
                    Currently has ${workload.tasks} active tasks
                </div>
            </div>
            <div class="workload-indicator">
                <span>Workload:</span>
                <div class="workload-bar">
                    <div class="workload-fill workload-${workload.level}"></div>
                </div>
                <span style="text-transform: capitalize;">${workload.level}</span>
            </div>
        `;
        assigneePreview.className = 'assignee-preview has-data';
    } else {
        assigneePreview.innerHTML = `
            <i class="fas fa-user"></i>
            <span>Select a team member to see their workload</span>
        `;
        assigneePreview.className = 'assignee-preview';
    }
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Implementation same as previous files
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Load draft if exists
window.addEventListener('load', function() {
    const draft = localStorage.getItem('taskDraft');
    if (draft) {
        if (confirm('You have a saved draft. Would you like to load it?')) {
            // In real implementation, load the draft data into form
            console.log('Loading draft:', JSON.parse(draft));
            localStorage.removeItem('taskDraft');
        }
    }
});