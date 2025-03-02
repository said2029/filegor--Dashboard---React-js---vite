import { v4 as uuid } from "uuid";
const GenerateUUID = () => {
  return uuid();
};

const ImageValidation = (files: Array<File>): Promise<File[]> => {
  return new Promise((res, rej) => {
    if (!files || !Array.isArray(files) || files.length <= 0) {
      rej("No image file selected. Please choose an image file to upload.");
    }

    const maxSize = 1024 * 1024 * 2;
    const SucFiles: File[] = [];
    const errors: string[] = [];
    for (const file of files) {
      if (file.size > maxSize) {
        errors.push(
          `File ${file.name} size exceeds the maximum limit of ${(maxSize / 1024 / 1024).toFixed(2)} MB. Please select a smaller file.`,
        );
        continue;
      }

      if (!file.type || !file.type.startsWith("image")) {
        errors.push(
          `Invalid file type ${file.name}. Please select an image file.`,
        );
        continue;
      }
      SucFiles.push(file);
    }
    if (errors.length > 0) {
      return rej(errors.join("\n"));
    }

    res(SucFiles);
  });
};

export { GenerateUUID, ImageValidation };
