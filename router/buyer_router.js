const express = require("express");
require("../database/conn");
const buyer = require("../models/Buyer");
const app = express();
const router = new express.Router();

// CRUD for buyer

router.post("/buyer/add_buyer_details", async(req, res) => {
    // To save data of buyer
    try {
        const new_buyer = await new buyer(req.body)
        new_buyer.save().then(() => {
            res.status(201).send(new_buyer);
            console.log('catched');
        }).catch((e) => {
            console.log(e);
            res.status(404).send(e);
        })
    } catch (e) {
        console.log(e);
    }
})
router.get("/buyer/get_buyer/:buyer_id", async(req, res) => {
    // get particular data of buyer
    try {
        const buyer_id = req.params.buyer_id;
        const buyer_data_by_id = await buyer.findOne({ "_id": buyer_id })
        res.status(200).send(buyer_data_by_id);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
router.get("/buyer/get_all_buyer", async(req, res) => {
    // get all data of buyer
    try {
        const buyer_details = await buyer.find()
        res.status(200).send(buyer_details);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
router.put("/buyer/update_buyer/:buyer_id", async(req, res) => {
    // Update buyer's data
    try {
        const buyer_id = req.params.buyer_id;
        const update_buyer = await buyer.findOne({ "_id": buyer_id }, function(err, foundProduct) {
            if (err) {
                console.log(err);
                res.status(500).send("something went wrong");
            } else {
                if (!foundProduct) {
                    res.status(404).send("Not Found");
                } else {
                    if (req.body.first_name) {
                        foundProduct.first_name = req.body.first_name;
                    }
                    if (req.body.last_name) {
                        foundProduct.last_name = req.body.last_name;
                    }
                    if (req.body.email) {
                        foundProduct.email = req.body.email;
                    }
                    if (req.body.password) {
                        foundProduct.password = req.body.password;
                    }
                    if (req.body.phone_number) {
                        foundProduct.phone_number = req.body.phone_number;
                    }
                    if (req.body.address) {
                        foundProduct.address = req.body.address;
                    }
                    foundProduct.save(function(err, updatedProduct) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("something went wrong");
                        } else {
                            res.status(201).send(updatedProduct);
                        }
                    })
                }
            }
        })
    } catch (error) {
        res.status(500).send("Something went wrong");
    }

})
router.delete("/buyer/delete_buyer/:buyer_id", async(req, res) => {
    // Delete buyer's data
    try {
        const buyer_id = req.params.buyer_id;
        const delete_buyer = await buyer.findByIdAndDelete(buyer_id)
            .then(() => {
                console.log("Data is Deleted");
            })
            .catch((err) => {
                res.status(500).send("Something went wrong");
            })
        res.status(202).send("Data is deleted");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})


// CRUD for wishlist Details

router.post("/buyer/:buyer_id/add_wishlist/", async(req, res) => {
    // Add product in wishlist
    try {
        const id_of_buyer = req.params.buyer_id;
        const data_of_buyer = buyer.findOneAndUpdate({ "_id": id_of_buyer }, { $push: { wishlist: req.body } }, { upsert: true, new: true }, function(err, results) {
            if (err) {
                res.status(500).send("Something went wrong");
            } else if (results == null) {
                console.log("new product is not added in wishlist");
                res.status(500).send("Something went wrong");
            } else {
                res.status(201).send("new product is added in wishlist");
            }
        })
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})
router.get("/buyer/:buyer_id/get_wishlist/:id_of_product", async(req, res) => {
    // Get particular product from wishlist
    try {
        const buyer_id = req.params.buyer_id;
        const id_of_product = req.params.id_of_product;
        const find_product = await buyer.find({ "_id": buyer_id }, { wishlist: { $elemMatch: { "_id": id_of_product } } }, function(err, results) {
            if (err) {
                res.status(500).send("Something went wrong");
            } else if (results == null) {
                res.status(404).send("require product is not found");
            } else {
                res.status(200).send(results);
            }
        })
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});
router.get("/buyer/:buyer_id/get_all_wishlist", async(req, res) => {
    // Get all wishlist of buyer
    try {
        const buyer_id = req.params.buyer_id;
        const find_products = await buyer.findOne({ "_id": buyer_id }).select("wishlist")
        res.status(200).send(find_products);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
router.put("/buyer/:buyer_id/update_wishlist/:wishlist_id", async(req, res) => {
    // Update wishlist by selecting wishlist product
    const buyer_id = req.params.buyer_id;
    const wishlist_id = req.params.wishlist_id;
    const find_wishlist = await buyer.findOneAndUpdate({ "_id": buyer_id, "wishlist._id": wishlist_id }, { $set: { "wishlist.$": req.body } }, function(err, foundProduct) {
        if (err) {
            console.log(err);
            res.status(500).send("something went wrong");
        } else {
            if (!foundProduct) {
                res.status(404).send("Not Found");
            } else {
                function find_product(wishlist) {
                    return wishlist["_id"] == req.params.wishlist_id;
                }
                index = foundProduct.wishlist.find(find_product);
                if (req.body.name) {
                    index.name = req.body.name;
                }
                if (req.body.price) {
                    index.price = req.body.price;
                }
                if (req.body.details) {
                    index.details = req.body.details;
                }
                if (req.body.quantity) {
                    index.quantity = req.body.quantity;
                }
                foundProduct.save(function(err, updatedProduct) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("something went wrong");
                    } else {
                        res.status(201).send(updatedProduct);
                    }
                })
            }
        }
    })
})
router.delete("/buyer/:buyer_id/delete_product_in_wishlist/:id_of_product", async(req, res) => {
    // Delete particular product from wishlist
    try {
        const buyer_id = req.params.buyer_id;
        const id_of_product = req.params.id_of_product;
        const delete_product = await buyer.findOneAndUpdate({ "_id": buyer_id }, { $pull: { wishlist: { "_id": id_of_product } } }, { new: true })
            .then(function() {
                console.log("Data deleted"); // Success
            }).catch(function(error) {
                console.log(error); // Failure
                res.status(404).send(error)
            });
        res.status(202).send("Product is deleted in wishlist");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});

// CRUD for buy 

router.post("/buyer/:id_of_buyer/add_buy", async(req, res) => {
    // Add product in buyer's buy
    try {
        const id_of_buyer = req.params.id_of_buyer;
        const data_of_buyer = buyer.findOneAndUpdate({ "_id": id_of_buyer }, { $push: { buy: req.body } }, { upsert: true, new: true }, function(err, results) {
            if (err) {
                res.status(500).send("Something went wrong");
            } else if (results == null) {
                console.log("new product is not added in buy");
                res.status(500).send("new product is not added in buy");
            } else {
                res.status(201).send("new product is added in buy");
            }
        })

    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
router.get("/buyer/:buyer_id/get_buy/:id_of_product", async(req, res) => {
    // Get particular product from particular buyer's buy
    try {
        const buyer_id = req.params.buyer_id;
        const id_of_product = req.params.id_of_product;
        const find_product = await buyer.find({ "_id": buyer_id }, { buy: { $elemMatch: { "_id": id_of_product } } })
        res.status(200).send(find_product);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});
router.get("/buyer/:buyer_id/get_all_buy", async(req, res) => {
    // Get all product from particular buyer
    try {
        const buyer_id = req.params.buyer_id;
        const find_products = await buyer.findOne({ "_id": buyer_id }).select("buy")
        res.status(200).send(find_products);
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
router.put("/buyer/:buyer_id/update_buy/:buy_id", async(req, res) => {
    // Update particular product in buyer's buy
    try {
        const buyer_id = req.params.buyer_id;
        const buy_id = req.params.buy_id;
        const find_products = await buyer.findOne({ "_id": buyer_id, "buy._id": buy_id }, function(err, foundProduct) {
            if (err) {
                console.log(err);
                res.status(500).send("something went wrong");
            } else {
                if (!foundProduct) {
                    res.status(404).send("Not Found");
                } else {
                    function find_product(buy) {
                        return buy["_id"] == req.params.buy_id;
                    }
                    index = foundProduct.buy.find(find_product);
                    if (req.body.name) {
                        index.name = req.body.name;
                    }
                    if (req.body.price) {
                        index.price = req.body.price;
                    }
                    if (req.body.details) {
                        index.details = req.body.details;
                    }
                    if (req.body.quantity) {
                        index.quantity = req.body.quantity;
                    }
                    foundProduct.save(function(err, updatedProduct) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("something went wrong");
                        } else {
                            res.status(201).send(updatedProduct);
                        }
                    })
                }
            }
        })
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})
router.delete("/buyer/:buyer_id/delete_product_in_buy/:id_of_product", async(req, res) => {
    // Delete Particular product from buyer's buy
    try {
        const buyer_id = req.params.buyer_id;
        const id_of_product = req.params.id_of_product;
        const delete_product = await buyer.findOneAndUpdate({ "_id": buyer_id }, { $pull: { buy: { "_id": id_of_product } } }, { new: true })
            .then(function() {
                console.log("Data deleted"); // Success
            }).catch(function(error) {
                console.log(error); // Failure
                res.status(404).send(error)
            });
        res.status(202).send("product in buy is deleted");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});


app.use(router);
module.exports = router;