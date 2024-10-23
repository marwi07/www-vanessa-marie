let tempStorage = new FormData();

export const add = async (ctx) => {
  const formData = await ctx.request.formData();
  const step = ctx.url.searchParams.get("step");

  for (const [key, value] of formData.entries()) {
    tempStorage.append(key, value);
  }

  if (step === "one") {
    //console.log(tempStorage);
    ctx = await ctx.cookies.setFormStepCookie(ctx, step);
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/test.html");
    ctx.response.body = null;
    return ctx;
  }

  if (step === "final") {
    const dataText = {
      name: tempStorage.get("name"),
    };

    /** for each image save in databank
     * step als cookie speichern
     * in view auslesen und beim nächsten step weitermachen
     */
  }
};
