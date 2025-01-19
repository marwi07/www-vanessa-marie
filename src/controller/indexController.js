import * as checkUser from "../utility/userLoginStatus.js";
import * as generatePortfolio from "../utility/generatePortfolioDisplay.js";

export const renderIndex = async (ctx) => {
  //Check if logged in and created profile - displays html accordingly
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  const displayText = await checkUser.TextDisplayCheck(ctx);
  //gets all portfolio entries, generates html for each entry, filters entries if active
  const portfolioIndex = await generatePortfolio.generatePortfolios(ctx);
  ctx.response.body = await ctx.nunjucks.render("index.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    homepageText: displayText,
    portfolios: portfolioIndex,
    logs,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
