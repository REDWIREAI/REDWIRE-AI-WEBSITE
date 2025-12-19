import { ProductType, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: ProductType.CHATBOT,
    name: 'AI Chatbot',
    monthlyPrice: 100,
    setupFee: 100,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=1000&auto=format&fit=crop',
    features: [
      'Unlimited conversations',
      'Natural language AI',
      'Lead capture forms',
      'Custom training',
      'Widget customization',
      'Email notifications',
      'Basic analytics',
      'Email support'
    ],
    description: 'Transform your website visitors into customers with an intelligent AI that knows your business inside out.'
  },
  {
    id: ProductType.VOICEBOT,
    name: 'Website Voicebot',
    monthlyPrice: 150,
    setupFee: 125,
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=1000&auto=format&fit=crop',
    features: [
      'Everything in Chatbot',
      'Natural voice responses',
      'Multi-language voice',
      'Voice-to-text logs',
      'Accessibility features',
      'Priority support',
      'Advanced analytics'
    ],
    description: 'Allow your visitors to talk directly to your website. The future of browsing is conversational.'
  },
  {
    id: ProductType.VOICE_AGENT,
    name: 'AI Voice Agent',
    monthlyPrice: 200,
    setupFee: 150,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    features: [
      'Everything in Voicebot',
      'Inbound call handling',
      'Outbound call campaigns',
      'Call transcription',
      'CRM integrations',
      'Appointment scheduling',
      'Call routing',
      'Dedicated support',
      'Bilingual'
    ],
    description: 'A full-time sales representative that never sleeps. Handles calls, books meetings, and closes leads.'
  },
  {
    id: ProductType.SMART_WEBSITE,
    name: 'Smart Website',
    monthlyPrice: 300,
    setupFee: 200,
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    features: [
      'Responsive design',
      'Chatbot included (voicebot upgrade)',
      'AI-powered website',
      'Lead Capture & Lead Generation',
      'SEO optimization',
      'Custom integrations',
      '24/7 priority support'
    ],
    description: 'The ultimate automation ecosystem. A high-converting website pre-loaded with every AI tool we offer.'
  }
];

export const AFFILIATE_COMMISSION_RATE = 0.45; // 45%