async function fetchGitHubUserInfo(token) {
    const res = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github+json"
        }
    });
    if (!res.ok) {
        //document.getElementById("github-general-info").innerHTML = `<p style="color:#f66;">Failed to load user info.</p>`;
        showError("GitHub User", "Failed to load user info.");
        return;
    }
    const data = await res.json();
    document.getElementById("github-general-info").innerHTML = `
        <div class="github-user-header">
            <img src="${data.avatar_url}" alt="Avatar" class="github-avatar">
            <div>
                <h3>${data.name || data.login}</h3>
                <a href="${data.html_url}" target="_blank">@${data.login}</a>
                <p>${data.bio || ""}</p>
            </div>
        </div>
        <div class="github-user-details">
            <table>
                <tbody>
                    <tr><td><b>User ID</b></td><td>${data.id}</td></tr>
                    <tr><td><b>Type</b></td><td>${data.type}</td></tr>
                    <tr><td><b>Company</b></td><td>${data.company || "-"}</td></tr>
                    <tr><td><b>Location</b></td><td>${data.location || "-"}</td></tr>
                    <tr><td><b>Email</b></td><td>${data.email ? `<a href="mailto:${data.email}">${data.email}</a>` : "-"}</td></tr>
                    <tr><td><b>Blog</b></td><td>${data.blog ? `<a href="${data.blog}" target="_blank">${data.blog}</a>` : "-"}</td></tr>
                    <tr><td><b>Twitter</b></td><td>${data.twitter_username ? `<a href="https://twitter.com/${data.twitter_username}" target="_blank">@${data.twitter_username}</a>` : "-"}</td></tr>
                    <tr><td><b>Created</b></td><td>${new Date(data.created_at).toLocaleString()}</td></tr>
                    <tr><td><b>Last Update</b></td><td>${new Date(data.updated_at).toLocaleString()}</td></tr>
                </tbody>
            </table>
        </div>
        <div class="github-user-stats">
            <div><span>Followers</span><b>${data.followers}</b></div>
            <div><span>Following</span><b>${data.following}</b></div>
            <div><span>Repos</span><b>${data.public_repos}</b></div>
            <div><span>Gists</span><b>${data.public_gists}</b></div>
        </div>
    `;
    showSuccess("GitHub User", "User info loaded successfully.");
    fetchGitHubRepos(token, data.login);
}

async function fetchGitHubRepos(token, username) {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github+json"
        }
    });
    const reposContainer = document.querySelector('.tabPage.repos');
    if (!reposRes.ok) {
        reposContainer.innerHTML = `<h2>Repositories</h2><p style="color:#f66;">Failed to load repositories.</p>`;
        showError("Repositories", "Failed to load repositories.");
        return;
    }
    const repos = await reposRes.json();
    if (!Array.isArray(repos) || repos.length === 0) {
        reposContainer.innerHTML = `<h2>Repositories</h2><p>No repositories found.</p>`;
        showWarning("Repositories", "No repositories found.");
        return;
    }
    reposContainer.innerHTML = `<h2>Repositories</h2>
        <div class="github-repo-list">
            ${repos.map(repo => `
                <div class="github-repo-card">
                    <div class="repo-header">
                        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                        ${repo.private ? '<span class="repo-private">Private</span>' : '<span class="repo-public">Public</span>'}
                    </div>
                    <div class="repo-desc">${repo.description ? repo.description : "<i>No description</i>"}</div>
                    <div class="repo-meta">
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🍴 ${repo.forks_count}</span>
                        <span>👁️ ${repo.watchers_count}</span>
                        <span>📝 ${repo.language || "n/a"}</span>
                        <span>📅 Created: ${new Date(repo.created_at).toLocaleDateString()}</span>
                        <span>🔄 Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                        <span>⬇️ <a href="${repo.clone_url}" target="_blank">Clone</a></span>
                        ${repo.homepage ? `<span>🌐 <a href="${repo.homepage}" target="_blank">Homepage</a></span>` : ""}
                        ${repo.license && repo.license.name ? `<span>🪪 ${repo.license.name}</span>` : ""}
                        ${repo.archived ? `<span class="repo-archived">Archived</span>` : ""}
                        ${repo.disabled ? `<span class="repo-disabled">Disabled</span>` : ""}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    showSuccess("Repositories", "Repositories loaded successfully.");
}

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab_cards div');
    const tabPages = document.querySelectorAll('.tabPage');

    function activateTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPages.forEach(page => page.classList.remove('active'));

        const activeBtn = document.querySelector(`.tab_cards div[pointsTo="${tabName}"]`);
        const activePage = document.querySelector(`.tabPage.${tabName}`);

        if (activeBtn && activePage) {
            activeBtn.classList.add('active');
            activePage.classList.add('active');
        }
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('pointsTo');
            activateTab(target);
        });
    });

    if (tabButtons.length > 0) {
        const firstTab = tabButtons[0].getAttribute('pointsTo');
        activateTab(firstTab);
    }

    document.getElementById("githubLoad").addEventListener("click", () => {
        const tokenInput = document.getElementById("github-token");
        const loadBtn = document.getElementById("githubLoad");
        const token = tokenInput.value.trim();
        if (!token) {
            showError("GitHub Token", "Please enter a valid GitHub token.");
            return;
        }
        fetchGitHubUserInfo(token);
        // Hide input and button after loading
        tokenInput.style.display = "none";
        loadBtn.style.display = "none";
    });
});





