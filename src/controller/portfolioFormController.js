import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as model from "../model/portfolioModel.js";
import * as checkUser from "../middleware/userLoginStatus.js";

export const renderForm = async (ctx) => {
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

  const data = {
    title: queryParams.title || "",
    description: queryParams.description || "",
    about: queryParams.about || "",
    tags: queryParams.tags ? queryParams.tags.split("%2C") : [],
    skills: queryParams.skills ? queryParams.skills.split("%2C") : [],
    thumbnail: queryParams.title || "",
  };

  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx.response.body = await ctx.nunjucks.render("PortfolioErstellen.html", {
    errors,
    data,
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

let formData;
let skillsString = "";
let tagsString = "";

export const add = async (ctx) => {
  ctx = checkUser.isUserLoggedIn(ctx);

  const formData = await ctx.request.formData();

  const thumbnail = formData.get("thumbnail");
  const thumbnailError = validateImage.validateImage(thumbnail);

  const title = formData.get("title");
  const description = formData.get("description");
  const about = formData.get("about");
  const tags = formData.getAll("tags");
  tagsString = tags.join(",");
  const skills = [];
  for (let i = 1; i <= 8; i++) {
    const skill = formData.get(`skill${i}`);
    if (skill && skill.trim() !== "") {
      skills.push(skill.trim());
    }
  }
  skillsString = skills.join(",");

  const errors = [];
  if (!title) errors.push("Du musst einen Titel eingeben.");
  if (!description) errors.push("Du musst eine Beschreibung eingeben.");
  if (!about) errors.push("Du musst eine Beschreibung über dich eingeben.");
  if (tagsString == "") errors.push("Du musst Tags auswählen.");
  if (skillsString == "") errors.push("Du musst deine Skills eingeben.");
  if (!thumbnailError == "") errors.push(thumbnailError);

  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      title: encodeURIComponent(title || ""),
      description: encodeURIComponent(description || ""),
      about: encodeURIComponent(about || ""),
      tags: encodeURIComponent(tagsString),
      skills: encodeURIComponent(skillsString),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set("Location", `/portfolio/erstellen?${queryParams}`);
    ctx.response.body = "";
    return ctx;
  }

  const filename = validateImage.generateFilename(thumbnail);
  const destFile = await Deno.open(path.join(Deno.cwd(), "public", filename), {
    create: true,
    write: true,
    truncate: true,
  });
  await thumbnail.stream().pipeTo(destFile.writable);

  const username = checkUser.getLoggedInUser(ctx);

  console.log(username);

  //image
  model.addPortfolioUser(ctx.db, username);

  model.addPortfolioThumbnail(ctx.db, filename, thumbnail, username);

  //text
  model.addPortfolioInfo(
    ctx.db,
    title,
    about,
    description,
    skillsString,
    tagsString,
    username
  );

  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/${username}`);
  ctx.response.body = "";
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

export const renderEditPortfolio = async (ctx) => {
  const cookieUser = ctx.cookies.getCookie(ctx);
  const username = cookieUser["username"];

  if (!username) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  const portfolioInfo = await model.getPortfolioByName(ctx.db, username);

  //render page with html of step
  ctx.response.headers.set("Location", `/portfolio/user/${username}`);
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
