import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "ZhpWCk152WzHe99QBOnB",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Função para salvar dados
export async function salvarDados(equipamento, quantidade, obra, responsavel, dataRetirada, dataDevolucao) {
  try {
    await addDoc(collection(db, "equipamentos"), {
      equipamento,
      quantidade,
      obra,
      responsavel,
      dataRetirada,
      dataDevolucao
    });
    console.log("Documento adicionado com sucesso!");
  } catch (e) {
    console.error("Erro ao adicionar documento: ", e);
  }
}

// Função para recuperar dados
export async function recuperarDados() {
  const querySnapshot = await getDocs(collection(db, "equipamentos"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}
