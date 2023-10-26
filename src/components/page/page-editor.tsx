"use client";

import { IconDefinition } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

import { DashboardDefinition, Dashboards } from "@/components/dashboards";
import { IDashboard } from "@/components/dashboards/definitions/dashboard-interface";
import { DashboardFactory } from "@/components/dashboards/factory";
import { type Page } from "@/data/page";
import { api } from "@/utils/api";
import { hydratePage } from "@/utils/hydrate-page";

export const PageEditor: React.FC<PageEditorProperties> = ({
  page,
  index = -1,
  setIndex = () => {
    return;
  },
  project,
  addDashboard,
}) => {
  const [localPage, setLocalPage] = useState<Page>(page);
  const [hydrated, setHydrated] = useState(false);

  const { data, isLoading, isError } = api.variables.calculate.useQuery({
    variables: page.variables ?? {},
    project,
    page,
  });

  useEffect(() => {
    setHydrated(false);
  }, [page]);

  if (!hydrated && !isLoading && !isError) {
    setHydrated(true);
    setLocalPage(hydratePage(page, data));
  }

  return (
    <div className="flex h-full flex-col overflow-auto p-4 font-sans leading-normal tracking-normal">
      {localPage.dashboards.map((dashboard, id) => {
        const dash = DashboardFactory(dashboard, {
          projectId: project,
        });
        return (
          <DashboardDecorator
            key={id}
            dashboard={dashboard}
            index={index}
            setIndex={setIndex}
            addDashboard={addDashboard}
            id={id}
            project={project}
            dash={dash}
          >
            {dash.render()}
          </DashboardDecorator>
        );
      })}
      {localPage.dashboards.length === 0 && (
        <div className="h-32 w-full">
          <h1 className="mb-10 w-full p-2 text-center">Start your page here</h1>
          <div className="-mx-1 flex flex-row py-1 text-3xl text-slate-800">
            <AddDashboardCard
              id={0}
              project={project}
              addDashboard={addDashboard}
            />
          </div>
        </div>
      )}
      <div className="py-10"></div>
    </div>
  );
};

type NameTagProperties = {
  name: string;
  active: boolean;
  icon?: IconDefinition;
};

const NameTag: React.FC<NameTagProperties> = ({ name, active, icon }) => {
  const colors = active
    ? "bg-blue-100 text-blue-500 shadow-lg border border-blue-500"
    : "bg-white text-slate-500 shadow-lg border border-slate-300";
  return (
    <div className={"w-10 rounded-l-lg  py-[2px] " + colors}>
      <div className="flex flex-col">
        {icon && <FontAwesomeIcon className="pt-1 text-2xl" icon={icon} />}
        <div
          className="py-1 pr-2 font-mono uppercase"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
            letterSpacing: "-0.1em",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

type PageEditorProperties = {
  page: Page;
  index?: number;
  setIndex?: (index: number) => void;
  project: string;
  addDashboard: (index: number, dashboard: DashboardDefinition) => void;
};

const DashboardDecorator: React.FC<{
  dashboard: DashboardDefinition;
  dash: IDashboard<unknown>;
  index: number;
  setIndex: (index: number) => void;
  addDashboard: (index: number, dashboard: DashboardDefinition) => void;
  id: number;
  project: string;
  children?: React.ReactNode;
}> = ({
  dashboard,
  index,
  setIndex,
  addDashboard,
  id,
  project,
  children,
  dash,
}) => {
  const active = id === index;
  const border = active
    ? "rounded-r-lg border border-blue-500"
    : "rounded-r-lg border border-slate-300";

  return (
    <div key={id} className="cursor-pointer">
      <div
        className="flex flex-row"
        onClick={() => {
          setIndex(id);
        }}
      >
        <NameTag
          name={dashboard.type}
          icon={dash.getMetaData().icon}
          active={active}
        />
        <div
          key={dashboard.type}
          className={`w-full pl-2 ${border} ${active ? "shadow-xl" : ""}`}
        >
          {children}
        </div>
      </div>
      <div className="group h-2 w-full hover:h-min">
        <div className="-mx-1 hidden flex-row py-1 text-3xl text-slate-800 group-hover:flex">
          <AddDashboardCard
            id={id}
            project={project}
            addDashboard={addDashboard}
          />
        </div>
      </div>
    </div>
  );
};

type AddDashboardCardProperties = {
  id: number;
  project: string;
  addDashboard: (index: number, dashboard: DashboardDefinition) => void;
};

export const AddDashboardCard: React.FC<AddDashboardCardProperties> = ({
  id,
  project,
  addDashboard,
}) => {
  return (
    <>
      {Object.entries(Dashboards).map(([type, dashboard]) => {
        const dash = DashboardFactory({ type }, { projectId: project });
        return (
          <button
            key={type}
            className="mx-1 w-full rounded-md border border-slate-300 bg-white p-1 hover:border-blue-500 hover:bg-blue-100 hover:text-blue-500"
            onClick={() => {
              addDashboard(id + 1, {
                type,
                parameters: dash.getParameters(),
              });
            }}
          >
            +<FontAwesomeIcon icon={dash.getMetaData().icon} />
          </button>
        );
      })}
    </>
  );
};
