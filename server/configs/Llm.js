
import { GoogleGenAI } from "@google/genai";
import Bytez from "bytez.js";

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

async function LLM(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}



const bytezKey = process.env.BYTEZ_API_KEY; 
const bytezSdk = new Bytez(bytezKey);
const imageModel = bytezSdk.model("google/imagen-4.0-ultra-generate-001");

export async function generateImage(prompt) {
  try {
    console.log("Generating image with Bytez (Imagen 4.0 Ultra) for prompt:", prompt);

    const { error, output } = await imageModel.run(prompt);

    if (error) {
      throw new Error(`Bytez image generation error: ${error.message || JSON.stringify(error)}`);
    }

    if (!output) {
      throw new Error("No output received from Bytez image generation.");
    }

    return output;
  } catch (error) {
    console.error("Error generating image with Bytez:", error);
    throw error;
  }
}

export default LLM;

