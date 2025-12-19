
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Info, Bot, CheckCircle, ArrowRight, Loader2, Wand2 } from 'lucide-react';
import { generateBusinessSummary, getOnboardingAssistance } from '../services/gemini';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    industry: 'Real Estate',
    leadTone: 'Professional',
    hours: '24/7'
  });
  const navigate = useNavigate();

  const handleNext = async () => {
    if (step === 2) {
      setLoading(true);
      // Simulate GHL Sync + Gemini Insight
      const summary = await generateBusinessSummary(formData.businessName, formData.industry);
      console.log("Gemini Summary:", summary);
      
      const help = await getOnboardingAssistance('AI Voice Agent');
      setAiSuggestions(help.questions);
      setLoading(false);
    }
    
    if (step === 4) {
      navigate('/dashboard');
    } else {
      setStep(step + 1);
    }
  };

  const steps = [
    { title: "Welcome", icon: Info },
    { title: "Business Info", icon: Bot },
    { title: "AI Preferences", icon: Wand2 },
    { title: "System Sync", icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={i} className={`flex flex-col items-center ${step > i + 1 ? 'text-green-500' : step === i + 1 ? 'text-red-500' : 'text-slate-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all ${step > i + 1 ? 'bg-green-500/10 border-green-500' : step === i + 1 ? 'bg-red-500/10 border-red-500 shadow-lg shadow-red-900/20' : 'border-slate-800'}`}>
                  {step > i + 1 ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{s.title}</span>
              </div>
            ))}
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
        </div>

        <div className="dark-glass rounded-[40px] p-10 border-slate-800">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold">Welcome to Red Wire AI!</h2>
              <p className="text-slate-400">You've successfully subscribed to the <strong>Smart Website Bundle</strong>. We're ready to build your automation ecosystem.</p>
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                <h4 className="font-bold mb-2 flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Secure Setup Process</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Over the next 3 minutes, we'll collect the key details needed to sync your new platform with GoHighLevel and configure your AI agents.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold">Business Essentials</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Business Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-red-500 transition-all outline-none"
                    placeholder="e.g. Acme Automation"
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-2">Industry</label>
                  <select 
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-red-500 transition-all outline-none appearance-none"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  >
                    <option>Real Estate</option>
                    <option>Legal Services</option>
                    <option>Dental/Medical</option>
                    <option>SaaS</option>
                    <option>E-commerce</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold flex items-center">
                AI Agent Preferences
              </h2>
              <p className="text-slate-400">How should your automated agents represent your brand?</p>
              
              <div className="bg-red-600/5 p-6 rounded-3xl border border-red-600/20 mb-4">
                <h4 className="text-red-500 font-bold text-sm mb-4 flex items-center">
                  <Wand2 className="w-4 h-4 mr-2" />
                  Gemini-Powered Suggestions
                </h4>
                <ul className="space-y-3">
                  {aiSuggestions.map((s, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start">
                      <span className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mr-2 shrink-0 font-bold">{i+1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Communication Tone</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Professional', 'Friendly', 'Direct', 'Creative'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setFormData({...formData, leadTone: t})}
                      className={`p-4 rounded-2xl border transition-all text-sm font-bold ${formData.leadTone === t ? 'border-red-600 bg-red-600/10 text-white' : 'border-slate-800 bg-slate-900/30 text-slate-500'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-3">Syncing Complete!</h2>
                <p className="text-slate-400">Your profile has been pushed to GoHighLevel and your Stripe subscription is verified. Welcome to the ecosystem.</p>
              </div>
              <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-left">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">GHL Contact ID</span>
                  <span className="font-mono text-green-500">ghl_8329xP92</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Status</span>
                  <span className="font-bold text-white">Active (Pipeline: Onboarding)</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-10">
            <button 
              onClick={handleNext}
              disabled={loading}
              className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-xl shadow-2xl shadow-red-900/30 flex items-center justify-center transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {step === 4 ? 'Enter Dashboard' : 'Continue'}
                  <ArrowRight className="w-6 h-6 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
