
import React from 'react';
import { Calendar, User, ArrowRight, FileText, Clock, Hash } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';

const BlogPost: React.FC<BlogPostType> = ({ title, date, excerpt, img, content, readTime, keywords }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] overflow-hidden group hover:border-red-500/30 transition-all duration-500 flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10 flex items-center">
          <Clock className="w-3 h-3 mr-1.5" /> {readTime}
        </div>
      </div>
      <div className="p-8 flex-grow flex flex-col">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">
          <span className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> {date}</span>
          <span className="flex items-center"><User className="w-3 h-3 mr-2" /> AI Insights</span>
        </div>
        <h3 className="text-2xl font-black mb-4 group-hover:text-red-500 transition-colors leading-tight">{title}</h3>
        
        {!isOpen && (
          <div className="flex flex-wrap gap-2 mb-6">
            {keywords.slice(0, 3).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-400">#{tag}</span>
            ))}
          </div>
        )}

        <div className={`text-slate-400 text-sm leading-relaxed mb-8 ${!isOpen && 'line-clamp-3'}`}>
          {isOpen ? (
            <div className="prose prose-invert prose-red max-w-none text-slate-300">
               <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
            </div>
          ) : excerpt}
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center text-red-500 font-black text-xs uppercase tracking-widest hover:translate-x-2 transition-transform"
          >
            {isOpen ? 'Close Reader' : 'Read Full Story'} <ArrowRight className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const Blog = ({ blogs = [] }: { blogs?: BlogPostType[] }) => {
  // Only display posts that have been explicitly approved/published in Admin
  const publishedBlogs = blogs.filter(b => b.status === 'published');

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-red-600/10 border border-red-600/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
            Ecosystem Intelligence
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">Automation <span className="text-red-500">Insights</span></h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">Expert perspectives on AI integration, lead generation, and small business growth strategies.</p>
        </div>

        {publishedBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {publishedBlogs.map((blog) => (
              <BlogPost 
                key={blog.id} 
                {...blog}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center dark-glass border-slate-800 rounded-[60px] max-w-4xl mx-auto shadow-2xl">
            <FileText className="w-20 h-20 text-slate-800 mx-auto mb-8 opacity-20" />
            <h3 className="text-3xl font-black text-slate-600 mb-4">Editorial Queue Active</h3>
            <p className="text-slate-500 text-lg max-w-md mx-auto">Our AI is drafting high-value insights. Please check back shortly for our latest automation strategies.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
