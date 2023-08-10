import { Header } from "@/components/header";
import { Layout } from "@/layout";

const Page = () => {
  return (
    <Layout
      header={
        <Header item={<div className="flex flex-row items-center">Apps</div>} />
      }
      content={<div className="h-full bg-white px-64"></div>}
    />
  );
};

export default Page;
