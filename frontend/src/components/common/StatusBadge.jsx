import React from 'react';
import { ShieldCheck, ShieldAlert, Clock } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const badgeConfig = {
    Verified: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-300',
      icon: ShieldCheck,
      label: 'Verified'
    },
    Registered: {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-300',
      icon: Clock,
      label: 'Registered'
    },
    'Verification Failed': {
      bg: 'bg-rose-50 text-rose-700 border-rose-300',
      icon: ShieldAlert,
      label: 'Verification Failed'
    }
  };

  const config = badgeConfig[status] || badgeConfig.Registered;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${config.bg}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
