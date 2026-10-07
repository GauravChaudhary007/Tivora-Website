// End-to-end test: real PHP (php -S + CLI sync.php) against mock Graph / Teams / Brevo.
//   node tests/lead/e2e.mjs        (uses tools/php/php.exe, or PHP_BIN)
import { spawn } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";
import { startMock } from "./mock-services.mjs";

const root = resolve(import.meta.dirname, "../..");
const php = process.env.PHP_BIN || join(root, "tools/php/php.exe");
const ini = join(root, "tools/php.ini");
const phpArgs = existsSync(ini) ? ["-c", ini] : [];

const mock = await startMock();
const stage = mkdtempSync(join(tmpdir(), "tivora-e2e-"));
const demo = join(stage, "api/demo");
cpSync(join(root, "deploy/static/api/demo"), demo, { recursive: true });
rmSync(join(demo, "data"), { recursive: true, force: true });
cpSync(join(root, "config/lead-rules.json"), join(demo, "lead-rules.json"));
const dataDir = join(stage, "data");
const rules = JSON.parse(readFileSync(join(root, "config/lead-rules.json"), "utf8"));
const setRules = (patch) => writeFileSync(join(demo, "lead-rules.json"), JSON.stringify({ ...rules, ...patch }));
setRules({ rateLimit: { perIpPerHour: 1000 } });
writeFileSync(join(demo, "config.php"), `<?php return array(
  'tenant_id' => 't1', 'client_id' => 'c1', 'client_secret' => 's1', 'drive_id' => 'd1', 'item_id' => 'i1', 'table_name' => 'Leads',
  'sheet_url' => 'https://example.invalid/sheet', 'teams_webhook_url' => '${mock.base}/teams',
  'brevo_api_key' => 'mock-brevo-key', 'brevo_list_ids' => array('deal' => 1, 'potential' => 2, 'nurturing' => 3),
  'data_dir' => '${dataDir.replace(/\\/g, "/")}', 'graph_base' => '${mock.base}/graph', 'login_base' => '${mock.base}/login', 'brevo_base' => '${mock.base}/brevo',
  'retry_min_age' => 0, 'whatsapp_hour' => 0);`);

const port = 18000 + Math.floor(Math.random() * 1000);
const server = spawn(php, [...phpArgs, "-S", `127.0.0.1:${port}`, "-t", stage], { stdio: "ignore" });
const url = `http://127.0.0.1:${port}/api/demo/`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function waitFor(fn, label, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { if (await fn()) return; await sleep(50); }
  throw new Error(`timeout: ${label}`);
}
async function post(body) {
  const t0 = performance.now();
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return { status: r.status, json: await r.json(), ms: performance.now() - t0 };
}
// Windows flock() is mandatory: a read while PHP holds the lock throws EBUSY, so retry briefly.
// Async on purpose: the mock runs in this process, a blocking spawnSync would starve it.
const sync = (mode, ...a) => new Promise((res, rej) => {
  const p = spawn(php, [...phpArgs, "sync.php", mode, ...a], { cwd: demo });
  let out = "";
  p.stdout.on("data", (d) => (out += d)); p.stderr.on("data", (d) => (out += d));
  p.on("close", (c) => (c === 0 ? res(out) : rej(new Error(`sync ${mode} failed: ${out}`))));
});
const queue = () => {
  for (let i = 0; i < 100; i++) {
    try { return existsSync(join(dataDir, "leads.ndjson")) ? readFileSync(join(dataDir, "leads.ndjson"), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []; }
    catch (e) { if (e.code !== "EBUSY") throw e; Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20); }
  }
  throw new Error("queue file stayed locked");
};
const C = (name) => rules.columns.indexOf(name);
const cell = (row, name) => row.values[0][C(name)];
const setCell = (row, name, v) => { row.values[0][C(name)] = v; };
const rowOf = (id) => mock.state.rows.find((r) => cell(r, "Lead ID") === id);
const cardText = (p) => JSON.stringify(p.attachments[0].content);
const old = () => ({ startedAt: Date.now() - 10000 });

let n = 0;
const ok = (label) => console.log(`ok ${++n} ${label}`);

