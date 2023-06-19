import { z } from "zod";

import {
  defaultMarkdownParameters,
  MarkdownParametersSchema,
} from "../parameters/markdown";
import { Dashboard } from "./dashboard";

export const MarkdownSchema = z
  .object({
    type: z.string().refine((value) => value === "markdown"),
    parameters: MarkdownParametersSchema,
  })
  .strict();

export type Markdown = z.infer<typeof MarkdownSchema>;

export const defaultMarkdown: Markdown = {
  type: "markdown",
  parameters: defaultMarkdownParameters,
};
