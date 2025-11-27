import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "Use_your_Assets",
  authDomain: "Use_your_Assets",
  projectId: "Use_your_Assets",
  storageBucket: "Use_your_Assets",
  messagingSenderId: "Use_your_Assets1",
  appId: "Use_your_Assets",
  measurementId: "Use_your_Assets"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

const storage = getStorage(app);

export { app, auth, storage };
export default firebaseConfig;
