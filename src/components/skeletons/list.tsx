export const SkeletonList: React.FC = () => {
  return (
    <>
      <nav className="flex h-full flex-col overflow-auto p-1">
        {/* Skeleton loader */}
        {Array.from({ length: 5 }).map((_, id) => (
          <SkeletonPageItem key={id} />
        ))}
      </nav>
    </>
  );
};

// SkeletonPageItem component for the loading state
const SkeletonPageItem: React.FC = () => (
  <div className="m-[1px] grid animate-pulse grid-cols-6 rounded-lg bg-slate-600">
    <div className="col-span-6 items-center p-2">
      <span className="mx-1 text-base font-medium">&nbsp;</span>
    </div>
  </div>
);
