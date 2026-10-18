# 🗳️ ElectAssist — Smart Civic & Voting Companion for India

> An intelligent, multilingual, and unbiased digital voting companion designed to help Indian citizens make informed democratic decisions.

🌐 **Live Website:** [elect-assist-six.vercel.app](https://elect-assist-six.vercel.app/)  
📬 **Contact & Contributions:** [ritviknambiar09@gmail.com](mailto:ritviknambiar09@gmail.com)

---

## 💡 What is ElectAssist?

India has over 968 million registered voters across 28 states and 8 union territories, speaking dozens of languages and evaluating thousands of candidates across diverse political manifestos. However, citizens often face several critical challenges during elections:
- **Information Overload & Bias:** Scattered, partisan, or unverified claims make it difficult to evaluate candidates objectively.
- **Language Barriers:** Official manifestos and policy debates are often unavailable in regional vernaculars.
- **First-Time Voter Friction:** Young and newly eligible citizens struggle to understand the voting process, constitutional roles, and registration steps.
- **Polling Logistics:** Finding designated polling booths and verified candidate backgrounds remains cumbersome.

**ElectAssist** bridges this gap by acting as a modern, AI-powered civic platform that provides unbiased political intelligence, sector-wise policy breakdowns, geospatial exploration, and instant multilingual conversational support.

---

## ✨ Key Features

### 1. 🤖 ElectAssist AI — Civic Copilot
- Powered by advanced Gemini models running through a secure, private serverless backend.
- Provides neutral, cited, and factual explanations of electoral processes, constitutional mechanisms, and party manifestos.
- Strictly adheres to non-partisan civic assistance and automatically converses in the voter's preferred Indian language.

### 2. 🇮🇳 Interactive 3D India Globe & State Governance View
- Built with Three.js and React Three Fiber to visualize India's political landscape in 3D.
- Ingests TopoJSON boundary maps with dynamic zoom and state selection.
- Provides detailed overviews of state governments, current ruling coalitions, chief ministers, and assembly seat distributions.

### 3. 🗺️ Personalized Voter Persona Journeys
- **First-Time Voters (`/roadmap`):** An interactive step-by-step roadmap tailored for new voters. Demystifies voting eligibility, registration requirements, voter rights, and the significance of their vote.
- **Seasoned Voters (`/dashboard`):** An analytical dashboard highlighting key governance metrics, upcoming elections, and candidate tracking.

### 4. 📊 Sector-by-Sector Manifesto & Issue Comparison
- Compares major political parties side-by-side across crucial national sectors:
  - **🌾 Agriculture & Farmers' Welfare**
  - **💼 Economy & Taxation**
  - **🏥 Healthcare & Public Health**
  - **🎓 Education & Skilling**
  - **🏗️ Infrastructure & Transportation**
  - **👷 Employment & Labor Reforms**

### 5. 🌐 Native Multilingual Support (9 Indian Languages)
ElectAssist is built from the ground up for linguistic accessibility, supporting real-time translation across 9 languages:
- **English** (`en`)
- **हिन्दी** (Hindi - `hi`)
- **বাংলা** (Bengali - `bn`)
- **தமிழ்** (Tamil - `ta`)
- **తెలుగు** (Telugu - `te`)
- **मराठी** (Marathi - `mr`)
- **ગુજરાતી** (Gujarati - `gu`)
- **ಕನ್ನಡ** (Kannada - `kn`)
- **മലയാളം** (Malayalam - `ml`)

### 6. 🔐 Secure & Modern Cloud Architecture
- **Firebase Authentication & Firestore:** Seamless Google Sign-In and email login with persistent voter profile synchronization.
- **Serverless Backend Security:** All AI model interactions run through a protected serverless API (`/api/gemini`) hosted on Vercel, ensuring API credentials remain confidential and protected from browser exposure.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 6.0, Vite 8 |
| **Styling & Design** | Tailwind CSS v4, Framer Motion |
| **3D & Geospatial** | Three.js, React Three Fiber, Drei, TopoJSON |
| **Artificial Intelligence** | Google Gemini (2.5 Flash / Flash Latest) via Generative AI SDK |
| **Authentication & Database** | Firebase Authentication, Cloud Firestore |
| **Localization (i18n)** | react-i18next with regional language detection |
| **Cloud Hosting & Serverless** | Vercel Serverless Functions |

---

## 🤝 Interested in Contributing?

ElectAssist is an open civic tech initiative dedicated to strengthening democratic participation. Whether you are interested in:
- Integrating official electoral datasets (e.g., from [indiandataproject.org](https://indiandataproject.org/) or [data.gov.in](https://data.gov.in/)),
- Improving UI/UX accessibility and mobile responsiveness,
- Connecting real-time election news feeds and Google Search Grounding to the AI assistant, or
- Helping expand vernacular language support and polling booth locator features:

Please reach out directly to **Ritvik Nambiar** at:  
📧 **[ritviknambiar09@gmail.com](mailto:ritviknambiar09@gmail.com)**

---

**Developed with ❤️ for Indian Citizens and Democratic Empowerment.**
