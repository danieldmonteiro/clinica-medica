<template>
  <div>
    <nav style="background: #ddd; padding: 10px; margin-bottom: 20px;">
      <template v-if="user">
        <span>Olá, {{ user.role }}!</span>
        <button @click="logout" style="margin-left: 10px;">Sair</button>
        <router-link to="/appointments" style="margin-left: 10px;">Agendamentos</router-link>
        <router-link v-if="user.role === 'secretario'" to="/admin" style="margin-left: 10px;">Painel</router-link>
      </template>
      <template v-else>
        <router-link to="/login">Login</router-link>
        <span> | </span>
        <router-link to="/register">Cadastro</router-link>
      </template>
    </nav>

    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuth } from './composables/useAuth';

export default defineComponent({
  setup() {
    const { user, logout } = useAuth();
    return { user, logout };
  },
});
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  margin: 0;
  padding: 0;
}
nav a {
  text-decoration: none;
  color: #000;
}
button {
  cursor: pointer;
}
</style>
