const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/simple_database", { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => {
        console.log("connection is successful");
    })
    .catch((err) => {
        console.log(err);
    });