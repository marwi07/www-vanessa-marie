import * as checkUser from "../utility/userLoginStatus.js";

export const renderKollophon = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  ctx.response.body = await ctx.nunjucks.render("dokumentation.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
