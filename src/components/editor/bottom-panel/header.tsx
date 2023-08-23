import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Tabs } from "./panel";
import { Tab } from "./tab";

type PanelHeaderProperties = {
  activeTab: string;
  setTab: (tab: string) => void;
  visibilty: boolean;
  setVisibility: (visibility: boolean) => void;
};

export const PanelHeader: React.FC<PanelHeaderProperties> = ({
  activeTab,
  setTab,
  visibilty,
  setVisibility,
}) => {
  return (
    <div className="flex w-full flex-col border-t border-slate-300 bg-white p-1">
      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-row gap-4">
          {Tabs.map((tab) => {
            return (
              <Tab
                key={tab}
                setTab={setTab}
                activeTab={activeTab}
                tab={tab}
                visibilty={visibilty}
                setVisibility={setVisibility}
              />
            );
          })}
        </div>
        <FontAwesomeIcon
          className="cursor-pointer px-2 pt-1 text-xl"
          onClick={() => {
            setVisibility(!visibilty);
          }}
          icon={visibilty ? faChevronDown : faChevronUp}
        />
      </div>
    </div>
  );
};
