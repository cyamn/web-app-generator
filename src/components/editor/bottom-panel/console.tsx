import React, { useEffect, useRef } from "react";

import { stringToJSX } from "@/utils/string-to-jsx";

export type LogMessage = {
  message: string;
  type: string;
  amount?: number;
};

export type ConsoleProperties = {
  messages: LogMessage[];
};

export const Console: React.FC<ConsoleProperties> = ({ messages }) => {
  const reference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      reference.current?.scrollIntoView({
        // behavior: "smooth",
        behavior: "instant",
        block: "end",
      });
    }
  }, [messages.length]);

  const colors = new Map<string, string>([
    ["info", "text-slate-100"],
    ["success", "text-green-300"],
    ["error", "text-red-300"],
  ]);

  return (
    <div className="flex h-full w-full flex-col overflow-auto bg-slate-900 p-4 font-mono text-slate-100">
      {messages.map(({ message, type, amount }, index) => (
        <div key={index} className={colors.get(type)}>
          {stringToJSX(message)} {amount === undefined ? "" : `(x${amount})`}
        </div>
      ))}
      <div className="py-8" ref={reference}></div>
    </div>
  );
};
