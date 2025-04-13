// src/TransferDrug.js
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

const TransferDrug = ({ drugTrackingAddress }) => {
    const [drugId, setDrugId] = useState('');
    const [newHolder, setNewHolder] = useState('');
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
                        "function transferDrug(uint256 _drugId, address _newHolder) public",
                    ],
                    signer
                );

                const transaction = await drugTracking.transferDrug(drugId, newHolder);
                await transaction.wait();

                toast({
                    title: 'Drug Transferred',
                    description: 'Drug transferred successfully!',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Error transferring drug:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to transfer drug.',
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
                <FormControl id="drugId">
                    <FormLabel>Drug ID</FormLabel>
                    <Input type="number" value={drugId} onChange={(e) => setDrugId(e.target.value)} />
                </FormControl>

                <FormControl id="newHolder" mt={4}>
                    <FormLabel>New Holder Address</FormLabel>
                    <Input type="text" value={newHolder} onChange={(e) => setNewHolder(e.target.value)} />
                </FormControl>

                <Button mt={4} colorScheme="blue" type="submit">
                    Transfer Drug
                </Button>
            </form>
        </Box>
    );
};

export default TransferDrug;