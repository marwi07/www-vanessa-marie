import * as mediaTypes from "https://deno.land/std@0.224.0/media_types/mod.ts";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";

const POST_FILE_LIMIT = 1024 * 1024 * 5;

export const validateImage = (file) => {
  if (!file) {
    return false;
  }

  console.log(file.size);
  if (file.size == 0) return false;

  if (file.size > POST_FILE_LIMIT) {
    return `Datei ${path.parse(file.name).base} ist zu groß.`;
  }
  if (isMimetypeOk(file.type) && isExtensionOk(file.name)) {
    return true;
  }
  return false;
};

export function generateFilename(file) {
  return path.join(
    "/upload",
    crypto.randomUUID() + "." + mediaTypes.extension(file.type)
  );
}

const isMimetypeOk = (type) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  if (allowedMimeTypes.includes(type)) {
    return true;
  }
  return false;
};

const isExtensionOk = (name) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg"];
  const parts = name.split(".");
  const fileExtension = parts[1];
  return allowedExtensions.includes(`.${fileExtension}`);
};
