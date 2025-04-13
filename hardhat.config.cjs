const { HardhatUserConfig } = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");
require("dotenv/config");

const config = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 200000,
    },
  },
};

module.exports = config;
