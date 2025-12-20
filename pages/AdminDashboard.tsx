
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Layout, 
  Sparkles, 
  Loader2, 
  Globe, 
  Hash, 
  Terminal, 
  Type, 
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Zap,
  Code
} from 'lucide-react';
import { Product, SiteSettings, ProductType } from '../types';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  onMagicScan: (context: string) => Promise<boolean>;
}

const AdminDashboard: React.FC<AdminProps> = ({ products, setProducts, siteSettings, setSiteSettings, onMagicScan }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'cms' | 'code' | 'magic'>('products');
  const [magicContext, setMagicContext] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleProductUpdate = (id: ProductType, field: keyof Product, value: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSettingsUpdate = (field: keyof SiteSettings, value: string) => {
    setSiteSettings({ ...siteSettings, [field]: value });
  };

  const handleSave = () => {
    setSaveStatus('saving');
    // Simulate sync
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1500);
  };

  const handleMagicRebrand = async () => {
    if (!magicContext) return;
    setIsMagicLoading(true);
    try {
      const success = await onMagicScan(magicContext);
      if (success) {
        alert("Magic Rebrand Complete! Your site has been updated with AI-generated branding.");
      }
    } catch (err) {
      alert("Magic Rebrand failed. Please check your API key.");
    } finally {
      setIsMagicLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center">
            Control <span className="text-red-500 ml-2">Panel</span>
          </h1>
          <p className="text-slate-400 mt-2">Authorized ecosystem management.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2">
            <Terminal className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Secure Admin Instance</span>
          </div>
          <button 
            onClick={handleSave}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${
              saveStatus === 'saved' ? 'bg-green-600' : 'bg-red-600 hover:bg-red-500'
            } text-white shadow-lg`}
          >
            {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : saveStatus === 'saved' ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'Changes Saved' : 'Deploy Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {[
          { id: 'products', label: 'Products', icon: Settings },
          { id: 'cms', label: 'Page CMS', icon: Layout },
          { id: 'code', label: 'Code Injection', icon: Code },
          { id: 'magic', label: 'Magic Rebrand', icon: Sparkles },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all border-2 ${
              activeTab === tab.id 
              ? 'bg-red-600 border-red-600 text-white shadow-lg' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] overflow-hidden">
        {activeTab === 'products' && (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-950/50 border border-slate-800 p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                  <div className="aspect-square bg-slate-900 rounded-2xl overflow-hidden mb-4 border border-slate-800">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
                    ID: {product.id}
                  </div>
                </div>
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Display Name</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input 
                        type="text" 
                        value={product.name} 
                        onChange={(e) => handleProductUpdate(product.id, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Monthly Price ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input 
                        type="number" 
                        value={product.monthlyPrice} 
                        onChange={(e) => handleProductUpdate(product.id, 'monthlyPrice', parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Setup Fee ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      <input 
                        type="number" 
                        value={product.setupFee} 
                        onChange={(e) => handleProductUpdate(product.id, 'setupFee', parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Description</label>
                    <textarea 
                      value={product.description} 
                      onChange={(e) => handleProductUpdate(product.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 outline-none focus:border-red-500 transition-all text-sm leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="p-8 space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center border-b border-slate-800 pb-4">
                  <Globe className="w-5 h-5 mr-3 text-red-500" /> Hero Branding
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Site Name</label>
                    <input 
                      type="text" 
                      value={siteSettings.siteName} 
                      onChange={(e) => handleSettingsUpdate('siteName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Hero Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.heroHeading} 
                      onChange={(e) => handleSettingsUpdate('heroHeading', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Hero Subheading</label>
                    <textarea 
                      value={siteSettings.heroSubheading} 
                      onChange={(e) => handleSettingsUpdate('heroSubheading', e.target.value)}
                      rows={4}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-red-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center border-b border-slate-800 pb-4">
                  <Hash className="w-5 h-5 mr-3 text-red-500" /> Page Headings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Products Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.productsHeading} 
                      onChange={(e) => handleSettingsUpdate('productsHeading', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Pricing Subheading</label>
                    <input 
                      type="text" 
                      value={siteSettings.pricingSubheading} 
                      onChange={(e) => handleSettingsUpdate('pricingSubheading', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Contact Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.contactHeading} 
                      onChange={(e) => handleSettingsUpdate('contactHeading', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="p-10 space-y-10 animate-in fade-in duration-500">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Custom Code Injection</h3>
                <p className="text-sm text-slate-500">Add tracking scripts, custom styles, or widgets to your ecosystem.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block flex items-center">
                  Header Scripts <span className="ml-2 text-[10px] font-normal text-slate-600">(Inside &lt;head&gt; tag)</span>
                </label>
                <textarea 
                  value={siteSettings.headerCode} 
                  onChange={(e) => handleSettingsUpdate('headerCode', e.target.value)}
                  rows={8}
                  placeholder="<!-- Paste Google Analytics, Meta Pixel, or CSS here -->"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 focus:border-red-500 outline-none text-[13px] font-mono leading-relaxed shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block flex items-center">
                  Body Start Scripts <span className="ml-2 text-[10px] font-normal text-slate-600">(Immediately after &lt;body&gt; opens)</span>
                </label>
                <textarea 
                  value={siteSettings.bodyCode} 
                  onChange={(e) => handleSettingsUpdate('bodyCode', e.target.value)}
                  rows={8}
                  placeholder="<!-- Paste GTM Noscript or welcome banners here -->"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 focus:border-red-500 outline-none text-[13px] font-mono leading-relaxed shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 block flex items-center">
                  Footer Scripts <span className="ml-2 text-[10px] font-normal text-slate-600">(Before &lt;/body&gt; closes)</span>
                </label>
                <textarea 
                  value={siteSettings.footerCode} 
                  onChange={(e) => handleSettingsUpdate('footerCode', e.target.value)}
                  rows={8}
                  placeholder="<!-- Paste Chat Widgets or tracking pixels here -->"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 focus:border-red-500 outline-none text-[13px] font-mono leading-relaxed shadow-inner"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'magic' && (
          <div className="p-16 text-center max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700">
            <div className="w-20 h-20 bg-red-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-red-500/20">
              <Sparkles className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-4xl font-black mb-4">Magic Rebrand Engine</h2>
            <p className="text-slate-400 mb-10 leading-relaxed text-lg">
              Input a business URL or a description of your client's business. Gemini will completely rewrite the site's branding and copy to match.
            </p>
            
            <div className="space-y-6">
              <textarea 
                placeholder="e.g. A high-end luxury real estate agency in Miami specializing in waterfront condos..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 focus:border-red-500 outline-none transition-all text-lg min-h-[160px] resize-none"
                value={magicContext}
                onChange={(e) => setMagicContext(e.target.value)}
              />
              <button 
                onClick={handleMagicRebrand}
                disabled={isMagicLoading || !magicContext}
                className="w-full py-6 bg-gradient-to-r from-red-600 to-red-900 hover:from-red-500 hover:to-red-800 rounded-3xl font-black text-2xl transition-all shadow-2xl shadow-red-900/40 disabled:opacity-50 flex items-center justify-center active:scale-95"
              >
                {isMagicLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    Run Magic Scan <Zap className="ml-4 w-6 h-6" />
                  </>
                )}
              </button>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                This process takes ~30 seconds and will rewrite your site copy.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
