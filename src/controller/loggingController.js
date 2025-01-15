import * as checkUser from "../utility/userLoginStatus.js";

export const renderLogging = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  // Read and parse the log data from JSON file
  const logDataText = await Deno.readTextFile("./logs/access_log.json");
  let logData = [];
  try {
    logData = JSON.parse(logDataText);
  } catch (error) {
    console.error("Error parsing log data:", error);
    logData = [];
  }

  let logs = [];
  for (const entry of logData) {
    const logEntries = {
      timestamp: entry.timestamp,
      user: entry.userAgent,
      action: entry.method,
      ip: entry.clientIP,
    };
    logs.push(logEntries);
  }

  ctx.response.body = await ctx.nunjucks.render("logs.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    logs: logs,
  });

  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;

  return ctx;
};
