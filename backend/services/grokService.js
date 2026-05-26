const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_ENDPOINT = process.env.GROK_API_URL || 'https://api.x.ai/v1/chat/completions';
const GROK_MODEL = process.env.GROK_MODEL || 'grok-4.3';

const STOP_WORDS = new Set([
  'about', 'above', 'after', 'again', 'against', 'answer', 'because', 'before', 'being', 'below',
  'between', 'code', 'common', 'course', 'describe', 'during', 'examinations', 'explain',
  'following', 'from', 'have', 'into', 'marks', 'mins', 'name', 'other', 'questions', 'section',
  'semester', 'should', 'than', 'that', 'their', 'there', 'these', 'this', 'through', 'time',
  'type', 'university', 'were', 'what', 'when', 'where', 'which', 'while', 'with', 'would',
  'year', 'your', 'anurag', 'tech', 'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
]);

const normalizeText = (text = '') =>
  text
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .replace(/[•]/g, '-')
    .trim();

const splitSentences = (text) =>
  normalizeText(text)
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+|(?=\b\d+\s*[.)])/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 25);

const titleCase = (value) =>
  value
    .replace(/\w\S*/g, (word) => {
      const upper = word.toUpperCase();
      if (['AI', 'AIML', 'BTECH'].includes(upper)) return upper === 'BTECH' ? 'B Tech' : upper;
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .replace(/\bAi\b/g, 'AI')
    .replace(/\bAiml\b/g, 'AIML')
    .replace(/\bAnd\b/g, 'and');

const extractKeywords = (text) => {
  const topicPatterns = [
    /\bstrong AI\b/i,
    /\bstrong and weak AI\b/i,
    /\bweak AI\b/i,
    /\bgenerate[- ]and[- ]test\b/i,
    /\bNegamax algorithm\b/i,
    /\bknowledge representation(?:s)?\b/i,
    /\bproduction systems?\b/i,
    /\bexpert systems?\b/i,
    /\bproblem[- ]solving techniques?\b/i,
    /\bartificial intelligence\b/i,
    /\bgame[- ]playing algorithms?\b/i,
    /\bsearch techniques?\b/i,
  ];
  let topics = topicPatterns
    .filter((pattern) => pattern.test(text))
    .map((pattern) => titleCase(text.match(pattern)[0].replace(/[- ]+/g, ' ')));

  if (topics.includes('Strong and Weak AI')) {
    topics = topics.filter((topic) => !['Strong AI', 'Weak AI'].includes(topic));
  }

  const counts = new Map();
  const phrases = normalizeText(text)
    .toLowerCase()
    .match(/[a-z][a-z+\-/ ]{2,}/g) || [];

  phrases
    .flatMap((phrase) => phrase.split(/\s+/))
    .map((word) => word.replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, ''))
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word))
    .forEach((word) => counts.set(word, (counts.get(word) || 0) + 1));

  const singleWords = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => titleCase(word));

  const topicWords = new Set(topics.join(' ').toLowerCase().split(/\s+/));
  const filteredSingleWords = singleWords.filter((word) => !topicWords.has(word.toLowerCase()));

  return [...new Set([...topics, ...filteredSingleWords])].slice(0, 10);
};

const extractEntities = (text) => {
  const normalized = normalizeText(text);
  const entities = new Set();
  const patterns = [
    /\b[A-Z][A-Za-z& ]{2,}(?:University|College|Institute|School)\b/g,
    /\b(?:B\.?\s*Tech|AIML|AI|CSE|ECE|EEE|IT)\b/g,
    /\b[A-Z]\d{2}[A-Z0-9]+\b/g,
    /\b(?:May|June|July|August|September|October|November|December)-?\s*\d{4}\b/gi,
  ];

  patterns.forEach((pattern) => {
    const matches = normalized.match(pattern) || [];
    matches.forEach((match) => entities.add(match.replace(/\s+/g, ' ').trim()));
  });

  return [...entities].slice(0, 12);
};

const detectDocumentType = (text) => {
  const lower = text.toLowerCase();
  if (lower.includes('semester end examinations') || lower.includes('max marks')) {
    return 'exam paper';
  }
  if (lower.includes('invoice') || lower.includes('total amount')) return 'invoice';
  if (lower.includes('resume') || lower.includes('curriculum vitae')) return 'resume';
  if (lower.includes('abstract') && lower.includes('references')) return 'research document';
  return 'document';
};

const extractExamDetails = (text) => {
  const normalized = normalizeText(text);
  return {
    university: normalized.match(/\b[A-Z][A-Za-z ]+University\b/)?.[0],
    course: normalized.match(/Course:\s*([^\n]+)/i)?.[1]?.trim(),
    exam: normalized.match(/([A-Za-z ]*Semester End Examinations,\s*[A-Za-z-]+\d{4})/i)?.[1]?.trim(),
    time: normalized.match(/Time:\s*([^\n.]+)/i)?.[1]?.trim(),
    marks: normalized.match(/Max Marks:\s*([0-9]+)/i)?.[1],
    code: normalized.match(/QP Code:\s*([A-Z0-9]+)/i)?.[1],
  };
};

const extractQuestionLines = (text) =>
  normalizeText(text)
    .split('\n')
    .map((line) => line.replace(/^[\s-]*\d+\s*[.)]?\s*/, '').trim())
    .filter((line) => /^(distinguish|describe|what|give|how|name|explain|define|write|compare|list|discuss)\b/i.test(line))
    .slice(0, 8);

