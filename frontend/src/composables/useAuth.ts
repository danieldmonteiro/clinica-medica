import { ref } from 'vue';
import api from '../services/api';
import router from '../router';

const user = ref<any>(JSON.parse(localStorage.getItem('clinica_user') || 'null'));

export function useAuth() {
  const login = async (email: string, password: string) => {
    const res = await api.post('/user/login', { email, password });
    user.value = res.data.user;
    localStorage.setItem('clinica_user', JSON.stringify(user.value));
    localStorage.setItem('clinica_token', res.data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
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
