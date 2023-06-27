"use client";

import React from "react";

const randomNumbers = [
  98, 53, 56, 12, 67, 2, 92, 10, 69, 97, 42, 33, 77, 31, 54, 13, 41, 22, 26, 35,
  16, 17, 9, 80, 99, 35, 58, 91, 49, 27, 53, 73, 41, 62, 95, 84, 45, 43, 49, 52,
  73, 71, 81, 61, 82, 57, 87, 99, 99, 38, 30, 15, 74, 39, 52, 1, 77, 46, 99, 45,
  95, 38, 16, 77, 16, 73, 60, 89, 22, 30, 99, 96, 91, 6, 69, 12, 81, 4, 35, 75,
  51, 64, 51, 85, 32, 48, 85, 20, 88, 99, 12, 96, 48, 57, 19, 100, 32, 53, 4,
  28,
];

export const SkeletonText: React.FC<{ index: number; className: string }> = ({
  index,
  className,
}) => {
  return (
    <div
      style={{
        width: `${randomNumbers[index % randomNumbers.length] ?? "50"}%`,
      }}
      className={"animate-pulse rounded-lg  py-3 " + className}
    ></div>
  );
};
