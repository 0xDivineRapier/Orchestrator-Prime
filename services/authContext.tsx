
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';

// Add Ethereum window type definition
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('orchestrator_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    // Simulate API Latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: User = {
      id: 'usr_8723hd2',
      email: email,
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1), // "John" from john@example.com
      role: 'admin',
      avatarUrl: 'https://ui-avatars.com/api/?background=3b82f6&color=fff&name=' + email,
      company: 'NeoBank Global'
    };

    setUser(mockUser);
    localStorage.setItem('orchestrator_user', JSON.stringify(mockUser));
  };

  const signup = async (name: string, email: string, password: string, company: string) => {
    // Simulate API Latency and Hashing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newUser: User = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      email: email,
      name: name,
      role: 'merchant', // Default role for new signups
      avatarUrl: 'https://ui-avatars.com/api/?background=10b981&color=fff&name=' + name,
      company: company
    };

    setUser(newUser);
    localStorage.setItem('orchestrator_user', JSON.stringify(newUser));
  };

  const loginWeb3 = async () => {
    if (typeof window.ethereum === 'undefined') {
      throw new Error("MetaMask is not installed. Please install it to use Web3 login.");
    }

    try {
      // 1. Request Account Access (Triggers MetaMask Modal)
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found or user rejected connection.");
      }

      const walletAddress = accounts[0];
      const shortAddr = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;

      // 2. Simulate Backend Registration/Lookup for this wallet
      // In production, we would sign a nonce here to prove ownership
      await new Promise(resolve => setTimeout(resolve, 600));

      const web3User: User = {
        id: walletAddress,
        email: `${shortAddr}@wallet.eth`,
        name: `Wallet ${shortAddr}`,
        role: 'developer',
        avatarUrl: `https://effigy.im/a/${walletAddress}.svg`, // Blockie avatar
        company: 'Web3 DAO',
        walletAddress: walletAddress
      };

      setUser(web3User);
      localStorage.setItem('orchestrator_user', JSON.stringify(web3User));

    } catch (error: any) {
      console.error("Web3 Login Error:", error);
      // Re-throw to be handled by UI
      if (error.code === 4001) {
         throw new Error("Connection request rejected by user.");
      }
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('orchestrator_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWeb3, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
