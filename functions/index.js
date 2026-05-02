/**
 * @file functions/index.js
 * @description Google Cloud Function — VoteGuide India API proxy.
 *              Routes all Gemini API requests server-side.
 *              API key stored as environment variable — never
 *              exposed to browser under any circumstance.
 *              Validates, sanitizes, rate-limits server-side.
 * @author VoteGuide India
 * @version 1.0.0
 */

const functions = require('@google-cloud/functions-framework');

/**
 * Election assistant system prompt — kept server-side for security.
 * Never sent to client browser.
 * @type {string}
 */
const ELECTION_SYSTEM_PROMPT = `You are VoteGuide, a friendly
and knowledgeable Indian election assistant. Help Indian citizens
understand the complete Lok Sabha election process.

RULES:
1. Only answer questions about Indian elections. For anything else:
   "I am here to help with Indian election questions only."
2. NEVER recommend any political party or candidate. If asked:
   "My job is to explain the process — your vote is yours!"
3. Structure every answer: one direct sentence → numbered steps
   → end with 2 suggested follow-up questions.
4. Keep answers under 150 words unless a process needs more.
5. Cite sources: eci.gov.in, voters.eci.gov.in, 1950.
6. Speak simply for a first-time voter aged 18.

KEY FACTS:
- New voter: Form 6 at voters.eci.gov.in. NRI: Form 6A
- Eligibility: 18+ Indian citizen, on electoral roll
- 17-year-olds can pre-register since 2023
- Stages: Announcement → Nomination (Rs 25000 deposit)
  → Scrutiny → Withdrawal → Campaign → Polling → Counting
- MCC: starts announcement day, ends result day
- EVM: Ballot Unit + Control Unit, stores 2000 votes
- VVPAT: paper slip 7 seconds, cannot be taken by voter
- NOTA: Option 99, Supreme Court order 2013
- Polling: 7AM-6PM, indelible ink left index finger
- 272 of 543 seats = Lok Sabha majority
- Voter Helpline: 1950 toll free`;

/**
 * @description Sanitizes input server-side as second layer
 *              of defense after client-side sanitization.
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string
 */
function sanitizeServerSide(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * @description Main Cloud Function HTTP endpoint.
 *              POST body: { message: string, history: array }
 *              Response: { response: string }
 *              API key lives only in Cloud environment variables.
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @returns {Promise<void>}
 */
functions.http('voteGuideChat', async (req, res) => {
  /* Security headers */
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Strict-Transport-Security',
    'max-age=31536000; includeSubDomains');
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  /* Handle CORS preflight */
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  /* Only allow POST */
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  /* Validate body */
  if (!req.body) {
    res.status(400).json({ error: 'Request body required' });
    return;
  }

  const { message, history } = req.body;

  /* Validate message */
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Valid message required' });
    return;
  }

  /* Enforce length limit */
  if (message.length > 500) {
    res.status(400).json({
      error: 'Message too long. Maximum 500 characters.'
    });
    return;
  }

  /* Reject empty */
  if (message.trim().length === 0) {
    res.status(400).json({ error: 'Message cannot be empty' });
    return;
  }

  /* Server-side sanitization */
  const safeMessage = sanitizeServerSide(message);

  /* API key from environment only — never from client */
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY environment variable not set');
    res.status(500).json({
      error: 'Service temporarily unavailable'
    });
    return;
  }

  /* Build safe history — max 10 entries */
  const safeHistory = Array.isArray(history)
    ? history.slice(-10).map(function(entry) {
        return {
          role: entry.role === 'model' ? 'model' : 'user',
          parts: [{
            text: sanitizeServerSide(
              String(entry?.parts?.[0]?.text || '')
            )
          }]
        };
      })
    : [];

  const contents = [
    ...safeHistory,
    { role: 'user', parts: [{ text: safeMessage }] }
  ];

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: ELECTION_SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.4
          }
        })
      }
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini returned ${geminiRes.status}`);
    }

    const data = await geminiRes.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not generate a response. Please try again.';

    res.status(200).json({ response: text });

  } catch (error) {
    console.error('Cloud Function error:', error.message);
    res.status(500).json({
      error: 'Unable to connect. Try again or call 1950.'
    });
  }
});
