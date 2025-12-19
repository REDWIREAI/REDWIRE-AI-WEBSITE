
import { GoogleGenAI, Type } from "@google/genai";
import { SiteSettings, Product } from "../types";

// Helper to safely get API key and initialize AI client
const getAIClient = () => {
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: apiKey || '' });
};

/**
 * Generates an SEO-optimized blog post based on the site's branding and products.
 */
export const generateBlogContent = async (siteSettings: SiteSettings, products: Product[]) => {
  try {
    const ai = getAIClient();
    const productList = products.map(p => `- ${p.name}: ${p.description}`).join('\n');
    
    const prompt = `You are a world-class SEO content strategist and writer for "${siteSettings.siteName}".
    Context: ${siteSettings.heroHeading}. ${siteSettings.heroSubheading}.
    Products:
    ${productList}
    
    TASK: Write a highly SEO-optimized blog post for small business owners.
    
    REQUIREMENTS:
    - Title: Catchy, high-CTR, includes a primary keyword.
    - Structure: Use Markdown with clear H1, H2, and H3 subheadings. 
    - Content: Minimum 500 words. Informative, solves a pain point, and includes a call to action.
    - SEO Meta: Generate a concise meta description (max 160 chars) and 5-8 relevant keywords.
    - Image: Create a detailed prompt for a professional tech illustration that captures the essence of this specific topic.
    
    Return the response ONLY as a JSON object with:
    - title: string
    - excerpt: string (2 sentences)
    - content: string (Markdown)
    - metaDescription: string
    - keywords: string[]
    - imagePrompt: string
    - readTime: string (e.g. "4 min read")`;

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            content: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            keywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            imagePrompt: { type: Type.STRING },
            readTime: { type: Type.STRING }
          },
          required: ["title", "excerpt", "content", "metaDescription", "keywords", "imagePrompt", "readTime"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Blog Generation Error:", error);
    throw error;
  }
};

export const generateBusinessSummary = async (businessName: string, industry: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short automation strategy (3 bullet points) for a business named "${businessName}" in the "${industry}" industry. Focus on how AI chatbots and voice agents can save time.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI insights currently unavailable. Let's proceed with your custom configuration.";
  }
};

export const getOnboardingAssistance = async (product: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The customer is setting up their "${product}". Suggest 3 initial questions their AI agent should ask new leads to maximize conversion.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"questions": []}');
  } catch (error) {
    return { questions: ["What is your name?", "How can we help you today?", "What is the best way to contact you?"] };
  }
}

/**
 * Generates full site copy and image prompts based on a URL or description.
 */
export const generateSiteBranding = async (context: string) => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert branding agent. Based on this business description or URL: "${context}", generate a complete professional website branding package. 
      Output MUST include headings and subheadings for all site sections.
      Headings should be punchy and action-oriented.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            siteName: { type: Type.STRING },
            logoText: { type: Type.STRING },
            heroHeading: { type: Type.STRING },
            heroSubheading: { type: Type.STRING },
            productsHeading: { type: Type.STRING },
            productsSubheading: { type: Type.STRING },
            howItWorksHeading: { type: Type.STRING },
            howItWorksSubheading: { type: Type.STRING },
            trustHeading: { type: Type.STRING },
            pricingHeading: { type: Type.STRING },
            pricingSubheading: { type: Type.STRING },
            affiliateHeading: { type: Type.STRING },
            affiliateSubheading: { type: Type.STRING },
            contactHeading: { type: Type.STRING },
            contactSubheading: { type: Type.STRING },
            imagePrompt: { type: Type.STRING, description: "Detailed visual description for a main hero background image" },
            trustImagePrompt: { type: Type.STRING, description: "Visual description for a trust section/secondary image" }
          },
          required: [
            "siteName", "logoText", "heroHeading", "heroSubheading", 
            "productsHeading", "productsSubheading", "howItWorksHeading", 
            "howItWorksSubheading", "trustHeading", "pricingHeading", 
            "pricingSubheading", "affiliateHeading", "affiliateSubheading", 
            "contactHeading", "contactSubheading", "imagePrompt", "trustImagePrompt"
          ]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Branding Generation Error:", error);
    throw error;
  }
};

/**
 * Generates an image using Gemini 2.5 Flash Image.
 */
export const generateAIImage = async (prompt: string, isLogo: boolean = false) => {
  try {
    const aiImage = getAIClient();
    const response = await aiImage.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `${prompt}. ${isLogo ? 'High resolution logo, clean background, vector style.' : 'Professional website hero background, 4k, cinematic lighting.'}` }]
      },
      config: {
        imageConfig: {
          aspectRatio: isLogo ? "1:1" : "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
