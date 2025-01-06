import * as checkUser from "../middleware/userLoginStatus.js";

export const renderIndex = async (ctx) => {
  //Check if logged in and created profile - displays html accordingly
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const displayText = await checkUser.TextDisplayCheck(ctx);
  ctx.response.body = await ctx.nunjucks.render("index.html", {
    account: variables.account,
    portfolio: variables.portfolio,
    homepageText: displayText,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
