const NFTMembershipToken = artifacts.require("NFTMembershipToken");
const SDVDiscountNFT = artifacts.require("SDVDiscountNFT");
const SDVToken = artifacts.require("SDVToken");

module.exports = function (deployer) {
  deployer.deploy(NFTMembershipToken);

  const baseTokenURI = "file:///public/metadata/";
  deployer.deploy(SDVDiscountNFT, baseTokenURI);

  deployer.deploy(SDVToken);

};
