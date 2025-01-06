export const renderProfile = async (ctx) => {
  let profileIsCreated = `        <div class="contact_heading">
              <h3>Kontaktdaten</h3>

              <div id="Container Kontaktinfos" class="container_contact">
                <dl id="Kontaktinfos" class="contact">
                  <dt>Name:</dt>
                  <dd>Max Mustermann</dd>
                  <dt>Email:</dt>
                  <dd>max@example.com</dd>
                  <dt>Addresse:</dt>
                  <dd>max@example.com</dd>
                  <dt>Telefon:</dt>
                  <dd>+49 123 4567890</dd>
                </dl>
              </div>
            </div>`;
  ctx.response.body = await ctx.nunjucks.render("profile.html");
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};
