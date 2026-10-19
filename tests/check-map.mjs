/*
  check-map.mjs
  Author:  Jibril Sulaiman
  Created: 2026-10-19
  Deploy:  Run with `npm test` (or `node tests/check-map.mjs [path/to/map.html]`). Not shipped to the page.
  What:    Loads the MAP DATA block from the map file and checks it: every box id is unique
           across all maps, every arrow, related-box link and workflow reference points at
           something real, every map has a tab button and a start box that exists, and no
           box spills off its canvas or sits on top of another box.
  Why:     The page renders without errors when the data is wrong. A repeated box id
           silently replaces the earlier box, so a box disappears from its tab and nothing
           warns you. These checks catch that before anyone opens the page.
*/
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = fileURLToPath(new URL("..", import.meta.url));
const file = process.argv[2] || `${here}process-map.html`;
const html = readFileSync(file, "utf8");

const start = html.indexOf("const PORTAL_ID") >= 0 ? html.indexOf("const PORTAL_ID") : html.indexOf("const WFURL");
const end = html.indexOf("/* ---------- Rendering ---------- */");
if (start < 0 || end < 0) throw new Error("Could not find the data block (PORTAL_ID ... Rendering) in " + file);

// Count every add() call, so a repeated id is caught even though N keeps only the last one.
const dataCode = html.slice(start, end)
  .replace("const add = (map,id", "const __calls = []; const add = (map,id")
  .replace("=> { N[id] =", "=> { __calls.push(id); N[id] =");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(dataCode + "\n;globalThis.__out = { WF, MAPS, N, calls: __calls };", ctx);
const { WF, MAPS, N, calls } = ctx.__out;

const errors = [];
let checks = 0;
const check = (ok, msg) => { checks++; if (!ok) errors.push(msg); };

// 1. Unique ids across all maps.
const seen = new Set();
for (const id of calls) { check(!seen.has(id), `Box id "${id}" is used more than once; the earlier box disappears`); seen.add(id); }

const nav = html.slice(html.indexOf('<nav class="tabs"'), html.indexOf("</nav>"));
const tabKeys = [...nav.matchAll(/data-map="([^"]+)"/g)].map(m => m[1]);
for (const [key, m] of Object.entries(MAPS)) {
  const boxes = Object.values(N).filter(n => n.map === key);
  // 2. Tab button and start box.
  check(tabKeys.includes(key), `Map "${key}" has no <button data-map="${key}"> in the tabs`);
  check(N[m.start] && N[m.start].map === key, `Map "${key}" starts on "${m.start}", which is not a box on that map`);
  check(boxes.length > 0, `Map "${key}" has no boxes`);
  // 3. Arrows join boxes on the same map.
  for (const [a, b] of m.edges) {
    check(N[a] && N[a].map === key, `Map "${key}": arrow starts at "${a}", not a box on this map`);
    check(N[b] && N[b].map === key, `Map "${key}": arrow ends at "${b}", not a box on this map`);
  }
  // 4. Boxes fit the canvas and don't overlap.
  for (const n of boxes) {
    check(n.x >= 0 && n.x + n.w <= 680, `Box "${n.id}" runs off the canvas sideways (x ${n.x} + width ${n.w} > 680)`);
    check(n.y >= 0 && n.y + n.h <= m.h, `Box "${n.id}" runs off the bottom (y ${n.y} + 56 > map height ${m.h})`);
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const p = boxes[i], q = boxes[j];
    const overlap = p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h;
    check(!overlap, `Boxes "${p.id}" and "${q.id}" overlap on map "${key}"`);
  }
}
for (const key of tabKeys) check(MAPS[key], `Tab button data-map="${key}" has no map in MAPS`);

// 5. Every box answers its question, and every reference points at something real.
for (const n of Object.values(N)) {
  check(MAPS[n.map], `Box "${n.id}" is on map "${n.map}", which does not exist`);
  check(typeof n.q === "string" && n.q.length > 0, `Box "${n.id}" has no question (q)`);
  check(Array.isArray(n.a) && n.a.length > 0, `Box "${n.id}" has no answer (a)`);
  for (const k of n.next || []) check(N[k], `Box "${n.id}" links to related box "${k}", which does not exist`);
  for (const f of n.flows || []) {
    if (f.wf) check(WF[f.wf], `Box "${n.id}" uses workflow "${f.wf}", which is not in WF`);
    else check(f.name, `Box "${n.id}" has a process with no name`);
    for (const s of f.steps || []) check(["step", "branch", "wait", "deal", "manual", "gap"].includes(s[0]), `Box "${n.id}": unknown step type "${s[0]}"`);
  }
  for (const l of n.links || []) check(/^https:\/\//.test(l[1]), `Box "${n.id}": link "${l[0]}" is not a full https URL`);
}
for (const [k, w] of Object.entries(WF)) check(/^\d+$/.test(w.id) && w.name && w.on && w.start, `Workflow "${k}" is missing its id, name, on or start`);

if (errors.length) {
  console.error(`FAIL ${errors.length} of ${checks} checks:\n- ` + errors.join("\n- "));
  process.exit(1);
}
console.log(`PASS ${checks} checks: ${Object.keys(MAPS).length} maps, ${calls.length} boxes, ${Object.keys(WF).length} workflows`);
