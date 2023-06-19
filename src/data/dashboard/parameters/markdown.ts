import { z } from "zod";

export const MarkdownParametersSchema = z
  .object({
    markdown: z.string(),
  })
  .strict();

export type MarkdownParameters = z.infer<typeof MarkdownParametersSchema>;

export const defaultMarkdownParameters = {
  markdown: "# Header\n\nParagraph",
};
