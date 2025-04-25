const BASE_URL = process.env.REACT_APP_API_URL || 'https://foodie-api-nine.vercel.app';

export async function fetchData(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    const res = await response.json();
    return res;
}

export async function fetchDataMultipart(endpoint, options = {}) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
            ...options.headers,
        },
        ...options,
    });
    
    return response;
}

export async function postData(endpoint, body, options = {}) {
    return fetchData(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options,
    });
}

export async function patchData(endpoint, body, options = {}) {
    return fetchData(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body),
        ...options,
    });
}

export async function deleteData(endpoint, options = {}) {
    return fetchData(endpoint, {
        method: 'DELETE',
        ...options,
    });
}