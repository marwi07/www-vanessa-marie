import * as userModel from "../model/userModel.js";
import * as portfolioModel from "../model/portfolioModel.js";

//TODO MAKE PORTFOLIO FORTH BOTH OWN AND OTHER
export const renderPortfolio = async (ctx, username) => {
  //const cookie = ctx.cookies.getCookie(ctx);
  //const username = cookie["username"];

  //get User Info

  //TODO USER INFO EMPTY -> ADD USER INFO

  const thumbnailInfo = await portfolioModel.getThumbnailByName(
    ctx.db,
    username
  );

  //BREAKS HERE
  const userInfo = await userModel.getInfoByUser(ctx.db, username);

  try {
    const thumbnailPath = thumbnailInfo[0][1];
    const thumbnail = `<img src="${thumbnailPath}" alt="zum Portfolio" />`;

    //PortfolioInfo
    const portfolioInfo = await portfolioModel.getPortfolioByName(
      ctx.db,
      username
    );

    const variables = {
      //title
      title: portfolioInfo[0][1],
      //Thumbnail
      thumbnail: thumbnail,
      //about
      about: portfolioInfo[0][2],
      //skills
      skills: portfolioInfo[0][3],
      //Contact
      name: username,
      mail: userInfo[0][0],
      telephone: userInfo[0][1],
      address: userInfo[0][4],
      extra: userInfo[0][2],
      //work
    };
    ctx.response.body = await ctx.nunjucks.render(
      "userPortfolio.html",
      variables
    );
    ctx.response.headers.set("content-type", "text/html");
    ctx.response.status = 200;
    return ctx;
  } catch {
    ctx.response.status = 400;
    ctx.response.body = "No USer";
    return ctx;
  }
};
