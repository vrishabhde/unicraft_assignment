import axios from "axios";

export async function getSeedUrls(query) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content:`Return only compact JSON. No explanations, no formatting, no newlines, no code blocks, no indentation. Output must be a single-line raw JSON array like [{"name":"Company Name","website":"https://company.com"}] and nothing else. Strictly output JSON only for: "${query}".`
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    let completion = response.data;

    if(completion.choices[0].message.content?.length){
         return JSON.parse(completion.choices[0].message.content);
    }

    return ""
   
  } catch (error) {
    console.error(
      "Error:",
      error.response ? error.response.data : error.message
    );
  }
}

