/*
 * Store de visitantes en MongoDB.
 * Lee la cadena de conexión desde una variable de entorno.
 * Acepta cualquiera de estos nombres: MONGO_URI, MONGODB_URI, MONGO_URL.
 *
 * Colección: "visitors" (un documento por visitante, _id = visitorId).
 */
const { MongoClient } = require("mongodb");

const URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.MONGO_URL ||
    "";
const DB_NAME = process.env.MONGO_DB || "tracking";
const COLLECTION = "visitors";

const ONLINE_WINDOW_MS = 45 * 1000;        // "en línea" si hubo ping hace <45s
const PRUNE_MS = 24 * 60 * 60 * 1000;      // descarta visitantes con +24h sin actividad

// Reutiliza la conexión entre invocaciones serverless (evita abrir muchas conexiones).
function getClientPromise() {
    if (!URI) {
        throw new Error("Falta la variable de entorno MONGO_URI (o MONGODB_URI).");
    }
    if (!global._mongoClientPromise) {
        const client = new MongoClient(URI, { maxPoolSize: 5 });
        global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
}

async function getDb() {
    const client = await getClientPromise();
    return client.db(DB_NAME);
}

async function coll() {
    const db = await getDb();
    return db.collection(COLLECTION);
}

// Registra o actualiza un visitante (también sirve de heartbeat de presencia).
async function recordVisit(visit) {
    const c = await coll();
    const now = Date.now();

    const set = { lastSeen: now };
    ["ip", "country", "city", "region", "timezone", "page", "userAgent"].forEach(function (k) {
        if (visit[k]) set[k] = visit[k];
    });

    await c.updateOne(
        { _id: visit.id },
        {
            $set: set,
            $setOnInsert: { firstSeen: now },   // hora de entrada (solo al crear)
            $inc: { hits: 1 },
        },
        { upsert: true }
    );

    return { id: visit.id };
}

// Devuelve la lista de visitantes ordenada por última actividad, con bandera "online".
async function listVisitors() {
    const c = await coll();
    const now = Date.now();

    // Limpia visitantes viejos.
    await c.deleteMany({ lastSeen: { $lt: now - PRUNE_MS } });

    const docs = await c
        .find({}, { projection: {}, sort: { lastSeen: -1 }, limit: 1000 })
        .toArray();

    const visitors = docs.map(function (d) {
        return {
            id: d._id,
            ip: d.ip || "",
            country: d.country || "",
            city: d.city || "",
            region: d.region || "",
            timezone: d.timezone || "",
            page: d.page || "",
            firstSeen: d.firstSeen || null,
            lastSeen: d.lastSeen || null,
            hits: d.hits || 1,
            online: now - (d.lastSeen || 0) <= ONLINE_WINDOW_MS,
        };
    });

    const onlineCount = visitors.filter(function (v) { return v.online; }).length;

    // Desglose por ruta (pathname) para monitorear cada landing/oferta.
    // "page" se guarda como hostname + pathname; extraemos solo el pathname.
    const pages = {};
    visitors.forEach(function (v) {
        const raw = v.page || "";
        const slash = raw.indexOf("/");
        let path = slash === -1 ? "/" : raw.slice(slash) || "/";
        // Normaliza la barra final para no duplicar /ruta y /ruta/.
        if (path.length > 1 && path.charAt(path.length - 1) === "/") path = path.slice(0, -1);
        if (!pages[path]) pages[path] = { path: path, online: 0, total: 0, hits: 0 };
        pages[path].total += 1;
        pages[path].hits += v.hits || 1;
        if (v.online) pages[path].online += 1;
    });
    const byPage = Object.keys(pages)
        .map(function (k) { return pages[k]; })
        .sort(function (a, b) { return b.online - a.online || b.total - a.total; });

    return { onlineCount, total: visitors.length, visitors, byPage, serverTime: now };
}

module.exports = { recordVisit, listVisitors, ONLINE_WINDOW_MS, getDb };
