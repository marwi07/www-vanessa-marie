import * as model from "../model/userModel.js";

export const renderContactForm = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("addContact.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const addContactData = async (ctx) => {
  const formData = await ctx.request.formData();

  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];

  model.addUserInfo(ctx.db, formData, username);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/");
  ctx.response.body = "";
  return ctx;
};
