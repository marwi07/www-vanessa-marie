export const renderAbout = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("ueber-uns.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
