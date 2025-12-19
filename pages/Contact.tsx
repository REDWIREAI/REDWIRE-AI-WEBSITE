
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { SiteSettings } from '../types';

const Contact = ({ settings }: { settings: SiteSettings }) => {
  const parts = settings.contactHeading.split(' ');
  const last = parts.pop();
  const first = parts.join(' ');

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold mb-4">{first} <span className="text-red-500">{last}</span></h1>
          <p className="text-xl text-slate-400 font-medium">{settings.contactSubheading}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="dark-glass p-8 rounded-3xl border-slate-800">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Email Us</div>
                    <div className="text-lg font-medium">hello@{settings.siteName.toLowerCase().replace(' ', '')}.ai</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Call Support</div>
                    <div className="text-lg font-medium">+1 (888) RED-WIRE</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[40px]">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
                  <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none transition-all" />
                </div>
              </div>
              <textarea rows={5} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 focus:border-red-500 outline-none transition-all" placeholder="Tell us how we can automate your business..." />
              <button className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-bold text-xl shadow-2xl flex items-center justify-center transition-all">
                Send Message <Send className="w-5 h-5 ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
