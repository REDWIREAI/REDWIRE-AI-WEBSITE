
import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Link as LinkIcon,
  ImageIcon,
  Sparkles,
  Loader2,
  Globe,
  Trash2,
  Bell,
  MessageSquare,
  LogOut,
  ShieldCheck,
  Key,
  AlertCircle
} from 'lucide-react';

// Shared Utilities
import { Notification, NotificationContext, KeyContext, useKeyStatus, BrandText } from './shared';

// Pages
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AffiliateDashboard from './pages/AffiliateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import AffiliateProgram from './pages/AffiliateProgram';
import Contact from './pages/Contact';
import Legal from './pages/Legal';

// Types & Data
import { SiteSettings, Product, ProductType } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { generateAIImage, generateSiteBranding } from './services/gemini';
import { db } from './services/db';

const STORAGE_KEYS = {
  SETTINGS: 'site_settings',
  PRODUCTS: 'products',
  ADMIN_TOKEN: 'rw_admin_active'
};

const GET_STARTED_URL = "https://api.leadconnectorhq.com/widget/form/BGm7Yk9CCULsw34XwYeM?notrack=true";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const ImageUploadModal = ({ 
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
        alert("Failed to generate image. Please ensure your API key is correctly selected and billing is enabled.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUrlSave = () => {
    onSave(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="dark-glass w-full max-w-lg rounded-[40px] p-8 border-slate-800 shadow-2xl scale-in-center">
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
              <button onClick={handleUrlSave} className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg text-white">Apply URL</button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Describe what you want to generate</label>
                <textarea 
                  placeholder="e.g. A futuristic robot helping customers..." 
                  className="w-full bg-transparent outline-none text-sm text-white resize-none min-h-[100px]"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center text-white"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isGenerating ? 'Generating...' : 'Generate with Gemini'}
              </button>
            </div>
          )}

          {currentValue && (
            <button 
              onClick={() => { onSave(''); onClose(); }}
              className="w-full py-3 bg-slate-900/50 hover:bg-red-950/20 text-red-500 border border-slate-800 hover:border-red-500/50 rounded-2xl font-bold transition-all text-xs flex items-center justify-center space-x-2 group"
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

const Navbar = ({ settings, onLogoClick, isAdminMode, onExitAdmin }: { 
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

const App: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(sessionStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN) === 'true');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [hasKey, setHasKey] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const isManuallyConnected = useRef(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "Red Wire AI", 
    primaryButtonColor: "#dc2626",
    primaryButtonTextColor: "#ffffff",
    heroHeading: "Human Like Automations That Don't Sleep",
    heroSubheading: "We specialize in Small Business growth. Custom-built Smart Websites, Chatbots, and Voice Agents designed to capture every lead and automate your operation",
    heroImageUrl: "https://picsum.photos/seed/redwire/1200/600",
    heroButtonText: "Build Your Ecosystem",
    heroButtonLink: GET_STARTED_URL,
    productsHeading: "Our Core Products",
    productsSubheading: "Everything you need to automate lead capture, sales, and support.",
    howItWorksHeading: "How It Works",
    howItWorksSubheading: "Automating your business is easier than you think.",
    whyChooseUsHeading: "Why Choose Us",
    whyChooseUsImageUrl: "https://picsum.photos/seed/tech/600/600",
    whyChooseUsButtonText: "View Full Ecosystem",
    whyChooseUsButtonLink: "/pricing",
    pricingHeading: "Simple, Scalable Pricing",
    pricingSubheading: "Choose the tools you need or grab the bundle for maximum power.",
    affiliateHeading: "Grow With Red Wire",
    affiliateSubheading: "The most generous partner program in the AI space.",
    contactHeading: "Get in Touch",
    contactSubheading: "Questions about automation? Our experts are here to help.",
    headerCode: "",
    bodyCode: "",
    footerCode: ""
  });

  const location = useLocation();

  const checkKey = async () => {
    if (isManuallyConnected.current) return;
    const aistudio = (window as any).aistudio;
    let isSelected = true; 
    if (aistudio && typeof aistudio.hasSelectedApiKey === 'function') {
      try { isSelected = await aistudio.hasSelectedApiKey(); } catch (e) { console.warn(e); }
    }
    setHasKey(isSelected);
  };

  useEffect(() => {
    checkKey();
    const interval = setInterval(checkKey, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && typeof aistudio.openSelectKey === 'function') {
      try {
        setIsConnecting(true);
        await aistudio.openSelectKey();
        isManuallyConnected.current = true;
        setHasKey(true);
      } catch (err) { console.error(err); } finally { setIsConnecting(false); }
    } else {
      isManuallyConnected.current = true;
      setHasKey(true);
    }
  };

  const triggerKeyError = () => {
    isManuallyConnected.current = false;
    setHasKey(false);
  };

  useEffect(() => {
    const isAdminPath = location.pathname === '/congobaby1!1!' || window.location.hash.includes('/congobaby1!1!');
    if (isAdminPath) {
      setIsAdminMode(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, 'true');
    }
  }, [location.pathname]);

  const onExitAdmin = () => {
    setIsAdminMode(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
  };

  useEffect(() => {
    if (!isHydrated) return;
    const injectCode = (code: string | undefined, id: string, target: HTMLElement, position: 'start' | 'end') => {
      const existing = target.querySelectorAll(`[data-injected-id="${id}"]`);
      existing.forEach(el => el.remove());
      const container = document.getElementById(id);
      if (container) container.remove();

      if (code) {
        const range = document.createRange();
        const fragment = range.createContextualFragment(code);
        
        if (target === document.head) {
          Array.from(fragment.childNodes).forEach(node => {
            if (node instanceof HTMLElement) {
              node.setAttribute('data-injected-id', id);
              if (node.tagName === 'SCRIPT') {
                const s = document.createElement('script');
                Array.from(node.attributes).forEach(a => s.setAttribute(a.name, a.value));
                s.textContent = node.textContent;
                target.appendChild(s);
              } else { target.appendChild(node); }
            }
          });
        } else {
          const wrapper = document.createElement('div');
          wrapper.id = id;
          wrapper.appendChild(fragment);
          if (position === 'start') target.prepend(wrapper); else target.appendChild(wrapper);
          wrapper.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(a => newScript.setAttribute(a.name, a.value));
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode?.replaceChild(newScript, oldScript);
          });
        }
      }
    };

    injectCode(siteSettings.headerCode, 'custom-header-code', document.head, 'end');
    injectCode(siteSettings.bodyCode, 'custom-body-code', document.body, 'start');
    injectCode(siteSettings.footerCode, 'custom-footer-code', document.body, 'end');
  }, [isHydrated, siteSettings.headerCode, siteSettings.bodyCode, siteSettings.footerCode]);

  useEffect(() => {
    async function hydrate() {
      try {
        const [savedSettings, savedProducts] = await Promise.all([
          db.get<SiteSettings>(STORAGE_KEYS.SETTINGS),
          db.get<Product[]>(STORAGE_KEYS.PRODUCTS)
        ]);
        if (savedSettings) setSiteSettings(prev => ({ ...prev, ...savedSettings }));
        if (savedProducts) setProducts(savedProducts);
      } catch (e) { console.error(e); } finally { setIsHydrated(true); }
    }
    hydrate();
  }, []);

  const notify = (message: string, type: 'sale' | 'affiliate' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 5000);
  };

  useEffect(() => {
    if (isHydrated) {
      db.save(STORAGE_KEYS.SETTINGS, siteSettings);
      db.save(STORAGE_KEYS.PRODUCTS, products);
    }
  }, [siteSettings, products, isHydrated]);

  const [uploadModal, setUploadModal] = useState<{ isOpen: boolean; title: string; field?: keyof SiteSettings; productId?: ProductType; }>({ isOpen: false, title: '' });

  const handleMagicUpdate = async (context: string) => {
    try {
      const branding = await generateSiteBranding(context);
      const [imageUrl, whyUrl] = await Promise.all([generateAIImage(branding.imagePrompt), generateAIImage(branding.trustImagePrompt)]);
      setSiteSettings(prev => ({ ...prev, ...branding, heroImageUrl: imageUrl, whyChooseUsImageUrl: whyUrl }));
      return true;
    } catch (err: any) { console.error(err); return false; }
  };

  if (!isHydrated) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 className="w-12 h-12 text-red-600 animate-spin" /></div>;

  return (
    <NotificationContext.Provider value={{ notify }}>
      <KeyContext.Provider value={{ hasKey, triggerKeyError }}>
        <div className="min-h-screen relative">
          {!hasKey && (
            <div className="fixed inset-0 z-[200] bg-slate-950/98 backdrop-blur-3xl flex items-center justify-center p-6 text-center">
              <div className="max-w-md w-full dark-glass p-12 rounded-[40px] border-red-500/50 border">
                <div className="w-24 h-24 bg-red-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20"><Key className="w-12 h-12 text-red-500 animate-pulse" /></div>
                <h2 className="text-3xl font-extrabold mb-4 text-white">Unlock Pro Features</h2>
                <p className="text-slate-400 mb-6">Red Wire AI requires an **Authorized API Key** to power advanced models.</p>
                <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 mb-8 text-left flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                  <p className="text-xs text-red-200/80">Enable **Billing** at ai.google.dev to ensure seamless model access.</p>
                </div>
                <button onClick={handleOpenKey} disabled={isConnecting} className="w-full py-5 bg-red-600 rounded-2xl font-bold text-xl flex items-center justify-center disabled:opacity-50">
                  {isConnecting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Connect API Key"}
                </button>
              </div>
            </div>
          )}

          <Navbar settings={siteSettings} onLogoClick={isAdminMode ? () => setUploadModal({ isOpen: true, title: 'Update Logo', field: 'logoImageUrl' }) : undefined} isAdminMode={isAdminMode} onExitAdmin={onExitAdmin} />
          <div className="fixed top-24 right-6 z-[200] space-y-4 pointer-events-none">
            {notifications.map(n => (
              <div key={n.id} className="w-80 p-4 dark-glass border-red-500/30 rounded-2xl shadow-2xl flex items-start space-x-4 border pointer-events-auto">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'sale' ? 'bg-green-500/20 text-green-500' : 'bg-red-600/20 text-red-600'}`}>
                  {n.type === 'sale' ? <Bell className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div><p className="text-sm font-bold text-white">{n.message}</p></div>
              </div>
            ))}
          </div>

          <ImageUploadModal isOpen={uploadModal.isOpen} onClose={() => setUploadModal({ ...uploadModal, isOpen: false })} onSave={(url) => uploadModal.productId ? setProducts(p => p.map(x => x.id === uploadModal.productId ? { ...x, imageUrl: url } : x)) : setSiteSettings(s => ({ ...s, [uploadModal.field!]: url }))} title={uploadModal.title} currentValue={uploadModal.productId ? products.find(p => p.id === uploadModal.productId)?.imageUrl : siteSettings[uploadModal.field!]} />
          
          <main>
            <Routes>
              <Route path="/" element={<Home settings={siteSettings} onImageClick={isAdminMode ? (field) => setUploadModal({ isOpen: true, title: 'Update Image', field }) : undefined} />} />
              <Route path="/pricing" element={<Pricing products={products} settings={siteSettings} />} />
              <Route path="/checkout" element={<Checkout products={products} />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:id" element={<ProductDetail products={products} onImageClick={isAdminMode ? (id) => setUploadModal({ isOpen: true, title: 'Update Image', productId: id }) : undefined} settings={siteSettings} />} />
              <Route path="/affiliate" element={<AffiliateProgram settings={siteSettings} />} />
              <Route path="/contact" element={<Contact settings={siteSettings} />} />
              <Route path="/legal/:type" element={<Legal />} />
              <Route path="/congobaby1!1!" element={<AdminDashboard products={products} setProducts={setProducts} siteSettings={siteSettings} setSiteSettings={setSiteSettings} onMagicScan={handleMagicUpdate} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
          <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-slate-400">
              <div className="space-y-4">
                <BrandText name={siteSettings.siteName} logoUrl={siteSettings.logoImageUrl} />
                <p>Empowering small businesses with AI automation.</p>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-white">Products</h4>
                <ul className="space-y-2">
                  <li><Link to="/product/chatbot" className="hover:text-red-500">AI Chatbot</Link></li>
                  <li><Link to="/product/voicebot" className="hover:text-red-500">Website Voicebot</Link></li>
                  <li><Link to="/product/voice-agent" className="hover:text-red-500">AI Voice Agent</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-white">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/affiliate" className="hover:text-red-500">Affiliates</Link></li>
                  <li><Link to="/contact" className="hover:text-red-500">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4 text-white">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/legal/privacy" className="hover:text-red-500">Privacy Policy</Link></li>
                  <li><Link to="/legal/terms" className="hover:text-red-500">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </KeyContext.Provider>
    </NotificationContext.Provider>
  );
};

export default () => (
  <HashRouter>
    <ScrollToTop />
    <App />
  </HashRouter>
);
