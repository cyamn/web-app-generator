"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import { Page } from "@/data/page";
import { api } from "@/utils/api";

type SettingsProperties = {
  page: Page;
  project: string;
};

export const Settings: React.FC<SettingsProperties> = ({ page, project }) => {
  const [isPublic, setIsPublic] = useState<boolean>(page.public ?? false);
  const { mutate, isLoading, isError } =
    api.settings.setPagePublic.useMutation();

  function togglePublic() {
    setIsPublic(!isPublic);
    mutate({ project, pagePath: page.path, public: isPublic });
    toast.success(
      `Set page ${page.name} to ${isPublic ? "public" : "private"}!`
    );
  }

  return (
    <div className="p-5">
      <div className="text-6xl">Settings</div>
      <br />
      <table className="w-full overflow-hidden rounded-lg bg-slate-50 shadow-md">
        <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
          <td className="w-52 px-6 py-2">Page Name:</td>
          <td className="w-max px-4 py-2">{page.name}</td>
        </tr>
        <tr className="w-full border-b bg-white p-10 hover:bg-slate-50">
          <td className="w-52 px-6 py-2">Public</td>
          <td className="w-max px-4 py-2">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={!isPublic}
                className="peer sr-only"
                onClick={togglePublic}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute  after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4  peer-focus:ring-blue-300"></div>
            </label>
          </td>
        </tr>
      </table>
    </div>
  );
};