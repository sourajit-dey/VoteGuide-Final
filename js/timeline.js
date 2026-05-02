/**
 * @file timeline.js
 * @description Interactive 7-stage election timeline.
 *              Accordion expand/collapse with ARIA support.
 *              Full keyboard navigation via Enter/Space.
 * @author VoteGuide India
 * @version 1.0.0
 */

/**
 * @description Builds timeline HTML from ELECTION_DATA
 *              and injects into #timeline-content.
 * @returns {void}
 */
function buildTimeline() {
  const container = document.getElementById('timeline-content');
  if (!container) return;

  const stages = ELECTION_DATA.timelineStages;
  let html = '<div class="timeline" role="list">';

  for (let i = 0; i < stages.length; i++) {
    const s = stages[i];
    html += '<div class="timeline-item animate-on-scroll"';
    html += ' data-stage="' + s.id + '" role="listitem">';
    html += '<div class="timeline-circle" aria-hidden="true">';
    html += s.stage + '</div>';
    html += '<div class="timeline-header" tabindex="0"';
    html += ' role="button" aria-expanded="false"';
    html += ' aria-label="Stage ' + s.stage + ': ' + s.title;
    html += ' — click to expand details">';
    html += '<div class="timeline-header-left">';
    html += '<span class="timeline-icon" aria-hidden="true">';
    html += s.icon + '</span>';
    html += '<div class="timeline-header-text">';
    html += '<h3>' + s.title + '</h3>';
    html += '<p>' + s.subtitle + '</p>';
    html += '</div></div>';
    html += '<div class="timeline-meta">';
    html += '<span class="badge badge-saffron">' + s.duration + '</span>';
    html += '<span class="timeline-chevron" aria-hidden="true">▼</span>';
    html += '</div></div>';
    html += '<div class="timeline-content">';
    html += '<article class="timeline-content-inner"><ul>';
    for (let j = 0; j < s.details.length; j++) {
      html += '<li>' + s.details[j] + '</li>';
    }
    html += '</ul>';
    html += '<div class="timeline-funfact">';
    html += '<div class="timeline-funfact-label">';
    html += '💡 Did you know?</div>';
    html += '<p>' + s.funFact + '</p>';
    html += '</div></article></div></div>';
  }

  html += '</div>';
  container.innerHTML = html;

  const headers = container.querySelectorAll('.timeline-header');
  for (let i = 0; i < headers.length; i++) {
    headers[i].addEventListener('click', handleTimelineClick);
    headers[i].addEventListener('keydown', handleTimelineKeydown);
  }
}

/**
 * @description Handles click on timeline header
 * @param {MouseEvent} e - Click event
 * @returns {void}
 */
function handleTimelineClick(e) {
  toggleTimeline(e.currentTarget);
}

/**
 * @description Handles keyboard on timeline header
 * @param {KeyboardEvent} e - Keydown event
 * @returns {void}
 */
function handleTimelineKeydown(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleTimeline(e.currentTarget);
  }
}

/**
 * @description Toggles timeline stage open/closed.
 *              Closes all others first (accordion).
 *              Updates ARIA and tracks analytics.
 * @param {HTMLElement} header - Clicked header element
 * @returns {void}
 */
function toggleTimeline(header) {
  const item = header.parentElement;
  const isActive = item.classList.contains('active');

  const allItems = document.querySelectorAll('.timeline-item');
  for (let i = 0; i < allItems.length; i++) {
    allItems[i].classList.remove('active');
    const h = allItems[i].querySelector('.timeline-header');
    if (h) h.setAttribute('aria-expanded', 'false');
  }

  if (!isActive) {
    item.classList.add('active');
    header.setAttribute('aria-expanded', 'true');

    const titleEl = item.querySelector('h3');
    const stageNum = parseInt(
      item.getAttribute('data-stage') || '0', 10
    );
    if (titleEl) {
      const name = titleEl.textContent.trim();
      trackTimelineStageView(name, stageNum);
      if (typeof recordStageView === 'function') {
        recordStageView(name, stageNum);
      }
    }
  }
}
