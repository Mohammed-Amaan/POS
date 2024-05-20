const mongoose = require("mongoose");
const CustomerSchema = new mongoose.Schema({
  customerName: {
    type: String,
  },
  customerPhoneNumber: {
    type: Number,
  },
  klipitId: {
    type: String,
  },
});
const Customer = mongoose.model("customers", CustomerSchema);
module.exports = Customer;
