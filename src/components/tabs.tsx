import {
  faCode,
  faEye,
  faFile,
  faWandMagicSparkles,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import { PageMode } from "@/data/state";
import Link from "next/link";

type TabProperties = {
  mode: PageMode;
  icon?: IconDefinition;
  first?: boolean;
  last?: boolean;
  active: boolean;
  setPageMode: (mode: PageMode) => void;
};

const Tab: React.FC<TabProperties> = ({
  mode,
  first = false,
  last = false,
  icon = faFile,
  active,
  setPageMode,
}) => {
  const backgroundColor = active
    ? " bg-slate-200 text-slate-800"
    : " bg-slate-600 text-slate-200";

  const rightS = first ? " rounded-l-lg" : "";
  const leftS = last ? " rounded-r-lg" : "";
  return (
    <li className="m-[2px] w-full">
      <button
        onClick={() => setPageMode(mode)}
        className={
          "inline-block w-full border-2 border-slate-200 p-[3px]" +
          backgroundColor +
          rightS +
          leftS
        }
      >
        <FontAwesomeIcon className="text-xl" icon={icon} />
      </button>
    </li>
  );
};

type TabsProperties = {
  pageMode: PageMode;
  setPageMode: (mode: PageMode) => void;
};

export const Tabs: React.FC<TabsProperties> = ({ pageMode, setPageMode }) => {
  return (
    <div className="text-center">
      <ul className="hidden rounded-lg text-center shadow sm:flex">
        <Tab
          mode={PageMode.JSON}
          icon={faCode}
          first
          active={pageMode === PageMode.JSON}
          setPageMode={setPageMode}
        />
        <Tab
          mode={PageMode.Edit}
          icon={faWandMagicSparkles}
          active={pageMode === PageMode.Edit}
          setPageMode={setPageMode}
        />
        <Tab
          mode={PageMode.Preview}
          icon={faEye}
          last
          active={pageMode === PageMode.Preview}
          setPageMode={setPageMode}
        />
      </ul>
    </div>
  );
};
