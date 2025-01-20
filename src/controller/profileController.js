import * as model from "../model/userModel.js";
import * as cookie from "../cookies.js";
import * as checkUser from "../utility/userLoginStatus.js";
import * as generateDisplay from "../utility/generateProfileDisplay.js";

export const renderProfile = async (ctx) => {
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  if (!userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  let msg = `    <a
              href="/profil/erstellen"
              type="button"
              class="button-addcontact"
              >Kontaktdaten hinzufügen</a
            >`;

  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];

  const data = await model.getInfoByUser(ctx.db, username);
  if (data.length > 0) {
    msg = generateDisplay.generateDisplay(msg, data);
  }
  ctx.response.body = await ctx.nunjucks.render("profile.html", {
    contact: msg,
    logs,
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const logout = async (ctx) => {
  ctx = await cookie.deleteUserCookie(ctx);
  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/");
  ctx.response.body = "";
  return ctx;
};
