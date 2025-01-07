import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as model from "../model/workPortfolioModel.js";

export const error404 = (ctx) => {
  ctx.response.body = "<h1>404 - Page Not Found</h1>";
  ctx.response.status = 404;
};

let step = "";

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
 
    <div class="row" id="gallery">
      
      <div class="column">
        <form action="/addWork?step=three" method="POST" enctype="multipart/form-data">

          <label for="image1" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>

            <input type="file" id="image1" name="image1" accept="image/*">

            </label>

             <label for="image2" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
            <input type="file" id="image2" name="image2" accept="image/*">
            </label>
            <button type="submit" class="button-save">Speichern</button>
           
          </form>
    </div>
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

  console.log(step);

  //Image upload
  if (step === "three") {
    tempStorage = new FormData();
    //save each image,  as well as validate etc. with user Info
    const formData = await ctx.request.formData();

    for (const file of formData) {
      console.log(file[1]);
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
          model.addWorkImage(ctx.db, filename, file[1], username);
        } else {
          ctx.response.body = "<h1>no user found logged in</h1>";
          ctx.response.status = 404;
        }
      }
    }
    ctx = ctx.cookies.setFormStepCookie(ctx, step);
    step = "";
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    ctx.response.body = "";

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
        model.addWorkInfo(ctx.db, tempStorage, username);
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
