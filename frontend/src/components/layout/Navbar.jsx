import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Wallet, LogOut, FileCheck, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { user, isAuthenticated, logout, web3Wallet, connectWallet } = useAuth();
  const location = useLocation();

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      alert(err.message);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Verify Document', path: '/verify', icon: FileCheck },
    ...(isAuthenticated
      ? [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { name: 'Documents', path: '/documents' },
          { name: 'Upload', path: '/documents/upload' }
        ]
      : [])
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 font-bold" />
            </div>
            <div>
              <span className="text-lg font-extrabold bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-700 bg-clip-text text-transparent tracking-tight">
                BlockVault
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded ml-2 border border-cyan-200 font-semibold">
                E-Vault
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-3">
            {/* MetaMask Button */}
            <button
              onClick={handleWalletConnect}
              className="hidden lg:inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-100 border border-slate-200 text-slate-700 hover:border-cyan-500 hover:text-cyan-700 transition-all duration-200"
              title="Connect MetaMask Wallet"
            >
              <Wallet className="w-3.5 h-3.5 text-cyan-600" />
              <span>
                {web3Wallet
                  ? `${web3Wallet.substring(0, 6)}...${web3Wallet.substring(web3Wallet.length - 4)}`
                  : 'Connect Wallet'}
              </span>
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:border-slate-300 text-xs text-slate-800 font-medium"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="font-semibold">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
