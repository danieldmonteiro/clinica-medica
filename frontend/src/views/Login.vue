<template>
  <div class="form-container">
    <h1>Login</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="email" placeholder="E-mail" />
      <input type="password" v-model="password" placeholder="Senha" />
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
    const password = ref('');
    const { login } = useAuth();

    const onSubmit = async () => {
      try {
        await login(email.value, password.value);
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao autenticar');
      }
    };

    return { email, password, onSubmit };
  },
};
</script>
