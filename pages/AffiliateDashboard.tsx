
import React from 'react';
import { 
  Users, 
  MousePointer2, 
  CreditCard, 
  Trophy, 
  Copy, 
  ExternalLink,
  ChevronRight,
  DollarSign
} from 'lucide-react';

const LeaderboardItem = ({ rank, name, earnings }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-2xl transition-all cursor-default group">
    <div className="flex items-center space-x-4">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${rank === 1 ? 'bg-yellow-500 text-black' : rank === 2 ? 'bg-slate-300 text-black' : rank === 3 ? 'bg-orange-500 text-black' : 'bg-slate-700 text-slate-300'}`}>
        {rank}
      </div>
      <div className="font-bold group-hover:text-red-500 transition-colors">{name}</div>
    </div>
    <div className="font-mono text-slate-400">${earnings.toLocaleString()}</div>
  </div>
);

const AffiliateDashboard = () => {
  const referralLink = "https://redwire.ai/ref=alex_99";

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Affiliate <span className="text-red-500">Partner Hub</span></h1>
          <p className="text-slate-400">Earn 45% recurring lifetime commission on every active referral.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center space-x-4">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Next Payout</div>
          <div className="text-2xl font-bold text-green-500">$1,245.00</div>
        </div>
      </div>

      {/* Referral Link Card */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-grow">
            <h3 className="text-lg font-bold mb-2">Your Unique Referral Link</h3>
            <div className="flex items-center bg-slate-950 border border-slate-800 p-4 rounded-2xl">
              <span className="text-slate-500 font-mono text-sm truncate mr-4">{referralLink}</span>
              <button 
                onClick={() => navigator.clipboard.writeText(referralLink)}
                className="ml-auto p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-red-500 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full md:w-auto flex flex-row gap-4">
            <button className="flex-1 md:flex-none px-8 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg shadow-red-900/20">
              Download Media Kit
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-4">
            <MousePointer2 className="w-5 h-5" />
          </div>
          <div className="text-slate-400 text-sm mb-1">Total Clicks</div>
          <div className="text-3xl font-bold">1,482</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 mb-4">
            <Users className="w-5 h-5" />
          </div>
          <div className="text-slate-400 text-sm mb-1">Active Referrals</div>
          <div className="text-3xl font-bold">42</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-4">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-slate-400 text-sm mb-1">MRR Contributions</div>
          <div className="text-3xl font-bold">$4,850</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
          <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 mb-4">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="text-slate-400 text-sm mb-1">Lifetime Earned</div>
          <div className="text-3xl font-bold">$12,402</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
            <h3 className="text-xl font-bold mb-8">Recent Referrals</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-widest text-left">
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Plan</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold">Comm. Monthly</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { name: 'John Doe', plan: 'Smart Bundle', status: 'Active', comm: 135.00 },
                    { name: 'Jane Smith', plan: 'Voice Agent', status: 'Active', comm: 90.00 },
                    { name: 'Micro Tech', plan: 'AI Chatbot', status: 'Active', comm: 45.00 },
                    { name: 'Health First', plan: 'Voice Agent', status: 'Canceled', comm: 0.00 },
                  ].map((r, i) => (
                    <tr key={i} className="border-t border-slate-800">
                      <td className="py-4 font-bold">{r.name}</td>
                      <td className="py-4 text-slate-400">{r.plan}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${r.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono">${r.comm.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Leaderboard</h3>
            <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">30 Days</span>
          </div>
          <div className="space-y-2">
            <LeaderboardItem rank={1} name="Sarah Miller" earnings={8420} />
            <LeaderboardItem rank={2} name="Mike Thompson" earnings={6150} />
            <LeaderboardItem rank={3} name="David Chen" earnings={5800} />
            <LeaderboardItem rank={4} name="Emily Watts" earnings={4200} />
            <LeaderboardItem rank={5} name="Chris Brown" earnings={3900} />
          </div>
          <button className="w-full mt-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold text-slate-400 flex items-center justify-center">
            View All Partners <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
