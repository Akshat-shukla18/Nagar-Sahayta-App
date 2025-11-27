import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzP0AW62JmCgOMCCLwxfLi6tTdgoS_Uc0",
  authDomain: "clean-city-25.firebaseapp.com",
  projectId: "clean-city-25",
  storageBucket: "clean-city-25.firebasestorage.app",
  messagingSenderId: "577733257631",
  appId: "1:577733257631:web:742c0a5be09bb5d07db5aa",
  measurementId: "G-XWC31BMP90"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

const storage = getStorage(app);

export { app, auth, storage };
export default firebaseConfig;
