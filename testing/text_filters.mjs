// test_filters.mjs
import filters from "../AI_Integration/filters.js";
import { filterMessage, isSafe } from "../AI_Integration/filters.js";

const samples = ["this is clean text", "this has a BADWORD here"];

for (const s of samples) {
  console.log("INPUT:", s);
  console.log("isSafe:", isSafe(s));
  console.log("filtered:", filterMessage(s));
  console.log("---");
}
