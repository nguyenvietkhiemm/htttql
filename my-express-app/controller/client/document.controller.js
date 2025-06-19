const Document = require("../../model/document.model");
const Account = require("../../model/account.model");
const path = require("path");
const fs = require("fs");
const pdf = require('pdf-poppler');
// [GET] /document
module.exports.index = async (req, res) => {
    try {
        let find = {
            deleted: false,
            "createBy.account_id": req.account._id
        };
        if (req.account.role > 1) {
            find = {
                deleted: false,
            };
        }

        const documents = await Document.find(find);

        const result = await Promise.all(documents.map(async doc => {
            const obj = doc.toObject();
            const acc = await Account.findById(doc.createBy.account_id).select("fullName");
            obj.createBy.fullName = acc?.fullName || "Không rõ";
            return obj;
        }));

        res.json({
            code: 200,
            document: result,
            role: req.role,
        });
    } catch (err) {
        console.error("Lỗi lấy tài liệu:", err);
        res.status(500).json({ code: 500, message: "Lỗi máy chủ!" });
    }
};

// [GET] /document/review
module.exports.myDocument = async (req, res) => {
    try {
        let find = {
            deleted: false,
            "createBy.account_id": req.account._id
        };

        const documents = await Document.find(find);

        const result = await Promise.all(documents.map(async doc => {
            const obj = doc.toObject();
            const acc = await Account.findById(doc.createBy.account_id).select("fullName");
            obj.createBy.fullName = acc?.fullName || "Không rõ";
            return obj;
        }));

        res.json({
            code: 200,
            document: result,
            role: req.role,
        });
    } catch (err) {
        console.error("Lỗi lấy tài liệu:", err);
        res.status(500).json({ code: 500, message: "Lỗi máy chủ!" });
    }
};

// [GET] /document/approvedPublic
module.exports.approvedPublic = async (req, res) => {
    try {
        let find = {
            deleted: false,
            status: "approved",
        };

        const documents = await Document.find(find);

        const result = await Promise.all(documents.map(async doc => {
            const obj = doc.toObject();
            const acc = await Account.findById(doc.createBy.account_id).select("fullName");
            obj.createBy.fullName = acc?.fullName || "Không rõ";
            return obj;
        }));

        res.json({
            code: 200,
            document: result,
            role: req.role,
        });
    } catch (err) {
        console.error("Lỗi lấy tài liệu:", err);
        res.status(500).json({ code: 500, message: "Lỗi máy chủ!" });
    }
};

// [POST] /document/review/:slug
module.exports.editReview = async (req, res) => {
    const { status, comment } = req.body;

    const account_id = req.account._id;
  
    if (!["approved", "rejected", "warning"].includes(status)) {
        return res.status(400).json({ code: 400, message: "Trạng thái không hợp lệ" });
      }
    
      try {
        const doc = await Document.findOneAndUpdate(
          { deleted: false, slug: req.params.slug },
          {
            $set: {
              status: status,
              reviewBy: {
                account_id,
                note: comment || null
              }
            }
          },
          { new: true }
        );
    
        if (!doc) {
          return res.status(404).json({ code: 404, message: "Không tìm thấy tài liệu" });
        }
    
        res.json({ code: 200, message: "Cập nhật thành công", document: doc });
      } catch (err) {
        console.error(err);
        res.status(500).json({ code: 500, message: "Lỗi server" });
      }
};


// [POST] /document/buy:slug
module.exports.buy = async (req, res) => {
    try {
        const document = await Document.findOne({
            deleted: false,
            slug: req.params.slug
        });

        if (!document) {
            return res.status(404).json({ message: "Tài liệu không tồn tại!" });
        }

        const account = req.account;
        const docIdStr = document._id.toString();
        const hasDoc = account.documents.some(id => id.toString() === docIdStr) || document.createBy.account_id.toString() === account._id.toString() || account.role > 1;

        if (account.money < document.money) {
            res.status(200).json({
                message: "Bạn không đủ tiền cho tài liệu này",
            });
            return;
        }

        if (hasDoc) {
            res.status(200).json({
                message: "Bạn đã sở hữu tài liệu này rồi!",
            });
            return;
        }

        account.money -= document.money;
        account.money = Math.max(account.money, 0); // Đảm bảo tiền không âm
        account.documents.push(document._id);

        // Cộng tiền cho chủ sở hữu tài liệu (nếu chủ sở hữu tồn tại)
        if (document.createBy?.account_id && document.createBy.account_id.toString() !== account._id.toString()) {
            const ownerAccount = await Account.findById(document.createBy.account_id);
            if (ownerAccount) {
                ownerAccount.money = (ownerAccount.money || 0) + document.money;
                await ownerAccount.save();
            }
        }

        // Lưu tài khoản người dùng đã mua tài liệu
        await account.save();

        res.status(200).json({
            message: "Bạn đã mua tài liệu thành công!",
        });
    } catch (error) {
        console.error("Lỗi khi mua tài liệu:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi mua tài liệu!" });
    }
};



