export const renderImpressum = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("impressum.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
