<template>
  <div class="appointment-list">
    <h2>Agendamentos</h2>
    <ul>
      <li v-for="appt in appointments" :key="appt._id">
        {{ formatDate(appt.data) }} - {{ appt.tipo }} - {{ appt.paciente?.name || 'Paciente não disponível' }}
        <button @click="cancelAppointment(appt._id)">Cancelar</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';

export default {
  name: 'AppointmentList',
  setup() {
    const appointments = ref<any[]>([]);

    const fetchAppointments = async () => {
      try {
        const res = await api.get('/appointments');
        appointments.value = res.data;
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao buscar agendamentos');
      }
    };

    const cancelAppointment = async (id: string) => {
      if (!confirm('Deseja realmente cancelar este agendamento?')) return;
      try {
        await api.delete(`/appointments/${id}`);
        appointments.value = appointments.value.filter(a => a._id !== id);
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao cancelar');
      }
    };

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleString();
    };

    onMounted(() => {
      fetchAppointments();
    });

    return { appointments, cancelAppointment, formatDate };
  },
};
</script>

<style scoped>
.appointment-list {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  max-width: 600px;
  margin-top: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
button {
  margin-left: 10px;
}
</style>
