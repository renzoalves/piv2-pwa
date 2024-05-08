<template>
  <LayoutSidebar>
    <ChatWhatsapp :assinante="userLogged"></ChatWhatsapp>
    <div class="container-fluid">

      <div class="row mt-5">
        <div class="mt-3">
          <TaxProfileInfo
            v-if="!isMobile"
            :multiplosPerfis="false"
            :solution="19"
             v-on:emit-atualizar-dados="AtualizarDadosPerfil"
          />
        </div>
      </div>
      
      <div class="row">
        <div class="col-md-9"></div>
        <div class="col-md-3 ml-auto mb-2">
          <select
            class="form-control form-control-sm"
            id="selectSolucao"
            v-model="solucao"
            :disabled="!possuiGrades"
          >
            <option value="gtconsulta">Consulta Por Produto</option>
            <option value="sanemaneto3">Consulta Por Operação</option>
          </select>
        </div>

      </div>

      <div class="row">
        <div class="col-md-12">
          <gtconsulta v-if="solucao == 'gtconsulta'"></gtconsulta>
        </div>
        <div class="col-md-12">
          <saneamento3 v-if="solucao == 'sanemaneto3'"></saneamento3>
        </div>
      </div>

    </div>

  </LayoutSidebar>
</template>

<script>
import helpers from "@/helpers/index.js";
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";

import gtconsulta from "./GTConsulta.vue";
import saneamento3 from "./Saneamento3.vue";
import ChatWhatsapp from "../components/ChatWhatsapp.vue";

const userStore = useAuthStore();

export default {
  components: {
    gtconsulta,
    saneamento3,
    ChatWhatsapp,
  },
  data() {
    return {
      isMobile: true,
      solucao: "gtconsulta",
      perfilConfigurado: false,
      possuiGrades: false,
      userLogged: userStore.user.hasAuth,
    };
  },
  methods: {
    AtualizarDadosPerfil() {}
  },
  created() {
    if (
      !userStore.user.hasAuth ||
      userStore.user.userStatus == "D" ||
      userStore.user.userStatus == "T"
    ) {
      helpers.DefinePerfilTemporario();
    }
  },
  mounted() {
    this.isMobile = false;

    if (window.screen.width <= 768) {
      this.isMobile = true;
    }

    if (this.userLogged) {
      helpers.VerificarAutenticacao();
      this.possuiGrades = helpers.VerificarAcessos(22);
    }
    this.perfilConfigurado = userStore.user.profile.hasProfile;
  },
};
</script>
<style></style>
