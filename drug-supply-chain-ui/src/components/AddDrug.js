// src/AddDrug.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    useToast
} from '@chakra-ui/react';

const AddDrug = ({ drugTrackingAddress }) => {
    const [name, setName] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const toast = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const signer = provider.getSigner();

                const drugTracking = new ethers.Contract(
                    drugTrackingAddress,
                    [
                        "function addDrug(string memory _name, string memory _lotNumber) public",
                    ],
                    signer
                );

                const transaction = await drugTracking.addDrug(name, lotNumber);
                await transaction.wait();

                toast({
                    title: 'Drug Added',
                    description: 'Drug added successfully!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Error adding drug:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to add drug.',
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
                <FormControl id="name">
                    <FormLabel>Drug Name</FormLabel>
                    <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>

                <FormControl id="lotNumber" mt={4}>
                    <FormLabel>Lot Number</FormLabel>
                    <Input type="text" value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} />
                </FormControl>

                <Button mt={4} colorScheme="blue" type="submit">
                    Add Drug
                </Button>
            </form>
        </Box>
    );
};

export default AddDrug;