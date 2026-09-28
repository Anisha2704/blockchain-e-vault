import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Cpu, FileCheck, ArrowRight, Zap } from 'lucide-react';
import Button from '../components/common/Button';

const Landing = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold tracking-wide uppercase shadow-sm">
            <Zap className="w-4 h-4 text-cyan-600 animate-pulse" />
            <span>Ethereum Hardhat & SHA-256 Powered</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Secure Your Documents. <br />
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prove Their Authenticity.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Store your documents securely off-chain and verify their cryptographic integrity on an immutable blockchain ledger.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/register">
              <Button variant="primary" size="lg" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
            <Link to="/verify">
              <Button variant="outline" size="lg" icon={FileCheck}>
                Verify a Document
              </Button>
            </Link>
          </div>

          {/* Visual Diagram Banner */}
          <div className="pt-12 max-w-4xl mx-auto">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl relative bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">1</div>
                  <h4 className="text-sm font-bold text-slate-900">Upload File</h4>
                  <p className="text-xs text-slate-500 font-medium">PDF, PNG, JPG original documents</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</div>
                  <h4 className="text-sm font-bold text-slate-900">Compute SHA-256</h4>
                  <p className="text-xs text-slate-500 font-medium">64-character unique hash</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">3</div>
                  <h4 className="text-sm font-bold text-slate-900">Smart Contract</h4>
                  <p className="text-xs text-slate-500 font-medium">Hash stored on Ethereum ledger</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">4</div>
                  <h4 className="text-sm font-bold text-slate-900">Instant Verification</h4>
                  <p className="text-xs text-slate-500 font-medium">Detect any byte-level tampering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Blockchain Document Verification?</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto font-medium">
            Traditional centralized document storage is vulnerable to unauthorized modifications, data breaches, and counterfeiting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 w-fit">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Immutable Audit Trail</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Once registered on the Solidity smart contract, a document's SHA-256 fingerprint can never be altered or forged by anyone.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-purple-700 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Document Leakage</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Actual file contents are NEVER sent to the blockchain network. Only mathematical digests exist on-chain to maintain privacy.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-4 bg-white shadow-sm">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 w-fit">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Public & Instant Proof</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Anyone with a document copy can verify its authenticity instantly without needing administrative access or manual audits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-10 rounded-3xl border border-cyan-200 text-center space-y-6 bg-gradient-to-r from-cyan-50 via-blue-50 to-purple-50 shadow-md">
          <h2 className="text-3xl font-extrabold text-slate-900">Ready to Vault Your Critical Documents?</h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto font-medium">
            Experience tamper-evident document security for educational certificates, experience letters, and legal contracts.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
