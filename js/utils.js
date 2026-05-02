/**
 * @file utils.js
 * @description Shared utility functions for VoteGuide India.
 *              Used across all JS modules.
 * @author VoteGuide India
 * @version 1.0.0
 */

/**
 * @description Creates a debounced version of a function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function() {
    const args = arguments;
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function() {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * @description Sanitizes user input to prevent XSS attacks.
 *              Escapes all dangerous HTML characters.
 *              Called before every API request.
 * @param {string} input - Raw user input
 * @returns {string} Sanitized safe string
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .trim();
}

/**
 * @description Smoothly scrolls to an element by ID
 * @param {string} elementId - Target element ID
 * @returns {void}
 */
function scrollToSection(elementId) {
  const el = document.getElementById(elementId);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/**
 * @description Formats a Date to Indian DD/MM/YYYY format
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatIndianDate(date) {
  return date.toLocaleDateString('en-IN');
}
