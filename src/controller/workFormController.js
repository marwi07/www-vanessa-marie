import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as model from "../model/workPortfolioModel.js";
import * as checkUser from "../middleware/userLoginStatus.js";

let workTextId;
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

  const actionForm = `action="/addWork"`;

  const data = {
    title: queryParams.title || "",
    description: queryParams.description || "",
  };

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

let userId = 0;
export const renderWorkEditForm = async (ctx, id) => {
  userId = id;
  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentWorkFormStep"];
  const username = cookie["username"];
  const dataText = await model.getWorkTextByName(ctx.db, username);

  //step 1 - Titel
  step = `<div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Titel</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="titelForm" action="/editWork?step=one" method="post">
        <textarea maxlength="1000" id="title" name="title" placeholder="Füge deiner Arbeit einen Titel hinzu.">${dataText[0][0]}</textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;

  //steps html
  if (currentFormStep == "one") {
    //BEschreibung
    step = `<div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Beschreibung</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="descriptionForm" action="/editWork?step=two" method="POST">
        <textarea maxlength="1000" id="description" name="description" placeholder="Füge deiner Arbeit eine Beschreibung hinzu.">${dataText[0][1]}</textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;
  }

  if (currentFormStep == "two") {
    //Bilder
    step = `
    <div class="upload-yourWorkimg">

      <h4>Bilder</h4>
 
    <form action="/editWork?step=three" method="POST" enctype="multipart/form-data">

      <div class="row" id="gallery">

      <div class="column">
          <label for="image1" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image1" name="image1" accept="image/">
            </label>
          </div>

                <div class="column">
          <label for="image2" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image2" name="image2" accept="image/">
            </label>
          </div>

                <div class="column">
          <label for="image3" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image3" name="image3" accept="image/">
            </label>
          </div>

                <div class="column">
          <label for="image4" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image4" name="image4" accept="image/">
            </label>
          </div>

                <div class="column">
          <label for="image5" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image5" name="image5" accept="image/">
            </label>
          </div>

                <div class="column">
          <label for="image6" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image6" name="image6" accept="image/">
            </label>
          </div>

                <div class="column">
          <label for="image7" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image7" name="image7" accept="image/">
            </label>
          </div>

      <div class="column">
      <label for="image8" class="upload-label">Klicke hier um ein Bild hochzuladen.
        <i class="material-icons profil-icon">add_a_photo</i>
        <input type="file" id="image8" name="image8" accept="image/">
        </label>
         </div>
          </div>
            <div class="button-save-container">
            <button type="submit" class="button-save-yourwork">Speichern</button>
          </div>
          </form>
        </div>`;
  }

  //render page with html of step
  ctx.response.body = await ctx.nunjucks.render("PortfolioErstellen.html", {
    form: step,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const edit = async (ctx) => {
  let step = ctx.url.searchParams.get("step");

  //Image upload
  if (step === "three") {
    tempStorage = new FormData();
    //delete old images
    const _deletedImages = await model.deleteImagesByTextId(ctx.db, userId);

    //save each image,  as well as validate etc. with user Info
    const formData = await ctx.request.formData();
    for (const file of formData) {
      if (!file[1] || file[1] === "") {
        continue;
      }
      const error = validateImage.validateImage(file[1]);
      if (!error) {
        ctx.response.body = "<h1>error with image</h1>";
        ctx.response.status = 404;
        return ctx;
      } else {
        //saving file
        const filename = validateImage.generateFilename(file[1]);
        const destFile = await Deno.open(
          path.join(Deno.cwd(), "public", filename),
          {
            create: true,
            write: true,
            truncate: true,
          }
        );
        await file[1].stream().pipeTo(destFile.writable);
        const cookie = ctx.cookies.getCookie(ctx);
        const username = cookie["username"];
        if (username) {
          await model.addWorkImage(ctx.db, filename, file[1], username, userId);
        } else {
          ctx.response.body = "<h1>no user found logged in</h1>";
          ctx.response.status = 404;
        }
      }
    }
    step = "";
    ctx = ctx.cookies.setWorkFormStepCookie(ctx, step);
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    ctx.response.body = "";
    return ctx;

    //Text Upload
  } else {
    formData = await ctx.request.formData();

    for (const [key, value] of formData.entries()) {
      tempStorage.append(key, value);
    }

    if (step === "two") {
      const cookie = ctx.cookies.getCookie(ctx);
      const username = cookie["username"];
      if (username) {
        const _workInfo = await model.updateWorkTextById(
          ctx.db,
          userId,
          tempStorage
        );
        console.log(_workInfo);
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
    }
    ctx = ctx.cookies.setWorkFormStepCookie(ctx, step);

    ctx.response.status = 302;
    ctx.response.headers.set(
      "Location",
      `/portfolio/arbeiten/bearbeiten/${userId}`
    );
    ctx.response.body = "";
    return ctx;
  }
};
