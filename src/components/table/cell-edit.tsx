import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import React from "react";
import toast from "react-hot-toast";

import { Cell } from "@/server/api/routers/table/schema";
import { api } from "@/utils/api";

type CellProperties = {
  value: string;
  type: string;
  cell: Cell;
  id: string;
  project: string;
};

export const CellEdit: React.FC<CellProperties> = ({
  value: value_,
  id,
  type,
  cell,
  project,
}) => {
  const [savedValue, setSavedValue] = React.useState(value_);
  const [value, setValue] = React.useState(value_);

  const { mutate: update } = api.tables.cell.update.useMutation({
    onSuccess: () => {
      toast.success("Cell updated");
    },
  });

  const { mutate: createCell } = api.tables.cell.add.useMutation({
    onSuccess: () => {
      toast.success("Cell created");
    },
  });

  useEffect(() => {
    setValue(value_);
  }, [value_]);

  // when enter pressed
  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      updateCell();
    }
  }

  function updateCell(customValue?: string) {
    if (customValue === undefined && value === savedValue) return;
    setSavedValue(customValue ?? value);
    if (cell.id === "") {
      addCell(customValue);
      return;
    }
    update({
      cellID: id,
      value: customValue ?? value,
    });
  }

  function addCell(customValue?: string) {
    createCell({
      column: cell.col,
      row: cell.row,
      value: customValue ?? value,
    });
  }

  switch (type) {
    case "number": {
      return (
        <input
          className="w-full border-none text-right font-mono"
          type="number"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            updateCell();
          }}
        />
      );
    }
    case "boolean": {
      return (
        <FontAwesomeIcon
          className={`cursor-pointer"} w-full px-2 text-center text-2xl
          `}
          icon={value === "true" ? faSquareCheck : faSquare}
          onClick={() => {
            updateCell(value === "true" ? "false" : "true");
            setValue(value === "true" ? "false" : "true");
          }}
        />
      );
    }
    case "date": {
      return (
        <input
          className="w-full border-none"
          type="date"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            updateCell();
          }}
        />
      );
    }

    case "user": {
      const {
        data: users,
        isLoading,
        isError,
        error,
      } = api.roles.getUsers.useQuery({ project });

      if (isLoading) return <div>...</div>;
      if (isError) return <div>error.message</div>;

      return (
        <select
          className="w-full border-none"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            updateCell(event.target.value);
          }}
        >
          <option value=""></option>
          {users.map((user, index) => (
            <option key={index} value={user.email ?? ""}>
              {user.email}
            </option>
          ))}
        </select>
      );
    }

    default: {
      return (
        <input
          className="w-full border-none"
          type="text"
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            updateCell();
          }}
        />
      );
    }
  }
};
