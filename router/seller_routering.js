const express = require("express");
require("../database/conn");
const seller = require("../models/Seller");
const app = express();
const router = new express.Router();



// Add New seller


router.post("/seller/seller_details", async(req, res) => {
    // Add new seller
    try {
        const new_seller = await new seller(req.body)
        new_seller.save().then(() => {
            res.status(201).send(new_seller);
            console.log('seller data is added');
        }).catch((e) => {
            console.log(e);
            res.status(500).send("Something went wrong" + "\n" + e);
        })
    } catch (e) {
        console.log(e);
        res.status(500).send("Something went wrong\n" + e);
    }
})
router.get("/seller/get_seller_details/:id", async(req, res) => {
    // Get data of particular seller
    try {
        const id_of_seller = req.params.id;
        const data_of_seller = await seller.findOne({ "_id": id_of_seller })
        res.status(200).send(data_of_seller);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})
router.get("/seller/get_sellers_details", async(req, res) => {
    // Get all data of seller's
    try {
        const get_sellers_data = await seller.find()
        res.status(200).send(get_sellers_data);
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})
router.put("/seller/update_sellers_details/:id", async(req, res) => {
    // Update particular seller's data
    try {
        const id_of_seller = req.params.id;
        const data_of_seller = await seller.findOne({ "_id": id_of_seller }, function(err, foundProduct) {
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
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})
router.delete("/seller/delete_seller/:id", async(req, res) => {
    //    Delete particular seller
    try {
        const id = req.params.id;
        const delete_seller = await seller.findByIdAndDelete(id)
            .then(() => {
                console.log("seller's account is deleted");
            }).catch((err) => {
                res.status(500).send("Something went wrong");
            });
        res.status(202).send("seller's data is deleted");
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
})

// Add Products Details

router.post("/seller/:seller_id/add_products/", async(req, res) => {
    // Add products in particular seller
    try {
        const id_of_seller = req.params.seller_id;
        const data_of_seller = await seller.findOneAndUpdate({ "_id": id_of_seller }, { $push: { products: req.body } })
            .then(() => {
                console.log("Product added in seller's product");
            })
            .catch((err) => {
                res.status(500).send("Something went wrong");
            });
        res.status(201).send("product added in seller's product");
    } catch (err) {
        res.status(500).send("something went wrong")
    }
})
router.get("/seller/:seller_id/get_products/:id_of_product", async(req, res) => {
    // Get products of particular sellers
    try {
        const seller_id = req.params.seller_id;
        const id_of_product = req.params.id_of_product;
        const find_product = await seller.find({ "_id": seller_id }, { products: { $elemMatch: { "_id": id_of_product } } })
        res.status(200).send(find_product);
    } catch (err) {
        res.status(500).send("Something went wrong")
    }
});
router.get("/seller/:seller_id/get_all_products", async(req, res) => {
    // Get all products from particular sellers
    try {
        const seller_id = req.params.seller_id;
        const find_products = await seller.find({ "_id": seller_id }).select("products")
        res.status(200).send(find_products);
    } catch (err) {
        res.status(500).send("something went wrong");
    }
})
router.put("/seller/:seller_id/update_product/:id_of_product", async(req, res) => {
    // Update particular product from particular seller
    const seller_id = req.params.seller_id;
    const id_of_product = req.params.id_of_product;
    const update_product = await seller.findOne({ "_id": seller_id, "products._id": id_of_product }, function(err, foundProduct) {
        if (err) {
            console.log(err);
            res.status(500).send("something went wrong");
        } else {
            if (!foundProduct) {
                res.status(404).send("Not Found");
            } else {
                function find_product(product) {
                    return product["_id"] == req.params.id_of_product;
                }
                index = foundProduct.products.find(find_product);
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
    });
});
router.delete("/seller/:seller_id/delete_product/:id_of_product", async(req, res) => {
    // Delete Particular product from particular seller
    try {
        const seller_id = req.params.seller_id;
        const id_of_product = req.params.id_of_product;
        const delete_product = await seller.findOneAndUpdate({ "_id": seller_id }, { $pull: { products: { "_id": id_of_product } } }, { new: true })
            .then(function() {
                console.log("Data deleted"); // Delete
            }).catch(function(error) {
                console.log(error); // Failure
                res.status(404).send("Fail to Delete")
            });
        res.status(202).send("product is deleted");
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
});




app.use(router);
module.exports = router;