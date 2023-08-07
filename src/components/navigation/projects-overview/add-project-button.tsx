"use client";

import { useAddProject } from "@/hooks/use-project";

export const AddProjectButton = () => {
  const { addProject, isAdding } = useAddProject();
  return (
    <button
      disabled={isAdding}
      onClick={() => {
        addProject();
      }}
      className="m-3 mt-4 grid h-48 min-h-min select-none place-items-center rounded-xl border border-blue-500 bg-blue-100 text-center text-5xl text-blue-500 hover:bg-blue-500 hover:text-white "
    >
      {isAdding ? "...creating" : "+ new app"}
    </button>
  );
};
