import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";

export const error404 = (ctx) => {
  ctx.response.body = "<h1>404 - Page Not Found</h1>";
  ctx.response.status = 404;
};

let step = "";

export const renderForm = async (ctx) => {
  //step 1 - Titel
  step = `<h4>Kontaktdaten</h4>
  <div class="body_GridContact">
    <div class="container_contact">

      <div id="message-container"></div> 

      <form id="titelForm" action="/add?step=one" method="post">
      <fieldset>
        <label for="title">Titel:</label>
        <input type="text" id="title" name="title">
        </fieldset>
        <button type="submit" class="button-save">Speichern</button>
        </form>
  
    </div>`;

  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentFormStep"];

  //steps html
  if (currentFormStep == "one") {
    //About
    step = `<h4>About you</h4>

    <div class="upload-aboutYou">

    <div class="top-text"> Füge deinem Portfolio eine kurze Beschreibung über dich hinzu.</div>

    <form id="aboutYouForm" action="/add?step=two" method="POST">
    <fieldset>
        <textarea id="aboutYouTextarea" name="about" placeholder="Füge deinem Portfolio eine kurze Beschreibung über dich hinzu." style="display: block;"></textarea>
        <button type="submit" class="button-save">Speichern</button>
        </fieldset>
    </form>

    
    </div>`;
  }
  if (currentFormStep == "two") {
    //skills
    step = `<h4>Skills</h4>

    <div class="upload-aboutYou">

    <div class="top-text"> Füge deinem Portfolio Skills hinzu.</div>

          <form id="skillsForm" action="/add?step=three" method="POST">
    <fieldset>
        <textarea id="skills" name="skills" placeholder="Füge deinem Portfolio eine kurze Beschreibung über dich hinzu." style="display: block;"></textarea>
        <button type="submit" class="button-save">Speichern</button>
        </fieldset>
    </form>

    
    </div>`;
  }

  if (currentFormStep == "three") {
    //thumbnail
    step = `<h4>About you</h4>

<div class="upload-aboutYou">
    <div class="top-text">Füge deinem Portfolio ein Thumbnail hinzu.</div>

    <form action="/add?step=four" method="POST" enctype="multipart/form-data">
    
        <label for="thumbnail">Thumbnail</label>
        <input type="file" id="thumbnail" name="thumbnail">
        
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

let tempStorage = new FormData();

export const add = async (ctx) => {
  const step = ctx.url.searchParams.get("step");

  if (step === "four") {
    const formData = await ctx.request.formData();
    console.log(formData);
    const file = formData.get("thumbnail");
    const error = validateImage.validateImage(file);
    console.log(error);

    if (!error) {
      console.log("error");
      ctx.response.body = "<h1>error with image</h1>";
      ctx.response.status = 404;
      return ctx;
    } else {
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

      ctx = ctx.cookies.setFormStepCookie(ctx, step);

      ctx.response.status = 302;
      ctx.response.headers.set("Location", "/");
      ctx.response.body = "";
      return ctx;
    }
  } else {
    const formData = await ctx.request.formData();

    for (const [key, value] of formData.entries()) {
      tempStorage.append(key, value);
    }

    if (step === "three") {
      const _dataText = {
        title: tempStorage.get("title"),
        about: tempStorage.get("aboutYouTextarea"),
        skills: tempStorage.get("skills"),
      };
      //get user from cookie
      //add to databank
    }
    ctx = ctx.cookies.setFormStepCookie(ctx, step);

    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/portfolio/erstellen");
    ctx.response.body = "";
    return ctx;
  }
};
