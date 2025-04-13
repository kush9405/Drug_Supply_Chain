/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/" + process.env.INFURA_PROJECT_ID,
      accounts: [process.env.PRIVATE_KEY],
      timeout: 200000, // Increase timeout to 200 seconds
    },
  },
};
