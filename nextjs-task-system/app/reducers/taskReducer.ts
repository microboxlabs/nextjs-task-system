export const TaskReducer = (state = {}, action: any) => {

    switch (action.type) {
        case 'GET TASKS':
            return {
                ...state,
                tasks: action.payload.tasks,
                isLoading: action.payload.isLoading
            }

        case 'CREATE TASK':
            return {
                ...state,
                isLoading: action.payload.isLoading,
                msg: action.payload.msg
            }
        case 'UPDATE TASK':
            return {
                ...state,
                isLoading: action.payload.isLoading,
                msg: action.payload.msg
            }

        case 'DELETE TASK':
            return {
                ...state,
                isLoading: action.payload.isLoading,
                msg: action.payload.msg
            }

        case 'COMMENTS TASK':
            return {
                ...state,
                comments: action.payload.comments,
                isLoading: action.payload.isLoading,
                msg: action.payload.msg
            }

        case 'ADD COMMENTS TASK':
            return {
                ...state,
                isLoading: action.payload.isLoading,
                msg: action.payload.msg
            }

        default:
            return state;
    }
}
