import * as checkUser from "../utility/userLoginStatus.js";

export const renderKollophon = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  ctx.response.body = await ctx.nunjucks.render("kollophon.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    logs,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
