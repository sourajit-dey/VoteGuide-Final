# VoteGuide India 🗳️

**Interactive AI-powered election guide for Indian citizens.**

🌐 **Live App:** [https://election-guide-promptwar.de.r.appspot.com](https://election-guide-promptwar.de.r.appspot.com)

![Score](https://img.shields.io/badge/AI%20Score-90.28%25-FF9933)
![Accessibility](https://img.shields.io/badge/WCAG-AA-138808)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-App%20Engine-4285F4)

## Overview

VoteGuide India is a high-performance Progressive Web App (PWA) designed to solve the problem of election complexity in India. It simplifies the 7-stage Lok Sabha process through interactive components and AI-driven assistance.

## Google Services (11 Integrated)

| Service | Category | Implementation Purpose |
|:---:|:---|:---|
| **Google Cloud App Engine** | Infrastructure | Scalable, secure hosting with automatic SSL and zero-downtime deploys. |
| **Google Gemini 2.5 Flash** | Artificial Intelligence | Core AI engine for the "VoteGuide Assistant" chatbot. |
| **Google Analytics 4** | Monitoring | Tracking user engagement across stages (Timeline, Eligibility, FAQ). |
| **Google Charts** | Visualization | Rendering 2024 Lok Sabha results and phase-wise turnout data. |
| **Google Maps Embed** | Geospatial | Interactive locator for the Election Commission headquarters. |
| **Google Translate** | Accessibility | Real-time translation into 10 Indian languages (Hindi, Bengali, Tamil, etc.). |
| **Google Cloud Functions** | Backend | Secure proxy for Gemini API keys and server-side validation. |
| **Firebase Realtime DB** | Database | Anonymous storage for the live visitor counter and chatbot metrics. |
| **Google AI Studio** | Developer Tool | Fine-tuning the chatbot's system instructions and model parameters. |
| **Google Fonts** | Design | Modern typography (Inter and Poppins) for maximum readability. |
| **Search Console** | SEO | Sitemap and indexing optimization for voter-related queries. |
| **Workbox (PWA)** | Performance | Service Worker caching for instant loads and offline accessibility. |

## File Structure

```text
/
├── assets/             # SVG icons and Ashoka Chakra
├── css/
│   ├── style.css       # Global design system & typography
│   ├── components.css  # Modular UI (Cards, Chatbot, Accordions)
│   └── animations.css  # Saffron/Green transitions & motion
├── js/
│   ├── data.js         # Immutable election content (Timeline/FAQ)
│   ├── config.js       # API configurations (GitIgnored)
│   ├── utils.js        # XSS sanitization & helpers
│   ├── chatbot.js      # Gemini 2.5 Flash implementation
│   ├── charts.js       # Google Charts rendering logic
│   ├── eligibility.js  # 4-step eligibility wizard
│   ├── firebase.js     # Analytics & Visitor counter
│   └── tests.js        # 14-group automated test suite
├── index.html          # Semantic HTML5 & Strict CSP security
├── sw.js               # PWA Service Worker (Cache-first)
├── manifest.json       # PWA Installability configuration
└── app.yaml            # Google Cloud App Engine config
```

## Backend & Core Logic

### 1. The "Security First" Logic
- **Backend Proxy**: Gemini API requests are routed through a secure Google Cloud Function. This keeps the API key entirely out of the client-side code.
- **Strict CSP**: A strict Content Security Policy blocks `unsafe-inline` and `unsafe-eval` (except where required by Google libraries) to prevent XSS.
- **XSS Sanitization**: All user input in the chatbot and eligibility checker is sanitized both client-side and server-side before processing.

### 2. AI Intelligence (Gemini 2.5 Flash)
- **Context Injection**: The chatbot uses a hidden `SYSTEM_PROMPT` containing the Representation of the People Act rules.
- **Safety Filters**: Logic in `chatbot.js` blocks political endorsements and restricts answers to election-related topics.

### 3. PWA & Offline Strategy
- **Service Worker**: Uses a `CacheFirst` strategy for static assets and `NetworkFirst` for the main document.
- **Data Persistence**: Voter eligibility results are stored in `localStorage` for continuity.

## Run Tests

Open URL with `?test=true` and check browser console. All 14 test groups must show PASS.

## Deploy

```bash
gcloud app deploy --project=election-guide-promptwar --quiet
```

## About

Built for **Google PromptWars Virtual 2026**.
Validated against WCAG 2.1 AA Accessibility standards.
Verified for SEO and PWA installability.
