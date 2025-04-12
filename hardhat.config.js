/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with your Infura project ID
      accounts: ["YOUR_PRIVATE_KEY"], // Replace with your wallet private key
    },
  },
};
