
import React, { useState, useEffect } from 'react';
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
  AlertCircle
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
  const [activeTab, setActiveTab] = useState<'products' | 'cms' | 'magic'>('products');

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold">Control <span className="text-red-500">Panel</span></h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'products', label: 'Products', icon: Settings },
          { id: 'cms', label: 'Page CMS', icon: Layout },
          { id: 'magic', label: 'Magic Rebrand', icon: Sparkles },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all capitalize ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'}`}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-[40px] p-20 text-center text-slate-500 italic">
        <div className="max-w-md mx-auto">
          <Settings className="w-12 h-12 mx-auto mb-6 opacity-10" />
          <h4 className="text-lg font-bold text-slate-400 mb-2">Management Panel</h4>
          <p className="text-sm">Configuration settings for {activeTab} are currently being migrated to the unified AI dashboard. Use the CMS for real-time page updates.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
