/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import FormulaParser, { FormulaHelpers, Types } from "fast-formula-parser";

import { getTable } from "../table/get";

export function makeParser(projectId: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return new FormulaParser({
    // External functions, this will override internal functions with same name
    functions: {
      DATA: async (name: string, column: string, rowNumber: number) => {
        name = FormulaHelpers.accept(name, Types.STRING);
        column = FormulaHelpers.accept(column, Types.STRING);
        rowNumber = FormulaHelpers.accept(rowNumber, Types.NUMBER);
        const table = await getTable(name, projectId, [column]);
        const row = table?.rows[rowNumber];
        if (row === undefined) return "#ROW NOT FOUND!";
        return row.cells[0]?.value;
      },
    },
  });
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
/* eslint-enable @typescript-eslint/no-unsafe-member-access */
/* eslint-enable  @typescript-eslint/no-unsafe-call */
