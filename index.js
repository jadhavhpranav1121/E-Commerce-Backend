const express = require("express");
require("./database/conn");
const seller = require("./models/Seller");
const buyer = require("./models/Buyer");
const seller_router = require("./router/seller_routering");
const buy_router = require("./router/buyer_router");
const app = express();
app.use(express.json());
app.use(seller_router);
app.use(buy_router);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("success");
})