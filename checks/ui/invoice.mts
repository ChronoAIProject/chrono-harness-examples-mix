import { label } from "../../client/view/label.mts";
import invoice from "../../contracts/invoice.json" with { type: "json" };
if (label(invoice.cents) !== invoice.label) throw new Error("shared invoice display disagrees");
console.log("PASS shared invoice display");
