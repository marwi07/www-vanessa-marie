import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as model from "../model/userModel.js";

export async function generateLoginErrors(ctx, password, username) {
  const errors = [];

  if (!username || !password) {
    errors.push("Du musst ein Passwort und einen Username angeben.");
  } else {
    const hashPasswort = await model.getPasswortByUser(ctx.db, username);

    if (hashPasswort.length === 0) {
      errors.push("Der User existiert nicht.");
    } else {
      const passwordMatches = await compare(password, hashPasswort[0][0]);

      if (!passwordMatches) {
        errors.push("Dein Passwort stimmt nicht.");
      }
    }
  }
  return errors;
}

export function generateWorkFormErrors(ctx, title, description, imageError) {
  const errors = [];
  if (!title) errors.push("Du musst einen Titel eingeben.");
  if (!description) errors.push("Du musst eine Beschreibung eingeben.");
  if (!imageError == "") errors.push(imageError.error);

  if (errors.length > 0) {
    const queryParams = new URLSearchParams({
      errors: encodeURIComponent(JSON.stringify(errors)),
      title: encodeURIComponent(title || ""),
      description: encodeURIComponent(description || ""),
    }).toString();

    ctx.response.status = 302;
    ctx.response.headers.set(
      "Location",
      `/portfolio/arbeiten/erstellen?${queryParams}`
    );
    ctx.response.body = "";
    return ctx;
  } else {
    return;
  }
}
