const Document = require("../../model/document.model");
const User = require("../../model/account.model");
const path = require("path");
const fs = require("fs");
// [GET] /public/img
module.exports.index = async (req, res) => {
    // console.log("req.account", req.account);
    let find = {
        deleted: false,
        "createBy.account_id": req.account._id.toString()
    };
    const document = await Document.find(find);
    res.json({
        code: 200,
        document: document,
        role : req.role,
    });
}
