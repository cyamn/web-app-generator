"use client";

import { api } from "@/utils/api";

import { AddButton } from "../shared/add-button";

type AddPageButtonProperties = {
  project: string;
};

export const AddPageButton: React.FC<AddPageButtonProperties> = ({
  project,
}) => {
  const { mutate, isLoading } = api.pages.add.useMutation({
    onSuccess: () => {
      location.reload();
    },
  });

  const addPage = (): void => {
    const pageName = prompt("Please enter your page name:", "my new page");
    if (pageName === null) return;
    mutate({
      project,
      pageName,
    });
  };
  return <AddButton isAdding={isLoading} add={addPage} text="add page" />;
};
