const { ethers } = require("ethers");
require("dotenv").config();

const statistic_abi = require("../abi/updateStats.json");
const statistic_contract_address = process.env.update_stats_address;
const PRIVATE_KEY = process.env.nft_contract_owner_privatekey;

const username = "a0sfmgp0vk";
const password = "rPWKeZg9TZj8KZOc8fh-6ztnpESXj5MLgobLkYmM0e4";
const kaleidoUrl = "https://a0x2clch1x-a0qzhmnkxx-rpc.au0-aws.kaleido.io/";

const kaleidoProvider = new ethers.providers.JsonRpcProvider({
  url: kaleidoUrl,
  user: username,
  password: password,
});

const signer = new ethers.Wallet(PRIVATE_KEY, kaleidoProvider);
const statisticsInstance = new ethers.Contract(
  statistic_contract_address,
  statistic_abi,
  signer
);

exports.addNewInvoice = async (req, res) => {
  const { adminId } = req.body;
  const { totalAmount } = req.body;
  try {
    const tx = await statisticsInstance.addInvoice(adminId, totalAmount);
    res.status(200).json({
      success: "Invoice added to blockchain",
      transaction: tx,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.viewInvoices = async (req, res) => {
  const { adminId } = req.body;
  try {
    const result = await statisticsInstance.viewInvoices(adminId);
    const timestamps = result[0].map((t) => t.toString());
    const amounts = result[1].map((a) => a.toString());
    const mergedArray = timestamps.map((timestamp, index) => {
      return { timestamp: timestamp, amount: amounts[index] / 100 };
    });
    res.status(200).json({
      success: true,
      tx: mergedArray,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
