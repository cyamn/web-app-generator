"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { api } from "@/utils/api";

import { DatabaseParameters } from "../shemes/data";
import { FormatDataParameters } from "../shemes/data-format";

type FormatProperties = {
  project: string;
  format: FormatDataParameters;
  data: DatabaseParameters;
  onSetData: (data: DatabaseParameters, format: FormatDataParameters) => void;
};

export const ParameterFormatForm: React.FC<FormatProperties> = ({
  format,
  data,
  onSetData,
  project,
}) => {
  return (
    <>
      <h4 className="mb-2 block text-slate-900">Format</h4>
      <OrderSelection
        project={project}
        data={data}
        format={format}
        onSetData={onSetData}
      />
      <ControlSelection
        project={project}
        data={data}
        format={format}
        onSetData={onSetData}
      />
    </>
  );
};

const OrderSelection: React.FC<FormatProperties> = ({
  project,
  format,
  data,
  onSetData,
}) => {
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    project,
    tableName: data.table,
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <div>Loading...</div>;

  const orderBys = format.orderBy ?? {};

  return (
    <>
      <label
        htmlFor="columns"
        className="mb-2 block text-sm font-medium text-gray-900 "
      >
        Order by
      </label>
      <ul className="w-full rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
        {Object.entries(orderBys).map(([key, value], index) => (
          <div key={index} className="flex items-center">
            <li className="w-full rounded-t-lg border-b border-gray-200">
              <div className="flex items-center p-2">
                <select
                  id="column"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={key}
                  onChange={(event) => {
                    const newOrder = { ...format.orderBy };
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete newOrder[key];
                    newOrder[event.target.value] = value;
                    onSetData(data, {
                      ...format,
                      orderBy: newOrder,
                    });
                  }}
                >
                  {table.columns.map((column) => {
                    if (
                      column.key === key ||
                      !Object.keys(orderBys).includes(column.key)
                    )
                      return (
                        <option key={column.id} value={column.key}>
                          {column.key}
                        </option>
                      );
                  })}
                </select>
                <select
                  id="order"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={value}
                  onChange={(event) => {
                    onSetData(data, {
                      ...format,
                      orderBy: {
                        ...format.orderBy,
                        [key]: event.target.value === "asc" ? "asc" : "desc",
                      },
                    });
                  }}
                >
                  <option key={"asc"} value={"asc"}>
                    asc
                  </option>
                  <option key={"desc"} value={"desc"}>
                    desc
                  </option>
                </select>
                <button
                  className="rounded-b-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    const newOrder = { ...format.orderBy };
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete newOrder[key];
                    onSetData(data, {
                      ...format,
                      orderBy: newOrder,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          </div>
        ))}
        {table.columns.length > Object.keys(orderBys).length && (
          <button
            className="w-full rounded-b-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              // find key that was not set yet
              const key = table.columns.find(
                (column) => !Object.keys(orderBys).includes(column.key)
              )?.key;
              onSetData(data, {
                ...format,
                orderBy: {
                  ...format.orderBy,
                  [key ?? "unknown".toString()]: "asc",
                },
              });
            }}
          >
            add order
          </button>
        )}
      </ul>
    </>
  );
};

const ControlSelection: React.FC<FormatProperties> = ({
  project,
  format,
  data,
  onSetData,
}) => {
  const {
    data: table,
    error,
    isError,
    isLoading,
  } = api.tables.get.useQuery({
    project,
    tableName: data.table,
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading || table === undefined) return <div>Loading...</div>;

  const possibleControls = ["delete", "edit", "duplicate"];
  const controls: { [index: string]: string | null | undefined } =
    format.controls ?? {};

  return (
    <>
      <label
        htmlFor="columns"
        className="mb-2 block text-sm font-medium text-gray-900 "
      >
        Control selection
      </label>
      <ul className="w-full rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900">
        {Object.entries(controls).map(([key, value], index) => (
          <div key={index} className="flex items-center">
            <li className="w-full rounded-t-lg border-b border-gray-200">
              <div className="flex items-center p-2">
                <select
                  id="control"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  value={key}
                  onChange={(event) => {
                    const newControls = { ...controls };
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete newControls[key];
                    newControls[event.target.value] = value;
                    onSetData(data, {
                      ...format,
                      controls: newControls,
                    });
                  }}
                >
                  {possibleControls.map((control) => {
                    if (
                      control === key ||
                      !Object.keys(controls).includes(control)
                    )
                      return (
                        <option key={control} value={control}>
                          {control}
                        </option>
                      );
                  })}
                </select>
                <input
                  id="controlName"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Control name"
                  value={value?.toString() ?? ""}
                  onChange={(event) => {
                    onSetData(data, {
                      ...format,
                      controls: {
                        ...format.controls,
                        [key]: event.target.value,
                      },
                    });
                  }}
                />

                {/* Delete button */}
                <button
                  className="rounded-b-lg border border-gray-200 bg-white px-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => {
                    const newControl = { ...controls };
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete newControl[key];
                    onSetData(data, {
                      ...format,
                      controls: newControl,
                    });
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          </div>
        ))}
        {possibleControls.length > Object.keys(controls).length && (
          <button
            className="w-full rounded-b-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => {
              // find key that was not set yet
              const key = possibleControls.find(
                (control) => !Object.keys(controls).includes(control)
              );
              onSetData(data, {
                ...format,
                controls: {
                  ...format.controls,
                  [key?.toString() ?? "unknown"]: null,
                },
              });
            }}
          >
            add control
          </button>
        )}
      </ul>
    </>
  );
};
