const SDVToken = artifacts.require("SDVToken");

module.exports = async function (deployer) {
  await deployer.deploy(SDVToken);
};