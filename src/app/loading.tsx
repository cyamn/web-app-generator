import { Header } from "@/components/header";
import { ViewList } from "@/components/navigation";
import { OverviewSkeleton, SkeletonList } from "@/components/skeletons";
import { Layout } from "@/layout";

const Page = () => {
  return (
    <Layout
      header={
        <Header item={<div className="flex flex-row items-center">app</div>} />
      }
      sidebarLeft={
        <div className="flex h-full flex-row">
          <ViewList activeView={"page"} projectName={"loading"} />
          <div className="flex h-full w-full flex-col justify-between bg-slate-700">
            <SkeletonList />
          </div>
        </div>
      }
      content={<OverviewSkeleton />}
    />
  );
};

export default Page;
