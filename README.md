# CampX Frontend Portal

CampX Academic Management Portal built with React, Vite, and Lucide Icons.

## Deployed Backend
The live backend API is hosted on Render at:
`https://campx-backend-iv32.onrender.com/api`

## Deployment on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
2. Import your GitHub repository `campx_frontend`.
3. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. The environment variable is automatically pre-configured in `.env.production`. Optionally add:
   - Key: `VITE_API_BASE`
   - Value: `https://campx-backend-iv32.onrender.com/api`
5. Click **Deploy**.

## SPA Routing
A `vercel.json` file is included with rewrite rules to ensure client-side routing works on page refreshes without 404 errors.
