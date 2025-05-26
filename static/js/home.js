async function fetchGitHubUserInfo(token) {
    const res = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github+json"
        }
    });
    if (!res.ok) {
        showError("GitHub User", "Failed to load user info.");
        //document.getElementById("github-general-info").innerHTML = `<p style="color:#f66;">Failed to load user info.</p>`;
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
            <div><span>Public Repos</span><b>${data.public_repos}</b></div>
            <div><span>Private Repos</span><b>${data.total_private_repos}</b></div>
            <div><span>Gists</span><b>${data.public_gists}</b></div>
        </div>
    `;
    showSuccess("GitHub User", "User info loaded successfully.");
    fetchGitHubRepos(token, data.login);
    fetchAllExtraGitHubInfo(token, data.login);
}

// Generated with AI - 21.05.2025 19:34.00
async function fetchGitHubRepos(token, username) {
    const reposRes = await fetch(`https://api.github.com/search/repositories?q=user:${username}`, {
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
    const reposData = await reposRes.json();
    if (!reposData.items || !Array.isArray(reposData.items) || reposData.items.length === 0) {
        reposContainer.innerHTML = `<h2>Repositories</h2><p>No repositories found.</p>`;
        showWarning("Repositories", "No repositories found.");
        return;
    }

    // Count templates and private repos
    const templateCount = reposData.items.filter(r => r.is_template).length;
    const privateCount = reposData.items.filter(r => r.private).length;

    reposContainer.innerHTML = `<h2>Repositories</h2>
        <div style="margin-bottom:10px;">
            <b>Total:</b> ${reposData.total_count}
            <span style="margin-left:18px;"><b>Public:</b> ${reposData.total_count - privateCount}</span>
            <span style="margin-left:18px;"><b>Private:</b> ${privateCount}</span>
            <span style="margin-left:18px;"><b>Templates:</b> ${templateCount}</span>
        </div>
        <div class="github-repo-list">
            ${reposData.items.map(repo => `
                <div class="github-repo-card">
                    <div class="repo-header">
                        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                        ${repo.private ? '<span class="repo-private">Private</span>' : '<span class="repo-public">Public</span>'}
                        ${repo.is_template ? '<span class="repo-template">Template</span>' : ''}
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
                        <span>👤 Owner: <a href="${repo.owner.html_url}" target="_blank">${repo.owner.login}</a></span>
                        <span>🔑 Visibility: ${repo.visibility || (repo.private ? "private" : "public")}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    showSuccess("Repositories", `Repositories loaded successfully. (${reposData.total_count} total, ${privateCount} private, ${templateCount} templates)`);
}

// Generated with AI - 21.05.2025 20:16.00
document.addEventListener('DOMContentLoaded', () => {
    // Hide tabs/pages and center token input on load
    const tabCards = document.querySelector('.tab_cards');
    const tabPages = document.querySelector('.tab_pages');
    const tokenInput = document.getElementById("github-token");
    const loadBtn = document.getElementById("githubLoad");

    // Create a wrapper for centering
    const centerWrap = document.createElement("div");
    centerWrap.className = "center-token-input";
    tokenInput.parentNode.insertBefore(centerWrap, tokenInput);
    centerWrap.appendChild(tokenInput);
    centerWrap.appendChild(loadBtn);

    // Hide tabs/pages initially
    tabCards.style.display = "none";
    tabPages.style.display = "none";
    centerWrap.style.display = "flex";

    // Live validation for GitHub token
    function validateTokenInput() {
        const token = tokenInput.value.trim();
        // Accepts only tokens starting with 'ghp_' and 40 chars after (44 total)
        const isValid = /^ghp_[A-Za-z0-9]{40}$/.test(token);
        if (!isValid) {
            tokenInput.classList.add('invalid-input');
            loadBtn.disabled = true;
        } else {
            tokenInput.classList.remove('invalid-input');
            loadBtn.disabled = false;
        }
        return isValid;
    }
    // Initial state
    loadBtn.disabled = true;
    tokenInput.classList.remove('invalid-input');
    // Validate on input
    tokenInput.addEventListener('input', validateTokenInput);

    loadBtn.addEventListener("click", async () => {
        if (!validateTokenInput()) {
            showError("GitHub Token", "Please enter a valid GitHub token");
            return;
        }
        const token = tokenInput.value.trim();
        // Show loading animation
        centerWrap.style.display = "none";
        let loadingDiv = document.createElement("div");
        loadingDiv.className = "center-token-loading";
        loadingDiv.innerHTML = `
            <div class="loader"></div>
            <span>Loading GitHub Info...</span>
        `;
        centerWrap.parentNode.insertBefore(loadingDiv, centerWrap);

        // Check token validity with GitHub API
        let valid = false;
        let userLogin = null;
        let errorMsg = "";
        try {
            const res = await fetch("https://api.github.com/user", {
                headers: {
                    "Authorization": `token ${token}`,
                    "Accept": "application/vnd.github+json"
                }
            });
            if (res.status === 200) {
                const user = await res.json();
                valid = true;
                userLogin = user.login;
            } else if (res.status === 401) {
                errorMsg = "Invalid or expired Token";
            } else if (res.status === 403) {
                errorMsg = "Access forbidden. Token may not have sufficient permissions or is restricted.";
            } else {
                errorMsg = `Unkown Error: ${res.status} ${getStatusMeaning(res.status)}`;
            }
        } catch (e) {
            errorMsg = `Network Error: ${e.message}`;
        }

        if (valid) {
            // Wait 3 more seconds, then proceed as before
            setTimeout(() => {
                loadingDiv.remove();
                tabCards.style.display = "";
                tabPages.style.display = "";
                fetchGitHubUserInfo(token);
            }, 3000);
        } else {
            // Go back to login, show error, allow retry
            loadingDiv.remove();
            centerWrap.style.display = "flex";
            showError("GitHub Token", errorMsg || "Unbekannter Fehler");
            tokenInput.focus();
        }
    });

    // Tab logic (unchanged)
    const tabButtons = document.querySelectorAll('.tab_cards div');
    const tabPagesEls = document.querySelectorAll('.tabPage');
    function activateTab(tabName) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPagesEls.forEach(page => page.classList.remove('active'));
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
});

