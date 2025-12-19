
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, ChevronLeft, CheckCircle, Building2, Briefcase, User } from 'lucide-react';
import { Product } from '../types';
import { useNotify } from '../App';

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
    // Simulate payment processing
    setTimeout(() => {
      notify(`System: New Sale! ${plan.name} ecosystem deployed. Admin SMS dispatched.`, 'sale');
      navigate('/onboarding');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Order Summary */}
        <div className="space-y-8 lg:sticky lg:top-32">
          <Link to="/pricing" className="inline-flex items-center text-slate-500 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to plans
          </Link>
          <h1 className="text-4xl font-extrabold">Finalize Your <span className="text-red-500">Ecosystem</span></h1>
          
          <div className="space-y-6">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <ShieldCheck className="w-16 h-16 text-red-500" />
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-2xl mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{plan.description}</p>
              </div>

              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Included Features</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] space-y-4 shadow-xl">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">Monthly Subscription</span>
                <span className="font-bold text-white">${plan.monthlyPrice}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">One-time Setup Fee</span>
                <span className="font-bold text-white">${plan.setupFee}</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xl font-bold">Total Due Today</span>
                <span className="text-2xl font-extrabold text-red-500">${plan.monthlyPrice + plan.setupFee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="dark-glass p-8 md:p-10 rounded-[40px] border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Payment Details</h2>
            <div className="flex space-x-2">
              <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleCheckout(); }}>
            <div className="space-y-4">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                    <input type="text" required placeholder="John" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 focus:border-red-500 outline-none transition-all text-sm" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                    <input type="text" required placeholder="Doe" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 focus:border-red-500 outline-none transition-all text-sm" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                    <input type="text" required placeholder="Acme Inc." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 focus:border-red-500 outline-none transition-all text-sm" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Real Estate, SaaS" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 focus:border-red-500 outline-none transition-all text-sm" 
                      value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                <input type="email" required placeholder="john.doe@company.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none transition-all text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              {/* Card Information */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Card Information</label>
                <div className="relative">
                  <input type="text" required placeholder="Card number" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 pl-12 focus:border-red-500 outline-none transition-all text-sm" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input type="text" required placeholder="MM/YY" className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none text-sm" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} />
                  <input type="text" required placeholder="CVC" className="bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none text-sm" value={formData.cvc} onChange={e => setFormData({...formData, cvc: e.target.value})} />
                </div>
              </div>

              {/* Billing Location */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Billing Country</label>
                <select required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 outline-none text-sm appearance-none" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})}>
                  <option value="">Select a country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-xl shadow-2xl shadow-red-900/40 flex items-center justify-center transition-all disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : `Pay $${plan.monthlyPrice + plan.setupFee}`}
            </button>
            <p className="text-center text-[10px] text-slate-500 mt-4 px-4 font-bold uppercase tracking-wider">
              Secure 256-bit SSL Encrypted Payment
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
