// Helper to map status codes to messages
const statusMeanings = {
    // 1xx Informational
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    103: 'Early Hints',

    // 2xx Success
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    208: 'Already Reported',
    226: 'IM Used',

    // 3xx Redirection
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    306: 'Switch Proxy',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',

    // 4xx Client Errors
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a teapot",
    421: 'Misdirected Request',
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Too Early',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',

    // 5xx Server Errors
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    508: 'Loop Detected',
    510: 'Not Extended',
    511: 'Network Authentication Required',

    // 6xx (Non-standard, rarely used)
    600: 'Unparseable Response Headers'
};

function getStatusMeaning(status) {
    return statusMeanings[status] ? statusMeanings[status] : '';
}

function testGitHubConnection() {
    return fetch('https://api.github.com/user')
        .then(async response => {
            const status = response.status;
            const message = response.statusText;
            const meaning = getStatusMeaning(status);
            const statusString = meaning ? `${status} (${meaning})` : status;
            if (status >= 200 && status < 300) {
                showSuccess('GitHub Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'success' };
            } else if (status >= 400 && status < 500) {
                showError('GitHub Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'error' };
            } else if (status >= 500) {
                showWarning('GitHub Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            } else {
                showWarning('GitHub Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            }
        })
        .catch(() => {
            showError('GitHub Connection', 'Network error');
            return {
                status: null,
                message: 'Network error',
                type: 'error'
            };
        });
}

function testGitLabConnection() {
    return fetch('https://gitlab.com/api/v4/user')
        .then(async response => {
            const status = response.status;
            const message = response.statusText;
            const meaning = getStatusMeaning(status);
            const statusString = meaning ? `${status} (${meaning})` : status;
            if (status >= 200 && status < 300) {
                showSuccess('GitLab Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'success' };
            } else if (status >= 400 && status < 500) {
                showError('GitLab Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'error' };
            } else if (status >= 500) {
                showWarning('GitLab Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            } else {
                showWarning('GitLab Connection', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            }
        })
        .catch(() => {
            showError('GitLab Connection', 'Network error');
            return {
                status: null,
                message: 'Network error',
                type: 'error'
            };
        });
}

function testGitHubConnectionWithToken(token) {
    return fetch('https://api.github.com/user', {
        headers: {
            'Authorization': `token ${token}`
        }
    })
        .then(async response => {
            const status = response.status;
            const message = response.statusText;
            const meaning = getStatusMeaning(status);
            const statusString = meaning ? `${status} (${meaning})` : status;
            if (status >= 200 && status < 300) {
                showSuccess('GitHub Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'success' };
            } else if (status >= 400 && status < 500) {
                showError('GitHub Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'error' };
            } else if (status >= 500) {
                showWarning('GitHub Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            } else {
                showWarning('GitHub Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            }
        })
        .catch(() => {
            showError('GitHub Connection (Token)', 'Network error');
            return {
                status: null,
                message: 'Network error',
                type: 'error'
            };
        });
}

function testGitLabConnectionWithToken(token) {
    return fetch('https://gitlab.com/api/v4/user', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(async response => {
            const status = response.status;
            const message = response.statusText;
            const meaning = getStatusMeaning(status);
            const statusString = meaning ? `${status} (${meaning})` : status;
            if (status >= 200 && status < 300) {
                showSuccess('GitLab Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'success' };
            } else if (status >= 400 && status < 500) {
                showError('GitLab Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'error' };
            } else if (status >= 500) {
                showWarning('GitLab Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            } else {
                showWarning('GitLab Connection (Token)', `Status: ${statusString} - ${message}`);
                return { status, message, type: 'warning' };
            }
        })
        .catch(() => {
            showError('GitLab Connection (Token)', 'Network error');
            return {
                status: null,
                message: 'Network error',
                type: 'error'
            };
        });
}

document.getElementById('test_gh_gl_connection').addEventListener('click', function () {
    const token = document.getElementById('github_token').value;
    if (!token) {
        showError('GitHub Token', 'Token is required');
        return;
    }
    testGitHubConnection();
    testGitLabConnection();
    testGitHubConnectionWithToken(token);
    testGitLabConnectionWithToken(token);
});