// src/VerifyDrug.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Text,
    useToast
} from '@chakra-ui/react';

const VerifyDrug = ({ verificationAddress }) => {
    const [drugId, setDrugId] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const toast = useToast();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const signer = provider.getSigner();

                const verification = new ethers.Contract(
                    verificationAddress,
                    [
                        "function verifyDrug(uint256 _drugId) public view returns (bool)",
                    ],
                    signer
                );

                const result = await verification.verifyDrug(drugId);
                setVerificationResult(result);

                toast({
                    title: 'Verification Result',
                    description: result ? 'Drug is authentic!' : 'Drug is potentially counterfeit!',
                    status: result ? 'success' : 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.error("Error verifying drug:", error);
                toast({
                    title: 'Error',
                    description: 'Failed to verify drug.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                setVerificationResult(null);
            }
        } else {
            toast({
                title: 'Error',
                description: 'Please install MetaMask!',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setVerificationResult(null);
        }
    };

    return (
        <Box p={4} borderWidth="1px" borderRadius="md">
            <form onSubmit={handleSubmit}>
                <FormControl id="drugId">
                    <FormLabel>Drug ID</FormLabel>
                    <Input type="number" value={drugId} onChange={(e) => setDrugId(e.target.value)} />
                </FormControl>

                <Button mt={4} colorScheme="blue" type="submit">
                    Verify Drug
                </Button>
            </form>

            {verificationResult !== null && (
                <Text mt={4}>
                    Verification Result: {verificationResult ? 'Authentic' : 'Potentially Counterfeit'}
                </Text>
            )}
        </Box>
    );
};

export default VerifyDrug;