require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",

  networks: {
    ChilizSpicyTestnet: {
      url: "https://testnet.chiliscan.com/",

      accounts: [""],
    },
  },

  etherscan: {
    customChains: [
      {
        network: "Chiliz Spicy Testnet",
        chainId: 88882,
        urls: {
          apiURL: "wss://spicy-rpc-ws.chiliz.com/", // Replace with your mode network node URL
          browserURL: "https://testnet.chiliscan.com/", // Replace with your mode network browser URL
        },
      },
    ],
    apiKey: {
      ChilizSpicyTestnet: "",
    },
  },
};
