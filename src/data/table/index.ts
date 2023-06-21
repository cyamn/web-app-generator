import { z } from "zod";

import { ColumnSchema } from "./column";
import { RowSchema } from "./row";

export const TableSchema = z
  .object({
    name: z.string(),
    columns: z.array(ColumnSchema),
    rows: z.array(RowSchema), // typing??
  })
  .strict();

export type Table = z.infer<typeof TableSchema>;

export const defaultTable: Table = {
  name: "people",
  columns: [
    { key: "active", type: "boolean" },
    {
      key: "name",
      type: "string",
    },
    {
      key: "years_active",
      type: "number",
    },
  ],
  rows: [
    {
      name: "John Doe",
      active: true,
      years_active: 10,
    },
    {
      name: "Jane Doe",
      active: false,
      years_active: 5,
    },
    {
      name: "Max Mustermann",
      active: true,
      years_active: 20,
    },
    {
      name: "Erika Mustermann",
      active: true,
      years_active: 15,
    },
  ],
};

export const moreComplexTable: Table = {
  name: "lectures",
  columns: [
    { key: "name", type: "string" },
    { key: "semester", type: "string" },
    { key: "credits", type: "number" },
    { key: "dozent", type: "string" },
  ],
  rows: [
    {
      name: "Software Engineering",
      semester: "WS 2020/21",
      credits: 6,
      dozent: "Prof. Dr. Riehle",
    },
    {
      name: "Database Systems",
      semester: "SS 2021",
      credits: 5,
      dozent: "Prof. Dr. Müller",
    },
    {
      name: "Algorithms",
      semester: "WS 2021/22",
      credits: 6,
      dozent: "Prof. Dr. Schmidt",
    },
    {
      name: "Data Mining",
      semester: "SS 2022",
      credits: 4,
      dozent: "Prof. Dr. Wagner",
    },
    {
      name: "Human-Computer Interaction",
      semester: "WS 2022/23",
      credits: 5,
      dozent: "Prof. Dr. Becker",
    },
    {
      name: "Artificial Intelligence",
      semester: "SS 2023",
      credits: 6,
      dozent: "Prof. Dr. Klein",
    },
  ],
};
