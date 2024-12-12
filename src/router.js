import * as portfolio from "./portfolio/formController.js";
import * as portfolioForm from "./portfolio/formController.js";

import * as index from "./controller/indexController.js";
import * as login from "./controller/loginController.js";
import * as contact from "./controller/contactController.js";

export const routes = async (ctx) => {
  if (ctx.url.pathname === "/") {
    ctx = await index.index(ctx);
  }

  if (ctx.url.pathname === "/login") {
    ctx = await login.login(ctx);
  }

  if (ctx.url.pathname === "/register") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/kollophon") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/dokumentation") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/datenschutz") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/impressum") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/kontakt") {
    ctx = await contact.contact(ctx);
  }

  if (ctx.url.pathname === "/ueber-uns") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/portfolio") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/portfolio/erstellen") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/portfolio/bearbeiten") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/portfolio/loeschen") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/portfolio/user") {
    ctx = await portfolio.index(ctx);
  }

  if (ctx.url.pathname === "/test.html") {
    ctx = await portfolio.renderForm(ctx);
  }

  if (ctx.url.pathname === "/add" && ctx.request.method === "POST") {
    ctx = await portfolioForm.add(ctx);
  }
};
