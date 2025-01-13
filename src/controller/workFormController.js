import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as model from "../model/workPortfolioModel.js";
import * as checkUser from "../middleware/userLoginStatus.js";

let workTextId;
export const renderForm = async (ctx, id) => {
  ctx = checkUser.isUserLoggedIn(ctx);
  const url = new URL(ctx.request.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());

  let errors = [];
  if (queryParams.errors) {
    try {
      errors = JSON.parse(decodeURIComponent(queryParams.errors));
    } catch {
      errors = [];
    }
  }

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
  } else {
    data = {
      title: queryParams.title || "",
      description: queryParams.description || "",
    };
  }

  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx.response.body = await ctx.nunjucks.render("WorkErstellen.html", {
    errors,
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
  let thumbnailError = "";
  const images = [];
  for (let i = 1; i <= 8; i++) {
    const image = formData.get(`image${i}`);
    if (image && image.size > 0) {
      thumbnailError = validateImage.validateImage(image);
      images.push(image);
    } else {
      continue;
    }
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const errors = [];
  if (!title) errors.push("Du musst einen Titel eingeben.");
  if (!description) errors.push("Du musst eine Beschreibung eingeben.");
  if (!thumbnailError == "") errors.push(thumbnailError);

  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      title: encodeURIComponent(title || ""),
      description: encodeURIComponent(description || ""),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set(
      "Location",
      `/portfolio/arbeiten/erstellen?${queryParams}`
    );
    ctx.response.body = "";
    return ctx;
  }
  //saving text
  workTextId = await model.addWorkInfo(ctx.db, title, description, username);
  //saving file
  for (const file of images) {
    const filename = validateImage.generateFilename(file);
    const destFile = await Deno.open(
      path.join(Deno.cwd(), "public", filename),
      {
        create: true,
        write: true,
        truncate: true,
      }
    );
    await file.stream().pipeTo(destFile.writable);
    await model.addWorkImage(ctx.db, filename, file, username, workTextId);
  }
  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  ctx.response.body = "";
  return ctx;
};

export const deleteWork = async (ctx, id) => {
  const _images = await model.deleteImagesByTextId(ctx.db, id);
  const _text = await model.deleteWorkTextById(ctx.db, id);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/`);
  ctx.response.body = "";
  return ctx;
};

export const edit = async (ctx) => {
  const formData = await ctx.request.formData();
  const username = checkUser.getLoggedInUser(ctx);
  let thumbnailError = "";
  const images = [];
  const imageNum = [];
  for (let i = 1; i <= 3; i++) {
    const image = formData.get(`image${i}`);
    if (image && image.size > 0) {
      thumbnailError = validateImage.validateImage(image);
      images.push(image);
      imageNum.push(i - 1);
    } else {
      continue;
    }
  }

  //deleting the image at the position the image was shown on site to replace with new
  const imagesInData = await model.getImagesById(ctx.db, workTextId);
  for (let i = 1; i <= 3; i++) {
    if (i - 1 === imageNum[0]) {
      const image = await model.getImageById(ctx.db, imagesInData[i - 1][5]);
      console.log(image[0][5]);
      await model.deleteWorkImageById(ctx.db, image[0][5]);
    }
  }

  //error check
  const title = formData.get("title");
  const description = formData.get("description");
  const errors = [];
  if (!title) errors.push("Du musst einen Titel eingeben.");
  if (!description) errors.push("Du musst eine Beschreibung eingeben.");
  if (!thumbnailError == "") errors.push(thumbnailError);

  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      title: encodeURIComponent(title || ""),
      description: encodeURIComponent(description || ""),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set(
      "Location",
      `/portfolio/arbeiten/erstellen?${queryParams}`
    );
    ctx.response.body = "";
    return ctx;
  }
  //saving text
  const _result = await model.updateWorkTextById(
    ctx.db,
    workTextId,
    title,
    description
  );
  //saving file
  for (const file of images) {
    const filename = validateImage.generateFilename(file);
    const destFile = await Deno.open(
      path.join(Deno.cwd(), "public", filename),
      {
        create: true,
        write: true,
        truncate: true,
      }
    );
    await file.stream().pipeTo(destFile.writable);
    await model.addWorkImage(ctx.db, filename, file, username, workTextId);
  }
  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  ctx.response.body = "";
  return ctx;
};
