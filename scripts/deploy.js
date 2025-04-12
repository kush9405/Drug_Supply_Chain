// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const ParticipantRegistry = await hre.ethers.getContractFactory("ParticipantRegistry");
    const participantRegistry = await ParticipantRegistry.deploy();
    await participantRegistry.deployed();
    console.log("ParticipantRegistry deployed to:", participantRegistry.address);

    const DrugTracking = await hre.ethers.getContractFactory("DrugTracking");
    const drugTracking = await DrugTracking.deploy(participantRegistry.address);
    await drugTracking.deployed();
    console.log("DrugTracking deployed to:", drugTracking.address);

     const Verification = await hre.ethers.getContractFactory("Verification");
    const verification = await Verification.deploy(drugTracking.address);
    await verification.deployed();
    console.log("Verification deployed to:", verification.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });