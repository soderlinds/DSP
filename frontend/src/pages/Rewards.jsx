import React, { useEffect, useState } from 'react';
import { usePoints } from '../context/PointsContext';
import { usePrivy } from '@privy-io/react-auth'; 
import { useSmartContract } from '../context/SmartContractContext';
import '../styles/_nfts.sass';

const Rewards = () => {
  
  const { discountNFTContract, purchaseDiscountNFTWithPoints } = useSmartContract();
  const { points, deductPoints } = usePoints();
  const { user } = usePrivy(); 
  const [nfts, setNFTs] = useState([]);
  const [pointsBalance, setPointsBalance] = useState(0);

  const identifier = user ? user.id : null;

  useEffect(() => {
    fetchNFTs();
  }, []);

  useEffect(() => {
    const totalPointsEarned = points
      .filter(point => point.userId === identifier)
      .reduce((total, point) => total + point.amount, 0);
    setPointsBalance(totalPointsEarned);
  }, [points, identifier]); 


  const fetchNFTs = async () => {
    try {
      const nftData = [];
      const events = await discountNFTContract.queryFilter('NFTMinted');

      for (const event of events) {
        const tokenId = Number(event.args.tokenId);
        const offchainPoints = Number(event.args.offchainPoints);
        const initialSupply = Number(event.args.initialSupply);

        const tokenURI = `metadata/${tokenId}.json`;
        const imageURI = `images/${tokenId}.png`;

        const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
        const metadata = await metadataResponse.json();

        const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
        const imageData = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageData);

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
    try{
      await deductPoints(identifier, offchainPoints);
      await purchaseDiscountNFTWithPoints(tokenId, offchainPoints);
      await fetchNFTs();
    } catch (error) {
      console.error('Error exchanging points for NFT:', error);
    }
  };


  return (
    <div className="wrapper">
      <div>
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

