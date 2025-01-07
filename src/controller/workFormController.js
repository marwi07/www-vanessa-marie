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
  step = `<h4>Kontaktdaten</h4>
  <div class="body_GridContact">
    <div class="container_contact">

      <div id="message-container"></div> 

      <form id="titelForm" action="/addWork?step=one" method="post">
      <fieldset>
        <label for="title">Titel:</label>
        <input type="text" id="title" name="title">
        </fieldset>
        <button type="submit" class="button-save">Speichern</button>
        </form>
  
    </div>`;

  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentWorkFormStep"];

  //steps html
  if (currentFormStep == "one") {
    //BEschreibung
    step = `<h4>Beschreibung</h4>

    <div class="upload-aboutYou">

    <div class="top-text"> Füge deinem Portfolio eine kurze Beschreibung hinzu.</div>

    <form id="descriptionForm" action="/addWork?step=two" method="POST">
    <fieldset>
        <textarea id="aboutYouTextarea" name="description" placeholder="Füge deinem Portfolio eine kurze Beschreibung über dich hinzu." style="display: block;"></textarea>
        <button type="submit" class="button-save">Speichern</button>
        </fieldset>
    </form>

    
    </div>`;
  }

  if (currentFormStep == "two") {
    //Bilder
    step = `<h4>About you</h4>

<div class="upload-aboutYou">
    <div class="top-text">Füge deinem Portfolio ein Thumbnail hinzu.</div>

    <form action="/addWork?step=three" method="POST" enctype="multipart/form-data">

        <label for="thumbnail">Thumbnail</label>
        <input type="file" id="thumbnail1" name="thumbnail1">
        <label for="thumbnail">Thumbnail</label>
        <input type="file" id="thumbnail2" name="thumbnail2">
        <label for="thumbnail">Thumbnail</label>
        <input type="file" id="thumbnail3" name="thumbnail3">
        <label for="thumbnail">Thumbnail</label>
        <input type="file" id="thumbnail4" name="thumbnail4">
        <label for="thumbnail">Thumbnail</label>
        <input type="file" id="thumbnail5" name="thumbnail5">
        
        <button type="submit" class="button-save">Speichern</button>
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

const tempStorage = new FormData();
let formData;

export const add = async (ctx) => {
  let step = ctx.url.searchParams.get("step");

  //Image upload
  if (step === "three") {
    //save each image,  as well as validate etc. with user Info
    const formData = await ctx.request.formData();
    for (const file of formData.entries()) {
      const error = validateImage.validateImage(file);
      if (!error) {
        ctx.response.body = "<h1>error with image</h1>";
        ctx.response.status = 404;
        return ctx;
      } else {
        //saving file
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
        const cookie = ctx.cookies.getCookie(ctx);
        const username = cookie["username"];
        if (username) {
          model.addWorkImage(ctx.db, filename, file, username);
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
    ctx.response.headers.set("Location", "/arbeiten/erstellen");
    ctx.response.body = "";
    return ctx;
  }
};
