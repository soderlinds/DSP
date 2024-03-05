import React, { useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_admin.sass';

const Admin = () => {
  const { createNFT, fractionalizeNFT, setAttendee, airdropNFTShares, mintDiscountNFT, nftContract } = useSmartContract();
  const [artistAddress, setArtistAddress] = useState('');
  const [totalShares, setTotalShares] = useState(0);
  const [attendeeAddress, setAttendeeAddress] = useState('');
  const [nfts, setNFTs] = useState([]);
  const [tokenIdInput, setTokenIdInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [initialSupplyInput, setInitialSupplyInput] = useState('');


  const handleCreateNFT = async () => {
    await createNFT(artistAddress);
  };

  const handleFractionalizeNFT = async () => {
    await fractionalizeNFT(totalShares);
  };

  const handleSetAttendee = async () => {
    await setAttendee(attendeeAddress);
  };
  
  const handleAirdropNFTShares = async () => {
    await airdropNFTShares([attendeeAddress]);
  };

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
    
            const nftPrice = Number(await nftContract.methods.getNFTPrice(tokenId).call());
    
            nftData.push({
              id: tokenId,
              image: imageUrl,
              metadata: metadata,
              nftPrice: nftPrice,
            });
          }
    
          console.log('Fetched NFTs:', nftData);
    
          return nftData;
        } catch (error) {
          console.error('Error fetching NFT data:', error);
          return [];
        }
      };
    

      const handleMintNFT = async () => {
        try {
            const tokenId = Number(tokenIdInput);
            const supply = Number(initialSupplyInput); 
            const price = Number(priceInput);
    
            if (!isNaN(tokenId) && !isNaN(price) && !isNaN(supply)) {
                await mintDiscountNFT(tokenId, supply, price); 
                console.log(`Successfully minted NFT with ID ${tokenId}, price ${price}, and initial supply ${supply}`);
    
                console.log('Fetching updated NFT data...');
                const updatedNFTData = await fetchNFTData();
                console.log('Updated NFT Data:', updatedNFTData);
    
                setNFTs(updatedNFTData);
                setTokenIdInput('');
                setInitialSupplyInput('');
                setPriceInput('');
            } else {
                console.error('Invalid token ID, price, or supply');
            }
        } catch (error) {
            console.error('Error minting NFT:', error);
        }
    };

  return (
    <div className="admin-wrapper">
      <h2>Admin Page</h2>
      <div>
       <h3>Mint discount NFT</h3>
      <label>
          Enter Token ID:
           <input
             type="text"
             value={tokenIdInput}
             onChange={(e) => setTokenIdInput(e.target.value)}
           />
         </label>
         <label>
           Enter amount of points needed:
           <input
             type="text"
             value={priceInput}
             onChange={(e) => setPriceInput(e.target.value)}
           />
         </label>
         <label>
           Enter Initial Supply:
           <input
             type="text"
             value={initialSupplyInput}
             onChange={(e) => setInitialSupplyInput(e.target.value)}
           />
         </label>
         <button onClick={handleMintNFT}>Mint NFT</button>
       </div>
      <div>
     <h3>Mint performance NFT</h3>
        <input type="text" value={artistAddress} onChange={(e) => setArtistAddress(e.target.value)} placeholder="Artist Address" />
         <button onClick={handleCreateNFT}>Create NFT</button>
    </div>

      <div>
        <h3>Fractionalize NFT</h3>
        <input type="number" value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="Total Shares" />
        <button onClick={handleFractionalizeNFT}>Fractionalize NFT</button>
      </div>

      <div>
        <h3>Set Attendee</h3>
        <input type="text" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} placeholder="Attendee Address" />
        <button onClick={handleSetAttendee}>Set Attendee</button>
      </div>

      <div>
        <h3>Airdrop NFT Shares</h3>
        <input type="text" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} placeholder="Attendee Address" />
        <button onClick={handleAirdropNFTShares}>Airdrop NFT Shares</button>
      </div>
    </div>
  );
};

export default Admin;


// import React, { useState } from 'react';
// import { useSmartContract } from '../SmartContractContext';

// const AdminPage = () => {
//   const { createNFT, fractionalizeNFT, setAttendee, airdropNFTShares, } = useSmartContract();
//   const [artistAddress, setArtistAddress] = useState('');
//   const [totalShares, setTotalShares] = useState(0);
//   const [attendeeAddress, setAttendeeAddress] = useState('');


//   const handleCreateNFT = async () => {
//     await createNFT(artistAddress);
//   };

//   const handleFractionalizeNFT = async () => {
//     await fractionalizeNFT(totalShares);
//   };

//   const handleSetAttendee = async () => {
//     await setAttendee(attendeeAddress);
//   };
  
//   const handleAirdropNFTShares = async () => {
//     await airdropNFTShares([attendeeAddress]);
//   };

//   return (
//     <div>
//       <h2>Admin Page</h2>

//       <div>
//      <h3>Create NFT</h3>
//         <input type="text" value={artistAddress} onChange={(e) => setArtistAddress(e.target.value)} placeholder="Artist Address" />
//          <button onClick={handleCreateNFT}>Create NFT</button>
//     </div>

//       <div>
//         <h3>Fractionalize NFT</h3>
//         <input type="number" value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="Total Shares" />
//         <button onClick={handleFractionalizeNFT}>Fractionalize NFT</button>
//       </div>

//       <div>
//         <h3>Set Attendee</h3>
//         <input type="text" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} placeholder="Attendee Address" />
//         <button onClick={handleSetAttendee}>Set Attendee</button>
//       </div>

//       <div>
//         <h3>Airdrop NFT Shares</h3>
//         <input type="text" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} placeholder="Attendee Address" />
//         <button onClick={handleAirdropNFTShares}>Airdrop NFT Shares</button>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;
