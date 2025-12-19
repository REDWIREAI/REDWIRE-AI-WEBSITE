
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Rocket } from 'lucide-react';
import { Product, SiteSettings } from '../types';

interface PricingProps {
  products: Product[];
  settings: SiteSettings;
}

const GET_STARTED_URL = "https://api.leadconnectorhq.com/widget/form/BGm7Yk9CCULsw34XwYeM?notrack=true";

const Pricing: React.FC<PricingProps> = ({ products, settings }) => {
  const parts = settings.pricingHeading.split(' ');
  const last = parts.pop();
  const first = parts.join(' ');

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">{first} <span className="text-red-500">{last}</span></h1>
        <p className="text-xl text-slate-400 font-medium">{settings.pricingSubheading}</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {products.map((p) => (
          <div 
            key={p.id} 
            className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 h-full ${
              p.id === 'smart_website' 
                ? 'bg-slate-900 border-red-600 shadow-[0_0_40px_-10px_rgba(220,38,38,0.3)] z-10' 
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            {p.id === 'smart_website' && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap shadow-lg z-20">
                Most Popular
              </div>
            )}
            
            {/* Header section with fixed height for title + desc */}
            <div className="mb-6 min-h-[140px]">
              <h3 className="text-2xl font-extrabold mb-3">{p.name}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {p.description}
              </p>
            </div>
            
            {/* Pricing block with fixed height */}
            <div className="mb-8 p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 h-[100px] flex flex-col justify-center">
              <div className="flex items-baseline">
                <span className="text-4xl font-black text-white">${p.monthlyPrice}</span>
                <span className="text-slate-500 ml-2 text-sm font-bold">/mo</span>
              </div>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                + ${p.setupFee} setup fee
              </p>
            </div>

            {/* Features section with flex-grow to push button to bottom */}
            <div className="flex-grow flex flex-col">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mb-4">Features</div>
              <ul className="space-y-3 mb-10 flex-grow">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start text-xs text-slate-300 leading-tight">
                    <Check className="w-3.5 h-3.5 text-red-500 mr-2 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a 
              href={GET_STARTED_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: p.id === 'smart_website' ? settings.primaryButtonColor : 'transparent', 
                color: p.id === 'smart_website' ? settings.primaryButtonTextColor : '#ffffff',
                borderColor: p.id === 'smart_website' ? 'transparent' : '#334155'
              }}
              className={`w-full py-4 rounded-2xl font-black text-sm text-center transition-all shadow-xl border uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] ${
                p.id !== 'smart_website' ? 'hover:bg-white hover:text-black hover:border-white' : ''
              }`}
            >
              Get Started
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
