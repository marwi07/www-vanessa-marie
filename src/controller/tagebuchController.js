import * as checkUser from "../utility/userLoginStatus.js";

export const renderTagebuch = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  ctx.response.body = await ctx.nunjucks.render("projekttagebuch.html", {
    account: variables.account,
    logs,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
