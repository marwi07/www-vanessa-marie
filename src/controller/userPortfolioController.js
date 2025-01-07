import * as userModel from "../model/userModel.js";
import * as portfolioModel from "../model/portfolioModel.js";

export const renderPortfolio = async (ctx) => {
  let variables = {};

  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];

  //TODO USER INFO EMPTY -> ADD USER INFO

  const thumbnailInfo = await portfolioModel.getThumbnailByName(
    ctx.db,
    username
  );

  //BREAKS HERE
  const userInfo = await userModel.getInfoByUser(ctx.db, username);

  //try {
  const thumbnailPath = thumbnailInfo[0][1];
  const thumbnail = `<img
            id="Thumbnail"
            class="PortfolioDetailSite_image-section"
            src="${thumbnailPath}"
            alt="ThumbnailPortfolio"
          />`;

  //PortfolioInfo
  const portfolioInfo = await portfolioModel.getPortfolioByName(
    ctx.db,
    username
  );

  //seperate tags into individual strings
  const tagArray = portfolioInfo[0][5].split(",");
  let tags = "";
  for (const element of tagArray) {
    tags += `<span class="tag">${element}</span>`;
  }

  const editMsgPortfolio = `  <a
              class="button-group_portfolio_button"
              href="/portfolio/bearbeiten"
              >Bearbeiten</a
            >

            <a class="button-group_portfolio_button" href="/portfolio/löschen"
              >Löschen</a
            >`;

  //seperate skills into individual strings
  const skillArray = portfolioInfo[0][3].split(",");
  let skills = "";
  for (const element of skillArray) {
    skills += ` <li>${element}</li>`;
  }

  if (!userInfo.length === 0) {
    variables = {
      //edit
      editPortfolio: editMsgPortfolio,
      //title
      title: portfolioInfo[0][1],
      //Thumbnail
      thumbnail: thumbnail,
      //description
      description: portfolioInfo[0][4],
      //about
      about: portfolioInfo[0][2],
      //tags
      tags: tags,
      //skills
      skills: skills,
      //Contact
      name: username,
      mail: userInfo[0][0],
      telephone: userInfo[0][1],
      address: userInfo[0][4],
      extra: userInfo[0][2],
      //work
    };
  } else {
    variables = {
      //edit
      editPortfolio: editMsgPortfolio,
      //title
      title: portfolioInfo[0][1],
      //Thumbnail
      thumbnail: thumbnail,
      //description
      description: portfolioInfo[0][4],
      //about
      about: portfolioInfo[0][2],
      //tags
      tags: tags,
      //skills
      skills: skills,
      //Contact
      name: username,
    };
  }
  ctx.response.body = await ctx.nunjucks.render(
    "userPortfolio.html",
    variables
  );
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
  /*} catch {
    ctx.response.status = 400;
    ctx.response.body = "No USer";
    return ctx;
  }*/
};
