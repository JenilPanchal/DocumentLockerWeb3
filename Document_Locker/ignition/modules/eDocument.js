// deploy.js
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("NFTFactoryModule", (m) => {
  const eDocument = m.contract("eDocument");

  return {
    eDocument,
  };
});
