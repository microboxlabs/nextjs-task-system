const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const API_ROUTES = {
  TASKS: {
    BASE: `${BASE_URL}/api/tasks`,
    BY_ID: (id: number) => `${BASE_URL}/api/tasks/${id}`,
  },
  COMMENTS: {
    BASE: `${BASE_URL}/api/comments`,
    BY_TASK_ID: (taskId: number) => `${BASE_URL}/api/comments/${taskId}`,
  },
};

  