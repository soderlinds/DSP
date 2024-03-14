import React, { useEffect, useState } from 'react';
import { usePoints } from '../context/PointsContext'; 
import { useSmartContract } from '../context/SmartContractContext';
import { useWeb2Auth } from '../context/Web2AuthContext'; 
import '../styles/_rewards.sass';

const Rewards = () => {
  const { account, discountNFTContract, purchaseDiscountNFTWithPoints } = useSmartContract();
  const { points, deductPoints } = usePoints();
  const [nfts, setNFTs] = useState([]);
  const { userId } = useWeb2Auth(); 
  const [pointsBalance, setPointsBalance] = useState(0); 

  const identifier = account || userId;

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
    console.log(pointsBalance);
    console.log(identifier);

    setNFTs(nftData);
  } catch (error) {
    console.error('Error fetching NFT data:', error);
  }
};


const handleExchangeNFT = async (tokenId, offchainPoints) => {
  try {
    await deductPoints(identifier, offchainPoints);
    await purchaseDiscountNFTWithPoints(tokenId, 1, offchainPoints);
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
