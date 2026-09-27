import { label } from "../../client/view/label.mts";
const cases: [number, string][] = [[0,"$0.00"],[1,"$0.01"],[125,"$1.25"],[1000,"$10.00"]];
for (const [cents, expected] of cases) {
  if (label(cents) !== expected) throw new Error(`label(${cents}) != ${expected}`);
}
for (const invalid of [-1, 0.5, NaN, Infinity]) {
  let rejected = false;
  try { label(invalid); } catch (error) { rejected = error instanceof RangeError; }
  if (!rejected) throw new Error(`accepted invalid cents ${invalid}`);
}
console.log("PASS label contract: 4 values, 4 rejected inputs");
