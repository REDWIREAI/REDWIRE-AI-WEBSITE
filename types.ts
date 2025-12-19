
export enum ProductType {
  CHATBOT = 'chatbot',
  VOICEBOT = 'voicebot',
  VOICE_AGENT = 'voice_agent',
  SMART_WEBSITE = 'smart_website'
}

export interface Product {
  id: ProductType;
  name: string;
  monthlyPrice: number;
  setupFee: number;
  features: string[];
  description: string;
  imageUrl?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  img: string;
  status: 'draft' | 'published';
  metaDescription: string;
  keywords: string[];
  readTime: string;
}

export interface SiteSettings {
  // Global / Brand
  siteName: string;
  logoImageUrl?: string;
  
  // Custom Code Injection
  headerCode?: string;
  bodyCode?: string;
  footerCode?: string;

  // Global Button Style
  primaryButtonColor: string;
  primaryButtonTextColor: string;

  // Home Page
  heroHeading: string;
  heroSubheading: string;
  heroImageUrl?: string;
  heroButtonText: string;
  heroButtonLink: string;
  
  productsHeading: string;
  productsSubheading: string;
  
  howItWorksHeading: string;
  howItWorksSubheading: string;
  
  whyChooseUsHeading: string;
  whyChooseUsImageUrl?: string;
  whyChooseUsButtonText: string;
  whyChooseUsButtonLink: string;

  // Pricing Page
  pricingHeading: string;
  pricingSubheading: string;

  // Affiliate Page
  affiliateHeading: string;
  affiliateSubheading: string;

  // Contact Page
  contactHeading: string;
  contactSubheading: string;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'affiliate' | 'admin';
  name: string;
  businessName?: string;
  onboardingStep: number;
  affiliateId?: string;
  referredBy?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  productId: ProductType;
  status: 'active' | 'canceled' | 'pending';
  currentPeriodEnd: string;
  affiliateId?: string;
}

export interface AffiliateStats {
  id: string;
  affiliateId: string;
  clicks: number;
  conversions: number;
  mrr: number;
  lifetimeEarnings: number;
  payoutPending: number;
}
