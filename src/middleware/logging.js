import { ensureFile } from "https://deno.land/std@0.224.0/fs/mod.ts";
const logFilePath = "./logs/access_log.json";

export const accessLogger = async (ctx, next) => {
  const timestamp = new Date().toISOString();
  const method = ctx.request.method;
  const url = ctx.url.pathname;
  const userAgent = ctx.request.headers.get("user-agent") || "Unknown";
  const clientIP = ctx.request.headers.get("x-forwarded-for") || "Unknown";

  const logEntry = {
    timestamp,
    clientIP,
    method,
    url,
    userAgent,
  };

  await ensureFile(logFilePath);

  let existingLogs = [];
  try {
    const logData = await Deno.readTextFile(logFilePath);
    existingLogs = JSON.parse(logData);
  } catch {
    existingLogs = [];
  }

  existingLogs.push(logEntry);

  await Deno.writeTextFile(logFilePath, JSON.stringify(existingLogs, null, 2));

  await next();
};
