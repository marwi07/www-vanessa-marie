import * as router from "./router.js";
import { createContext } from "./framework/context.js";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";
import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";
import * as cookies from "./cookies.js";
import { accessLogger } from "./middleware/logging.js";
const db = new DB("./data/portfolio.sqlite");

nunjucks.configure("src/template", { autoescape: true });

export const handleRequest = async (request) => {
  let ctx = createContext(
    request,
    { db, staticBase: "public" },
    nunjucks,
    cookies
  );

  await accessLogger(ctx, async () => {
    ctx = await router.routes(ctx);
  });

  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};
