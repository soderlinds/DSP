import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {PrivyProvider} from '@privy-io/react-auth';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PrivyProvider
    //Make a .env
      appId="clt2kvuvj024p28uwkazvbxdh"
      config={{
        loginMethods: ['email', 'google', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://i.imghippo.com/files/RtZpN1710845783.png',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>,
);