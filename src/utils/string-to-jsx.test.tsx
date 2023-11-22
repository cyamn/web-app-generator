import React from "react";

import { stringToJSX } from "./string-to-jsx"; // <--- function to test

describe("stringToJSX", () => {
  it("should return a JSX element", () => {
    const input = "jsx";
    const output = stringToJSX(input);
    expect(JSON.stringify(output)).toEqual(
      JSON.stringify(
        <>
          {[
            <React.Fragment key={0}>
              {input}
              {false}
            </React.Fragment>,
          ]}
        </>,
      ),
    );
  });
  it("should replace spaces with non-breaking spaces", () => {
    const input = "Hello World!";
    const output = stringToJSX(input);
    expect(JSON.stringify(output)).toEqual(
      JSON.stringify(
        <>
          {[
            <React.Fragment key={0}>
              {"Hello\u00A0World!"}
              {false}
            </React.Fragment>,
          ]}
        </>,
      ),
    );
  });
  it("should replace newlines with <br />", () => {
    const input = "Hello\nWorld!";
    const output = stringToJSX(input);
    expect(JSON.stringify(output)).toEqual(
      JSON.stringify(
        <>
          {[
            <React.Fragment key={0}>
              Hello
              <br />
            </React.Fragment>,
            <React.Fragment key={1}>
              World!
              {false}
            </React.Fragment>,
          ]}
        </>,
      ),
    );
  });
});
