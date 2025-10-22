# 🧠 Brain Dump - Whop App Template for Content Creators

**A premium, ready-to-sell cognitive load management app for Whop content creators.**

Transform your Whop community with a powerful tool that helps your members achieve flow state, manage mental clutter, and boost productivity. This is a complete, production-ready template that you can customize, brand, and sell to your audience.

## 💰 Why This Template?

This isn't just another starter template - it's a **complete business-ready application** that you can:
- ✅ **Fork & Customize** in under 30 minutes
- ✅ **Brand** with your colors, name, and style
- ✅ **Deploy** to Vercel with one click
- ✅ **Sell** as a premium Whop app to your community
- ✅ **Scale** with built-in webhook and payment handling

## ✨ Features

### For Your Users
- 🧠 **Brain Dump** - Help them clear mental clutter instantly
- ⚡ **Flow Mode** - Focused work sessions with timers
- 🧘 **Breathing Reset** - Guided breathing exercises to reduce stress
- 📋 **Organize** - Categorize and structure thoughts
- 📊 **Analytics** - Track cognitive load and productivity (coming soon)

### For You (The Creator)
- 🔐 **Complete Authentication** - Whop SDK integration with user verification
- 💳 **Payment Webhooks** - Automatic payment processing
- 🎨 **Easy Customization** - Change branding in one config file
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- 🛠️ **Production Ready** - TypeScript, proper error handling, optimized
- 📚 **Full Documentation** - Setup guide, customization guide, and deployment guide

## 🚀 Quick Start

### 1. Install Dependencies

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

```bash
# Copy the example environment file
cp .env.example .env.local

# Or use the setup script
pnpm setup
```

Then fill in your actual values from the Whop dashboard:

```env
# Required - Get these from your Whop dashboard
NEXT_PUBLIC_WHOP_APP_ID=your_actual_app_id
WHOP_API_KEY=your_actual_api_key
WHOP_WEBHOOK_SECRET=your_webhook_secret

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
├── .env.example              # Environment variables template
├── setup.sh                  # Automated setup script
└── SETUP.md                  # Detailed setup guide
```

## 🔧 Key Features Explained

### Authentication
The app uses the Whop SDK for seamless authentication:
- Users are automatically authenticated when they access your app
- User tokens are verified on protected routes
- Access control for companies and experiences

### Pages
- **Home** (`/`) - Setup instructions and app information
- **Discover** (`/discover`) - Public page to showcase your app
- **Dashboard** (`/dashboard/[companyId]`) - Company-specific admin interface
- **Experiences** (`/experiences/[experienceId]`) - User-facing app interface

### Webhooks
Handle Whop events like payments:
- Payment success notifications
- Extensible system for other events
- Secure webhook validation

## 🎨 Customization

### Quick Branding (5 minutes)

Edit `app.config.ts` to customize:
- App name and tagline
- Your creator info and social links
- Theme colors
- Feature toggles
- Pricing tiers

```typescript
export const appConfig = {
  name: "Your App Name",
  tagline: "Your Tagline",
  theme: {
    primary: "blue", // Change to your brand color
  }
};
```

### Advanced Customization

1. **New Pages**: Add them to the `app/` directory
2. **API Routes**: Create new files in `app/api/`
3. **Components**: Add reusable components in a `components/` directory
4. **Styling**: The app uses Tailwind CSS for styling

**📖 See [CUSTOMIZATION.md](CUSTOMIZATION.md) for detailed customization guide**

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

## 🚀 Deployment

### Vercel (Recommended) - 10 Minutes

1. Push your customized code to GitHub
2. Go to [Vercel](https://vercel.com/new) and import your repository
3. Add your environment variables in the Vercel dashboard
4. Deploy!
5. Copy your deployment URL and configure it in your Whop app settings

**📖 See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment guide with screenshots**

### Other Platforms

This template works on any Next.js hosting platform:
- Vercel ⭐ (Recommended)
- Netlify
- Railway
- Render

Make sure to:
- Set all environment variables
- Update the Base URL in your Whop app settings
- Configure webhook URLs if needed

## 📚 Resources

- [Whop Developer Documentation](https://dev.whop.com)
- [Whop API Reference](https://dev.whop.com/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

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

## 💼 Selling This App

### Recommended Pricing Models

1. **One-Time Payment**: $9.99 - $49.99
2. **Monthly Subscription**: $4.99 - $14.99/month
3. **Tiered Access**: Basic ($9.99) + Pro ($19.99)

### Value Props for Your Audience

When marketing this to your community, emphasize:
- ✨ Mental clarity and reduced cognitive load
- ⚡ Achieve flow state faster
- 🎯 Boost productivity and focus
- 🧘 Reduce stress and mental overwhelm
- 📈 Track progress over time

### What Makes This Sellable

- **Complete Solution**: Not just a demo, it's production-ready
- **Beautiful UI**: Professional design your users will love
- **Active Development**: Webhook handling, analytics ready
- **Scalable**: Works for 10 or 10,000 users

## 📄 License

This project is available under the [MIT License](LICENSE).

**You can:**
- ✅ Use commercially
- ✅ Modify and rebrand
- ✅ Sell to your community
- ✅ Keep your modifications private

**You must:**
- Keep the original license notice (in the code, not visible to users)

## 🤝 Support

Need help customizing or deploying?
- 📖 Check [CUSTOMIZATION.md](CUSTOMIZATION.md)
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md)
- 💬 Open an issue on GitHub

---

**Need help?** Check the [detailed setup guide](SETUP.md) or visit the [Whop Documentation](https://dev.whop.com)!
