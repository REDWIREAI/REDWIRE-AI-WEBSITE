
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-red-600 to-red-900 p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 right-20 w-80 h-80 border-4 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 border-4 border-white rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-white mb-20">
            <div className="w-10 h-10 bg-white text-red-600 rounded-lg flex items-center justify-center font-bold text-xl">RW</div>
            <span className="text-2xl font-bold tracking-tight">Red Wire AI</span>
          </div>
          <h2 className="text-6xl font-extrabold text-white leading-tight">Automate <br />Your Way To <br />Growth.</h2>
        </div>
        
        <div className="relative z-10">
          <div className="p-8 dark-glass border-white/20 rounded-[32px]">
            <p className="text-white text-lg font-medium italic">"Red Wire AI transformed our sales funnel. Our AI agent handles 200 calls a day without skipping a beat."</p>
            <div className="mt-4 text-white/70 font-bold uppercase tracking-widest text-xs">- Sarah, CEO of Zenith Real Estate</div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 pt-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold mb-2">Welcome Back</h1>
            <p className="text-slate-500">Log in to manage your ecosystem or track your referrals.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-2">Email</label>
                <input type="email" required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-red-500 outline-none transition-all" placeholder="name@company.com" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-500">Password</label>
                  <a href="#" className="text-xs text-red-500 font-bold hover:underline">Forgot?</a>
                </div>
                <input type="password" required className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 focus:border-red-500 outline-none transition-all" placeholder="••••••••" />
              </div>
            </div>

            <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-xl shadow-2xl shadow-red-900/20 flex items-center justify-center transition-all">
              Sign In <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-600 text-sm font-bold">OR</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center py-4 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-all font-bold text-sm">
                <Github className="w-5 h-5 mr-2" /> Google
              </button>
              <button type="button" className="flex items-center justify-center py-4 border border-slate-800 rounded-2xl hover:bg-slate-900 transition-all font-bold text-sm">
                GoHighLevel
              </button>
            </div>
          </form>

          <p className="text-center text-slate-500 text-sm">
            New to the ecosystem? <Link to="/pricing" className="text-red-500 font-bold hover:underline">Build Your Plan</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
