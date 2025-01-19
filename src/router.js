import * as portfolioForm from "./controller/portfolioFormController.js";
import * as error from "./controller/errorController.js";
import * as portfolio from "./controller/portfolioController.js";
import * as userContact from "./controller/contactFormController.js";
import * as profil from "./controller/profileController.js ";
import * as index from "./controller/indexController.js";
import * as login from "./controller/loginController.js";
import * as register from "./controller/registerController.js";
import * as contact from "./controller/contactController.js";
import * as tagebuch from "./controller/tagebuchController.js";
import * as datenschutz from "./controller/datenschutzController.js";
import * as dokumentation from "./controller/dokumentationConreoller.js";
import * as erklaerung from "./controller/einversteandniserklearungController.js";
import * as impressum from "./controller/impressumController.js";
import * as kollophon from "./controller/kollophenController.js";
import * as workForm from "./controller/workFormController.js";
import * as logging from "./controller/loggingController.js";
import { serveStaticFile } from "./middleware/staticFiles.js";

export const routes = async (ctx) => {
  //profil
  if (ctx.url.pathname === "/profil") {
    ctx = await profil.renderProfile(ctx);
  }

  if (ctx.url.pathname === "/profil/logout") {
    ctx = await profil.logout(ctx);
  }

  if (ctx.url.pathname === "/profil/erstellen") {
    ctx = await userContact.renderContactForm(ctx);
  }

  if (ctx.url.pathname === "/profil/bearbeiten") {
    ctx = await userContact.renderContactForm(ctx);
  }

  if (ctx.url.pathname === "/profil/entfernen") {
    ctx = await userContact.deleteContactData(ctx);
  }

  if (ctx.url.pathname === "/addContact" && ctx.request.method === "POST") {
    ctx = await userContact.addContactData(ctx);
  }

  if (ctx.url.pathname === "/editContact" && ctx.request.method === "POST") {
    ctx = await userContact.editContactData(ctx);
  }

  //portfolio Darstellung
  const portfolioUser = /^\/portfolio\/username\/([^\/]+)$/.exec(
    ctx.url.pathname
  );
  if (portfolioUser) {
    const username = portfolioUser[1];
    ctx = await portfolio.renderPortfolio(ctx, username);
  }

  if (ctx.url.pathname === "/portfolio/user") {
    ctx = await portfolio.renderPortfolio(ctx);
  }

  //Portfolio Form
  if (ctx.url.pathname === "/portfolio/erstellen") {
    ctx = await portfolioForm.renderForm(ctx);
  }

  if (ctx.url.pathname === "/portfolio/entfernen") {
    ctx = await portfolioForm.deletePortfolio(ctx);
  }

  if (ctx.url.pathname === "/portfolio/bearbeiten") {
    ctx = await portfolioForm.renderEditPortfolio(ctx);
  }

  if (ctx.url.pathname === "/edit" && ctx.request.method === "POST") {
    ctx = await portfolioForm.edit(ctx);
  }

  if (ctx.url.pathname === "/add" && ctx.request.method === "POST") {
    ctx = await portfolioForm.add(ctx);
  }

  //Portfolio Arbeiten
  if (ctx.url.pathname === "/portfolio/arbeiten/erstellen") {
    ctx = await workForm.renderForm(ctx);
  }

  if (ctx.url.pathname === "/addWork" && ctx.request.method === "POST") {
    ctx = await workForm.add(ctx);
  }

  if (ctx.url.pathname === "/editWork" && ctx.request.method === "POST") {
    ctx = await workForm.edit(ctx);
  }

  const portfoliEditoWork =
    /^\/portfolio\/arbeiten\/bearbeiten\/([^\/]+)$/.exec(ctx.url.pathname);
  if (portfoliEditoWork) {
    const customID = portfoliEditoWork[1];
    ctx = await workForm.renderForm(ctx, customID);
  }

  if (ctx.url.pathname === "/portfolio/arbeiten/entfernen/") {
    ctx = await workForm.deleteWork(ctx);
  }

  const portfolioDeleteWork =
    /^\/portfolio\/arbeiten\/entfernen\/([^\/]+)$/.exec(ctx.url.pathname);
  if (portfolioDeleteWork) {
    const customID = portfolioDeleteWork[1];
    ctx = await workForm.deleteWork(ctx, customID);
  }

  //Homepage

  if (ctx.url.pathname === "/") {
    ctx = await index.renderIndex(ctx);
  }

  if (ctx.url.pathname === "/index") {
    ctx = await index.renderIndex(ctx);
  }

  const filterOption = /^\/index\/([^\/]+)$/.exec(ctx.url.pathname);
  if (filterOption) {
    const customID = filterOption[1];
    ctx = await index.deleteWork(ctx, customID);
  }

  //test

  if (ctx.url.pathname === "/test") {
    ctx = await portfolio.renderPortfolio(ctx);
  }

  //login
  if (ctx.url.pathname === "/addRegister" && ctx.request.method === "POST") {
    ctx = await register.registerAttempt(ctx);
  }

  if (ctx.url.pathname === "/login" && ctx.request.method === "GET") {
    await login.renderLogin(ctx);
  } else if (
    ctx.url.pathname === "/loginForm" &&
    ctx.request.method === "POST"
  ) {
    ctx = await login.loginAttempt(ctx);
  }
  if (ctx.url.pathname === "/register") {
    ctx = await register.renderRegister(ctx);
  }

  //andere pages
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

  if (ctx.url.pathname === "/einversteandniserklearungen") {
    ctx = await erklaerung.renderErklaerung(ctx);
  }
  if (ctx.url.pathname === "/projekttagebuch") {
    ctx = await tagebuch.renderTagebuch(ctx);
  }
  //admin
  if (ctx.url.pathname === "/logs") {
    const cookie = ctx.cookies.getCookie(ctx);
    const role = cookie["role"];
    if (role == "admin") {
      ctx = await logging.renderLogging(ctx);
    } else {
      ctx.response.status = 403;
      ctx.response.headers.set("Location", "/");
    }
  }

  //static files
  if (!ctx.response.status) {
    ctx = await serveStaticFile(ctx);
  }
  //error
  if (!ctx.response.body) {
    if (ctx.response.status === 303 || ctx.response.status === 302) {
      return ctx;
    }
    if (ctx.response.status === 403) {
      ctx = error.render403Error(ctx);
      return ctx;
    }
    if (ctx.response.status === 500) {
      ctx = error.render500Error(ctx);
      return ctx;
    }
    ctx = error.render404Error(ctx);
    return ctx;
  }

  return ctx;
};
