/**
 * **************************************************
 *
 * @description
 * This component renders the navagation bar
 *
 * **************************************************
 */

import React, { useState, useEffect } from 'react';
import Logo from '../../assets/Logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import { FiLogIn } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';

function Nav(): JSX.Element {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { user, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  function handleLogin() {
    loginWithRedirect();
  }

  function handleLogOut() {
    logout({ logoutParams: { returnTo: window.location.origin } });
  }

  return (
    <div className='flex w-full py-5 px-5'>
      {/* Left Nav */}
      <div className=''>
        <img className='h-auto w-auto max-h-10' src={Logo}></img>
      </div>
      {/* Center Nav */}
      <div className='w-full'></div>
      {/* Right Nav */}
      <div className=''>
        <button onClick={isLoggedIn ? handleLogOut : handleLogin}>
          {isLoggedIn ? <FiLogOut size={30} /> : <FiLogIn size={30} />}
        </button>
      </div>
    </div>
  );
}

export default Nav;
