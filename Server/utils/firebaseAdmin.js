let admin = null;

function getAdmin() {
  if (admin) return admin;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  if (!projectId || !clientEmail || !privateKey) {
    try {
      const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (path) {
        const serviceAccount = require("fs").readFileSync(path, "utf8");
        const key = JSON.parse(serviceAccount);
        admin = require("firebase-admin").initializeApp({ credential: require("firebase-admin").credential.cert(key) });
        return admin;
      }
    } catch (_) {}
    return null;
  }
  if (privateKey.includes("\\n")) privateKey = privateKey.replace(/\\n/g, "\n");
  try {
    admin = require("firebase-admin").initializeApp({
      credential: require("firebase-admin").credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (err) {
    console.error("Firebase Admin init error:", err.message);
    return null;
  }
  return admin;
}

async function verifyIdToken(idToken) {
  const app = getAdmin();
  if (!app) return null;
  try {
    const decoded = await app.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    console.warn("Firebase verifyIdToken error:", err.message);
    return null;
  }
}

module.exports = { getAdmin, verifyIdToken };
