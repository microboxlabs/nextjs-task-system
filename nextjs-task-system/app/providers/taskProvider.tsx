"use client";
import React, { ReactNode, useReducer } from 'react';
import { axiosApi } from '../config/axiosApi';
import { TaskReducer } from '../reducers/taskReducer';
import { TaskContexts } from '../contexts/taskContexts';



const initialValues = {
    tasks: [],
    comments: [],
    msg: '',
    isLoading: true,
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {

    const [state, dispatch] = useReducer(TaskReducer, initialValues);

    const getTasks = async () => {

        dispatch({
            type: 'GET TASKS',
            payload: {
                ...state,
                isLoading: true,
            },
        });
        try {

            const { data } = await axiosApi.get('/tasks')

            dispatch({
                type: 'GET TASKS',
                payload: {
                    tasks: data,
                    isLoading: false,
                }
            })

        } catch (error) {
            dispatch({
                type: 'GET TASKS',
                payload: {
                    tasks: [],
                    isLoading: false,
                }
            })

        }

    }

    const getTasksUser = async (user_id: number) => {

        dispatch({
            type: 'GET TASKS',
            payload: {
                ...state,
                isLoading: true,
            },
        });
        try { 

            const { data } = await axiosApi.get(`/tasks/user?user_id=${user_id}`)

            dispatch({
                type: 'GET TASKS',
                payload: {
                    tasks: data,
                    isLoading: false,
                }
            })

        } catch (error) {
            dispatch({
                type: 'GET TASKS',
                payload: {
                    tasks: [],
                    isLoading: false,
                }
            })

        }

    }

    const getCommentsTask = async (task_id: number) => {

        dispatch({
            type: 'COMMENTS TASKS',
            payload: {
                ...state,
                comments: [],
                isLoading: true,
            },
        });
        try { 

            const { data } = await axiosApi.get(`/tasks/comments?task_id=${task_id}`);
            

            dispatch({
                type: 'COMMENTS TASK',
                payload: {
                    comments: data,
                    isLoading: false,
                }
            })

            

        } catch (error) {
            dispatch({
                type: 'COMMENTS TASK',
                payload: {
                    comments: [],
                    isLoading: false,
                }
            })

        }

    }


    const addCommentTask = async (data: any) => {
        try {

            await axiosApi.post('/tasks/comments',
                {
                    task_id: data.task_id,
                    user_id: data.user_id,
                    comment: data.comment,
                    
                });


            dispatch({
                type: 'ADD COMMENTS TASK',
                payload: {
                    isLoading: false,
                    msg: 'Comment added successfully!'
                }
            });

        } catch (error) {
            console.log(error);
            dispatch({
                type: 'ADD COMMENTS TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error adding comment'
                }
            })
        }
    }

    const createTask = async (data: any) => {
        
        try {

            await axiosApi.post('/tasks',
                {
                    title: data.title,
                    description: data.description ?? null,
                    assigned_to: data.assigned_to  ?? null,
                    assigned_to_id: data.assigned_to_id  ?? null,
                    assigned_to_type: data.assigned_to_type  ?? null,
                    due_date: data.due_date  ?? null,
                    priority: data.priority  ?? null,
                    status: 'pending'
                });


            dispatch({
                type: 'CREATE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Task created successfully!'
                }
            })

        } catch (error) {
            console.log(error)
            dispatch({
                type: 'CREATE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error creating task'
                }
            })
        }

    }

    const updateTask = async (data: any) => {
        try {

            await axiosApi.put('/tasks',
                {
                    id: data.id,
                    title: data.title,
                    description: data.description,
                    assigned_to: data.assigned_to,
                    assigned_to_id: data.assigned_to_id,
                    assigned_to_type: data.assigned_to_type ,
                    due_date: data.due_date,
                    priority: data.priority,
                    status: data.statusNew ? data.statusNew : data.status
                });


            dispatch({
                type: 'UPDATE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Task updated successfully!'
                }
            });

        } catch (error) {
            console.log(error);
            dispatch({
                type: 'UPDATE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error updating task'
                }
            })
        }
    }



    const deleteTask = async (id: number) => {
        try {
            const { data } = await axiosApi.delete(`/tasks?id=${id}`); 

            dispatch({
                type: 'DELETE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Task deleted successfully!'
                }
            });
        } catch (error: any) {
            console.log(error)
            dispatch({
                type: 'DELETE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error deleting task'
                }
            });
        }
    };







    return (
        <TaskContexts.Provider value={{ state, getTasks, createTask, updateTask,deleteTask,getTasksUser,getCommentsTask,addCommentTask }}>
            {children}
        </TaskContexts.Provider>
    )
}