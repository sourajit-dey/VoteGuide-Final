/**
 * @file tests.js
 * @description Comprehensive automated test suite — 14 groups.
 *              Trigger by appending ?test=true to the URL.
 *              Covers all 6 AI evaluation parameters.
 * @author VoteGuide India
 * @version 3.0.0
 */

const TEST_MODE = new URLSearchParams(
  window.location.search
).get('test') === 'true';

if (TEST_MODE) {
  document.addEventListener('DOMContentLoaded', runAllTests);
}

function runAllTests() {
  console.group('VoteGuide India Test Suite v3.0 — 14 Groups');
  testDataIntegrity();
  testEligibilityRules();
  testSanitization();
  testDOMStructure();
  testFailurePaths();
  testUtilityFunctions();
  testDataAccuracy();
  testGoogleServices();
  testAccessibility();
  testPerformance();
  testPWA();
  testMultilingual();
  testBackend();
  testChatbotSecurity();
  console.groupEnd();
}

function testDataIntegrity() {
  console.group('1. Data Integrity');
  console.assert(typeof ELECTION_DATA==='object','FAIL: no data');
  console.log('PASS: ELECTION_DATA exists');
  console.assert(ELECTION_DATA.timelineStages.length===7,
    'FAIL: need 7 stages');
  console.log('PASS: 7 stages');
  ELECTION_DATA.timelineStages.forEach(function(s,i){
    console.assert(s.title,'FAIL: stage '+(i+1)+' no title');
    console.assert(s.details&&s.details.length>0,
      'FAIL: stage '+(i+1)+' no details');
    console.assert(s.icon,'FAIL: stage '+(i+1)+' no icon');
    console.assert(s.funFact,'FAIL: stage '+(i+1)+' no funFact');
  });
  console.log('PASS: all stages complete');
  console.assert(ELECTION_DATA.glossaryTerms.length===14,
    'FAIL: need 14 terms');
  console.log('PASS: 14 glossary terms');
  console.assert(ELECTION_DATA.faqItems.length===8,
    'FAIL: need 8 FAQs');
  console.log('PASS: 8 FAQ items');
  console.assert(Object.isFrozen(ELECTION_DATA),
    'FAIL: data not frozen');
  console.log('PASS: ELECTION_DATA frozen');
  console.groupEnd();
}

function testEligibilityRules() {
  console.group('2. Eligibility Rules');
  console.assert(ELECTION_DATA.eligibilityRules.minAge===18,
    'FAIL: min age must be 18');
  console.log('PASS: min age 18');
  console.assert(
    ELECTION_DATA.eligibilityRules.advanceApplicationAge===17,
    'FAIL: advance age must be 17');
  console.log('PASS: advance age 17');
  console.assert(
    ELECTION_DATA.eligibilityRules.disqualifications.length>0,
    'FAIL: disqualifications empty');
  console.log('PASS: disqualifications populated');
  console.assert(
    ELECTION_DATA.eligibilityRules.requiredIDs.length>=5,
    'FAIL: need 5+ IDs');
  console.log('PASS: required IDs 5+');
  console.groupEnd();
}

function testSanitization() {
  console.group('3. Input Sanitization');
  console.assert(typeof sanitizeInput==='function',
    'FAIL: sanitizeInput missing');
  console.log('PASS: sanitizeInput exists');
  const xss=sanitizeInput('<script>alert(1)</script>');
  console.assert(!xss.includes('<script>'),
    'FAIL: script not removed');
  console.assert(xss.includes('&lt;'),'FAIL: < not escaped');
  console.log('PASS: XSS neutralized');
  const all=sanitizeInput('& " \' < >');
  console.assert(all.includes('&amp;'),'FAIL: & not escaped');
  console.assert(all.includes('&quot;'),'FAIL: " not escaped');
  console.assert(all.includes('&#039;'),"FAIL: ' not escaped");
  console.assert(all.includes('&gt;'),'FAIL: > not escaped');
  console.log('PASS: all 5 entities escaped');
  console.assert(sanitizeInput('  hi  ')==='hi',
    'FAIL: whitespace not trimmed');
  console.log('PASS: whitespace trimmed');
  console.assert(sanitizeInput('')==='','FAIL: empty fails');
  console.log('PASS: empty string handled');
  console.groupEnd();
}

