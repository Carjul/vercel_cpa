const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Países permitidos para ver la landing. El resto se redirige a /blog.
const ALLOWED_COUNTRIES = ["ES", "CO"];

function getCountry(req) {
    return (req.headers["x-vercel-ip-country"] || "").toString().toUpperCase();
}

function getHome(req, res) {
    const country = getCountry(req);
    // Si Vercel detecta el país y NO está permitido, se manda al blog.
    // Si no hay país (dev/local o no detectado), se muestra la landing.
    if (country && ALLOWED_COUNTRIES.indexOf(country) === -1) {
        return res.redirect(302, "/blog/");
    }
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
}

function getThanks(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "thanks", "index.html"));
}

function getBlog(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "blog", "index.html"));
}

module.exports = { getHome, getThanks, getBlog };
