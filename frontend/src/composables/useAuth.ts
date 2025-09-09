import { ref } from 'vue';
import api from '../services/api';
import router from '../router';

// Leitura segura do localStorage

let userData = null;
try {
  const storedUser = localStorage.getItem('clinica_user');
  if (storedUser && storedUser !== 'undefined') {
    userData = JSON.parse(storedUser);
  }
} catch (e) {
  console.error("Erro ao ler clinica_user do localStorage", e);
}

const user = ref<any>(userData);

export function useAuth() {
  const login = async (email: string, senha: string) => {
    const res = await api.post('/api/users/login', { email, senha });
    
    // Monta o objeto do usuário com os dados que realmente vêm do backend

    user.value = {
      id: res.data.userId,
      nome: res.data.nome,
      role: res.data.role,
      address: res.data.address,
    };

    // Salva sempre um JSON válido

    localStorage.setItem('clinica_user', JSON.stringify(user.value));
    localStorage.setItem('clinica_token', res.data.token);

     // Configura o token para todas as próximas requisições

    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

    // Redireciona para a lista de consultas

    router.push('/appointments');
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('clinica_user');
    localStorage.removeItem('clinica_token');
    delete api.defaults.headers.common['Authorization'];
    router.push('/login');
  };

  return { user, login, logout };
}
