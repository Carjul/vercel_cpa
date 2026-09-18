const { saveLead, listLeads } = require("../lib/store");

// CORS abierto (por si un lander en otro dominio quiere reportar).
function cors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getClientIp(req) {
    const xff = req.headers["x-forwarded-for"];
    if (xff) return xff.split(",")[0].trim();
    return req.headers["x-real-ip"] || (req.socket && req.socket.remoteAddress) || "";
}
function decode(v) {
    if (!v) return "";
    try { return decodeURIComponent(v); } catch (e) { return v; }
}

// POST /api/post_user -> guarda el lead que envía order.js (antes de Dr.Cash).
async function save(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(204).end();

    const b = req.body || {};
    if (!b.name && !b.phone) {
        return res.status(400).json({ ok: false, error: "missing_data" });
    }

    try {
        const saved = await saveLead({
            name: b.name,
            phone: b.phone,
            offer: b.offer,
            page: b.page,
            stream_code: b.stream_code,
            subs: b.subs,
            // Geo/IP del servidor (Vercel), no del cliente.
            ip: getClientIp(req),
            country: (req.headers["x-vercel-ip-country"] || "").toString(),
            city: decode((req.headers["x-vercel-ip-city"] || "").toString()),
            region: (req.headers["x-vercel-ip-country-region"] || "").toString(),
            timezone: (req.headers["x-vercel-ip-timezone"] || "").toString(),
            userAgent: (req.headers["user-agent"] || "").toString(),
        });
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({ ok: true, id: saved.id });
    } catch (e) {
        console.error("post_user save error:", e.message);
        return res.status(500).json({ ok: false, error: "save_failed" });
    }
}

// GET /api/post_user -> lista los leads para el panel /ds.
async function list(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    try {
        const data = await listLeads({ offer: req.query.offer, limit: req.query.limit });
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json(data);
    } catch (e) {
        console.error("post_user list error:", e.message);
        return res.status(500).json({ error: "list_failed" });
    }
}

module.exports = { save, list, cors };
