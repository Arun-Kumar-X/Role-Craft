document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const departmentFilter = document.getElementById('departmentFilter');
    const searchInput = document.getElementById('taskSearch');
    const searchBtn = document.getElementById('searchBtn');

    function applyFilters() {
        const status = statusFilter.value;
        const priority = priorityFilter.value;
        const department = departmentFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        const rows = document.querySelectorAll('tbody tr');
        let visibleCount = 0;

        rows.forEach(row => {
            const rowStatus = row.querySelector('.status-badge').textContent.toLowerCase();
            const rowPriority = row.querySelector('.priority-badge').textContent.toLowerCase();
            const rowDepartment = row.cells[3].textContent.toLowerCase();
            const rowTitle = row.querySelector('.task-title').textContent.toLowerCase();
            const rowDescription = row.querySelector('.task-description').textContent.toLowerCase();

            const statusMatch = !status || rowStatus.includes(status);
            const priorityMatch = !priority || rowPriority.includes(priority);
            const departmentMatch = !department || rowDepartment.includes(department);
            const searchMatch = !searchTerm || 
                rowTitle.includes(searchTerm) || 
                rowDescription.includes(searchTerm) ||
                row.cells[0].textContent.toLowerCase().includes(searchTerm);

            if (statusMatch && priorityMatch && departmentMatch && searchMatch) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // Update statistics based on visible rows
        updateVisibleStatistics(visibleCount);
    }

    function updateVisibleStatistics(visibleCount) {
        // In a real application, this would update the stat cards
        console.log(`Currently showing ${visibleCount} tasks`);
    }

    // Event listeners for filters
    statusFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
    departmentFilter.addEventListener('change', applyFilters);
    searchBtn.addEventListener('click', applyFilters);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            applyFilters();
        }
    });

    // Action buttons functionality
    document.querySelectorAll('.btn-icon').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.title;
            const taskId = this.closest('tr').cells[0].textContent;
            const taskTitle = this.closest('tr').querySelector('.task-title').textContent;

            switch(action) {
                case 'View Details':
                    alert(`Viewing details for task: ${taskTitle} (${taskId})`);
                    break;
                case 'Edit Task':
                    alert(`Editing task: ${taskTitle} (${taskId})`);
                    // In real application: window.location.href = `create_task.html?edit=${taskId}`;
                    break;
                case 'Delete Task':
                    if (confirm(`Are you sure you want to delete task: ${taskTitle}?`)) {
                        alert(`Task ${taskId} deleted successfully`);
                        // In real application, this would remove the task from the database
                        this.closest('tr').remove();
                    }
                    break;
            }
        });
    });

    // Pagination functionality
    document.querySelectorAll('.page-numbers span').forEach(page => {
        page.addEventListener('click', function() {
            document.querySelector('.page-active').classList.remove('page-active');
            this.classList.add('page-active');
            alert(`Loading page ${this.textContent}...`);
        });
    });

    // Create task button
    const createTaskBtn = document.querySelector('.btn-primary');
    createTaskBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Navigation is handled by the href attribute
    });

    // Initialize with all tasks visible
    applyFilters();
});