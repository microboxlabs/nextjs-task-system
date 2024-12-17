export const UserReducer = (state = {}, action: any) => {
 
    switch (action.type) {
        case 'GET USERS':
            return {
                ...state,
                users: action.payload.users,
                isLoading: action.payload.isLoading
            }

        case 'GET GROUPS':
            return {
                ...state,
                groups: action.payload.groups,
                isLoading: action.payload.isLoading
            }

        default:
            return state;
    }
}