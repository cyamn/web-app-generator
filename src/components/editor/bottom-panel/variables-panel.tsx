import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

import { Page } from "@/data/page";
import { Variables } from "@/data/page/variables";
import { api } from "@/utils/api";
import { stringToJSX } from "@/utils/string-to-jsx";

type VariablesPanelProperties = {
  variables: Variables;
  updateVariables: (variables: Variables) => void;
  page: Page;
  project: string;
};

export const VariablesPanel: React.FC<VariablesPanelProperties> = ({
  variables,
  updateVariables,
  page,
  project,
}) => {
  const [localVariables, setLocalVariables] = useState<Variables>(variables);
  const [savedVariables, saveVariables] = useState<Variables>(variables);

  const { data, isLoading, isError } = api.variables.calculate.useQuery({
    variables: savedVariables,
    project,
    page,
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      commitVariables(localVariables);
    }
  };

  function commitVariables(variables: Variables): void {
    saveVariables(variables);
    updateVariables(variables);
  }

  return (
    <div className="m-2 h-screen">
      <table className="w-full table-fixed font-mono">
        <thead className="sticky">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="w-4 px-4 py-2"></th>
            <th className="px-4 py-2">Definition</th>
            <th className="w-4 px-4 py-2"></th>
            <th className="px-4 py-2">Computed</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries({ ...data, ...localVariables }).map(
            ([name, variable]) => {
              return (
                <tr key={name}>
                  <td>
                    <input
                      className="w-full border px-4 py-2"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        // TODO: make more responsive
                        const input = event.target.value;
                        if (input === undefined || input === "") return;
                        const newVariables = { ...localVariables };
                        const temporary = localVariables[name];
                        // eslint-disable-next-line security/detect-object-injection, @typescript-eslint/no-dynamic-delete
                        delete newVariables[name];
                        newVariables[input] = temporary ?? "";
                        setLocalVariables(newVariables);
                      }}
                      onKeyDown={() => handleKeyDown}
                    />
                  </td>
                  <td className="px-1 py-2">:=</td>
                  <td>
                    <input
                      className="w-full border px-4 py-2"
                      type="text"
                      value={JSON.stringify(variable)}
                      onChange={(event) => {
                        const newVariables = { ...localVariables };
                        newVariables[name] = event.target.value;
                        setLocalVariables(newVariables);
                      }}
                      onKeyDown={() => handleKeyDown}
                    />
                  </td>
                  <td className="p-2">=</td>
                  <td className="border px-4 py-2">
                    {isLoading ? (
                      <StringOrJSONField obj={variable as unknown} />
                    ) : isError ? (
                      "Error"
                    ) : (
                      <StringOrJSONField obj={data[name] as unknown} />
                    )}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <button
        className="w-full bg-slate-50 p-2"
        onClick={() => {
          const newVariables = { ...localVariables };
          newVariables[`var${Object.entries(localVariables).length + 1}`] = "0";
          setLocalVariables(newVariables);
          commitVariables(newVariables);
        }}
      >
        Add Variable
      </button>
    </div>
  );
};

type StringOrObject = {
  obj: unknown;
};

export const StringOrJSONField: React.FC<StringOrObject> = ({ obj }) => {
  const [maximized, setMaximized] = useState(false);
  if (obj === undefined)
    return <div className="w-full text-center">undefined</div>;
  if (typeof obj === "string")
    return <div className="w-full text-center">{obj}</div>;
  return (
    <>
      <button
        className="w-full"
        onClick={() => {
          setMaximized(true);
        }}
      >
        <span className="ml-4 rounded-md bg-slate-200 p-1 text-slate-600">
          <FontAwesomeIcon className="mx-2" icon={faMagnifyingGlass} />
          Click to Inspect
        </span>
      </button>
      {maximized && (
        <>
          <div className="absolute left-0 top-0 z-20 h-screen w-screen backdrop-blur-sm"></div>
          <div className="absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-300 bg-slate-50 px-10 py-5 shadow-xl">
            <div className="flex flex-col">
              {stringToJSX(JSON.stringify(obj, null, 4))}
              <button
                onClick={() => {
                  setMaximized(false);
                }}
                className="mt-2 rounded-md bg-blue-500 p-3 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
