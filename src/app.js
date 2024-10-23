import * as portfolio from "./portfolio/view/view.js";
import * as portfolioForm from "./portfolio/formController.js";
import { serveStaticFile } from "./middleware/staticFiles.js";
import { createContext } from "./framework/context.js";
import { DB } from "https://deno.land/x/sqlite@v3.9.0/mod.ts";
import nunjucks from "https://deno.land/x/nunjucks@3.2.3/mod.js";

const db = new DB("./data/portfolio.sqlite");

nunjucks.configure("public", { autoescape: true });

export const handleRequest = async (request) => {
  let ctx = await createContext(
    request,
    { db, staticBase: "public" },
    nunjucks
  );

  console.log(ctx.url.pathname);

  if (ctx.url.pathname === "/") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/test.html") {
    ctx = await portfolio.renderForm(ctx);
  }

  if (ctx.url.pathname === "/add" && ctx.request.method === "POST") {
    console.log("here");
    ctx = await portfolioForm.add(ctx);
  }

  if (!ctx.response.status) {
    ctx = await serveStaticFile(ctx);
  }
  // 404
  if (!ctx.response.status) {
    //ctx = await portfolio.error404(ctx);
  }
  return new Response(ctx.response.body, {
    status: ctx.response.status,
    headers: ctx.response.headers,
  });
};
