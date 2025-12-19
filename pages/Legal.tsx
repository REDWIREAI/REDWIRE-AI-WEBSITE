
import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, FileText, Scale, Cookie, AlertTriangle } from 'lucide-react';

const Legal = () => {
  const { type } = useParams<{ type: string }>();

  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: "Privacy Policy",
          icon: Shield,
          content: "At Red Wire AI, we prioritize your data security. We collect only the information necessary to provide our AI services and sync with your GoHighLevel account. We do not sell your personal data to third parties. All voice and text logs are encrypted at rest and in transit."
        };
      case 'terms':
        return {
          title: "Terms of Service",
          icon: FileText,
          content: "By using Red Wire AI, you agree to our usage guidelines. AI responses are generated based on your provided knowledge base. We are not responsible for the specific content generated but provide tools to moderate it. Subscriptions are billed monthly in advance."
        };
      case 'affiliate-terms':
        return {
          title: "Affiliate Agreement",
          icon: Scale,
          content: "Affiliates earn 45% recurring commission on active subscriptions. Payments are made monthly after a 30-day clearing period. Self-referrals are strictly prohibited. We reserve the right to pause accounts that violate our anti-spam policies."
        };
      case 'cookie':
        return {
          title: "Cookie Policy",
          icon: Cookie,
          content: "We use essential cookies to manage your login session and affiliate tracking cookies (90-day duration). These are necessary for the core functionality of the Red Wire ecosystem."
        };
      default:
        return {
          title: "Disclaimer",
          icon: AlertTriangle,
          content: "AI technology is rapidly evolving. While we strive for 100% accuracy, Red Wire AI is a tool to assist your business processes and should be reviewed regularly by human operators."
        };
    }
  };

  const { title, icon: Icon, content } = getContent();

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto dark-glass p-12 rounded-[48px] border-slate-800 shadow-2xl">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500">
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold">{title}</h1>
        </div>
        
        <div className="prose prose-invert prose-red max-w-none">
          <p className="text-slate-300 leading-relaxed mb-6">Last Updated: October 2024</p>
          <div className="text-slate-400 space-y-6 leading-relaxed">
            <p>{content}</p>
            <h3 className="text-xl font-bold text-white mt-8">1. Acceptance of Terms</h3>
            <p>By accessing or using the Red Wire AI platform, you acknowledge that you have read, understood, and agree to be bound by these provisions.</p>
            <h3 className="text-xl font-bold text-white mt-8">2. Intellectual Property</h3>
            <p>All software, proprietary algorithms, and brand assets remain the sole property of Red Wire AI. Clients retain ownership of their specific business data uploaded to the system.</p>
            <h3 className="text-xl font-bold text-white mt-8">3. Termination</h3>
            <p>Users may cancel their subscriptions at any time through the Stripe billing portal. Upon cancellation, access to AI agents will cease at the end of the current billing cycle.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;
