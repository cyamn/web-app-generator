import { Header } from "@/components/header";
import { Layout } from "@/layout";

const Page = () => {
  return (
    <Layout
      header={
        <Header item={<div className="flex flex-row items-center">Apps</div>} />
      }
      content={
        <div className="h-full bg-gradient-to-b from-slate-600 to-slate-800 px-64"></div>
      }
    />
  );
};

export default Page;
