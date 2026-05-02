/**
 * @file eligibility.js
 * @description 4-step voter eligibility checker wizard.
 *              Full input validation and error handling.
 *              Uses data attributes — no inline handlers.
 * @author VoteGuide India
 * @version 1.0.0
 */

/**
 * @description Builds the eligibility checker wizard
 * @returns {void}
 */
function buildEligibilityChecker() {
  const wrap = document.getElementById('eligibility-content');
  if (!wrap) return;

  let state = {
    step: 1,
    citizen: null,
    age: null,
    voterList: null,
    convicted: null
  };

  /**
   * @description Renders current wizard step
   * @returns {void}
   */
  function render() {
    const s = state.step;
    const total = 4;
    let html = '<div class="eligibility-card scale-in">';

    html += '<div class="eligibility-progress" role="progressbar"';
    html += ' aria-valuenow="' + s + '" aria-valuemin="1"';
    html += ' aria-valuemax="' + total + '"';
    html += ' aria-label="Step ' + s + ' of ' + total + '">';
    for (let i = 1; i <= total; i++) {
      let cls = 'eligibility-progress-dot';
      if (i < s) cls += ' filled';
      else if (i === s) cls += ' current';
      html += '<div class="' + cls + '"></div>';
    }
    html += '</div>';

    if (s <= total) {
      html += '<div class="eligibility-step">';
      html += '<div class="eligibility-step-number">Step ';
      html += s + ' of ' + total + '</div>';
    }

    if (s === 1) {
      html += '<h3>Are you an Indian citizen?</h3>';
      html += '<div class="eligibility-options">';
      html += '<button class="eligibility-option"';
      html += ' data-key="citizen" data-val="true">';
      html += 'Yes, I am</button>';
      html += '<button class="eligibility-option"';
      html += ' data-key="citizen" data-val="false">';
      html += 'No</button>';
      html += '</div>';

    } else if (s === 2) {
      html += '<h3>How old are you?</h3>';
      html += '<p style="color:var(--text-secondary);';
      html += 'font-size:.9rem;margin-bottom:12px">';
      html += 'Enter your current age in years</p>';
      html += '<label for="elig-age" class="sr-only">';
      html += 'Your age in years</label>';
      html += '<input type="number" class="eligibility-input"';
      html += ' id="elig-age" min="1" max="150"';
      html += ' placeholder="e.g. 21"';
      html += ' aria-label="Enter your age in years">';
      html += '<div id="age-error" class="eligibility-error"';
      html += ' role="alert" aria-live="polite"></div>';
      html += '<button class="btn btn-primary eligibility-next"';
      html += ' id="elig-age-btn">Continue</button>';

    } else if (s === 3) {
      html += '<h3>Is your name on the voter list?</h3>';
      html += '<div class="eligibility-options">';
      html += '<button class="eligibility-option"';
      html += ' data-key="voterList" data-val="yes">Yes</button>';
      html += '<button class="eligibility-option"';
      html += ' data-key="voterList" data-val="no">No</button>';
      html += '<button class="eligibility-option"';
      html += ' data-key="voterList" data-val="unsure">';
      html += "I don't know</button>";
      html += '</div>';

    } else if (s === 4) {
      html += '<h3>Have you been convicted and sentenced';
      html += ' to 2+ years imprisonment?</h3>';
      html += '<div class="eligibility-options">';
      html += '<button class="eligibility-option"';
      html += ' data-key="convicted" data-val="true">Yes</button>';
      html += '<button class="eligibility-option"';
      html += ' data-key="convicted" data-val="false">No</button>';
      html += '</div>';

    } else {
      html += buildResult();
    }

    if (s <= total) html += '</div>';
    html += '</div>';
    wrap.innerHTML = html;
    attachListeners();
  }

  /**
   * @description Attaches all event listeners after render.
   *              Never uses inline handlers.
   * @returns {void}
   */
  function attachListeners() {
    const options = wrap.querySelectorAll('.eligibility-option');
    options.forEach(function(btn) {
      btn.addEventListener('click', handleOptionClick);
    });

    const ageBtn = document.getElementById('elig-age-btn');
    if (ageBtn) ageBtn.addEventListener('click', handleAgeSubmit);

    const ageInput = document.getElementById('elig-age');
    if (ageInput) {
      ageInput.focus();
      ageInput.addEventListener('keydown', handleAgeKeydown);
    }

    const resetBtn = document.getElementById('elig-reset');
    if (resetBtn) resetBtn.addEventListener('click', handleReset);
  }

  /**
   * @description Handles option button click
   * @param {MouseEvent} e - Click event
   * @returns {void}
   */
  function handleOptionClick(e) {
    const key = e.currentTarget.getAttribute('data-key');
    let val = e.currentTarget.getAttribute('data-val');
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    recordAnswer(key, val);
  }

  /**
   * @description Handles Enter key on age input
   * @param {KeyboardEvent} e - Keydown event
   * @returns {void}
   */
  function handleAgeKeydown(e) {
    if (e.key === 'Enter') handleAgeSubmit();
  }

  /**
   * @description Handles age form submission
   * @returns {void}
   */
  function handleAgeSubmit() {
    const inp = document.getElementById('elig-age');
    const err = document.getElementById('age-error');
    if (!inp || !err) return;
    const raw = inp.value.trim();
    if (!raw) {
      err.textContent = 'Please enter your age to continue';
      err.style.display = 'block';
      inp.style.borderColor = '#dc2626';
      return;
    }
    if (!/^\d+$/.test(raw)) {
      err.textContent = 'Please enter numbers only';
      err.style.display = 'block';
      inp.style.borderColor = '#dc2626';
      return;
    }
    const age = parseInt(raw, 10);
    if (age < 1 || age > 150) {
      err.textContent = 'Please enter a valid age';
      err.style.display = 'block';
      inp.style.borderColor = '#dc2626';
      return;
    }
    state.age = age;
    if (age < 17) { state.step = 5; }
    else { state.step = 3; }
    render();
  }

  /**
   * @description Handles wizard reset
   * @returns {void}
   */
  function handleReset() {
    state = {
      step:1, citizen:null, age:null,
      voterList:null, convicted:null
    };
    render();
  }

  /**
   * @description Records answer and advances step
   * @param {string} key - State key to update
   * @param {*} val - Answer value
   * @returns {void}
   */
  function recordAnswer(key, val) {
    state[key] = val;
    if (key === 'citizen' && !val) { state.step = 5; }
    else if (key === 'convicted' && val) { state.step = 5; }
    else { state.step++; }
    render();
  }

  /**
   * @description Builds result card HTML
   * @returns {string} Result HTML
   */
  function buildResult() {
    let result = '';
    let type = '';

    if (typeof trackEligibilityCompletion === 'function') {
      trackEligibilityCompletion('completed');
    }
    if (typeof recordEligibilityResult === 'function') {
      recordEligibilityResult('completed');
    }

    if (!state.citizen) {
      type = 'ineligible';
      result = '<div class="result-icon">❌</div>';
      result += '<h3>Not Eligible</h3>';
      result += '<p>Only Indian citizens can vote in Indian elections.</p>';

    } else if (state.convicted) {
      type = 'ineligible';
      result = '<div class="result-icon">❌</div>';
      result += '<h3>Currently Ineligible</h3>';
      result += '<p>Persons serving 2+ year sentences are disqualified';
      result += ' (Section 8, RPA 1951).</p>';

    } else if (state.age < 17) {
      type = 'ineligible';
      result = '<div class="result-icon">⏳</div>';
      result += '<h3>Not Yet Eligible</h3>';
      result += '<p>You must be 17+ to apply in advance and 18 to vote.</p>';

    } else if (state.age === 17) {
      type = 'not-yet';
      result = '<div class="result-icon">🕒</div>';
      result += '<h3>Pre-Register Now!</h3>';
      result += '<p>17-year-olds can apply in advance since 2023.';
      result += ' Register at <a href="https://voters.eci.gov.in"';
      result += ' target="_blank" rel="noopener noreferrer">';
      result += 'voters.eci.gov.in</a></p>';

    } else if (state.voterList === 'unsure') {
      type = 'check-needed';
      result = '<div class="result-icon">🔍</div>';
      result += '<h3>Check Your Status</h3>';
      result += '<p>Check at <a href="https://electoralsearch.eci.gov.in"';
      result += ' target="_blank" rel="noopener noreferrer">';
      result += 'electoralsearch.eci.gov.in</a> or call 1950.</p>';

    } else if (state.voterList === 'no') {
      type = 'not-yet';
      result = '<div class="result-icon">📝</div>';
      result += '<h3>Eligible — Register Now!</h3>';
      result += '<p>You are eligible but need to register.';
      result += ' Apply via Form 6 at <a href="https://voters.eci.gov.in"';
      result += ' target="_blank" rel="noopener noreferrer">';
      result += 'voters.eci.gov.in</a></p>';

    } else {
      type = 'eligible';
      result = '<div class="result-icon">✅</div>';
      result += '<h3>You Are Eligible to Vote!</h3>';
      result += '<p>You are a registered Indian voter.';
      result += ' Carry a valid photo ID on polling day.</p>';
    }

    let html = '<div class="result-card ' + type + ' fade-in">';
    html += result;
    html += '<button class="btn btn-secondary btn-sm"';
    html += ' id="elig-reset" style="margin-top:12px">';
    html += '↺ Start Over</button>';
    html += '</div>';
    return html;
  }

  render();
}
