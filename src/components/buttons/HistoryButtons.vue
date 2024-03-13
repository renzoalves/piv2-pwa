<template>
  <div class="mb-1" style="display: inline-block">
    <input
      type="button"
      class="btn btn-sm btn-outline-primary mr-2 mt-2"
      v-bind:value="valor"
      v-bind:id="'btn' + valor"
      v-on:click="ChamarConsultaPai(valor)"
    />
    <i
      class="fas fa-times mouseHand mr-2"
      v-bind:id="'i' + valor"
      v-on:click="ExcluirElemento('btn' + valor)"
    ></i>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import helpers from "@/helpers";

const userStore = useAuthStore();

export default {
  props: {
    valor: { type: String },
    key: { type: String },
  },
  methods: {
    ChamarConsultaPai(valor) {
      let tipoConsulta = helpers.VerificarTipoConsulta(valor);
      let sessionHistoric = JSON.parse(userStore.user.historic);

      for (var i = 0; i < sessionHistoric.length; i++) {
        if (sessionHistoric[i].valor === valor) {
          var cest = sessionHistoric[i].cest;
        }
      }

      // this.$parent.Consult(valor, tipoConsulta, null, null, cest);
      this.$emit("consult", valor, tipoConsulta, null, null, cest);
    },
    ExcluirElemento(key) {
      this.$emit("excluir-elemento", key);
    },
  },
};
</script>

<style></style>
