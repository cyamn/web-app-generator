"use client";

import React from "react";
import toast from "react-hot-toast";

import { SkeletonTableView } from "@/components/skeletons/table-view";
import { Row } from "@/data/table/row";
import { Dict } from "@/data/types";
import { api } from "@/utils/api";

import { Parameters } from "../../library/database-input-form";
import { DatabaseParameters, SQLFilter } from "../shemes/data";

type InputFieldProperties = {
  label: string;
  data: Row[keyof Row];
  type: string;
  setData: (value: string) => void;
  placeholder?: string;
};

// dict type to regex
const regexDict: Dict = {
  boolean: "^(true|false)$",
  number: "^d+$",
  string: ".*",
  date: "^d{4}-d{2}-d{2}$",
  user: ".*",
};

const InputTypeDict: Dict = {
  boolean: "text",
  number: "number",
  string: "text",
  date: "date",
  user: "string",
};

export function InputField({
  label,
  data,
  type,
  setData,
  placeholder,
}: InputFieldProperties) {
  return (
    <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
      <td className="px-6 py-2">
        <label htmlFor="default-input" className="mb-2 block text-gray-900 ">
          {label}
        </label>
      </td>
      <td className="w-full px-4 py-2">
        <input
          value={data.toString()}
          onChange={(event) => {
            setData(event.target.value);
          }}
          type={InputTypeDict[type] ?? "text"}
          pattern={regexDict[type] ?? ".*"}
          placeholder={`${type}${
            placeholder === undefined ? "" : " " + placeholder
          }`}
          id="default-input"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 invalid:border-red-500 invalid:ring-red-500 focus:border-blue-500 focus:ring-blue-500"
        />
      </td>
    </tr>
  );
}

export const DatabaseInputFormRender: React.FC<{
  parameters: Parameters;
  project: string;
}> = ({ parameters, project }) => {
  const tableName = parameters.data.table;

  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    project: project,
    tableName: tableName ?? "",
    columns: Object.keys(parameters.data.columns ?? {}),
  });

  const [row, setRow] = React.useState<Row>({});

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <SkeletonTableView />;

  const data = parameters.data;

  const inputPlaceholders = table.columns.map((column) => {
    if (data.filter !== undefined) {
      const rules = data.filter.filter(
        (f: SQLFilter) => f.column === column.key
      );
      if (rules.length > 0) {
        let placeholder = "";
        for (const rule of rules) {
          placeholder += `${rule.operator} ${rule.value.toString()} `;
        }
        return placeholder.slice(0, -1);
      }
      return null;
    }
    return null;
  });

  return (
    <table className="w-full overflow-hidden rounded-lg bg-slate-50 shadow-md">
      <tbody className="w-full overflow-y-auto">
        {table.columns.map((column, id) => (
          <InputField
            key={id}
            label={data.columns![column.key] ?? column.key}
            data={row[column.key] ?? ""}
            type={column.type}
            setData={(value) => {
              setRow({ ...row, [column.key]: value });
            }}
            placeholder={inputPlaceholders[id] ?? undefined}
          />
        ))}
        <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
          <td />
          <td className="flex justify-end px-6 py-2">
            <CreateButton
              row={row}
              project={project}
              table={tableName}
              onReset={() => {
                setRow({});
              }}
              filter={data.filter}
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
  table: string;
  onReset: () => void;
  filter: DatabaseParameters["filter"];
};

const CreateButton: React.FC<ButtonProperties> = ({
  row,
  project,
  table,
  onReset,
  filter,
}) => {
  const context = api.useContext();

  const { mutate, isLoading: isCreating } = api.tables.row.add.useMutation({
    onSuccess: () => {
      void context.tables.get.invalidate({ project, tableName: table });
      toast.success("Data submitted successfully!");
      onReset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <button
      onClick={() => {
        mutate({
          project,
          tableName: table,
          row,
          filter,
        });
      }}
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
    >
      {isCreating ? "..." : "Create"}
    </button>
  );
};
