const { Router } = require("express");
const webController = require("../controllers/web.controller");
const trackController = require("../controllers/track.controller");

const router = Router();

// Landing
router.get("/", webController.getHome);
router.get("/thanks", webController.getThanks);

// Blog (destino de redirección para países no permitidos)
router.get(["/blog", "/blog/"], webController.getBlog);

// Tracking + panel de visitantes
router.all("/api/track", trackController.track);
router.all("/api/visitors", trackController.visitors);
router.get("/ds", trackController.dashboard);

module.exports = router;
