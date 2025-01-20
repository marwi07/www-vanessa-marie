import * as model from "../model/userModel.js";
import * as getErrorFromURL from "../utility/getErrorFromURL.js";
import * as checkUser from "../utility/userLoginStatus.js";
import * as checkRegisterErrors from "../utility/generateErrorsLoginRegister.js";

export const renderRegister = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  if (userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/profil");
    return ctx;
  }

  //Errors, die in url gespeichert wurden werden aufgerufen
  const url = new URL(ctx.request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const errors = getErrorFromURL.getErrorFromURL(queryParams);

  const data = {
    username: queryParams.username || "",
  };

  ctx.response.body = await ctx.nunjucks.render("register.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    errors: errors,
    data,
    logs,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export async function registerAttempt(ctx) {
  const formData = await ctx.request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  const data = await checkRegisterErrors.generateRegisterErrors(
    ctx,
    password,
    username
  );

  if (data.errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      username: encodeURIComponent(username || ""),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set("Location", `/register?${queryParams}`);
    ctx.response.body = "";
    return ctx;
  }

  await model.addUser(ctx.db, username, data.hashedPasswort, "user");
  ctx.response.headers.set("Location", "/login");
  ctx.response.status = 302;
  ctx.response.body = "";
  return ctx;
}
