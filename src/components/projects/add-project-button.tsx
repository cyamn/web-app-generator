import { useAddProject } from "@/hooks/use-project";

export const AddProjectButton = () => {
  const { addProject, isAdding } = useAddProject();
  return (
    <button
      disabled={isAdding}
      onClick={() => {
        addProject();
      }}
      className="m-3 grid h-48 min-h-min select-none place-items-center rounded-md bg-slate-300 text-center text-5xl text-slate-600 hover:bg-gradient-to-br hover:from-slate-400 hover:via-slate-200 hover:to-slate-400 "
    >
      {isAdding ? "...creating" : "+ new app"}
    </button>
  );
};
