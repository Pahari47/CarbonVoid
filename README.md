# CarboVoid 🌿: Make Every Byte Count  

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/carbovoid)](https://github.com/yourusername/carbovoid/stargazers)  

**An AI-powered platform to track, analyze, and reduce your digital carbon footprint.**  

---

## 🎥 Demo Preview   

[Coming Soon](#)  

---

## ✨ Why CarboVoid?  
Digital activities emit **1.6 billion tons of CO₂ yearly** (equivalent to global aviation!). CarboVoid helps you:  
- 📊 **Visualise** hidden emissions from streaming, cloud storage, and emails.  
- 🤖 **Automate** carbon savings with AI-powered agents.  
- 🌱 **Act** on personalised, region-aware green suggestions.  

---

## 🧠 AI-Powered Intelligence  
| **Agent**               | **Function**                                      | **Tech Used**                |  
|-------------------------|---------------------------------------------------|------------------------------|  
| `DeclutterAgent`        | Finds & deletes redundant cloud/email data        | LangChain.js + Mistral (Ollama) |  
| `GreenSuggestionAgent`  | Recommends low-carbon alternatives in real-time   | Google Generative AI         |  
| `CarbonChatBot`         | Answers sustainability queries conversationally   | GROQ API + Mistral           |  


---

## 🛠️ Tech Stack  
### **Frontend**  
<div align="center">  
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black" />  
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css" />  
  <img src="https://img.shields.io/badge/Chart.js-FF6384?logo=chart.js" />  
</div>  

### **Backend**  
<div align="center">  
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js" />  
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma" />  
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql" />  
</div>  

### **AI/APIs**  
<div align="center">  
  <img src="https://img.shields.io/badge/Google_Generative_AI-4285F4?logo=google" />  
  <img src="https://img.shields.io/badge/Ollama-FF6600?logo=ollama" />  
  <img src="https://img.shields.io/badge/LangChain.js-FF6B6B" />  
</div>  

---

## 🚀 Key Features  
| Feature                | Description                                                                 |  
|------------------------|-----------------------------------------------------------------------------|  
| **Real-Time Dashboard** | Live emission graphs (Chart.js) + PDF reports (PdfKit).                     |  
| **Browser Extension**  | Tracks YouTube/Gmail/Zoom usage (JavaScript). *More platforms coming soon!* |  
| **AI Suggestions**     | "Switch to audio-only on YouTube" → saves **0.5kg CO₂/week**.               |  

---

## ⚡ Quick Start  
### 1. Clone & Install  
```  
git clone hhttps://github.com/Pahari47/CarbonVoid 


cd backend
npm install
npx prisma migrate dev
npx prisma generate
Ollama run mistral
Ollama pull mistral
npm run dev  


cd Frontend
npm install
npm run dev


cd browser-extension
npm install
npm run build


setup enviroment

echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/carbovoid"  
GEMINI_API_KEY="your_key"  
VITE_CLERK_PUBLISHABLE_KEY="your_key"' > .env  
CLERK_SECRET_KEY="your_key  
GROQ_API_KEY="your_key"  
 


📈 Future Roadmap
🔌 API Integrations: E-mail, Cloud Storage, Netflix, Zoom.

📱 Mobile App: ios/Android emission tracking.

🌍 Carbon Offset Marketplace: Buy offsets directly.

