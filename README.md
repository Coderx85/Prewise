# Prewise - AI-Powered Interview Practice Platform

Prewise is an interactive platform that helps users practice and improve their interviewing skills through AI-powered mock interviews.

## Features

- 🤖 AI-powered interviewer using Vapi for realistic conversations
- 💬 Real-time speech recognition and synthesis
- 📊 Detailed feedback and scoring on:
  - Communication Skills
  - Technical Knowledge 
  - Problem-Solving Ability
  - Cultural & Role Fit
  - Confidence & Clarity
- 📱 Responsive design for desktop and mobile
- 🔐 Secure authentication via Clerk
- 🎯 Progress tracking across multiple practice sessions

## Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Database:** Drizzle ORM with Neon Database
- **Authentication:** Clerk
- **AI Integration:** Vapi AI, Google AI

## Getting Started

1. Clone the repository
```sh
git clone https://github.com/Coderx85/Prewise.git
cd prewise
```

2. Install dependencies
```sh
pnpm install
```

3. Set up environment variables
```sh
cp .env.example .env.local
```

4. Start the development server
```sh
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm fix` - Fix linting and formatting issues