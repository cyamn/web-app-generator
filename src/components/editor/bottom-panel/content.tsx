import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PanelContentProperties = {
  activeTab: number;
  tabNames: string[];
  tabs: (React.ReactNode | undefined)[];
};

export const PanelContent: React.FC<PanelContentProperties> = ({
  activeTab,
  tabNames,
  tabs,
}) => {
  return tabs[activeTab] === undefined ? (
    <ToBeDonePanel activeTab={tabNames[activeTab] ?? "unknown"} />
  ) : (
    (tabs[activeTab] as React.ReactElement)
  );
};

type ToBeDonePanelProperties = {
  activeTab: string;
};

export const ToBeDonePanel: React.FC<ToBeDonePanelProperties> = ({
  activeTab,
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-slate-500">
      <div className="text-2xl font-bold">To be done</div>
      <FontAwesomeIcon className="text-7xl" icon={faHammer} />
      <div className="text-xl">
        The {activeTab} panel is not yet implemented.
      </div>
    </div>
  );
};
