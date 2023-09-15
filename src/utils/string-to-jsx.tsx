import React from "react";

// e.g. replace "/n" with <br />,...
export function stringToJSX(inputString: string): React.JSX.Element {
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
