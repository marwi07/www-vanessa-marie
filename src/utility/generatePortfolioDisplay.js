import * as modelPortfolio from "../model/portfolioModel.js";
import * as userModel from "../model/userModel.js";
import * as portfolioModel from "../model/portfolioModel.js";
import * as workModel from "../model/workPortfolioModel.js";
import * as checkUser from "../utility/userLoginStatus.js";

export const generatePortfolios = async (ctx) => {
  let portfolioData = await modelPortfolio.indexText(ctx.db);
  let html = "";
  const portfolioArray = [];
  //Filtern nach Tags wenn in URL vorhanden
  const tagsMatch = ctx.url.searchParams.get("tags");
  if (tagsMatch != null) {
    for (const entry of portfolioData) {
      //Mehrere Tags als String gespeichert - deswegen trennen nach ,
      const tags = entry[5].split(",");
      for (const tag of tags) {
        if (tag == tagsMatch) {
          portfolioArray.push(entry);
        }
      }
    }
    portfolioData = portfolioArray;
  }

  //Fur alle Eintrage wird mit gespeichrten Thumbnail html Eintrag generiert
  for (const element of portfolioData) {
    const thumbnail = await modelPortfolio.getThumbnailByName(
      ctx.db,
      element[0]
    );

    const object = {
      username: element[0],
      title: element[1],
      description: element[4],
      imagePath: thumbnail[0][1],
    };

    html += `<div class="Portfolio">
          <div class="text-section">
            <p class="username">_____________________________${object.username}</p>

            <h2 class="titel">${object.title}</h2>

            <p class="beschreibung">
              ${object.description}
            </p>

            <a class="btn readmore" href="portfolio/username/${object.username}"
              >Read more <i class="material-icons pfeil">trending_flat</i></a
            >
          </div>

          <div class="image-section">
            <img src="${object.imagePath}" alt="Bildbeschreibung" />
          </div>
        </div>`;
  }
  return html;
};

export const generateDetailPortfolios = async (ctx, username) => {
  let variables = {};
  const nameCurrentUser = checkUser.getLoggedInUser(ctx);
  const varHtmlMenu = await checkUser.checkPortfolioAndProfile(ctx);
  const thumbnailInfo = await portfolioModel.getThumbnailByName(
    ctx.db,
    username
  );

  const userInfo = await userModel.getInfoByUser(ctx.db, username);

  const thumbnailPath = thumbnailInfo[0][1];
  const thumbnail = `<img
            id="Thumbnail"
            class="PortfolioDetailSite_image-section"
            src="${thumbnailPath}"
            alt="ThumbnailPortfolio"
          />`;

  const editMsgPortfolio = `  
  <a
              class="button-group_portfolio_button"
              href="/portfolio/bearbeiten"
              >Bearbeiten</a
            >

            <a class="button-group_portfolio_button" href="/portfolio/entfernen"
              onclick="return confirmDelete()">Löschen</a
            > 
            
            <script>
            function confirmDelete() {
              return confirm("Are you sure you want to delete this item?");
            }
          </script>`;

  //PortfolioInfo
  const portfolioInfo = await portfolioModel.getPortfolioByName(
    ctx.db,
    username
  );

  //seperate tags into individual strings
  const tagArray = portfolioInfo[0][5].split(",");
  let tags = "";
  for (const element of tagArray) {
    tags += `<span class="tag">${element}</span>`;
  }

  //seperate skills into individual strings
  const skillArray = portfolioInfo[0][3].split(",");
  let skills = "";
  for (const element of skillArray) {
    skills += ` <li>${element}</li>`;
  }

  //Work fill for each entry
  const workData = await workModel.getWorkTextByName(ctx.db, username);
  let workFull = ``;
  for (const element of workData) {
    //Titel
    workFull += ` <h3>${element[0]}</h3>
  
            <div class="YourWork-text-section">
              <div class="row" id="gallery">`;

    //if it's users profile - Löschen/Bearbeiten Button
    if (nameCurrentUser === element[2]) {
      workFull += `<div class="button-group-yourWork">
      <a class="button-yourWork" href="/portfolio/arbeiten/bearbeiten/${element[3]}">
        Bearbeiten
      </a>

      <a onclick="return confirmDelete()" class="button-yourWork" href="/portfolio/arbeiten/entfernen/${element[3]}">
        Löschen
      </a>
    </div>
    <script>
    function confirmDelete() {
      return confirm("Are you sure you want to delete this item?");
    }
  </script>`;
    }

    //Bilder
    const workImages = await workModel.getImagesById(ctx.db, element[3]);

    for (const image of workImages) {
      workFull += ` <div class="column">
                  <img src="${image[1]}" alt="Bild" />
                </div>`;
    }

    //Beschreibung
    workFull += `</div>
            </div>
            <p id="Beschreibung-YourWork">${element[1]}</p>
          `;
  }

  //If User
  const workEdit = `
   <div class="upload-container-yourwork">
      <div class="upload-box-YourWork">

      <a href="/portfolio/arbeiten/erstellen" class="upload-box-YourWork">Füge deinem Portfolio deine Arbeiten hinzu.
      <i  class="material-icons">add_circle</i>
      </a>
    </div>
    </div> `;

  variables = {
    account: varHtmlMenu.account,
    portfolioMenu: varHtmlMenu.portfolio,
    title: portfolioInfo[0][1],
    thumbnail: thumbnail,
    description: portfolioInfo[0][4],
    about: portfolioInfo[0][2],
    tags: tags,
    skills: skills,
    name: username,
    work: workFull,
  };

  if (userInfo.length !== 0) {
    variables.name = username;
    variables.mail = userInfo[0][0];
    variables.telephone = userInfo[0][1];
    variables.address = userInfo[0][4];
    variables.extra = userInfo[0][2];
  }

  if (portfolioInfo[0][0] == nameCurrentUser) {
    variables.editWork = workEdit;
    variables.editPortfolio = editMsgPortfolio;
  }
  return variables;
};
