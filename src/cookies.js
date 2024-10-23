import {
  getCookies,
  setCookie,
} from "https://deno.land/std@0.224.0/http/cookie.ts";

export async function getCookie(ctx) {
  return getCookies(ctx.request.headers);
}

export async function setFormStepCookie(ctx, step) {
  setCookie(ctx.response.headers, {
    name: "currentFormStep",
    value: step,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });
  return ctx;
}
