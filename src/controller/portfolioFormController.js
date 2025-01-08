import * as validateImage from "../utility/validateImageUpload.js";
import * as path from "https://deno.land/std@0.163.0/path/mod.ts";
import * as model from "../model/portfolioModel.js";
import * as checkUser from "../middleware/userLoginStatus.js";

export const error404 = (ctx) => {
  ctx.response.body = "<h1>404 - Page Not Found</h1>";
  ctx.response.status = 404;
};

let step = "";

export const renderForm = async (ctx) => {
  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  const cookieUser = ctx.cookies.getCookie(ctx);
  const username = cookieUser["username"];
  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentFormStep"];

  if (!username) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  //step 1 - Titel
  step = `
    <div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Titel</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="titelForm" action="/add?step=one" method="post">
        <textarea maxlength="1000" id="title" name="title" placeholder="Füge deinem Portfolio einen Titel hinzu."></textarea>
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

      <form id="descriptionForm" action="/add?step=two" method="POST">
        <textarea maxlength="1000" id="description" name="description" placeholder="Füge deinem Portfolio eine Beschreibung hinzu."></textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;
  }

  if (currentFormStep == "two") {
    //About
    step = `<div class="upload-aboutYou" >

    <div class="header-container"> 
        <h4>About You</h4>
    </div>

    <div id="message-container"> </div>

    <form id="aboutYouForm" action="/add?step=three" method="POST">
        <textarea maxlength="1000" id="aboutYouTextarea" name="about" placeholder="Füge deinem Portfolio eine kurze Beschreibung über dich hinzu." style="display: block;"></textarea>
       <button type="submit" class="button-save-aboutyou">Speichern</button>
    </form>

</div>`;
  }

  if (currentFormStep == "three") {
    //Tags
    step = `<div class="body_GridSkills">
      <div class="container_skills">
          <div class="header-container">
          <h4>Skills</h4>
      </div>

       <!-- Skills Form -->
        <form id="skillsForm" action="/add?step=four" method="POST">
          <div class="skills-grid"> 

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill1" name="skill1">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill2" name="skill2">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill3" name="skill3">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill4" name="skill4">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill5" name="skill5">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill6" name="skill6">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill7" name="skill7">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill8" name="skill8">
          </div>
          </div>
          <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
      </div>
    </div>`;
  }

  if (currentFormStep == "four") {
    //tags
    step = `
  <div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Tags</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

       <form action="/add?step=five" method="POST" enctype="multipart/form-data">
        <div>
        <label class="custom-checkbox">
          <input type="checkbox" name="tags" value="3D-Animation"> 
          <span class="checkmark"></span>3D-Animation
        </label>

        <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="3D-Animation"> 
            <span class="checkmark"></span>Motion Graphics
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="3D-Animation"> 
            <span class="checkmark"></span>Softwareentwicklung
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="3D-Animation"> 
            <span class="checkmark"></span>2D-Art
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="3D-Animation"> 
            <span class="checkmark"></span>Animation
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="3D-Animation"> 
            <span class="checkmark"></span>Webdesign
          </label>
      </div>
      
          <button type="submit" class="button-save-aboutyou">Speichern</button>
      </form>

   </div>
   </div>`;
  }

  if (currentFormStep == "five") {
    //thumbnail
    step = `
    <div class="upload-Gridthumbnail">

      <div class="header-container">

        <h4>Titelbild</h4>
        
      </div>

      <form action="/add?step=six" method="POST" enctype="multipart/form-data">

          <label for="thumbnail" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
          </label>
          
      
        <input type="file" id="thumbnail" name="thumbnail" accept="image/*">

        <button type="submit" class="button-save">Speichern</button>
      </form>
 
  </div>`;
  }

  //render page with html of step
  ctx.response.body = await ctx.nunjucks.render("PortfolioErstellen.html", {
    form: step,
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

let tempStorage = new FormData();
let formData;
let skillsString = "";
let tagsString = "";

export const add = async (ctx) => {
  let step = ctx.url.searchParams.get("step");

  //Image upload
  if (step === "six") {
    const formData = await ctx.request.formData();
    const file = formData.get("thumbnail");
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
        model.addPortfolioUser(ctx.db, username);

        model.addPortfolioThumbnail(ctx.db, filename, file, username);

        ctx = ctx.cookies.setFormStepCookie(ctx, step);

        tempStorage = new FormData();

        ctx.response.status = 302;
        ctx.response.headers.set("Location", "/");
        ctx.response.body = "";
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
      step = "";
      return ctx;
    }

    //Text Upload
  } else {
    formData = await ctx.request.formData();

    //Logik fur einfaches Speichern von Skills
    if (step == "four") {
      const skills = [];
      for (let i = 1; i <= 8; i++) {
        const skill = formData.get(`skill${i}`);
        if (skill && skill.trim() !== "") {
          skills.push(skill.trim());
        }
      }
      skillsString = skills.join(",");
    }
    //Logik fur Speichern von Tags
    if (step == "five") {
      const tags = formData.getAll("tags");
      tagsString = tags.join(",");
    } else {
      for (const [key, value] of formData.entries()) {
        tempStorage.append(key, value);
      }
    }

    if (step === "five") {
      const cookie = ctx.cookies.getCookie(ctx);
      const username = await cookie["username"];

      if (username) {
        model.addPortfolioInfo(
          ctx.db,
          tempStorage,
          skillsString,
          tagsString,
          username
        );
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
    }
    ctx = ctx.cookies.setFormStepCookie(ctx, step);

    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/portfolio/erstellen");
    ctx.response.body = "";
    return ctx;
  }
};

export const deletePortfolio = async (ctx) => {
  const cookieUser = ctx.cookies.getCookie(ctx);
  const username = cookieUser["username"];

  if (!username) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }
  await model.deletePortfolioTextByName(ctx.db, username);
  await model.deletePortfolioThumbnailByName(ctx.db, username);

  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/");
  return ctx;
};

export const renderEditPortfolio = async (ctx) => {
  const cookieUser = ctx.cookies.getCookie(ctx);
  const username = cookieUser["username"];

  if (!username) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  const portfolioInfo = await model.getPortfolioByName(ctx.db, username);

  const cookie = ctx.cookies.getCookie(ctx);
  const currentFormStep = cookie["currentEditWorkFormStep"];

  //step 1 - Titel
  step = `
    <div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Titel</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

      <form id="titelForm" action="/editPortfolio?step=one" method="post">
        <textarea maxlength="1000" id="title" name="title" placeholder="Füge deinem Portfolio einen Titel hinzu.">${portfolioInfo[0][1]}</textarea>
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

      <form id="descriptionForm" action="/editPortfolio?step=two" method="POST">
        <textarea maxlength="1000" id="description" name="description" placeholder="Füge deinem Portfolio eine Beschreibung hinzu.">${portfolioInfo[0][4]}</textarea>
        <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
    </div>`;
  }

  if (currentFormStep == "two") {
    //About
    step = `<div class="upload-aboutYou" >

    <div class="header-container"> 
        <h4>About You</h4>
    </div>

    <div id="message-container"> </div>

    <form id="aboutYouForm" action="/editPortfolio?step=three" method="POST">
        <textarea maxlength="1000" id="aboutYouTextarea" name="about" placeholder="Füge deinem Portfolio eine kurze Beschreibung über dich hinzu." style="display: block;">${portfolioInfo[0][2]}</textarea>
       <button type="submit" class="button-save-aboutyou">Speichern</button>
    </form>

</div>`;
  }

  if (currentFormStep == "three") {
    //Tags
    const skillArray = portfolioInfo[0][3].split(",");

    step = `<div class="body_GridSkills">
      <div class="container_skills">
          <div class="header-container">
          <h4>Skills</h4>
      </div>

       <!-- Skills Form -->
        <form id="skillsForm" action="/editPortfolio?step=four" method="POST">
          <div class="skills-grid"> 

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill1" name="skill1" value="${skillArray[0]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill2" name="skill2 value="${skillArray[1]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill3" name="skill3 value="${skillArray[2]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill4" name="skill4 value="${skillArray[3]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill5" name="skill5 value="${skillArray[4]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill6" name="skill6 value="${skillArray[5]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill7" name="skill7 value="${skillArray[6]}">
          </div>

          <div class="skills-item">
            <label for="skill1">Skill:</label>
            <input maxlength="30" type="text" id="skill8" name="skill8 value="${skillArray[7]}">
          </div>
          </div>
          <button type="submit" class="button-save-aboutyou">Speichern</button>
        </form>
      </div>
    </div>`;
  }

  if (currentFormStep == "four") {
    //tags
    step = `
  <div class="upload-aboutYou" >

    <div class="header-container">

        <h4>Tags</h4>
    </div>

    <div id="Beschreibung Portfolio"> </div>

       <form action="/editPortfolio?step=five" method="POST" enctype="multipart/form-data">
        <div>
        <label class="custom-checkbox">
          <input type="checkbox" name="tags" value="3D-Animation"> 
          <span class="checkmark"></span>3D-Animation
        </label>

        <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="Motion Graphics"> 
            <span class="checkmark"></span>Motion Graphics
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="Softwareentwicklung"> 
            <span class="checkmark"></span>Softwareentwicklung
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="2D-Art"> 
            <span class="checkmark"></span>2D-Art
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="3D-Animation"> 
            <span class="checkmark"></span>Animation
          </label>

          <label class="custom-checkbox">
            <input type="checkbox" name="tags" value="Webdesign"> 
            <span class="checkmark"></span>Webdesign
          </label>
      </div>
      
          <button type="submit" class="button-save-aboutyou">Speichern</button>
      </form>

   </div>
   </div>`;
  }

  if (currentFormStep == "five") {
    //thumbnail
    step = `
    <div class="upload-Gridthumbnail">

      <div class="header-container">

        <h4>Titelbild</h4>
        
      </div>

      <form action="/editPortfolio?step=six" method="POST" enctype="multipart/form-data">

          <label for="thumbnail" class="upload-label">Klicke hier um ein Bild hochzuladen.
            <i class="material-icons profil-icon">add_a_photo</i>
          </label>
          
      
        <input type="file" id="thumbnail" name="thumbnail" accept="image/*">

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

export const edit = async (ctx) => {
  let step = ctx.url.searchParams.get("step");

  //Image upload
  if (step === "six") {
    const formData = await ctx.request.formData();
    const file = formData.get("thumbnail");
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
        await model.updatePortfolioThumbnail(ctx.db, username, filename, file);

        ctx = ctx.cookies.setEditFormStepCookie(ctx, step);

        tempStorage = new FormData();

        ctx.response.status = 302;
        ctx.response.headers.set("Location", "/");
        ctx.response.body = "";
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
      step = "";
      return ctx;
    }

    //Text Upload
  } else {
    formData = await ctx.request.formData();

    //Logik fur einfaches Speichern von Skills
    if (step == "four") {
      const skills = [];
      for (let i = 1; i <= 8; i++) {
        const skill = formData.get(`skill${i}`);
        if (skill && skill.trim() !== "") {
          skills.push(skill.trim());
        }
      }
      skillsString = skills.join(",");
    }
    //Logik fur Speichern von Tags
    if (step == "five") {
      const tags = formData.getAll("tags");
      tagsString = tags.join(",");
    } else {
      for (const [key, value] of formData.entries()) {
        tempStorage.append(key, value);
      }
    }

    if (step === "five") {
      const cookie = ctx.cookies.getCookie(ctx);
      const username = await cookie["username"];

      if (username) {
        await model.updatePortfolioText(
          ctx.db,
          username,
          tempStorage,
          skillsString,
          tagsString
        );
      } else {
        ctx.response.body = "<h1>no user found logged in</h1>";
        ctx.response.status = 404;
      }
    }
    ctx = ctx.cookies.setEditFormStepCookie(ctx, step);

    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/portfolio/bearbeiten");
    ctx.response.body = "";
    return ctx;
  }
};
