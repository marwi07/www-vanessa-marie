export const renderDokumentation = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("dokumentation.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
