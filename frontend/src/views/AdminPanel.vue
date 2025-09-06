<template>
  <div>
    <h1>Painel Administrativo</h1>
    <AppointmentList />
  </div>
</template>

<script lang="ts">
import AppointmentList from '../components/AppointmentList.vue';

export default {
  components: {
    AppointmentList,
  },
};
</script>
