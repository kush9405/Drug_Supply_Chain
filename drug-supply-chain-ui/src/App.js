// src/App.js
import React, { useState, useEffect } from 'react';
import { ChakraProvider, Container, Heading, Box, Text } from '@chakra-ui/react';
import RegisterParticipant from './RegisterParticipant';
import AddDrug from './AddDrug';
import TransferDrug from './TransferDrug';
import VerifyDrug from './VerifyDrug';

function App() {
    const [participantRegistryAddress, setParticipantRegistryAddress] = useState('');
    const [drugTrackingAddress, setDrugTrackingAddress] = useState('');
    const [verificationAddress, setVerificationAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Replace with your actual deployed contract addresses
        setParticipantRegistryAddress("0x2Df27729beA73294526d5b05aD358cf8eB5385B7");
        setDrugTrackingAddress("0x15CA4B98f6b6dD5769601D41E33B66BC5Fb1dA5b");
        setVerificationAddress("0xC3a43340A5abab214fc9ee5B00F2e1fdd98A7D5B");

        checkMetaMaskConnection();
    }, []);

    const checkMetaMaskConnection = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_accounts' });
                setIsConnected(true);
            } catch (error) {
                console.error("Error checking MetaMask connection:", error);
                setIsConnected(false);
            }
        } else {
            setIsConnected(false);
        }
    };

    return (
        <ChakraProvider>
            <Container maxW="container.xl" p={4}>
                <Heading mb={4} textAlign="center">Drug Supply Chain Transparency</Heading>
                {isConnected ? (
                    <Box>
                        <RegisterParticipant participantRegistryAddress={participantRegistryAddress} />
                        <AddDrug drugTrackingAddress={drugTrackingAddress} />
                        <TransferDrug drugTrackingAddress={drugTrackingAddress} />
                        <VerifyDrug verificationAddress={verificationAddress} />
                    </Box>
                ) : (
                    <Text textAlign="center">Please connect to MetaMask to use this application.</Text>
                )}
            </Container>
        </ChakraProvider>
    );
}

export default App;