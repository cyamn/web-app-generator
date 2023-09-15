import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Tab } from "./tab";

type PanelHeaderProperties = {
  activeTab: number;
  setTab: (tab: number) => void;
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  tabNames: string[];
};

export const PanelHeader: React.FC<PanelHeaderProperties> = ({
  activeTab,
  setTab,
  visibility,
  setVisibility,
  tabNames,
}) => {
  return (
    <div className="flex w-full flex-col border-t border-slate-300 bg-white p-1">
      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-row gap-4">
          {tabNames.map((tab, index) => {
            return (
              <Tab
                key={tab}
                setTab={setTab}
                activeTab={activeTab}
                id={index}
                tab={tab}
                visibility={visibility}
                setVisibility={setVisibility}
              />
            );
          })}
        </div>
        <div
          className="w-full"
          onClick={() => {
            setVisibility(!visibility);
          }}
        ></div>
        <FontAwesomeIcon
          className="cursor-pointer px-2 pt-1 text-xl"
          onClick={() => {
            setVisibility(!visibility);
          }}
          icon={visibility ? faChevronDown : faChevronUp}
        />
      </div>
    </div>
  );
};
