"use client";

import React from "react";

import { SkeletonText } from "./text";

export const SkeletonTableView: React.FC = () => {
  return (
    <div className="">
      <div className="max-h-full overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-left text-sm text-slate-500">
          <thead className="sticky top-0 bg-slate-50 text-xs uppercase text-slate-700">
            <tr>
              {[...Array.from({ length: 3 }).keys()].map((index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 font-medium tracking-wider"
                >
                  <SkeletonText index={index} className="bg-slate-300" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {[...Array.from({ length: 3 }).keys()].map((index) => (
              <tr key={index} className="border-b  bg-white">
                {[...Array.from({ length: 3 }).keys()].map((index_) => (
                  <td key={index_} className="px-6 py-4">
                    <SkeletonText
                      index={index + index_ + 9}
                      className="bg-slate-100"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
