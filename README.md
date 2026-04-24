
# 🗳️ ElectAssist — Smart Voting Companion

**ElectAssist** is an AI-powered civic assistant website built for Indian voters. It helps citizens navigate elections — from understanding candidates and manifestos to finding polling booths. Developed for the **2026 Hackathon**, it leverages the **Google Cloud Ecosystem** for intelligent, multilingual guidance.

🌐 **Live:** Coming soon

---

## 🎯 Hackathon Criteria Alignment

### 1. Smart, Dynamic Assistant
Built with **Gemini 1.5 Pro**, the assistant uses **RAG (Retrieval-Augmented Generation)** to ingest live election manifestos and official PDFs, providing summarized, cited, and unbiased answers to specific user queries.

### 2. Logical Decision Making (User Context)
The website utilizes a **Contextual Router** that adapts the UI and information flow based on:
* **Voter Persona:** First-time voters see "Registration 101," while seasoned voters get "Constituency Performance" deep-dives.
* **Geospatial Context:** Automatically detects constituency to serve localized candidate data and polling logistics.

### 3. Effective Use of Google Services
* **Google Civic Information API:** Source of truth for candidate data and polling locations.
* **Google Maps Platform:** Provides real-time navigation and wait-time estimates for booths.
* **Gemini API (Vertex AI):** Powers the core conversational intelligence and manifesto summarization.
* **Google Calendar API:** Enables one-tap reminders for registration and voting deadlines.
* **Google Cloud Translation:** Ensures inclusivity across 9+ regional languages.
* **Firebase:** Authentication (Email/Password + Google Sign-In) and Firestore database.

### 4. Practical & Real-World Usability
* **Offline-First (PWA):** Essential for low-connectivity areas near polling booths.
* **Multilingual:** Supports English, Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, and Malayalam.
* **Low-Cognitive Load UI:** Information is broken down into interactive cards with smooth scroll animations.

### 5. Clean & Maintainable Code
* **TypeScript-First:** Ensures type safety across the entire data flow.
* **Modular Layered Architecture:** Separate concerns for API Services, UI Components, and AI Logic.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion.
* **Backend:** Firebase (Firestore & Authentication).
* **AI/ML:** Gemini 1.5 Pro, LangChain (for RAG orchestration).
* **Internationalization:** react-i18next (9 Indian languages).
* **Build Tool:** Vite.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/      # Reusable UI components (Navbar, ScrollSection, LanguageSelector)
│   ├── context/         # React Context (AuthContext)
│   ├── firebase/        # Firebase configuration
│   ├── i18n/            # Internationalization setup
│   │   ├── locales/     # Translation JSON files (en, hi, bn, ta, te, mr, gu, kn, ml)
│   │   └── index.ts     # i18next config + state-language mapping
│   ├── pages/           # Page components (Landing, Login, Register, Dashboard)
│   ├── App.tsx          # Root component with routing
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles & design system
├── public/              # Static assets
├── .env.example         # Template for environment variables
├── index.html           # HTML template with Google Fonts
└── README.md
```

---

## ⚡ Getting Started

### Prerequisites
* Node.js v20+
* A Firebase project (see Firebase Setup below)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vector4653/ElectAssist.git
    cd ElectAssist
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Copy `.env.example` to `.env` and fill in your Firebase credentials:
    ```bash
    cp .env.example .env
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🔥 Firebase Setup

If you're new to Firebase, follow these steps:

1.  Go to [Firebase Console](https://console.firebase.google.com/) and click **"Create a project"**.
2.  Name your project (e.g., `electassist`) and follow the prompts.
3.  In the project dashboard, click the **Web icon (</>) ** to add a web app.
4.  Register the app and copy the config values into your `.env` file:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```
5.  **Enable Authentication:**
    - Go to **Build → Authentication → Sign-in method**
    - Enable **Email/Password** and **Google** providers
6.  **Enable Firestore:**
    - Go to **Build → Firestore Database**
    - Click **Create database** → Start in **test mode**

---

## 🌐 Supported Languages

| Language | Code | Native Name |
|----------|------|-------------|
| English | `en` | English |
| Hindi | `hi` | हिन्दी |
| Bengali | `bn` | বাংলা |
| Tamil | `ta` | தமிழ் |
| Telugu | `te` | తెలుగు |
| Marathi | `mr` | मराठी |
| Gujarati | `gu` | ગુજરાતી |
| Kannada | `kn` | ಕನ್ನಡ |
| Malayalam | `ml` | മലയാളം |

---

## 🛡️ Security & Ethics
* **Data Privacy:** Personal voter data is stored locally and never used to train external AI models.
* **Neutrality:** The AI is strictly constrained to source-only responses to prevent political hallucination or bias.

---

**Developed with ❤️ for India | 2026 Hackathon Project**
