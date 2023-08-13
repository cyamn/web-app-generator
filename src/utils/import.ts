export const handleImport = async (accept?: string[]): Promise<string[]> => {
  const fileSelector = document.createElement("input");
  fileSelector.setAttribute("type", "file");
  fileSelector.setAttribute("multiple", "multiple");

  if (accept === undefined) {
    fileSelector.setAttribute("accept", "*");
  } else {
    const acceptTypes = accept.join(",");
    fileSelector.setAttribute("accept", acceptTypes);
  }

  fileSelector.click();

  return new Promise((resolve, reject) => {
    const handleChange = async (event: Event) => {
      const inputElement = event.target as HTMLInputElement;

      if (!inputElement.files || inputElement.files.length === 0) {
        reject(new Error("No files selected"));
        return;
      }

      const files = [...inputElement.files];

      const fileContents: string[] = [];

      for (const file of files) {
        const text = await file.text();
        fileContents.push(text);
      }

      resolve(fileContents);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      inputElement.removeEventListener("change", handleChange); // Clean up event listener
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    fileSelector.addEventListener("change", handleChange);
  });
};
