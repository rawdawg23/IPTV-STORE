# Deploying Evo Media

## Host the frontend on Vercel

1. **Push your code** to GitHub (you already have `rawdawg23/IPTV-STORE`).

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com) → **Add New** → **Project**.
   - Import the repo `rawdawg23/IPTV-STORE`.
   - **Leave Root Directory blank** (repo root). The root `vercel.json` will build the `Client` folder and use `Client/build` as output.
   - Click **Deploy**.
   - If you get 404, check **Deployments** → latest → **Building** logs to see if the build failed.

3. **Environment variables (Vercel)**  
   In the project → **Settings** → **Environment Variables**, add:

   | Name | Value | Notes |
   |------|--------|------|
   | `REACT_APP_API_URL` | `https://your-backend-url.com` | Your backend API base URL (no trailing slash). Required so the app can call the API. |
   | `REACT_APP_FIREBASE_API_KEY` | (from Firebase Console) | If you use Sign in with Google. |
   | `REACT_APP_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` | |
   | `REACT_APP_FIREBASE_PROJECT_ID` | your-project-id | |
   | `REACT_APP_FIREBASE_APP_ID` | (from Firebase Console) | |

   Redeploy after changing env vars.

4. **Client-side routing**  
   `Client/vercel.json` is set up so all routes are served by `index.html` (SPA). No extra config needed.

---

## Backend (API) – not on Vercel

Vercel hosts the **React app** only. The **Node/Express API** (MongoDB, Resend, Firebase) must run on another host. Options:

- **[Railway](https://railway.app)** – Connect repo, set **Root Directory** to `Server`, add env vars (`MONGO_URI`, `JWT_SECRET`, `RESEND_API_KEY`, etc.), deploy. Then set `REACT_APP_API_URL` on Vercel to the Railway URL.
- **[Render](https://render.com)** – New **Web Service**, connect repo, root `Server`, build `npm install`, start `npm start`, add env vars. Use the Render URL as `REACT_APP_API_URL`.
- **[Fly.io](https://fly.io)** – Similar: deploy the `Server` folder and use the generated URL as `REACT_APP_API_URL`.

After the backend is live, put that URL in Vercel’s `REACT_APP_API_URL` and redeploy the frontend.
