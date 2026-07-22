# Campus Cart — Student Marketplace

Campus Cart is a real-time college campus marketplace built with React 18, Vite, Tailwind CSS, and Firebase Firestore. Students can list pre-loved textbooks, cycles, electronics, and dorm gear, chat with AI sellers, and share listings across WhatsApp and Instagram.

---

## Features

- **Real-Time Firestore Sync**: New listings immediately pop up across all open tabs without refreshing.
- **Client-Side Image Compression**: Photos are automatically resized and compressed to lightweight Base64 strings before saving directly in Firestore.
- **AI Smart Seller Chat**: Interactive contextual student seller replies powered by Gemini 3.6 Flash.
- **Native Social Sharing**: Paper-plane share button that triggers native share sheet on mobile (`navigator.share`) or copies deep-link with item details to clipboard on desktop.
- **Checked-Notebook Design Theme**: Styled with notebook paper aesthetics, sticky-note category badges, and yellow/red accent pill buttons.
- **Open Graph Preview**: Custom Open Graph meta tags for link unfurling on WhatsApp, Instagram DMs, and Twitter.

---

## Deployment to Vercel

Follow these simple steps to deploy Campus Cart to [Vercel](https://vercel.com):

### Step 1: Push Project to GitHub / GitLab
1. Initialize Git in the project root if not already initialized:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Campus Cart"
   ```
2. Push your repository to your GitHub or GitLab account.

---

### Step 2: Import into Vercel
1. Log into your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** > **"Project"**.
3. Select your `campus-cart` repository and click **Import**.

---

### Step 3: Configure Build Settings & Environment Variables
Vercel automatically detects Vite projects. Verify the following settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Add the following Environment Variables under the **Environment Variables** section in Vercel:

| Environment Variable | Description |
| -------------------- | ----------- |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase App ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID |
| `GEMINI_API_KEY` | Google Gemini API Key (for backend AI seller responses) |

---

### Step 4: Deploy
1. Click **Deploy**.
2. Once the build completes, Vercel will provide your production live URL.

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment example
cp .env.example .env

# 3. Start dev server
npm run dev
```

---

## Production Build Check

```bash
npm run build
```
Outputs static bundle in `dist/`.
