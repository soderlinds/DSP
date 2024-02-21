import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_mywallet.sass';

function MyWallet() {
  const { active, account, tokenBalance, ownedNFTs, pointsBalance, exchangePointsForTokens } = useSmartContract();
  const [ownedNFTData, setOwnedNFTData] = useState([]);
  const [pointsToExchange, setPointsToExchange] = useState(0);

  useEffect(() => {
    const fetchOwnedNFTData = async () => {
      try {
        const nftData = [];
        for (const tokenId of ownedNFTs) {
          const tokenURI = `metadata/${tokenId}.json`;
          const imageURI = `images/${tokenId}.png`;

          const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
          const metadata = await metadataResponse.json();

          const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
          const imageData = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageData);

     
          nftData.push({
            id: tokenId,
            metadata: metadata,
            image: imageUrl
          });
        }

        setOwnedNFTData(nftData);
      } catch (error) {
        console.error('Error fetching owned NFT data:', error);
      }
    };

    fetchOwnedNFTData();
  }, [ownedNFTs]); 

  const handleExchange = async () => {
    try {
      await exchangePointsForTokens(pointsToExchange);
    } catch (error) {
      console.error('Error exchanging points for tokens:', error);
    }
  };

  return (
    <div className="container">
      <h2>My Wallet</h2>
      <p>Token Balance: {tokenBalance}</p>
      <p>Points Balance: {pointsBalance}</p>
      <div>
        <input type="number" value={pointsToExchange} onChange={(e) => setPointsToExchange(e.target.value)} />
        <button onClick={handleExchange}>Exchange Points for Tokens</button>
        <p className="token-info">Note: When exchanging points for tokens, 2% of the tokens are contributed to the common pool for community benefits.</p>
      </div>
      <h3>Owned NFTs</h3>
      <div className="owned-nfts">
        {ownedNFTData.map((nft) => (
          <div key={nft.id} className="nft-card">
            <img src={nft.image} alt={`NFT ${nft.id}`} />
            <p>{nft.metadata.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyWallet;
