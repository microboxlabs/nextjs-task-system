"use client";
import React, { ReactNode, useReducer } from 'react';
import { axiosApi } from '../config/axiosApi';
import { TaskReducer } from '../reducers/taskReducer';
import { TaskContexts } from '../contexts/taskContexts';



const initialValues = {
    tasks: [],
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

    const createTask = async (title: string, description: string, assigned_to: number, due_date: Date, priority: string, comments: string) => {
        createTask
        try {

            await axiosApi.post('/app/tasks/create',
                {
                    title: title,
                    description: description,
                    assigned_to: assigned_to,
                    due_date: due_date,
                    priority: priority,
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
            dispatch({
                type: 'CREATE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error creating task: {{error}}'
                }
            })
        }

    }

    const updateTask = async (title: string, description: string, assigned_to: number, due_date: Date, priority: string, comments: string) => {
        try {

            const { data } = await axiosApi.put('/app/tasks/update',
                {
                    title: title,
                    description: description,
                    assigned_to: assigned_to,
                    due_date: due_date,
                    priority: priority,
                    status: 'pending'
                });


            dispatch({
                type: 'UPDATED TASK',
                payload: {
                    isLoading: false,
                    msg: 'Task updated successfully!'
                }
            })

        } catch (error) {
            dispatch({
                type: 'UPDATED TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error updating task: {{error}}'
                }
            })
        }
    }

    const deleteTask = async (id: number) => {
        try {

            const { data } = await axiosApi.delete('/app/task',
                );


            dispatch({
                type: 'DELETE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Task deleted successfully!'
                }
            })

        } catch (error) {
            dispatch({
                type: 'DELETE TASK',
                payload: {
                    isLoading: false,
                    msg: 'Error deleting task: {{error}}'
                }
            })
        }
    }








    return (
        <TaskContexts.Provider value={{ state, getTasks, createTask, updateTask,deleteTask }}>
            {children}
        </TaskContexts.Provider>
    )
}