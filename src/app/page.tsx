"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  Todo,
} from "../helpers/fetches";
import Button from "@components/components/Button";
import Loader from "@components/components/Loader";
import { useState, useEffect } from "react";

const Home = () => {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number>(201);

  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    } else {
      const newUserId = Math.floor(Math.random() * 10000) + 1;
      sessionStorage.setItem("userId", String(newUserId));
      setUserId(newUserId);
    }
  }, []);

  const mutationAdd = useMutation({
    mutationFn: (title: string) => addTodo(title, userId),
    onSuccess: (newTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) => [
        ...(oldTodos || []),
        newTodo,
      ]);
      setNewTodo("");
    },
  });

  const handleAddTask = () => {
    const trimmedTodo = newTodo.trim();

    if (trimmedTodo) {
      mutationAdd.mutate(trimmedTodo);
      setError(null);
    } else {
      setError("Please enter a task");
    }
  };

  const mutationDelete = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (id) => {
      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) =>
        oldTodos?.filter((todo) => todo.id !== id)
      );
    },
  });

  const mutationToggle = useMutation({
    mutationFn: toggleTodo,
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (oldTodos) =>
        oldTodos?.map((todo) =>
          todo.id === updatedTodo.id
            ? { ...todo, completed: updatedTodo.completed }
            : todo
        )
      );
    },
  });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Sorry, failed to load todos
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-5 pb-20 border rounded-xl shadow-md bg-gray-400">
      <h1 className="text-2xl font-bold text-center mb-4 uppercase">
        Todo App
      </h1>

      <div className="flex mb-4  ">
        <input
          type="text"
          className={`flex-1 p-2 border rounded-l-md ${
            error ? "border-red-500" : ""
          }`}
          placeholder={"Write your task"}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <Button onClick={handleAddTask} label="Add" color="blue" />
      </div>
      <div
        className={`transition-opacity duration-300 ${
          error ? "opacity-100 bg-red-500 text-white" : "opacity-0"
        }`}
      >
        <p>{"Plaease, write correct task"}</p>
      </div>
      <ul>
        {todos?.map((todo: Todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-2 border-b"
          >
            <p
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-500" : ""
              }`}
            >
              {todo.title}
            </p>
            <div className="flex gap-5">
              <Button
                onClick={() => mutationDelete.mutate(todo.id)}
                label="Delete"
                color="red"
              />
              <Button
                onClick={() => mutationToggle.mutate(todo)}
                label={todo.completed ? "Undone" : "Done"}
                color={todo.completed ? "orange" : "green"}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
