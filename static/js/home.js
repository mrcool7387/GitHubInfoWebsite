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
        // Accepts only tokens starting with 'ghp_' and 36 chars after (40 total)
        const isValid = /^ghp_[A-Za-z0-9]{36}$/.test(token);
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

    // Show first 10 PRs and issues as cards
    let pullsList = "";
    if (pullsData.items && pullsData.items.length > 0) {
        pullsList = `
            <h3>Last 10 Pull Requests</h3>
            <div class="github-repo-list">
                ${pullsData.items.slice(0, 10).map(pr => `
                    <div class="github-repo-card">
                        <div class="repo-header">
                            <a href="${pr.html_url}" target="_blank" class="repo-name">${pr.title}</a>
                            <span class="repo-state" style="margin-left:10px;">[${pr.state}]</span>
                        </div>
                        <div class="repo-meta">
                            <span>📦 <b>${pr.repository_url.split('/').slice(-1)[0]}</b></span>
                            <span>👤 ${pr.user && pr.user.login ? pr.user.login : username}</span>
                            <span>📅 Created: ${new Date(pr.created_at).toLocaleDateString()}</span>
                            <span>💬 Comments: ${pr.comments}</span>
                            <span>🔗 <a href="${pr.html_url}" target="_blank">View PR</a></span>
                        </div>
                        <div class="repo-desc">${pr.body ? pr.body.substring(0, 120).replace(/\n/g, " ") + (pr.body.length > 120 ? "..." : "") : "<i>No description</i>"}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    let issuesList = "";
    if (issuesData.items && issuesData.items.length > 0) {
        issuesList = `
            <h3>Last 10 Issues</h3>
            <div class="github-repo-list">
                ${issuesData.items.slice(0, 10).map(issue => `
                    <div class="github-repo-card">
                        <div class="repo-header">
                            <a href="${issue.html_url}" target="_blank" class="repo-name">${issue.title}</a>
                            <span class="repo-state" style="margin-left:10px;">[${issue.state}]</span>
                        </div>
                        <div class="repo-meta">
                            <span>📦 <b>${issue.repository_url.split('/').slice(-1)[0]}</b></span>
                            <span>👤 ${issue.user && issue.user.login ? issue.user.login : username}</span>
                            <span>📅 Created: ${new Date(issue.created_at).toLocaleDateString()}</span>
                            <span>💬 Comments: ${issue.comments}</span>
                            <span>🔗 <a href="${issue.html_url}" target="_blank">View Issue</a></span>
                        </div>
                        <div class="repo-desc">${issue.body ? issue.body.substring(0, 120).replace(/\n/g, " ") + (issue.body.length > 120 ? "..." : "") : "<i>No description</i>"}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById("github-pulls-info").innerHTML = `
        <h2>Pull Requests & Issues</h2>
        <div><b>Pull Requests:</b> ${pullsData.total_count}</div>
        <div><b>Issues:</b> ${issuesData.total_count}</div>
        ${pullsList}
        ${issuesList}
        <!-- Generated with AI - 26.05.2025 21:09.00 -->
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
                ${
                    hooks.length > 0
                    ? `<ul style="margin-top:8px;">
                        ${hooks.map(h => `
                            <li>
                                <b>Name:</b> ${h.name} <br>
                                <b>URL:</b> <code>${h.config.url}</code><br>
                                <b>Active:</b> ${h.active ? "Yes" : "No"}<br>
                                <b>Events:</b> ${h.events.join(", ")}<br>
                                <b>Last Response:</b> ${h.last_response && h.last_response.status ? h.last_response.status : "n/a"}
                            </li>
                        `).join('')}
                    </ul>`
                    : "<div style='color:#b0b6be;'>No webhooks</div>"
                }
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

// Add this function for the "keys" section
// Generated with AI - 26.05.2025 21:54.00
async function fetchGitHubKeys(token) {
    const container = document.getElementById("github-keys-info");
    container.innerHTML = `<h2>SSH Keys, Tokens & App Access</h2><div>Loading...</div>`;

    // Fetch SSH keys
    let sshKeys = [];
    try {
        const sshRes = await fetch("https://api.github.com/user/keys", {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github+json"
            }
        });
        if (sshRes.ok) {
            sshKeys = await sshRes.json();
        }
    } catch (e) {
        // ignore
    }

    // Fetch authorized OAuth apps (tokens)
    let appTokens = [];
    try {
        const appRes = await fetch("https://api.github.com/applications", {
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/vnd.github+json"
            }
        });
        if (appRes.ok) {
            appTokens = await appRes.json();
        }
    } catch (e) {
        // ignore
    }

    let html = `<h2>SSH Keys, Tokens & App Access</h2>`;

    // SSH Keys as cards
    html += `<div style="margin-bottom:10px;"><b>SSH Keys:</b> ${sshKeys.length}</div>`;
    if (sshKeys.length > 0) {
        html += `<div class="github-repo-list">`;
        html += sshKeys.map(k => `
            <div class="github-repo-card">
                <div class="repo-header">
                    <span class="repo-name">${k.title}</span>
                    <span style="margin-left:10px;">[ID: ${k.id}]</span>
                </div>
                <div class="repo-meta">
                    <span>🗝️ Created: ${new Date(k.created_at).toLocaleString()}</span>
                </div>
                <div class="repo-desc" style="word-break:break-all;">
                    <b>Key:</b>
                    <code id="ssh-key-${k.id}">${k.key}</code>
                    <button class="copy-btn" title="Copy SSH Key" onclick="navigator.clipboard.writeText('${k.key.replace(/'/g, "\\'")}');">
                        <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
        html += `</div>`;
    } else {
        html += `<div style="color:#b0b6be;">No SSH keys found.</div>`;
    }

    // OAuth Apps as cards
    html += `<div style="margin-top:16px; margin-bottom:10px;"><b>Authorized OAuth Apps:</b> ${appTokens.length}</div>`;
    if (appTokens.length > 0) {
        html += `<div class="github-repo-list">`;
        html += appTokens.map(a => `
            <div class="github-repo-card">
                <div class="repo-header">
                    <span class="repo-name">${a.name || a.id}</span>
                    <span style="margin-left:10px;">[ID: ${a.id}]</span>
                </div>
                <div class="repo-desc" style="word-break:break-all;">
                    <b>Token:</b>
                    <code id="oauth-token-${a.id}">${a.token || "(hidden)"}</code>
                    ${a.token ? `
                    <button class="copy-btn" title="Copy Token" onclick="navigator.clipboard.writeText('${a.token.replace(/'/g, "\\'")}');">
                        <svg width="18" height="18" viewBox="0 0 24 24" style="vertical-align:middle;"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h11v16z"/></svg>
                    </button>
                    ` : ""}
                </div>
            </div>
        `).join('');
        html += `</div>`;
    } else {
        html += `<div style="color:#b0b6be;">No authorized OAuth apps found.</div>`;
    }

    container.innerHTML = html;
}
// Generated with AI - 26.05.2025 21:54.00

