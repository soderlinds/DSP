import React, { useState } from 'react';
import { useSmartContract } from '../context/SmartContractContext';
import '../styles/_admin.sass';

const Admin = () => {
  const { mintDiscountNFT, } = useSmartContract();
  const [pointsInput, setPointsInput] = useState('');
  const [initialSupplyInput, setInitialSupplyInput] = useState('');


  const handleMintNFT = async () => {
    try {
        const initialSupply = Number(initialSupplyInput); 
        const offchainPoints = Number(pointsInput);

        if (!isNaN(initialSupply) && !isNaN(offchainPoints)) {
            await mintDiscountNFT(initialSupply, offchainPoints); 
            console.log(`Successfully minted NFT with points required ${offchainPoints}, and initial supply ${initialSupply}`);

            setInitialSupplyInput('');
            setPointsInput('');
        } else {
            console.error('Invalid initial supply or off-chain points');
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
    }
};


  return (
      <div className="wrapper">
        <div>
       <h3>Mint discount NFT</h3>
         <div>
           Enter amount of points needed:
           <input
             type="text"
             value={pointsInput}
             onChange={(e) => setPointsInput(e.target.value)}
           />
         </div>
         <div>
           Enter Initial Supply:
           <input
             type="text"
             value={initialSupplyInput}
             onChange={(e) => setInitialSupplyInput(e.target.value)}
           />
         </div>
         <button onClick={handleMintNFT}>Mint NFT</button>
       </div>
    </div>
  );
};

export default Admin;
