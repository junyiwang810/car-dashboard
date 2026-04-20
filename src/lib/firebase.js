import { initializeApp } from 'firebase/app'
import { getDatabase, ref } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBA1zP9AzA0ILgNb3CE1nj1HMAXmuhBcO0',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'car-dashboard-80e7c.firebaseapp.com',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://car-dashboard-80e7c-default-rtdb.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'car-dashboard-80e7c',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    'car-dashboard-80e7c.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '389584228298',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    '1:389584228298:web:6e46e5b2e1c57f1ed44933',
}

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)

let database = null

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig)
  database = getDatabase(app)
}

const activePartRef = database ? ref(database, 'dashboard/active_part') : null

export { activePartRef, database, firebaseConfig, hasFirebaseConfig }