try {
  await waitFor(async () => { try { await fetch(url); return true; } catch { return false; } }, "php -S up");

  // 1. Hot lead with a slow Graph: visitor answer is fast, sheet row and Teams card both land with the same priority.
  mock.state.graphDelayMs = 800;
  const hot = { name: "Ram Shrestha", company: "Acme Jewels", phone: "9812345678", email: "ram@acmejewels.com.np", industry: "Jewellery", city: "Kathmandu",
    message: "We need a demo and price for 3 branches, urgent", timeline: "1m", businessSize: "large", currentSoftware: "excel",
    marketingConsent: true, whatsappConsent: true, consentText: "v2", website: "", ...old(), utm: { source: "google", medium: "cpc", campaign: "launch" }, landing: "/contact/", referrer: "" };
  let r = await post(hot);
  assert.equal(r.status, 200); assert.deepEqual(r.json, { ok: true });
  assert.ok(r.ms < 400, `visitor response took ${Math.round(r.ms)} ms (Graph delay is 800 ms)`);
  ok(`visitor answered in ${Math.round(r.ms)} ms while Graph takes 800 ms`);
  await waitFor(() => mock.state.rows.length === 1 && mock.state.teams.length === 1, "row + card");
  mock.state.graphDelayMs = 0;
  let q = queue();
  assert.equal(q.length, 1);
  assert.equal(q[0].delivery.graph.status, "ok"); assert.equal(q[0].delivery.teams.status, "ok");
  assert.equal(q[0].priority, "Hot"); assert.equal(q[0].score, 100);
  ok("queue record has score 100 / Hot and per-target status ok");
  const row1 = mock.state.rows[0];
  assert.equal(cell(row1, "Score"), 100); assert.equal(cell(row1, "Priority"), "Hot");
  assert.equal(cell(row1, "Lead ID"), q[0].id); assert.match(cell(row1, "Landing page / UTM"), /utm|source=google/);
  assert.match(cell(row1, "Email consent (timestamp)"), /^v2 /); assert.match(cell(row1, "WhatsApp consent (timestamp)"), /^v2 /);
  const card1 = cardText(mock.state.teams[0]);
  assert.match(card1, /Hot lead, score 100/); assert.match(card1, /tel:\+9779812345678/); assert.match(card1, /wa\.me\/9779812345678/);
  assert.match(card1, /mailto:ram@acmejewels/); assert.match(card1, /Open sheet/);
  ok("one sheet row (Score 100, Priority Hot) and one Teams card with the same priority and Call/WhatsApp/Email/Open sheet buttons");
  assert.equal(mock.state.tokens, 1);
  ok("Graph token fetched once and cached");

  // 2. Old client (no new fields) still works.
  r = await post({ name: "Sita Rai", phone: "", email: "sita@gmail.com", message: "hello" });
  assert.equal(r.status, 200);
  await waitFor(() => mock.state.rows.length === 2 && mock.state.teams.length === 2, "old client delivered");
  assert.equal(queue()[1].priority, "Cold");
  ok("old payload without new fields accepted, scored Cold, delivered");

  // 3. Bots and invalid input.
  const before = queue().length;
  assert.equal((await post({ ...hot, name: "Bot One", email: "bot1@acme.com", phone: "9801000001", website: "http://spam" })).status, 200);
  assert.equal((await post({ ...hot, name: "Fast Fred", email: "fast@acme.com", phone: "9801000002", startedAt: Date.now() - 500 })).status, 200);
  assert.equal((await post({ ...hot, name: "aaaa", email: "junk@acme.com", phone: "9801000003" })).status, 200);
  await sleep(300);
  assert.equal(queue().length, before, JSON.stringify(queue().map((x) => x.lead.name)));
  assert.equal((await post({ name: "", phone: "" })).status, 422);
  assert.equal((await post({ name: "X Y", email: "not-an-email" })).status, 422);
  assert.equal((await fetch(url)).status, 405);
  ok("honeypot, too-fast and junk-name submits answered ok but not queued; bad input 422; GET 405");

  // 4. Duplicate within 7 days merges and bumps instead of creating a second record/row.
  r = await post({ ...hot, phone: "+977 9812345678", email: "other@acmejewels.com.np", message: "Following up on branches", ...old() });
  assert.equal(r.status, 200);
  await waitFor(() => mock.state.teams.length === 3, "repeat card");
  q = queue();
  assert.equal(q.length, 2); assert.equal(q[0].repeat, 1);
  await waitFor(() => queue()[0].delivery.graph.status === "ok" && queue()[0].delivery.teams.status === "ok", "repeat delivered");
  assert.equal(mock.state.rows.length, 2); assert.equal(cell(mock.state.rows[0], "Message"), "Following up on branches");
  assert.match(cardText(mock.state.teams[2]), /repeat inquiry 2/);
  ok("repeat inquiry updates the same queue record and sheet row (no duplicate), Teams card marked repeat");

  // 5. Graph down: still queued, Teams still sent, retry later delivers the row (and does not resend Teams).
  mock.state.graphDown = true;
  const down = { ...hot, name: "Hari Karki", email: "hari@kcpaints.com", phone: "9851234567", company: "KC Paints", industry: "Paint & Coatings", whatsappConsent: false, ...old() };
  assert.equal((await post(down)).status, 200);
  await waitFor(() => mock.state.teams.length === 4, "teams while graph down");
  await waitFor(() => queue()[2]?.delivery.graph.status === "failed", "graph failed status");
  assert.equal(mock.state.rows.length, 2); assert.equal(queue()[2].delivery.teams.status, "ok");
  ok("Graph down: lead queued, Teams card sent, graph status failed");
  const failedOut = await sync("retry"); assert.match(failedOut, /still failing/); assert.equal(mock.state.rows.length, 2);
  mock.state.graphDown = false;
  await sync("retry");
  assert.equal(mock.state.rows.length, 3); assert.equal(mock.state.teams.length, 4);
  assert.equal(queue()[2].delivery.graph.status, "ok");
  assert.equal(cell(mock.state.rows[2], "Name"), "Hari Karki");
  ok("retry while down keeps failing; once Graph is back retry adds the row exactly once, Teams not resent");
  await sync("retry"); assert.equal(mock.state.rows.length, 3);
  ok("a second retry is a no-op");

  // 6. Outcome -> Brevo lists; moves; no consent skipped; unsubscribe flows back.
  const id1 = queue()[0].id, id2 = queue()[1].id, id3 = queue()[2].id; // hot (consent), Sita (no consent), Hari (email tick only)
  setCell(rowOf(id1), "Outcome", "Potential"); setCell(rowOf(id2), "Outcome", "Deal"); setCell(rowOf(id3), "Outcome", "Nurturing");
  await sync("outcomes");
  const lists = (email) => { const c = mock.state.contacts.get(email); return c ? [...c.listIds].sort() : null; };
  assert.deepEqual(lists("other@acmejewels.com.np") ?? lists("ram@acmejewels.com.np"), [2]);
  assert.deepEqual(lists("hari@kcpaints.com"), [3]);
  assert.equal(lists("sita@gmail.com"), null);
  assert.ok(cell(rowOf(id1), "Last synced"));
  ok("Outcome Potential -> Potential list, Nurturing -> Nurturing list, row stamped Last synced; no-consent lead skipped");
  const ramEmail = mock.state.contacts.has("other@acmejewels.com.np") ? "other@acmejewels.com.np" : "ram@acmejewels.com.np";
  setCell(rowOf(id1), "Outcome", "Deal");
  await sync("outcomes");
  assert.deepEqual(lists(ramEmail), [1]);
  ok("changing Outcome to Deal moves the contact (removed from Potential)");
  const calls = mock.state.log.filter((l) => l.startsWith("POST /brevo/contacts")).length;
  await sync("outcomes");
  assert.equal(mock.state.log.filter((l) => l.startsWith("POST /brevo/contacts")).length, calls);
  ok("unchanged Outcomes cause no further Brevo calls");
  mock.state.contacts.get("hari@kcpaints.com").emailBlacklisted = true;
  await sync("outcomes");
  assert.equal(cell(rowOf(id3), "Unsubscribed"), "Yes");
  ok("Brevo unsubscribe sets Unsubscribed = Yes in the sheet");

  // 7. WhatsApp list: only due + consenting + mobile + not unsubscribed; tick stamps and clears.
  setCell(rowOf(id2), "Outcome", "Deal");                         // Sita: no consent -> never listed
  setCell(rowOf(id1), "Outcome", "Potential");                    // Ram: consent, due
  setCell(rowOf(id1), "Last WhatsApp sent", "");
  mock.state.rows.push({ index: 3, values: [rules.columns.map(() => "")] });
  const extra = mock.state.rows[3];                               // Gita: consent, Nurturing, messaged today -> not due
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kathmandu" }).format(new Date());
  for (const [k, v] of Object.entries({ "Lead ID": "L-X", Name: "Gita Rai", Company: "Gita Stores", Phone: "9841000000", Email: "g@gita.com", "WhatsApp consent (timestamp)": "v2 2026-01-01", Outcome: "Nurturing", "Last WhatsApp sent": today })) setCell(extra, k, v);
  mock.state.rows.push({ index: 4, values: [rules.columns.map(() => "")] });
  const wala = mock.state.rows[4];                               // Wala: WhatsApp tick only, Deal, due -> listed, but never in Brevo
  for (const [k, v] of Object.entries({ "Lead ID": "L-W", Name: "Wala Sherpa", Company: "Wala Traders", Phone: "9801234567", Email: "wala@wala.com", "WhatsApp consent (timestamp)": "v2 2026-01-01", Outcome: "Deal" })) setCell(wala, k, v);
  await sync("outcomes");
  assert.equal(mock.state.contacts.get("wala@wala.com"), undefined);
  const teamsBefore = mock.state.teams.length;
  const wa = await sync("whatsapp", "--force");
  assert.match(wa, /2 to send/);
  assert.equal(mock.state.teams.length, teamsBefore + 1);
  const waCard = cardText(mock.state.teams.at(-1));
  assert.match(waCard, /Ram Shrestha/); assert.match(waCard, /Wala Sherpa/); assert.match(waCard, /wa\.me\/9779812345678\?text=Namaste%20Ram/);
  for (const nope of ["Sita", "Hari", "Gita"]) assert.doesNotMatch(waCard, new RegExp(nope));
  ok("WhatsApp post lists only the due, consenting, subscribed lead, with a pre-filled wa.me link (Sita no consent, Hari email tick only, Gita not due); WhatsApp-only lead listed but not synced to Brevo");
  setCell(rowOf(id1), "WhatsApp done", true); setCell(wala, "WhatsApp done", true);
  await sync("whatsapp", "--force");
  assert.equal(cell(rowOf(id1), "Last WhatsApp sent"), today); assert.equal(cell(rowOf(id1), "WhatsApp done"), "");
  assert.match(await sync("whatsapp", "--force"), /0 to send/);
  ok("WhatsApp done tick stamps Last WhatsApp sent = today, clears the tick, and the lead is not listed again");
  const stateBefore = mock.state.teams.length;
  await sync("whatsapp");
  assert.equal(mock.state.teams.length, stateBefore);
  ok("without --force the daily post happens at most once a day");

  // 8. Rate limit: 3 per IP per hour; the rest answered ok but dropped.
  setRules({ rateLimit: { perIpPerHour: 3 } });
  rmSync(join(dataDir, "rate"), { recursive: true, force: true });
  const base = queue().length;
  for (let i = 0; i < 5; i++) assert.equal((await post({ name: `Rate Test${i}`, phone: `98010000${10 + i}`, email: `rate${i}@acme.com`, ...old() })).status, 200);
  await sleep(300);
  assert.equal(queue().length - base, 3);
  ok("rate limit: 5 submits from one IP, 3 queued, all answered ok");
  assert.match(readFileSync(join(dataDir, "dropped.log"), "utf8"), /rate limit/);
  ok("dropped submits are logged");
  console.log(`\ne2e: ${n} checks passed`);
} catch (e) {
  console.error("\nE2E FAILED:", e.stack || e);
  process.exitCode = 1;
} finally {
  server.kill();
  mock.close();
  rmSync(stage, { recursive: true, force: true });
}