// Add this function for the "statistics" section
// Generated with AI - 26.05.2025 21:54.00
async function fetchGitHubStats(token, username) {
    const container = document.getElementById("github-stats-info");
    container.innerHTML = `<h2>Statistics & Analytics</h2><div>Loading...</div>`;

    // Dropdown for number of events
    const dropdownId = "stats-event-count";
    const options = [1, 5, 10, 20, 50, 100];
    let selectedCount = 10;

    function renderDropdown(selected) {
        return `
            <label for="${dropdownId}" style="margin-right:8px;">Show last</label>
            <select id="${dropdownId}" style="margin-bottom:16px;">
                ${options.map(opt => `<option value="${opt}"${opt === selected ? " selected" : ""}>${opt}</option>`).join('')}
            </select>
            <span>public events</span>
        `;
    }

    container.innerHTML = `<h2>Statistics & Analytics</h2>
        <div style="margin-bottom:16px;">${renderDropdown(selectedCount)}</div>
        <div id="stats-events-list"></div>
    `;

    async function renderEvents(count) {
        let events = [];
        let html = "";
        try {
            const eventsRes = await fetch(`https://api.github.com/users/${username}/events/public`, {
                headers: {
                    "Authorization": `token ${token}`,
                    "Accept": "application/vnd.github+json"
                }
            });
            if (eventsRes.ok) {
                events = await eventsRes.json();
            }
        } catch (e) {
            // ignore
        }
        html += `<div style="margin-bottom:10px;"><b>Recent Public Events:</b> ${events.length}</div>`;
        if (events.length > 0) {
            html += `<div class="github-repo-list">`;
            html += events.slice(0, count).map((ev, idx) => {
                // Short summary for common event types
                let summary = "";
                switch (ev.type) {
                    case "PushEvent":
                        summary = `Pushed ${ev.payload.commits?.length || 0} commit(s) to <b>${ev.repo?.name || "?"}</b>`;
                        break;
                    case "CreateEvent":
                        summary = `Created ${ev.payload.ref_type} <b>${ev.payload.ref}</b> in <b>${ev.repo?.name || "?"}</b>`;
                        break;
                    case "PullRequestEvent":
                        summary = `${ev.payload.action} pull request <b>#${ev.payload.number}</b> in <b>${ev.repo?.name || "?"}</b>`;
                        break;
                    case "IssuesEvent":
                        summary = `${ev.payload.action} issue <b>#${ev.payload.issue?.number}</b> in <b>${ev.repo?.name || "?"}</b>`;
                        break;
                    default:
                        summary = `Event in <b>${ev.repo?.name || "?"}</b>`;
                }
                return `
                    <div class="github-repo-card">
                        <div class="repo-header">
                            <span class="repo-name">${ev.type}</span>
                            <span style="margin-left:10px;">[${ev.repo ? ev.repo.name : "n/a"}]</span>
                            <span style="margin-left:auto;font-size:0.95em;color:#b0b6be;">${new Date(ev.created_at).toLocaleString()}</span>
                        </div>
                        <div class="event-summary">${summary}</div>
                        <button class="show-json-btn" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; this.textContent = this.textContent === 'Show Details' ? 'Hide Details' : 'Show Details';">Show Details</button>
                        <pre class="event-json">${JSON.stringify(ev.payload, null, 2)}</pre>
                    </div>
                `;
            }).join('');
            html += `</div>`;
        } else {
            html += `<div style="color:#b0b6be;">No recent public events found.</div>`;
        }
        document.getElementById("stats-events-list").innerHTML = html;
    }

    // Initial render
    renderEvents(selectedCount);

    // Dropdown event
    container.querySelector(`#${dropdownId}`).addEventListener("change", function() {
        renderEvents(Number(this.value));
    });
}
// Generated with AI - 26.05.2025 21:54.00

// Update fetchAllExtraGitHubInfo to call the new functions
// Generated with AI - 27.05.2025 13:44.00
async function fetchAllExtraGitHubInfo(token, username) {
    fetchGitHubPulls(token, username);
    fetchGitHubWebhooks(token, username);
    fetchGitHubKeys(token);
    fetchGitHubActions(token, username);
    fetchGitHubStats(token, username);
    fetchGitHubAdmin(token, username);
}
