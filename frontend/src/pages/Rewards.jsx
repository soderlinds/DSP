import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_rewards.sass';

const Rewards = () => {
  const { nftContract, purchaseNFT, mintNFT, tokenBalance, approveTokenSpending, web3 } = useSmartContract();
  const [nfts, setNFTs] = useState([]);
  const [tokenIdInput, setTokenIdInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  useEffect(() => {
    const fetchNFTs = async () => {
      const nftData = await fetchNFTData();
      setNFTs(nftData);
    };

    fetchNFTs();
  }, []);

  const fetchNFTData = async () => {
    try {
      const nftData = [];
      const mintedTokens = await nftContract.methods.getAllMintedNFTs().call();

      for (const tokenIdBN of mintedTokens) {
        const tokenId = Number(tokenIdBN);

        const tokenURI = `metadata/${tokenId}.json`;
        const imageURI = `images/${tokenId}.png`;

        const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
        const metadata = await metadataResponse.json();

        const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
        const imageData = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageData);

        const ticketPrice = Number(await nftContract.methods.getTicketPrice(tokenId).call());

        nftData.push({
          id: tokenId,
          image: imageUrl,
          metadata: metadata,
          ticketPrice: ticketPrice,
        });
      }

      console.log('Fetched NFTs:', nftData);

      return nftData;
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      return [];
    }
  };

  const handlePurchaseNFT = async (tokenId) => {
    try {
      const ticketPrice = await nftContract.methods.getTicketPrice(tokenId).call();
      
      const approvalAmount = ticketPrice; 
      await approveTokenSpending(approvalAmount);

      await purchaseNFT(tokenId);
  
      const updatedNFTData = await fetchNFTData();
      setNFTs(updatedNFTData);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
    }
  };
  
  const handleMintNFT = async () => {
    try {
      const tokenId = Number(tokenIdInput);
      const price = Number(priceInput);

      if (!isNaN(tokenId) && !isNaN(price)) {
        await mintNFT(tokenId, price);
        console.log(`Successfully minted NFT with ID ${tokenId} and price ${price}`);

        console.log('Fetching updated NFT data...');
        const updatedNFTData = await fetchNFTData();
        console.log('Updated NFT Data:', updatedNFTData);

        setNFTs(updatedNFTData);
        setTokenIdInput('');
        setPriceInput('');
      } else {
        console.error('Invalid token ID or price');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return (
    <div className="rewards-wrapper">
      <h2>NFT Rewards Page</h2>
      <p>Your Token Balance: {tokenBalance}</p>
      <div>
        <h3>Mint NFT</h3>
        <label>
          Enter Token ID:
          <input
            type="text"
            value={tokenIdInput}
            onChange={(e) => setTokenIdInput(e.target.value)}
          />
        </label>
        <label>
          Enter Ticket Price:
          <input
            type="text"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
        </label>
        <button onClick={handleMintNFT}>Mint NFT</button>
      </div>
      <div>
        <h3>Purchase NFT</h3>
        <div className="purchase-nfts">
          {nfts.map((nft) => (
            <div key={nft.id} className="nft-card">
              <img src={nft.image} alt={`NFT ${nft.id}`} />
              <p>{`Discount on tickets: ${nft.metadata.attributes[0].value}`}</p>
              <p>{`Ticket Price: ${nft.ticketPrice}`}</p>
              <button onClick={() => handlePurchaseNFT(nft.id)}>Claim NFT</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
