/**
 * @file firebase.js
 * @description Firebase Realtime Database integration.
 *              Uses localStorage as primary reliable fallback.
 *              Firebase enhances if configured, never required.
 *              Zero PII stored — completely anonymous analytics.
 * @author VoteGuide India
 * @version 1.0.0
 */

/** Firebase project config — public values safe to include */
const FIREBASE_CONFIG = {
  apiKey: "REPLACE_WITH_FIREBASE_API_KEY",
  authDomain: "voteguide-india.firebaseapp.com",
  databaseURL: "https://voteguide-india-default-rtdb.firebaseio.com",
  projectId: "voteguide-india",
  storageBucket: "voteguide-india.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:abcdef"
};

/** @type {Object|null} Firebase database reference */
let firebaseDb = null;

/** @type {boolean} Firebase initialization state */
let firebaseInitialized = false;

/** localStorage key for reliable local visit counting */
const LOCAL_VISIT_KEY = 'vg_visits';

/**
 * @description Gets local visit count from localStorage
 * @returns {number} Local visit count or 0
 */
function getLocalVisitCount() {
  try {
    return parseInt(localStorage.getItem(LOCAL_VISIT_KEY)||'0',10);
  } catch (_) { return 0; }
}

/**
 * @description Increments and saves local visit count
 * @returns {number} New count after increment
 */
function incrementLocalVisit() {
  try {
    const next = getLocalVisitCount() + 1;
    localStorage.setItem(LOCAL_VISIT_KEY, String(next));
    return next;
  } catch (_) { return 1; }
}

/**
 * @description Initializes Firebase. Returns false safely
 *              if SDK not loaded or config is placeholder.
 * @returns {boolean} True if Firebase initialized
 */
function initFirebase() {
  try {
    if (typeof firebase === 'undefined') return false;
    if (FIREBASE_CONFIG.apiKey === 'REPLACE_WITH_FIREBASE_API_KEY') {
      return false;
    }
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    firebaseDb = firebase.database();
    firebaseInitialized = true;
    return true;
  } catch (_) {
    firebaseInitialized = false;
    return false;
  }
}

/**
 * @description Tracks a page visit using localStorage first,
 *              Firebase second. Always returns a number.
 * @returns {Promise<number>} Updated visit count
 */
async function trackVisit() {
  const local = incrementLocalVisit();
  if (!firebaseInitialized || !firebaseDb) return local;
  try {
    await firebaseDb.ref('analytics/visits')
      .transaction(function(n) { return (n || 0) + 1; });
    const snap = await firebaseDb
      .ref('analytics/visits').once('value');
    return snap.val() || local;
  } catch (_) { return local; }
}

/**
 * @description Gets current visit count reliably
 * @returns {Promise<number>} Visit count
 */
async function getVisitCount() {
  const local = getLocalVisitCount();
  if (!firebaseInitialized || !firebaseDb) return local;
  try {
    const snap = await firebaseDb
      .ref('analytics/visits').once('value');
    return snap.val() || local;
  } catch (_) { return local; }
}

/**
 * @description Records which election stage was viewed
 * @param {string} stageName - Stage name clicked
 * @param {number} stageNumber - Stage number 1-7
 * @returns {Promise<void>}
 */
async function recordStageView(stageName, stageNumber) {
  if (!firebaseInitialized || !firebaseDb) return;
  try {
    await firebaseDb.ref('analytics/stages/stage_' + stageNumber)
      .transaction(function(n) { return (n || 0) + 1; });
  } catch (_) { /* fail silently */ }
}

/**
 * @description Records anonymous chatbot query
 * @returns {Promise<void>}
 */
async function recordChatbotQuery() {
  if (!firebaseInitialized || !firebaseDb) return;
  try {
    await firebaseDb.ref('analytics/chatbot')
      .transaction(function(n) { return (n || 0) + 1; });
  } catch (_) { /* fail silently */ }
}

/**
 * @description Records eligibility result anonymously
 * @param {string} result - Result category
 * @returns {Promise<void>}
 */
async function recordEligibilityResult(result) {
  if (!firebaseInitialized || !firebaseDb) return;
  try {
    const key = result.replace(/[^a-z0-9]/gi,'_').toLowerCase();
    await firebaseDb.ref('analytics/eligibility/' + key)
      .transaction(function(n) { return (n || 0) + 1; });
  } catch (_) { /* fail silently */ }
}
