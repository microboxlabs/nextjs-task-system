export const updateTaskStatus = async (taskId: number, status: string) => {

    console.log('status: ' + status)
    const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Failed to update status");
    }

    return response.json();
};


export const updateTaskComments = async (taskId: number, comment: string) => {

    console.log('comment: ' + comment)
    const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
        throw new Error("Failed to update comments");
    }

    return response.json();
};