const https = require("https");
const selfsigned = require("selfsigned");
const app = require("./src/app");

const PORT = process.env.PORT || 3443;

const pems = selfsigned.generate([{ name: "commonName", value: "localhost" }], {
    days: 365,
    keySize: 2048
});

const server = https.createServer(
    { key: pems.private, cert: pems.cert },
    app
);

server.listen(PORT, () => {
    console.log(`Servidor HTTPS corriendo en https://localhost:${PORT}`);
});
