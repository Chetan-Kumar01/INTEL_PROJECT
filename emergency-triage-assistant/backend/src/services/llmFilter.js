const axios = require('axios');

async function getLLMRelevanceFilter(ruleFilteredText, emergencyDescription, apiKey) {
  const prompt = `Given this emergency: "${emergencyDescription}"

Extract ONLY the relevant medical records from the patient history below. Preserve exact wording. Remove irrelevant information.

Patient History:
${ruleFilteredText}

Return only the relevant excerpts:`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    return ruleFilteredText;
  }
}

module.exports = { getLLMRelevanceFilter };
