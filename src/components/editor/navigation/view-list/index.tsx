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
  project: string;
};

export const ViewList: React.FC<ViewListProperties> = ({
  activeView,
  project,
}) => {
  return (
    <div className="z-10 flex h-full w-11 flex-col justify-between border-r border-slate-300 bg-white pt-1 text-slate-800 shadow-xl">
      <nav className="flex h-full flex-col overflow-auto px-[2px]">
        <ViewItem
          icon={faCog}
          view={"settings"}
          activeView={activeView}
          project={project}
        />
        <ViewItem
          icon={faFile}
          view={"page"}
          activeView={activeView}
          project={project}
        />
        <ViewItem
          icon={faTable}
          view={"table"}
          activeView={activeView}
          project={project}
        />
        <ViewItem
          icon={faSignsPost}
          view={"api"}
          activeView={activeView}
          project={project}
        />
      </nav>
    </div>
  );
};

type ViewItemProperties = {
  icon: IconDefinition;
  view: string;
  activeView: string;
  project: string;
};

const ViewItem: React.FC<ViewItemProperties> = ({
  icon,
  view,
  activeView,
  project,
}) => {
  const active = activeView === view;
  const style = active
    ? " bg-blue-100 rounded-xl text-blue-500"
    : " bg-white text-slate-600";
  return (
    <a
      className={"mb-1 h-10 w-10 pt-2 text-center " + style}
      href={`/${project}/${view}`}
    >
      <FontAwesomeIcon className="text-2xl" icon={icon} />
    </a>
  );
};
