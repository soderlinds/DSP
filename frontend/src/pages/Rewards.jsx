import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_rewards.sass';

const Rewards = ({ userId }) => {
  const { account, discountNFTContract, purchaseDiscountNFTWithPoints } = useSmartContract();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [nfts, setNFTs] = useState([]);
  const [pointsToExchange, setPointsToExchange] = useState(0);

  const identifier = account || userId;

  useEffect(() => {
    fetchPointsBalance();
    fetchNFTs();
  }, []);

  //Should be moved - PointsBalance component
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
        const tokenId = event.returnValues.tokenId;
        const tokenURI = `metadata/${tokenId}.json`;
        const imageURI = `images/${tokenId}.png`;
  
        const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
        const metadata = await metadataResponse.json();
  
        const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
        const imageData = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageData);
  
        const nftPrice = event.returnValues.price;
  
        nftData.push({
          id: tokenId,
          image: imageUrl,
          metadata: metadata,
          nftPrice: nftPrice,
        });
      }
  
      console.log('Fetched NFTs:', nftData);
  
      setNFTs(nftData);
    } catch (error) {
      console.error('Error fetching NFT data:', error);
    }
  };
  

  const handleExchangeNFT = async (nftId, pointsRequired, nftPrice) => {
    try {
      if (pointsBalance < pointsRequired) {
        console.error('Insufficient off-chain points');
        return;
      }
      const nftPriceNumber = Number(nftPrice);
      const nftIdNumber = Number(nftId);
      const pointsRequiredNumber = Number(pointsRequired);
      await purchaseDiscountNFTWithPoints(nftIdNumber, 1, pointsRequiredNumber, nftPriceNumber);
      const response = await axios.put(`http://localhost:5000/api/points/${identifier}/deduct`, { amount: pointsRequiredNumber });
      if (response.status === 200) {
        setPointsBalance(pointsBalance - pointsRequiredNumber);
        console.log('Points deducted successfully:', pointsRequiredNumber);
      } else {
        console.error('Failed to deduct points:', pointsRequiredNumber);
        return;
      }
  
      await fetchPointsBalance();
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
              <p className="nft-text">{`Points required: ${nft.nftPrice}`}</p>
              <button onClick={() => handleExchangeNFT(nft.id, nft.nftPrice)}>Claim NFT</button>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
