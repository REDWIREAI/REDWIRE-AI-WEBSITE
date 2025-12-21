import React, { useState, useRef, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { 
  Loader2, 
  Key, 
  AlertCircle, 
  Bell, 
  MessageSquare 
} from 'lucide-react';

// Shared Utilities & Components
import { Notification, NotificationContext, KeyContext, useKeyStatus, BrandText } from './shared';
import { Navbar, ImageUploadModal } from './components/UI';

// Pages
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Onboarding from './pages/Onboarding';
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
        if (savedProducts) setProducts(savedProducts || INITIAL_PRODUCTS);
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
                <p className="text-slate-400 mb-6 font-medium">Red Wire AI requires an Authorized API Key to power the automation ecosystem.</p>
                <div className="bg-red-600/10 border border-red-600/20 rounded-2xl p-4 mb-8 text-left flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                  <p className="text-xs text-red-200/80 font-bold">Enable Billing at ai.google.dev to ensure seamless model access.</p>
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
        </div>
      </KeyContext.Provider>
    </NotificationContext.Provider>
  );
};

const RedWireApp = () => (
  <HashRouter>
    <ScrollToTop />
    <App />
  </HashRouter>
);

export default RedWireApp;