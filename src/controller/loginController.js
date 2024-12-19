import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as model from "../model/userModel.js";

export const renderLogin = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("Login.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export async function loginAttempt(ctx) {
  const formData = await ctx.request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  let _html;
  let _status;

  if (!username || !password) {
    ctx.response.status = 400;
    ctx.response.body = "Username and password are required.";
    return ctx;
  } else {
    const hashPasswort = await model.getPasswortByUser(ctx.db, username);

    if (hashPasswort.length === 0) {
      ctx.response.status = 400;
      ctx.response.body = "No USer";
      return ctx;
    } else {
      const passwordMatches = await compare(password, hashPasswort[0][0]);

      if (!passwordMatches) {
        ctx.response.status = 400;
        ctx.response.body = "Passwort doesn*t match";
        return ctx;
      } else {
        await ctx.cookies.setUserCookie(ctx, username, "role");

        _status = "success";

        ctx.response.headers.set("Location", "/");
        ctx.response.status = 302;
        ctx.response.body = "";
        return ctx;
      }
    }
  }
}
