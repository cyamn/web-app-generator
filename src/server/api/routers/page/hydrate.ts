import { Page } from "@/data/page";
import { Variables } from "@/data/page/variables";

type DeserializedPage = {
  page: Page;
  updatedAt: Date;
};

type HydratedPage = {
  page: Page;
  updatedAt: Date;
  variables: Variables;
};

export function hydratePage(deserializedPage: DeserializedPage): HydratedPage {
  return {
    ...deserializedPage,
    variables: deserializedPage.page.variables ?? {},
  };
}
