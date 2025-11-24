# ovAI ✨

ovAI is a modern, AI-powered healthcare application designed to be your comprehensive wellness companion. Built with React, TypeScript, and Supabase, it offers a suite of intelligent tools to help users manage their health, fitness, nutrition, and mental well-being.

## ✨ Features

ovAI provides a rich, multi-faceted healthcare experience through a variety of specialized tools:

🏥 **Healthcare Management**: Track symptoms, manage medications, and access hospital maps with emergency support
🤰 **Pregnancy Tracking**: Monitor pregnancy progress with contraction timers, kick counters, and personalized guidance
📊 **Cycle Tracking**: Predict menstrual cycles, log symptoms, and receive personalized wellness insights
💪 **Fitness Planning**: Generate AI-powered workout plans and track your fitness journey
🥗 **Nutrition Guidance**: Get personalized meal plans and track your nutritional intake
🧠 **Mental Health Support**: Journal your thoughts, access wellness resources, and track your emotional well-being
🤖 **AI Health Assistant**: Chat with an intelligent healthcare assistant for personalized advice
👥 **Community Support**: Connect with others, share experiences, and get support from the community
🗺️ **3D Visualizations**: Interactive 3D models and visualizations for better understanding
🎤 **Voice Interaction**: Voice-powered features for hands-free health tracking and assistance

...and many more! Including emergency SOS, real-time health monitoring, and personalized wellness recommendations.

## 🛠️ Tech Stack

This project is built with a modern, powerful tech stack:

**Frontend**: React 18 with TypeScript  
**Build Tool**: Vite  
**UI Components**: Radix UI + shadcn/ui  
**Styling**: Tailwind CSS  
**State Management**: React Query  
**Backend**: Supabase  
**3D Graphics**: React Three Fiber + Three.js  
**Voice AI**: ElevenLabs React SDK  
**Routing**: React Router DOM  
**Forms**: React Hook Form & Zod  
**Real-time**: WebRTC & WebSocket

## 🚀 Getting Started

Follow these steps to get a local copy of the project up and running.

### Prerequisites

- Node.js (v18 or later)
- npm, pnpm, or yarn
- Supabase account

### 1. Set Up Environment Variables

First, you'll need to provide your own API keys for the various services used in this application.

Make a copy of the `.env.example` file and rename it to `.env`.

```bash
cp .env.example .env
```

Open the `.env` file and add your API keys:

```env
# For Supabase Backend
VITE_SUPABASE_URL="YOUR_SUPABASE_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

# For ElevenLabs Voice AI
VITE_ELEVENLABS_API_KEY="YOUR_ELEVENLABS_API_KEY"

# For Google Maps Platform (used in hospital locations)
VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
```

### 2. Install Dependencies

Navigate to the project directory and install the necessary packages.

```bash
npm install
```

### 3. Run the Development Server

You can now start the development server.

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to see the application running.

### 4. Set Up Supabase Backend

The application uses Supabase for backend services. Make sure to:

1. Create a new Supabase project
2. Run the provided SQL migrations in the `supabase/migrations/` directory
3. Deploy the Supabase Edge Functions located in `supabase/functions/`

```bash
# Deploy Supabase functions
supabase functions deploy
```

## 🧩 3D Model Details

The project includes interactive 3D visualizations and models:

### 🎨 Model Features
- **Format**: GLB (GLTF Binary) compatible
- **Rendering**: Three.js with React Three Fiber
- **Interactivity**: Mouse/touch interactions for 3D objects
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Works on all device sizes

### 🧩 Model Usage in Project
- Loaded in the frontend using GLTFLoader
- Rendered with Three.js inside a WebGL canvas
- Used for dashboard visualizations and medical illustrations
- Interactive body maps for symptom tracking

## 📌 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development mode
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## 🧰 Technical Stack Used

Below is the complete list of technologies used in your project:

### Frontend
- **React 18** – Modern UI framework
- **TypeScript** – Type-safe JavaScript
- **Vite** – Fast build tool and dev server
- **React Router DOM** – Client-side routing
- **React Query** – Server state management
- **React Hook Form** – Form management
- **Zod** – Schema validation

### UI & Styling
- **Tailwind CSS** – Utility-first CSS framework
- **ShadCN UI** – Pre-built React components
- **Radix UI** – Accessible component primitives
- **Framer Motion** – Animation library
- **Lucide React** – Icon library

### Backend & Database
- **Supabase** – Backend as a Service
- **PostgreSQL** – Database
- **Edge Functions** – Serverless functions
- **Real-time Subscriptions** – Live data updates

### 3D & Graphics
- **Three.js** – 3D graphics library
- **React Three Fiber** – React renderer for Three.js
- **React Three Drei** – Helper components for R3F

### AI & Voice
- **ElevenLabs** – Text-to-speech and voice synthesis
- **Web Speech API** – Browser-based speech recognition
- **OpenAI Integration** – AI-powered health insights

### Development Tools
- **ESLint** – Code linting
- **PostCSS** – CSS processing
- **Autoprefixer** – CSS vendor prefixes

## 📂 Project Structure

```
ovAI/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── Auth/           # Authentication components
│   │   ├── Dashboard/      # Dashboard components
│   │   ├── Healthcare/     # Healthcare features
│   │   ├── Fitness/        # Fitness components
│   │   ├── Nutrition/      # Nutrition components
│   │   └── MentalHealth/   # Mental health components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── integrations/       # External service integrations
│   └── utils/              # Helper utilities
├── supabase/
│   ├── functions/          # Edge functions
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase configuration
└── public/                 # Static assets
```

## 🏁 Deployment

### Frontend Deployment
The application is ready for deployment on any modern hosting provider:

- **Vercel** – Recommended for React apps
- **Netlify** – Static site hosting
- **AWS Amplify** – Full-stack hosting
- **Firebase Hosting** – Google's hosting solution

### Backend Deployment
- **Supabase** – Already configured for production
- **Edge Functions** – Deploy with `supabase functions deploy`

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Made with ❤️ for better healthcare and wellness.

Open `http://localhost:5173` with your browser to see the result. You can start editing the page by modifying `src/App.tsx`.