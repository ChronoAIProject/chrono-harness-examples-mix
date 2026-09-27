import { readFileSync } from "node:fs";
import { label } from "../../client/view/label.mts";
const invoice = JSON.parse(readFileSync("contracts/invoice.json", "utf8"));
if (label(invoice.cents) !== invoice.label) throw new Error("shared invoice display disagrees");
console.log("PASS shared invoice display");
