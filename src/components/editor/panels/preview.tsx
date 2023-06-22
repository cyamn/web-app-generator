import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { DashboardRenderer } from "@/components/renderers/dashboard";
import { type Page } from "@/data/page";

type NameTagProperties = {
  visible: boolean;
  name: string;
  active: boolean;
};

const NameTag: React.FC<NameTagProperties> = ({ visible, name, active }) => {
  if (!visible) return null;
  const colors = active
    ? "bg-slate-800 text-slate-300"
    : "bg-slate-300 text-slate-800";
  return (
    <div className={"w-10 rounded-l-lg  py-[2px] " + colors}>
      <div className="flex flex-col">
        <FontAwesomeIcon className="text-2xl" icon={faMarkdown} />
        <div
          className="py-1 pr-2 font-mono uppercase"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright",
            // less gap between letters
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
  setDashboardIndex?: (index: number) => void;
  index?: number;
  projectName: string;
};

export const Preview: React.FC<PreviewProperties> = ({
  page,
  showBorders = false,
  setDashboardIndex = (_) => {
    return;
  },
  index = -1,
  projectName,
}) => {
  return (
    <div className="flex h-full flex-col overflow-scroll p-4 font-sans leading-normal tracking-normal">
      {page.dashboards.map((dashboard, id) => {
        const active = id === index;
        const border = active
          ? "rounded-r-lg border-2 border-slate-800"
          : "rounded-r-lg border-2 border-slate-300";
        return (
          <div
            key={id}
            className="my-1 cursor-pointer"
            onClick={() => {
              setDashboardIndex(id);
            }}
          >
            <div className="flex flex-row">
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
                <DashboardRenderer
                  dashboard={dashboard}
                  index={index}
                  projectName={projectName}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
