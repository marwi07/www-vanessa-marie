import * as checkUser from "../utility/userLoginStatus.js";

export const render404Error = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  errorCode = "404";
  errormessage = "Seite konnte nicht gefunden werden.";
  ctx.response.body = await ctx.nunjucks.render("error404.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    errorCode,
    errormessage,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 404;
  return ctx;
};

export const render403Error = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  errorCode = "403";
  errormessage = "Du hast nicht die benötigten Rechte.";
  ctx.response.body = await ctx.nunjucks.render("error404.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    errorCode,
    errormessage,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 403;
  return ctx;
};

export const render500Error = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  errorCode = "500";
  errormessage = "Internal Server Error";
  ctx.response.body = await ctx.nunjucks.render("error404.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    errorCode,
    errormessage,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 500;
  return ctx;
};
