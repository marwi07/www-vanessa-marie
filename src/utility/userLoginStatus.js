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
  const username = getUsername(ctx);
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
  const username = getUsername(ctx);
  const portfolio = await modelPortfolio.getPortfolioByName(ctx.db, username);
  let html = ``;
  if (username) {
    if (portfolio.length == 0) {
      html = `   <a href="/portfolio/erstellen">Portfolio erstellen</a>`;
    } else {
      html = `  <a href="/portfolio/username/${username}">Mein Portfolio</a>`;
    }
  } else {
    html = ``;
  }

  return html;
};

export const TextDisplayCheck = async (ctx) => {
  const username = getUsername(ctx);
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
            <a href="/portfolio/username/${username}" class="button-portfolioerstellen">
              Dein Portfolio </a>`;
    }
  } else {
    html = `         <p class="p_herotext">
              Logge dich ein um ganz einfach dein eigenes Portfolio zu erstellen.
            </p>
            <a href="/login" class="button-portfolioerstellen">
             Zum Login. </a>`;
  }

  return html;
};

export const isUserLoggedIn = (ctx) => {
  const username = getUsername(ctx);
  if (!username) {
    return false;
  } else {
    return true;
  }
};

export const getLoggedInUser = (ctx) => {
  const username = getUsername(ctx);
  if (!username) {
    return;
  } else return username;
};

export const getUsername = (ctx) => {
  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];
  return username;
};

export const checkUserPortfolio = async (ctx) => {
  const username = getLoggedInUser(ctx);
  const existPortfolio = await modelPortfolio.getPortfolioByName(
    ctx.db,
    username
  );

  if (existPortfolio.length > 0) {
    ctx.response.status = 303;
    ctx.response.headers.set("Location", `/portfolio/username/${username}`);
    return ctx;
  }
};
