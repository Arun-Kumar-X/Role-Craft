document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-group .btn');
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`Searching for: ${searchTerm}`);
        }
    });

    // Filter functionality
    const departmentFilter = document.querySelector('.filter-select');
    const statusFilter = document.querySelectorAll('.filter-select')[1];
    
    departmentFilter.addEventListener('change', function() {
        applyFilters();
    });
    
    statusFilter.addEventListener('change', function() {
        applyFilters();
    });

    function applyFilters() {
        const department = departmentFilter.value;
        const status = statusFilter.value;
        alert(`Applying filters - Department: ${department}, Status: ${status}`);
    }

    // Action buttons
    document.querySelectorAll('.btn-icon').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.title;
            const employeeName = this.closest('tr').querySelector('.employee-name').textContent;
            alert(`${action} for ${employeeName}`);
        });
    });

    // Add employee button
    const addEmployeeBtn = document.querySelector('.btn-primary');
    addEmployeeBtn.addEventListener('click', function() {
        window.location.href = 'add_employee.html';
    });
});