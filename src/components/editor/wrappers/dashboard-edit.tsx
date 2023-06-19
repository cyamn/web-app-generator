import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Dashboard, DashboardRender } from "@/data/dashboard/library/dashboard";
import { HorizontalStack, Stack } from "@/layout";

type DashboardEditProperties = {
  dashboard: Dashboard;
  index: number;
  active: boolean;
  showBorders: boolean;
};

export const DashboardEdit: React.FC<DashboardEditProperties> = ({
  active,
  dashboard,
  index,
  showBorders,
}) => {
  const border = active
    ? "rounded-r-lg border-2 border-slate-800"
    : "rounded-r-lg border-2 border-slate-300";
  return (
    <div className="my-1 cursor-pointer">
      <HorizontalStack>
        <NameTag visible={showBorders} name={dashboard.type} active={active} />
        <div
          key={dashboard.type}
          className={`w-full ${showBorders ? border : ""} ${
            active ? "shadow-xl" : ""
          }`}
        >
          <DashboardRender dashboard={dashboard} index={index} />
        </div>
      </HorizontalStack>
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
      <Stack>
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
      </Stack>
    </div>
  );
};
