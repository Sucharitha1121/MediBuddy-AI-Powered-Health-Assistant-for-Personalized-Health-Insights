# MediBuddy – AI-Powered Health Assistant for Personalized Health Insights

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://golang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## Project Overview

**MediBuddy** is an AI-powered healthcare assistant designed to provide **personalized health insights** by analyzing user medical records and external medical knowledge sources. It leverages OCR, NLP, and RAG-based LLM technologies to make healthcare data more accessible and actionable.  

---

## Key Features

- **Image Reports:** Extracted using Python + Tesseract OCR  
- **PDF Reports:** Parsed with Upstage AI  
- **Knowledge Base:** Gale Encyclopedia loaded via PyPDFLoader and stored as embeddings in Pinecone  
- **Embeddings:** Text converted using all-MiniLM-L6-v2  
- **AI Chatbot:** Mistral-7B-Instruct-v0.3 via Together AI for personalized responses  

---

## Tech Stack

| Layer        | Technology                                      |
|-------------|------------------------------------------------|
| Backend      | Go, PostgreSQL                                  |
| Frontend     | React, Tailwind CSS                             |
| AI & NLP     | Python, Tesseract OCR, Upstage AI, Together AI |
| Vector Store | Pinecone                                       |
| Embeddings   | all-MiniLM-L6-v2                               |

---

## How It Works

1. Users upload **medical reports** in **image (JPG, PNG)** or **PDF** formats.  
2. **OCR** extracts text from images, and PDFs are parsed using **Upstage AI**.  
3. Extracted medical data is stored in **PostgreSQL**.  
4. The **knowledge base** (Gale Encyclopedia) is processed into **vector embeddings** and stored in **Pinecone**.  
5. When a user asks a question:  
   - The system retrieves the **user’s medical data** from PostgreSQL.  
   - Retrieves **relevant knowledge snippets** from Pinecone embeddings.  
   - Combines both as context using **RAG** and sends it to the **Mistral-7B-Instruct-v0.3 chatbot**.  
6. The chatbot generates a **personalized, context-aware answer** based on both the user’s data and external knowledge.  

---


## Getting Started

1. Clone the repository:  
```bash
git clone https://github.com/Sucharitha1121/MediBuddy-AI-Powered-Health-Assistant-for-Personalized-Health-Insights.git
