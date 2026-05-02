/**
 * @file analytics.js
 * @description Google Analytics 4 event tracking.
 *              All functions null-safe — skip silently if
 *              gtag not loaded. No PII tracked ever.
 * @author VoteGuide India
 * @version 1.0.0
 */

/**
 * @description Safely calls gtag if available
 * @returns {void}
 */
function safeGtag() {
  if (typeof gtag === 'function') {
    gtag.apply(null, arguments);
  }
}

/**
 * @description Tracks timeline stage expansion
 * @param {string} stageName - Stage name
 * @param {number} stageNumber - Stage number 1-7
 * @returns {void}
 */
function trackTimelineStageView(stageName, stageNumber) {
  safeGtag('event', 'timeline_stage_view', {
    event_category: 'Election Timeline',
    event_label: stageName,
    value: stageNumber
  });
}

/**
 * @description Tracks eligibility checker completion
 * @param {string} result - Result shown to user
 * @returns {void}
 */
function trackEligibilityCompletion(result) {
  safeGtag('event', 'eligibility_complete', {
    event_category: 'Eligibility Checker',
    event_label: result
  });
}

/**
 * @description Tracks chatbot message sent
 * @returns {void}
 */
function trackChatbotMessage() {
  safeGtag('event', 'chatbot_message', {
    event_category: 'AI Chatbot',
    event_label: 'User Query'
  });
}

/**
 * @description Tracks glossary search usage
 * @param {boolean} hasQuery - Whether user typed a term
 * @returns {void}
 */
function trackGlossarySearch(hasQuery) {
  safeGtag('event', 'glossary_search', {
    event_category: 'Glossary',
    event_label: hasQuery ? 'searched' : 'cleared'
  });
}

/**
 * @description Tracks FAQ expansion
 * @param {string} question - Question expanded
 * @returns {void}
 */
function trackFAQExpand(question) {
  safeGtag('event', 'faq_expand', {
    event_category: 'FAQ',
    event_label: String(question).substring(0, 50)
  });
}

/**
 * @description Tracks registration tab selection
 * @param {string} tabName - Tab selected
 * @returns {void}
 */
function trackRegistrationTab(tabName) {
  safeGtag('event', 'registration_tab', {
    event_category: 'Registration',
    event_label: tabName
  });
}
