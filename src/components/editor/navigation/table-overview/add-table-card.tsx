"use client";

import { api } from "@/utils/api";

type AddTableCardProperties = {
  project: string;
};

export const AddTableCard: React.FC<AddTableCardProperties> = ({ project }) => {
  const { mutate, isLoading: isCreating } = api.tables.add.useMutation({
    onSuccess: () => {
      location.reload();
    },
  });

  const addTable = (): void => {
    const tableName = prompt(
      "Please enter your table name:",
      "my awesome table"
    );
    if (tableName === null) return;
    mutate({ project, tableName });
  };

  return (
    <div className="m-2">
      <button
        disabled={isCreating}
        onClick={addTable}
        className="mt-6 flex h-64 w-full flex-row items-center justify-center rounded-lg border border-blue-500 bg-blue-100 p-2 text-blue-500 hover:bg-blue-500 hover:text-white"
      >
        <h1>{isCreating ? "creating..." : "+ Add Table"}</h1>
      </button>
    </div>
  );
};
