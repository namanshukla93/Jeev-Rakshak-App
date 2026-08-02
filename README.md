# 🐾 Jeev Rakshak: AI-Powered Stray Animal Rescue Platform

Jeev Rakshak is an intelligent, real-time dispatch and rescue management system designed to save injured stray animals. It bridges the gap between everyday citizens reporting emergencies and local NGOs/clinics responding to them.

![Jeev Rakshak Banner](https://image.thum.io/get/width/1200/crop/600/https://jeev-rakshak-web.vercel.app/)

## 🚀 Live Demo
**Production URL:** [https://jeev-rakshak-web.vercel.app](https://jeev-rakshak-web.vercel.app)

---

## 🌟 Key Features

### 1. 🚨 Real-Time Emergency Reporting
- **Instant Reports**: Anyone can upload a photo and location of an injured stray animal.
- **AI Diagnostics**: Powered by **Google Gemini**, the system instantly analyzes the photo to identify the species, assess the injury severity, determine urgency (HIGH/MEDIUM/LOW), and provide immediate safety instructions.

### 2. 🗺️ Smart Location & Routing
- **Nearby NGOs**: Integrated with **Google Maps & Places API** to automatically locate nearby veterinary clinics and animal rescue NGOs.
- **Multi-Select Dispatch**: Users can select multiple clinics within their vicinity to broadcast the rescue request.

### 3. 📲 Automated SMS Dispatch (Twilio)
- **Instant Alerts**: As soon as a report is filed, selected NGOs receive an automated, formatted SMS alert with emergency details and a link to their dashboard.
- **Status Updates**: NGOs receive SMS confirmations upon accepting a dispatch and resolving a case.

### 4. 🏥 NGO Command Center
- **Secure Portal**: Supabase Authentication ensures only verified NGOs can access the dashboard.
- **Live Monitoring**: NGOs can view a real-time feed of active emergencies in their area.
- **Actionable Workflows**: 
  - ✅ **Confirm Dispatch**: NGOs accept a case, immediately notifying other clinics that help is on the way.
  - 🩺 **Update Condition**: After a 30-minute treatment window, NGOs submit post-treatment photos and condition reports.
  - 💬 **Quick SMS Tool**: A built-in messaging suite allows NGOs to send custom alerts (e.g., "Ambulance Dispatched", "Vet Needed") to their drivers directly from the UI.

---

## 💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Vanilla CSS (Glassmorphism, Responsive UI)
- **Backend**: Next.js API Routes (Serverless)
- **Database & Auth**: Supabase (PostgreSQL, Storage, Authentication)
- **AI Integration**: Google Gemini 1.5 Flash (Vision & Text capabilities)
- **Communications**: Twilio API (SMS)
- **Maps**: Google Maps JavaScript API, Google Places API
- **Deployment**: Vercel

---

## 📸 Screenshots

### Public Reporting Flow
*(Emergency reporting interface with AI diagnostics)*
![Report Flow](https://image.thum.io/get/width/1200/crop/800/https://jeev-rakshak-web.vercel.app/report)

### NGO Dispatch Dashboard
*(Secure portal for verified NGOs)*
![NGO Dashboard](https://image.thum.io/get/width/1200/crop/800/https://jeev-rakshak-web.vercel.app/ngo/login)

### Web Application Overview
*(Public landing page and access points)*
![SMS Tool](https://image.thum.io/get/width/1200/crop/800/https://jeev-rakshak-web.vercel.app/)

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Supabase Account
- Twilio Account (with a verified sender number or paid credits)
- Google Cloud Console Account (for Gemini & Maps APIs)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/jeev-rakshak-web.git
   cd jeev-rakshak-web
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # AI
   GEMINI_API_KEY=your_gemini_api_key

   # Google Maps
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

   # Twilio SMS
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   *The application will be running at [http://localhost:3000](http://localhost:3000)*

---

## 🗄️ Database Schema (Supabase)

To replicate the database, run the following SQL command in your Supabase SQL Editor:

```sql
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    location TEXT NOT NULL,
    analysis JSONB,
    image_url TEXT,
    assigned_ngo TEXT DEFAULT 'BROADCASTED',
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'RESOLVED')),
    accepted_at TIMESTAMP WITH TIME ZONE,
    post_treatment_report TEXT,
    post_treatment_image_url TEXT
);
```

*Ensure that you also create a Storage Bucket named `reports` with public read access to store the uploaded images.*

---

## 🛡️ License
This project is for demonstration and non-profit use aiming to help local animal rescue operations.
