"use client";

import {
  faBolt,
  faClock,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

import { ProjectAvatar } from "@/components/editor/avatars/project";
import { UsersStack } from "@/components/editor/avatars/user";
import { Project } from "@/data/project";
import { api } from "@/utils/api";
import { stringToHex } from "@/utils/name-to-hex";

import { AddProjectButton } from "./add-project-button";

dayjs.extend(relativeTime);

type ProjectOverviewProperties = {
  projects: Project[];
};

export const ProjectOverview: React.FC<ProjectOverviewProperties> = ({
  projects,
}) => {
  return (
    <div className="grid sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3">
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
  const {
    data: admins,
    isLoading,
    isError,
  } = api.roles.getUsers.useQuery({ project: project.id, isAdmin: true });

  return (
    <Link href={`/${project.id}/page`}>
      <div
        className="m-4 flex h-48 flex-row items-center overflow-hidden rounded-xl bg-slate-50 text-slate-700 hover:scale-105"
        style={{
          border: `1px solid ${stringToHex(project.id)}`,
        }}
      >
        <div
          className="h-48 w-48 overflow-hidden rounded-xl"
          style={{
            boxShadow: `20px 0 400px 1px ${stringToHex(project.id)}`,
          }}
        >
          <ProjectAvatar
            size={196}
            projectName={project.name}
            projectID={project.id}
          />
        </div>
        <div className="flex h-full flex-col justify-between p-4 text-lg">
          <div className="text-3xl">{project.name}</div>
          <div className="flex flex-row place-items-center gap-2">
            <FontAwesomeIcon icon={faClock} />
            <div>{dayjs(project.updatedAt).fromNow()}</div>
          </div>
          <div className="flex flex-row place-items-center gap-2">
            <FontAwesomeIcon icon={faBolt} />
            <div>{project.description}</div>
          </div>
          <div className="flex flex-row place-items-center gap-2">
            <FontAwesomeIcon icon={faPeopleGroup} />
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error</div>}
            {!isLoading && !isError && <UsersStack users={admins} />}
          </div>
        </div>
      </div>
    </Link>
  );
};
