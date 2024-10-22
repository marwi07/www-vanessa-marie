import { escapeHtml as e } from ".//helper.js";

export const index = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("index.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const renderForm = async (ctx /*formData, formErrors*/) => {
  let html = `<form action="/add?step=one" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  <button type="submit">Next</button> </form>`;

  ctx.response.body = await ctx.nunjucks.render("index.html", {
    title: "Test",
    form: html,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const renderFormSteps = async (ctx /*formData, formErrors*/) => {
  let html = `<form action="/add?step=two" method="POST">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  <button type="submit">Next</button> </form>`;

  ctx.response.body = await ctx.nunjucks.render("index.html", {
    title: "Test",
    form: html,
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
