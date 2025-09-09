<template>
  <div class="form-container">
    <h1>Login</h1>
    <form @submit.prevent="onSubmit" novalidate>
      <!-- E-mail -->
      <div class="form-field">
        <input v-model="email" type="email" placeholder="E-mail" />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <!-- Senha -->
      <div class="form-field">
        <input v-model="senha" type="password" placeholder="Senha" />
        <span v-if="errors.senha" class="error">{{ errors.senha }}</span>
      </div>

      <!-- Erro de login geral -->
      <div v-if="loginError" class="login-error">{{ loginError }}</div>

      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

export default {
  setup() {
    const email = ref('');
    const senha = ref('');
    const errors = ref<any>({});
    const loginError = ref('');
    const { login } = useAuth();

    const validateEmail = (emailStr: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(emailStr);
    };

    const validate = () => {
      const newErrors: any = {};
      loginError.value = ''; // limpa erro geral
      if (!email.value.trim()) newErrors.email = 'E-mail é obrigatório';
      else if (!validateEmail(email.value)) newErrors.email = 'E-mail inválido';
      if (!senha.value.trim()) newErrors.senha = 'Senha é obrigatória';
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async () => {
      if (!validate()) return;

      try {
        await login(email.value, senha.value);
      } catch (err: any) {
        // Mostra o erro abaixo do formulário
        loginError.value = err?.response?.data?.message || 'Erro ao autenticar';
      }
    };

    return { email, senha, errors, loginError, onSubmit };
  },
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 30px auto;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.form-field {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

button {
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}

.error {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 4px;
}

.login-error {
  color: #ef4444;
  margin-bottom: 10px;
  font-weight: bold;
}
</style>