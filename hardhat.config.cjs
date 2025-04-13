const { HardhatUserConfig } = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");
require("dotenv/config");

const config = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      // Added explicit configuration for hardhat network
      chainId: 31337,
      mining: {
        auto: true,
        interval: 0
      }
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 200000,
    },
  },
  mocha: {
    timeout: 40000 // Setting a longer timeout for tests
  }
};

module.exports = config;