// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const participantRegistryAddress = "0x2Df27729beA73294526d5b05aD358cf8eB5385B7"; // Replace with the deployed address
    console.log("Using existing ParticipantRegistry at:", participantRegistryAddress);

    const DrugTracking = await hre.ethers.getContractFactory("DrugTracking");
    console.log("Deploying DrugTracking...");
    const drugTracking = await DrugTracking.deploy(participantRegistryAddress, {
        gasLimit: 6000000, // Increase gas limit
    });
    await drugTracking.deployed();
    console.log("DrugTracking deployed to:", drugTracking.address);

    const Verification = await hre.ethers.getContractFactory("Verification");
    console.log("Deploying Verification...");
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