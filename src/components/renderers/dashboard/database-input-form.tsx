"use client";

import React from "react";
import { z } from "zod";

import { SkeletonTableView } from "@/components/skeletons/table-view";
import { DatabaseInputForm } from "@/data/dashboard/library/database-input-form";
import { Row } from "@/data/table/row";
import { api } from "@/utils/api";

type InputFieldProperties = {
  label: string;
  data: Row[keyof Row];
  type: string;
  setData: (value: string) => void;
};

// dict type to regex
const regexDict = {
  boolean: "^(true|false)$",
  number: "^d+$",
  string: ".*",
  date: "^d{4}-d{2}-d{2}$",
};

const InputTypeDict = {
  boolean: "text",
  number: "number",
  string: "text",
  date: "date",
};

const ZodSchemaDict = {
  boolean: z.boolean(),
  number: z.number(),
  string: z.string(),
  date: z.date(),
};

function InputField({ label, data, type, setData }: InputFieldProperties) {
  function onInput(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value.match(regexDict[type])) {
      setData(z.parse(value, ZodSchemaDict[type]));
    }
  }

  return (
    <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
      <td className="px-6 py-2">
        <label htmlFor="default-input" className="mb-2 block text-gray-900 ">
          {label}
        </label>
      </td>
      <td className="w-full px-4 py-2">
        <input
          value={data}
          onChange={(event) => {
            setData(event.target.value);
          }}
          type={InputTypeDict[type]}
          pattern={regexDict[type] ?? ".*"}
          placeholder={type}
          id="default-input"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 invalid:border-red-500 invalid:ring-red-500 focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
    </tr>
  );
}

export const DatabaseInputFormRender: React.FC<{
  dashboard: DatabaseInputForm;
  projectName: string;
}> = ({ dashboard, projectName }) => {
  const tableName = dashboard.parameters.data.table;
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    projectName,
    tableName,
    columns: Object.keys(dashboard.parameters.data.columns ?? {}),
  });

  const [row, setRow] = React.useState<Row>({});

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <SkeletonTableView />;

  return (
    <table className="w-full overflow-hidden rounded-lg bg-slate-50 shadow-md">
      <tbody className="w-full overflow-y-auto">
        {table.columns.map((column, id) => (
          <InputField
            key={id}
            label={dashboard.parameters.data.columns![column.key] ?? column.key}
            data={row[column.key] ?? ""}
            type={column.type}
            setData={(value) => {
              setRow({ ...row, [column.key]: value });
              console.log(row);
            }}
          />
        ))}
        <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
          <td />
          <td className="flex justify-end px-6 py-2">
            <CreateButton
              row={row}
              project={projectName}
              tableName={tableName}
              onReset={() => {
                setRow({});
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

type ButtonProperties = {
  row: Row;
  project: string;
  tableName: string;
  onReset: () => void;
};

const CreateButton: React.FC<ButtonProperties> = ({
  row,
  project,
  tableName,
  onReset,
}) => {
  const context = api.useContext();

  const {
    mutate,
    isLoading: isCreating,
    isError,
  } = api.tables.insert.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ projectName: project, tableName });
      onReset();
    },
  });
  return (
    <button
      onClick={() => {
        alert(JSON.stringify(row));
        mutate({
          projectName: project,
          tableName,
          row,
        });
      }}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      {isCreating ? "..." : "Create"}
    </button>
  );
};
