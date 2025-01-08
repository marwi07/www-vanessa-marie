import * as checkUser from "../middleware/userLoginStatus.js";
import * as modelPortfolio from "../model/portfolioModel.js";

export const renderIndex = async (ctx) => {
  //Check if logged in and created profile - displays html accordingly
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const portfolioIndex = await generatePortfolios(ctx);
  const displayText = await checkUser.TextDisplayCheck(ctx);
  ctx.response.body = await ctx.nunjucks.render("index.html", {
    account: variables.account,
    portfolioMenu: variables.portfolio,
    homepageText: displayText,
    portfolios: portfolioIndex,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const generatePortfolios = async (ctx) => {
  let html = "";
  const portfolioArray = await modelPortfolio.indexText(ctx.db);

  for (const element of portfolioArray) {
    const thumbnailArray = await modelPortfolio.getThumbnailByName(
      ctx.db,
      element[0]
    );

    if (!thumbnailArray || thumbnailArray.length === 0) {
      console.error(`Thumbnail not found for user: ${element[0]}`);
      continue;
    }

    let thumbnail = thumbnailArray[0];

    if (!thumbnail || thumbnail.length < 2) {
      console.error(`Invalid thumbnail structure for user: ${element[0]}`);
      continue;
    }

    thumbnail = thumbnail[1];
    const object = {
      username: element[0],
      title: element[1],
      description: element[4],
      imagePath: thumbnail,
    };

    html += `<div class="Portfolio">
          <div class="text-section">
            <p class="username">_____________________________${object.username}</p>

            <h2 class="titel">${object.title}</h2>

            <p class="beschreibung">
              ${object.description}
            </p>

            <a class="btn readmore" href="portfolio/username/${object.username}"
              >Read more <i class="material-icons pfeil">trending_flat</i></a
            >
          </div>

          <div class="image-section">
            <img src="${object.imagePath}" alt="Bildbeschreibung" />
          </div>
        </div>`;
  }
  return html;
};
