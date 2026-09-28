import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShieldCheck, ShieldAlert, FileCheck, Layers, PlusCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { documentService } from '../../services/documentService';
import StatsCard from '../../components/common/StatsCard';
import DocumentCard from '../../components/documents/DocumentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    registered: 0,
    failed: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await documentService.getDocuments({ limit: 10 });
      if (res.success) {
        const docs = res.data;
        setDocuments(docs);

        const verifiedCount = docs.filter((d) => d.status === 'Verified').length;
        const registeredCount = docs.filter((d) => d.status === 'Registered').length;
        const failedCount = docs.filter((d) => d.status === 'Verification Failed').length;

        setStats({
          total: res.pagination?.total || docs.length,
          verified: verifiedCount,
          registered: registeredCount,
          failed: failedCount
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const COLORS = ['#0891b2', '#2563eb', '#7c3aed', '#059669', '#d97706', '#db2777'];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vault Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Overview of your blockchain registered documents & authenticity proofs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link to="/documents/upload">
            <button className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all">
              <PlusCircle className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </Link>
          <Link to="/verify">
            <button className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold transition-all shadow-sm">
              <FileCheck className="w-4 h-4 text-cyan-600" />
              <span>Verify Copy</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Documents"
          value={stats.total}
          icon={FileText}
          color="cyan"
          subtitle="Vault Document Records"
        />
        <StatsCard
          title="Registered On-Chain"
          value={stats.registered}
          icon={Layers}
          color="purple"
          subtitle="Immutable SHA-256 Hashes"
        />
        <StatsCard
          title="Verified Documents"
          value={stats.verified}
          icon={ShieldCheck}
          color="emerald"
          subtitle="100% Authentic Hashes"
        />
        <StatsCard
          title="Verification Mismatches"
          value={stats.failed}
          icon={ShieldAlert}
          color="rose"
          subtitle="Tampered File Alerts"
        />
      </div>

      {/* Main Content: Recent Documents & Category Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Documents (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Vault Documents</h2>
            <Link to="/documents" className="text-xs font-bold text-cyan-700 hover:underline flex items-center space-x-1">
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="glass-card p-12 rounded-2xl bg-white">
              <LoadingSpinner text="Fetching document records from vault..." />
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              title="Your Vault is Empty"
              description="Upload your first certificate or document to generate its SHA-256 fingerprint on the blockchain."
              actionText="Upload First Document"
              onAction={() => window.location.href = '/documents/upload'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.slice(0, 4).map((doc) => (
                <DocumentCard key={doc._id} document={doc} />
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown & Smart Contract Info (1 column) */}
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Category Distribution
            </h3>
            {chartData.length > 0 ? (
              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '12px', color: '#0f172a' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">No document categories recorded yet</p>
            )}
          </div>

          {/* Quick Security Status Card */}
          <div className="glass-card p-5 rounded-2xl border border-cyan-200 bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/50 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-cyan-700">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">Solidity Registry Active</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Connected to Hardhat Localnet (Chain ID: 31337). Smart contract verifies document hashes automatically on transaction submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
