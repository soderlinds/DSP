import { useState, useEffect } from 'react';
import { useSmartContract } from '../context/SmartContractContext';

const useUserNFTs = () => {
    const { getUserNFT, mintMembershipToken } = useSmartContract();
    const [userNFTs, setUserNFTs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUserNFTs();
    }, []);

    const fetchUserNFTs = async () => {
        try {
            const nfts = await getUserNFT();
            setUserNFTs(nfts);
            setError('');
        } catch (error) {
            console.error('Error fetching user NFTs:', error);
            setError('Error fetching user NFTs');
        }
    };

    const handleMintNFT = async () => {
        try {
            await mintMembershipToken('/metadata/membership_token_100.json');
            console.log("Membership NFT minted successfully!");
            await fetchUserNFTs();
        } catch (error) {
            console.error("Error minting membership NFT:", error);
            setError('Error minting membership NFT');
        }
    };

    const renderUserNFTs = () => {
        if (userNFTs.length === 0) {
            return null; 
        }

        //Hardcoded image for testing
        return userNFTs.map((nft, index) => (
            <div key={index}>
                <img src={`/images/100.png`} alt={`NFT ID ${nft.tokenId}`} />
            </div>
        ));
    };

    return { userNFTs, error, handleMintNFT, renderUserNFTs };
};

export default useUserNFTs;
