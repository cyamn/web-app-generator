import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";

import { type Page } from "@/data/page";
import { api } from "@/utils/api";

type PageListProperties = {
  projectName: string;
  pagePath?: string;
};

export const PageList: React.FC<PageListProperties> = ({
  projectName,
  pagePath = "",
}) => {
  const {
    data: pagesWithMeta,
    error,
    isError,
    isLoading,
  } = api.pages.listAll.useQuery(projectName);

  const context = api.useContext();
  const { mutate, isLoading: isCreating } = api.pages.add.useMutation({
    onSuccess: () => {
      void context.pages.listAll.invalidate(projectName);
      void context.pages.getAll.invalidate(projectName);
    },
  });

  if (isError) return <div>{error.message}</div>;
  if (isLoading) return <div>loading</div>;

  const addPage = (): void => {
    const pageName = prompt("Please enter your page name:", "my new page");
    if (pageName === null) return;
    mutate({ projectName, pageName });
  };

  return (
    <>
      <nav className="flex h-full flex-col overflow-scroll p-1">
        {pagesWithMeta.map((page, id) => (
          <PageItem key={id} page={page} active={pagePath === page.path} />
        ))}
      </nav>
      <a
        onClick={addPage}
        className="m-1 flex cursor-pointer items-center rounded-lg px-4 py-3 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      >
        <FontAwesomeIcon icon={faPlus} />
        <button disabled={isCreating} className="ml-3 text-sm font-medium">
          {isCreating ? "adding ..." : "add page"}
        </button>
      </a>
    </>
  );
};

interface PageItemProperties {
  active: boolean;
  page: Pick<Page, "name" | "path">;
}

type PageRoutes = {
  project: string;
  page: string;
};

export const PageItem: React.FC<PageItemProperties> = ({ page, active }) => {
  const router = useRouter();
  const { project: projectName } = router.query as PageRoutes;
  const shadow = active
    ? " text-green-900 bg-gradient-to-r from-teal-400 to-emerald-400"
    : " bg-slate-600 text-slate-200";

  return (
    <div className={"m-[1px] grid grid-cols-6 rounded-lg" + shadow}>
      <Link
        href={`/${projectName}/page/${page.path}`}
        className="col-span-6 items-center  p-2"
      >
        <span className="mx-1 text-base font-medium">
          {" "}
          {page.name} {}
        </span>
      </Link>
    </div>
  );
};
