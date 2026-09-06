const path = require("path");

const PUBLIC_DIR = path.join(__dirname, "..", "public");

function getHome(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "index.html"));
}

function getThanks(req, res) {
    res.sendFile(path.join(PUBLIC_DIR, "thanks", "index.html"));
}

module.exports = { getHome, getThanks };
