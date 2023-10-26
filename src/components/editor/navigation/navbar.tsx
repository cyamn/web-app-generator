import Link from "next/link";

import { getServerSidePageList } from "@/utils/get-serverside";

type NavbarProperties = {
  project: string;
  pagePath?: string;
};

export const Navbar: React.FC<NavbarProperties> = async ({
  project,
  pagePath = "",
}) => {
  const pagesWithMeta = await getServerSidePageList(project, false);

  return (
    <nav className="flex w-full flex-row justify-items-center gap-3 overflow-x-auto">
      {pagesWithMeta.map((page, id) => (
        <Link
          className="flex max-w-[6rem] flex-col justify-center truncate whitespace-nowrap hover:underline"
          key={id}
          href={`/${project}/page/${page.path}`}
        >
          <p className="truncate">{page.name}</p>
        </Link>
      ))}
    </nav>
  );
};
