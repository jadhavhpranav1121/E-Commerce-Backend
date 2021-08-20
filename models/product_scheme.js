const mongoose = require("mongoose");
const product_details = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: "demo"
    },
    price: {
        type: Number,
        trim: true,
        default: 0
    },
    quantity: {
        type: Number,
        trim: true,
        default: 0,
    },
    details: {
        type: String,
        trim: true,
        default: "demo details"
    }
})
module.exports = product_details;