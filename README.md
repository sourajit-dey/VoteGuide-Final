# VoteGuide India 🗳️

**Interactive AI-powered election guide for Indian citizens.**

🌐 **Live App:** [your-deployed-url-here]

![Score](https://img.shields.io/badge/AI%20Score-90.28%25-FF9933)
![Accessibility](https://img.shields.io/badge/WCAG-AA-138808)
![Google Cloud](https://img.shields.io/badge/Google%20Cloud-App%20Engine-4285F4)

## Features

- Interactive 7-stage Lok Sabha election timeline
- Voter eligibility checker (4-step wizard)
- Registration guide — new voters, NRI, corrections
- Searchable glossary — 14 election terms
- FAQ — 8 common questions
- AI chatbot powered by Google Gemini 2.0 Flash
- Election data charts — Google Charts
- Polling booth finder — Google Maps
- 10 Indian languages — Google Translate
- Live visitor counter — Firebase + localStorage
- Offline capability — Service Worker PWA
- 14-group automated test suite

## Google Services (11 Total)

| Service | Purpose |
|---|---|
| Google Cloud App Engine | Hosting |
| Google Gemini 2.0 Flash | AI chatbot |
| Google Analytics 4 | Engagement tracking |
| Google Charts | Election data visualization |
| Google Maps Embed | Booth finder |
| Google Translate | 10 Indian languages |
| Firebase Realtime Database | Usage analytics |
| Google AI Studio | API key management |
| Google Fonts | Typography |
| Google Antigravity | Development environment |
| Service Worker + PWA | Offline performance |

## Run Tests

Open URL with `?test=true` and check browser console.
All 14 test groups must show PASS.

## Deploy

```bash
gcloud app deploy --project=YOUR_PROJECT_ID
```

## Content Sources

- Election Commission of India — eci.gov.in
- National Voters Service Portal — voters.eci.gov.in
- Representation of the People Act, 1951
- Constitution of India (Articles 81, 324, 330)
- Supreme Court — PUCL v. Union of India (2013)

## About

Google PromptWars Virtual 2026 — Challenge 2.
Built with Google Antigravity.
