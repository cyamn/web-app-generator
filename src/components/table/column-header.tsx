import React, { useEffect } from "react";
import toast from "react-hot-toast";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Column, columnTypes } from "@/server/api/routers/table/schema";
import { api } from "@/utils/api";
import { nameToInternal } from "@/utils/name-to-internal";

type ColumnHeaderProperties = {
  value: string;
  column: Column;
  project: string;
  table: string;
};

export const ColumnHeader: React.FC<ColumnHeaderProperties> = ({
  value: value_,
  column,
  project,
  table,
}) => {
  const [savedValue, setSavedValue] = React.useState(value_);
  const [value, setValue] = React.useState(value_);
  const [type, setType] = React.useState<string>(column.type);

  const context = api.useContext();

  const { mutate: update } = api.tables.column.update.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table });
      toast.success("Column updated");
    },
  });

  const { mutate: deleteColumn } = api.tables.column.delete.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table });
      toast.success("Column deleted");
    },
  });

  useEffect(() => {
    setValue(value_);
  }, [value_]);

  function updateColumn(customValue?: string) {
    if (customValue === undefined && value === savedValue) return;
    setSavedValue(customValue ?? value);
    update({
      columnID: column.id,
      key: nameToInternal(customValue ?? value),
      type: column.type,
    });
  }

  function updateType(type: string) {
    setType(type);
    update({
      columnID: column.id,
      key: column.key,
      type,
    });
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex w-full flex-row">
          <div className="w-full whitespace-nowrap border-y border-r border-slate-300 bg-white p-4">
            {" "}
            {value}{" "}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 bg-white">
        <ContextMenuItem
          className="cursor-pointer"
          onClick={() => {
            const name = prompt("Enter new name", value);
            if (name === null) return;
            updateColumn(name);
          }}
        >
          Rename
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger className="cursor-pointer">
            Column type
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48 bg-white">
            {columnTypes.map((type) => (
              <ContextMenuItem
                className="cursor-pointer"
                key={type}
                onClick={() => {
                  updateType(type);
                }}
              >
                {type}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem
          className="cursor-pointer"
          onClick={() => {
            deleteColumn({
              columnID: column.id,
            });
          }}
        >
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
