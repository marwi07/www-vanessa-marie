import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as model from "../model/userModel.js";
import * as checkUser from "../utility/userLoginStatus.js";

export const renderRegister = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  if (userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/profil");
    return ctx;
  }

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

  ctx.response.body = await ctx.nunjucks.render("register.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    errors: errors,
    data,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export async function registerAttempt(ctx) {
  const formData = await ctx.request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  const errors = [];
  let hashedPasswort = "";
  if (!username || !password) {
    errors.push("Du musst ein Passwort und einen Username angeben.");
  } else {
    const userExists = await model.getUserByName(ctx.db, username);
    hashedPasswort = await hash(password);

    if (userExists.length > 0) {
      errors.push("Der User existiert bereits.");
    }
  }

  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      username: encodeURIComponent(username || ""),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set("Location", `/register?${queryParams}`);
    ctx.response.body = "";
    return ctx;
  }

  await model.addUser(ctx.db, username, hashedPasswort, "user");
  ctx.response.headers.set("Location", "/login");
  ctx.response.status = 302;
  ctx.response.body = "";
  return ctx;
}
