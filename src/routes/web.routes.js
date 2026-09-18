const { Router } = require("express");
const webController = require("../controllers/web.controller");
const trackController = require("../controllers/track.controller");
const leadsController = require("../controllers/leads.controller");

const router = Router();

// Página principal informativa (salud / filosofía)
router.get("/", webController.getHome);

// Ofertas CPA: /offer/<slug> con filtro por país configurable desde /ds.
router.get("/offer/:slug", webController.getOffer);

// La "gracias" de la oferta (public/offer/hdrosol/thanks/) la sirve
// express.static; no necesita ruta propia.

// Blog (destino de redirección para países no permitidos)
router.get(["/blog", "/blog/"], webController.getBlog);

// Páginas legales
router.get(["/terms", "/terms/"], webController.getTerms);
router.get(["/privacy", "/privacy/"], webController.getPrivacy);
router.get(["/cookies", "/cookies/"], webController.getCookies);

// Tracking + panel de visitantes
router.all("/api/track", trackController.track);
router.all("/api/visitors", trackController.visitors);

// Config del embudo por ruta/país (leer y guardar desde /ds)
router.get("/api/offers", trackController.offersConfig);
router.post("/api/offers", trackController.saveOfferConfig);

// Leads del formulario: POST guarda (desde order.js), GET lista (para /ds)
router.options("/api/post_user", function (req, res) { leadsController.cors(res); res.status(204).end(); });
router.post("/api/post_user", leadsController.save);
router.get("/api/post_user", leadsController.list);

router.get("/ds", trackController.dashboard);

module.exports = router;
