import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // importar o router
import './style.css';

createApp(App)
  .use(router) // registrar o router
  .mount('#app');

