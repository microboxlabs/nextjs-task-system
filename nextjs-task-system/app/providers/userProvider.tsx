"use client";
import React, { useReducer } from "react";
import { axiosApi } from "../config/axiosApi";
import { UserContexts } from "../contexts/userContexts";
import { UserReducer } from "../reducers/userReducer";


const initialValues = {
  users: [],
  groups: [],
  isLoading: true,
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(UserReducer, initialValues);

  const getUsers = async () => {
    dispatch({
      type: 'GET USERS',
      payload: { isLoading: true },
    });

    try {
      const { data } = await axiosApi.get("/users");

      dispatch({
        type: 'GET USERS',
        payload: { users: data, isLoading: false },
      });

    } catch (error) {
      dispatch({
        type: 'GET USERS',
        payload: { users: [], isLoading: false },
      });
    }
  };

  const getGroups = async () => {
    dispatch({
      type: 'GET GROUPS',
      payload: { isLoading: true },
    });

    try {
      const { data } = await axiosApi.get("/groups");

      dispatch({
        type: 'GET GROUPS',
        payload: { groups: data, isLoading: false },
      });
    } catch (error) {
      dispatch({
        type: 'GET GROUPS',
        payload: { groups: [], isLoading: false },
      });
    }
  };

  const getGroupsByUser = async (user_id: number) => {
    dispatch({
      type: 'GET GROUPS',
      payload: { isLoading: true },
    });

    try {
      const { data } = await axiosApi.get(`/groups/user?user_id=${user_id}`);

      dispatch({
        type: 'GET GROUPS',
        payload: { groups: data, isLoading: false },
      });
    } catch (error) {
      dispatch({
        type: 'GET GROUPS',
        payload: { groups: [], isLoading: false },
      });
    }
  };

  return (
    <UserContexts.Provider
      value={{
        state,
        getUsers,
        getGroups,
        getGroupsByUser
      }}
    >
      {children}
    </UserContexts.Provider>
  );
};