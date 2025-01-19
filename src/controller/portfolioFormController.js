import * as model from "../model/portfolioModel.js";
import * as checkUser from "../utility/userLoginStatus.js";
import * as getErrorFromURL from "../utility/getErrorFromURL.js";
import * as validateForm from "../utility/validateForm.js";
import * as saveImage from "../utility/saveImage.js";

export const renderForm = async (ctx) => {
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  if (!userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }
  const username = checkUser.getLoggedInUser(ctx);

  //check ob Errors in URL von Form
  const url = new URL(ctx.request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const errors = getErrorFromURL.getErrorFromURL(queryParams);

  //check ob Edit oder Add Aufruf
  const portfolioData = await model.getPortfolioByName(ctx.db, username);
  const thumbnailData = await model.getThumbnailByName(ctx.db, username);

  let data = {
    title: queryParams.title || "",
    description: queryParams.description || "",
    about: queryParams.about || "",
    tags: queryParams.tags ? queryParams.tags.split("%2C") : [],
    skills: queryParams.skills ? queryParams.skills.split("%2C") : [],
    thumbnail: queryParams.title || "",
  };

  if (Array.isArray(portfolioData) && portfolioData.length > 0) {
    data = {
      title: portfolioData[0][1],
      description: portfolioData[0][4],
      about: portfolioData[0][2],
      tags: portfolioData[0][5] ? portfolioData[0][5].split(",") : [],
      skills: portfolioData[0][3] ? portfolioData[0][3].split(",") : [],
      thumbnail: thumbnailData[0][1],
    };
  }

  let actionForm = `action="/add"`;
  if (Array.isArray(portfolioData) && portfolioData.length > 0) {
    actionForm = `action="/edit"`;
  }

  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx.response.body = await ctx.nunjucks.render("PortfolioErstellen.html", {
    errors,
    data,
    logs,
    action: actionForm,
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const add = async (ctx) => {
  const formData = await ctx.request.formData();

  const data = validateForm.getPortfolioFormData(formData);
  const errors = validateForm.validatePortfolioForm(data);
  const queryParams = validateForm.checkErrorsPortfolio(errors, data);

  if (queryParams) {
    ctx.response.status = 303;
    ctx.response.headers.set("Location", `/portfolio/erstellen?${queryParams}`);
    return ctx;
  }

  const username = checkUser.getLoggedInUser(ctx);

  //image saving
  const filename = await saveImage.saveImage(data.thumbnail);
  await model.addPortfolioUser(ctx.db, username);
  await model.addPortfolioThumbnail(ctx.db, filename, data.thumbnail, username);

  //text saving
  await model.addPortfolioInfo(
    ctx.db,
    data.title,
    data.about,
    data.description,
    data.skillsString,
    data.tagsString,
    username
  );
  ctx.response.status = 303;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  return ctx;
};

export const deletePortfolio = async (ctx) => {
  const cookieUser = ctx.cookies.getCookie(ctx);
  const username = cookieUser["username"];

  if (!username) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }
  await model.deletePortfolioTextByName(ctx.db, username);
  await model.deletePortfolioThumbnailByName(ctx.db, username);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/");
  return ctx;
};

export const edit = async (ctx) => {
  const formData = await ctx.request.formData();
  const data = validateForm.getPortfolioFormData(formData);
  const errors = validateForm.validatePortfolioFormEdit(data);
  const queryParams = validateForm.checkErrorsPortfolio(errors, data);
  if (queryParams) {
    ctx.response.status = 303;
    ctx.response.headers.set("Location", `/portfolio/erstellen?${queryParams}`);
    ctx.response.body = "";
    return ctx;
  }

  const username = checkUser.getLoggedInUser(ctx);

  //If user doesn't uplaod new image
  if (data.thumbnail.name) {
    //image saving
    const filename = await saveImage.saveImage(file);
    model.updatePortfolioThumbnail(ctx.db, username, filename, data.thumbnail);
  }

  //text saving
  model.updatePortfolioText(
    ctx.db,
    data.title,
    data.about,
    data.description,
    data.skillsString,
    data.tagsString,
    username
  );

  ctx.response.status = 303;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  return ctx;
};
