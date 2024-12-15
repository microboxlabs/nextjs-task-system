"use client";
import React, { ReactNode, useReducer } from 'react';
import { AuthReducer } from '../reducers/authReducer';
import { AuthContexts } from '../contexts/authContexts';
import { axiosApi } from '../config/axiosApi';
import axios from 'axios';



const initialValues = {
    user: {},
    isLogged: false,
    token: '',
    message: ''

}
export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [state, dispatch] = useReducer(AuthReducer, initialValues);

    const login = async (email: string, pass: string) => {

        try {
            const { data } = await axiosApi.post('/login', {
                email: email,
                pass: pass,
            });

            const objectStorage = {
                type: 'LOGIN',
                payload: {
                    user: data.user,
                    isLogged: true,
                    token: data.token,
                    message: "User Logged in successfully!"
                }
            }
            localStorage.setItem('token', JSON.stringify(objectStorage));

            dispatch(objectStorage);
        } catch (error) {
            let errorMessage = "An error occurred. Please try again.";

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    errorMessage = "Invalid email. Please check your email.";
                }
                if (error.response?.status === 401) {
                    errorMessage = "Invalid credentials. Please check your email and password.";
                }
            }

            alert(errorMessage);

            dispatch({
                type: 'LOGIN',
                payload: {
                    message: errorMessage
                }
            });

        }

    }
    const checkToken = async () => {
        try {
            const token = localStorage.getItem('token') || '';
            const dataToken = JSON.parse(token);
            if (!token) {
                dispatch({
                    type: 'LOGOUT',
                    payload: {
                        message: "User Logged out successfully!"
                    }
                })
                return;
            }

            const objectStorage = {
                type: 'LOGIN',
                payload: {
                    user: dataToken.payload.user,
                    isLogged: true,
                    token: dataToken.payload.token,
                    message: "User Logged in successfullyy!"
                }
            }

            dispatch(objectStorage);
        }

        catch (error) {
            dispatch({
                type: 'LOGOUT',
                payload: {
                    message: "User Logged out successfully!",
                },
            });


        }
    }

        const logout = () => {

            dispatch({
                type: 'LOGOUT',
                payload: {
                    message: "User Logged out successfully!"
                }
            })
            localStorage.removeItem('token');
        }



        return (
            <AuthContexts.Provider value={{ state, login, logout, checkToken }}>
                {children}
            </AuthContexts.Provider>
        )
    }