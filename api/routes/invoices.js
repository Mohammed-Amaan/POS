const Invoice = require("../models/Invoice.js");
const express = require("express");
const router = express.Router();

//! create invoice
router.post("/add-invoice", async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(200).json(invoice);
  } catch (error) {
    res.send(400).json(error);
  }
});

//! get all invoices
router.get("/get-all", async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.send(400).json(error);
  }
});

//! update invoice
// router.put("/update-invoice", async (req, res) => {
//   try {
//     await Invoice.findOneAndUpdate({ _id: req.body.invoiceId }, req.body);
//     res.status(200).json("Item updated successfully.");
//   } catch (error) {
//     res.send(400).json(error);
//   }
// });

router.delete("/delete-invoice", async (req, res) => {
  try {
    await Invoice.deleteMany({});
    res.status(200).json("All invoices deleted successfully.");
  } catch (error) {
    res.send(400).json(error);
  }
});

module.exports = router;
