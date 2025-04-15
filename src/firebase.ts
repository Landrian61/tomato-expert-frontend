import { initializeApp } from 'firebase/app';

// Firebase configuration - must match exactly
const firebaseConfig = {
  apiKey: "AIzaSyBSrftxeGYsXLJOEVXYoF7gVid-3TSWPM8",
  authDomain: "tomato-expert.firebaseapp.com",
  projectId: "tomato-expert",
  storageBucket: "tomato-expert.appspot.com",
  messagingSenderId: "4382717475",
  appId: "1:4382717475:web:114e3de9e3d40da0002396",
  measurementId: "G-2JK3SP68BW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
