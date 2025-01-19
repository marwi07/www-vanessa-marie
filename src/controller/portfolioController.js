import * as portfolioDisplay from "../utility/generatePortfolioDisplay.js";

export const renderPortfolio = async (ctx, username) => {
  const variables = await portfolioDisplay.generateDetailPortfolios(
    ctx,
    username
  );

  ctx.response.body = await ctx.nunjucks.render(
    "userPortfolio.html",
    variables
  );
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
