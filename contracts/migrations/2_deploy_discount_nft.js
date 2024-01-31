const SDVDiscountNFT = artifacts.require("SDVDiscountNFT");
const SDVToken = artifacts.require("SDVToken");

module.exports = async function (deployer) {
  const sdvTokenInstance = await SDVToken.deployed();

  const baseTokenURI = "./.metadata/";

  const ticketPrice = 300; 

  await deployer.deploy(SDVDiscountNFT, sdvTokenInstance.address, baseTokenURI, ticketPrice);
};
