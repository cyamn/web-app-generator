"use client";

import React from "react";
import toast from "react-hot-toast";

import { Table } from "@/server/api/routers/table/schema";
import { api } from "@/utils/api";

import { InputField } from "../renderers/dashboard/database-input-form";

type TableControlsProperties = {
  control: [string, string | null];
  rowID: string;
  table: Table;
  project: string;
  rowData: Record<string, string>;
};

export const TableControls: React.FC<TableControlsProperties> = (
  properties
) => {
  switch (properties.control[0]) {
    case "delete": {
      return <DeleteRowControl {...properties} />;
    }
    case "duplicate": {
      return <DuplicateRowControl {...properties} />;
    }
    case "edit": {
      return <EditRowControl {...properties} />;
    }
    default: {
      return <div>Unknown control: {properties.control[0]}</div>;
    }
  }
};

export const DeleteRowControl: React.FC<TableControlsProperties> = ({
  rowID,
  table,
  project,
  control,
}) => {
  const context = api.useContext();

  const {
    mutate: deleteRow,
    isLoading,
    isError,
    error,
  } = api.tables.row.delete.useMutation({
    onSuccess: () => {
      toast.success("Row deleted");
      void context.tables.get.invalidate({
        project,
        tableName: table.name,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <div>...</div>;

  return (
    <div className="flex justify-center">
      <button
        onClick={() => {
          deleteRow({
            rowId: rowID,
          });
        }}
        className="whitespace-nowrap rounded-md bg-red-500 p-1 text-white"
      >
        {control[1] ?? "Delete"}
      </button>
    </div>
  );
};
export const DuplicateRowControl: React.FC<TableControlsProperties> = ({
  rowData,
  table,
  project,
  control,
}) => {
  const context = api.useContext();

  const {
    mutate: insertRow,
    isLoading,
    isError,
    error,
  } = api.tables.row.add.useMutation({
    onSuccess: () => {
      toast.success("Row duplicated");
      void context.tables.get.invalidate({
        project,
        tableName: table.name,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <div>...</div>;

  return (
    <div className="flex justify-center">
      <button
        onClick={() => {
          insertRow({
            project,
            tableName: table.name,
            row: rowData,
          });
        }}
        className="whitespace-nowrap rounded-md bg-blue-500 p-1 text-white"
      >
        {control[1] ?? "Duplicate"}
      </button>
    </div>
  );
};

export const EditRowControl: React.FC<TableControlsProperties> = ({
  rowData,
  table,
  project,
  control,
  rowID,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isChanged, setIsChanged] = React.useState(false);
  const [localRowData, setLocalRowData] = React.useState(rowData);

  const context = api.useContext();

  const {
    mutate: updateRow,
    isLoading,
    isError,
    error,
  } = api.tables.row.update.useMutation({
    onSuccess: () => {
      toast.success("Row updated");
      void context.tables.get.invalidate({
        project,
        tableName: table.name,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          className="whitespace-nowrap rounded-md bg-blue-500 p-1 text-white"
        >
          {control[1] ?? "Edit"}
        </button>
      </div>
      {menuOpen && (
        <>
          <div className="absolute left-0 top-0 z-20 h-screen w-screen backdrop-blur-sm"></div>
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-300 bg-slate-50 px-10 py-5 shadow-xl">
            <div className="flex flex-col">
              <table className="w-full overflow-hidden rounded-lg bg-slate-50 shadow-md">
                <tbody className="w-full overflow-y-auto">
                  {table.columns.map((column, id) => (
                    <InputField
                      key={id}
                      label={column.key}
                      data={localRowData[column.key] ?? ""}
                      type={column.type}
                      setData={(value) => {
                        setLocalRowData({
                          ...localRowData,
                          [column.key]: value,
                        });
                        setIsChanged(true);
                      }}
                      placeholder={column.key}
                    />
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  if (isChanged) {
                    updateRow({
                      rowId: rowID,
                      row: localRowData,
                    });
                  }
                }}
                className="mt-2 rounded-md bg-blue-500 p-3 text-white"
              >
                {isChanged ? "Save" : "Close"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
