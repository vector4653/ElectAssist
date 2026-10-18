# 🗳️ ElectAssist — Project Progress & Next Steps

> **Live Deployment:** [elect-assist-six.vercel.app](https://elect-assist-six.vercel.app/)  
> **Contact / Contributions:** [ritviknambiar09@gmail.com](mailto:ritviknambiar09@gmail.com)

---

## 📌 Project Overview
**ElectAssist** is an AI-powered civic engagement and electoral intelligence platform designed specifically for Indian citizens. It simplifies complex democratic processes, offering unbiased candidate and party insights, sector-wise policy comparisons, persona-tailored voter journeys, and multilingual AI assistance across 9 Indian languages.

---

## ✅ What Has Been Completed So Far

### 1. Core Architecture & Foundations
- **Modern Web Stack:** Built with React 19, TypeScript 6.0, Vite 8, and Tailwind CSS v4.
- **Project Structure:** Modularized architecture cleanly separating UI components, pages, context providers, data models, internationalization, and backend serverless endpoints.
- **Fast Build & Production Readiness:** Optimized bundling and code splitting, building cleanly in under 500ms.

### 2. User Authentication & Profile Management
- **Firebase Authentication:** Seamless integration with Email/Password and Google Sign-In.
- **Cloud Firestore Storage:** Stores and synchronizes user profiles, including full name, home state, age, Voter ID (EPIC), and onboarding status.
- **Interactive Modals:**
  - **Onboarding Modal:** Guides newly registered voters to personalize their civic experience based on age, voting eligibility, and state.
  - **Edit Profile Modal:** Allows users to easily update their state, age, and voter details at any time with real-time UI synchronization.

### 3. Multilingual Support (9 Indian Languages)
- Powered by `react-i18next` with state-to-language mappings and persistent language selection.
- Complete localized translations for:
  - **English (`en`)**
  - **Hindi (`hi`)** — हिन्दी
  - **Bengali (`bn`)** — বাংলা
  - **Tamil (`ta`)** — தமிழ்
  - **Telugu (`te`)** — తెలుగు
  - **Marathi (`mr`)** — मराठी
  - **Gujarati (`gu`)** — ગુજરાતી
  - **Kannada (`kn`)** — ಕನ್ನಡ
  - **Malayalam (`ml`)** — മലയാളം
- Instant on-the-fly language switching via the navigation bar.

### 4. Interactive 3D Geospatial Visualization (India Globe)
- Built with **Three.js**, **React Three Fiber**, and **Drei**.
- Ingests TopoJSON boundary maps to render an interactive 3D globe and 2D regional projections.
- Allows users to hover, inspect, and click Indian states to reveal state-specific governance data, ruling coalitions, and assembly seats.

### 5. Persona-Based Voter Routing & Dashboard
- **First-Time Voter Roadmap (`/roadmap`):**
  - Tailored experience for young/new voters with interactive scroll paths and milestone cards.
  - Explains voter rights, how the parliamentary system works, and step-by-step registration guidance.
- **Civic Intelligence Dashboard (`/dashboard`):**
  - Visual breakdown of ruling parties, opposition, and key state metrics.
  - **Sector-by-Sector Issue Comparison:** Interactive matrix comparing major parties across key national themes: Agriculture, Economy, Healthcare, Education, Infrastructure, and Employment.

### 6. Seamless Navigation & Clean UI
- **Fixed Hamburger Menu:** Restored a clean, uncluttered navbar layout featuring the ElectAssist logo on the left, language selector, and hamburger icon on the right.
- **Account Dropdown:** Clicking the hamburger icon opens a floating profile card showing user details (name, email, state, voter ID, age), quick edit button, and logout action.
- **Layering & Z-Index Polishing:** Resolved modal and drawer layering collisions to ensure dropdowns and modals float gracefully above all 3D canvas and dashboard elements.

### 7. Secure ElectAssist AI Backend (Gemini Serverless Function)
- **Eliminated Client-Side Key Exposure:** Replaced browser-exposed `VITE_GEMINI_API_KEY` with a secure serverless backend route (`/api/gemini`) running on Vercel.
- **Zero TypeScript Compilation Errors:** Created dedicated `tsconfig.api.json` with Node typings and ambient declarations for `process.env`, resolving build error `TS2591`.
- **Model Fallback Strategy:** Configured dynamic candidate models (`gemini-2.5-flash`, `gemini-flash-latest`, `gemini-2.5-flash-lite`) with automated failover, ensuring 100% uptime even during Google API deprecations.
- **Strict Neutrality & Multilingual Responses:** Enforces system instructions for non-partisan, factual civic assistance that automatically responds in the user's selected Indian language.

---

## 🚀 What We Are Planning To Do Next

### 1. Ingest & Utilize Datasets from IndianDataProject.org
- **Objective:** Connect real-world historical and current electoral datasets from [indiandataproject.org](https://indiandataproject.org/).
- **Implementation Plan:**
  - Ingest constituency-level election results, voter turnouts, and demographic trends.
  - Display candidate dossiers: educational background, declared assets, criminal record affidavits (ADR data), and previous tenure performance.
  - Enable interactive constituency search so voters can view past election margins and contenders in their exact constituency.

### 2. Make the UI More Functional & Intuitive
- **Objective:** Elevate user experience, visual hierarchy, and interactive usability across desktop and mobile devices.
- **Implementation Plan:**
  - Add search and multi-facet filtering for candidates (filter by party, educational qualification, age, and clean track record).
  - Implement interactive comparison tables and charts for party manifestos and state fiscal performance metrics.
  - Smooth out drawer animations, optimize 3D canvas render performance on lower-end mobile devices, and improve touch ergonomics.

### 3. Upgrade ElectAssist AI with Real-Time News & Live Electoral Updates
- **Problem:** AI models rely on pre-trained cutoff knowledge and cannot natively answer questions about breaking news, newly announced election dates, candidate changes, or recent policy declarations.
- **Proposed Solutions & Implementation Plan:**
  - **Gemini Google Search Grounding:** Enable the Google Grounding tool on the Gemini serverless API so the AI automatically searches Google for the latest verified news before answering queries.
  - **Live Civic News Feed Ingestion:** Integrate verified election news feeds (e.g., Election Commission of India press releases, PIB India, and trusted national news RSS feeds).
  - **Retrieval-Augmented Generation (RAG):** Store recent electoral announcements and manifestos in a lightweight vector index to feed up-to-the-minute context directly into the AI prompt.

### 4. Implement Booth Finder Using General Election to Lok Sabha 2024 Statistical Reports Data (OGD India)
- **Objective:** Enable voters to accurately find their designated polling booth using the official Open Government Data (OGD India) statistical reports from the 2024 Lok Sabha elections.
- **Implementation Plan:**
  - Parse and normalize the General Election to Lok Sabha 2024 Statistical Reports published on [data.gov.in (OGD India)](https://data.gov.in/).
  - Build a structured database mapping Parliamentary Constituencies (PC) and Assembly Segments (AC) to specific polling stations, booth numbers, and locations.
  - Create a user-friendly **"Polling Booth Finder"** interface:
    - Search by Voter ID (EPIC number), Pincode, or Constituency name.
    - View designated booth details, address, and interactive map directions.
    - Provide key booth accessibility information (wheelchair ramps, shade, drinking water, and special assistance counters).

---

## 📬 Contributing & Feedback
ElectAssist is an open civic initiative. If you want to contribute, collaborate, or suggest new features, please reach out to **Ritvik Nambiar** at:
📧 **[ritviknambiar09@gmail.com](mailto:ritviknambiar09@gmail.com)**
