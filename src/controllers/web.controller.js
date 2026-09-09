const path = require("path");
const fs = require("fs");
const { getOfferCountries } = require("../lib/offerConfig");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const OFFERS_DIR = path.join(PUBLIC_DIR, "offer");

function getCountry(req) {
    return (req.headers["x-vercel-ip-country"] || "").toString().toUpperCase();
}

// Solo slugs simples (una carpeta directa bajo /offer). Evita path traversal.
function isValidSlug(slug) {
    return /^[a-z0-9][a-z0-9_-]*$/i.test(slug);
}

// Descubre las ofertas existentes escaneando public/offer/<slug>/index.html.
function listOfferSlugs() {
    let entries = [];
    try {
        entries = fs.readdirSync(OFFERS_DIR, { withFileTypes: true });
    } catch (e) {
        return [];
    }
    return entries
        .filter(function (d) {
            return (
                d.isDirectory() &&
                isValidSlug(d.name) &&
                fs.existsSync(path.join(OFFERS_DIR, d.name, "index.html"))
            );
        })
        .map(function (d) { return d.name; })
        .sort();
}

// Página principal informativa (salud / filosofía). Visible para todos.
function getHome(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
}

// Handler genérico de ofertas /offer/:slug con filtro por país configurable
// desde /ds. País no permitido -> /blog. País desconocido (dev) -> pasa.
async function getOffer(req, res) {
    const slug = (req.params.slug || "").toString();
    const indexFile = path.join(OFFERS_DIR, slug, "index.html");
    if (!isValidSlug(slug) || !fs.existsSync(indexFile)) {
        return res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
    }

    const country = getCountry(req);
    let allowed = [];
    try {
        allowed = await getOfferCountries(slug);
    } catch (e) {
        console.error("getOffer config error:", e.message);
    }

    // Lista vacía => sin restricción. Con lista, el país debe estar incluido.
    if (country && allowed.length && allowed.indexOf(country) === -1) {
        return res.redirect(302, "/blog/");
    }
    res.sendFile(indexFile);
}

// La página "thanks" pertenece a la oferta hdrosol y vive anidada en
// public/offer/hdrosol/thanks/. La sirve express.static directamente
// (con sus assets relativos), por eso ya no necesita controlador.

function getBlog(req, res) {
    // Mismo motivo que en getThanks: sin barra final los assets relativos
    // resuelven contra la raíz y dan 404.
    if (!req.path.endsWith("/")) {
        return res.redirect(301, "/blog/");
    }
    res.sendFile(path.join(PUBLIC_DIR, "blog", "index.html"));
}

// Páginas legales (autocontenidas, sin assets externos).
function getTerms(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "legal", "terms.html"));
}

function getPrivacy(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "legal", "privacy.html"));
}

function getCookies(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "legal", "cookies.html"));
}

module.exports = {
    getHome,
    getOffer,
    getBlog,
    getTerms,
    getPrivacy,
    getCookies,
    listOfferSlugs,
    isValidSlug,
};
