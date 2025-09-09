<template>
  <div>
    <div
      v-for="appt in sortedAppointments"
      :key="appt._id"
      class="appointment-card"
    >
      <p><strong>Data/Hora:</strong> {{ formatDateTime(appt.data) }}</p>
      <p><strong>CEP:</strong> {{ formatCEP(appt.endereco) }}</p>
      <p><strong>Paciente (ID):</strong> {{ appt.paciente }}</p>
      <p><strong>Previsão do Clima:</strong> {{ appt.previsaoClima || 'Não disponível' }}</p>
      <button @click="$emit('cancel', appt._id)">Cancelar</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import type { PropType } from 'vue';

export default defineComponent({
  name: 'AppointmentList',
  props: {
    appointments: {
      type: Array as PropType<any[]>,
      required: true,
    },
  },
  setup(props) {
    // Ordena do mais próximo ao mais distante
    const sortedAppointments = computed(() =>
      [...props.appointments].sort((a, b) => {
        const timeA = new Date(a.data).getTime();
        const timeB = new Date(b.data).getTime();
        return timeA - timeB;
      })
    );

    const formatDateTime = (datetime: string) => {
      const dateObj = new Date(datetime);
      return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;
    };

    const formatCEP = (cep: string) => {
      if (!cep) return 'Não disponível';
      const onlyNumbers = cep.replace(/\D/g, '');
      if (onlyNumbers.length !== 8) return cep;
      return onlyNumbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    };

    return {
      sortedAppointments,
      formatDateTime,
      formatCEP,
    };
  },
});
</script>

<style scoped>
.appointment-card {
  background: #fff;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
}

button {
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #dc2626;
}
</style>
