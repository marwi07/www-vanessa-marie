import * as path from "https://deno.land/std@0.185.0/path/posix.ts";
import { contentType } from "https://deno.land/std@0.185.0/media_types/mod.ts";

export const serveStaticFile = async (ctx) => {
  const base = ctx.staticBase;
  let file;

  const fullPath = path.join(base, ctx.url.pathname);
  if (!fullPath.startsWith(base) || fullPath.includes("\0")) {
    ctx.response.status = 403;
    return ctx;
  }

  try {
    file = await Deno.open(fullPath, { read: true });
  } catch (_error) {
    ctx.response.status = 404;
    return ctx;
  }

  const { ext } = path.parse(ctx.url.pathname);
  const mimeType = contentType(ext);

  if (mimeType) {
    ctx.response.body = file.readable;
    ctx.response.headers.set("Content-Type", mimeType);
    ctx.response.status = 200;
  } else {
    file.close();
  }
  return ctx;
};
