
import React from 'react';
import { 
  Activity, 
  MessageSquare, 
  PhoneCall, 
  Settings, 
  ArrowUpRight, 
  Calendar,
  CreditCard,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';

const data = [
  { name: 'Mon', leads: 4 },
  { name: 'Tue', leads: 7 },
  { name: 'Wed', leads: 5 },
  { name: 'Thu', leads: 12 },
  { name: 'Fri', leads: 9 },
  { name: 'Sat', leads: 3 },
  { name: 'Sun', leads: 6 },
];

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-green-500 text-xs font-bold bg-green-500/10 px-2 py-1 rounded-full flex items-center">
        <ArrowUpRight className="w-3 h-3 mr-1" />
        {trend}
      </span>
    </div>
    <div className="text-slate-400 text-sm font-medium mb-1">{label}</div>
    <div className="text-3xl font-bold">{value}</div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Welcome Back, <span className="text-red-500">Alex</span></h1>
          <p className="text-slate-400">Here's how your AI Ecosystem is performing across GHL and Stripe.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Product
          </button>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold shadow-lg shadow-red-900/20">
            Support Chat
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={MessageSquare} label="Total Chat Leads" value="156" trend="+12%" />
        <StatCard icon={PhoneCall} label="AI Voice Appointments" value="28" trend="+5%" />
        <StatCard icon={Activity} label="Bot Accuracy" value="94.2%" trend="+1.2%" />
        <StatCard icon={Calendar} label="Booked Revenue" value="$4,200" trend="+18%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Weekly Lead Performance (GHL Sync)</h3>
            <select className="bg-slate-800 border-none rounded-lg px-3 py-1 text-xs">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#dc2626" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px]">
            <h3 className="text-xl font-bold mb-6">Active Subscriptions</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-[10px]">SW</div>
                  <div>
                    <div className="text-sm font-bold">Smart Website</div>
                    <div className="text-[10px] text-slate-500">Auto-renews 24 Oct</div>
                  </div>
                </div>
                <div className="text-sm font-bold">$300/mo</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center font-bold text-[10px]">CB</div>
                  <div>
                    <div className="text-sm font-bold">Custom Bot</div>
                    <div className="text-[10px] text-slate-500">Auto-renews 02 Nov</div>
                  </div>
                </div>
                <div className="text-sm font-bold">$100/mo</div>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold text-slate-300">
              Manage Billing (Stripe)
            </button>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-900 p-8 rounded-[40px] shadow-2xl shadow-red-900/40">
            <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
            <p className="text-red-100 text-sm mb-6 leading-relaxed">Join our affiliate program and get 45% recurring commission on every friend you refer.</p>
            <button className="w-full py-4 bg-white text-red-600 rounded-2xl font-bold hover:bg-slate-100 transition-colors">
              Activate Affiliate ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
