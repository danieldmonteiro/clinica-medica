<template>
  <div class="form-container">
    <h1>Cadastro</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="name" placeholder="Nome" />
      <input v-model="email" placeholder="E-mail" />
      <input type="password" v-model="password" placeholder="Senha" />
      <select v-model="role">
        <option value="paciente">Paciente</option>
        <option value="secretario">Secretário</option>
      </select>
      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const role = ref('paciente');
    const router = useRouter();

    const onSubmit = async () => {
      try {
        await api.post('/user/register', {
          name: name.value,
          email: email.value,
          password: password.value,
          role: role.value,
        });
        alert('Cadastro realizado! Faça login.');
        router.push('/login');
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao cadastrar');
      }
    };

    return { name, email, password, role, onSubmit };
  },
};
</script>
