import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_rewards.sass';

const Rewards = ({ userId }) => {
  const { account, discountNFTContract, purchaseDiscountNFTWithPoints } = useSmartContract();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [nfts, setNFTs] = useState([]);

  const identifier = account || userId;

  useEffect(() => {
    fetchPointsBalance();
    fetchNFTs();
  }, []);

  const fetchPointsBalance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/points/${identifier}`);
      const transactions = response.data;
      const totalPointsEarned = transactions.reduce((total, transaction) => total + transaction.amount, 0);
      setPointsBalance(totalPointsEarned);
      console.log('Points balance updated:', totalPointsEarned);
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };

  const fetchNFTs = async () => {
  try {
    const nftData = [];
    const mintedTokens = await discountNFTContract.getPastEvents('NFTMinted', {
      fromBlock: 0,
      toBlock: 'latest'
    });

    for (const event of mintedTokens) {
      const tokenURI = `metadata/${event.returnValues.tokenId}.json`;
      const imageURI = `images/${event.returnValues.tokenId}.png`;

      
      const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
      const metadata = await metadataResponse.json();

      const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
      const imageData = await imageResponse.blob();
      const imageUrl = URL.createObjectURL(imageData);

      const tokenId = Number(event.returnValues.tokenId);
      const offchainPoints = Number(event.returnValues.offchainPoints);
      const initialSupply = Number(event.returnValues.initialSupply);
    


      nftData.push({
        id: tokenId,
        image: imageUrl,
        metadata: metadata,
        amount: initialSupply,
        offchainPoints: offchainPoints,
      });
    }

    console.log('Fetched NFTs:', nftData);

    setNFTs(nftData);
  } catch (error) {
    console.error('Error fetching NFT data:', error);
  }
};

const handleExchangeNFT = async (tokenId, offchainPoints) => {
  try {
    if (pointsBalance < offchainPoints) {
      window.alert('Insufficient off-chain points');
      return;
    }
    const offchainPointsNumber = Number(offchainPoints);
    await purchaseDiscountNFTWithPoints(tokenId, 1, offchainPointsNumber);
    const response = await axios.put(`http://localhost:5000/api/points/${identifier}/deduct`, { amount: offchainPointsNumber });
    if (response.status === 200) {
      console.log('Points deducted successfully:', offchainPointsNumber);
      await fetchPointsBalance(); 
      await fetchNFTs(); 
    } else {
      console.error('Failed to deduct points:', offchainPointsNumber);
      return;
    }
  } catch (error) {
    console.error('Error exchanging points for NFT:', error);
  }
};



  return (
    <div className="rewards-wrapper">
      <div>
        <h2>NFTs</h2>
        <div className="purchase-nfts">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-card">
              <img src={nft.image} alt={`NFT ${nft.id}`} />
              <p className="discount-text">{`Discount on tickets: ${nft.metadata.attributes[0].value}`}</p>
              <p className="nft-text">{`Points required: ${nft.offchainPoints}`}</p>
              
              <button onClick={() => handleExchangeNFT(nft.id, nft.offchainPoints)}>Claim NFT</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
