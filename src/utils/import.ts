export const handleImport = async (
  acceptedExtensions?: string[],
): Promise<string[]> => {
  const fileSelector = createFileSelector(acceptedExtensions);
  fileSelector.click();

  return new Promise((resolve, reject) => {
    const handleChange = async (event: Event) => {
      const inputElement = event.target as HTMLInputElement;

      if (!inputElement.files || inputElement.files.length === 0) {
        reject(new Error("No files selected"));
        return;
      }

      const fileContents = await readFilesContents(inputElement.files);
      resolve(fileContents);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      inputElement.removeEventListener("change", handleChange);
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    fileSelector.addEventListener("change", handleChange);
  });
};

function createFileSelector(acceptedExtensions?: string[]): HTMLInputElement {
  const fileSelector = document.createElement("input");
  fileSelector.setAttribute("type", "file");
  fileSelector.setAttribute("multiple", "multiple");

  if (acceptedExtensions === undefined) {
    fileSelector.setAttribute("accept", "*");
  } else {
    const acceptTypes = acceptedExtensions.join(",");
    fileSelector.setAttribute("accept", acceptTypes);
  }
  return fileSelector;
}

async function readFilesContents(files: FileList): Promise<string[]> {
  const fileContents: string[] = [];

  for (const file of files) {
    const text = await file.text();
    fileContents.push(text);
  }

  return fileContents;
}