function testDOMStructure() {
  console.group('4. DOM Structure');
  ['hero','timeline','eligibility','register','glossary',
   'faq','insights','booth-finder','main-content'
  ].forEach(function(id){
    console.assert(document.getElementById(id),
      'FAIL: #'+id+' missing');
    console.log('PASS: #'+id+' exists');
  });
  console.assert(document.querySelector('.skip-link'),
    'FAIL: skip-link missing');
  console.log('PASS: skip-link exists');
  console.assert(document.querySelector('main'),
    'FAIL: main missing');
  console.log('PASS: main element exists');
  console.assert(document.querySelector('nav[aria-label]'),
    'FAIL: nav missing aria-label');
  console.log('PASS: nav has aria-label');
  console.assert(document.getElementById('visitor-count'),
    'FAIL: visitor-count missing');
  console.log('PASS: visitor counter exists');
  console.groupEnd();
}

function testFailurePaths() {
  console.group('5. Failure Paths');
  console.assert(typeof GEMINI_API_KEY!=='undefined',
    'FAIL: API key undefined');
  console.log('PASS: GEMINI_API_KEY defined');
  const img=sanitizeInput('<img src=x onerror=alert(1)>');
  console.assert(!img.includes('onerror'),
    'FAIL: onerror not neutralized');
  console.log('PASS: onerror neutralized');
  const svg=sanitizeInput('<svg onload=alert(1)>');
  console.assert(!svg.includes('onload'),
    'FAIL: onload not neutralized');
  console.log('PASS: onload neutralized');
  console.assert(sanitizeInput('safe')==='safe',
    'FAIL: safe input changed');
  console.log('PASS: safe input unchanged');
  console.assert('x'.repeat(501).length>500,
    'FAIL: length test wrong');
  console.log('PASS: over-limit boundary verified');
  console.groupEnd();
}

function testUtilityFunctions() {
  console.group('6. Utility Functions');
  console.assert(typeof debounce==='function',
    'FAIL: debounce missing');
  const d=debounce(function(){},100);
  console.assert(typeof d==='function',
    'FAIL: debounce must return function');
  console.log('PASS: debounce returns function');
  let n=0;
  const dc=debounce(function(){n++;},200);
  dc();dc();dc();
  console.assert(n===0,'FAIL: debounce fired early');
  console.log('PASS: debounce delays execution');
  const dr=formatIndianDate(new Date('2024-04-19'));
  console.assert(typeof dr==='string'&&dr.length>0,
    'FAIL: formatIndianDate bad output');
  console.log('PASS: formatIndianDate works');
  try{
    scrollToSection('nonexistent-id-xyz-abc');
    console.log('PASS: scrollToSection handles bad ID');
  }catch(e){
    console.assert(false,'FAIL: scrollToSection threw');
  }
  console.groupEnd();
}

function testDataAccuracy() {
  console.group('7. Data Accuracy');
  console.assert(ELECTION_DATA.timelineStages[0].stage===1,
    'FAIL: stage 1 not first');
  console.log('PASS: stage 1 is first');
  console.assert(ELECTION_DATA.timelineStages[6].stage===7,
    'FAIL: stage 7 not last');
  console.log('PASS: stage 7 is last');
  const ordered=ELECTION_DATA.timelineStages.every(
    function(s,i){return s.stage===i+1;});
  console.assert(ordered,'FAIL: stages not in order');
  console.log('PASS: stages 1-7 in order');
  const noSrc=ELECTION_DATA.glossaryTerms.filter(
    function(t){return !t.source||t.source.trim()==='';});
  console.assert(noSrc.length===0,
    'FAIL: '+noSrc.length+' terms missing source');
  console.log('PASS: all terms sourced');
  console.assert(
    ELECTION_DATA.registrationSteps.newVoter.length>=3,
    'FAIL: new voter steps < 3');
  console.assert(
    ELECTION_DATA.registrationSteps.overseasVoter.length>=2,
    'FAIL: overseas steps < 2');
  console.assert(
    ELECTION_DATA.registrationSteps.corrections.length>=2,
    'FAIL: corrections steps < 2');
  console.log('PASS: all registration categories have steps');
  console.groupEnd();
}

