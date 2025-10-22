# 🚀 Deployment Guide

This guide will walk you through deploying your customized Brain Dump app to Vercel (recommended) and configuring it with Whop.

**Estimated Time:** 15-20 minutes

## Prerequisites

Before you start, make sure you have:
- ✅ Customized your app (see [CUSTOMIZATION.md](CUSTOMIZATION.md))
- ✅ Your code pushed to a GitHub repository
- ✅ A [Whop account](https://whop.com) (free to create)
- ✅ A [Vercel account](https://vercel.com) (free to create)

---

## Part 1: Set Up Your Whop App (5 minutes)

### Step 1: Create Your Whop App

1. Go to [Whop Developer Dashboard](https://whop.com/apps)
2. Click **"Create App"** or **"New App"**
3. Fill in your app details:
   - **App Name**: Your branded app name (e.g., "Focus Flow Pro")
   - **Description**: Brief description of what your app does
   - **Category**: Productivity or Utilities
4. Click **"Create"**

### Step 2: Get Your API Credentials

After creating your app, you'll see:

1. **App ID** - Copy this (looks like `app_xxxxxxxxxxxxx`)
2. **API Key** - Click "Generate" if not shown, then copy it
3. **Webhook Secret** - Click "Generate" if not shown, then copy it

⚠️ **Important:** Save these somewhere safe! You'll need them in a moment.

### Step 3: Create an Agent User (Optional but Recommended)

1. In your Whop app settings, find **"Agent Users"**
2. Click **"Create Agent User"**
3. Give it a name (e.g., "App Bot")
4. Copy the **User ID** (looks like `user_xxxxxxxxxxxxx`)

---

## Part 2: Deploy to Vercel (5 minutes)

### Step 1: Import Your Repository

1. Go to [Vercel](https://vercel.com/new)
2. Click **"Import Project"** or **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose your GitHub repository
5. Click **"Import"**

### Step 2: Configure Your Project

Vercel will auto-detect that it's a Next.js project. Keep these settings:

- **Framework Preset**: Next.js ✅
- **Root Directory**: `./` ✅
- **Build Command**: `pnpm build` or `npm run build` ✅
- **Output Directory**: `.next` ✅

### Step 3: Add Environment Variables

This is the most important step! Click **"Environment Variables"** and add:

```env
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxxxxxxxxxx
WHOP_API_KEY=whopkey_xxxxxxxxxxxxx
WHOP_WEBHOOK_SECRET=whopsec_xxxxxxxxxxxxx
```

**Optional but recommended:**
```env
NEXT_PUBLIC_WHOP_AGENT_USER_ID=user_xxxxxxxxxxxxx
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_xxxxxxxxxxxxx
```

⚠️ **Important Notes:**
- Replace the `xxxxx` values with your actual credentials from Part 1
- Make sure there are NO spaces around the `=` sign
- Make sure there are NO quotes around the values
- Double-check you didn't copy any extra characters

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. 🎉 Your app is live!

Copy your deployment URL (looks like `https://your-app.vercel.app`)

---

## Part 3: Configure Whop App Settings (5 minutes)

Now we need to tell Whop where your app lives.

### Step 1: Update App URLs

1. Go back to your [Whop Developer Dashboard](https://whop.com/apps)
2. Click on your app
3. Find **"Hosting"** or **"App Settings"**
4. Fill in these paths:

```
Base URL: https://your-app.vercel.app
App Path: /experiences/[experienceId]
Dashboard Path: /dashboard/[companyId]
Discover Path: /discover
```

⚠️ **Important:** 
- Replace `your-app.vercel.app` with your actual Vercel URL
- Keep the exact paths as shown above (including the brackets)
- Don't add trailing slashes

### Step 2: Configure Webhook URL

1. In your Whop app settings, find **"Webhooks"**
2. Add this webhook URL:
   ```
   https://your-app.vercel.app/api/webhooks
   ```
3. Select events to listen to:
   - ✅ `payment.succeeded`
   - ✅ `membership.went_valid`
   - ✅ `membership.went_invalid`
   - Add others as needed

### Step 3: Set App Visibility

1. In app settings, find **"Visibility"**
2. For testing: Set to **"Private"** or **"Development Mode"**
3. When ready to launch: Set to **"Public"**

---

## Part 4: Install & Test Your App (5 minutes)

### Step 1: Create a Test Company

If you don't have a Whop company:

1. Go to [Whop](https://whop.com)
2. Click **"Create"** → **"New Company"**
3. Fill in the details (you can use test info for now)
4. Create at least one product/plan

### Step 2: Install Your App

1. Go to your company dashboard
2. Navigate to **"Tools"** or **"Apps"**
3. Click **"Add App"**
4. Search for your app by name or paste your App ID
5. Click **"Install"**

### Step 3: Test All Features

**Test the Dashboard:**
1. Go to your Whop company
2. Click on your installed app
3. You should see your branded dashboard
4. Verify your name and company info display correctly

**Test the Experience Page:**
1. Create a test experience in your Whop company
2. Navigate to it
3. Your app should load
4. Test the Brain Dump feature
5. Test the Flow Mode
6. Test the Breathing Reset

**Test Webhooks:**
1. Make a test payment (use Whop's test mode)
2. Check Vercel logs to see if webhook was received
3. Go to Vercel Dashboard → Your Project → Functions
4. Check the `/api/webhooks` function logs

---

## Troubleshooting

### ❌ "App not loading" or 404 Error

**Possible causes:**
1. Base URL in Whop settings doesn't match your Vercel URL
2. Paths are incorrect (missing brackets or wrong format)
3. App not installed in the company you're testing with

**Fix:**
- Double-check all URLs in Whop settings
- Make sure paths are exactly: `/experiences/[experienceId]` (with brackets)
- Reinstall the app in your company

### ❌ "Unauthorized" or "Invalid Token"

**Possible causes:**
1. Environment variables not set correctly
2. App ID doesn't match
3. API key is incorrect

**Fix:**
- Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- Verify all values are correct
- Redeploy (Deployments → ... → Redeploy)

### ❌ Build Failed on Vercel

**Possible causes:**
1. Missing dependencies
2. TypeScript errors
3. Environment variables needed at build time

**Fix:**
- Check Vercel build logs for specific error
- Run `pnpm build` locally to test
- Make sure all `NEXT_PUBLIC_*` variables are set

### ❌ Webhooks Not Working

**Possible causes:**
1. Webhook URL incorrect
2. Webhook secret doesn't match
3. Events not selected in Whop dashboard

**Fix:**
- Verify webhook URL: `https://your-app.vercel.app/api/webhooks`
- Check webhook secret in Vercel environment variables
- Make sure events are enabled in Whop settings
- Test with Whop's webhook test button

### ❌ App Shows But Styling Is Broken

**Possible causes:**
1. CSS not loading
2. Tailwind not configured properly

**Fix:**
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
- Check browser console for errors
- Verify `postcss.config.mjs` and `tailwind.config.ts` exist

---

## Production Checklist

Before launching to real customers:

### Security
- [ ] All environment variables are set in Vercel
- [ ] Webhook secret is configured and validated
- [ ] `.env.local` is in `.gitignore` (never commit secrets!)
- [ ] API routes have proper error handling

### Testing
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] User can access their own data only
- [ ] Webhooks receive and process events
- [ ] Mobile responsive design works
- [ ] Tested on different browsers

### Performance
- [ ] Images are optimized
- [ ] Pages load in < 3 seconds
- [ ] No console errors in browser
- [ ] Lighthouse score > 90

### Content
- [ ] All placeholder text replaced with your content
- [ ] Branding matches your style
- [ ] Links work (social media, support, etc.)
- [ ] Terms of Service / Privacy Policy added (if required)

### Whop Settings
- [ ] App description is compelling
- [ ] Screenshots/preview images uploaded
- [ ] Pricing set correctly
- [ ] App is set to "Public" (when ready)

---

## Going Live

### Set Up Your Product

1. In your Whop company, create a product:
   - **Name**: Match your app name
   - **Price**: $9.99 - $49.99 (one-time) or $4.99 - $14.99 (monthly)
   - **Access**: Link to your app

2. Write compelling product description:
   ```
   Clear your mind and unlock flow state with [Your App Name].
   
   ✨ Instantly dump mental clutter
   ⚡ Achieve deep focus faster
   🎯 Boost productivity
   🧘 Reduce stress
   
   Perfect for content creators, entrepreneurs, and anyone
   who wants to maintain peak mental performance.
   ```

3. Add preview images/video showing the app in action

### Marketing Your App

**Where to promote:**
- Your Whop community
- Twitter/X
- Instagram Stories
- Discord server
- Email newsletter
- YouTube community posts

**What to say:**
```
🧠 Just launched [Your App Name]!

Help your brain work smarter, not harder.

✅ Clear mental clutter in seconds
✅ Achieve flow state faster
✅ Reduce decision fatigue

[Link to your Whop product]
```

---

## Updating Your App

When you want to add features or fix bugs:

1. Make changes to your code locally
2. Test locally with `pnpm dev`
3. Push to GitHub
4. Vercel automatically deploys! (if auto-deploy enabled)
5. Changes are live in 2-3 minutes

**Pro tip:** Use Vercel's preview deployments:
- Every push to a branch creates a preview URL
- Test changes before merging to main
- Share preview links with beta testers

---

## Custom Domain (Optional)

Want to use your own domain like `app.yourdomain.com`?

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS instructions from Vercel
4. Update Base URL in Whop settings to your custom domain

**Benefits:**
- More professional
- Better for branding
- Custom email addresses

---

## Monitoring & Analytics

### Vercel Analytics

1. In Vercel Dashboard → Your Project → Analytics
2. See real-time visitors, page views, performance

### Vercel Logs

1. Go to Vercel Dashboard → Your Project → Logs
2. See all function calls, errors, webhook events
3. Filter by time, function, or error level

### Whop Analytics

1. In Whop Dashboard → Your App
2. See installations, active users, revenue
3. Track conversion rates

---

## Support & Scaling

### Performance Tips

**For 100+ users:**
- Use Vercel's Edge Functions for faster response
- Add caching for user data
- Consider a database (Vercel KV, Supabase)

**For 1000+ users:**
- Upgrade to Vercel Pro ($20/month)
- Implement rate limiting
- Add Redis for session storage
- Consider a CDN for assets

### Getting Help

**Deployment issues:**
- Check [Vercel Status](https://www.vercel-status.com/)
- Read [Vercel Docs](https://vercel.com/docs)
- Join [Vercel Discord](https://vercel.com/discord)

**Whop integration issues:**
- Check [Whop Docs](https://dev.whop.com)
- Email Whop support
- Join Whop developer Discord

**Code issues:**
- Open an issue on your GitHub repo
- Check [Next.js Docs](https://nextjs.org/docs)

---

## 🎉 Congratulations!

Your app is now deployed and ready to make money!

**Next steps:**
1. Share with your first customers
2. Gather feedback
3. Iterate and improve
4. Scale your business

**Remember:**
- Listen to user feedback
- Update regularly with new features
- Provide excellent support
- Promote consistently

---

**Questions?** Open an issue on GitHub or check the main [README.md](README.md)

