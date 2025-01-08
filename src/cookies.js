import {
  getCookies,
  setCookie,
  deleteCookie,
} from "https://deno.land/std@0.224.0/http/cookie.ts";

export function getCookie(ctx) {
  return getCookies(ctx.request.headers);
}

export function setFormStepCookie(ctx, step) {
  setCookie(ctx.response.headers, {
    name: "currentFormStep",
    value: step,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });
  return ctx;
}

export function setWorkFormStepCookie(ctx, step) {
  setCookie(ctx.response.headers, {
    name: "currentWorkFormStep",
    value: step,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });
  return ctx;
}

export function setEditFormStepCookie(ctx, step) {
  setCookie(ctx.response.headers, {
    name: "currentEditWorkFormStep",
    value: step,
    maxAge: 60 * 60 * 24,
    httpOnly: true,
  });
  return ctx;
}

export function setUserCookie(ctx, username, role) {
  setCookie(ctx.response.headers, {
    name: "username",
    value: username,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24,
  });

  setCookie(ctx.response.headers, {
    name: "role",
    value: role,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return ctx;
}

export function deleteUserCookie(ctx) {
  deleteCookie(ctx.response.headers, "username", {
    path: "/",
    secure: true,
    sameSite: "Lax",
  });
  deleteCookie(ctx.response.headers, "role", {
    path: "/",
    secure: true,
    sameSite: "Lax",
  });
  return ctx;
}
