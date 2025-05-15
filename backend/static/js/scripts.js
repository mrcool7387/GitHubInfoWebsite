// Function to create a notification
function createNotification(type, title, description) {
    const notificationContainer = document.getElementById('notification-container');

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="icon"></div>
        <div class="content">
            <strong>${title}</strong>
            <p>${description}</p>
        </div>
    `;

    // Append notification to the container
    notificationContainer.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Helper functions for different types of notifications
function showInfo(title, description) {
    createNotification('info', title, description);
}

function showWarning(title, description) {
    createNotification('warning', title, description);
}

function showError(title, description) {
    createNotification('error', title, description);
}