# Flow Reactor

**A personalized flow-activation experience for Whop communities.**

Flow Reactor helps your community members achieve flow state through personalized ignition sequences tailored to their mental patterns. Each user selects their reactor type, completes a customized question set, and activates focused work sessions.

## ✨ Features

### Personalized Flow Types
- **Type A - Overthinker / Noisy Mind**: For those with racing thoughts
- **Type B - Momentum Type**: For those who struggle to start
- **Type C - Purpose-Driven**: For those lacking motivation
- **Type D - Structure / Clarity**: For those feeling overwhelmed
- **Type E - Distraction-Prone**: For those easily pulled away

### Core Functionality
- 🎯 **Onboarding**: Flow type selection
- 🔥 **Ignition Sequence**: Dynamic question sets based on reactor type
- ⏱️ **Flow Activation**: Persistent timer sessions across tabs/devices
- 📝 **Reflection**: Post-session analysis with alignment scoring
- 📊 **Dashboard**: Progress tracking, streaks, and insights
- 🛡️ **Focus Shield**: Distraction blocking during active sessions

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_WHOP_APP_ID=your_app_id
WHOP_API_KEY=your_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id
```

### 3. Run Development Server

```bash
pnpm dev
```

## 📁 Project Structure

```
├── app/
│   ├── onboarding/          # Flow type selection
│   ├── reactor/              # Main ignition sequence
│   ├── focus/                # Active session timer
│   ├── reflection/           # Post-session reflection
│   ├── logs/                 # Session history
│   └── dashboard/            # Insights dashboard
├── lib/
│   ├── flow-reactor-types.ts      # Flow types & question sets
│   ├── flow-type-storage.ts       # User flow type persistence
│   ├── flow-reactor-intake.ts     # Intake system
│   ├── flow-reactor-logs.ts       # Session logging
│   └── flow-reactor-session.ts    # Session management
└── components/
    └── focus/                # Focus overlay & shield
```

## 🎨 Customization

Edit `app.config.ts` to customize:
- App name and branding
- Theme colors
- Feature toggles
- Pricing tiers

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy!

The app will be available at your Vercel URL.

## 📚 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Whop SDK** - Integration with Whop platform
- **LocalStorage** - Client-side persistence

## 📄 License

MIT License - See LICENSE file for details

---

**Flow Reactor** - Personalized flow activation. Enter the reactor.

