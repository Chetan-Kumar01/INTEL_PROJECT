const axios = require('axios');

async function queryGroqLLM(context, query, mode, apiKey) {
  const systemPrompt = mode === 'emergency' 
    ? 'You are an emergency medical AI. Provide immediate, actionable triage recommendations based on the context.'
    : 'You are a medical AI assistant. Provide detailed, comprehensive analysis based on the context.';

  const userPrompt = `Context from patient records:\n${context}\n\nQuery: ${query}\n\nProvide your answer with citations to specific parts of the context.`;

  const startTime = Date.now();

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: mode === 'emergency' ? 0.1 : 0.3,
        max_tokens: mode === 'emergency' ? 500 : 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const latency = Date.now() - startTime;

    return {
      answer: response.data.choices[0].message.content,
      model: 'mixtral-8x7b-32768',
      latency_ms: latency,
      tokens_used: response.data.usage
    };
  } catch (error) {
    throw new Error(`Groq API error: ${error.message}`);
  }
}

module.exports = { queryGroqLLM };
