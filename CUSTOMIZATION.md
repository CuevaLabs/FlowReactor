# 🎨 Customization Guide

This guide will walk you through customizing the Lock-In app to match your brand and add your own features.

## Table of Contents

1. [Quick Branding (5 minutes)](#quick-branding-5-minutes)
2. [Visual Customization](#visual-customization)
3. [Adding Your Own Features](#adding-your-own-features)
4. [Advanced Customization](#advanced-customization)

---

## Quick Branding (5 minutes)

### 1. Edit `app.config.ts`

This is your main customization file. Change everything here to match your brand:

```typescript
export const appConfig = {
  // Change the app name and tagline
  name: "Your App Name",
  tagline: "Your Custom Tagline",
  description: "Your app description for SEO and marketing",

  // Add your info
  creator: {
    name: "Your Name or Brand",
    website: "https://yourwebsite.com",
    support: "support@youremail.com",
  },

  // Change theme colors (Tailwind color names)
  theme: {
    primary: "blue",    // Main brand color
    secondary: "purple", // Secondary accent
    accent: "pink",      // Additional accent
    warning: "orange",   // For warnings/alerts
  },

  // Toggle features on/off
  features: {
    guidedIntake: true,
    focusShield: true,
    sessionOverlay: true,
    reflection: true,
    insightsDashboard: true,
    analytics: false,    // Set to true when you build this
    aiSuggestions: false, // Set to true when you build this
  },

  // Your social links
  social: {
    twitter: "https://twitter.com/yourusername",
    instagram: "https://instagram.com/yourusername",
    youtube: "https://youtube.com/@yourusername",
    discord: "https://discord.gg/yourinvite",
  },
};
```

### 2. Update `app/layout.tsx` Metadata

Change the site title and description:

```typescript
export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
};
```

---

## Visual Customization

### Colors

The app uses Tailwind CSS with a color system. The main colors are in `app.config.ts`.

**To change a specific color throughout the app:**

1. Open `app.config.ts`
2. Change the theme color:
   ```typescript
   theme: {
     primary: "emerald", // This changes all green to emerald
   }
   ```

**Available Tailwind colors:**
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

### Fonts

The app uses Google Fonts (Geist Sans and Geist Mono). To change fonts:

1. Open `app/layout.tsx`
2. Import different fonts:
   ```typescript
   import { Inter, Roboto } from "next/font/google";
   
   const inter = Inter({
     variable: "--font-sans",
     subsets: ["latin"],
   });
   ```

### Logo

To add your logo:

1. Add your logo file to `public/logo.png`
2. Update the discover page (`app/discover/page.tsx`) to use your logo:
   ```typescript
   import Image from "next/image";
   
   <Image src="/logo.png" alt="Your Brand" width={200} height={200} />
   ```

---

## Adding Your Own Features

### Adding a New Page

1. Create a new folder in `app/`:
   ```bash
   mkdir app/your-feature
   ```

2. Create a `page.tsx` file:
   ```typescript
   import { whopSdk } from "@/lib/whop-sdk";
   import { headers } from "next/headers";

   export default async function YourFeaturePage() {
     const headersList = await headers();
     const { userId } = await whopSdk.verifyUserToken(headersList);

     return (
       <div className="min-h-screen bg-black text-white p-8">
         <h1 className="text-3xl font-bold">Your Feature</h1>
         <p>User ID: {userId}</p>
       </div>
     );
   }
   ```

3. Add a link to it in the dashboard (`app/dashboard/[companyId]/page.tsx`)

### Adding a New API Route

1. Create a new folder in `app/api/`:
   ```bash
   mkdir app/api/your-endpoint
   ```

2. Create a `route.ts` file:
   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import { whopSdk } from "@/lib/whop-sdk";

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       
       // Your logic here
       
       return NextResponse.json({ success: true });
     } catch (error) {
       return NextResponse.json(
         { error: "Something went wrong" },
         { status: 500 }
       );
     }
   }
   ```

### Creating Reusable Components

1. Create a `components/` folder in the root:
   ```bash
   mkdir components
   ```

2. Create your component:
   ```typescript
   // components/Button.tsx
   interface ButtonProps {
     children: React.ReactNode;
     onClick?: () => void;
     variant?: "primary" | "secondary";
   }

   export function Button({ children, onClick, variant = "primary" }: ButtonProps) {
     const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-colors";
     const variantStyles = {
       primary: "bg-blue-500 hover:bg-blue-600 text-white",
       secondary: "bg-gray-800 hover:bg-gray-700 text-white",
     };

     return (
       <button 
         onClick={onClick}
         className={`${baseStyles} ${variantStyles[variant]}`}
       >
         {children}
       </button>
     );
   }
   ```

3. Use it in your pages:
   ```typescript
   import { Button } from "@/components/Button";

   <Button onClick={() => console.log("Clicked!")}>
     Click Me
   </Button>
   ```

---

## Advanced Customization

### Custom Pricing Tiers

To implement tiered access (Basic vs Pro):

1. Update `app.config.ts` with your tiers
2. Check user's plan in your pages:
   ```typescript
   const memberships = await whopSdk.users.getUserMemberships({ userId });
   const hasPro = memberships.some(m => m.planId === "your_pro_plan_id");
   ```

3. Show/hide features based on plan:
   ```typescript
   {hasPro && (
     <div>Premium Feature Here</div>
   )}
   ```

### Database Integration

To add data persistence:

1. Choose a database (Vercel KV, Supabase, MongoDB, etc.)
2. Install the SDK:
   ```bash
   pnpm add @vercel/kv
   ```

3. Add connection string to `.env.local`:
   ```env
   KV_URL=your_kv_url
   KV_REST_API_TOKEN=your_token
   ```

4. Use in your API routes:
   ```typescript
   import { kv } from "@vercel/kv";

   // Save data
   await kv.set(`user:${userId}:dumps`, dumps);

   // Get data
   const dumps = await kv.get(`user:${userId}:dumps`);
   ```

### Email Notifications

To send emails (e.g., daily summaries):

1. Install Resend:
   ```bash
   pnpm add resend
   ```

2. Add API key to `.env.local`:
   ```env
   RESEND_API_KEY=your_key
   ```

3. Create email API route:
   ```typescript
   import { Resend } from "resend";

   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(request: NextRequest) {
     await resend.emails.send({
       from: "noreply@yourdomain.com",
       to: "user@email.com",
     subject: "Lock-In Daily Summary",
     html: "<p>Your lock-in highlights and insights...</p>",
     });

     return NextResponse.json({ success: true });
   }
   ```

### Analytics

To add usage analytics:

1. Install analytics package:
   ```bash
   pnpm add @vercel/analytics
   ```

2. Add to `app/layout.tsx`:
   ```typescript
   import { Analytics } from "@vercel/analytics/react";

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     );
   }
   ```

### AI Features (Optional)

To add AI-powered suggestions:

1. Install OpenAI SDK:
   ```bash
   pnpm add openai
   ```

2. Add API key to `.env.local`:
   ```env
   OPENAI_API_KEY=your_key
   ```

3. Create AI endpoint:
   ```typescript
   import OpenAI from "openai";

   const openai = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
   });

   export async function POST(request: NextRequest) {
     const { thought } = await request.json();

     const completion = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [
         {
           role: "system",
           content: "You help organize thoughts into actionable tasks.",
         },
         {
           role: "user",
           content: thought,
         },
       ],
     });

     return NextResponse.json({
       suggestion: completion.choices[0].message.content,
     });
   }
   ```

---

## Tips for Success

### 1. Start Small
- Don't customize everything at once
- Test after each change
- Keep the core functionality working

### 2. Keep it Simple
- Users appreciate clean, simple interfaces
- Don't add features just because you can
- Focus on solving one problem really well

### 3. Test on Mobile
- Most users will access on mobile
- Test responsive design on different screen sizes
- Use Chrome DevTools mobile emulator

### 4. Performance Matters
- Keep images optimized
- Use Next.js Image component
- Minimize JavaScript where possible

### 5. Brand Consistency
- Use 2-3 main colors throughout
- Keep fonts consistent
- Maintain spacing and sizing patterns

---

## Getting Help

**Common Issues:**
- Colors not changing? Check if you're using Tailwind color names from the list above
- Page not showing? Make sure you created `page.tsx` (not `page.ts`)
- TypeScript errors? Run `pnpm build` to see detailed errors

**Resources:**
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Whop API Docs](https://dev.whop.com/api-reference)

**Need More Help?**
Open an issue on GitHub with:
- What you're trying to customize
- What you expected to happen
- What actually happened
- Any error messages

---

**Ready to deploy?** Check out [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step deployment instructions.
