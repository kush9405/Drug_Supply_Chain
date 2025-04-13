import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("Verification", function () {
    let ParticipantRegistry;
    let participantRegistry;
    let DrugTracking;
    let drugTracking;
    let Verification;
    let verification;
    let owner;
    let manufacturer;

    beforeEach(async function () {
        [owner, manufacturer] = await ethers.getSigners();

        // Deploy ParticipantRegistry
        ParticipantRegistry = await ethers.getContractFactory("ParticipantRegistry");
        participantRegistry = await ParticipantRegistry.deploy();
        await participantRegistry.deployed();

        // Deploy DrugTracking and link to ParticipantRegistry
        DrugTracking = await ethers.getContractFactory("DrugTracking");
        drugTracking = await DrugTracking.deploy(participantRegistry.address);
        await drugTracking.deployed();

        // Deploy Verification and link to DrugTracking
        Verification = await ethers.getContractFactory("Verification");
        verification = await Verification.deploy(drugTracking.address);
        await verification.deployed();

        // Register the manufacturer
        await participantRegistry.connect(manufacturer).registerParticipant(0, "ManufacturerA"); // Manufacturer
    });

    it("Should return true for a valid drug", async function () {
        // Add a drug as the manufacturer
        await drugTracking.connect(manufacturer).addDrug("Aspirin", "LOT123");
        const drugId = 1;

        // Verify the drug
        const isValid = await verification.verifyDrug(drugId);
        expect(isValid).to.equal(true);
    });

    it("Should return false for a counterfeit drug", async function () {
        // Add a drug as the manufacturer
        await drugTracking.connect(manufacturer).addDrug("Aspirin", "LOT123");
        const drugId = 1;

        // Mark the drug as counterfeit (for testing purposes)
        await drugTracking.markAsCounterfeit(drugId);

        // Verify the drug
        const isValid = await verification.verifyDrug(drugId);
        expect(isValid).to.equal(false);
    });

    it("Should return false for a non-existent drug", async function () {
        const drugId = 999; // A drug that doesn't exist
        const isValid = await verification.verifyDrug(drugId);
        expect(isValid).to.equal(false);
    });

    // Add more test cases for different scenarios (e.g., invalid signatures)
});