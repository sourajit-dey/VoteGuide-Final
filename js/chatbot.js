/**
 * @file chatbot.js
 * @description AI chatbot powered by Google Gemini 2.0 Flash.
 *              Security: sanitizeInput before every API call.
 *              Rate limiting: 2-second minimum between requests.
 *              Input cap: 500 characters maximum.
 *              Falls back to direct API if Cloud Function missing.
 * @author VoteGuide India
 * @version 1.0.0
 */

/** Election assistant system prompt */
const SYSTEM_PROMPT = `You are VoteGuide, a friendly and knowledgeable
Indian election assistant. Help Indian citizens understand the complete
Lok Sabha election process — from voter registration to counting day.

RULES YOU MUST ALWAYS FOLLOW:
1. Only answer questions about Indian elections. For anything else:
   "I am here to help with Indian election questions only. 
   What would you like to know about voting or elections?"
2. NEVER recommend any political party or candidate. If asked:
   "My job is to explain the process — your vote is entirely yours!"
3. Structure every answer: one direct sentence → numbered steps
   → end with exactly 2 suggested follow-up questions.
4. Keep answers under 150 words unless a process needs more steps.
5. Cite official sources: eci.gov.in, voters.eci.gov.in, 1950.
6. Speak simply — for a first-time voter aged 18.

KEY KNOWLEDGE:
- New voter: Form 6 at voters.eci.gov.in. Overseas: Form 6A
- Eligibility: 18+ citizen, on electoral roll, not imprisoned
- 17-year-olds can pre-register since 2023
- Stages: Announcement → Nomination (Rs 25,000 deposit) →
  Scrutiny → Withdrawal → Campaign → Polling → Counting
- MCC: starts on announcement day, ends on result day
- EVM: Ballot Unit + Control Unit, stores 2,000 votes
- VVPAT: paper slip visible 7 seconds, cannot be taken
- NOTA: Option 99, from Supreme Court order 2013
- Polling: 7AM-6PM, indelible ink left index finger
- 272 of 543 seats = Lok Sabha majority
- Accepted IDs: Aadhaar, PAN, Passport, Driving Licence,
  MNREGA card, Bank passbook with photo
- cVIGIL app: report MCC violations, 100-min response
- Voter Helpline: 1950 (toll free)`;

/** @type {Array} Conversation history for context */
let conversationHistory = [];

/** @type {number} Timestamp of last API request for rate limiting */
let lastRequestTime = 0;

/** @type {boolean} Whether chatbot window is open */
let chatOpen = false;

/**
 * @description Sends message to Gemini API with security measures.
 *              Tries Cloud Function first, falls back to direct API.
 * @param {string} userMessage - Already sanitized user input
 * @returns {Promise<string>} AI response text
 */
async function sendToGemini(userMessage) {
  conversationHistory = conversationHistory.slice(-10);

  const useCloudFn = typeof CLOUD_FUNCTION_URL === 'string' &&
    CLOUD_FUNCTION_URL !== '' &&
    CLOUD_FUNCTION_URL.length > 10;

  if (useCloudFn) {
    try {
      const res = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: conversationHistory
        })
      });
      if (res.ok) {
        const data = await res.json();
        trackChatbotMessage();
        if (typeof recordChatbotQuery === 'function') {
          recordChatbotQuery();
        }
        return data.response ||
          'I could not generate a response. Please try again.';
      }
    } catch (err) {
      console.warn('Cloud Function failed, falling back to direct API', err);
    }
  }

  if (!GEMINI_API_KEY ||
      GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
    return 'AI assistant not configured. Please add your ' +
      'Gemini API key to js/config.js';
  }

  try {
    const contents = conversationHistory;
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/' +
      'models/gemini-2.5-flash:generateContent?key=' +
      GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.4
          }
        })
      }
    );
    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    trackChatbotMessage();
    if (typeof recordChatbotQuery === 'function') {
      recordChatbotQuery();
    }
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I could not generate a response. Please try again.';
  } catch (_) {
    return 'I am having trouble connecting. Please try again ' +
      'or call Voter Helpline 1950.';
  }
}

/**
 * @description Builds and initializes the chatbot UI.
 *              All interactions use addEventListener only.
 * @returns {void}
 */
