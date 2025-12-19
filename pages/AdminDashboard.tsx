
import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  PieChart, 
  Save, 
  AlertCircle,
  RefreshCw,
  Edit2,
  Image as ImageIcon,
  Type as TypeIcon,
  Layout,
  Sparkles,
  Globe,
  Loader2,
  FileText,
  X,
  Palette,
  MousePointer2
} from 'lucide-react';
import { Product, SiteSettings } from '../types';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  onMagicScan: (context: string) => Promise<boolean>;
}

const AdminDashboard: React.FC<AdminProps> = ({ products, setProducts, siteSettings, setSiteSettings, onMagicScan }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [activeTab, setActiveTab] = useState<'products' | 'cms' | 'magic'>('products');
  const [cmsPage, setCmsPage] = useState<'home' | 'branding' | 'pricing' | 'affiliate' | 'contact'>('home');
  
  const [brandingForm, setBrandingForm] = useState<SiteSettings>(siteSettings);
  const [magicUrl, setMagicUrl] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

  useEffect(() => {
    setBrandingForm(siteSettings);
  }, [siteSettings]);

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditForm(p);
  };

  const saveProduct = () => {
    setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p));
    setEditingId(null);
  };

  const saveBranding = () => {
    setSiteSettings(brandingForm);
    alert("Site content updated successfully!");
  };

  const runMagicScan = async () => {
    if (!magicUrl) return;
    setIsMagicLoading(true);
    const success = await onMagicScan(magicUrl);
    setIsMagicLoading(false);
    if (success) {
      alert("Magic AI has successfully rebranded your site!");
    } else {
      alert("Magic AI scan failed. Please try again.");
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Global <span className="text-red-500">Admin</span> Control</h1>
          <p className="text-slate-400">Manage pricing, content, and visuals from one console.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'products', label: 'Products', icon: Settings },
          { id: 'cms', label: 'Page CMS', icon: Layout },
          { id: 'magic', label: 'Magic AI', icon: Sparkles },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all capitalize ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'products' && (
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center">
              <Settings className="w-6 h-6 mr-3 text-red-500" />
              Manage Ecosystem Products
            </h3>
          </div>
          <div className="p-8 space-y-4">
            {products.map(p => (
              <div key={p.id} className="p-6 bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-lg font-bold">{p.name}</div>
                    <div className="text-sm text-slate-500">${p.monthlyPrice}/mo + ${p.setupFee} setup</div>
                  </div>
                </div>
                <button onClick={() => startEdit(p)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cms' && (
        <div className="space-y-8">
          <div className="flex flex-wrap bg-slate-900 p-1 rounded-2xl w-fit border border-slate-800">
            {['home', 'branding', 'pricing', 'affiliate', 'contact'].map(p => (
              <button 
                key={p} 
                onClick={() => setCmsPage(p as any)}
                className={`px-6 py-2 rounded-xl text-xs font-bold capitalize transition-all ${cmsPage === p ? 'bg-red-600 text-white' : 'text-slate-500'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {cmsPage === 'home' && (
                <>
                  <div className="space-y-6">
                    <h4 className="font-bold flex items-center text-red-500">
                      <Layout className="w-4 h-4 mr-2" />
                      Hero Section
                    </h4>
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Heading</label>
                      <textarea value={brandingForm.heroHeading} onChange={e => setBrandingForm({...brandingForm, heroHeading: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm min-h-[80px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Button Text</label>
                        <input value={brandingForm.heroButtonText} onChange={e => setBrandingForm({...brandingForm, heroButtonText: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Button Link</label>
                        <input value={brandingForm.heroButtonLink} onChange={e => setBrandingForm({...brandingForm, heroButtonLink: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="font-bold flex items-center text-red-500">
                      <Layout className="w-4 h-4 mr-2" />
                      Trust Section
                    </h4>
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Heading</label>
                      <textarea value={brandingForm.whyChooseUsHeading} onChange={e => setBrandingForm({...brandingForm, whyChooseUsHeading: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm min-h-[80px]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Button Text</label>
                        <input value={brandingForm.whyChooseUsButtonText} onChange={e => setBrandingForm({...brandingForm, whyChooseUsButtonText: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Button Link</label>
                        <input value={brandingForm.whyChooseUsButtonLink} onChange={e => setBrandingForm({...brandingForm, whyChooseUsButtonLink: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {cmsPage === 'branding' && (
                <>
                  <div className="space-y-6">
                    <h4 className="font-bold flex items-center text-red-500">
                      <TypeIcon className="w-4 h-4 mr-2" />
                      Identity
                    </h4>
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Site Name</label>
                      <input value={brandingForm.siteName} onChange={e => setBrandingForm({...brandingForm, siteName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Logo Image URL</label>
                      <input 
                        value={brandingForm.logoImageUrl || ''} 
                        onChange={e => setBrandingForm({...brandingForm, logoImageUrl: e.target.value})} 
                        className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-sm font-mono"
                        placeholder="Paste image URL or Base64..."
                      />
                      <p className="text-[10px] text-slate-500 uppercase font-black">Note: Leave empty to use text logo</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bold flex items-center text-red-500">
                      <Palette className="w-4 h-4 mr-2" />
                      Global Styling
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Button Color</label>
                        <div className="flex items-center space-x-2">
                          <input type="color" value={brandingForm.primaryButtonColor} onChange={e => setBrandingForm({...brandingForm, primaryButtonColor: e.target.value})} className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer" />
                          <input type="text" value={brandingForm.primaryButtonColor} onChange={e => setBrandingForm({...brandingForm, primaryButtonColor: e.target.value})} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-mono" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Button Text Color</label>
                        <div className="flex items-center space-x-2">
                          <input type="color" value={brandingForm.primaryButtonTextColor} onChange={e => setBrandingForm({...brandingForm, primaryButtonTextColor: e.target.value})} className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden cursor-pointer" />
                          <input type="text" value={brandingForm.primaryButtonTextColor} onChange={e => setBrandingForm({...brandingForm, primaryButtonTextColor: e.target.value})} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl text-sm font-mono" />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button onClick={saveBranding} className="mt-8 px-10 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold flex items-center shadow-xl shadow-red-900/20">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'magic' && (
        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-12 shadow-2xl text-center">
          <div className="max-w-xl mx-auto">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Sparkles className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Magic Site Rebrander</h2>
            <p className="text-slate-400 mb-10 leading-relaxed">Enter a business URL or a detailed description. Gemini will automatically generate professional copy and cinematic imagery for the entire site.</p>
            
            <div className="relative mb-6">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                value={magicUrl}
                onChange={e => setMagicUrl(e.target.value)}
                placeholder="https://acme-services.com or 'Futuristic Car Wash'..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-12 pr-4 outline-none focus:border-red-500 transition-all text-sm" 
              />
            </div>
            <button 
              onClick={runMagicScan}
              disabled={isMagicLoading || !magicUrl}
              className="w-full py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 rounded-2xl font-bold text-xl shadow-2xl shadow-red-900/40 disabled:opacity-50 flex items-center justify-center transition-all"
            >
              {isMagicLoading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Sparkles className="w-6 h-6 mr-2" />}
              {isMagicLoading ? 'Analyzing & Generating...' : 'Start Magic Rebrand'}
            </button>
          </div>
        </div>
      )}

      {editingId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
          <div className="dark-glass w-full max-w-lg rounded-[40px] p-8 border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Edit {editForm.name}</h3>
              <button onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Image URL / Data</label>
                <textarea 
                  value={editForm.imageUrl || ''} 
                  onChange={e => setEditForm({...editForm, imageUrl: e.target.value})} 
                  className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono h-24" 
                  placeholder="Paste URL or Base64..." 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Monthly Price</label>
                  <input 
                    type="number"
                    value={editForm.monthlyPrice || 0} 
                    onChange={e => setEditForm({...editForm, monthlyPrice: Number(e.target.value)})} 
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Setup Fee</label>
                  <input 
                    type="number"
                    value={editForm.setupFee || 0} 
                    onChange={e => setEditForm({...editForm, setupFee: Number(e.target.value)})} 
                    className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl text-sm" 
                  />
                </div>
              </div>
              <button onClick={saveProduct} className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold shadow-xl shadow-red-900/20">
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
