import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faCog,
  faFile,
  faSignsPost,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ViewListProperties = {
  activeView: string;
  projectName: string;
};

export const ViewList: React.FC<ViewListProperties> = ({
  activeView,
  projectName,
}) => {
  return (
    <div className="z-10 flex h-full w-11 flex-col justify-between border-r border-slate-300 bg-white pt-1 text-slate-800 shadow-xl">
      <nav className="flex h-full flex-col overflow-auto px-[2px]">
        <ViewItem
          icon={faCog}
          view={"settings"}
          activeView={activeView}
          projectName={projectName}
        />
        <ViewItem
          icon={faFile}
          view={"page"}
          activeView={activeView}
          projectName={projectName}
        />
        <ViewItem
          icon={faTable}
          view={"table"}
          activeView={activeView}
          projectName={projectName}
        />
        <ViewItem
          icon={faSignsPost}
          view={"api"}
          activeView={activeView}
          projectName={projectName}
        />
      </nav>
    </div>
  );
};

type ViewItemProperties = {
  icon: IconDefinition;
  view: string;
  activeView: string;
  projectName: string;
};

const ViewItem: React.FC<ViewItemProperties> = ({
  icon,
  view,
  activeView,
  projectName,
}) => {
  const active = activeView === view;
  const style = active
    ? " bg-blue-100 rounded-xl text-blue-500"
    : " bg-white text-slate-600";
  return (
    <a
      className={"mb-1 h-10 w-10 pt-2 text-center " + style}
      href={`/${projectName}/${view}`}
    >
      <FontAwesomeIcon className="text-2xl" icon={icon} />
    </a>
  );
};
