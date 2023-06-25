import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import { Project } from "@/data/project";

dayjs.extend(relativeTime);

type ProjectCardProperties = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProperties> = ({ project }) => {
  return (
    <Link href={`/${project.name}/page`}>
      <div className="m-3 grid h-48 min-h-min select-none place-items-center rounded-md bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-500 text-center text-3xl font-bold text-slate-100 hover:bg-gradient-to-tl">
        <div>{dayjs(project.updatedAt).fromNow()}</div>
        <div className="text-5xl">{project.name}</div>
        <div>{project.description}</div>
      </div>
    </Link>
  );
};