// [GET] Documents/detail/:slug
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slug,
        };

        const document = await Document.findOne(find);

        if (!document) {
            return res.status(404).json({ message: "Không tìm thấy tài liệu!" });
        }

        // Kiểm tra quyền
        // console.log("Account:", req.account.documents);
        if (document.createBy?.account_id !== req.account?._id.toString() &&
            req.account.role < 2 &&
            !req.account.documents.map(id => id.toString()).includes(document._id.toString())) {
            return res.status(403).json({ "message": "Bạn không có quyền truy cập tài liệu này!" });
        }

        // Kiểm tra đường dẫn file
        if (!document.documentFile) {
            return res.status(400).json({ message: "Tài liệu không có file đính kèm!" });
        }

        const filePath = path.join(__dirname, "..", "..", "public", document.documentFile);

        // Kiểm tra file tồn tại trước khi gửi
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "File không tồn tại trên máy chủ!" });
        }

        return res.sendFile(filePath);
    } catch (error) {
        console.error("Lỗi khi lấy tài liệu:", error);
        return res.status(500).json({ message: "Lỗi máy chủ khi truy cập tài liệu!" });
    }
};

// [GET] Documents/delete-item
module.exports.deleteItem = async (req, res) => {
    const id = req.body.id;
    await Document.updateOne(
        { _id: id },
        { deleted: true }
    );
    res.json({
        code: 200,
        message: "Xóa thành công!",
    });
}

function removePageSuffix(filename) {
    return filename.replace(/-\d{1,3}(?=\.jpg$)/, "");
}

async function generateThumbnail(pdfPath, outputDir = "public/img") {
    try {
        const outPrefix = path.basename(pdfPath, path.extname(pdfPath));
        const opts = {
            format: 'jpeg',
            out_dir: outputDir,
            out_prefix: outPrefix,
            page: 1,
        };

        await pdf.convert(pdfPath, opts);

        // Tìm file có hậu tố số trang
        const files = fs.readdirSync(outputDir)
            .filter(f => f.startsWith(outPrefix + "-") && f.endsWith(".jpg"));

        if (files.length > 0) {
            const originalFile = path.join(outputDir, files[0]);
            const newFile = path.join(outputDir, removePageSuffix(files[0]));
            // Nếu tên sau khi cắt khác tên gốc thì rename
            if (originalFile !== newFile) {
                fs.renameSync(originalFile, newFile);
            }
            return newFile;
        } else {
            console.warn("Không tìm thấy file thumbnail đã được tạo.");
            return null;
        }
    } catch (err) {
        console.error("Lỗi tạo thumbnail:", err);
        return null;
    }
}

module.exports.createPost = async (req, res) => {
    try {
        const account = req.account;

        const cleanBody = { ...req.body };
        if (!cleanBody._id || cleanBody._id === "null") delete cleanBody._id;

        let thumbnail = req.files?.thumbnail?.[0]?.path.replace(/^public[\\/]/, '');
        let documentFile = req.files?.documentFile?.[0]?.path.replace(/^public[\\/]/, '');

        if (!thumbnail && documentFile?.endsWith('.pdf')) {
            const fullPdfPath = path.join('public', documentFile);
            const generatedPath = await generateThumbnail(fullPdfPath);
            thumbnail = path.relative('public', generatedPath);
        }

        console.log("req", req.body._id)
        const document = new Document({
            ...cleanBody,
            thumbnail,
            documentFile,
            createBy: {
                account_id: account._id,
                createAt: new Date(),
            },
        });

        await document.save();

        res.json({
            code: 200,
            message: "Tạo tài liệu thành công!",
            document,
        });
    } catch (error) {
        console.error("Lỗi tạo tài liệu:", error);
        res.status(500).json({ code: 500, message: "Lỗi máy chủ!" });
    }
};

// [GET] Edit
module.exports.edit = async (req, res) => {
    const document = await Document.findOne({
        slug: req.params.slug
    });

    if (!document) {
        return res.status(404).json({
            message: "Document not found"
        });
    }

    res.json(document);
}

// [PATCH] Edit
module.exports.editPatch = async (req, res) => {
    const id = req.body._id;
    const account_id = req.account.account_id;

    try {
        await Document.updateOne(
            { _id: id, account_id },
            {
                ...req.body,
            }
        );
        res.json({
            code: 200,
            message: "Cap nhap thanh cong!",
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "Cap nhap that bai!",
        })
    }

}

