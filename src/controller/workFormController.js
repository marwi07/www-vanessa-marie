import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as model from "../model/workPortfolioModel.js";

export const error404 = (ctx) => {
  ctx.response.body = "<h1>404 - Page Not Found</h1>";
  ctx.response.status = 404;
};

let step = "";
let workTextId = 0;

export const renderWorkForm = async (ctx) => {
  //step 1 - Titel
  step = `<div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Titel</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="titelForm" action="/addWork?step=one" method="post">
        <textarea maxlength="1000" id="title" name="title" placeholder="Füge deiner Arbeit einen Titel hinzu."></textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;

  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentWorkFormStep"];

  //steps html
  if (currentFormStep == "one") {
    //BEschreibung
    step = `<div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Beschreibung</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="descriptionForm" action="/addWork?step=two" method="POST">
        <textarea maxlength="1000" id="description" name="description" placeholder="Füge deiner Arbeit eine Beschreibung hinzu."></textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;
  }

  if (currentFormStep == "two") {
    //Bilder
    step = `
    <div class="upload-yourWorkimg">

      <h4>Bilder</h4>
 
    <form action="/addWork?step=three" method="POST" enctype="multipart/form-data">

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

let tempStorage = new FormData();
let formData;

export const add = async (ctx) => {
  let step = ctx.url.searchParams.get("step");

  //Image upload
  if (step === "three") {
    tempStorage = new FormData();
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
          model.addWorkImage(
            ctx.db,
            filename,
            file[1],
            username,
            workTextId[0][0]
          );
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
        const _workInfo = await model.addWorkInfo(
          ctx.db,
          tempStorage,
          username
        );
        workTextId = await model.getIdByName(ctx.db, username);
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
    }
    ctx = ctx.cookies.setWorkFormStepCookie(ctx, step);

    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/portfolio/arbeiten/erstellen");
    ctx.response.body = "";
    return ctx;
  }
};

export const deleteWork = async (ctx) => {};

export const renderWorkEditForm = async (ctx) => {
  //step 1 - Titel
  step = `<div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Titel</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="titelForm" action="/addWork?step=one" method="post">
        <textarea maxlength="1000" id="title" name="title" placeholder="Füge deiner Arbeit einen Titel hinzu."></textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;

  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentWorkFormStep"];

  //steps html
  if (currentFormStep == "one") {
    //BEschreibung
    step = `<div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Beschreibung</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="descriptionForm" action="/addWork?step=two" method="POST">
        <textarea maxlength="1000" id="description" name="description" placeholder="Füge deiner Arbeit eine Beschreibung hinzu."></textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;
  }

  if (currentFormStep == "two") {
    //Bilder
    step = `
    <div class="upload-yourWorkimg">

      <h4>Bilder</h4>
 
    <form action="/addWork?step=three" method="POST" enctype="multipart/form-data">

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
          model.addWorkImage(
            ctx.db,
            filename,
            file[1],
            username,
            workTextId[0][0]
          );
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
        const _workInfo = await model.addWorkInfo(
          ctx.db,
          tempStorage,
          username
        );
        workTextId = await model.getIdByName(ctx.db, username);
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
    }
    ctx = ctx.cookies.setWorkFormStepCookie(ctx, step);

    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/portfolio/arbeiten/erstellen");
    ctx.response.body = "";
    return ctx;
  }
};
