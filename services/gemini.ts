
import { GoogleGenAI, Type } from "@google/genai";

export const generateBusinessSummary = async (businessName: string, industry: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
    const aiImage = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
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
