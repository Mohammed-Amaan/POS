const express = require("express");
const router = express.Router();
const {
  mintInBulk,
  mintCustomerNft,
  viewBalance,
  viewTotalSupply,
} = require("../controllers/nft.controller");

router.post("/", mintCustomerNft);
router.post("/bulk", mintInBulk);
router.get("/balance", viewBalance);
router.get("/supply", viewTotalSupply);

module.exports = router;
