import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_mywallet.sass';

function MyWallet() {
  const { active, account, tokenBalance, ownedNFTs, pointsBalance } = useSmartContract();
  const [ownedNFTData, setOwnedNFTData] = useState([]);

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

  return (
    <div className="container">
      <h2>My Wallet</h2>
      <p>Token Balance: {tokenBalance}</p>
      <p>Points Balance: {pointsBalance}</p>
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
