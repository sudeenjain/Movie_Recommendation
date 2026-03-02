import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCyBSnPIdcWwjO1_qCFPWiFc_5mPMMCza8",
  authDomain: "cineai-ef075.firebaseapp.com",
  projectId: "cineai-ef075",
  storageBucket: "cineai-ef075.firebasestorage.app",
  messagingSenderId: "423582108393",
  appId: "1:423582108393:web:814ce9f2cd7c2ceaf07e78",
  measurementId: "G-GZ80ZGN9JP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Initialize analytics only in browser environment
if (typeof window !== "undefined") {
  getAnalytics(app);
}

export default app;