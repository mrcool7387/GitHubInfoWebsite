// Function to create a notification
function createNotification(type, title, description) {
    const notificationContainer = document.getElementById('notification-container');

    // Define SVG icons
    const icons = {
        info: `
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#2196f3" stroke-width="2" fill="none"></circle>
                <text x="12" y="16" text-anchor="middle" font-size="12" fill="#2196f3" font-family="Arial, sans-serif">i</text>
            </svg>
        `,
        warning: `
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <polygon points="12,2 22,20 2,20" stroke="#ff9800" stroke-width="2" fill="none"></polygon>
                <text x="12" y="17" text-anchor="middle" font-size="12" fill="#ff9800" font-family="Arial, sans-serif">!</text>
            </svg>
        `,
        error: `
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#f44336" stroke-width="2" fill="none"></circle>
                <line x1="8" y1="8" x2="16" y2="16" stroke="#f44336" stroke-width="2"></line>
                <line x1="16" y1="8" x2="8" y2="16" stroke="#f44336" stroke-width="2"></line>
            </svg>
        `,
        success: `
            <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#4caf50" stroke-width="2" fill="none"></circle>
                <polyline points="6,12 10,16 18,8" stroke="#4caf50" stroke-width="2" fill="none"></polyline>
            </svg>
        `
    };

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        ${icons[type]}
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
    console.info(`${title} - ${description}`);
}

function showWarning(title, description) {
    createNotification('warning', title, description);
    console.warn(`${title} - ${description}`);
}

function showError(title, description) {
    createNotification('error', title, description);
    console.error(`${title} - ${description}`);
}

function showSuccess(title, description) {
    createNotification('success', title, description);
    console.log(`Success: ${title} - ${description}`);
}