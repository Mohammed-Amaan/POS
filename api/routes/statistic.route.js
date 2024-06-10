const express = require("express");
const router = express.Router();
const {
  addNewInvoice,
  viewInvoices,
} = require("../controllers/newStats.controller");

router.post("/new/invoice", addNewInvoice);
router.post("/new/get", viewInvoices);

module.exports = router;
