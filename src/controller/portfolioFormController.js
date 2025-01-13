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

  const username = checkUser.getLoggedInUser(ctx);

  const portfolioData = await model.getPortfolioByName(ctx.db, username);
  const thumbnailData = await model.getThumbnailByName(ctx.db, username);

  let actionForm = `action="/add"`;
  if (portfolioData[0] && thumbnailData[0]) {
    actionForm = `action="/edit"`;
  }

  const data = {
    title: queryParams.title || "",
    description: queryParams.description || "",
    about: queryParams.about || "",
    tags: queryParams.tags ? queryParams.tags.split("%2C") : [],
    skills: queryParams.skills ? queryParams.skills.split("%2C") : [],
  };

  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx.response.body = await ctx.nunjucks.render("PortfolioErstellen.html", {
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
  ctx = checkUser.isUserLoggedIn(ctx);

  const formData = await ctx.request.formData();

  const thumbnail = formData.get("thumbnail");
  const thumbnailError = validateImage.validateImage(thumbnail);

  const title = formData.get("title");
  const description = formData.get("description");
  const about = formData.get("about");
  const tags = formData.getAll("tags");
  const tagsString = tags.join(",");
  const skills = [];
  for (let i = 1; i <= 8; i++) {
    const skill = formData.get(`skill${i}`);
    if (skill && skill.trim() !== "") {
      skills.push(skill.trim());
    }
  }
  const skillsString = skills.join(",");

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

  //image saving
  model.addPortfolioUser(ctx.db, username);
  model.addPortfolioThumbnail(ctx.db, filename, thumbnail, username);

  //text saving
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
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
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
  ctx = checkUser.isUserLoggedIn(ctx);
  const username = checkUser.getLoggedInUser(ctx);
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

  const portfolioData = await model.getPortfolioByName(ctx.db, username);
  const thumbnailData = await model.getThumbnailByName(ctx.db, username);

  let data;
  if (queryParams > 0) {
    data = {
      title: queryParams.title || "",
      description: queryParams.description || "",
      about: queryParams.about || "",
      tags: queryParams.tags ? queryParams.tags.split("%2C") : [],
      skills: queryParams.skills ? queryParams.skills.split("%2C") : [],
      thumbnail: queryParams.title || "",
    };
  } else {
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
  if (portfolioData && thumbnailData) {
    actionForm = `action="/edit"`;
  }

  const variables = await checkUser.checkPortfolioAndProfile(ctx);

  ctx.response.body = await ctx.nunjucks.render("PortfolioErstellen.html", {
    errors,
    action: actionForm,
    data,
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const edit = async (ctx) => {
  ctx = checkUser.isUserLoggedIn(ctx);

  const formData = await ctx.request.formData();

  const thumbnail = formData.get("thumbnail");
  const thumbnailError = validateImage.validateImage(thumbnail);

  const title = formData.get("title");
  const description = formData.get("description");
  const about = formData.get("about");
  const tags = formData.getAll("tags");
  const tagsString = tags.join(",");
  const skills = [];
  for (let i = 1; i <= 8; i++) {
    const skill = formData.get(`skill${i}`);
    if (skill && skill.trim() !== "") {
      skills.push(skill.trim());
    }
  }
  const skillsString = skills.join(",");

  const errors = [];
  if (!title) errors.push("Du musst einen Titel eingeben.");
  if (!description) errors.push("Du musst eine Beschreibung eingeben.");
  if (!about) errors.push("Du musst eine Beschreibung über dich eingeben.");
  if (tagsString == "") errors.push("Du musst Tags auswählen.");
  if (skillsString == "") errors.push("Du musst deine Skills eingeben.");
  if (
    !thumbnailError == "" &&
    !thumbnailError == "Du musst ein Bild hochladen."
  )
    errors.push(thumbnailError);

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

  const username = checkUser.getLoggedInUser(ctx);

  //If user doesn't uplaod new image
  if (thumbnail.name) {
    const filename = validateImage.generateFilename(thumbnail);
    const destFile = await Deno.open(
      path.join(Deno.cwd(), "public", filename),
      {
        create: true,
        write: true,
        truncate: true,
      }
    );
    await thumbnail.stream().pipeTo(destFile.writable);

    //image saving
    model.updatePortfolioThumbnail(ctx.db, username, filename, thumbnail);
  }

  //text saving
  model.updatePortfolioText(
    ctx.db,
    title,
    about,
    description,
    skillsString,
    tagsString,
    username
  );

  ctx.response.status = 302;
  ctx.response.headers.set("Location", `/portfolio/username/${username}`);
  ctx.response.body = "";
  return ctx;
};
