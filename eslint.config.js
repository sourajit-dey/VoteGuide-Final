import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ELECTION_DATA: "readonly",
        GEMINI_API_KEY: "readonly",
        CLOUD_FUNCTION_URL: "readonly",
        buildTimeline: "readonly",
        buildEligibilityChecker: "readonly",
        buildRegistrationTabs: "readonly",
        buildGlossary: "readonly",
        buildFAQ: "readonly",
        buildChatbot: "readonly",
        initGoogleCharts: "readonly",
        initFirebase: "readonly",
        trackVisit: "readonly",
        getVisitCount: "readonly",
        recordStageView: "readonly",
        recordChatbotQuery: "readonly",
        recordEligibilityResult: "readonly",
        debounce: "readonly",
        scrollToSection: "readonly",
        formatIndianDate: "readonly",
        sanitizeInput: "readonly",
        toggleTimeline: "readonly",
        toggleAccordion: "readonly",
        runAllTests: "readonly",
        trackTimelineStageView: "readonly",
        trackEligibilityCompletion: "readonly",
        trackChatbotMessage: "readonly",
        trackGlossarySearch: "readonly",
        trackFAQExpand: "readonly",
        trackRegistrationTab: "readonly",
        googleTranslateElementInit: "readonly",
        sendToGemini: "readonly",
        gtag: "readonly",
        firebase: "readonly",
        google: "readonly"
      }
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];
