
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  Menu, 
  Sparkles, 
  Loader2, 
  ImageIcon, 
  Link as LinkIcon, 
  Trash2, 
  ShieldCheck, 
  LogOut, 
  Edit3 
} from 'lucide-react';
import { SiteSettings, Product, ProductType } from '../types.ts';
import { BrandText, useKeyStatus } from '../shared.tsx';
import { generateAIImage } from '../services/gemini.ts';

const GET_STARTED_URL = "https://api.leadconnectorhq.com/widget/form/BGm7Yk9CCULsw34XwYeM?notrack=true";

export const ImageUploadModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  title, 
  currentValue,
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (url: string) => void;
  title: string;
  currentValue?: string;
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'ai'>('upload');
  const [url, setUrl] = useState(currentValue || '');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { triggerKeyError } = useKeyStatus();

  useEffect(() => {
    if (isOpen) setUrl(currentValue || '');
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        onSave(reader.result as string); 
        onClose(); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateAIImage(aiPrompt, false);
      onSave(imageUrl);
      onClose();
    } catch (err: any) {
      if (err.message === "API_KEY_MISSING") {
        triggerKeyError();
      } else {
        alert("Failed to generate image. Please check your API key and billing.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="dark-glass w-full max-w-lg rounded-[40px] p-8 border-slate-800 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center text-white">
            <Sparkles className="w-6 h-6 mr-2 text-red-500" />
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-2xl mb-8 border border-slate-800">
          {['upload', 'url', 'ai'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold capitalize transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'upload' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); const file = e.dataTransfer.files?.[0]; if (file) processFile(file); }}
              className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all group cursor-pointer ${
                isDragging ? 'border-red-500 bg-red-600/10' : 'border-slate-800 hover:border-red-500/50'
              }`}
            >
              <ImageIcon className={`w-12 h-12 mb-3 ${isDragging ? 'text-red-500' : 'text-slate-600'}`} />
              <span className="text-sm font-bold text-center text-slate-400">
                {isDragging ? 'Drop to Upload' : 'Drop image here or click to browse'}
              </span>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          )}

          {activeTab === 'url' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <LinkIcon className="w-4 h-4 text-slate-500" />
              </div>
              <input 
                type="text" 
                placeholder="Paste image URL here..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-500 transition-all text-sm text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button onClick={() => { onSave(url); onClose(); }} className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg text-white">Apply URL</button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <textarea 
                placeholder="e.g. A futuristic robot helping customers..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm outline-none focus:border-red-500"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center text-white"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isGenerating ? 'Generating...' : 'Generate with Gemini'}
              </button>
            </div>
          )}

          {currentValue && (
            <button 
              onClick={() => { onSave(''); onClose(); }}
              className="w-full py-3 bg-slate-900/50 hover:bg-red-950/20 text-red-500 border border-slate-800 rounded-2xl font-bold transition-all text-xs flex items-center justify-center space-x-2 group"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Current Image</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const Navbar = ({ settings, onLogoClick, isAdminMode, onExitAdmin }: { 
  settings: SiteSettings; 
  onLogoClick?: () => void; 
  isAdminMode: boolean;
  onExitAdmin: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  if (['/login', '/checkout', '/onboarding'].some(path => location.pathname.includes(path))) return null;

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between dark-glass rounded-2xl px-6 py-3 shadow-2xl">
        <div className="flex items-center">
          <Link to="/">
            <BrandText name={settings.siteName} logoUrl={settings.logoImageUrl} onLogoClick={onLogoClick} />
          </Link>
          {isAdminMode && (
            <div className="ml-4 flex items-center bg-red-600/10 border border-red-600/20 rounded-full px-3 py-1">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500 mr-1.5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Admin Mode</span>
            </div>
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <div className="group relative cursor-pointer hover:text-white py-2">
            Ecosystem
            <div className="absolute top-full left-0 pt-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="w-52 bg-slate-950 border border-slate-800 rounded-xl p-2 shadow-2xl">
                <Link to="/product/chatbot" className="block p-2 hover:bg-slate-800 rounded-lg text-slate-300">AI Chatbot</Link>
                <Link to="/product/voicebot" className="block p-2 hover:bg-slate-800 rounded-lg text-slate-300">Website Voicebot</Link>
                <Link to="/product/voice-agent" className="block p-2 hover:bg-slate-800 rounded-lg text-slate-300">AI Voice Agent</Link>
                <Link to="/product/smart-website" className="block p-2 hover:bg-slate-800 rounded-lg text-slate-300">Smart Websites</Link>
              </div>
            </div>
          </div>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          {isAdminMode ? (
            <div className="flex items-center space-x-3">
              <Link to="/congobaby1!1!" className="text-red-500 hover:text-red-400 font-bold">Dashboard</Link>
              <button onClick={onExitAdmin} className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-black uppercase"><LogOut className="w-3.5 h-3.5 mr-2" /> Exit</button>
            </div>
          ) : (
            <a href={GET_STARTED_URL} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }} className="px-4 py-2 rounded-lg font-bold transition-all">Get Started</a>
          )}
        </div>
        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-24 left-6 right-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl z-40">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg">Home</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)} className="block text-lg">Pricing</Link>
          <a href={GET_STARTED_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }} className="block py-3 text-center rounded-xl font-bold">Get Started</a>
        </div>
      )}
    </nav>
  );
};
