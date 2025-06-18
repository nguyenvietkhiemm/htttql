const Account = require("../../model/account.model");

const md5 = require("md5");
const generate =  require("../../helpers/generate");


// [POST] auth/register
module.exports.register = async (req, res) => {
    const existEmail = await Account.findOne({
        email : req.body.email,
    });

    if(existEmail){
        res.json({
            code: 400,
            message: "Email da ton tai!"
        })
        return;
    }else{
        req.body.password = md5(req.body.password);
        const user = new Account(req.body);
        await user.save();
        const token = user.tokenUser;
        res.json({
            code : 200,
            token: token,
        })
    }
    
}

// [POST] auth/login
module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email : email,
        deleted : false
    });
    if(!user){
        res.json({
            code : 400,
            massage: "email khong chinh xac!"
        })
        return
    }
    if(md5(password) !== user.password) {
        
        res.json({
            code : 200,
            massage : "Sai mat khau!"
        })
        return;
    }

    if(user.status === "inactive") {
        res.json({
            code : 200,
            massage : "tai khoan dang bi khoa!",
            role : user.role,
            
        })
        return;
    };

    const token = user.tokenUser;
    res.json({
        code : 200,
        massage: "khi ban thay tin nhan nay, ban da dang nhap thanh cong",
        token : token,
        role : user.role,
    })
}

// [POST] auth/logout
module.exports.logout = async (req, res) => {
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ message: "Logout successful" });
};

