"use client";

import React from "react";

import { firstNCharsUpperCase } from "@/utils/name-to-first";
import { stringToHex } from "@/utils/name-to-hex";

type ProjectAvatarProperties = {
  projectName: string;
  projectID: string;
  size?: number;
};

export const ProjectAvatar: React.FC<ProjectAvatarProperties> = ({
  projectName,
  projectID,
  size = 32,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: stringToHex(projectID),
        fontSize: size / 2.5,
        color: "white",
      }}
    >
      {/* center horizontally and vertically */}
      <span
        className="
        flex
        h-full
        w-full
        items-center
        justify-center
      "
      >
        {/* first 2 chars of name in capital case e.g.: test -> TE, foo -> FO */}
        {firstNCharsUpperCase(projectName, 3)}
      </span>
    </div>
  );
};