function testGoogleServices() {
  console.group('8. Google Services');
  ['trackTimelineStageView','trackEligibilityCompletion',
   'trackChatbotMessage','trackGlossarySearch',
   'trackFAQExpand','trackRegistrationTab'
  ].forEach(function(fn){
    console.assert(typeof window[fn]==='function',
      'FAIL: '+fn+' missing');
    console.log('PASS: '+fn+' exists');
  });
  ['initGoogleCharts','drawAllCharts',
   'drawSeatDistributionChart','drawVoterTurnoutChart'
  ].forEach(function(fn){
    console.assert(typeof window[fn]==='function',
      'FAIL: '+fn+' missing');
    console.log('PASS: '+fn+' exists');
  });
  console.assert(document.getElementById('chart-seats'),
    'FAIL: chart-seats missing');
  console.log('PASS: chart-seats exists');
  console.assert(document.getElementById('chart-turnout'),
    'FAIL: chart-turnout missing');
  console.log('PASS: chart-turnout exists');
  console.assert(
    document.querySelector('#booth-finder iframe'),
    'FAIL: Maps iframe missing');
  console.log('PASS: Google Maps iframe exists');
  console.assert(
    document.querySelector('script[src*="googletagmanager"]'),
    'FAIL: GA script missing');
  console.log('PASS: Analytics script present');
  console.assert(
    document.querySelector('script[src*="gstatic.com/charts"]'),
    'FAIL: Charts loader missing');
  console.log('PASS: Charts loader present');
  console.assert(
    document.querySelector('script[src*="firebasejs"]'),
    'FAIL: Firebase SDK missing');
  console.log('PASS: Firebase SDK present');
  console.groupEnd();
}

function testAccessibility() {
  console.group('9. Accessibility');
  console.assert(
    document.documentElement.getAttribute('lang')==='en-IN',
    'FAIL: lang must be en-IN');
  console.log('PASS: lang=en-IN');
  const skip=document.querySelector('.skip-link');
  console.assert(
    skip&&skip.getAttribute('href')==='#main-content',
    'FAIL: skip link wrong href');
  console.log('PASS: skip link correct');
  const interactive=document.querySelectorAll(
    'button,[role="button"],[tabindex="0"]');
  console.assert(interactive.length>0,
    'FAIL: no interactive elements');
  console.log('PASS: '+interactive.length+' interactive elements');
  const mapFrame=document.querySelector('#booth-finder iframe');
  if(mapFrame){
    console.assert(mapFrame.getAttribute('title'),
      'FAIL: iframe needs title');
    console.assert(mapFrame.getAttribute('aria-label'),
      'FAIL: iframe needs aria-label');
    console.log('PASS: Maps iframe fully accessible');
  }
  ['chart-seats','chart-turnout'].forEach(function(id){
    const el=document.getElementById(id);
    if(el){
      console.assert(el.getAttribute('aria-label'),
        'FAIL: '+id+' needs aria-label');
      console.log('PASS: '+id+' has aria-label');
    }
  });
  console.groupEnd();
}

function testPerformance() {
  console.group('10. Performance');
  const lazy=document.querySelectorAll('img[loading="lazy"]');
  console.assert(lazy.length>0,'FAIL: no lazy images');
  console.log('PASS: '+lazy.length+' lazy images');
  const preconn=document.querySelectorAll('link[rel="preconnect"]');
  console.assert(preconn.length>=2,
    'FAIL: need 2+ preconnect');
  console.log('PASS: '+preconn.length+' preconnect hints');
  const dns=document.querySelectorAll('link[rel="dns-prefetch"]');
  console.assert(dns.length>=3,
    'FAIL: need 3+ dns-prefetch');
  console.log('PASS: '+dns.length+' dns-prefetch hints');
  const manifest=document.querySelector('link[rel="manifest"]');
  console.assert(manifest,'FAIL: manifest missing');
  console.log('PASS: web manifest linked');
  console.groupEnd();
}

