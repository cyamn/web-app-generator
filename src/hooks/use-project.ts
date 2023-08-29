import { api } from "@/utils/api";

export const useProjectList = () => {
  const { data: projects, isError, isLoading } = api.projects.list.useQuery({});

  if (projects === undefined || projects === null)
    return { projects: [], isError, isLoading: true };
  return { projects, isError, isLoading };
};

export const useAddProject = () => {
  const context = api.useContext();
  const { mutate, isLoading: isAdding } = api.projects.add.useMutation({
    onSuccess: () => {
      void context.projects.list.invalidate();
      window.location.reload();
    },
  });

  const addProject = () => {
    const name = prompt("Project name");
    if (name === null) return;
    mutate({ name });
  };
  return { addProject, isAdding };
};
