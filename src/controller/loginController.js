import * as checkUser from "../utility/userLoginStatus.js";
import * as checkLoginErrors from "../utility/generateErrorsForDisplay.js";
import * as getErrorFromURL from "../utility/getErrorFromURL.js";
import * as model from "../model/userModel.js";

export const renderLogin = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);

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

  //data fur template wird befullt
  const data = {
    username: queryParams.username || "",
  };

  ctx.response.body = await ctx.nunjucks.render("Login.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    errors: errors,
    data,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export async function loginAttempt(ctx) {
  const formData = await ctx.request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  //generieren von Fehelern von Login Formdata
  const errors = checkLoginErrors.generateLoginErrors(ctx, password, username);

  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      username: encodeURIComponent(username || ""),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set("Location", `/login?${queryParams}`);
    ctx.response.body = "";
    return ctx;
  }

  // Setzen von User Cookie und redirect zu Profil
  const role = await model.getRoleByUser(ctx.db, username);
  console.log(role[0][0]);
  await ctx.cookies.setUserCookie(ctx, username, role[0][0]);
  ctx.response.headers.set("Location", "/profil");
  ctx.response.status = 302;
  ctx.response.body = "";
  return ctx;
}
