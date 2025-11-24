# ovAI

A modern React + TypeScript application built with Vite, featuring:

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Backend**: Supabase
- **3D Graphics**: React Three Fiber
- **Voice AI**: ElevenLabs React SDK
- **Routing**: React Router DOM

## Features

- Modern UI with shadcn/ui components
- Real-time data with Supabase
- 3D visualizations with Three.js
- Voice AI capabilities
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mohammedsanin/ovAI.git
cd ovAI
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Add your Supabase and ElevenLabs credentials to .env
```

4. Start the development server
```bash
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## License

MIT License