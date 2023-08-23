import { useState } from "react";

import { PanelContent } from "./content";
import { PanelHeader } from "./header";

export const Tabs = ["Variables", "Tables"];

export const BottomPanel: React.FC = () => {
  const [visibility, setVisibility] = useState(false);
  const [tab, setTab] = useState(Tabs[0] ?? "");

  if (!visibility) {
    return (
      <PanelHeader
        activeTab={tab}
        setTab={setTab}
        visibilty={visibility}
        setVisibility={setVisibility}
      />
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50">
      <div className="border-b border-slate-300">
        <PanelHeader
          activeTab={tab}
          setTab={setTab}
          visibilty={visibility}
          setVisibility={setVisibility}
        />
      </div>
      <div className="h-full overflow-scroll">
        <PanelContent activeTab={tab} />
      </div>
    </div>
  );
};
