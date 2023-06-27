export const OverviewSkeleton: React.FC = () => {
  return (
    <>
      <h1 className="p-3 text-center">All Pages in app</h1>
      <div className="grid grid-cols-3 px-20">
        {/* Skeleton loaders */}
        {Array.from({ length: 6 }).map((_, id) => (
          <SkeletonPageCard key={id} />
        ))}
      </div>
    </>
  );
};

const SkeletonPageCard: React.FC = () => (
  <div className="m-2">
    <div className="grid w-full grid-cols-2">
      <div>
        <div className="flex animate-pulse space-x-4">
          <div className="flex-1 py-1">
            <div className="h-4 w-1/4"></div>
          </div>
          <div className="flex-1 py-1">
            <div className="h-4 w-1/3"></div>
          </div>
        </div>
      </div>
      <div className="pr-2 text-right text-slate-400">
        <div className="h-4 w-1/4"></div>
      </div>
    </div>
    <div className="h-64 overflow-scroll overflow-x-hidden rounded-lg border border-slate-300 bg-gray-200"></div>
  </div>
);
