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

export function hydratePage(desrializedPage: DeserializedPage): HydratedPage {
  return {
    ...desrializedPage,
    variables: desrializedPage.page.variables ?? {},
  };
}
