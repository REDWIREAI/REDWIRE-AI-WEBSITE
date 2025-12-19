import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Mic, PhoneCall, Globe, CheckCircle2, ChevronRight, Zap, Edit3, Layers, Settings2, Rocket, TrendingUp, Cpu, Network, ImageOff } from 'lucide-react';
import { SiteSettings } from '../types';

const SectionHeader = ({ heading, subheading }: { heading: string; subheading: string }) => {
  const parts = heading.split(' ');
  const last = parts.pop();
  const first = parts.join(' ');
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{first} <span className="text-red-500">{last}</span></h2>
      <p className="text-xl text-slate-400 font-medium">{subheading}</p>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, to }: any) => (
  <div className="group p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10">
    <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
      <Icon className="w-6 h-6 text-red-500 group-hover:text-white" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-6">{description}</p>
    <Link to={to} className="flex items-center text-red-500 font-bold text-sm group-hover:translate-x-2 transition-transform">
      Learn More <ChevronRight className="w-4 h-4 ml-1" />
    </Link>
  </div>
);

const EcosystemCard = ({ icon: Icon, title, description, to, settings }: any) => (
  <div className="relative group p-10 rounded-[40px] bg-slate-900 border border-slate-800 hover:border-red-500/40 transition-all duration-500 flex flex-col items-center text-center">
    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
      <Network className="w-24 h-24 text-red-500" />
    </div>
    <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-red-900/20 transform group-hover:rotate-6 transition-transform">
      <Icon className="w-8 h-8 text-white" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{description}</p>
    <Link 
      to={to} 
      style={{ borderColor: settings.primaryButtonColor, color: settings.primaryButtonColor }}
      className="px-6 py-3 rounded-full border font-bold text-sm hover:opacity-80 transition-all"
    >
      Read More
    </Link>
  </div>
);

