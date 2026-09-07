const express = require("express");
const path = require("path");
const webRoutes = require("./routes/web.routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", webRoutes);
app.use(express.static(path.join(__dirname, "public")));

module.exports = app;
