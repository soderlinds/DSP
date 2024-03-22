import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import '../styles/_loginlogoutbutton.sass';

const LoginLogoutButton = ({ size }) => {
    const { ready, authenticated, user, login, logout } = usePrivy();
    const disableLogin = !ready || (ready && authenticated);

    console.log(user);
    return (
        <div className="connectbutton-wrapper">
            {!authenticated ? (
                <button
                    className={`connect-button ${size === 'small' ? 'small-connect-button' : ''}`}
                    disabled={disableLogin}
                    onClick={login}
                >
                    Connect
                </button>
            ) : (
                <button
                    className={`connect-button ${size === 'small' ? 'small-connect-button' : ''}`}
                    onClick={logout}
                >
                    Disconnect
                </button>
            )}
        </div>
    );
};

export default LoginLogoutButton;