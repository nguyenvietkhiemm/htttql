
const User = require("../../model/account.model");
// [GET] phân quyền
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
        role: { $ne: 3 }

    };
    const users = await User.find(find);
    res.json({
        code: 200,
        users: users,
        role : users.role,
    });
};


// PATCH phân quyền
module.exports.role = async (req, res) => {
    const id = req.body.id;
    const role = req.body.role;
    await User.findByIdAndUpdate(id, {role : role});
    res.json({
        code : 200,
        message : "Cập nhật thành công",
    });
}  