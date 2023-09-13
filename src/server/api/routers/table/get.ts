import { prisma } from "@/server/database";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function get(
  name: string,
  project: string,
  columns?: string[]
): Promise<Table | null> {
  return await prisma.table.findFirst(tablesQuery(project, name, columns));
}

export async function getAll(
  project: string,
  columns?: string[]
): Promise<Table[]> {
  return await prisma.table.findMany({
    ...tablesQuery(project, undefined, columns),
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export type Table = {
  name: string;
  columns: {
    type: string;
    key: string;
    id: string;
  }[];
  rows: {
    cells: {
      value: string;
      column: {
        key: string;
      };
      id: string;
    }[];
    id: string;
  }[];
  id: string;
  updatedAt: Date;
};

function tablesQuery(project: string, name?: string, columns?: string[]) {
  const nameFilter = name === undefined ? {} : { name: name };
  return {
    where: {
      project: {
        id: project,
      },
      ...nameFilter,
    },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      columns: {
        select: {
          id: true,
          key: true,
          type: true,
        },
        orderBy: {
          id: "asc",
        },
        ...columnsFilter(columns),
      },
      rows: {
        select: {
          id: true,
          cells: {
            ...cellsFilter(columns),
            select: {
              column: {
                select: {
                  key: true,
                },
              },
              value: true,
              id: true,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  };
}

function columnsFilter(columns?: string[]) {
  if (!columns) return {};
  return {
    where: {
      key: {
        in: columns,
      },
    },
  };
}
function cellsFilter(columns?: string[]) {
  return {
    where: {
      column: {
        key: {
          in: columns,
        },
      },
    },
  };
}
