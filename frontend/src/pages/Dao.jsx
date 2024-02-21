import { useSmartContract } from '../SmartContractContext';
import '../styles/_dao.sass'; 

function Dao() {
  const { commonPoolBalance } = useSmartContract();

  return (
    <div>
    <h2>DAO</h2>
    <div className="dao-wrapper">
      <p>Common Pool Balance: {commonPoolBalance}</p>
    </div>
    </div>
  );
}

export default Dao;
