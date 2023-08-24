import { useState } from "react";

import { PanelContent } from "./content";
import { PanelHeader } from "./header";

type BottomPanelProperties = {
  tabNames: string[];
  tabs: (React.ReactNode | undefined)[];
};

export const BottomPanel: React.FC<BottomPanelProperties> = ({
  tabNames,
  tabs,
}) => {
  const [visibility, setVisibility] = useState(false);
  const [tab, setTab] = useState(0);

  if (!visibility) {
    return (
      <PanelHeader
        activeTab={tab}
        setTab={setTab}
        tabNames={tabNames}
        tabs={tabs}
        visibilty={visibility}
        setVisibility={setVisibility}
      />
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-slate-50">
      <div className="border-b border-slate-300">
        <PanelHeader
          activeTab={tab}
          setTab={setTab}
          tabNames={tabNames}
          tabs={tabs}
          visibilty={visibility}
          setVisibility={setVisibility}
        />
      </div>
      <div className="h-full overflow-scroll">
        <PanelContent activeTab={tab} tabNames={tabNames} tabs={tabs} />
      </div>
    </div>
  );
};
