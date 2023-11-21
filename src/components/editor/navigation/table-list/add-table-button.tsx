"use client";

import { api } from "@/utils/api";

import { AddButton } from "../shared/add-button";

type AddTableButtonProperties = {
  project: string;
};

export const AddTableButton: React.FC<AddTableButtonProperties> = ({
  project,
}) => {
  const { mutate, isLoading } = api.tables.add.useMutation({
    onSuccess: () => {
      location.reload();
    },
  });

  const addTable = (): void => {
    const tableName = prompt(
      "Please enter your table name:",
      "my awesome table",
    );
    if (tableName === null) return;
    mutate({ project, tableName });
  };

  return <AddButton isAdding={isLoading} add={addTable} text="add table" />;
};
