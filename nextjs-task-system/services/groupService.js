import Cookies from "js-cookie";

const token = Cookies.get("token");
const API_URL = 'http://localhost:3000/api/groups';

export const getGroups = () => {
    return fetch(API_URL, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    }

    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch groups');
            }
            return response.json();
        });
};

export const getGroup = (id) => {
    return fetch(`${API_URL}/${id}`,
        {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch group');
            }
            return response.json();
        });
};

export const createGroup = (group) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(group)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create group');
            }
            return response.json();
        });
};

export const updateGroup = (id, group) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(group)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update group');
            }
            return response.json();
        });
};

export const deleteGroup = (id) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete group');
            }
        });
};