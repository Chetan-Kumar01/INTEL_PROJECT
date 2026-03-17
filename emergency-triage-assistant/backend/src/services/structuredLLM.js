const axios = require('axios');

async function getStructuredRecommendation(compressedHistory, emergencyDescription, apiKey) {
  const prompt = `You are an emergency triage AI. Analyze this case and provide a structured response.

Emergency: ${emergencyDescription}

Relevant Medical History:
${compressedHistory}

Provide your response in this exact JSON format:
{
  "immediate_action": "What to do right now",
  "differential_diagnosis": ["Diagnosis 1", "Diagnosis 2", "Diagnosis 3"],
  "supporting_evidence": "Evidence from the case that supports your assessment",
  "risk_considerations": "Key risks and red flags",
  "uncertainty_level": "Low/Medium/High"
}`;

  // Use Groq API with system message
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'You are an emergency triage AI assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.2
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const content = response.data.choices[0].message.content;
  
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : parseUnstructured(content);
  } catch {
    return parseUnstructured(content);
  }
}

function parseUnstructured(content) {
  return {
    immediate_action: content.substring(0, 200),
    differential_diagnosis: ["Unable to parse structured response"],
    supporting_evidence: "See immediate_action field",
    risk_considerations: "Review full response",
    uncertainty_level: "Medium"
  };
}

module.exports = { getStructuredRecommendation };
