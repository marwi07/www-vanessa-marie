import * as portfolioDisplay from "../utility/generatePortfolioDisplay.js";
import * as checkUser from "../utility/userLoginStatus.js";

export const renderPortfolio = async (ctx, username) => {
  const logs = checkUser.footerAdminLink(ctx);
  const variables = await portfolioDisplay.generateDetailPortfolios(
    ctx,
    username
  );

  ctx.response.body = await ctx.nunjucks.render(
    "userPortfolio.html",
    variables,
    logs
  );
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
