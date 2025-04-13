// src/RegisterParticipant.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    useToast
} from '@chakra-ui/react';

const RegisterParticipant = ({ participantRegistryAddress }) => {
    const [participantType, setParticipantType] = useState('Manufacturer');
    const [name, setName] = useState('');
    const toast = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' }); // Request account access
                const signer = provider.getSigner();

                const participantRegistry = new ethers.Contract(
                    participantRegistryAddress,
                    [
                        "function registerParticipant(uint8 _participantType, string memory _name) public",
                    ],
                    signer
                );

                let participantTypeValue;
                switch (participantType) {
                    case 'Manufacturer':
                        participantTypeValue = 0;
                        break;
                    case 'Distributor':
                        participantTypeValue = 1;
                        break;
                    case 'Pharmacy':
                        participantTypeValue = 2;
                        break;
                    default:
                        participantTypeValue = 0;
                }

                const transaction = await participantRegistry.registerParticipant(participantTypeValue, name);
                await transaction.wait();

                toast({
                    title: 'Participant Registered',
                    description: 'Participant registered successfully!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Error registering participant:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to register participant.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } else {
            toast({
                title: 'Error',
                description: 'Please install MetaMask!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={4} borderWidth="1px" borderRadius="md">
            <form onSubmit={handleSubmit}>
                <FormControl id="participantType">
                    <FormLabel>Participant Type</FormLabel>
                    <Select value={participantType} onChange={(e) => setParticipantType(e.target.value)}>
                        <option>Manufacturer</option>
                        <option>Distributor</option>
                        <option>Pharmacy</option>
                    </Select>
                </FormControl>

                <FormControl id="name" mt={4}>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>

                <Button mt={4} colorScheme="blue" type="submit">
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default RegisterParticipant;