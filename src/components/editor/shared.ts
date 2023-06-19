import { type Page } from "@/data/page";

export interface EditorProperties {
  page: Page;
  showBorders?: boolean;
  trySetLocalPageFromString: (pageString: string) => void;
}
