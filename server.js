import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { handleRequest } from "./src/app.js";

const port = 8080;

await serve(handleRequest, { port, hostname: "127.0.0.1" });
