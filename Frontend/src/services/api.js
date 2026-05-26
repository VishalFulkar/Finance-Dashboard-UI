let rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Remove trailing slash if present
if (rawBaseUrl.endsWith('/')) {
    rawBaseUrl = rawBaseUrl.slice(0, -1);
}

// Automatically append '/api' if not already present
if (!rawBaseUrl.endsWith('/api')) {
    rawBaseUrl += '/api';
}

const BASE_URL = rawBaseUrl;

async function request(method, path, body, isFormData = false) {
    const options = {
        method,
        credentials: 'include', // Send cookies with every request
    };

    if (body) {
        if (isFormData) {
            // Let the browser set Content-Type with correct boundary for multipart
            options.body = body;
        } else {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(body);
        }
    }

    const res = await fetch(`${BASE_URL}${path}`, options);
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

export const api = {
    get:      (path)        => request('GET',    path),
    post:     (path, body)  => request('POST',   path, body),
    postForm: (path, body)  => request('POST',   path, body, true), // For multipart/form-data
    put:      (path, body)  => request('PUT',    path, body),
    del:      (path)        => request('DELETE', path),
};
