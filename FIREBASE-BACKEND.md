# Firebase as full backend

This app uses **Firebase** for auth, channels, pricing, and contact form. You do **not** need a separate Node/Express server or `REACT_APP_API_URL` for the app to work.

## What runs on Firebase

| Feature        | Firebase product | Collection / usage                    |
|----------------|------------------|---------------------------------------|
| Sign in / Sign up | Authentication | Email+password + Google sign-in       |
| Channels       | Firestore        | Collection `channels` (read by app)   |
| Pricing plans  | Firestore        | Collection `pricing` (read by app)   |
| Contact form   | Firestore        | Collection `contacts` (create by app)|

## Firestore collections

### `channels`

Documents with at least: `name`, `description`, `categories` (array), `languages` (array), `quality`, `logo` (URL), `premium` (boolean). Add documents in Firebase Console → Firestore → Start collection `channels`, or use the app (it will show default channels until you add data).

### `pricing`

Documents with: `plan` (e.g. "basic", "standard", "premium"), `name`, `description`, `monthlyPrice`, `yearlyPrice`, `features` (object with `channels`, `quality`, `connections`, `vodLibrary`, `premiumSports`), `isPopular` (boolean), `sortOrder` (number). Add in Firestore so the pricing section shows your plans.

### `contacts`

Created by the contact form. Each document: `name`, `email`, `message`, `status` ("pending"), `createdAt`. View submissions in Firebase Console → Firestore → `contacts`.

## Env vars (Vercel)

You only need **Firebase** client env vars. **Do not set** `REACT_APP_API_URL` unless you still use a separate API for something.

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_APP_ID`
- (optional) `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`

## Deploy Firestore rules

```bash
firebase deploy --only firestore:rules
```

## Contact form emails (optional)

Contact form submissions are stored in Firestore. To **email** yourself when someone submits, you can add a **Firebase Cloud Function** (requires Blaze plan) that triggers on new `contacts` documents and calls Resend. The Server folder’s Resend logic can be moved into a Cloud Function if you want.
