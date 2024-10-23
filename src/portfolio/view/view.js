import { escapeHtml as e } from ".//helper.js";

export const index = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("index.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const error404 = async (ctx) => {
  /**TODO */
};

export const renderForm = async (ctx) => {
  let step = ` <form action="/add?step=one"
  method="post"
  accept-charset="utf-8"
  enctype="multipart/form-data" >
  <fieldset>
  <legend>Persönliche Daten</legend>
  <label for="name">Vorname</label>
  <input id="name" name="vorname" type="text" value="<VORGABE>">
  <label for="surname">Name</label>
  <input id="surname" name="name" type="text" value="<VORGABE>">
  </fieldset>
  <button type="submit" class="button-save">Speichern</button> </div>
  </form>`;

  const cookie = await ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentFormStep"];

  if (currentFormStep == "one") {
    step = ` <div
      class="upload-box"
      onclick="document.getElementById('file-input').click();"
    >
      <div class="top-text">Füge deinem Portfolio ein Titelbild hinzu.</div>
      <div class="center-content"></div>
      <img id="preview" class="preview-image" alt="Image Preview" />

      <div class="button-group_pfeile">
        <a href="index.html">
          <img class="pfeil-left" src="Bilder/pfeilL.png" alt="Zurück"
        /></a>
        <a href="addAboutYou.html">
          <img class="pfeil-right" src="Bilder/pfeilR.png" alt="Weiter"
        /></a>
      </div>

      <button class="button-save">Speichern</button>
    </div>`;
  }

  ctx.response.body = await ctx.nunjucks.render("test.html", {
    form: step,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

/*layout(
    `<form action="#" method="POST">
       <label for="date">Datum</label>
       <div>
      ${showError(formErrors.date)}
       <input type="datetime-local" id="date" name="date" value="${e(
         formData.date
       )}">
       </div>
       <label for="title">Titel</label>
       <div>
      ${showError(formErrors.title)}
       <input type="text" id="title" name="title" autofocus value="${e(
         formData.title
       )}">
       </div>
       <label for="text">Text</label>
       
       <div>
      ${showError(formErrors.text)}
       <textarea id="text" name="text" rows="8" cols="20">${e(
         formData.text
       )}</textarea>
       </div>
       <button type="submit">Speichern</button>
      </form>`);*/

const showError = (error) =>
  error ? `<p class="Form-error">${e(error)}</p>` : ``;
const layout = (content) => `<!DOCTYPE html>
      <html lang="en">
       <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Formular</title>
       <style>/* [...] */</style>
       </head>
       <body>
       <p>Notes</p>
       <h2>Available paths</h2>
       <nav><ul><li><a href="/">List of notes</a></li><!-- [...] --></ul></nav>
      ${content}
       </body>
      </html>`;
