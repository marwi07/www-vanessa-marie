import * as modelPortfolio from "../model/portfolioModel.js";

export const checkPortfolioAndProfile = async (ctx) => {
  const profile = await profileDisplayCheck(ctx);
  const portfolio = await portfolioDisplayCheck(ctx);

  const variables = {
    account: profile,
    portfolio: portfolio,
  };

  return variables;
};
export const profileDisplayCheck = (ctx) => {
  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];
  let html = ``;
  if (username) {
    html = ` <a href="/profil">
                    <i class="material-icons profil-icon">account_circle</i>
                </a>`;
  } else {
    html = `  <a href="/login">
                    <i class="material-icons profil-icon">account_circle</i>
                </a>`;
  }
  return html;
};

export const portfolioDisplayCheck = async (ctx) => {
  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];
  const portfolio = await modelPortfolio.getPortfolioByName(ctx.db, username);
  let html = ``;
  if (username) {
    if (portfolio.length == 0) {
      html = `   <a href="portfolio/erstellen">Portfolio erstellen</a>`;
    } else {
      html = `  <a href="/portfolio/user">Mein Portfolio</a>`;
    }
  } else {
    html = ``;
  }

  return html;
};

export const TextDisplayCheck = async (ctx) => {
  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];
  const portfolio = await modelPortfolio.getPortfolioByName(ctx.db, username);
  let html = ``;
  if (username) {
    if (portfolio.length == 0) {
      html = `         <p class="p_herotext">
              Erstelle dir jetzt ganz einfach dein eigenes Portfolio.
            </p>
            <a href="/portfolio/erstellen" class="button-portfolioerstellen">
              Portfolio erstellen! </a>`;
    } else {
      html = `       <p class="p_herotext">
              Hier gelangst du zu deinem Portfolio.
            </p>
            <a href="/portfolio" class="button-portfolioerstellen">
              Dein Portfolio </a>`;
    }
  } else {
    html = `         <p class="p_herotext">
              Logge dich ein um ganz einfach dein eigenes Portfolio zu erstellen.
            </p>
            <a href="/login" class="button-portfolioerstellen">
              Portfolio erstellen! </a>`;
  }

  return html;
};
