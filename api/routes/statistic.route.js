const express = require("express");
const router = express.Router();
const {
  viewTotalSales,
  viewTotalSalesAmount,
  addInvoice,
} = require("../controllers/statistic.controller");
const {
  addNewInvoice,
  viewInvoices,
} = require("../controllers/newStats.controller");
router.post("/invoice", addInvoice);
router.post("/sales", viewTotalSales);
router.post("/amount", viewTotalSalesAmount);

router.post("/new/invoice", addNewInvoice);
router.post("/new/get", viewInvoices);

module.exports = router;
