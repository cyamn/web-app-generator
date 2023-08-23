import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PanelContentProperties = {
  activeTab: string;
};

export const PanelContent: React.FC<PanelContentProperties> = ({
  activeTab,
}) => {
  switch (activeTab) {
    default: {
      return <ToBeDonePanel activeTab={activeTab} />;
    }
  }
};

export const ToBeDonePanel: React.FC<PanelContentProperties> = ({
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
