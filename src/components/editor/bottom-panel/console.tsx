import React, { useEffect, useRef } from "react";

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

// e.g. replace "/n" with <br />,...
function stringToJSX(inputString: string): React.JSX.Element {
  const sub = inputString.replaceAll(" ", "\u00A0");
  const lines = sub.split("\n");

  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index !== lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
}
