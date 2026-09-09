/*
 * Configuración del embudo por ruta de oferta.
 *
 * Cada oferta bajo public/offer/<slug>/ puede tener una lista de países
 * permitidos. Un visitante cuyo país NO esté en la lista se redirige a /blog.
 *
 *   countries = []            -> todos los países pueden ver la oferta.
 *   countries = ["ES","CO"]   -> solo esos países; el resto va a /blog.
 *   país desconocido (dev)    -> siempre pasa (no se puede geolocalizar).
 *
 * Persistencia: colección MongoDB "offer_configs" (un doc por slug).
 * Si Mongo no está disponible, se usan los valores por defecto de abajo.
 */
const { getDb } = require("./store");

const COLLECTION = "offer_configs";

// Config por defecto para ofertas que aún no se hayan guardado desde /ds.
// Preserva el comportamiento histórico de hdrosol (ES/CO).
const DEFAULTS = {
    hdrosol: ["ES", "CO"],
};

// Caché en memoria para no golpear Mongo en cada visita (entorno serverless).
const CACHE_TTL_MS = 30 * 1000;
let cache = null;         // { [slug]: string[] }
let cacheAt = 0;

function normalizeCountries(input) {
    if (!input) return [];
    const arr = Array.isArray(input) ? input : String(input).split(/[\s,;]+/);
    const seen = {};
    const out = [];
    arr.forEach(function (c) {
        const code = String(c || "").trim().toUpperCase();
        if (/^[A-Z]{2}$/.test(code) && !seen[code]) {
            seen[code] = true;
            out.push(code);
        }
    });
    return out;
}

async function loadAll() {
    const now = Date.now();
    if (cache && now - cacheAt < CACHE_TTL_MS) return cache;
    const map = {};
    try {
        const db = await getDb();
        const docs = await db.collection(COLLECTION).find({}).toArray();
        docs.forEach(function (d) {
            map[d._id] = normalizeCountries(d.countries);
        });
    } catch (e) {
        // Sin Mongo (dev/local o mal configurado): caemos a los defaults.
        console.error("offerConfig loadAll error:", e.message);
    }
    cache = map;
    cacheAt = now;
    return map;
}

// Lista de países permitidos para una oferta (según config guardada o default).
async function getOfferCountries(slug) {
    const map = await loadAll();
    if (Object.prototype.hasOwnProperty.call(map, slug)) return map[slug];
    return DEFAULTS[slug] || [];
}

// Guarda (upsert) la lista de países de una oferta e invalida la caché.
async function setOfferCountries(slug, countries) {
    const list = normalizeCountries(countries);
    const db = await getDb();
    await db.collection(COLLECTION).updateOne(
        { _id: slug },
        { $set: { countries: list, updatedAt: Date.now() } },
        { upsert: true }
    );
    cache = null;
    cacheAt = 0;
    return list;
}

// Devuelve la config efectiva (guardada o default) para una lista de slugs.
async function getConfigFor(slugs) {
    const map = await loadAll();
    return slugs.map(function (slug) {
        const saved = Object.prototype.hasOwnProperty.call(map, slug);
        return {
            slug: slug,
            countries: saved ? map[slug] : (DEFAULTS[slug] || []),
            source: saved ? "saved" : (DEFAULTS[slug] ? "default" : "all"),
        };
    });
}

module.exports = {
    normalizeCountries,
    getOfferCountries,
    setOfferCountries,
    getConfigFor,
    DEFAULTS,
};
