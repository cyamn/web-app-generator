import { PageMode } from "@/components/tabs";
import { getServerSidePageList } from "@/utils/get-serverside";

import { ListItem } from "../shared/list-item";
import { AddPageButton } from "./add-page-button";

type PageListProperties = {
  project: string;
  pagePath?: string;
};

export const PageList: React.FC<PageListProperties> = async ({
  project,
  pagePath = "",
}) => {
  const pagesWithMeta = await getServerSidePageList(project);

  return (
    <div className="flex h-full w-36 flex-col justify-between border-r border-slate-300 bg-white">
      <nav className="flex h-full flex-col overflow-auto">
        {pagesWithMeta.map((page, id) => (
          <ListItem
            key={id}
            name={page.name}
            path={`page/${page.path}/${PageMode.Preview}`}
            project={project}
            active={pagePath === page.path}
          />
        ))}
      </nav>
      <AddPageButton project={project} />
    </div>
  );
};
