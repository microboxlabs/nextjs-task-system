import Cookies from "js-cookie";

const token = Cookies.get("token");
const API_URL = 'http://localhost:3000/api/tasks';
const API_URL2 = 'http://localhost:3000/api/myTasks';



export const getTasks = async () => {
    return fetch(API_URL, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        });
};

export const getTask = async (taskId) => {
    return fetch(`${API_URL}/${taskId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch task');
            }
            return response.json();
        });
};

export const getTasksByGroupIdandAssignedToId = async (groupId, assignedToId) => {
    return fetch(`${API_URL2}/${assignedToId}/${groupId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            return response.json();
        });
};

export const createTask = async (task) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            return response.json();
        });
};

export const updateTask = async (id, task) => {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            return response.json();
        });
};


export const deleteTask = async (taskId) => {
    return fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
        });
};



