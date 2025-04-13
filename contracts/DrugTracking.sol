// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./ParticipantRegistry.sol"; // Ensure the correct path to the file

contract DrugTracking {

    struct Drug {
        uint256 drugId;
        string name;
        string lotNumber;
        address manufacturer;
        address currentHolder;
        uint256 timestamp;
        bool isCounterfeit;
    }

    mapping(uint256 => Drug) public drugs;
    uint256 public drugCount;
    ParticipantRegistry public participantRegistry; // Reference to the ParticipantRegistry contract

    event DrugAdded(uint256 drugId, string name, string lotNumber, address manufacturer);
    event DrugTransferred(uint256 drugId, address from, address to);
    event DrugMarkedCounterfeit(uint256 drugId);
    event DebugCurrentHolder(uint256 drugId, address currentHolder);

    constructor(address _participantRegistryAddress) {
        participantRegistry = ParticipantRegistry(_participantRegistryAddress);
    }


    modifier onlyManufacturer() {
        require(participantRegistry.getParticipantType(msg.sender) == ParticipantRegistry.ParticipantType.Manufacturer, "Only manufacturers can perform this action.");
        _;
    }

    modifier onlyDistributorOrPharmacy() {
        ParticipantRegistry.ParticipantType participantType = participantRegistry.getParticipantType(msg.sender);
        require(participantType == ParticipantRegistry.ParticipantType.Distributor || participantType == ParticipantRegistry.ParticipantType.Pharmacy, "Only distributors or pharmacies can perform this action.");
        _;
    }


    function addDrug(string memory _name, string memory _lotNumber) public onlyManufacturer {
        drugCount++;
        drugs[drugCount] = Drug(drugCount, _name, _lotNumber, msg.sender, msg.sender, block.timestamp, false);
        emit DrugAdded(drugCount, _name, _lotNumber, msg.sender);
    }


    function transferDrug(uint256 _drugId, address _newHolder) public onlyDistributorOrPharmacy {
        emit DebugCurrentHolder(_drugId, drugs[_drugId].currentHolder); // Log before transfer
        require(drugs[_drugId].currentHolder == msg.sender, "You are not the current holder of this drug.");
        require(participantRegistry.isParticipant(_newHolder), "The new holder must be a registered participant.");

        drugs[_drugId].currentHolder = _newHolder;
        drugs[_drugId].timestamp = block.timestamp;

        emit DebugCurrentHolder(_drugId, drugs[_drugId].currentHolder); // Log after transfer
        emit DrugTransferred(_drugId, msg.sender, _newHolder);
    }


    function markAsCounterfeit(uint256 _drugId) public { // In a real system, this would be more controlled.
        drugs[_drugId].isCounterfeit = true;
        emit DrugMarkedCounterfeit(_drugId);
    }

    function getDrugInfo(uint256 _drugId) public view returns (
        uint256 drugId,
        string memory name,
        string memory lotNumber,
        address manufacturer,
        address currentHolder,
        uint256 timestamp,
        bool isCounterfeit
    ) {
        Drug storage drug = drugs[_drugId];  // Use storage keyword
        return (
            drug.drugId,
            drug.name,
            drug.lotNumber,
            drug.manufacturer,
            drug.currentHolder,
            drug.timestamp,
            drug.isCounterfeit
        );
    }
}
