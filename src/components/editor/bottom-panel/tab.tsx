type TabProperties = {
  activeTab: number;
  setTab: (tab: number) => void;
  visibilty: boolean;
  setVisibility: (visibility: boolean) => void;
  tab: string;
  id: number;
};

export const Tab: React.FC<TabProperties> = ({
  setTab,
  activeTab,
  tab,
  visibilty,
  setVisibility,
  id,
}) => {
  if (activeTab === id)
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
        setTab(id);
        setVisibility(true);
      }}
      className="cursor-pointer border-b-4 border-transparent hover:border-blue-500"
    >
      {tab}
    </div>
  );
};
