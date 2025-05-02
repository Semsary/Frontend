import React from "react";
import { useForm } from "react-hook-form";
import { useTodoStore } from "../store/todo.store";

const Testing = () => {
  const { register, handleSubmit } = useForm();
  const addTodo = useTodoStore((state) => state.addTodo);
  const todos = useTodoStore((state) => state.todos);

  console.log("Todos:", todos);

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    addTodo(data.todo);
    
    
  }

  return (
    <div>
      <div>
        <form 
          onSubmit={handleSubmit(onSubmit)}>
          {/* todo */}
          <div className="space-y-2">
            <label
              htmlFor="todo"
              className="block text-sm font-medium text-gray-700 text-right"
            >
              Todo
            </label>
            <div className="relative">
              <input
                id="todo"
                name="todo"
                required
                {...register("todo")}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2 sm:py-3 text-right pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="أدخل Todo"
                dir="rtl"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                إضافة Todo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Testing;
