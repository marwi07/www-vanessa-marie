export const renderLogin = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("Login.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
