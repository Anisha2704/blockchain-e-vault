import React from 'react';
import { Shield, Lock, FileCheck, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 py-12 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-600" />
              <span className="text-base font-bold text-slate-900">Blockchain E-Vault</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm">
              Demonstrating tamper-evident document integrity using Ethereum smart contracts and SHA-256 cryptographic hashes. Documents stay private off-chain; proofs stay immutable on-chain.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/verify" className="hover:text-cyan-700 transition-colors">Public Document Verification</a></li>
              <li><a href="/dashboard" className="hover:text-cyan-700 transition-colors">User Vault Dashboard</a></li>
              <li><a href="/documents/upload" className="hover:text-cyan-700 transition-colors">Upload & Hash Document</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Security Specifications</h4>
            <ul className="space-y-2 text-xs font-mono text-slate-600">
              <li className="flex items-center space-x-1.5">
                <Lock className="w-3 h-3 text-cyan-600" />
                <span>SHA-256 Digesting</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileCheck className="w-3 h-3 text-purple-600" />
                <span>Solidity Smart Contracts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ExternalLink className="w-3 h-3 text-emerald-600" />
                <span>Zero File On-Chain Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 BlockVault - Secure Document Verification System. Built for academic & production demonstration.</p>
          <p className="mt-2 sm:mt-0 font-mono text-slate-600">Hardhat Localnet • Chain ID: 31337</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
