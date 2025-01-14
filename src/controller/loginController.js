import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as model from "../model/userModel.js";
import * as checkUser from "../middleware/userLoginStatus.js";

export const renderLogin = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx = checkUser.isUserLoggedIn(ctx);
  const url = new URL(ctx.request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  let errors = [];

  if (queryParams.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(queryParams.errors));
    } catch {
      errors = [];
    }
  }
  
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
  
  const errors = [];

  if (!username || !password) {
    errors.push("Du musst ein Passwort und einen Username angeben.");
  } else {
    const hashPasswort = await model.getPasswortByUser(ctx.db, username);

    if (hashPasswort.length === 0) {
      errors.push("Der User existiert nicht.");
    } else {
      const passwordMatches = await compare(password, hashPasswort[0][0]);

      if (!passwordMatches) {
        errors.push("Dein Passwort stimmt nicht.");
      }
    }
  }

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

  await ctx.cookies.setUserCookie(ctx, username, "role");
  _status = "success";
  ctx.response.headers.set("Location", "/profile");
  ctx.response.status = 302;
  ctx.response.body = "";
  return ctx;
}
