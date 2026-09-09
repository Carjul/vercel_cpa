const path = require("path");
const { recordVisit, listVisitors } = require("../lib/store");
const { getConfigFor, setOfferCountries } = require("../lib/offerConfig");
const { listOfferSlugs, isValidSlug } = require("./web.controller");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

// CORS abierto para que landings en otros dominios puedan reportar al panel central.
function cors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function getClientIp(req) {
    const xff = req.headers["x-forwarded-for"];
    if (xff) return xff.split(",")[0].trim();
    return req.headers["x-real-ip"] || req.socket?.remoteAddress || "";
}

function decode(v) {
    if (!v) return "";
    try { return decodeURIComponent(v); } catch (e) { return v; }
}

// GET/POST /api/track  -> registra un visitante o refresca su presencia (heartbeat).
async function track(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(204).end();

    const src = req.method === "POST" ? { ...req.query, ...(req.body || {}) } : req.query;
    const id = (src.vid || "").toString().trim() || (getClientIp(req) + "|" + (req.headers["user-agent"] || ""));

    try {
        const visitor = await recordVisit({
            id,
            ip: getClientIp(req),
            country: (req.headers["x-vercel-ip-country"] || "").toString(),
            city: decode((req.headers["x-vercel-ip-city"] || "").toString()),
            region: (req.headers["x-vercel-ip-country-region"] || "").toString(),
            timezone: (req.headers["x-vercel-ip-timezone"] || "").toString(),
            page: (src.page || "").toString().slice(0, 300),
            userAgent: (req.headers["user-agent"] || "").toString().slice(0, 300),
        });
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({ ok: true, id: visitor.id });
    } catch (e) {
        console.error("track error:", e);
        return res.status(500).json({ ok: false, error: "track_failed" });
    }
}

// GET /api/visitors -> datos para el panel.
async function visitors(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    try {
        const data = await listVisitors();
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json(data);
    } catch (e) {
        console.error("visitors error:", e);
        return res.status(500).json({ error: "list_failed" });
    }
}

// GET /api/offers -> lista de ofertas (descubiertas del filesystem) con su
// config de países permitidos, para editar el embudo desde /ds.
async function offersConfig(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    try {
        const slugs = listOfferSlugs();
        const offers = await getConfigFor(slugs);
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({ offers });
    } catch (e) {
        console.error("offersConfig error:", e);
        return res.status(500).json({ error: "config_failed" });
    }
}

// POST /api/offers -> guarda los países permitidos de una oferta.
// body: { slug, countries: string[] | "ES,CO" }
async function saveOfferConfig(req, res) {
    cors(res);
    if (req.method === "OPTIONS") return res.status(204).end();

    const body = req.body || {};
    const slug = (body.slug || "").toString();

    if (!isValidSlug(slug) || listOfferSlugs().indexOf(slug) === -1) {
        return res.status(400).json({ ok: false, error: "invalid_slug" });
    }

    try {
        const countries = await setOfferCountries(slug, body.countries);
        return res.status(200).json({ ok: true, slug, countries });
    } catch (e) {
        console.error("saveOfferConfig error:", e);
        return res.status(500).json({ ok: false, error: "save_failed" });
    }
}

// GET /ds -> panel HTML.
function dashboard(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "ds.html"));
}

module.exports = { track, visitors, dashboard, offersConfig, saveOfferConfig };
