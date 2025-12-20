
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ChevronLeft, CheckCircle, Building2, Briefcase, User } from 'lucide-react';
import { Product } from '../types';
import { useNotify } from '../shared';

const Checkout = ({ products }: { products: Product[] }) => {
  const { notify } = useNotify();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const plan = products.find(p => p.id === planId) || products[0];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    industry: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    country: ''
  });

  const handleCheckout = () => {
    setLoading(true);
    setTimeout(() => {
      notify(`System: New Sale! ${plan.name} ecosystem deployed.`, 'sale');
      navigate('/onboarding');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8 lg:sticky lg:top-32">
          <Link to="/pricing" className="inline-flex items-center text-slate-500 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to plans
          </Link>
          <h1 className="text-4xl font-extrabold">Finalize Your <span className="text-red-500">Ecosystem</span></h1>
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-6 opacity-10"><ShieldCheck className="w-16 h-16 text-red-500" /></div>
            <div className="mb-6"><h3 className="font-bold text-2xl mb-2">{plan.name}</h3><p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start text-xs text-slate-300">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 mt-0.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] space-y-4">
            <div className="flex justify-between items-center text-slate-400"><span className="text-sm">Monthly</span><span className="font-bold text-white">${plan.monthlyPrice}</span></div>
            <div className="flex justify-between items-center text-slate-400"><span className="text-sm">Setup</span><span className="font-bold text-white">${plan.setupFee}</span></div>
            <div className="pt-4 border-t border-slate-800 flex justify-between items-center"><span className="text-xl font-bold">Due Today</span><span className="text-2xl font-extrabold text-red-500">${plan.monthlyPrice + plan.setupFee}</span></div>
          </div>
        </div>

        <div className="dark-glass p-8 md:p-10 rounded-[40px] border-slate-800">
          <h2 className="text-2xl font-bold mb-8">Payment Details</h2>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" required placeholder="First Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none text-sm" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              <input type="text" required placeholder="Last Name" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none text-sm" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
            </div>
            <input type="email" required placeholder="Email Address" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <div className="relative">
              <input type="text" required placeholder="Card number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 focus:border-red-500 outline-none text-sm" />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-5 bg-red-600 rounded-2xl font-bold text-xl transition-all disabled:opacity-50">
              {loading ? "Processing..." : `Pay $${plan.monthlyPrice + plan.setupFee}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
