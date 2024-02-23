// migrations/1_deploy_contracts.js
const NFTMembershipToken = artifacts.require("NFTMembershipToken");
const SDVDiscountNFT = artifacts.require("SDVDiscountNFT");
const SDVToken = artifacts.require("SDVToken");
const SDVPerformanceNFT = artifacts.require("SDVPerformanceNFT");

module.exports = function (deployer) {
  deployer.deploy(NFTMembershipToken);

  const baseTokenURI = "file:///public/metadata/";
  deployer.deploy(SDVDiscountNFT, baseTokenURI);

  deployer.deploy(SDVToken);

  deployer.deploy(SDVPerformanceNFT);
};
