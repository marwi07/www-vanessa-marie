import * as model from "../model/userModel.js";
import * as cookie from "../cookies.js";
import * as checkUser from "../utility/userLoginStatus.js";

export const renderProfile = async (ctx) => {
  const userLoggedIn = checkUser.isUserLoggedIn(ctx);
  if (!userLoggedIn) {
    ctx.response.status = 302;
    ctx.response.headers.set("Location", "/");
    return ctx;
  }

  const variables = await checkUser.checkPortfolioAndProfile(ctx);
  let msg = `    <a
              href="/profil/erstellen"
              type="button"
              class="button-group_login"
              >Kontaktdaten hinzufügen</a
            >`;

  const cookie = ctx.cookies.getCookie(ctx);
  const username = cookie["username"];

  const data = await model.getInfoByUser(ctx.db, username);
  if (data.length > 0) {
    msg = ` <div id="Container Kontaktinfos" class="container_contact_profil">
                <dl id="Kontaktinfos" class="contact-profil">
                  <dt>Name:</dt>
                  <dd>${data[0][5]}</dd>
                  <dt>Email:</dt>
                  <dd>${data[0][0]}</dd>
                  <dt>Addresse:</dt>
                  <dd>${data[0][4]}</dd>
                  <dt>Telefon:</dt>
                  <dd>${data[0][1]}</dd>
                  <dt>Sonstiges:</dt>
                  <dd>${data[0][2]}</dd>
                </dl>
            </div><div class="button-group-profil">
            <a class="button-profil" href="/profil/bearbeiten">
              Bearbeiten
            </a>

            <a
              onclick="return confirmDelete()"
              class="button-profil"
              href="/profil/entfernen"
            >
              Löschen
            </a>
          </div>
          <script>
            function confirmDelete() {
              return confirm("Are you sure you want to delete this item?");
            }
          </script>
          
        </div>`;
  }
  ctx.response.body = await ctx.nunjucks.render("profile.html", {
    contact: msg,
    account: variables.account,
    portfolioMenu: variables.portfolio,
  });
  ctx.response.headers.set("content-type", "text/html");
  ctx.response.status = 200;
  return ctx;
};

export const logout = async (ctx) => {
  ctx = await cookie.deleteUserCookie(ctx);
  ctx.response.status = 302;
  ctx.response.headers.set("Location", "/");
  ctx.response.body = "";
  return ctx;
};
