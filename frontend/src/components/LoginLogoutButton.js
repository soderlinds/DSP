import React from 'react';
import { usePrivy } from '@privy-io/react-auth';

const LoginLogoutButton = () => {
    const { ready, authenticated, user, login, logout } = usePrivy();
    const disableLogin = !ready || (ready && authenticated);
    
    console.log(user);
    return (
        <>
            {!authenticated ? (
                <button disabled={disableLogin} onClick={login}>
                    Connect
                </button>
            ) : (
                <button onClick={logout}>Logout</button>
            )}
            {user && user.id && (
                <p>User ID: {user.id}</p>
            )}
        </>
    );
};

export default LoginLogoutButton;
