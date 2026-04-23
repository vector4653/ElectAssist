This README is designed to highlight your technical proficiency (TypeScript/React) and your ability to integrate complex Google services. It’s structured to make a hackathon judge’s job easy by mapping directly to their evaluation criteria.

---

# 🗳️ Electi-Smart: The AI-Driven Civic Assistant

**Electi-Smart** is a smart, context-aware digital assistant designed to bridge the gap between complex election bureaucracies and the everyday voter. Developed for the **2026 Hackathon**, it leverages the **Google Cloud Ecosystem** to provide personalized, real-time guidance on the election process.

---

## 🎯 Hackathon Criteria Alignment

### 1. Smart, Dynamic Assistant
Built with **Gemini 1.5 Pro**, the assistant doesn't just provide static FAQs. It uses **RAG (Retrieval-Augmented Generation)** to ingest live election manifestos and official PDFs, providing summarized, cited, and unbiased answers to specific user queries.

### 2. Logical Decision Making (User Context)
The app utilizes a **Contextual Router** that adapts the UI and information flow based on:
* **Voter Persona:** First-time voters see "Registration 101," while seasoned voters get "Constituency Performance" deep-dives.
* **Geospatial Context:** Automatically detects constituency to serve localized candidate data and polling logistics.

### 3. Effective Use of Google Services
* **Google Civic Information API:** Source of truth for candidate data and polling locations.
* **Google Maps Platform:** Provides real-time navigation and wait-time estimates for booths.
* **Gemini API (Vertex AI):** Powers the core conversational intelligence and manifesto summarization.
* **Google Calendar API:** Enables one-tap reminders for registration and voting deadlines.
* **Google Cloud Translation:** Ensures inclusivity across 10+ regional languages.

### 4. Practical & Real-World Usability
* **Offline-First (PWA):** Essential for low-connectivity areas near polling booths.
* **Low-Cognitive Load UI:** Information is broken down into interactive "Roadmap" cards rather than dense text.

### 5. Clean & Maintainable Code
* **TypeScript-First:** Ensures type safety across the entire data flow.
* **Modular Layered Architecture:** Separate concerns for API Services, UI Components, and AI Logic.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, Tailwind CSS, Framer Motion (for interactive timelines).
* **Backend:** Node.js, TypeScript, Express.
* **AI/ML:** Gemini 1.5 Pro, LangChain (for RAG orchestration).
* **Database/Auth:** Firebase (Firestore & Auth).

---

## 📂 Project Structure

```text
├── src/
│   ├── api/             # Google Civic & Maps API integrations
│   ├── components/      # UI components (Atomic Design)
│   ├── hooks/           # Custom React hooks (e.g., useVoterContext)
│   ├── services/        # Gemini AI logic and RAG pipelines
│   └── store/           # Global state management for user context
├── public/              # Static assets & PWA manifest
├── .env.example         # Template for Google Cloud API keys
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
* Node.js v20+
* Google Cloud Project (with Gemini, Maps, and Civic APIs enabled)

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourUsername/electi-smart.git
    cd electi-smart
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Create a `.env` file in the root directory:
    ```env
    VITE_GOOGLE_MAPS_API_KEY=your_key_here
    VITE_GEMINI_API_KEY=your_key_here
    VITE_CIVIC_INFO_API_KEY=your_key_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🛡️ Security & Ethics
* **Data Privacy:** Personal voter data is stored locally and never used to train external AI models.
* **Neutrality:** The AI is strictly constrained to source-only responses to prevent political hallucination or bias.

---

**Developed with ❤️ for the 2026 Hackathon.**