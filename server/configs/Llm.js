
import Bytez from "bytez.js";

const LLM_MODEL_NAME = "openai/gpt-4.1-mini";

async function LLM(prompt) {
  try {
    const bytezKey = process.env.BYTEZ_API_KEY;
    const bytezSdk = new Bytez(bytezKey);
    const model = bytezSdk.model(LLM_MODEL_NAME);
    
     const messages = [{
      "role": "user",
      "content": prompt
    }];

    const { error, output } = await model.run(messages);

    if (error) {
      throw new Error(`Bytez LLM generation error: ${error.message || JSON.stringify(error)}`);
    }

    if (!output) {
      throw new Error("No output received from Bytez LLM generation.");
    }

    if (typeof output === 'object' && output.content) {
      return output.content;
    }
    return output;
  } catch (error) {
    console.error("Error generating text with Bytez:", error);
    throw error;
  }
}



export async function generateImage(prompt) {
  try {
    const bytezKey = process.env.BYTEZ_API_KEY;
    const bytezSdk = new Bytez(bytezKey);
    const imageModel = bytezSdk.model("google/imagen-4.0-ultra-generate-001");

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

