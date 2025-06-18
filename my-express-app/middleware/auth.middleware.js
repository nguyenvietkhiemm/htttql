const Account = require("../model/account.model");
module.exports.requireAuth = async (req, res, next) => {
    // console.log("middleware auth", req.headers);
    if(req.headers.authorization){
        const tokenUser = req.headers.authorization.split(" ")[1];
        const account = await Account.findOne({
            tokenUser: tokenUser,
            deleted: false
        }).select("-password");

        if(!account){
            res.json({
                code: 403,
                message: "khong co quyen truy cap!"
            });
        }else{
            req.account = account;
            next();
        }
    } 
    else{
        res.json({
            code: 403,
            message: "Khong co quyen truy cap! hehe"
        });
    }
}