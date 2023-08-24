import { useState } from "react";

import { Variables } from "@/data/page/variables";
import { api } from "@/utils/api";

type VariablesPanelProperties = {
  variables: Variables;
  updateVariables: (variables: Variables) => void;
};

export const VariablesPanel: React.FC<VariablesPanelProperties> = ({
  variables,
  updateVariables,
}) => {
  const [localVariables, setLocalVariables] = useState<Variables>(variables);
  const [savedVariables, saveVariables] = useState<Variables>(variables);

  const { data, isLoading, isError } =
    api.variables.calculate.useQuery(savedVariables);

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
    <div className="m-2 h-full">
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
          {Object.entries(localVariables).map(([name, variable]) => {
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
                    value={variable}
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
                  {isLoading ? variable : isError ? "Error" : data[name]}
                </td>
              </tr>
            );
          })}
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