function buildChatbot() {
  const fabBtn = document.createElement('button');
  fabBtn.className = 'chatbot-fab';
  fabBtn.setAttribute('aria-label',
    'Open VoteGuide AI chat assistant');
  fabBtn.setAttribute('aria-expanded', 'false');
  fabBtn.textContent = '🗳️';
  document.body.appendChild(fabBtn);

  const chatWindow = document.createElement('div');
  chatWindow.className = 'chatbot-window';
  chatWindow.setAttribute('role', 'dialog');
  chatWindow.setAttribute('aria-label', 'VoteGuide AI Assistant');
  chatWindow.setAttribute('aria-hidden', 'true');

  chatWindow.innerHTML =
    '<div class="chatbot-header">' +
    '<div><div class="chatbot-header-title">VoteGuide AI</div>' +
    '<div class="chatbot-header-sub">' +
    'Powered by Google Gemini 2.5 Flash</div></div>' +
    '<button class="chatbot-close" id="chatbot-close"' +
    ' aria-label="Close chat window">×</button>' +
    '</div>' +
    '<div class="chatbot-messages" id="chatbot-messages"' +
    ' role="log" aria-live="polite" aria-atomic="false"></div>' +
    '<div class="chatbot-input-area">' +
    '<label for="chatbot-input" class="sr-only">' +
    'Type your election question</label>' +
    '<input type="text" class="chatbot-input" id="chatbot-input"' +
    ' placeholder="Ask about Indian elections…"' +
    ' aria-label="Type your election question"' +
    ' maxlength="500">' +
    '<button class="chatbot-send" id="chatbot-send"' +
    ' aria-label="Send message">Send</button>' +
    '</div>';

  document.body.appendChild(chatWindow);

  const messagesDiv = document.getElementById('chatbot-messages');
  const inputEl = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send');
  const closeBtn = document.getElementById('chatbot-close');

  /**
   * @description Opens or closes the chat window
   * @returns {void}
   */
  function toggleChat() {
    chatOpen = !chatOpen;
    if (chatOpen) {
      chatWindow.classList.add('open');
      chatWindow.setAttribute('aria-hidden', 'false');
      fabBtn.setAttribute('aria-expanded', 'true');
      fabBtn.classList.add('active');
      if (messagesDiv.children.length === 0) {
        showWelcomeMessage();
      }
      inputEl.focus();
    } else {
      chatWindow.classList.remove('open');
      chatWindow.setAttribute('aria-hidden', 'true');
      fabBtn.setAttribute('aria-expanded', 'false');
      fabBtn.classList.remove('active');
    }
  }

  /**
   * @description Shows the welcome message and suggestion chips
   * @returns {void}
   */
  function showWelcomeMessage() {
    const botMsg = 'Namaste! 🙏 I am VoteGuide, your Indian election guide.\n\nI can help you with:\n• How to register to vote\n• The complete election process\n• Your voter eligibility\n• What happens on polling day\n\nWhat would you like to know?';
    appendBotMessage(botMsg);

    const chips = document.createElement('div');
    chips.className = 'chatbot-chips';
    chips.setAttribute('aria-label', 'Quick question suggestions');

    const suggestions = [
      'How do I register to vote?',
      'Am I eligible to vote?',
      'How does voting work?'
    ];

    suggestions.forEach(function(text) {
      const chip = document.createElement('button');
      chip.className = 'chatbot-chip';
      chip.textContent = text;
      chip.addEventListener('click', function() {
        chips.remove();
        handleSend(text);
      });
      chips.appendChild(chip);
    });

    messagesDiv.appendChild(chips);
    scrollToBottom();
  }

  /**
   * @description Appends a user bubble to messages
   * @param {string} text - User message text
   * @returns {void}
   */
  function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row chatbot-msg-user';
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble chatbot-bubble-user';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesDiv.appendChild(row);
    scrollToBottom();
  }

  /**
   * @description Appends a bot bubble to messages
   * @param {string} text - Bot response text
   * @returns {void}
   */
  function appendBotMessage(text) {
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row chatbot-msg-bot';
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble chatbot-bubble-bot';
    bubble.textContent = text;
    row.appendChild(bubble);
    messagesDiv.appendChild(row);
    scrollToBottom();
  }

  /**
   * @description Shows animated typing indicator
   * @returns {HTMLElement} Typing indicator element
   */
  function showTypingIndicator() {
    const row = document.createElement('div');
    row.className = 'chatbot-msg-row chatbot-msg-bot';
    row.id = 'typing-indicator';
    row.setAttribute('aria-label', 'VoteGuide is typing');
    const bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble chatbot-bubble-bot chatbot-typing';
    bubble.innerHTML =
      '<span class="dot" aria-hidden="true"></span>' +
      '<span class="dot" aria-hidden="true"></span>' +
      '<span class="dot" aria-hidden="true"></span>';
    row.appendChild(bubble);
    messagesDiv.appendChild(row);
    scrollToBottom();
    return row;
  }

  /**
   * @description Scrolls messages to bottom
   * @returns {void}
   */
  function scrollToBottom() {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  /**
   * @description Handles sending a message with security checks
   * @param {string} [override] - Optional message override
   * @returns {void}
   */
  async function handleSend(override) {
    const raw = override || inputEl.value;
    if (!raw || raw.trim().length === 0) return;

    const now = Date.now();
    if (now - lastRequestTime < 2000) {
      appendBotMessage(
        'Please wait a moment before sending another message.'
      );
      return;
    }

    if (raw.length > 500) {
      appendBotMessage(
        'Please keep your question under 500 characters.'
      );
      return;
    }

    const clean = sanitizeInput(raw);
    if (!override) inputEl.value = '';
    inputEl.disabled = true;
    sendBtn.disabled = true;
    lastRequestTime = now;

    appendUserMessage(clean);
    const typing = showTypingIndicator();

    conversationHistory.push({
      role: 'user',
      parts: [{ text: clean }]
    });

    const response = await sendToGemini(clean);

    typing.remove();

    conversationHistory.push({
      role: 'model',
      parts: [{ text: response }]
    });

    conversationHistory = conversationHistory.slice(-10);

    appendBotMessage(response);
    inputEl.disabled = false;
    sendBtn.disabled = false;
    inputEl.focus();
  }

  fabBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  sendBtn.addEventListener('click', function() { handleSend(); });
  inputEl.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
}
