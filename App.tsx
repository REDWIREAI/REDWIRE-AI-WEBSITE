import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Upload,
  Link as LinkIcon,
  ImageIcon,
  Lock,
  Sparkles,
  Loader2,
  Globe,
  ArrowUp,
  Trash2,
  Edit2,
  Bell,
  CheckCircle,
  MessageSquare,
  LogOut,
  ShieldCheck
} from 'lucide-react';

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
import Blog from './pages/Blog';
import Legal from './pages/Legal';

// Types & Data
import { User, SiteSettings, Product, ProductType } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { generateAIImage, generateSiteBranding } from './services/gemini';
import { db } from './services/db';

const STORAGE_KEYS = {
  SETTINGS: 'site_settings',
  PRODUCTS: 'products',
  ADMIN_TOKEN: 'rw_admin_active'
};

const GET_STARTED_URL = "https://api.leadconnectorhq.com/widget/form/BGm7Yk9CCULsw34XwYeM?notrack=true";

// Notification Context
interface Notification {
  id: string;
  type: 'sale' | 'affiliate' | 'info';
  message: string;
}

const NotificationContext = createContext({
  notify: (message: string, type: 'sale' | 'affiliate' | 'info' = 'info') => {}
});

export const useNotify = () => useContext(NotificationContext);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-[60] w-14 h-14 flex items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-900/40 transition-all duration-500 transform hover:bg-red-500 hover:scale-110 active:scale-95 border border-white/10 ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-50 pointer-events-none'
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="w-7 h-7" />
    </button>
  );
};

