
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
  FileText,
  X,
  Palette,
  Terminal,
  Trash2,
  CheckCircle,
  Eye,
  Search,
  Hash,
  AlertCircle
} from 'lucide-react';
import { Product, SiteSettings, BlogPost } from '../types';
import { generateBlogContent, generateAIImage } from '../services/gemini';
import { useKeyStatus } from '../App';

interface AdminProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  onMagicScan: (context: string) => Promise<boolean>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const AdminDashboard: React.FC<AdminProps> = ({ products, setProducts, siteSettings, setSiteSettings, onMagicScan, blogs, setBlogs }) => {
  const [activeTab, setActiveTab] = useState<'products' | 'cms' | 'blogs' | 'magic'>('products');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const { triggerKeyError } = useKeyStatus();

  const handleGenerateBlog = async () => {
    setIsGeneratingBlog(true);
    try {
      const blogData = await generateBlogContent(siteSettings, products);
      const imageUrl = await generateAIImage(blogData.imagePrompt, false);
      
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title: blogData.title,
        excerpt: blogData.excerpt,
        content: blogData.content,
        metaDescription: blogData.metaDescription || '',
        keywords: blogData.keywords || [],
        readTime: blogData.readTime || '5 min read',
        status: 'draft',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        img: imageUrl
      };
      
      setBlogs(prev => [newPost, ...prev]);
    } catch (err: any) {
      console.error("Blog Generation Failed:", err);
      // Catch environment/key errors and trigger the overlay
      if (err.message === "API_KEY_MISSING" || (err.message && err.message.includes("Key must be set"))) {
        triggerKeyError();
      } else {
        alert("Blog Generation Failed: " + (err.message || "Unknown error. Check console."));
      }
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  const togglePublish = (id: string) => {
    setBlogs(prev => prev.map(b => b.id === id ? { ...b, status: b.status === 'draft' ? 'published' : 'draft' } : b));
  };

  const deleteBlog = (id: string) => {
    if (window.confirm("Are you sure? This action is permanent.")) {
      setBlogs(prev => prev.filter(b => b.id !== id));
    }
  };

  const saveEditedPost = () => {
    if (!editingPost) return;
    setBlogs(prev => prev.map(b => b.id === editingPost.id ? editingPost : b));
    setEditingPost(null);
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-extrabold">Control <span className="text-red-500">Panel</span></h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {[
          { id: 'products', label: 'Products', icon: Settings },
          { id: 'cms', label: 'Page CMS', icon: Layout },
          { id: 'blogs', label: 'SEO Blog Engine', icon: FileText },
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

      {activeTab === 'blogs' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Sparkles className="w-48 h-48 text-red-500" />
            </div>
            <div className="max-w-lg relative z-10">
              <h3 className="text-2xl font-bold mb-2">AI-Driven SEO Content</h3>
              <p className="text-slate-400 text-sm">Gemini 3 Pro will analyze your site and products to write high-quality, structured articles with metadata and custom illustrations.</p>
            </div>
            <button 
              onClick={handleGenerateBlog}
              disabled={isGeneratingBlog}
              className="relative z-10 px-8 py-5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl font-bold flex items-center shadow-xl disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {isGeneratingBlog ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
              {isGeneratingBlog ? 'Writing SEO Draft...' : 'Generate New Blog'}
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Content Inventory</h3>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-black uppercase rounded-full border border-green-500/20">
                  {blogs.filter(b => b.status === 'published').length} Published
                </span>
                <span className="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-[10px] font-black uppercase rounded-full border border-yellow-500/20">
                  {blogs.filter(b => b.status === 'draft').length} Drafts
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {blogs.map(blog => (
                <div key={blog.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-slate-700 transition-all">
                  <div className="flex items-center space-x-4 overflow-hidden">
                    <div className="relative shrink-0">
                      <img src={blog.img} className="w-16 h-12 object-cover rounded-lg border border-slate-800" alt="" />
                      <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-slate-950 ${blog.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-sm truncate text-white">{blog.title}</div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-2">
                        <span>{blog.date}</span>
                        <span>•</span>
                        <span className="text-red-500">{blog.readTime}</span>
                        <span>•</span>
                        <span className="flex items-center"><Hash className="w-3 h-3 mr-0.5" /> {blog.keywords.length} tags</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setEditingPost(blog)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                      title="Edit/Review"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => togglePublish(blog.id)}
                      className={`p-2 rounded-lg transition-colors ${blog.status === 'published' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500 hover:text-green-500'}`}
                      title={blog.status === 'published' ? 'Unpublish' : 'Publish'}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteBlog(blog.id)}
                      className="p-2 hover:text-red-500 text-slate-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="text-center py-20 text-slate-600">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="italic">No articles found. Click Generate to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="dark-glass w-full max-w-4xl rounded-[40px] p-10 border-slate-800 shadow-2xl h-[85vh] flex flex-col scale-in-center">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <h3 className="text-3xl font-extrabold flex items-center">
                <FileText className="w-6 h-6 mr-3 text-red-500" />
                Review SEO Article
              </h3>
              <button onClick={() => setEditingPost(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-8 pr-4 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Title</label>
                    <input 
                      type="text" 
                      value={editingPost.title} 
                      onChange={e => setEditingPost({...editingPost, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-bold focus:border-red-500 transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Meta Description (SEO)</label>
                    <textarea 
                      value={editingPost.metaDescription} 
                      onChange={e => setEditingPost({...editingPost, metaDescription: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs h-24 resize-none focus:border-red-500 transition-colors outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Keywords (Comma Separated)</label>
                    <input 
                      type="text" 
                      value={editingPost.keywords.join(', ')} 
                      onChange={e => setEditingPost({...editingPost, keywords: e.target.value.split(',').map(k => k.trim())})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs focus:border-red-500 transition-colors outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="aspect-video rounded-3xl overflow-hidden border border-slate-800">
                    <img src={editingPost.img} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Post Excerpt</div>
                    <textarea 
                      value={editingPost.excerpt} 
                      onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})}
                      className="w-full bg-transparent border-none p-0 text-sm italic resize-none h-20 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Main Content (Markdown)</label>
                <textarea 
                  value={editingPost.content} 
                  onChange={e => setEditingPost({...editingPost, content: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 text-sm font-mono min-h-[400px] outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800 flex justify-end space-x-4 shrink-0">
              <button 
                onClick={() => setEditingPost(null)}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 rounded-2xl font-bold transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={saveEditedPost}
                className="px-8 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-bold flex items-center shadow-xl active:scale-95 transition-all"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'blogs' && (
        <div className="bg-slate-950 border border-slate-800 rounded-[40px] p-20 text-center text-slate-500 italic">
          <div className="max-w-md mx-auto">
            <Settings className="w-12 h-12 mx-auto mb-6 opacity-10" />
            <h4 className="text-lg font-bold text-slate-400 mb-2">Management Panel</h4>
            <p className="text-sm">Additional configuration settings for {activeTab} are currently being migrated to the unified AI dashboard. Use the CMS for page updates.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
