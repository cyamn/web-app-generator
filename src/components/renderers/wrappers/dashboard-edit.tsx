import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DashboardFactory } from "dashboards/factory";

import { type Dashboard } from "@/data/dashboard/library/dashboard";

type DashboardEditProperties = {
  dashboard: Dashboard;
  index: number;
  active: boolean;
  showBorders: boolean;
  project: string;
};

export const DashboardEdit: React.FC<DashboardEditProperties> = ({
  active,
  dashboard,
  index,
  showBorders,
  project,
}) => {
  const border = active
    ? "rounded-r-lg border-2 border-slate-800"
    : "rounded-r-lg border-2 border-slate-300";

  const dash = DashboardFactory(dashboard, {
    projectId: project,
  });
  return (
    <div className="my-1 cursor-pointer">
      <div className="flex flex-row">
        <NameTag visible={showBorders} name={dashboard.type} active={active} />
        <div
          key={dashboard.type}
          className={`w-full ${showBorders ? border : ""} ${
            active ? "shadow-xl" : ""
          }`}
        >
          {dash.render()}
        </div>
      </div>
    </div>
  );
};

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
