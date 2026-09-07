/*
 * Store de visitantes en Vercel Blob.
 * Guarda un único archivo JSON (visitors.json) que persiste y se comparte
 * entre invocaciones serverless. No requiere base de datos.
 *
 * Requiere la variable de entorno BLOB_READ_WRITE_TOKEN (Vercel la inyecta
 * automáticamente al conectar un Blob store al proyecto).
 */
const { put, list } = require("@vercel/blob");

const FILE = "visitors.json";
const ONLINE_WINDOW_MS = 45 * 1000;        // se considera "en línea" si hubo ping hace <45s
const PRUNE_MS = 24 * 60 * 60 * 1000;      // descarta visitantes con más de 24h sin actividad

async function getData() {
    try {
        const { blobs } = await list({ prefix: FILE });
        const found = blobs.find((b) => b.pathname === FILE);
        if (!found) return { visitors: {} };
        // cache:no-store + query para evitar leer una versión cacheada por el CDN.
        const res = await fetch(found.url + "?t=" + Date.now(), { cache: "no-store" });
        if (!res.ok) return { visitors: {} };
        const data = await res.json();
        return data && typeof data === "object" && data.visitors ? data : { visitors: {} };
    } catch (e) {
        console.error("getData error:", e);
        return { visitors: {} };
    }
}

async function saveData(data) {
    await put(FILE, JSON.stringify(data), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
    });
}

function prune(data) {
    const now = Date.now();
    Object.keys(data.visitors).forEach((id) => {
        if (now - (data.visitors[id].lastSeen || 0) > PRUNE_MS) {
            delete data.visitors[id];
        }
    });
    return data;
}

// Registra o actualiza un visitante (también sirve de heartbeat de presencia).
async function recordVisit(visit) {
    const data = prune(await getData());
    const now = Date.now();
    const existing = data.visitors[visit.id];

    if (existing) {
        existing.lastSeen = now;
        existing.hits = (existing.hits || 1) + 1;
        // refresca datos por si cambió de red/página
        existing.ip = visit.ip || existing.ip;
        existing.country = visit.country || existing.country;
        existing.city = visit.city || existing.city;
        existing.region = visit.region || existing.region;
        existing.timezone = visit.timezone || existing.timezone;
        existing.page = visit.page || existing.page;
        existing.userAgent = visit.userAgent || existing.userAgent;
    } else {
        data.visitors[visit.id] = {
            id: visit.id,
            ip: visit.ip || "",
            country: visit.country || "",
            city: visit.city || "",
            region: visit.region || "",
            timezone: visit.timezone || "",
            page: visit.page || "",
            userAgent: visit.userAgent || "",
            firstSeen: now,   // hora de entrada
            lastSeen: now,
            hits: 1,
        };
    }

    await saveData(data);
    return data.visitors[visit.id];
}

// Devuelve la lista de visitantes ordenada por última actividad, con bandera "online".
async function listVisitors() {
    const data = prune(await getData());
    const now = Date.now();
    const visitors = Object.values(data.visitors)
        .map((v) => ({ ...v, online: now - (v.lastSeen || 0) <= ONLINE_WINDOW_MS }))
        .sort((a, b) => b.lastSeen - a.lastSeen);
    const onlineCount = visitors.filter((v) => v.online).length;
    return { onlineCount, total: visitors.length, visitors, serverTime: now };
}

module.exports = { recordVisit, listVisitors, ONLINE_WINDOW_MS };
