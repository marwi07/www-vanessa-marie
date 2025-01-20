import * as model from "../model/workPortfolioModel.js";
import * as modelPortfolio from "../model/portfolioModel.js";
import * as checkUser from "../utility/userLoginStatus.js";
import * as getErrorFromURL from "../utility/getErrorFromURL.js";
import * as saveImage from "../utility/saveImage.js";
import * as validateWorkForm from "../utility/validateWorkForm.js";
import * as validateEachImageUpload from "../utility/validateEachImageUpload.js";

let workTextId;
export const renderForm = async (ctx, id) => {
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  const logs = checkUser.footerAdminLink(ctx);
  if (!userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  const username = checkUser.getLoggedInUser(ctx);

  const portfolioData = await modelPortfolio.getPortfolioByName(
    ctx.db,
    username
  );
  if (!portfolioData) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  //Errors, die in url gespeichert wurden werden aufgerufen
  const url = new URL(ctx.request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  const errors = getErrorFromURL.getErrorFromURL(queryParams);

  //Wenn Aufruf fur Rendern von EditForm
  let data;
  let actionForm = `action="/addWork"`;
  if (id) {
    workTextId = id;
    actionForm = `action="/editWork"`;
    const workInfo = await model.getWorkTextById(ctx.db, id);
    const workImage = await model.getImagesById(ctx.db, id);

    const workImagePath = [];
    for (const elements of workImage) {
      workImagePath.push(elements[1]);
    }

    data = {
      title: workInfo[0][0],
      description: workInfo[0][1],
      workImage: workImagePath,
    };
    //Wenn Aufruf fur Rendern von AddForm
  } else {
    data = {
      title: queryParams.title || "",
      description: queryParams.description || "",
    };
  }

  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx.response.body = await ctx.nunjucks.render("WorkErstellen.html", {
    errors,
    logs,
    data,
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
  const username = checkUser.getLoggedInUser(ctx);

  const imageData = await validateEachImageUpload.validateEachImageUpload(
    formData
  );

  // Generate errors for text
  const data = validateWorkForm.getWorkFormData(formData);
  const errors = validateWorkForm.errorGenerationForWork(data);
  const queryParams = validateWorkForm.checkErrorsPortfolio(errors, data);

  if (queryParams) {
    ctx.response.status = 302;
    ctx.response.headers.set(
      "Location",
      `/portfolio/arbeiten/erstellen?${queryParams}`
    );
    ctx.response.body = "";
    return ctx;
  }

  // Saving text (work entry)
  workTextId = await model.addWorkInfo(
    ctx.db,
    data.title,
    data.description,
    username
  );

  // Saving images for the new work entry
  if (imageData.images && imageData.images.length > 0) {
    for (const file of imageData.images) {
      const filename = await saveImage.saveImage(file);
      await model.addWorkImage(ctx.db, filename, file, username, workTextId);
    }
  }

  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  ctx.response.body = "";
  return ctx;
};

export const deleteWork = async (ctx, id) => {
  const _images = await model.deleteImagesByTextId(ctx.db, id);
  const _text = await model.deleteWorkTextById(ctx.db, id);
  const username = checkUser.getLoggedInUser(ctx);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  ctx.response.body = "";
  return ctx;
};

export const edit = async (ctx) => {
  const formData = await ctx.request.formData();
  const username = checkUser.getLoggedInUser(ctx);

  // Error check for image uploads
  const imageData = await validateEachImageUpload.validateEachImageEditUpload(
    ctx,
    formData,
    workTextId
  );

  // Getting form data and checking errors
  const data = validateWorkForm.getWorkFormData(formData);
  const errors = validateWorkForm.errorGenerationForWork(data, imageData);
  if (!imageData.error == "") errors.push(imageData.error);
  const queryParams = validateWorkForm.checkErrorsPortfolio(errors, data);

  if (queryParams) {
    ctx.response.status = 302;
    ctx.response.headers.set(
      "Location",
      `/portfolio/arbeiten/erstellen?${queryParams}`
    );
    ctx.response.body = "";
    return ctx;
  }

  // Saving text (updating the existing work entry)
  const _result = await model.updateWorkTextById(
    ctx.db,
    workTextId,
    data.title,
    data.description
  );

  // Saving images for the work entry, making sure not to overwrite the existing ones unless explicitly specified
  if (imageData.images && imageData.images.length > 0) {
    for (const file of imageData.images) {
      const filename = await saveImage.saveImage(file);
      await model.addWorkImage(ctx.db, filename, file, username, workTextId);
    }
  }

  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  ctx.response.body = "";
  return ctx;
};
