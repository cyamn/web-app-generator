import { Project } from "@/data/project";

import { AddProjectButton } from "./add-project-button";
import { ProjectCard } from "./project-card";

type ProjectListProperties = {
  projects: Project[];
};

export const ProjectList: React.FC<ProjectListProperties> = ({ projects }) => {
  return (
    <div className="h-full bg-gradient-to-b from-slate-600 to-slate-800 px-64">
      <h1 className="py-8 text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
        Your Apps
      </h1>
      <div className="grid grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
        <AddProjectButton />
      </div>
    </div>
  );
};
