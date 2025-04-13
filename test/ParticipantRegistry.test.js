import { expect } from "chai";
import hardhat from "hardhat";
const { expectRevert } = require('@openzeppelin/test-helpers'); // Import expectRevert
const { ethers } = hardhat;

describe("ParticipantRegistry", function () {
    let ParticipantRegistry;
    let participantRegistry;
    let owner;
    let addr1;
    let addr2;
    let manufacturer;

    beforeEach(async function () {
        // Deploy the contract before each test
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
        await participantRegistry.registerParticipant(1, "DistributorB"); // 1 for Distributor
        const participant = await participantRegistry.participants(owner.address);
        expect(participant.participantType).to.equal(1);
        expect(participant.name).to.equal("DistributorB");
        expect(await participantRegistry.isParticipant(owner.address)).to.equal(true);
    });

    it("Should register a pharmacy", async function () {
        await participantRegistry.registerParticipant(2, "PharmacyC"); // 2 for Pharmacy
        const participant = await participantRegistry.participants(owner.address);
        expect(participant.participantType).to.equal(2);
        expect(participant.name).to.equal("PharmacyC");
         expect(await participantRegistry.isParticipant(owner.address)).to.equal(true);
    });


    it("Should not register the same address twice", async function () {
        await participantRegistry.registerParticipant(0, "ManufacturerA");
        await expectRevert( // Use expectRevert
            participantRegistry.registerParticipant(1, "DistributorB"),
            "Address already registered."
        );
    });
    });

    it("Should return the correct participant type", async function () {
        await participantRegistry.registerParticipant(0, "ManufacturerA");
        const participantType = await participantRegistry.getParticipantType(owner.address);
        expect(participantType).to.equal(0);
    });

    it("Should return the correct participant name", async function () {
        await participantRegistry.registerParticipant(1, "DistributorB");
        const participantName = await participantRegistry.getParticipantName(owner.address);
        expect(participantName).to.equal("DistributorB");
    });
