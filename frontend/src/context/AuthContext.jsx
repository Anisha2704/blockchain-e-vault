import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [web3Wallet, setWeb3Wallet] = useState(localStorage.getItem('walletAddress') || '');

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to load user session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      if (res.data.walletAddress) {
        setWeb3Wallet(res.data.walletAddress);
        localStorage.setItem('walletAddress', res.data.walletAddress);
      }
      return res;
    }
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      if (res.data.walletAddress) {
        setWeb3Wallet(res.data.walletAddress);
        localStorage.setItem('walletAddress', res.data.walletAddress);
      }
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('walletAddress');
    setToken(null);
    setUser(null);
    setWeb3Wallet('');
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          const address = accounts[0];
          setWeb3Wallet(address);
          localStorage.setItem('walletAddress', address);
          return address;
        }
      } catch (err) {
        console.error('User rejected wallet connection:', err);
        throw new Error('Wallet connection cancelled or rejected.');
      }
    } else {
      throw new Error('MetaMask or Web3 extension not found in browser.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        web3Wallet,
        login,
        register,
        logout,
        connectWallet,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
