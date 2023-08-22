import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { faKeyboard, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { DashboardRender } from "@/components/renderers/dashboard";
import {
  Dashboard,
  DashboardTypeToIcon,
} from "@/data/dashboard/library/dashboard";
import { defaultDatabaseInputForm } from "@/data/dashboard/library/database-input-form";
import { defaultDatabaseView } from "@/data/dashboard/library/database-view";
import { defaultMarkdown } from "@/data/dashboard/library/markdown";
import { type Page } from "@/data/page";
import { hydratePage } from "@/utils/hydrate-page";

type NameTagProperties = {
  visible: boolean;
  name: string;
  active: boolean;
};

const NameTag: React.FC<NameTagProperties> = ({ visible, name, active }) => {
  if (!visible) return null;
  const colors = active
    ? "bg-blue-100 text-blue-500 shadow-lg border border-blue-500"
    : "bg-white text-slate-500 shadow-lg border border-slate-300";
  return (
    <div className={"w-10 rounded-l-lg  py-[2px] " + colors}>
      <div className="flex flex-col">
        <FontAwesomeIcon
          className="pt-1 text-2xl"
          icon={
            DashboardTypeToIcon[name as keyof typeof DashboardTypeToIcon] ?? ""
          }
        />
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

type PreviewProperties = {
  page: Page;
  showBorders?: boolean;
  index?: number;
  setIndex?: (index: number) => void;
  projectName: string;
  addDashboard: (index: number, dashboard: Dashboard) => void;
};

export const Preview: React.FC<PreviewProperties> = ({
  page,
  showBorders = false,
  index = -1,
  setIndex = (index: number) => {
    return;
  },
  projectName,
  addDashboard,
}) => {
  const page_ = hydratePage(page, page.variables ?? {});

  return (
    <div className="flex h-full flex-col overflow-auto p-4 font-sans leading-normal tracking-normal">
      {page_.dashboards.map((dashboard, id) => {
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
                visible={showBorders}
                name={dashboard.type}
                active={active}
              />
              <div
                key={dashboard.type}
                className={`w-full ${showBorders ? border : ""} ${
                  active ? "shadow-xl" : ""
                }`}
              >
                <DashboardRender
                  dashboard={dashboard}
                  index={index}
                  projectName={projectName}
                />
              </div>
            </div>
            <div className="group h-2 w-full hover:h-min">
              <div className="-mx-1 hidden flex-row py-1 text-3xl text-slate-800 group-hover:flex">
                <button
                  className="mx-1 w-full rounded-md border border-slate-300 bg-white p-1 hover:border-blue-500 hover:bg-blue-100 hover:text-blue-500"
                  onClick={() => {
                    addDashboard(id + 1, defaultMarkdown);
                  }}
                >
                  +<FontAwesomeIcon icon={faMarkdown} />
                </button>
                <button
                  className="mx-1 w-full rounded-md border border-slate-300 bg-white p-1 hover:border-blue-500 hover:bg-blue-100 hover:text-blue-500"
                  onClick={() => {
                    addDashboard(id + 1, defaultDatabaseView);
                  }}
                >
                  +<FontAwesomeIcon icon={faTable} />
                </button>
                <button
                  className="mx-1 w-full rounded-md border border-slate-300 bg-white p-1 hover:border-blue-500 hover:bg-blue-100 hover:text-blue-500"
                  onClick={() => {
                    addDashboard(id + 1, defaultDatabaseInputForm);
                  }}
                >
                  +<FontAwesomeIcon icon={faKeyboard} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div className="py-10"></div>
    </div>
  );
};
