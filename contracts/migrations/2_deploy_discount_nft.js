const SDVDiscountNFT = artifacts.require("SDVDiscountNFT");
const SDVPerformanceNFT = artifacts.require("SDVPerformanceNFT");
const SDVToken = artifacts.require("SDVToken");

module.exports = async function (deployer) {
  await deployer.deploy(SDVToken);

  const sdvTokenInstance = await SDVToken.deployed();
  const baseTokenURI = "./public/metadata/";

  await deployer.deploy(SDVDiscountNFT, sdvTokenInstance.address, baseTokenURI);
  await deployer.deploy(SDVPerformanceNFT);
};
