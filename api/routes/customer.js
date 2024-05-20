const express = require("express");
const Customer = require("../models/Customer");
const router = express.Router();

router.post("/addCustomer", async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.post("/viewCustomer", async (req, res) => {
  try {
    const customer = await Customer.findOne({ klipitId: req.body.klipitId });
    res.status(200).json(customer);
  } catch (error) {
    res.status(400).json(error);
  }
});
module.exports = router;