export const BrandText = ({ name, logoUrl, onLogoClick }: { name: string; logoUrl?: string; onLogoClick?: () => void }) => {
  const words = name.toUpperCase().split(' ');
  return (
    <div 
      className={`flex items-center space-x-3 relative ${onLogoClick ? 'group cursor-pointer' : ''}`} 
      onClick={() => onLogoClick?.()}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={name} className="h-10 w-auto object-contain transition-transform group-hover:scale-105" />
      ) : (
        <span className="text-2xl font-black tracking-tighter inline-flex items-center">
          {words.map((word, i) => (
            <span key={i} className={word === "RED" ? "text-red-600" : "text-white"}>
              {word}{i < words.length - 1 ? '\u00A0' : ''}
            </span>
          ))}
        </span>
      )}
      {onLogoClick && (
        <div className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 p-1 rounded-md">
          <Edit2 className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateAIImage(aiPrompt, false);
      onSave(imageUrl);
      onClose();
    } catch (err) {
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="dark-glass w-full max-w-lg rounded-[40px] p-8 border-slate-800 shadow-2xl scale-in-center">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-red-500" />
            {title}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
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
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all group cursor-pointer ${
                isDragging 
                ? 'border-red-500 bg-red-600/10 scale-[1.02]' 
                : 'border-slate-800 hover:border-red-500/50 hover:bg-red-500/5'
              }`}
            >
              <ImageIcon className={`w-12 h-12 mb-3 transition-colors ${isDragging ? 'text-red-500' : 'text-slate-600 group-hover:text-red-500'}`} />
              <span className={`text-sm font-bold transition-colors ${isDragging ? 'text-red-400' : 'text-slate-400'}`}>
                {isDragging ? 'Drop to Upload' : 'Drop image here or click'}
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
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-red-500 transition-all text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button 
                onClick={() => { onSave(url); onClose(); }}
                className="w-full mt-4 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold transition-all shadow-lg"
              >
                Apply URL
              </button>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                <label className="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2">Describe what you want to generate</label>
                <textarea 
                  placeholder="e.g. A futuristic robot helping customers, high tech, cinematic..." 
                  className="w-full bg-transparent outline-none text-sm resize-none min-h-[100px]"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAIGenerate}
                disabled={isGenerating || !aiPrompt}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-2xl font-bold transition-all shadow-xl shadow-red-900/20 disabled:opacity-50 flex items-center justify-center"
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
              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>Remove Image</span>
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
      <div className="max-w-7xl mx-auto flex items-center justify-between dark-glass rounded-2xl px-6 py-3 shadow-2xl shadow-black/50">
        <div className="flex items-center">
          <Link to="/">
            <BrandText name={settings.siteName} logoUrl={settings.logoImageUrl} onLogoClick={onLogoClick} />
          </Link>
          
          {isAdminMode && (
            <div className="ml-4 flex items-center bg-red-600/10 border border-red-600/20 rounded-full px-3 py-1 animate-admin-pulse">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500 mr-1.5" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Admin Mode Active</span>
            </div>
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <div className="group relative cursor-pointer hover:text-white py-2">
            Ecosystem
            <div className="absolute top-full left-0 pt-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto z-50">
              <div className="w-52 bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-2xl shadow-black/50">
                <Link to="/product/chatbot" className="block p-2 hover:bg-slate-800 rounded-lg">AI Chatbot</Link>
                <Link to="/product/voicebot" className="block p-2 hover:bg-slate-800 rounded-lg">Website Voicebot</Link>
                <Link to="/product/voice-agent" className="block p-2 hover:bg-slate-800 rounded-lg">AI Voice Agent</Link>
                <Link to="/product/smart-website" className="block p-2 hover:bg-slate-800 rounded-lg">Smart Websites</Link>
              </div>
            </div>
          </div>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/affiliate" className="hover:text-white transition-colors">Affiliates</Link>
          
          {isAdminMode ? (
            <div className="flex items-center space-x-3">
              <Link to="/congobaby1!1!" className="text-red-500 hover:text-red-400 font-bold">Dashboard</Link>
              <button 
                onClick={onExitAdmin}
                className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-black uppercase"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" /> Exit Admin
              </button>
            </div>
          ) : (
            <a 
              href={GET_STARTED_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
              className="px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-red-900/20"
            >
              Get Started
            </a>
          )}
        </div>
        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-24 left-6 right-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl z-40">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-lg">Home</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)} className="block text-lg">Pricing</Link>
          <Link to="/affiliate" onClick={() => setIsOpen(false)} className="block text-lg">Affiliates</Link>
          {isAdminMode && <Link to="/congobaby1!1!" onClick={() => setIsOpen(false)} className="block text-lg text-red-500">Admin Dashboard</Link>}
          <a 
            href={GET_STARTED_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)} 
            style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
            className="block py-3 text-center rounded-xl font-bold"
          >
            Get Started
          </a>
          {isAdminMode && (
            <button 
              onClick={() => { onExitAdmin(); setIsOpen(false); }}
              className="w-full py-3 bg-slate-800 rounded-xl font-bold text-sm"
            >
              Exit Admin Mode
            </button>
          )}
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

  // Robust Admin activation logic
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

  // Inject custom code into head and body
  useEffect(() => {
    if (!isHydrated) return;

    const injectCode = (code: string | undefined, id: string, target: HTMLElement, position: 'start' | 'end') => {
      let container = document.getElementById(id);
      if (!container) {
        container = document.createElement('div');
        container.id = id;
        container.style.display = 'none';
        if (position === 'start') {
          target.prepend(container);
        } else {
          target.appendChild(container);
        }
      }
      
      if (code) {
        container.innerHTML = '';
        const range = document.createRange();
        const documentFragment = range.createContextualFragment(code);
        container.appendChild(documentFragment);
        
        const scripts = container.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      } else {
        container.innerHTML = '';
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
      } catch (e) {
        console.error("Hydration failed", e);
      } finally {
        setIsHydrated(true);
      }
    }
    hydrate();
  }, []);

  const notify = (message: string, type: 'sale' | 'affiliate' | 'info' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  useEffect(() => {
    if (isHydrated) db.save(STORAGE_KEYS.SETTINGS, siteSettings);
  }, [siteSettings, isHydrated]);

  useEffect(() => {
    if (isHydrated) db.save(STORAGE_KEYS.PRODUCTS, products);
  }, [products, isHydrated]);

  const [uploadModal, setUploadModal] = useState<{ 
    isOpen: boolean; title: string; field?: keyof SiteSettings; productId?: ProductType;
  }>({ isOpen: false, title: '' });

  const handleAssetSave = (url: string) => {
    if (uploadModal.productId) {
      setProducts(prev => prev.map(p => p.id === uploadModal.productId ? { ...p, imageUrl: url } : p));
    } else if (uploadModal.field) {
      setSiteSettings(prev => ({ ...prev, [uploadModal.field!]: url }));
    }
  };

  const handleFullMagicUpdate = async (context: string) => {
    try {
      const branding = await generateSiteBranding(context);
      const imageUrl = await generateAIImage(branding.imagePrompt);
      const whyChooseUsImageUrl = await generateAIImage(branding.trustImagePrompt);
      
      setSiteSettings(prev => ({
        ...prev,
        siteName: branding.siteName,
        heroHeading: branding.heroHeading,
        heroSubheading: branding.heroSubheading,
        heroImageUrl: imageUrl,
        productsHeading: branding.productsHeading,
        productsSubheading: branding.productsSubheading,
        howItWorksHeading: branding.howItWorksHeading,
        howItWorksSubheading: branding.howItWorksSubheading,
        whyChooseUsHeading: branding.trustHeading,
        whyChooseUsImageUrl: whyChooseUsImageUrl,
        pricingHeading: branding.pricingHeading,
        pricingSubheading: branding.pricingSubheading,
        affiliateHeading: branding.affiliateHeading,
        affiliateSubheading: branding.affiliateSubheading,
        contactHeading: branding.contactHeading,
        contactSubheading: branding.contactSubheading
      }));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  if (!isHydrated) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
    </div>
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      <div className="min-h-screen relative">
        <Navbar 
          settings={siteSettings} 
          onLogoClick={isAdminMode ? () => setUploadModal({ isOpen: true, title: 'Update Logo', field: 'logoImageUrl' }) : undefined} 
          isAdminMode={isAdminMode}
          onExitAdmin={onExitAdmin}
        />
        
        {/* Notification Overlay */}
        <div className="fixed top-24 right-6 z-[200] space-y-4 pointer-events-none">
          {notifications.map((n) => (
            <div key={n.id} className="w-80 p-4 dark-glass border-red-500/30 rounded-2xl shadow-2xl animate-in slide-in-from-right-8 duration-300 pointer-events-auto flex items-start space-x-4 border">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'sale' ? 'bg-green-500/20 text-green-500' : n.type === 'affiliate' ? 'bg-red-600/20 text-red-600' : 'bg-blue-500/20 text-blue-500'}`}>
                {n.type === 'sale' ? <Bell className="w-5 h-5" /> : n.type === 'affiliate' ? <MessageSquare className="w-5 h-5" /> : <Loader2 className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Text Notification Sent</div>
                <p className="text-sm font-bold text-white leading-tight">{n.message}</p>
              </div>
            </div>
          ))}
        </div>

        <ImageUploadModal 
          isOpen={uploadModal.isOpen} onClose={() => setUploadModal({ ...uploadModal, isOpen: false })} 
          onSave={handleAssetSave} title={uploadModal.title} currentValue={uploadModal.productId ? products.find(p => p.id === uploadModal.productId)?.imageUrl : siteSettings[uploadModal.field!]}
        />
        <main>
          <Routes>
            <Route path="/" element={<Home settings={siteSettings} onImageClick={isAdminMode ? (field) => setUploadModal({ isOpen: true, title: 'Update Image', field }) : undefined} />} />
            <Route path="/pricing" element={<Pricing products={products} settings={siteSettings} />} />
            <Route path="/checkout" element={<Checkout products={products} />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail products={products} onImageClick={isAdminMode ? (id) => setUploadModal({ isOpen: true, title: 'Update Product Image', productId: id }) : undefined} settings={siteSettings} />} />
            <Route path="/affiliate" element={<AffiliateProgram settings={siteSettings} />} />
            <Route path="/contact" element={<Contact settings={siteSettings} />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/legal/:type" element={<Legal />} />
            <Route path="/congobaby1!1!" element={
              <AdminDashboard 
                products={products} 
                setProducts={setProducts} 
                siteSettings={siteSettings} 
                setSiteSettings={setSiteSettings} 
                onMagicScan={handleFullMagicUpdate} 
              />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-slate-400">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-white">
                <BrandText name={siteSettings.siteName} logoUrl={siteSettings.logoImageUrl} />
              </div>
              <p>Empowering small businesses with AI automation.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Products</h4>
              <ul className="space-y-2">
                <li><Link to="/product/chatbot" className="hover:text-red-500 transition-colors">AI Chatbot</Link></li>
                <li><Link to="/product/voicebot" className="hover:text-red-500 transition-colors">Website Voicebot</Link></li>
                <li><Link to="/product/voice-agent" className="hover:text-red-500 transition-colors">AI Voice Agent</Link></li>
                <li><Link to="/product/smart-website" className="hover:text-red-500 transition-colors">Smart Website</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/affiliate" className="hover:text-red-500 transition-colors">Affiliates</Link></li>
                <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-red-500 transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/legal/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/legal/terms" className="hover:text-red-500 transition-colors">Terms of Service</Link></li>
                <li><Link to="/legal/affiliate-terms" className="hover:text-red-500 transition-colors">Affiliate Terms</Link></li>
                <li><Link to="/legal/cookie" className="hover:text-red-500 transition-colors">Cookie Policy</Link></li>
                <li><Link to="/legal/disclaimer" className="hover:text-red-500 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
        </footer>
        <BackToTopButton />
      </div>
    </main>
  );
};

// Simplified entry to handle routing context correctly
const RootApp = () => (
  <HashRouter>
    <ScrollToTop />
    <App />
  </HashRouter>
);

export default RootApp;