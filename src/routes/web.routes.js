const { Router } = require("express");
const webController = require("../controllers/web.controller");

const router = Router();

router.get("/", webController.getHome);
router.get("/thanks", webController.getThanks);

module.exports = router;
