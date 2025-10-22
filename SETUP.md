# Whop App Setup Guide

Welcome to your new Whop app! This guide will help you get started quickly and easily.

## 🚀 Quick Start

### 1. Install Dependencies

First, make sure you have Node.js installed, then install the project dependencies:

```bash
# Install dependencies
pnpm install

# Or if you prefer npm
npm install
```

### 2. Set Up Your Whop App

1. Go to your [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
2. Create a new app in the Developer section
3. In the "Hosting" section, configure these paths:
   - **Base URL**: Set to your deployment domain (e.g., `https://yourapp.vercel.app`)
   - **App path**: `/experiences/[experienceId]`
   - **Dashboard path**: `/dashboard/[companyId]`
   - **Discover path**: `/discover`

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your actual values from the Whop dashboard:
   ```env
   # Required - Get these from your Whop dashboard
   NEXT_PUBLIC_WHOP_APP_ID=your_actual_app_id
   WHOP_API_KEY=your_actual_api_key
   
   # Optional but recommended
   NEXT_PUBLIC_WHOP_AGENT_USER_ID=your_agent_user_id
   NEXT_PUBLIC_WHOP_COMPANY_ID=your_company_id
   ```

### 4. Install Your App

1. Go to a Whop community you own or manage
2. Navigate to the Tools section
3. Add your app using the App ID from your environment variables

### 5. Run the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── app/
│   ├── api/webhooks/          # Webhook handlers for Whop events
│   ├── dashboard/[companyId]/ # Company dashboard pages
│   ├── discover/              # App discovery page
│   ├── experiences/[experienceId]/ # Experience pages
│   └── layout.tsx             # Root layout with WhopApp wrapper
├── lib/
│   └── whop-sdk.ts           # Whop SDK configuration
└── .env.example              # Environment variables template
```

## 🔧 Key Features

### Authentication
- Automatic user authentication via Whop SDK
- User token verification on protected routes
- Access control for companies and experiences

### Webhooks
- Payment success handling
- Extensible webhook system for other Whop events

### Pages
- **Home**: Setup instructions and app information
- **Discover**: Public page to showcase your app
- **Dashboard**: Company-specific admin interface
- **Experiences**: User-facing app interface

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new) and import your repository
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Update the Base URL in your Whop app settings
- Configure webhook URLs if needed

## 🛠️ Customization

### Adding New Features

1. **New Pages**: Add them to the `app/` directory
2. **API Routes**: Create new files in `app/api/`
3. **Components**: Add reusable components in a `components/` directory
4. **Styling**: The app uses Tailwind CSS for styling

### Webhook Events

Add new webhook handlers in `app/api/webhooks/route.ts`:

```typescript
if (webhookData.action === "your.event.name") {
  // Handle your custom event
}
```

### SDK Usage

Use the configured SDK in your components:

```typescript
import { whopSdk } from "@/lib/whop-sdk";

// Get user data
const user = await whopSdk.users.getUser({ userId });

// Check access
const access = await whopSdk.access.checkIfUserHasAccessToCompany({
  userId,
  companyId
});
```

## 📚 Resources

- [Whop Developer Documentation](https://dev.whop.com)
- [Whop API Reference](https://dev.whop.com/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)

## 🆘 Troubleshooting

**App not loading?**
- Check that your environment variables are set correctly
- Verify the App path is set to `/experiences/[experienceId]` in your Whop dashboard
- Make sure your app is installed in a Whop community

**Authentication issues?**
- Ensure your `WHOP_API_KEY` is correct
- Check that your app ID matches what's in the dashboard

**Webhook not working?**
- Verify your webhook secret is set correctly
- Check that your webhook URL is accessible from the internet

Need help? Check the [Whop Documentation](https://dev.whop.com) or reach out to the Whop community!
