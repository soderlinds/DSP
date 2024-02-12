import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_mywallet.sass';

function MyWallet() {
  const { active, account, tokenBalance, ownedNFTs, nftContract, earnTokens, pointsBalance, exchangePointsForTokens } = useSmartContract();
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

          const nftPrice = Number(await nftContract.methods.getNFTPrice(tokenId).call());

          nftData.push({
            id: tokenId,
            image: imageUrl,
            metadata: metadata,
            nftPrice: nftPrice,
          });
        }
        setOwnedNFTData(nftData);
      } catch (error) {
        console.error('Error fetching owned NFT data:', error);
      }
    };

    fetchOwnedNFTData();
  }, [ownedNFTs, nftContract]);

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
      <p>Status: {active ? 'Connected' : 'Not Connected'}</p>

      <p>Account: {account}</p>
      <p>Token Balance: {tokenBalance}</p>
      <p>Points Balance: {pointsBalance}</p> 
      <h3>Owned NFTs</h3>
      <div className="owned-nfts">
        {ownedNFTData.map((nft) => (
          <div key={nft.id} className="nft-card">
            <img src={nft.image} alt={`NFT ${nft.id}`} />
            <p className="nft-text">{`Discount on tickets: ${nft.metadata.attributes[0].value}`}</p>
          </div>
        ))}
      </div>
      <div>
        <input type="number" value={pointsToExchange} onChange={(e) => setPointsToExchange(e.target.value)} />
        <button onClick={handleExchange}>Exchange Points for Tokens</button>
      </div>
    </div>
  );
}

export default MyWallet;
