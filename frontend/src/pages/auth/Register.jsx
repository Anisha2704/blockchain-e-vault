import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Wallet, UserPlus, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, connectWallet } = useAuth();
  const navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      const addr = await connectWallet();
      setWalletAddress(addr);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register({ name, email, password, walletAddress });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="glass-card p-8 rounded-3xl border border-slate-200 w-full max-w-md space-y-6 shadow-xl bg-white">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-50 text-cyan-700 border border-cyan-200 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create Account</h2>
          <p className="text-xs text-slate-500 font-medium">Join Blockchain E-Vault to securely register documents</p>
        </div>

        {error && <Toast message={error} type="error" onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="name"
            icon={User}
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            id="email"
            type="email"
            icon={Mail}
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            id="password"
            type="password"
            icon={Lock}
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              MetaMask Wallet Address (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="0x..."
                className="block w-full rounded-lg bg-white border border-slate-300 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-600/20"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <button
                type="button"
                onClick={handleConnectWallet}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-cyan-700 rounded-lg text-xs font-bold shrink-0 border border-slate-300 flex items-center gap-1"
                title="Detect MetaMask"
              >
                <Wallet className="w-3.5 h-3.5" /> Auto-Fill
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-2.5" isLoading={isLoading} icon={UserPlus}>
            Register Account
          </Button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-200">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-700 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
