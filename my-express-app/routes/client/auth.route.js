const express = require('express');
const router = express.Router();
const controller = require("../../controller/client/auth.controller");
const authrequire = require("../../middleware/auth.middleware");


router.post("/register", controller.register );

router.post("/login", controller.login );

router.post("/logout", controller.logout );

router.post("/me", authrequire.requireAuth, controller.me );


module.exports = router;