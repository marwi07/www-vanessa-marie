export const create = async (ctx) => {
  const formData = await extractFormData(ctx.request);
  const formError = validate(formData);
  if (hasAnyKey(formError)) {
    ctx.response.body = await view.renderForm(formData, formError);
    ctx.response.headers.set("content-type", "text/html");
    ctx.response.status = 200;
  } else {
    model.add(ctx.db, formData);
    ctx.response.headers.set("location", "/");
    ctx.response.status = 303;
  }
  return ctx;
};
