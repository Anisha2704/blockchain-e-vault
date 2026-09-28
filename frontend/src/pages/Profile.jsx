import React from 'react';
import { Mail, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, web3Wallet, connectWallet } = useAuth();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Account Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Manage your credentials and Web3 wallet connections
        </p>
      </div>

      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl">
        <div className="flex items-center space-x-4 border-b border-slate-200 pb-6">
          <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 font-bold text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
            <span className="inline-block text-[10px] font-mono font-bold uppercase bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 mt-1">
              Role: {user?.role || 'user'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
            <span className="text-slate-600 font-sans font-bold flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-600" /> Account Email:
            </span>
            <span className="text-slate-900 font-bold">{user?.email}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-sans font-bold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-purple-600" /> MetaMask Address:
              </span>
              {web3Wallet ? (
                <span className="text-cyan-800 font-bold truncate max-w-[200px]">{web3Wallet}</span>
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-3 py-1 bg-cyan-100 text-cyan-800 hover:bg-cyan-200 rounded font-sans text-xs font-bold transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
