type TabProperties = {
  activeTab: string;
  setTab: (tab: string) => void;
  visibilty: boolean;
  setVisibility: (visibility: boolean) => void;
  tab: string;
};

export const Tab: React.FC<TabProperties> = ({
  setTab,
  activeTab,
  tab,
  visibilty,
  setVisibility,
}) => {
  if (activeTab === tab)
    return (
      <div
        onClick={() => {
          setVisibility(!visibilty);
        }}
        className="cursor-pointer border-b-4 border-blue-500 font-bold"
      >
        {tab}
      </div>
    );
  return (
    <div
      onClick={() => {
        setTab(tab);
        setVisibility(true);
      }}
      className="cursor-pointer border-b-4 border-transparent hover:border-blue-500"
    >
      {tab}
    </div>
  );
};
