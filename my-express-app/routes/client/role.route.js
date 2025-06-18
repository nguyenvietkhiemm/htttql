const express = require('express');
const router = express.Router();

const controller = require("../../controller/client/role.controller");

router.get("/", controller.index );

router.patch("/permission", controller.role);

module.exports = router;