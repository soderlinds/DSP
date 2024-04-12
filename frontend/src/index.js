import {sepolia} from 'viem/chains';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="clt2kvuvj024p28uwkazvbxdh"
      config={{
        loginMethods: ['email', 'google', 'farcaster', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#112c62',
          logo: 'https://i.imghippo.com/files/RtZpN1710845783.png',
        },
        defaultChain: sepolia,
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);
