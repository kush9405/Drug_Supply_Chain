import { expect } from "chai";
import hardhat from "hardhat";
import pkg from "@openzeppelin/test-helpers"; // Import as default
const { expectRevert } = pkg; // Destructure the required helper
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
        await participantRegistry.connect(distributor).registerParticipant(1, "DistributorB");   // Distributor
        await participantRegistry.connect(pharmacy).registerParticipant(2, "PharmacyC");
    });

    it("Should add a drug, transfer it, and verify it", async function () {
        // Add a drug (as manufacturer)
        await drugTracking.connect(manufacturer).addDrug("Aspirin", "LOT123");
        const drugId = 1;

        // Verify manufacturer is the current holder
        let drugInfo = await drugTracking.getDrugInfo(drugId);
        expect(drugInfo.currentHolder).to.equal(manufacturer.address);

        // Transfer the drug from manufacturer to distributor
        await drugTracking.connect(manufacturer).transferDrug(drugId, distributor.address);

        // Verify distributor is the current holder
        drugInfo = await drugTracking.getDrugInfo(drugId);
        expect(drugInfo.currentHolder).to.equal(distributor.address);

        // Transfer the drug from distributor to pharmacy
        await drugTracking.connect(distributor).transferDrug(drugId, pharmacy.address);

        // Verify pharmacy is the current holder
        drugInfo = await drugTracking.getDrugInfo(drugId);
        expect(drugInfo.currentHolder).to.equal(pharmacy.address);

        // Verify the drug (as pharmacy)
        const isAuthentic = await verification.verifyDrug(drugId);
        expect(isAuthentic).to.equal(true);
    });
});