const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: true },
    price: { type: Number, required: true }, //unit Amount
    category: { type: String, required: true },
    truklipId: { type: String }, //removed?
    nftCompatible: { type: String },
    unitQuantity: { type: String },
    barcode: { type: String },
    subCategory: { type: String },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("products", ProductSchema);

module.exports = Product;
