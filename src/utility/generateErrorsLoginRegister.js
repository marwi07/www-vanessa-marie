import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import * as model from "../model/userModel.js";
import { hash } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

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

export async function generateRegisterErrors(ctx, password, username) {
  const errors = [];
  let hashedPasswort = "";
  if (!username || !password) {
    errors.push("Du musst ein Passwort und einen Username angeben.");
  } else {
    const userExists = await model.getUserByName(ctx.db, username);
    hashedPasswort = await hash(password);

    if (userExists.length > 0) {
      errors.push("Der User existiert bereits.");
    }
  }
  const data = {
    errors: errors,
    hashedPasswort: hashedPasswort,
  };
  return data;
}
