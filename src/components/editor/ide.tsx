import { type Page } from "@/data/page";
import React from "react";

import { Monaco, Preview } from "./panels";

type IDEProperties = {
  page: Page;
  trySetLocalPageFromString: (pageString: string) => void;
};

export const IDE: React.FC<IDEProperties> = ({
  page,
  trySetLocalPageFromString,
}) => {
  return (
    <div className="flex h-full flex-row">
      <div className="w-1/2">
        <Monaco
          page={page}
          trySetLocalPageFromString={trySetLocalPageFromString}
        />
      </div>
      <div className="w-1/2">
        <Preview page={page} />
      </div>
    </div>
  );
};
