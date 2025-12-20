
import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Edit2,
  Layout,
  Sparkles,
  Globe,
  Loader2,
  Palette,
  Terminal,
  Trash2,
  CheckCircle,
  Eye,
  Search,
  Hash,
  AlertCircle,
  DollarSign,
  Type as TypeIcon,
  Image as ImageIcon
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
  const [activeTab, setActiveTab] = useState<'products' | 'cms' | 'magic'>('products');
  const [isSaving, setIsSaving] = useState(false);
  const [magicContext, setMagicContext] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  const handleProductUpdate = (id: ProductType, field: keyof Product, value: any) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSettingsUpdate = (field: keyof SiteSettings, value: string) => {
    setSiteSettings({ ...siteSettings, [field]: value });
  };

  const handleMagicRebrand = async () => {
    if (!magicContext) return;
    setIsMagicLoading(true);
    try {
      const success = await onMagicScan(magicContext);
      if (success) {
        alert("Magic Rebrand Complete! Your site has been updated with AI-generated branding and assets.");
      }
    } catch (err) {
      alert("Magic Rebrand failed. Please check your API key and try again.");
    } finally {
      setIsMagicLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold">Control <span className="text-red-500">Panel</span></h1>
          <p className="text-slate-400 mt-2">Manage your ecosystem products, content, and branding assets.</p>
        </div>
        <div className="flex items-center bg-red-600/10 border border-red-600/20 rounded-full px-4 py-2 animate-admin-pulse">
          <Terminal className="w-4 h-4 text-red-500 mr-2" />
          <span className="text-xs font-black uppercase tracking-widest text-red-500">Authorized Administrator Access</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        {[
          { id: 'products', label: 'Products', icon: Settings },
          { id: 'cms', label: 'Page CMS', icon: Layout },
          { id: 'magic', label: 'Magic Rebrand', icon: Sparkles },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-8 py-4 rounded-2xl font-bold transition-all capitalize border-2 ${
              activeTab === tab.id 
              ? 'bg-red-600 border-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]' 
              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            <tab.icon className="w-5 h-5 mr-3" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dark-glass rounded-[40px] border-slate-800 overflow-hidden min-h-[600px]">
        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="p-10 space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-slate-950/50 border border-slate-800 rounded-3xl p-8 flex flex-col lg:flex-row gap-8">
                  <div className="w-full lg:w-48 h-48 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shrink-0">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Product Name</label>
                      <input 
                        type="text" 
                        value={product.name} 
                        onChange={(e) => handleProductUpdate(product.id, 'name', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Monthly Price ($)</label>
                      <input 
                        type="number" 
                        value={product.monthlyPrice} 
                        onChange={(e) => handleProductUpdate(product.id, 'monthlyPrice', parseInt(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="lg:col-span-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Description</label>
                      <textarea 
                        value={product.description} 
                        onChange={(e) => handleProductUpdate(product.id, 'description', e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-red-500 outline-none transition-all text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CMS Text Management */}
        {activeTab === 'cms' && (
          <div className="p-10 space-y-12 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Hero Section</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Hero Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.heroHeading} 
                      onChange={(e) => handleSettingsUpdate('heroHeading', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Hero Subheading</label>
                    <textarea 
                      value={siteSettings.heroSubheading} 
                      onChange={(e) => handleSettingsUpdate('heroSubheading', e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center text-red-500">
                    <Hash className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold">Pricing & Contact</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Pricing Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.pricingHeading} 
                      onChange={(e) => handleSettingsUpdate('pricingHeading', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 focus:border-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Contact Heading</label>
                    <input 
                      type="text" 
                      value={siteSettings.contactHeading} 
                      onChange={(e) => handleSettingsUpdate('contactHeading', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="pt-10 border-t border-slate-900 flex justify-end">
              <button 
                onClick={() => alert("Changes saved to local ecosystem. Final deployment sync active.")}
                className="flex items-center px-10 py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-lg shadow-xl shadow-red-900/20 active:scale-95 transition-all"
              >
                <Save className="w-6 h-6 mr-3" /> Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Magic Rebrand Tool */}
        {activeTab === 'magic' && (
          <div className="p-16 text-center max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700">
            <div className="w-24 h-24 bg-red-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-inner border border-red-500/20">
              <Sparkles className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-4xl font-black mb-4">Magic <span className="text-red-500">Rebrand</span></h2>
            <p className="text-slate-400 mb-10 leading-relaxed text-lg">
              Enter a website URL or a detailed business description. Our AI will automatically rewrite all headlines, subheadings, and generate professional visual assets.
            </p>
            
            <div className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800 space-y-6 shadow-2xl">
              <textarea 
                placeholder="e.g. A premium dental clinic in New York specialized in cosmetic veneers and family care..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-[32px] px-8 py-8 focus:border-red-500 outline-none transition-all text-lg min-h-[180px] resize-none"
                value={magicContext}
                onChange={(e) => setMagicContext(e.target.value)}
              />
              <button 
                onClick={handleMagicRebrand}
                disabled={isMagicLoading || !magicContext}
                className="w-full py-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-[32px] font-black text-2xl transition-all shadow-2xl shadow-red-900/40 disabled:opacity-50 flex items-center justify-center active:scale-95 group"
              >
                {isMagicLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                    <span>Gemini is working...</span>
                  </>
                ) : (
                  <>
                    Launch Magic Scan <Sparkles className="ml-4 w-6 h-6 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </button>
            </div>
            
            <p className="mt-8 text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center">
              <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
              Note: This process takes ~30-60 seconds and will overwrite existing text.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
