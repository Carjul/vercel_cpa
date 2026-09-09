const express = require("express");
const path = require("path");
const webRoutes = require("./routes/web.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", webRoutes);
app.use(express.static(path.join(__dirname, "public")));

// Fallback 404: cualquier URL que no coincida con una ruta ni un archivo
// estático cae aquí. Las rutas /api responden JSON; el resto, la página 404
// con el mismo estilo del home.
app.use(function (req, res) {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({ ok: false, error: "not_found" });
    }
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

module.exports = app;
