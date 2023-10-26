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
        className="mt-6 flex h-64 w-full flex-row items-center justify-center rounded-lg border border-blue-500 bg-blue-100 p-2 text-blue-500 hover:bg-blue-500 hover:text-white"
      >
        <h1>{isCreating ? "creating..." : "+ Add Page"}</h1>
      </button>
    </div>
  );
};
