import { GoogleGenAI, Type } from "@google/genai";
import { Attraction } from "../types";

export const findAttractions = async (start: string, end: string): Promise<Attraction[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    I am planning a road trip from ${start} to ${end}.
    Please identify 6 to 10 major tourist attractions, scenic viewpoints, historical sites, or hidden gems that are located geographically ALONG the driving route between these two cities.
    Do not list places that are far off the direct route.
    For each place, provide precise coordinates (latitude and longitude).
    Ensure the result includes a mix of nature, history, and culture if possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            attractions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Name of the attraction" },
                  description: { type: Type.STRING, description: "Short, exciting description (max 2 sentences)" },
                  latitude: { type: Type.NUMBER, description: "Latitude" },
                  longitude: { type: Type.NUMBER, description: "Longitude" },
                  category: { 
                    type: Type.STRING, 
                    enum: ['Nature', 'History', 'Culture', 'Food', 'Adventure', 'Other'],
                    description: "Category of the place"
                  },
                  rating: { type: Type.NUMBER, description: "Estimated rating out of 5 (e.g., 4.5)" }
                },
                required: ["name", "description", "latitude", "longitude", "category"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) {
      return [];
    }

    const data = JSON.parse(jsonText);
    const attractions: Attraction[] = data.attractions.map((item: any, index: number) => ({
      ...item,
      id: `attr-${index}-${Date.now()}`
    }));

    return attractions;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};