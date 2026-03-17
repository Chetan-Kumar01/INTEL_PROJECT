const axios = require('axios');
require('dotenv').config();

async function testGroqAPI() {
  const apiKey = process.env.GROQ_API_KEY;
  
  console.log('Testing Groq API connection...');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
  
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say "Hello, Groq API is working!"' }
        ],
        max_tokens: 50,
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n✅ SUCCESS!');
    console.log('Response:', response.data.choices[0].message.content);
    console.log('\nGroq API is working correctly!');
  } catch (error) {
    console.log('\n❌ ERROR!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testGroqAPI();
