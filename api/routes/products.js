const Product = require("../models/Product.js");
const express = require("express");
const router = express.Router();

//! get all product
router.get("/get-all", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});
router.get("/get-one/:barcode", async (req, res) => {
  try {
    const product = await Product.findOne({ barcode: req.params.barcode });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
  }
});
//! create product
router.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json("Item added successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

//!update product
router.put("/update-product", async (req, res) => {
  try {
    await Product.findOneAndUpdate({ _id: req.body.productId }, req.body);
    res.status(200).json("Item updated successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

//! delete product
router.delete("/delete-product", async (req, res) => {
  try {
    await Product.findOneAndDelete({ _id: req.body.productId });
    res.status(200).json("Item deleted successfully.");
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
