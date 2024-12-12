import { escapeHtml as e } from ".//helper.js";

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

const _showError = (error) =>
  error ? `<p class="Form-error">${e(error)}</p>` : ``;
const _layout = (content) => `<!DOCTYPE html>
      <html lang="en">
       <head>
       <meta charset="UTF-8">
       <meta name="v
       
       iewport" content="width=device-width, initial-scale=1.0">
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
