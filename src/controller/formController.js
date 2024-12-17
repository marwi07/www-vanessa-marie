export const error404 = (ctx) => {
  ctx.response.body = "<h1>404 - Page Not Found</h1>";
  ctx.response.status = 404;
};

export const renderForm = async (ctx) => {
  //step 1 - Titel ?
  let step = `<h4>Kontaktdaten</h4>
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

  console.log(tempStorage);

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

  if (currentFormStep == "three") {
    //thumbnail
    step = `<h4>About you</h4>

    <div class="upload-aboutYou">

    <div class="top-text"> Füge deinem Portfolio eine kurze Beschreibung über dich hinzu.</div>

    <form id="aboutYouForm" action="/add?step=two" method="POST">
    <fieldset>
        <textarea id="aboutYouTextarea" name="about" placeholder="Füge deinem Portfolio eine kurze Beschreibung über dich hinzu." style="display: block;"></textarea>
        </fieldset>
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
  const formData = await ctx.request.formData();
  const step = ctx.url.searchParams.get("step");

  //adding new formdata on top of temp Object
  for (const [key, value] of formData.entries()) {
    tempStorage.append(key, value);
  }

  //if is final step save data in databank
  if (step === "two") {
    const dataText = {
      title: tempStorage.get("title"),
      about: tempStorage.get("about"),
    };
    //get User from cookies
    //validate formdata
    //save with User in Databank
  } else {
    ctx = ctx.cookies.setFormStepCookie(ctx, step);
    console.log(ctx);

    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/portfolio/erstellen");
    ctx.response.body = "";
  }
  return ctx;
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
