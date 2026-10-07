// Tiny mock of Microsoft Graph (token + Excel table rows), a Teams Workflows webhook and Brevo contacts.
// Import { startMock } from this file, or run it directly: node tests/lead/mock-services.mjs [port]
import { createServer } from "node:http";

export function startMock(port = 0) {
  const state = {
    tokens: 0, rows: [], teams: [], contacts: new Map(), // contacts: email -> { listIds:Set, emailBlacklisted }
    graphDown: false, graphDelayMs: 0, log: [],
  };
  const json = (res, code, body) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(body)); };

  const server = createServer((req, res) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", async () => {
      const url = new URL(req.url, "http://x");
      const path = decodeURIComponent(url.pathname);
      let body = {};
      try { body = raw && (req.headers["content-type"] || "").includes("json") ? JSON.parse(raw) : Object.fromEntries(new URLSearchParams(raw)); } catch { /* keep {} */ }
      state.log.push(`${req.method} ${path}`);

      if (/^\/login\/[^/]+\/oauth2\/v2\.0\/token$/.test(path) && req.method === "POST") {
        if (body.grant_type !== "client_credentials" || !body.client_id || !body.client_secret) return json(res, 400, { error: "invalid_request" });
        state.tokens++;
        return json(res, 200, { access_token: "mock-token", expires_in: 3600 });
      }

      if (path.startsWith("/graph/")) {
        if (req.headers.authorization !== "Bearer mock-token") return json(res, 401, { error: "unauthorized" });
        if (state.graphDown) return json(res, 503, { error: "graph down" });
        if (state.graphDelayMs) await new Promise((r) => setTimeout(r, state.graphDelayMs));
        if (!/\/workbook\/tables\/Leads\//.test(path)) return json(res, 404, {});
        if (path.endsWith("/rows/add") && req.method === "POST") {
          state.rows.push({ index: state.rows.length, values: [body.values[0]] });
          return json(res, 201, { index: state.rows.length - 1, values: body.values });
        }
        if (path.endsWith("/rows") && req.method === "GET") return json(res, 200, { value: state.rows });
        const m = path.match(/\/rows\/itemAt\(index=(\d+)\)$/);
        if (m && req.method === "PATCH") {
          const row = state.rows[Number(m[1])];
          if (!row) return json(res, 404, {});
          row.values = [body.values[0]];
          return json(res, 200, row);
        }
        return json(res, 404, {});
      }

      if (path === "/teams" && req.method === "POST") { state.teams.push(body); return json(res, 202, {}); }

      if (path.startsWith("/brevo/")) {
        if (req.headers["api-key"] !== "mock-brevo-key") return json(res, 401, { message: "bad key" });
        const p = path.slice("/brevo".length);
        if (p === "/contacts" && req.method === "POST") {
          const c = state.contacts.get(body.email.toLowerCase()) || { listIds: new Set(), emailBlacklisted: false, attributes: {} };
          if (state.contacts.has(body.email.toLowerCase()) && !body.updateEnabled) return json(res, 400, { code: "duplicate_parameter" });
          for (const id of body.listIds || []) c.listIds.add(id);
          c.attributes = { ...c.attributes, ...(body.attributes || {}) };
          state.contacts.set(body.email.toLowerCase(), c);
          return json(res, 201, { id: state.contacts.size });
        }
        if (p === "/contacts" && req.method === "GET") {
          const off = Number(url.searchParams.get("offset") || 0), lim = Number(url.searchParams.get("limit") || 50);
          const all = [...state.contacts].map(([email, c]) => ({ email, emailBlacklisted: c.emailBlacklisted, listIds: [...c.listIds] }));
          return json(res, 200, { contacts: all.slice(off, off + lim), count: all.length });
        }
        const m = p.match(/^\/contacts\/(.+)$/);
        if (m && req.method === "PUT") {
          const c = state.contacts.get(m[1].toLowerCase());
          if (!c) return json(res, 404, {});
          for (const id of body.unlinkListIds || []) c.listIds.delete(id);
          return json(res, 204, {});
        }
        return json(res, 404, {});
      }
      json(res, 404, { error: "not found" });
    });
  });

  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => {
    const p = server.address().port;
    resolve({ state, port: p, base: `http://127.0.0.1:${p}`, close: () => server.close() });
  }));
}

if (process.argv[1]?.endsWith("mock-services.mjs")) {
  const m = await startMock(Number(process.argv[2] || 8799));
  console.log(`mock services on ${m.base} (graph /graph, login /login, teams /teams, brevo /brevo, key mock-brevo-key)`);
}