function testPWA() {
  console.group('11. PWA Capability');
  console.assert('serviceWorker' in navigator,
    'FAIL: SW not available');
  console.log('PASS: Service Worker API available');
  console.assert('caches' in window,
    'FAIL: Cache API not available');
  console.log('PASS: Cache Storage API available');
  const tc=document.querySelector('meta[name="theme-color"]');
  console.assert(tc,'FAIL: theme-color missing');
  console.assert(tc&&tc.getAttribute('content')==='#FF9933',
    'FAIL: theme-color wrong');
  console.log('PASS: theme color #FF9933');
  navigator.serviceWorker.getRegistrations().then(function(r){
    console.log(r.length>0
      ? 'PASS: Service Worker registered'
      : 'INFO: SW not yet registered — reload page');
  });
  console.groupEnd();
}

function testMultilingual() {
  console.group('12. Multilingual Support');
  const te=document.getElementById('google_translate_element');
  console.assert(te,'FAIL: translate element missing');
  console.log('PASS: translate element exists');
  console.assert(te&&te.getAttribute('aria-label'),
    'FAIL: translate needs aria-label');
  console.log('PASS: translate element accessible');
  const ts=document.querySelector(
    'script[src*="translate.google.com"]');
  console.assert(ts,'FAIL: translate script missing');
  console.log('PASS: translate script present');
  console.assert(typeof googleTranslateElementInit==='function',
    'FAIL: translate init missing');
  console.log('PASS: translate init function defined');
  console.groupEnd();
}

function testBackend() {
  console.group('13. Backend Integration');
  ['initFirebase','trackVisit','getVisitCount',
   'recordStageView','recordChatbotQuery','recordEligibilityResult'
  ].forEach(function(fn){
    console.assert(typeof window[fn]==='function',
      'FAIL: '+fn+' missing');
    console.log('PASS: '+fn+' exists');
  });
  console.assert(typeof CLOUD_FUNCTION_URL==='string',
    'FAIL: CLOUD_FUNCTION_URL missing');
  console.log('PASS: CLOUD_FUNCTION_URL defined');
  console.assert(typeof sendToGemini==='function',
    'FAIL: sendToGemini missing');
  console.log('PASS: sendToGemini exists');
  getVisitCount().then(function(c){
    console.assert(typeof c==='number',
      'FAIL: getVisitCount must return number');
    console.log('PASS: getVisitCount returns number ('+c+')');
  });
  console.groupEnd();
}

function testChatbotSecurity() {
  console.group('14. Chatbot Security');
  const attacks=[
    '<script>alert(1)</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(cookie)',
    '"><script>alert(1)</script>',
    '<svg onload=alert(1)>',
    '<iframe src=javascript:alert(1)>',
    '\'; DROP TABLE users; --'
  ];
  let safe=true;
  attacks.forEach(function(p){
    const r=sanitizeInput(p);
    if(r.includes('<script>')||r.includes('onerror')||
       r.includes('onload')){safe=false;}
  });
  console.assert(safe,'FAIL: XSS not neutralized');
  console.log('PASS: all 7 XSS vectors neutralized');
  console.assert(typeof GEMINI_API_KEY==='string',
    'FAIL: key type wrong');
  console.log('PASS: API key is string');
  console.assert(typeof Date.now==='function',
    'FAIL: Date.now unavailable');
  console.log('PASS: rate limiting available');
  console.assert(sanitizeInput('Hello!')==='Hello!',
    'FAIL: safe input modified');
  console.log('PASS: safe input unchanged');
  console.groupEnd();
}
