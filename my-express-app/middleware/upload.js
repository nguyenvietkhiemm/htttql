const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Hàm tạo tên file mới
const generateFileName = (originalName, fieldname) => {
  const ext = path.extname(originalName);
  const randomPart = crypto.randomBytes(6).toString('hex');
  const timestamp = Date.now();
  const baseName = `${timestamp}-${randomPart}`;
  // Nếu là thumbnail thì thêm hậu tố '-01'
  return fieldname === 'thumbnail'
    ? `${baseName}${ext}`
    : `${baseName}${ext}`;
};

var prefix = false; // Biến để xác định có cần thêm tiền tố hay không
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = 'public/others';

    if (file.fieldname === 'thumbnail') {
      folder = 'public/img';
      prefix = true; // Thêm tiền tố cho ảnh
    }
    else if (file.fieldname === 'documentFile') folder = 'public/pdfs';

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const newFileName = generateFileName(file.originalname, prefix);
    cb(null, newFileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['jpeg', 'jpg', 'png', 'gif', 'pdf', 'doc', 'docx'];
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Loại file không được hỗ trợ: ' + ext), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
