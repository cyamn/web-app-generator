"use client";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { api } from "@/utils/api";

type AddPageButtonProperties = {
  project: string;
};

export const AddPageButton: React.FC<AddPageButtonProperties> = ({
  project,
}) => {
  const { mutate, isLoading: isCreating } = api.pages.add.useMutation({
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

  return (
    <a
      onClick={addPage}
      className="m-1 flex cursor-pointer items-center rounded-lg px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
    >
      <FontAwesomeIcon icon={faPlus} />
      <button disabled={isCreating} className="ml-3 text-sm font-medium">
        {isCreating ? "adding ..." : "add page"}
      </button>
    </a>
  );
};
