import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as validateImage from "./validateImageUpload.js";

export const saveImage = async (file) => {
  const filename = validateImage.generateFilename(file);
  const destFile = await Deno.open(path.join(Deno.cwd(), "public", filename), {
    create: true,
    write: true,
    truncate: true,
  });
  await file.stream().pipeTo(destFile.writable);
  return filename;
};
