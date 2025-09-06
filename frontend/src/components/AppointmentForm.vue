<template>
  <div class="appointment-form">
    <h2>Agendar Procedimento</h2>
    <form @submit.prevent="onSubmit">
      <label>Tipo de procedimento:</label>
      <select v-model="type">
        <option value="consulta">Consulta</option>
        <option value="exame">Exame</option>
      </select>

      <label>Data e hora:</label>
      <input type="datetime-local" v-model="date" />

      <button type="submit">Agendar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import api from '../services/api';

export default {
  name: 'AppointmentForm',
  setup() {
    const type = ref('consulta');
    const date = ref('');

    const onSubmit = async () => {
      if (!date.value) {
        alert('Selecione uma data e hora!');
        return;
      }
      try {
        await api.post('/appointments', {
          tipo: type.value,
          data: date.value,
        });
        alert('Agendamento realizado com sucesso!');
        date.value = '';
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao agendar');
      }
    };

    return { type, date, onSubmit };
  },
};
</script>

<style scoped>
.appointment-form {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  max-width: 400px;
}
label {
  display: block;
  margin-top: 10px;
}
button {
  margin-top: 15px;
}
</style>
