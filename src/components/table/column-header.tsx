import React, { useEffect } from "react";
import toast from "react-hot-toast";

import { Column } from "@/server/api/routers/table/schema";
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

  const { mutate: update, isLoading: isUpdating } =
    api.tables.column.update.useMutation({
      onSuccess: () => {
        void context.tables.get.invalidate({ project, tableName: table });
        toast.success("Column updated");
      },
    });

  useEffect(() => {
    setValue(value_);
  }, [value_]);

  // when enter pressed
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      updateColumn();
    }
  }

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
    <div className="flex flex-row">
      <input
        type="text"
        className="w-full border-none"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => {
          updateColumn();
        }}
      />
      <select
        name="type"
        id="type"
        className="border-none font-mono"
        value={type}
        onChange={(event) => {
          updateType(event.target.value);
        }}
      >
        <option value="string">String</option>
        <option value="number">Number</option>
        <option value="boolean">Boolean</option>
        <option value="date">Date</option>
      </select>
    </div>
  );
};
