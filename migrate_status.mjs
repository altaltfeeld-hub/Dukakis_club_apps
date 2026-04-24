// Одноразовый скрипт: добавляет status: 'active' всем пользователям, у которых нет этого поля
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfYctdBmX-CAk_k-9fgfZN2XXGzTPYOGE",
  authDomain: "dukalis-club.firebaseapp.com",
  projectId: "dukalis-club",
  storageBucket: "dukalis-club.firebasestorage.app",
  messagingSenderId: "174381191211",
  appId: "1:174381191211:web:ad519987e1991e78785a6e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  const usersSnap = await getDocs(collection(db, "users"));
  let updated = 0;
  for (const userDoc of usersSnap.docs) {
    const data = userDoc.data();
    if (!data.status) {
      await updateDoc(doc(db, "users", userDoc.id), { status: 'active' });
      console.log(`✅ ${userDoc.id} → status: active`);
      updated++;
    } else {
      console.log(`⏭️  ${userDoc.id} — уже есть status: ${data.status}`);
    }
  }
  console.log(`\nГотово! Обновлено: ${updated} пользователей.`);
  process.exit(0);
}

migrate();
