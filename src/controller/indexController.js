export const renderIndex = async (ctx) => {
  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];
  let html = ``;
  if (username) {
    html = `<a href="/profile/"${username}</a>`;
  } else {
    html = `  <a href="/login">
                    <i class="material-icons profil-icon">account_circle</i>
                </a>`;
  }
  ctx.response.body = await ctx.nunjucks.render("index.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
