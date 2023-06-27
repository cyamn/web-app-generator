"use client";
import { FC } from "react";

type ErrorProperties = {
  error: Error;
  reset: () => void;
};

const error: FC<ErrorProperties> = ({ error, reset }) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-3xl text-red-500">{error.message}</div>
      <button
        onClick={() => {
          reset();
        }}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
      >
        Reset
      </button>
    </div>
  );
};

export default error;
