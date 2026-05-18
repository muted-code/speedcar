import { initializeApp } from 'firebase/app';
import { getFirestore, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Reemplazar con las credenciales reales de Firebase luego
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForMockDataPurposeOnly123",
  authDomain: "speed-car-cali.firebaseapp.com",
  projectId: "speed-car-cali",
  storageBucket: "speed-car-cali.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, Timestamp };
