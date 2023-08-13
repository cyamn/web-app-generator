import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import React from "react";
import toast from "react-hot-toast";

import { Cell } from "@/server/api/routers/table/shared/schema";
import { api } from "@/utils/api";

type CellProperties = {
  value: string;
  type: string;
  cell: Cell;
  controls: boolean;
  id: string;
};

export const CellEdit: React.FC<CellProperties> = ({
  value: value_,
  controls,
  id,
  type,
  cell,
}) => {
  const [savedValue, setSavedValue] = React.useState(value_);
  const [value, setValue] = React.useState(value_);

  const { mutate: update, isLoading: isUpdating } =
    api.tables.setCell.useMutation({
      onSuccess: () => {
        toast.success("Cell updated");
      },
    });

  const { mutate: createCell, isLoading: isCreating } =
    api.tables.createCell.useMutation({
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
      id,
      value: customValue ?? value,
    });
  }

  function addCell(customValue?: string) {
    createCell({
      col: cell.col,
      row: cell.row,
      value: customValue ?? value,
    });
  }

  switch (type) {
    case "number": {
      if (controls) {
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
      return <span className="text-right font-mono">{value}</span>;
    }
    case "boolean": {
      return (
        <FontAwesomeIcon
          className={`w-full px-2 text-center text-2xl text-blue-500 
             ${controls ? "cursor-pointer" : ""}
          `}
          icon={value === "true" ? faSquareCheck : faSquare}
          onClick={() => {
            if (!controls) return;
            updateCell(value === "true" ? "false" : "true");
            setValue(value === "true" ? "false" : "true");
          }}
        />
      );
    }
    default: {
      if (controls) {
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
      return <span>{value}</span>;
    }
  }
};
