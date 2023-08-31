import {
  faCode,
  faCog,
  faEye,
  faFile,
  faWandMagicSparkles,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

type TabProperties = {
  mode: PageMode;
  icon?: IconDefinition;
  first?: boolean;
  last?: boolean;
  active: boolean;
  base: string;
};

const Tab: React.FC<TabProperties> = ({
  mode,
  first = false,
  last = false,
  icon = faFile,
  active,
  base,
}) => {
  const backgroundColor = active
    ? " bg-blue-100 text-blue-500 border border-blue-500"
    : " bg-white text-slate-600 border border-slate-300";

  const rightS = first ? " rounded-l-lg" : "";
  const leftS = last ? " rounded-r-lg" : "";
  return (
    <li className="m-[2px] w-full">
      <Link href={`${base}/${mode}`}>
        <button
          className={
            "inline-block w-full p-[3px]" + backgroundColor + rightS + leftS
          }
        >
          <FontAwesomeIcon className="text-xl" icon={icon} />
        </button>
      </Link>
    </li>
  );
};

export enum PageMode {
  Settings = "settings",
  JSON = "json",
  Edit = "edit",
  Preview = "preview",
}

type TabsProperties = {
  mode: PageMode;
  base: string;
};

export const Tabs: React.FC<TabsProperties> = ({ mode, base }) => {
  return (
    <div className="absolute left-0 top-1 flex w-full justify-center text-center">
      <ul className="hidden w-1/2 rounded-lg text-center sm:flex">
        <Tab
          mode={PageMode.Settings}
          icon={faCog}
          first
          active={mode === PageMode.Settings}
          base={base}
        />
        <Tab
          mode={PageMode.JSON}
          icon={faCode}
          active={mode === PageMode.JSON}
          base={base}
        />
        <Tab
          mode={PageMode.Edit}
          icon={faWandMagicSparkles}
          active={mode === PageMode.Edit}
          base={base}
        />
        <Tab
          mode={PageMode.Preview}
          icon={faEye}
          last
          active={mode === PageMode.Preview}
          base={base}
        />
      </ul>
    </div>
  );
};