async function fetchGitHubPulls(token, username) {
    const pullsRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:pr`, {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github+json"
        }
    });
    const issuesRes = await fetch(`https://api.github.com/search/issues?q=author:${username}+type:issue`, {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github+json"
        }
    });
    const pullsData = await pullsRes.json();
    const issuesData = await issuesRes.json();
    document.getElementById("github-pulls-info").innerHTML = `
        <h2>Pull Requests & Issues</h2>
        <div><b>Pull Requests:</b> ${pullsData.total_count}</div>
        <div><b>Issues:</b> ${issuesData.total_count}</div>
    `;
}

// Helper to get all repos for the user (returns array)
async function getAllRepos(token, username) {
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github+json"
        }
    });
    if (!reposRes.ok) return [];
    return await reposRes.json();
}

// Webhooks & Deployments: fetch for every repo and display like in the repo tab
async function fetchGitHubWebhooks(token, username) {
    const container = document.getElementById("github-webhooks-info");
    container.innerHTML = `<h2>Webhooks & Deployments</h2><div>Loading...</div>`;
    const repos = await getAllRepos(token, username);
    if (!repos.length) {
        container.innerHTML = `<h2>Webhooks & Deployments</h2><p>No repositories found or failed to load.</p>`;
        return;
    }
    let html = `<h2>Webhooks & Deployments</h2><div class="github-repo-list">`;
    for (const repo of repos) {
        // Fetch webhooks for each repo
        const hooksRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/hooks`, {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github+json"
            }
        });
        let hooks = [];
        if (hooksRes.ok) hooks = await hooksRes.json();
        html += `
            <div class="github-repo-card">
                <div class="repo-header">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                </div>
                <div class="repo-meta">
                    <span>🔗 Webhooks: ${hooks.length}</span>
                </div>
                ${hooks.length > 0 ? `<ul style="margin-top:8px;">${hooks.map(h => `<li>${h.name} → <code>${h.config.url}</code></li>`).join('')}</ul>` : "<div style='color:#b0b6be;'>No webhooks</div>"}
            </div>
        `;
    }
    html += `</div>`;
    container.innerHTML = html;
}

// GitHub Actions: fetch for every repo and display like in the repo tab
async function fetchGitHubActions(token, username) {
    const container = document.getElementById("github-actions-info");
    container.innerHTML = `<h2>GitHub Actions</h2><div>Loading...</div>`;
    const repos = await getAllRepos(token, username);
    if (!repos.length) {
        container.innerHTML = `<h2>GitHub Actions</h2><p>No repositories found or failed to load.</p>`;
        return;
    }
    let html = `<h2>GitHub Actions</h2><div class="github-repo-list">`;
    for (const repo of repos) {
        // Fetch workflows for each repo
        const actionsRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/actions/workflows`, {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github+json"
            }
        });
        let workflows = [];
        if (actionsRes.ok) {
            const data = await actionsRes.json();
            workflows = data.workflows || [];
        }
        html += `
            <div class="github-repo-card">
                <div class="repo-header">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                </div>
                <div class="repo-meta">
                    <span>⚙️ Actions: ${workflows.length}</span>
                </div>
                ${workflows.length > 0 ? `<ul style="margin-top:8px;">${workflows.map(w => `<li>${w.name} (${w.state})</li>`).join('')}</ul>` : "<div style='color:#b0b6be;'>No Actions</div>"}
            </div>
        `;
    }
    html += `</div>`;
    container.innerHTML = html;
}

// Admin info is only available for org admins, so just show a note
async function fetchGitHubAdmin(token, username) {
    document.getElementById("github-admin-info").innerHTML = `
        <h2>Admin-Zugriffe</h2>
        <div>Admin access and organization management features are only available for organization admins.</div>
    `;
}

// Call these after user info is loaded:
async function fetchAllExtraGitHubInfo(token, username) {
    fetchGitHubPulls(token, username);
    fetchGitHubWebhooks(token, username);
    // fetchGitHubKeys(token);
    fetchGitHubActions(token, username);
    // fetchGitHubStats(token, username);
    fetchGitHubAdmin(token, username);
}





