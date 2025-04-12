// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
// ParticipantRegistry.sol
// This contract manages the registration of participants in the drug supply chain.
contract ParticipantRegistry {

    enum ParticipantType { Manufacturer, Distributor, Pharmacy }

    struct Participant {
        address walletAddress;
        ParticipantType participantType;
        string name;
        bool exists;
    }

    mapping(address => Participant) public participants;
    address[] public participantAddresses;


    event ParticipantRegistered(address indexed walletAddress, ParticipantType participantType, string name);

    modifier onlyParticipant() {
        require(isParticipant(msg.sender), "Only participants can perform this action.");
        _;
    }

    function registerParticipant(ParticipantType _participantType, string memory _name) public {
        require(!isParticipant(msg.sender), "Address already registered.");
        participants[msg.sender] = Participant(msg.sender, _participantType, _name, true);
        participantAddresses.push(msg.sender);
        emit ParticipantRegistered(msg.sender, _participantType, _name);
    }

    function isParticipant(address _address) public view returns (bool) {
        return participants[_address].exists;
    }

    function getParticipantType(address _address) public view returns (ParticipantType) {
        require(isParticipant(_address), "Address is not a registered participant.");
        return participants[_address].participantType;
    }

    function getParticipantName(address _address) public view returns (string memory) {
        require(isParticipant(_address), "Address is not a registered participant.");
        return participants[_address].name;
    }
}