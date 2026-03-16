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

---

## Firebase and Resend: where they go

| Service   | Used by        | Where to set it        |
|----------|----------------|-------------------------|
| **Firebase (client)** | React app (Sign in with Google) | **Vercel** env vars only |
| **Firebase (Admin)** | Backend (verifies tokens)        | **Backend** (Railway/Render) env vars only |
| **Resend**          | Backend (contact form emails)    | **Backend** (Railway/Render) env vars only |

**Resend is not configured on Vercel** – it runs only on your Node/Express backend.

---

## 1. Firebase setup (for Vercel + backend)

### 1.1 Create Firebase project and get client config (for Vercel)

1. Go to [Firebase Console](https://console.firebase.google.com) → **Add project** (or use existing).
2. Enable **Authentication** → **Sign-in method** → turn on **Google**.
3. **Project Settings** (gear) → **General** → under “Your apps” click **</>** (Web). Register your app; you’ll get a config object.
4. Copy these from the config (or from “Config” in Project settings):

   - `apiKey`  
   - `authDomain` (e.g. `your-project.firebaseapp.com`)  
   - `projectId`  
   - `appId`  
   - Optionally: `storageBucket`, `messagingSenderId`

### 1.2 Add Firebase env vars **on Vercel**

In **Vercel** → your project → **Settings** → **Environment Variables**, add (for **Production**, and optionally Preview/Development):

| Name | Value |
|------|--------|
| `REACT_APP_FIREBASE_API_KEY` | Your Firebase `apiKey` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | e.g. `your-project.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Your `projectId` |
| `REACT_APP_FIREBASE_APP_ID` | Your `appId` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | (optional) |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | (optional) |

Save, then **redeploy** the Vercel project so the new vars are used. After that, “Sign in with Google” will work on the live site.

### 1.3 Firebase Admin on the **backend** (for “Sign in with Google” to work with your API)

Your backend must verify Firebase ID tokens. Set **one** of these on **Railway / Render / wherever the Server runs**:

**Option A – Service account file (e.g. Render/Railway)**

1. Firebase Console → **Project Settings** → **Service accounts** → **Generate new private key**.
2. Put the JSON key somewhere your backend can read it (e.g. a secret file or paste contents into a secret env var).
3. On the backend host, set:
   - `GOOGLE_APPLICATION_CREDENTIALS` = path to that JSON file, **or**
   - Env vars (see Option B).

**Option B – Env vars (no file)**

On the backend, set:

- `FIREBASE_PROJECT_ID` = from the service account JSON (`project_id`)
- `FIREBASE_CLIENT_EMAIL` = from the JSON (`client_email`)
- `FIREBASE_PRIVATE_KEY` = the full private key string from the JSON, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`. If you paste it, keep the `\n` line breaks as literal `\n` (many hosts allow that), or use one long line.

Restart the backend after adding these. Then when a user signs in with Google on the Vercel site, the frontend sends the Firebase token to your API and the backend can verify it.

---

## 2. Resend setup (backend only, not Vercel)

Resend sends contact-form emails from your **Node/Express server**. You do **not** set Resend on Vercel.

### 2.1 Get Resend API key and “From” address

1. Go to [Resend](https://resend.com) → sign up / log in.
2. **API Keys** → **Create API Key** → copy the key (starts with `re_`).
3. Either:
   - **Use Resend’s test domain:** “From” can be `Evo Media <onboarding@resend.dev>` (testing only), or  
   - **Add your own domain:** **Domains** → Add domain, add the DNS records they show, then use e.g. `Evo Media <hello@yourdomain.com>`.

### 2.2 Add Resend env vars on the **backend** (Railway / Render / etc.)

On the host where your **Server** runs (Railway, Render, Fly.io, etc.), add:

| Name | Value |
|------|--------|
| `RESEND_API_KEY` | Your Resend API key (e.g. `re_xxxxx...`) |
| `RESEND_FROM` | Sender string, e.g. `Evo Media <onboarding@resend.dev>` or `Evo Media <hello@yourdomain.com>` |
| `CONTACT_RECEIVING_EMAIL` | Where to receive contact form emails (e.g. `hodge2023@outlook.com`) |

Restart the backend. When someone submits the contact form on your Vercel site, the request goes to your backend; the backend saves it and uses Resend to email you at `CONTACT_RECEIVING_EMAIL`.

**Summary:**  
- **Vercel:** only Firebase **client** env vars (`REACT_APP_FIREBASE_*`) + `REACT_APP_API_URL`.  
- **Backend:** Resend (`RESEND_*`, `CONTACT_RECEIVING_EMAIL`) + Firebase **Admin** (if you use Sign in with Google).
