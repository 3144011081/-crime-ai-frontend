# CrimeAI — React + Vite Frontend

Modern, high-performance web interface for the **Aerial Surveillance & Crime Detection Suite**, built with React 18, Vite 6, Tailwind CSS, and Lucide React.

---

## 🚀 Deploy to Vercel (1-Click or CLI)

### Method 1: Via Vercel Dashboard (Recommended)
1. Push this repository to your GitHub account (e.g. `your-username/crime-ai-frontend`).
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `crime-ai-frontend` repository.
4. Framework Preset: **Vite** (detected automatically).
5. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://your-backend-domain.com` (your deployed Flask backend URL).
6. Click **Deploy**. Vercel will build and assign you a live production URL: `https://crime-ai-frontend.vercel.app`.

### Method 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```

The app will run at `http://localhost:5173`. When running alongside the local backend, requests to `/api` are automatically proxied to `http://127.0.0.1:5005`.

---

## 📦 Production Build

```bash
npm run build
```

Generates optimized production assets in `dist/`.
