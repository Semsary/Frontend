import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useTodoStore = create(
  devtools(
    persist(
      (set, get) => ({
        todos: [],
        addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),

        removeTodo: (id) =>
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          })),

        updateTodo: (updatedTodo) =>
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo
            ),
          })),
      }),
      {
        name: "todo-storage",
      }
    )
  )
);
