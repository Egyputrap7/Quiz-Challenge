// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDvi5aWFsULboIw5mgAuxmJC69ap2qFE8U",
    authDomain: "quiz-test-aa7d5.firebaseapp.com",
    projectId: "quiz-test-aa7d5",
    storageBucket: "quiz-test-aa7d5.appspot.com",
    messagingSenderId: "586221794088",
    appId: "1:586221794088:web:55755be3c92e932603561d",
    measurementId: "G-GS8FEQ6JFR"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
