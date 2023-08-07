import Avatar from "boring-avatars";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import { Project } from "@/data/project";

import { AddProjectButton } from "./add-project-button";

dayjs.extend(relativeTime);

type ProjectOverviewProperties = {
  projects: Project[];
};

export const ProjectOverview: React.FC<ProjectOverviewProperties> = ({
  projects,
}) => {
  return (
    <div className="grid grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
      <AddProjectButton />
    </div>
  );
};

type ProjectCardProperties = {
  project: Project;
};

export const ProjectCard: React.FC<ProjectCardProperties> = ({ project }) => {
  return (
    <Link href={`/${project.id}/page`}>
      <div className="m-4 flex h-48 flex-row items-center overflow-hidden rounded-xl bg-slate-50">
        <div className="h-48 w-48">
          <Avatar
            size={200}
            name={project.id}
            square={true}
            variant="bauhaus"
            colors={["#3b82f6", "#473f47", "#FFFFFF", "#68a4fd", "#E4EFFF"]}
          />
        </div>
        <div className="m-3 grid min-h-min w-full select-none place-items-center text-center text-xl font-bold text-slate-900">
          <div>{dayjs(project.updatedAt).fromNow()}</div>
          <div className="text-3xl">{project.name}</div>
          <div>{project.description}</div>
        </div>
      </div>
    </Link>
  );
};