const StepCard = ({ number, title, description, icon: Icon }: any) => (
  <div className="relative p-8 rounded-[32px] bg-slate-900/30 border border-slate-800 hover:bg-slate-900/50 transition-all duration-300 group">
    <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform">
      {number}
    </div>
    <div className="mb-6 pt-2">
      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-red-500 group-hover:bg-red-500/10 transition-all">
        <Icon className="w-7 h-7" />
      </div>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const Home = ({ 
  settings, 
  onImageClick 
}: { 
  settings: SiteSettings; 
  onImageClick?: (field: keyof SiteSettings) => void;
}) => {
  const headingWords = settings.heroHeading.split(' ');
  const lastWord = headingWords.pop();
  const mainHeading = headingWords.join(' ');

  const whyWords = settings.whyChooseUsHeading.split(' ');
  const whyLast = whyWords.pop();
  const whyMain = whyWords.join(' ');

  const whyItems = [
    {
      title: "Zero Missed Leads",
      desc: "Our AI captures every opportunity 24/7/365, ensuring your pipeline is always full."
    },
    {
      title: "Consistent Experience",
      desc: "Deliver the perfect pitch and support response every single time."
    },
    {
      title: "Scalable Growth",
      desc: "Handle 10 or 10,000 visitors simultaneously without hiring more staff."
    },
    {
      title: "Data Driven",
      desc: "Get deep insights and analytics into customer behavior and conversation sentiment."
    }
  ];

  const ecosystemItems = [
    {
      icon: Bot,
      title: "AI Chatbot",
      description: "24/7 intelligent customer support that converts visitors into customers",
      to: "/product/chatbot"
    },
    {
      icon: Mic,
      title: "Website Voicebot",
      description: "Voice-enabled assistance for hands-free customer interactions",
      to: "/product/voicebot"
    },
    {
      icon: PhoneCall,
      title: "AI Voice Agent",
      description: "Human-like phone conversations that handle calls automatically",
      to: "/product/voice-agent"
    },
    {
      icon: Globe,
      title: "Smart Website",
      description: "Complete AI-powered website solution with all automation tools",
      to: "/product/smart-website"
    }
  ];

  return (
    <div className="pt-32">
      {/* Hero Section */}
      <section className="relative px-6 max-w-7xl mx-auto py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-red-600/5 blur-[120px] rounded-full -z-10 opacity-30"></div>
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          <div className="flex-1 text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-sm font-bold mb-8 animate-in fade-in slide-in-from-left-4 duration-700">
              <Zap className="w-4 h-4" />
              <span>New: AI Voice Agents v3.0 Released</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
              {mainHeading} <span className="text-red-500">{lastWord}</span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-10 leading-relaxed font-medium">
              {settings.heroSubheading}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              <Link 
                to={settings.heroButtonLink} 
                style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-red-900/40 transition-all transform hover:-translate-y-1"
              >
                {settings.heroButtonText}
              </Link>
            </div>
          </div>

          <div className="flex-1 relative group w-full lg:max-w-xl animate-in fade-in slide-in-from-right-8 duration-1000">
            <div className="bg-slate-950 rounded-[40px] overflow-hidden relative aspect-[4/3] flex items-center justify-center border border-slate-900">
              {settings.heroImageUrl ? (
                <img 
                  src={settings.heroImageUrl} 
                  alt="Automation Ecosystem" 
                  className="w-full h-full object-cover transition-all group-hover:brightness-50" 
                />
              ) : (
                <div className="flex flex-col items-center text-slate-700">
                  <ImageOff className="w-16 h-16 mb-4" />
                  <p className="font-bold">No Hero Image</p>
                </div>
              )}
              {onImageClick && (
                <div 
                  onClick={() => onImageClick?.('heroImageUrl')}
                  className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm bg-black/40"
                >
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Edit3 className="w-8 h-8 text-white" />
                  </div>
                  <span className="mt-4 text-white font-bold text-lg px-4 py-2 rounded-xl">Update Hero Image</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-6 py-24 bg-slate-950/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeader heading={settings.productsHeading} subheading={settings.productsSubheading} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard icon={Bot} title="AI Chatbot" description="Smart conversationalist that turns your website traffic into warm leads." to="/product/chatbot" />
            <FeatureCard icon={Mic} title="Website Voicebot" description="A unique audio interface for your site. Voice-activated browsing & FAQ." to="/product/voicebot" />
            <FeatureCard icon={PhoneCall} title="AI Voice Agent" description="Professional AI callers that handle appointments and outbound sales." to="/product/voice-agent" />
            <FeatureCard icon={Globe} title="Smart Websites" description="High-converting Elementor sites pre-configured with all our AI tech." to="/product/smart-website" />
          </div>
        </div>
      </section>

      {/* The Ecosystem Section */}
      <section className="px-6 py-32 relative bg-slate-900/40 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-red-600/10 -z-10"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">The Complete AI <span className="text-red-500">Ecosystem</span></h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">Four powerful tools designed to automate every customer touchpoint</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {ecosystemItems.map((item, idx) => (
              <EcosystemCard 
                key={idx}
                icon={item.icon}
                title={item.title}
                description={item.description}
                to={item.to}
                settings={settings}
              />
            ))}
          </div>

          <div className="text-center">
            <Link 
              to="/pricing" 
              style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
              className="inline-flex items-center space-x-2 px-10 py-5 rounded-3xl font-extrabold text-xl transition-all shadow-xl group"
            >
              <span>View Full Ecosystem</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 relative">
        <div className="max-w-7xl mx-auto">
          <SectionHeader heading={settings.howItWorksHeading} subheading={settings.howItWorksSubheading} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <StepCard number="1" title="Select Plan" description="Choose the bundle that fits your needs." icon={Layers} />
            <StepCard number="2" title="Setup Integration" description="Connect in days not Weeks." icon={Settings2} />
            <StepCard number="3" title="Launch" description="Deploy your AI agents to live channels." icon={Rocket} />
            <StepCard number="4" title="Growth" description="Automation runs 24/7, scaling your leads." icon={TrendingUp} />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-6 py-24 border-y border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="max-w-xl text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10 leading-tight">
              {whyMain} <span className="text-red-500">{whyLast}</span>
            </h2>
            <div className="space-y-8">
              {whyItems.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-5 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center shrink-0 border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <CheckCircle2 className="w-4 h-4 text-red-500 group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12">
               <Link 
                to={settings.whyChooseUsButtonLink}
                style={{ backgroundColor: settings.primaryButtonColor, color: settings.primaryButtonTextColor }}
                className="px-8 py-4 rounded-2xl font-bold transition-all shadow-lg"
              >
                {settings.whyChooseUsButtonText}
              </Link>
            </div>
          </div>
          <div className="relative w-full md:w-1/2 aspect-square max-w-md group">
            <div className="absolute inset-0 bg-red-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative rounded-[40px] overflow-hidden aspect-square bg-slate-950 flex items-center justify-center border border-slate-900">
                {settings.whyChooseUsImageUrl ? (
                    <img src={settings.whyChooseUsImageUrl} alt="Why Red Wire AI" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                ) : (
                    <div className="flex flex-col items-center text-slate-700">
                      <ImageOff className="w-12 h-12 mb-4" />
                      <p className="font-bold text-sm">No Image</p>
                    </div>
                )}
                {onImageClick && (
                  <div 
                      onClick={() => onImageClick?.('whyChooseUsImageUrl')}
                      className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 backdrop-blur-sm bg-black/40"
                  >
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                          <Edit3 className="w-6 h-6 text-white" />
                      </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;