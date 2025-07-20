import axios from "axios";

export async function getSeedUrls(query) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [
              {
                text: `Return only compact JSON. No explanations, no formatting, no newlines, no code blocks, no indentation. Output must be a single-line raw JSON array like [{"name":"Company Name","website":"https://company.com"}] and nothing else. Strictly output JSON only for: "${query}".`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          key: process.env.GEMINI_API_KEY, 
        },
      }
    );

    const completion = response.data;
    
    const generatedText =
      completion.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return JSON.parse(generatedText);
    
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
    return "";
  }
}
