"use client";

import { api } from "@/utils/api";

type AddPageCardProperties = {
  project: string;
};

export const AddPageCard: React.FC<AddPageCardProperties> = ({ project }) => {
  const { mutate, isLoading: isCreating } = api.pages.add.useMutation({
    onSuccess: () => {
      location.reload();
    },
  });

  const addPage = (): void => {
    const pageName = prompt("Please enter your page name:", "my new page");
    if (pageName === null) return;
    mutate({ project, pageName });
  };

  return (
    <div className="m-2">
      <button
        disabled={isCreating}
        onClick={addPage}
        className="mt-6 flex h-64 w-full flex-row items-center justify-center rounded-lg bg-slate-400 p-2 text-slate-100 hover:bg-slate-500"
      >
        <h1>{isCreating ? "creating..." : "+ Add Page"}</h1>
      </button>
    </div>
  );
};
