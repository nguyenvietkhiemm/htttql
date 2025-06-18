const express = require('express');
const router = express.Router();
const upload = require('../../middleware/upload');

const controller = require("../../controller/client/document.controller");

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

router.get("/myDocument", controller.myDocument );

router.post('/review/:slug', controller.editReview);

router.get('/approvedPublic', controller.approvedPublic);

router.post('/buy/:slug', controller.buy);

router.get("/", controller.index );
module.exports = router;