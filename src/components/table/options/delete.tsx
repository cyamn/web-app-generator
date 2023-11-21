"use client";

import toast from "react-hot-toast";

import { api } from "@/utils/api";

type DeleteTableButtonProperties = {
  project: string;
  table: string;
};

export const DeleteTableButton: React.FC<DeleteTableButtonProperties> = ({
  project,
  table,
}) => {
  const utils = api.useUtils();

  const { mutate: deleteTable } = api.tables.delete.useMutation({
    onSuccess: () => {
      void utils.tables.get.invalidate({ project, tableName: table });
      toast.success("Table deleted");
      window.location.href = `/${project}/table`;
    },
  });

  return (
    <button
      onClick={() => {
        if (
          confirm(
            "Are you sure you want to delete this table? At least you should export it first.",
          )
        ) {
          deleteTable({ project, tableName: table });
        }
      }}
      className="my-2 w-full rounded-lg border border-red-500 bg-red-100 px-4 py-2 font-bold text-red-600 hover:bg-red-600 hover:text-white"
    >
      Delete
    </button>
  );
};
