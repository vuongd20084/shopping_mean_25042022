const mongoose = require("mongoose");

//1. tạo cấu trúc collection: schema
const productModel = mongoose.Schema({
    name: { type: String, require: true, unique: true },
    slug: { type: String, require: true, unique: true },
    parents: { type: mongoose.Types.ObjectId, default: null },
    idUsers: { type: mongoose.Types.ObjectId, default: null },
    avatar: { type: String, default: null },
    status: { type: Boolean, default: true },
    trash: { type: Boolean, default: false },
    date_created: { type: Date, default: Date.now() },
    date_updated: { type: Date, default: null },

})

//2. tạo collection: model
module.exports = mongoose.model("product", productModel);