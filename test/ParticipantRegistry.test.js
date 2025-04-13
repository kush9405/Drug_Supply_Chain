import { expect } from "chai";
import hardhat from "hardhat";
import pkg from "@openzeppelin/test-helpers"; // Import as default
const { expectRevert } = pkg; // Destructure the required helper
const { ethers } = hardhat;

describe("ParticipantRegistry", function () {
    let ParticipantRegistry;
    let participantRegistry;
    let owner;
    let addr1;
    let addr2;
    let manufacturer;

    before(async function () {
        // Deploy the contract once before all tests
        ParticipantRegistry = await ethers.getContractFactory("ParticipantRegistry");
        [owner, addr1, addr2, manufacturer] = await ethers.getSigners();
        participantRegistry = await ParticipantRegistry.deploy();
        await participantRegistry.deployed();
    });

    it("Should register a manufacturer", async function () {
        await participantRegistry.connect(manufacturer).registerParticipant(0, "ManufacturerA"); // 0 for Manufacturer
        const participant = await participantRegistry.participants(manufacturer.address);
        expect(participant.participantType).to.equal(0);
        expect(participant.name).to.equal("ManufacturerA");
        expect(await participantRegistry.isParticipant(manufacturer.address)).to.equal(true);
    });

    it("Should register a distributor", async function () {
        await participantRegistry.connect(addr1).registerParticipant(1, "DistributorB"); // 1 for Distributor
        const participant = await participantRegistry.participants(addr1.address);
        expect(participant.participantType).to.equal(1);
        expect(participant.name).to.equal("DistributorB");
        expect(await participantRegistry.isParticipant(addr1.address)).to.equal(true);
    });

    it("Should register a pharmacy", async function () {
        await participantRegistry.connect(addr2).registerParticipant(2, "PharmacyC"); // 2 for Pharmacy
        const participant = await participantRegistry.participants(addr2.address);
        expect(participant.participantType).to.equal(2);
        expect(participant.name).to.equal("PharmacyC");
        expect(await participantRegistry.isParticipant(addr2.address)).to.equal(true);
    });

    it("Should not register the same address twice", async function () {
        // Using the expectRevert helper from @openzeppelin/test-helpers
        // Try to register manufacturer again (which was already registered)
        await expectRevert(
            participantRegistry.connect(manufacturer).registerParticipant(1, "DistributorB"),
            "Address already registered."
        );
    });

    it("Should return the correct participant type", async function () {
        const participantType = await participantRegistry.getParticipantType(manufacturer.address);
        expect(participantType).to.equal(0);
    });

    it("Should return the correct participant name", async function () {
        const participantName = await participantRegistry.getParticipantName(addr1.address);
        expect(participantName).to.equal("DistributorB");
    });
});