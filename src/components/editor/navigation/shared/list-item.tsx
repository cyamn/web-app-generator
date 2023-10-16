import Link from "next/link";

interface ListItemProperties {
  project: string;
  active: boolean;
  name: string;
  path: string;
}

export const ListItem: React.FC<ListItemProperties> = ({
  name,
  path,
  active,
  project,
}) => {
  const color = active
    ? " bg-blue-100 text-blue-500"
    : " bg-white text-slate-600";

  const border = active ? "border-r-4 border-blue-500" : "";

  return (
    <div className={border}>
      <div
        className={
          "grid grid-cols-6 border-b border-l border-r border-slate-100" + color
        }
      >
        <Link
          href={`/${project}/${path}`}
          className="col-span-6 items-center  p-2"
        >
          <span className="mx-1 text-base font-medium">{name}</span>
        </Link>
      </div>
    </div>
  );
};
