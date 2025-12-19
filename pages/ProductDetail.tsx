import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bot, Mic, PhoneCall, Globe, CheckCircle2, Zap, ArrowRight, ShieldCheck, Edit3, ImageOff } from 'lucide-react';
import { Product, ProductType, SiteSettings } from '../types';

interface ProductDetailProps {
  products: Product[];
  onImageClick?: (productId: ProductType) => void;
  settings: SiteSettings;
}

const ProductDetail = ({ products, onImageClick, settings }: ProductDetailProps) => {
  const { id } = useParams<{ id: string }>();
  
  // Map ID to correct ProductType or default
  const productId = id?.replace('-', '_') as ProductType;
  const product = products.find(p => p.id === productId) || products[0];

  const getIcon = () => {
    switch (product.id) {
      case ProductType.CHATBOT: return Bot;
      case ProductType.VOICEBOT: return Mic;
      case ProductType.VOICE_AGENT: return PhoneCall;
      case ProductType.SMART_WEBSITE: return Globe;
      default: return Zap;
    }
  };

  const Icon = getIcon();

  const getDemoUrl = () => {
    if (product.id === ProductType.CHATBOT) {
      return "https://app.gohighlevel.com/v2/preview/E4AdV588KX2lRl90mzCG?notrack=true";
    }
    if (product.id === ProductType.SMART_WEBSITE) {
      return "https://app.gohighlevel.com/v2/preview/kM5rp30Ez9uqPn5vNvXu?notrack=true";
    }
    if (product.id === ProductType.VOICEBOT) {
      return "https://app.gohighlevel.com/v2/preview/FkugN7i7G4owOFWswb4P?notrack=true";
    }
    if (product.id === ProductType.VOICE_AGENT) {
      return "tel:+18563281760";
    }
    return null;
  };

  const demoUrl = getDemoUrl();
  const isPhoneDemo = product.id === ProductType.VOICE_AGENT;
  const isSmartWebsite = product.id === ProductType.SMART_WEBSITE;

  return (
    <div className="pt-32 pb-24">
      <section className="px-6 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-red-900/5">
              <Icon className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">{product.name}</h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              {product.description} Built on cutting-edge LLM technology and integrated directly with your sales pipeline.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to={`/checkout?plan=${product.id}`} 
                style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
                className="px-8 py-4 rounded-2xl font-bold shadow-xl transition-all"
              >
                Buy Now
              </Link>
              {demoUrl ? (
                <a 
                  href={demoUrl} 
                  target={isPhoneDemo ? "_self" : "_blank"}
                  rel="noopener noreferrer" 
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all text-center"
                >
                  {isPhoneDemo ? 'Call to Demo' : 'Demo it Here'}
                  {(isPhoneDemo || !isSmartWebsite) && (
                    <>
                      <br/>
                      <span className="text-[10px] opacity-70">
                        {isPhoneDemo ? '(+1 856-328-1760)' : '(click Blue icon lower right)'}
                      </span>
                    </>
                  )}
                </a>
              ) : (
                <Link to="/contact" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all">
                  Demo it Here
                </Link>
              )}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full -z-10 group-hover:bg-red-600/30 transition-colors"></div>
            <div className="relative rounded-[40px] overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-900 shadow-2xl">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-50" 
                />
              ) : (
                <div className="flex flex-col items-center text-slate-700">
                  <ImageOff className="w-20 h-20 mb-4" />
                  <p className="font-bold text-lg">No Product Image</p>
                </div>
              )}
              
              {onImageClick && (
                <div 
                  onClick={() => onImageClick(product.id)}
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm bg-black/40"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Edit3 className="w-8 h-8 text-white" />
                  </div>
                  <span className="mt-4 text-white font-bold text-lg">Update Product Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900/50 py-24 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
            <p className="text-slate-500">Enterprise features for small business prices.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.features.map((f, i) => (
              <div key={i} className="p-8 dark-glass rounded-3xl border border-slate-800 hover:border-red-500/30 transition-all">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{f}</h3>
                <p className="text-slate-400 text-sm">Automated sync with GoHighLevel CRM and Stripe billing systems included natively.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <div className="max-w-2xl mx-auto p-12 dark-glass border-slate-800 rounded-[48px]">
          <h2 className="text-3xl font-bold mb-4">Ready to Automate?</h2>
          <div className="text-4xl font-extrabold mb-2">${product.monthlyPrice}/mo</div>
          <p className="text-slate-500 mb-8">+ ${product.setupFee} one-time implementation fee</p>
          <Link 
            to={`/checkout?plan=${product.id}`} 
            style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
            className="inline-flex items-center px-10 py-5 rounded-3xl font-bold text-xl shadow-2xl"
          >
            Buy Now <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <div className="mt-8 flex items-center justify-center space-x-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> Secure SSL</span>
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> Stripe Verified</span>
            <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-green-500" /> 24/7 Support</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;