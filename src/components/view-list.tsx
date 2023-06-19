import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFile, faTable } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ViewItemProperties = {
  icon: IconDefinition;
  view: string;
  activeView: string;
};

const ViewItem: React.FC<ViewItemProperties> = ({ icon, view, activeView }) => {
  const active = activeView === view;
  const style = active
    ? "bg-slate-200 text-slate-700"
    : "bg-slate-700 text-slate-200";
  return (
    <a
      className={"mb-2 h-12 w-12 rounded-lg p-1 pt-2 text-center " + style}
      href={`/#/${view}`}
    >
      <FontAwesomeIcon className="text-3xl" icon={icon} />
    </a>
  );
};

type ViewListProperties = {
  activeView: string;
};

export const ViewList: React.FC<ViewListProperties> = ({ activeView }) => {
  return (
    <div className="flex h-full flex-col justify-between bg-slate-800 text-slate-400">
      <nav className="mr-1 flex h-full flex-col overflow-scroll p-1">
        <ViewItem icon={faFile} view={"pages"} activeView={activeView} />
        <ViewItem icon={faTable} view={"tables"} activeView={activeView} />
      </nav>
    </div>
  );
};
