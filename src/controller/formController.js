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

let tempStorage = new FormData();

export const add = async (ctx) => {
  const formData = await ctx.request.formData();
  const step = ctx.url.searchParams.get("step");

  for (const [key, value] of formData.entries()) {
    tempStorage.append(key, value);
  }

  if (step === "one") {
    //console.log(tempStorage);
    ctx = await ctx.cookies.setFormStepCookie(ctx, step);
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/test.html");
    ctx.response.body = null;
    return ctx;
  }

  if (step === "final") {
    const dataText = {
      name: tempStorage.get("name"),
    };

    /** for each image save in databank
     * step als cookie speichern
     * in view auslesen und beim nächsten step weitermachen
     */
  }
};

/**export const create = async (ctx) => {
  const formData = await extractFormData(ctx.request);
  const formError = validate(formData);
  if (hasAnyKey(formError)) {
    ctx.response.body = await view.renderForm(formData, formError);
    ctx.response.headers.set("content-type", "text/html");
    ctx.response.status = 200;
  } else {
    model.add(ctx.db, formData);
    ctx.response.headers.set("location", "/");
    ctx.response.status = 303;
  }
  return ctx;
}; */
