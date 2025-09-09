<template>
  <div class="form-container">
    <h1>Cadastro</h1>
    <form @submit.prevent="onSubmit" novalidate>
      <!-- Nome -->
      <div class="form-field">
        <input v-model="nome" placeholder="Nome" />
        <span v-if="errors.nome" class="error">{{ errors.nome }}</span>
      </div>

      <!-- E-mail -->
      <div class="form-field">
        <input v-model="email" placeholder="E-mail" type="email" />
        <span v-if="errors.email" class="error">{{ errors.email }}</span>
      </div>

      <!-- Senha -->
      <div class="form-field">
        <input v-model="senha" type="password" placeholder="Senha" />
        <span v-if="errors.senha" class="error">{{ errors.senha }}</span>
      </div>

      <!-- Role -->
      <div class="form-field">
        <select v-model="role">
          <option value="paciente">Paciente</option>
          <option value="secretario">Secretário</option>
        </select>
        <span v-if="errors.role" class="error">{{ errors.role }}</span>
      </div>

      <!-- CEP -->
      <div class="form-field">
        <input
          v-model="cep"
          placeholder="CEP"
          @blur="fetchAddress"
          maxlength="8"
        />
        <span v-if="errors.cep" class="error">{{ errors.cep }}</span>
        <span v-if="loadingCep" class="info">Buscando endereço...</span>
        <span v-if="cepSuccess" class="success">Endereço carregado com sucesso!</span>
        <span v-if="cepError" class="error">{{ cepError }}</span>
      </div>

      <!-- Número do endereço -->
      <div class="form-field">
        <input v-model="numero" placeholder="Número" />
        <span v-if="errors.numero" class="error">{{ errors.numero }}</span>
      </div>

      <!-- Logradouro, Bairro, Complemento, Localidade, UF -->
      <div class="form-field">
        <input v-model="logradouro" placeholder="Logradouro" readonly />
      </div>

      <div class="form-field">
        <input v-model="complemento" placeholder="Complemento (opcional)" />
      </div>

      <div class="form-field">
        <input v-model="bairro" placeholder="Bairro" readonly />
      </div>
      <div class="form-field">
        <input v-model="localidade" placeholder="Cidade" readonly />
      </div>
      <div class="form-field">
        <input v-model="uf" placeholder="UF" readonly />
      </div>

      <button type="submit">Cadastrar</button>
    </form>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const nome = ref('');
    const email = ref('');
    const senha = ref('');
    const role = ref('paciente');
    const cep = ref('');
    const numero = ref('');
    const logradouro = ref('');
    const complemento = ref('');
    const bairro = ref('');
    const localidade = ref('');
    const uf = ref('');

    const loadingCep = ref(false);
    const cepSuccess = ref(false);
    const cepError = ref('');

    const router = useRouter();
    const errors = ref<any>({});

    const validateEmail = (emailStr: string) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(emailStr);
    };

    const validate = () => {
      const newErrors: any = {};
      if (!nome.value.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!email.value.trim()) newErrors.email = 'E-mail é obrigatório';
      else if (!validateEmail(email.value)) newErrors.email = 'E-mail inválido';
      if (!senha.value.trim()) newErrors.senha = 'Senha é obrigatória';
      if (!role.value) newErrors.role = 'Role é obrigatório';
      if (!cep.value.trim()) newErrors.cep = 'CEP é obrigatório';
      if (cep.value && !/^\d{8}$/.test(cep.value))
        newErrors.cep = 'CEP deve ter 8 dígitos';
      if (!numero.value.trim()) newErrors.numero = 'Número é obrigatório';
      errors.value = newErrors;
      return Object.keys(newErrors).length === 0;
    };

    const fetchAddress = async () => {
      if (!cep.value.trim() || !/^\d{8}$/.test(cep.value)) return;
      loadingCep.value = true;
      cepError.value = '';
      cepSuccess.value = false;
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep.value}/json/`);
        if (res.data.erro) {
          cepError.value = 'CEP não encontrado.';
          logradouro.value = '';
          bairro.value = '';
          localidade.value = '';
          uf.value = '';
        } else {
          logradouro.value = res.data.logradouro || '';
          bairro.value = res.data.bairro || '';
          localidade.value = res.data.localidade || '';
          uf.value = res.data.uf || '';
          cepSuccess.value = true;
        }
      } catch (err) {
        cepError.value = 'Erro ao buscar endereço pelo CEP.';
      } finally {
        loadingCep.value = false;
      }
    };

    const onSubmit = async () => {
      if (!validate()) return;

      try {
        await api.post('/api/users/register', {
          nome: nome.value,
          email: email.value,
          senha: senha.value,
          role: role.value,
          address: {
            cep: cep.value,
            numero: numero.value,
            logradouro: logradouro.value,
            complemento: complemento.value,
            bairro: bairro.value,
            localidade: localidade.value,
            uf: uf.value,
          },
        });
        alert('Cadastro realizado! Faça login.');
        router.push('/login');
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Erro ao cadastrar');
      }
    };

    return {
      nome,
      email,
      senha,
      role,
      cep,
      numero,
      logradouro,
      complemento,
      bairro,
      localidade,
      uf,
      errors,
      loadingCep,
      cepSuccess,
      cepError,
      fetchAddress,
      onSubmit,
    };
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

input,
select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

input[readonly] {
  background-color: #f3f3f3;
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

.info {
  color: #2563eb;
  font-size: 0.85rem;
  margin-top: 4px;
}

.success {
  color: #16a34a;
  font-size: 0.85rem;
  margin-top: 4px;
}
</style>


<!-- <template>
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
        await api.post('/api/users/register', {
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
</script> -->
