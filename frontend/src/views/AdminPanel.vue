<template>
  <div class="admin-panel">
    <h2>Painel Administrativo</h2>

    <!-- Exibe enquanto o usuário está sendo carregado -->
    <div v-if="loadingUser">
      <p>Carregando usuário...</p>
    </div>

    <!-- Painel para secretários -->
    <div v-else-if="user?.role === 'secretario'">
      <h3>Agendamentos</h3>

      <appointment-list
        v-if="appointments.length"
        :appointments="appointments"
        @cancel="cancelAppointment"
      />

      <div v-else>
        <p>Nenhum agendamento encontrado.</p>
      </div>
    </div>

    <!-- Usuários não autorizados -->
    <div v-else>
      <p>Acesso restrito ao Painel Administrativo.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import api from '../services/api';
import router from '../router';
import AppointmentList from '../components/AppointmentList.vue';

export default {
  name: 'AdminPanel',
  components: { AppointmentList },
  setup() {
    const user = ref<any>(null);
    const appointments = ref<any[]>([]);
    const loadingUser = ref(true);

    // Carrega usuário do localStorage
    const loadUser = () => {
      const stored = localStorage.getItem('clinica_user');
      if (stored && stored !== 'undefined' && stored !== 'null') {
        try {
          user.value = JSON.parse(stored);
        } catch (e) {
          console.error('Erro ao parsear clinica_user do localStorage', e);
          user.value = null;
        }
      }
      loadingUser.value = false;
    };

    // Redireciona se não for secretário
    const checkAccess = () => {
      if (!user.value || user.value.role !== 'secretario') {
        router.push('/login');
      }
    };

    // Buscar agendamentos
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/appointments');
        appointments.value = res.data;
      } catch (err: any) {
        alert('Erro ao buscar agendamentos');
        console.error(err);
      }
    };

    // Cancelar agendamento
    const cancelAppointment = async (id: string) => {
      if (!confirm('Deseja realmente cancelar este agendamento?')) return;
      try {
        await api.delete(`/api/appointments/${id}`);
        appointments.value = appointments.value.filter((a) => a._id !== id);
      } catch (err: any) {
        alert('Erro ao cancelar agendamento');
        console.error(err);
      }
    };

    onMounted(() => {
      loadUser();
      checkAccess();
      if (user.value?.role === 'secretario') {
        fetchAppointments();
      }
    });

    return {
      user,
      loadingUser,
      appointments,
      cancelAppointment,
    };
  },
};
</script>

<style scoped>
.admin-panel {
  padding: 20px;
}
</style>


