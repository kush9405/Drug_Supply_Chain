import { expect } from "chai";
import hardhat from "hardhat";
const { ethers } = hardhat;

describe("DrugSupplyChain Integration", function () {
    let ParticipantRegistry;
    let participantRegistry;
    let DrugTracking;
    let drugTracking;
    let Verification;
    let verification;
    let owner;
    let manufacturer;
    let distributor;
    let pharmacy;

    beforeEach(async function () {
        [owner, manufacturer, distributor, pharmacy] = await ethers.getSigners();

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

        // Register participants
        await participantRegistry.connect(manufacturer).registerParticipant(0, "ManufacturerA"); // Manufacturer
        await participantRegistry.registerParticipant(1, "DistributorB", { from: distributor.address });   // Distributor
        await participantRegistry.registerParticipant(2, "PharmacyC", { from: pharmacy.address });      // Pharmacy

    });

    it("Should add a drug, transfer it, and verify it", async function () {
        // Add a drug (as manufacturer)
        await drugTracking.connect(manufacturer).addDrug("Aspirin", "LOT123");
        const drugId = 1;

        // Transfer the drug (as manufacturer)
        await drugTracking.connect(manufacturer).transferDrug(drugId, distributor.address);

        // Transfer the drug (as distributor)
        await drugTracking.connect(distributor).transferDrug(drugId, pharmacy.address);

        // Verify the drug (as pharmacy)
        const isAuthentic = await verification.verifyDrug(drugId);
        expect(isAuthentic).to.equal(true);
    });
});