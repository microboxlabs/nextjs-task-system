const API_URL = 'http://localhost:3000/api/users';
const API_URL_REGISTER = 'http://localhost:3000/api/auth/register';
const API_URL_LOGIN = 'http://localhost:3000/api/auth/login';

export const getUsers = () => {
    return fetch(API_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        });
};

export const getUser = (id) => {
    return fetch(`${API_URL}/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            return response.json();
        });
};

export const createUser = (user) => {
    return fetch(API_URL_REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            return response.json();
        });
};

export const updateUser = (id, user) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        });
};

export const deleteUser = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
        });
};

export const login = (credentials) => {
    return fetch(API_URL_LOGIN, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login');
            }
            return response.json();
        });
};