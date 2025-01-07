import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as model from "../model/userModel.js";

export const renderRegister = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("register.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const registerAttempt = async (ctx) => {
  const formData = await ctx.request.formData();

  const username = formData.get("username");
  const password = formData.get("password");

  let _html;
  let _status;

  if (!username || !password) {
    ctx = errorMessage(ctx);
    return ctx;
  } else {
    const userExists = await model.getUserByName(ctx.db, username);
    const hashedPassword = await hash(password);

    if (userExists.length > 0) {
      ctx = errorMessage(ctx);
      return ctx;
    } else {
      await model.addUser(ctx.db, username, hashedPassword, "user");
      _status = "success";

      ctx.response.headers.set("Location", "/login");
      ctx.response.status = 302;
      ctx.response.body = "";
      return ctx;
    }
  }
};

export const errorMessage = async (ctx) => {
  let msg = ` <div class="container-false-login" id="errorPopup">
                <p class="error-message">
                  Deine Eingaben sind ungültig.
                </p>
                 <a href="#" onclick="document.getElementById('errorPopup').style.display='none'; return false;" class="close-button">Schließen</a>
              </div>
`;
  ctx.response.body = await ctx.nunjucks.render("Login.html", {
    error: msg,
  });
  msg = "";
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 400;
  return ctx;
};
