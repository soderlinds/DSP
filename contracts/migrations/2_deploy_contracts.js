const SDVToken = artifacts.require("SDVToken");

module.exports = function (deployer) {
  deployer.deploy(SDVToken);
};