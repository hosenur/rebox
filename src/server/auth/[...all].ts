import { auth } from "@/lib/auth.server";
import { defineHandler } from "nitro/h3";

export default defineHandler((event) => {
  return auth.handler(event.req);
});
