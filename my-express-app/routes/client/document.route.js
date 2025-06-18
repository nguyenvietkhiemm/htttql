const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');

const controller = require("../../controller/client/document.controller");

router.get("/", controller.index );

router.get("/detail/:slug", controller.detail);

router.post("/createPost",upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'documentFile', maxCount: 1 }
]),controller.createPost);

router.get('/edit/:slug', controller.edit);

router.patch('/edit',upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'documentFile', maxCount: 1 }
]), controller.editPatch);

router.patch("/delete-item", controller.deleteItem);

module.exports = router;