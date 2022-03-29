// import gardens from "https://deno.land/x/gardens@5.0.0/lib.ts";
import * as gardens from "../lib.ts";

// const logger = gardens.createLogger();

// export const scope1 = logger.scope("scope1");

export const root = gardens.createLogger();

export const a = root.createLogger("a");

export const d = root.scope("a", "b", "c", "d");
