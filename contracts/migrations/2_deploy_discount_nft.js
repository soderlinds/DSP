const NFTMembershipToken = artifacts.require("NFTMembershipToken");
const SDVDiscountNFT = artifacts.require("SDVDiscountNFT");
const SDVToken = artifacts.require("SDVToken");
const SDVProductionNFT = artifacts.require("SDVProductionNFT");

module.exports = function (deployer) {
  deployer.deploy(NFTMembershipToken);

  const baseTokenURI = "file:///public/metadata/";
  deployer.deploy(SDVDiscountNFT, baseTokenURI);

  deployer.deploy(SDVToken);

  deployer.deploy(SDVProductionNFT);
};
