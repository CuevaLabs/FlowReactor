# ⚡ Quick Start Guide

**Get your Brain Dump app customized and deployed in 30 minutes!**

## Step 1: Clone & Install (5 min)

```bash
# Clone this repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
pnpm install
# or npm install
```

## Step 2: Customize Your Branding (5 min)

Edit `app.config.ts`:

```typescript
export const appConfig = {
  name: "Your App Name",           // Change this
  tagline: "Your Custom Tagline",   // Change this
  creator: {
    name: "Your Name",               // Change this
    website: "https://yoursite.com", // Change this
  },
  theme: {
    primary: "blue",  // Pick your color: blue, green, purple, pink, etc.
  },
};
```

Edit `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: "Your App Name",      // Change this
  description: "Your tagline", // Change this
};
```

## Step 3: Set Up Whop App (5 min)

1. Go to [Whop Developer Dashboard](https://whop.com/apps)
2. Create new app
3. Copy these credentials:
   - App ID
   - API Key
   - Webhook Secret

## Step 4: Deploy to Vercel (10 min)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/new)
3. Import your repository
4. Add environment variables:
   ```
   NEXT_PUBLIC_WHOP_APP_ID=your_app_id
   WHOP_API_KEY=your_api_key
   WHOP_WEBHOOK_SECRET=your_webhook_secret
   ```
5. Deploy!

## Step 5: Configure Whop (5 min)

In your Whop app settings:

```
Base URL: https://your-app.vercel.app
App Path: /experiences/[experienceId]
Dashboard Path: /dashboard/[companyId]
Discover Path: /discover
Webhook URL: https://your-app.vercel.app/api/webhooks
```

## Step 6: Test!

1. Install your app in a Whop company
2. Visit the dashboard
3. Test all features
4. 🎉 You're done!

---

## Need More Help?

- **Full Setup Guide:** [SETUP.md](SETUP.md)
- **Customization Guide:** [CUSTOMIZATION.md](CUSTOMIZATION.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Main README:** [README.md](README.md)

---

## What's Included?

✅ Complete authentication system
✅ Beautiful, modern UI
✅ Brain Dump feature
✅ Flow Mode timer
✅ Breathing exercise
✅ Organize feature
✅ Webhook handling
✅ Responsive design
✅ TypeScript
✅ Production-ready

## Recommended Pricing

- **One-time:** $19.99 - $49.99
- **Monthly:** $9.99 - $19.99/month
- **Tiered:** Basic ($9.99) + Pro ($19.99)

## Marketing Tips

**Sell it as:**
- 🧠 Mental clarity tool
- ⚡ Flow state accelerator
- 📊 Productivity booster
- 🎯 Focus enhancement
- 🧘 Stress reduction app

**Target audience:**
- Content creators
- Entrepreneurs
- Remote workers
- Students
- Coaches/consultants

## Pro Tips

1. **Start simple** - Don't over-customize initially
2. **Test thoroughly** - Try every feature before launch
3. **Gather feedback** - Listen to your first users
4. **Update regularly** - Add features based on requests
5. **Provide support** - Happy customers = good reviews

---

**Ready to launch? Let's go! 🚀**

