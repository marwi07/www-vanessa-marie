import * as portfolioForm from "./controller/portfolioFormController.js";
import * as portfolio from "./controller/portfolioController.js";
import * as userPortfolio from "./controller/userPortfolioController.js";
import * as userContact from "./controller/contactFormController.js";
import * as profil from "./controller/profileController.js ";
import * as index from "./controller/indexController.js";
import * as login from "./controller/loginController.js";
import * as register from "./controller/registerController.js";
import * as contact from "./controller/contactController.js";
import * as about from "./controller/aboutController.js";
import * as datenschutz from "./controller/datenschutzController.js";
import * as dokumentation from "./controller/dokumentationConreoller.js";
import * as impressum from "./controller/impressumController.js";
import * as kollophon from "./controller/kollophenController.js";
import * as workForm from "./controller/workFormController.js";

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

  if (ctx.url.pathname === "/addContact" && ctx.request.method === "POST") {
    ctx = await userContact.addContactData(ctx);
  }

  //portfolio Darstellung
  const portfolioUser = /^\/portfolio\/username\/([^\/]+)$/.exec(
    ctx.url.pathname
  );
  if (portfolioUser) {
    const username = portfolioUser[1];
    ctx = await portfolio.renderPortfolio(ctx, username);
    return ctx;
  }

  if (ctx.url.pathname === "/portfolio/user") {
    ctx = await userPortfolio.renderPortfolio(ctx);
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

  if (ctx.url.pathname === "/editPortfolio" && ctx.request.method === "POST") {
    ctx = await portfolioForm.edit(ctx);
  }

  if (ctx.url.pathname === "/add" && ctx.request.method === "POST") {
    ctx = await portfolioForm.add(ctx);
  }

  //Portfolio Arbeiten
  if (ctx.url.pathname === "/portfolio/arbeiten/erstellen") {
    ctx = await workForm.renderWorkForm(ctx);
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
    ctx = await workForm.renderWorkEditForm(ctx, customID);
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
  if (ctx.url.pathname === "/register") {
    ctx = await register.renderRegister(ctx);
  }

  if (ctx.url.pathname === "/addRegister" && ctx.request.method === "POST") {
    ctx = await register.registerAttempt(ctx);
  }

  if (ctx.url.pathname === "/login" && ctx.request.method === "GET") {
    await login.renderLogin(ctx);
  } else if (ctx.url.pathname === "/login" && ctx.request.method === "POST") {
    await login.loginAttempt(ctx);
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

  if (ctx.url.pathname === "/ueber-uns") {
    ctx = await about.renderAbout(ctx);
  }

  return ctx;
};
