
import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BlogPost = ({ title, date, excerpt, img }: any) => (
  <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden group">
    <div className="aspect-video relative overflow-hidden">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-8">
      <div className="flex items-center space-x-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {date}</span>
        <span className="flex items-center"><User className="w-3 h-3 mr-1" /> Team RW</span>
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-red-500 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm mb-6 leading-relaxed">{excerpt}</p>
      <Link to="/blog" className="inline-flex items-center text-red-500 font-bold hover:translate-x-2 transition-transform">
        Read Article <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  </div>
);

const Blog = () => {
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">Automation <span className="text-red-500">Insights</span></h1>
          <p className="text-xl text-slate-400">The latest trends in small business AI and automation.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <BlogPost 
            title="The Rise of Voice AI in 2024" 
            date="Oct 12, 2024" 
            excerpt="Why every small business needs a voice agent to handle inbound lead qualification."
            img="https://picsum.photos/seed/voice/600/400"
          />
          <BlogPost 
            title="GHL Integration Masterclass" 
            date="Oct 08, 2024" 
            excerpt="How to sync your AI chatbots with your CRM for seamless lead follow-ups."
            img="https://picsum.photos/seed/ghl/600/400"
          />
          <BlogPost 
            title="Maximizing Affiliate Earnings" 
            date="Oct 02, 2024" 
            excerpt="Strategies for promoting Red Wire AI to your local business network."
            img="https://picsum.photos/seed/earn/600/400"
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;
