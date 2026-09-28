import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'cyan', subtitle }) => {
  const colorMap = {
    cyan: 'from-cyan-50 to-cyan-100/50 text-cyan-700 border-cyan-200',
    emerald: 'from-emerald-50 to-emerald-100/50 text-emerald-700 border-emerald-200',
    purple: 'from-purple-50 to-purple-100/50 text-purple-700 border-purple-200',
    rose: 'from-rose-50 to-rose-100/50 text-rose-700 border-rose-200'
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200 relative overflow-hidden group hover:border-slate-300 transition-all duration-300 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color] || colorMap.cyan} border`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