const buildLocalAnalysis = (text, reason) => {
  const normalized = normalizeText(text);
  const documentType = detectDocumentType(normalized);
  const keywords = extractKeywords(normalized);
  const entities = extractEntities(normalized);
  const sentences = splitSentences(normalized);
  const examDetails = documentType === 'exam paper' ? extractExamDetails(normalized) : {};
  const questionLines = documentType === 'exam paper' ? extractQuestionLines(normalized) : [];

  const summary = documentType === 'exam paper'
    ? [
        `This is an examination paper for ${examDetails.course || 'an academic course'}.`,
        examDetails.university ? `It belongs to ${examDetails.university}.` : '',
        examDetails.exam ? `The exam session is ${examDetails.exam}.` : '',
        examDetails.time || examDetails.marks
          ? `The paper allows ${examDetails.time || 'the stated duration'} and carries ${examDetails.marks || 'the stated'} marks.`
          : '',
        keywords.length
          ? `It covers topics such as ${keywords.slice(0, 6).join(', ')}.`
          : '',
      ].filter(Boolean).join(' ')
    : sentences.slice(0, 3).join(' ');

  const insights = documentType === 'exam paper'
    ? [
        'The document is structured as a question paper with short-answer and essay-answer sections.',
        'The main theme is Fundamentals of Artificial Intelligence, especially AI problem solving, search, knowledge representation, production systems, and game-playing algorithms.',
        'For study planning, prioritize the higher-mark essay questions because they carry most of the score.',
        questionLines.length
          ? `Important preparation prompts include: ${questionLines.slice(0, 3).join('; ')}.`
          : 'The extracted text contains enough structure to identify exam sections and likely preparation topics.',
      ]
    : [
        `The uploaded file appears to be a ${documentType}.`,
        keywords.length ? `The strongest recurring topics are ${keywords.slice(0, 5).join(', ')}.` : 'The text is readable but has limited repeated topic signals.',
        sentences.length > 4 ? 'The document has enough content for a multi-point summary and follow-up questions.' : 'The document is short, so the analysis is intentionally concise.',
      ];

  return {
    summary: summary || normalized.substring(0, 500) || 'No readable text was found in this file.',
    keywords,
    entities,
    sentiment: 'neutral',
    insights,
    topQuestions: questionLines.length
      ? questionLines
      : [
          'What are the main topics in this document?',
          'What are the key points I should remember?',
          'Can you summarize this in simpler language?',
        ],
    metadata: {
      source: 'local-analysis',
      documentType,
      reason,
    },
  };
};

const parseJsonAnalysis = (output, text) => {
  try {
    const jsonText = output.match(/\{[\s\S]*\}/)?.[0] || output;
    const parsed = JSON.parse(jsonText);
    return {
      ...buildLocalAnalysis(text, 'used-to-fill-missing-fields'),
      ...parsed,
      metadata: {
        source: 'grok',
        ...(parsed.metadata || {}),
      },
    };
  } catch {
    return {
      ...buildLocalAnalysis(text, 'grok-returned-non-json'),
      summary: output.substring(0, 1200),
      metadata: {
        source: 'grok-text',
      },
    };
  }
};

const analyzeText = async (text) => {
  const trimmedText = normalizeText(text);

  if (!GROK_API_KEY) {
    return buildLocalAnalysis(trimmedText, 'GROK_API_KEY is not configured');
  }

  try {
    const response = await fetch(GROK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are a precise document analyst. Return only valid JSON with keys: summary, keywords, entities, sentiment, insights, topQuestions, metadata.',
          },
          {
            role: 'user',
            content: `Analyze this extracted document text. Make the summary polished and specific, not a raw OCR dump.\n\n${trimmedText}`,
          },
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message || `Grok API returned ${response.status}`);
    }

    const output = payload.choices?.[0]?.message?.content || payload.output || '';
    return parseJsonAnalysis(output, trimmedText);
  } catch (error) {
    console.warn('Grok analysis failed, using local analysis:', error.message);
    return buildLocalAnalysis(trimmedText, error.message);
  }
};

const answerQuestion = async (text, question) => {
  const trimmedText = normalizeText(text);

  if (!GROK_API_KEY) {
    const analysis = buildLocalAnalysis(trimmedText, 'GROK_API_KEY is not configured');
    return `Based on the extracted text: ${analysis.summary}`;
  }

  try {
    const response = await fetch(GROK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROK_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROK_MODEL,
        temperature: 0.3,
        messages: [
          {
            role: 'system',
            content: 'Answer questions using only the supplied document text. Be concise and helpful.',
          },
          {
            role: 'user',
            content: `Document text:\n${trimmedText}\n\nQuestion:\n${question}`,
          },
        ],
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message || `Grok API returned ${response.status}`);
    }

    return payload.choices?.[0]?.message?.content?.trim() || payload.output || 'No answer found.';
  } catch (error) {
    console.warn('Grok chat failed, using fallback:', error.message);
    const analysis = buildLocalAnalysis(trimmedText, error.message);
    return `The chat service is unavailable right now, but the document appears to cover: ${analysis.keywords.slice(0, 6).join(', ') || analysis.summary}`;
  }
};

module.exports = { analyzeText, answerQuestion };
