# CampX Frontend Portal

CampX Academic Management Portal built with React, Vite, and Lucide Icons.

## Deployment on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
2. Import your GitHub repository `campx_frontend`.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - Key: `VITE_API_BASE`
   - Value: `https://your-render-backend-url.onrender.com/api` (URL of your deployed Render backend)
5. Click **Deploy**.

## SPA Routing
A `vercel.json` file is already included with rewrite rules to support client-side routing on page refreshes without 404 errors.
