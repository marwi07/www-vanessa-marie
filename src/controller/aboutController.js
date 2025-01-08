import * as checkUser from "../middleware/userLoginStatus.js";

export const renderAbout = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  ctx.response.body = await ctx.nunjucks.render("ueber-uns.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
