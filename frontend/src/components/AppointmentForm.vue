<template>
  <div class="appointment-form">
    <h2>Agendar Procedimento</h2>
    <form @submit.prevent="onSubmit">
      <label>Tipo de procedimento:</label>
      <select v-model="tipo">
        <option value="Consulta">Consulta</option>
        <option value="Exame">Exame</option>
      </select>

      <label>Data e hora:</label>
      <input type="datetime-local" v-model="data" />

      <label>Duração (minutos):</label>
      <input type="number" v-model.number="duration" min="15" />

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
    const tipo = ref('Consulta'); // valor enviado como descricao
    const data = ref('');
    const duration = ref<number | null>(60);

    const onSubmit = async () => {
      if (!data.value || !duration.value) {
        alert('Data e duração são obrigatórios!');
        return;
      }

      try {
        await api.post('/api/appointments', {
          data: data.value,
          duration: duration.value,
          descricao: tipo.value, // envia o tipo como descricao
        });

        alert('Agendamento realizado com sucesso!');

        // Limpa o formulário
        data.value = '';
        duration.value = 60;
        tipo.value = 'Consulta';
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao agendar');
        console.error(err);
      }
    };

    return { tipo, data, duration, onSubmit };
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

input,
select {
  width: 100%;
  margin-top: 5px;
  padding: 5px;
  box-sizing: border-box;
}

button {
  margin-top: 15px;
  padding: 8px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2563eb;
}
</style>
