const { ethers } = require("ethers");
require("dotenv").config();

const NFT_ABI = require("../abi/abi.json");
const CONTRACT_ADDRESS = process.env.nft_contract_address;
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
const nftContractInstance = new ethers.Contract(
  CONTRACT_ADDRESS,
  NFT_ABI,
  signer
);
exports.mintCustomerNft = async (req, res) => {
  const { address } = req.body;
  const { klipitId } = req.body;
  const { truklipId } = req.body;

  try {
    const tx = await nftContractInstance.mintCustomerNft(
      address,
      klipitId,
      truklipId
    );
    await tx.wait(1);
    res.status(200).json({
      success: "NFT Minted!",
      transaction: tx,
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.mintInBulk = async (req, res, next) => {
  try {
    const { address } = req.body;
    const { klipitId } = req.body;
    const { truklipIds } = req.body;

    const tx = await nftContractInstance.safeMintInBulk(
      address,
      klipitId,
      truklipIds
    );
    //await tx.wait();

    res.status(200).json({
      success: "NFT's minted",
      transaction: tx,
    });
  } catch (error) {
    res.status(400).json(error.message);
  }
};
exports.viewBalance = async (req, res) => {
  try {
    const { address } = req.body;
    const result = await nftContractInstance.viewBalance(address);
    res.status(200).json({
      success: true,
      balance: result.toString(),
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.viewTotalSupply = async (req, res) => {
  try {
    const tx = await nftContractInstance.getTotalSupply();
    res.status(200).json({
      success: true,
      totalsupply: tx.toString(),
    });
  } catch (error) {
    res.status(400).json(error);
  }
};
