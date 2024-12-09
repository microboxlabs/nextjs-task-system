import Cookies from "js-cookie";

const token = Cookies.get("token");
const API_URL = 'http://localhost:3000/api/comments';

export const getComments = (taskId) => {
    return fetch(`${API_URL}/${taskId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            return response.json();
        });
};

export const createComment = (comment) => {
    return fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(comment)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create comment');
            }
            return response.json();
        });
}