import { fireEvent } from "@testing-library/dom";

import { createFileSelector } from "./import"; // <--- function to test

describe("handleImport", () => {
  it("shows dialogue with file selection", () => {
    const fileSelector = createFileSelector();
    const file = new File(["test"], "test.json", { type: "application/json" });
    fireEvent.change(fileSelector, { target: { files: [file] } });
    fireEvent.click(fileSelector);
  });
});

describe("createFileSelector function", () => {
  it("should create file selector to accept every file type", () => {
    const fileSelector = createFileSelector();
    expect(fileSelector.getAttribute("type")).toEqual("file");
    expect(fileSelector.getAttribute("multiple")).toEqual("multiple");
    expect(fileSelector.getAttribute("accept")).toEqual("*");
  });
  it("should create file selector to accept specific file types", () => {
    const fileSelector = createFileSelector([".json", ".yaml"]);
    expect(fileSelector.getAttribute("type")).toEqual("file");
    expect(fileSelector.getAttribute("multiple")).toEqual("multiple");
    expect(fileSelector.getAttribute("accept")).toEqual(".json,.yaml");
  });
});
