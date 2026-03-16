# Pushing Firebase rules

This repo includes rules for **Firestore**, **Realtime Database**, and **Storage**. Deploy them with the Firebase CLI.

## 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

## 2. Log in and select your project

```bash
firebase login
firebase use --add
```

When prompted, pick your Firebase project (or create one). That updates `.firebaserc` with your project ID.

**Or** edit `.firebaserc` and set `"default"` to your Firebase project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## 3. Deploy rules

Deploy all rules:

```bash
firebase deploy
```

Deploy only specific products:

```bash
firebase deploy --only firestore:rules
firebase deploy --only database
firebase deploy --only storage
```

## Rules in this repo

| File | Product | Default |
|------|---------|--------|
| `firestore.rules` | Firestore | Read/write only when `request.auth != null` |
| `database.rules.json` | Realtime Database | Read/write only when `auth != null` |
| `storage.rules` | Storage | Read/write only when `request.auth != null` |

Change these files as needed, then run `firebase deploy` again to push updates.
