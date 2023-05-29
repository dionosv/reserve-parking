import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApp } from "firebase/app";
import 'firebase/firestore'
import './assets/main.css'
import { firebaseConfig } from './views/func/database';


const app = createApp(App)
initializeApp(firebaseConfig);

app.use(router)

app.mount('#app')


