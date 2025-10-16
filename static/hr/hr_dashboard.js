document.addEventListener('DOMContentLoaded', function() {
    // Add click events to action cards
    document.querySelectorAll('.action-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            alert(`Navigating to ${title} section...`);
            // In real application, this would redirect to the appropriate page
        });
    });

    // Simulate loading data
    setTimeout(() => {
        console.log('Dashboard data loaded');
    }, 1000);
});