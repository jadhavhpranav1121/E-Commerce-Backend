const mongoose = require("mongoose");
const product_details = require("./product_scheme")
const buyerScheme = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        default: "demo first_name"
    },
    last_name: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        default: "demo last_name"
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        unique: true,
        trim: true,
        default: "demo@mail.com"
    },
    password: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/.test(v); // special-number-capital
            },
            message: "Please enter a valid password"
        },
        default: "aI@42312"
    },
    phone_number: {
        type: Number,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.toString().length == 10;
            },
            message: "length of phone number should be 10"
        },
        default: 1122334455
    },
    address: {
        type: String,
        required: true,
        trim: true,
    },
    wishlist: {
        type: [product_details],
        default: []
    },
    buy: {
        type: [product_details],
        default: []
    }
})

const buyer = new mongoose.model('buy', buyerScheme);
module.exports = buyer;