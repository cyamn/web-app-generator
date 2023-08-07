"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { api } from "@/utils/api";

type AddTableButtonProperties = {
  project: string;
};

export const AddTableButton: React.FC<AddTableButtonProperties> = ({
  project,
}) => {
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
    <a
      onClick={addTable}
      className="m-1 flex cursor-pointer items-center rounded-lg px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
    >
      <FontAwesomeIcon icon={faPlus} />
      <button disabled={isCreating} className="ml-3 text-sm font-medium">
        {isCreating ? "adding ..." : "add table"}
      </button>
    </a>
  );
};
