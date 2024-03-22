import React, { useEffect, useState } from 'react';
import { usePoints } from '../context/PointsContext'; 
import { useSmartContract } from '../context/SmartContractContext';
import { useNFTContext } from '../context/NFTContext'; 
import { usePrivy } from '@privy-io/react-auth'; 
import '../styles/_nfts.sass';

function MyWallet() {
  const { account, tokenBalance, exchangePointsForTokens, fetchBalances, discountNFTContract } = useSmartContract();
  const { points, deductPoints, addPoints } = usePoints(); 
  const { user } = usePrivy(); 
  const [pointsBalance, setPointsBalance] = useState(0);
  const { renderUserNFTs } = useNFTContext(); 
  const [NFTs, setNFTs] = useState([]);
  const [pointsToExchange, setPointsToExchange] = useState(0);

  const identifier = user.id;

  
  useEffect(() => {
    fetchPointsBalance();
    fetchBalances();
    fetchNFTs();
  }, [identifier]);

  const fetchNFTs = async () => {
    try {
      const nftData = [];
    
      const filter = discountNFTContract.filters.NFTPurchased(account);
      const events = await discountNFTContract.queryFilter(filter);
      
      for (const event of events) {
        const tokenURI = `metadata/${event.args.tokenId}.json`;
        const imageURI = `images/${event.args.tokenId}.png`;
  
        const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
        const metadata = await metadataResponse.json();
  
        const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
        const imageData = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageData);
  
        const tokenId = Number(event.args.tokenId);
        const offchainPoints = Number(event.args.offchainPoints);
        const initialSupply = Number(event.args.initialSupply);
  
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

  const fetchPointsBalance = async () => {
    try {
      const userPoints = points.filter(point => point.userId === identifier);
      const totalPointsEarned = userPoints.reduce((total, point) => total + point.amount, 0);
      setPointsBalance(totalPointsEarned);
      console.log('Points balance updated:', totalPointsEarned);
    } catch (error) {
      console.error('Error fetching points balance:', error);
    }
  };

  const handleExchange = async () => {
    try {
      const tokensToReceive = Math.floor(pointsToExchange / 1000); 
      await deductPoints(identifier, pointsToExchange); 
      await exchangePointsForTokens(tokensToReceive * 1000); 
      await fetchPointsBalance();
      await fetchBalances();
      setPointsToExchange(0);
    } catch (error) {
      console.error('Error exchanging points for tokens:', error);
    }
  };

  const exchangeOptions = [];
  for (let i = 1; i <= Math.floor(pointsBalance / 1000); i++) {
    exchangeOptions.push(i * 1000);
  }

  console.log('Identifier:', identifier);

    return (
      <div className="wrapper">
        {identifier && (
          <>
            {user && <p>User ID: {identifier}</p>}
            <p>Token Balance: {tokenBalance}</p>
            <p>Points Balance: {pointsBalance}</p>
            {/* <div>
              <select value={pointsToExchange} onChange={(e) => setPointsToExchange(parseInt(e.target.value))}>
                <option value="0">Select Points to Exchange</option>
                {exchangeOptions.map((option) => (
                  <option key={option} value={option}>{option} Points</option>
                ))}
              </select>
              <div>
                <button onClick={handleExchange}>Exchange Points for Tokens</button>
              </div>
            </div> */}
  
            <div className="nft-container">
              <h3>My membership NFT: 
                <div className="nft">{renderUserNFTs()}</div></h3>
              <h3>My NFTs</h3>
              <div className="nfts">
                {NFTs.map((nft) => (
                  <div key={nft.id} className="nft-card">
                    <img src={nft.image} alt={`NFT ${nft.id}`} />
                    <p>{`NFT ID: ${nft.id}`}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  export default MyWallet;
