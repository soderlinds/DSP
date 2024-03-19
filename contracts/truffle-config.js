module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, 
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.1",
    },
  },
  mocha: {
    // timeout: 100000
  },
};



// require('dotenv').config();

// const HDWalletProvider = require('@truffle/hdwallet-provider');

// const mnemonic = process.env.MNEMONIC;

// module.exports = {
//   networks: {
//     goerli: {
//       provider: () => new HDWalletProvider({
//         mnemonic: mnemonic,
//         providerOrUrl: `https://goerli.infura.io/v3/7c2ba60ad62447a6a8dac2b8cd73bb4a`
//       }),
//       network_id: 5,
//       gas: 5500000, 
//       confirmations: 2, 
//       timeoutBlocks: 200, 
//       skipDryRun: true, 
//     },
//   },
//   compilers: {
//     solc: {
//       version: "^0.8.0", 
//     }
//   }
// };

