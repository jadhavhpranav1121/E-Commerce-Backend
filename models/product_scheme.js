const mongoose = require("mongoose");
const product_details = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: "demo name"
    },
    price: {
        type: Number,
        required: true,
        trim: true,
        default: 0
    },
    quantity: {
        type: Number,
        required: true,
        trim: true,
        default: 0,
    },
    details: {
        type: String,
        required: true,
        trim: true,
        default: "demo details"
    }
})
module.exports = product_details;