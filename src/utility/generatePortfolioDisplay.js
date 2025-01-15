import * as modelPortfolio from "../model/portfolioModel.js";

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
