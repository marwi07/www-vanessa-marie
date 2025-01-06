import * as portfolio from "./controller/formController.js";
import * as index from "./controller/indexController.js";
import * as login from "./controller/loginController.js";
import * as register from "./controller/registerController.js";
import * as contact from "./controller/contactController.js";
import * as about from "./controller/aboutController.js";
import * as datenschutz from "./controller/datenschutzController.js";
import * as dokumentation from "./controller/dokumentationConreoller.js";
import * as impressum from "./controller/impressumController.js";
import * as kollophon from "./controller/kollophenController.js";

export const routes = async (ctx) => {
  if (ctx.url.pathname === "/") {
    ctx = await index.renderIndex(ctx);
  }

  if (ctx.url.pathname === "/login" && ctx.request.method === "GET") {
    await login.renderLogin(ctx);
  } else if (ctx.url.pathname === "/login" && ctx.request.method === "POST") {
    await login.loginAttempt(ctx);
  }
  if (ctx.url.pathname === "/register") {
    ctx = await register.renderRegister(ctx);
  }

  if (ctx.url.pathname === "/kollophon") {
    ctx = await kollophon.renderKollophon(ctx);
  }

  if (ctx.url.pathname === "/dokumentation") {
    ctx = await dokumentation.renderDokumentation(ctx);
  }

  if (ctx.url.pathname === "/datenschutz") {
    ctx = await datenschutz.renderDatenschutz(ctx);
  }

  if (ctx.url.pathname === "/impressum") {
    ctx = await impressum.renderImpressum(ctx);
  }

  if (ctx.url.pathname === "/kontakt") {
    ctx = await contact.renderContact(ctx);
  }

  if (ctx.url.pathname === "/ueber-uns") {
    ctx = await about.renderAbout(ctx);
  }

  if (ctx.url.pathname === "/Portfolio") {
    ctx = await portfolio.renderForm(ctx);
  }

  if (ctx.url.pathname === "/portfolio/erstellen") {
    ctx = await portfolio.renderForm(ctx);
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

  if (ctx.url.pathname === "/addRegister" && ctx.request.method === "POST") {
    ctx = await register.registerAttempt(ctx);
  }

  if (ctx.url.pathname === "/add" && ctx.request.method === "POST") {
    ctx = await portfolio.add(ctx);
  }

  return ctx;
};
