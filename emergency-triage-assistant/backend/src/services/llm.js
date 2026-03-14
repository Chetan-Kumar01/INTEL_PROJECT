const axios = require('axios');

async function getLLMRecommendation(compressedText, apiKey) {
  const prompt = `You are an emergency medical triage assistant. Analyze this case and provide triage level (Critical/Urgent/Standard/Non-Urgent) and brief recommendation:\n\n${compressedText}`;
  
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.3
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { getLLMRecommendation };
