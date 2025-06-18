const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const docSchema = new mongoose.Schema({
    title : String,
    description : {
        type: String,
        default: "Chưa có mô tả"
    },
    check : Number,

    thumbnail :  { type: String },         // Lưu đường dẫn file ảnh
    documentFile: { type: String }, 
    
    status: {
        type: String,
        default: "pending" // "Chưa duyệt", "Chờ duyệt", "Đã duyệt", "Từ chối"
    },
    reviewBy: {
        account_id : {
            type: String,
            default: null
        },
        note: {
            type: String,
            default: null
        }
    },
    slug: {
        type : String,
        slug : "title",
        unique : true
    },
    
    createBy: {
        account_id : String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted : {
        type : Boolean,
        default : false
    },
    deleteBy:{
        account_id: String,
        deleteAt: {
            type: Date,
            default: Date.now 
        }
    },
    updatedBy:[{
            account_id: String,
            updateAt: {
                type: Date,
                default: Date.now 
        }
    }]
},
{
    timestamps : true,
});

const Document = mongoose.model("Document", docSchema, "docs");
module.exports = Document;


