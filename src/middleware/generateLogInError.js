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
