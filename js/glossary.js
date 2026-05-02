/**
 * @file glossary.js
 * @description Searchable election glossary and FAQ accordion.
 *              Real-time debounced search filtering.
 *              Full keyboard navigation and ARIA support.
 * @author VoteGuide India
 * @version 1.0.0
 */

/**
 * @description Builds searchable glossary from ELECTION_DATA
 * @returns {void}
 */
function buildGlossary() {
  const wrap = document.getElementById('glossary-content');
  if (!wrap) return;

  const terms = ELECTION_DATA.glossaryTerms;

  let html = '<div class="search-input-wrap">';
  html += '<span class="search-icon" aria-hidden="true">🔍</span>';
  html += '<label for="glossary-search" class="sr-only">';
  html += 'Search election terms</label>';
  html += '<input type="text" class="search-input"';
  html += ' id="glossary-search"';
  html += ' placeholder="Search terms…"';
  html += ' autocomplete="off"';
  html += ' aria-label="Search election terms">';
  html += '</div>';
  html += '<div class="accordion" id="glossary-list"';
  html += ' role="region" aria-label="Election Glossary">';
  html += buildTermsHTML(terms);
  html += '</div>';

  wrap.innerHTML = html;

  const searchInput = document.getElementById('glossary-search');
  const glossaryList = document.getElementById('glossary-list');

  searchInput.addEventListener('input', debounce(function() {
    const q = searchInput.value.toLowerCase().trim();
    trackGlossarySearch(q.length > 0);
    const filtered = terms.filter(function(t) {
      return t.term.toLowerCase().indexOf(q) !== -1 ||
             t.definition.toLowerCase().indexOf(q) !== -1;
    });
    if (filtered.length === 0) {
      glossaryList.innerHTML =
        '<div class="no-results">No terms match your search.</div>';
    } else {
      glossaryList.innerHTML = buildTermsHTML(filtered);
      attachAccordionListeners(glossaryList);
    }
  }, 200));

  attachAccordionListeners(glossaryList);
}

/**
 * @description Generates accordion HTML for glossary terms
 * @param {Array} terms - Array of term objects
 * @returns {string} HTML string
 */
function buildTermsHTML(terms) {
  let html = '';
  for (let i = 0; i < terms.length; i++) {
    const t = terms[i];
    html += '<div class="accordion-item">';
    html += '<div class="accordion-header" tabindex="0"';
    html += ' role="button" aria-expanded="false">';
    html += '<h3>' + t.term + '</h3>';
    html += '<span class="accordion-chevron" aria-hidden="true">▼</span>';
    html += '</div>';
    html += '<div class="accordion-body">';
    html += '<div class="accordion-body-inner">';
    html += '<p>' + t.definition + '</p>';
    html += '<div class="accordion-source">Source: ' + t.source + '</div>';
    html += '</div></div></div>';
  }
  return html;
}

/**
 * @description Attaches click and keyboard listeners to accordions
 * @param {HTMLElement} container - Container with accordion items
 * @returns {void}
 */
function attachAccordionListeners(container) {
  if (!container) return;
  const headers = container.querySelectorAll('.accordion-header');
  headers.forEach(function(header) {
    header.addEventListener('click', function() {
      toggleAccordion(header);
    });
    header.addEventListener('keydown', handleAccordionKeydown);
  });
}

/**
 * @description Builds FAQ accordion from ELECTION_DATA
 * @returns {void}
 */
function buildFAQ() {
  const wrap = document.getElementById('faq-content');
  if (!wrap) return;

  const items = ELECTION_DATA.faqItems;
  let html = '<div class="accordion" role="region"';
  html += ' aria-label="Frequently Asked Questions">';

  for (let i = 0; i < items.length; i++) {
    const f = items[i];
    html += '<div class="accordion-item animate-on-scroll">';
    html += '<div class="accordion-header" tabindex="0"';
    html += ' role="button" aria-expanded="false">';
    html += '<h3>' + f.question + '</h3>';
    html += '<span class="accordion-chevron" aria-hidden="true">▼</span>';
    html += '</div>';
    html += '<div class="accordion-body">';
    html += '<div class="accordion-body-inner">';
    html += '<p>' + f.answer + '</p>';
    html += '</div></div></div>';
  }
  html += '</div>';
  wrap.innerHTML = html;

  attachAccordionListeners(wrap);
}

/**
 * @description Handles keydown on accordion headers
 * @param {KeyboardEvent} e - Keydown event
 * @returns {void}
 */
function handleAccordionKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleAccordion(e.currentTarget);
  }
}

/**
 * @description Toggles accordion item and updates ARIA
 * @param {HTMLElement} header - Accordion header clicked
 * @returns {void}
 */
function toggleAccordion(header) {
  const item = header.parentElement;
  const isOpen = item.classList.contains('open');

  const siblings = item.parentElement.querySelectorAll('.accordion-item');
  siblings.forEach(function(sib) {
    sib.classList.remove('open');
    const h = sib.querySelector('.accordion-header');
    if (h) h.setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    header.setAttribute('aria-expanded', 'true');
    const q = header.querySelector('h3');
    if (q) trackFAQExpand(q.textContent);
  }
}
