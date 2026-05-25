const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_ENDPOINT = process.env.GROK_API_URL || 'https://api.grok.com/v1/completions';

const analyzeText = async (text) => {
  const prompt = `Analyze the following document text. Return JSON with summary, keywords, entities, sentiment, insights, and top questions. Text:\n${text}`;

  if (!GROK_API_KEY) {
    return {
      summary: text.substring(0, 1000),
      keywords: [],
      entities: [],
      sentiment: 'neutral',
      insights: ['Grok API key not configured; analysis is fallback metadata only.'],
      metadata: {
        source: 'fallback',
      },
    };
  }

  try {
    const response = await fetch(GROK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 700,
        temperature: 0.2,
      }),
    });

    const payload = await response.json();
    const output = payload.choices?.[0]?.text || payload.output || '';

    try {
      return JSON.parse(output);
    } catch {
      return {
        summary: output.substring(0, 1000),
        keywords: [],
        entities: [],
        sentiment: 'neutral',
        insights: [],
      };
    }
  } catch (error) {
    console.warn('Grok analysis failed, using fallback summary:', error.message);
    return {
      summary: text.substring(0, 1000),
      keywords: [],
      entities: [],
      sentiment: 'neutral',
      insights: ['Grok analysis unavailable; using local summary fallback.'],
      metadata: {
        source: 'fallback',
        error: error.message,
      },
    };
  }
};

const answerQuestion = async (text, question) => {
  if (!GROK_API_KEY) {
    return 'Chat analysis unavailable - Grok API key not configured. Please provide answers based on the document text.';
  }

  try {
    const prompt = `Document text:\n${text}\n\nAnswer the question in a helpful and concise manner:\n${question}`;
    const response = await fetch(GROK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 400,
        temperature: 0.3,
      }),
    });

    const payload = await response.json();
    return payload.choices?.[0]?.text?.trim() || payload.output || 'No answer found.';
  } catch (error) {
    console.warn('Grok chat failed, using fallback:', error.message);
    return `Chat service unavailable (${error.message}). Based on the document, please rephrase or try again.`;
  }
};

module.exports = { analyzeText, answerQuestion };
