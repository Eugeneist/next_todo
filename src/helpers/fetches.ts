"use client";

import axios from "axios";

const API_URL =
  process.env.BASE_URL || `https://jsonplaceholder.typicode.com/todos`;

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchTodos = async () => {
  try {
    const response = await axios.get(`${API_URL}?_limit=10`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch todos: ${error}`);
  }
};

export const addTodo = async (title: string, userId: number) => {
  const { data } = await axios.post<Todo>(`${API_URL}`, {
    userId: userId,
    id: Math.floor(Date.now() + Math.random()),
    title,
    completed: false,
  });
  return data;
};

export const deleteTodo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};

export const toggleTodo = async (todo: Todo) => {
  const updatedTodo = { ...todo, completed: !todo.completed };
  const { data } = await axios.patch<Todo>(
    `${API_URL}/${todo.id}`,
    updatedTodo
  );
  return data;
};
