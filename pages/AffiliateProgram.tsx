
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, DollarSign, PieChart, ShieldCheck, ArrowRight, Zap, Gift, Loader2 } from 'lucide-react';
import { SiteSettings } from '../types';
import { useNotify } from '../App';

const BenefitCard = ({ icon: Icon, title, desc }: any) => (
  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6">
      <Icon className="w-6 h-6 text-red-500" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
  </div>
);

const AffiliateProgram = ({ settings }: { settings: SiteSettings }) => {
  const { notify } = useNotify();
  const [isApplying, setIsApplying] = useState(false);
  const parts = settings.affiliateHeading.split(' ');
  const last = parts.pop();
  const first = parts.join(' ');

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      notify("Partner Alert: New affiliate application received. Admin text notification sent.", 'affiliate');
      setIsApplying(false);
      alert("Application Submitted! Our team will review your application and text you within 24 hours.");
    }, 1500);
  };

  return (
    <div className="pt-32 pb-24">
      <section className="px-6 max-w-5xl mx-auto text-center mb-24">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          <Gift className="w-4 h-4" />
          <span>Earn 45% Recurring for Life</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">{first} <span className="text-red-500">{last}</span></h1>
        <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
          {settings.affiliateSubheading}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={handleApply}
            disabled={isApplying}
            className="w-full sm:w-auto px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-3xl font-bold text-xl shadow-2xl shadow-red-900/40 flex items-center justify-center disabled:opacity-50"
          >
            {isApplying ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Apply to Join'}
          </button>
        </div>
      </section>

      <section className="bg-slate-950 px-6 py-24 border-y border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard icon={TrendingUp} title="High Commissions" desc="Earn a massive 45% recurring commission on every subscription, including setup fees." />
            <BenefitCard icon={Users} title="Cookie Duration" desc="90-day tracking cookies ensure you get credit for every conversion across devices." />
            <BenefitCard icon={DollarSign} title="Monthly Payouts" desc="Reliable monthly payouts via Stripe for all approved commissions from active clients." />
            <BenefitCard icon={PieChart} title="Real-time Tracking" desc="Advanced dashboard to track clicks, leads, and monthly recurring revenue contributions." />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AffiliateProgram;
