export const renderKollophon = async (ctx) => {
  ctx.response.body = await ctx.nunjucks.render("kollophon.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
