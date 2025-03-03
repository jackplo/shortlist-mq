import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDescription = async (editorialSummary: string, primaryType: string, secondaryTypes: string[]) => {

    const prompt = `
      Write a short and factual description of the restaurant using the provided details:    
      - **Editorial Summary:** ${editorialSummary}  
      - **Primary Type:** ${primaryType}  
      - **Secondary Types:** ${secondaryTypes.length > 0 ? secondaryTypes.join(", ") : ""}  

      Keep it concise and to the point, avoiding unnecessary formality. The description should be strictly based on the given information and avoiding any assumptions.
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    return response.choices[0].message.content;    
}