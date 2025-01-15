import * as model from "../model/userModel.js";
import * as checkUser from "../utility/userLoginStatus.js";

export const renderContactForm = async (ctx) => {
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  if (!userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const username = checkUser.getUsername(ctx);

  const userdata = await model.getInfoByUser(ctx.db, username);
  let actionMsg = `action="/addContact"`;

  let data;
  if (userdata.length > 0) {
    data = {
      name: userdata[0][5],
      mail: userdata[0][0],
      telefon: userdata[0][1],
      address: userdata[0][4],
      extra: userdata[0][2],
    };
    actionMsg = `action="/editContact"`;
  } else {
    data = {};
  }

  ctx.response.body = await ctx.nunjucks.render("addContact.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    data,
    actionMsg: actionMsg,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const addContactData = async (ctx) => {
  const formData = await ctx.request.formData();
  const username = checkUser.getLoggedInUser(ctx);

  await model.addUserInfo(ctx.db, formData, username);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/profil");
  ctx.response.body = "";
  return ctx;
};

export const editContactData = async (ctx) => {
  const formData = await ctx.request.formData();
  const username = checkUser.getLoggedInUser(ctx);

  await model.updateUserInfoByUsername(ctx.db, username, formData);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/profil");
  ctx.response.body = "";
  return ctx;
};

export const deleteContactData = async (ctx) => {
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  if (!userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  const username = checkUser.getLoggedInUser(ctx);

  const contactData = await model.getInfoByUser(ctx.db, username);

  if (!contactData.length > 0) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  await model.deleteUserInfoByUsername(ctx.db, username);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/profil");
  ctx.response.body = "";
  return ctx;
};
