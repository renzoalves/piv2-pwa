<template>
  <div class="row mb-1 mt-2">
    <div class="col"></div>
    <div class="col-md-8">
      <input
        type="text"
        class="form-control form-control valor"
        placeholder="Informe o SKU desejado. Para mais de um, separe por ponto-e-vírgula."
        v-on:keyup.enter="EnviarListaDirecionadaParaAceite(listaSkus)"
        v-model="listaSkus"
      />
      <div id="lupa" v-on:click="EnviarListaDirecionadaParaAceite(listaSkus)">
        <i class="fa fa-search lupa"></i>
      </div>
    </div>
    <div class="col"></div>

    <div class="col-12 mt-4 text-center" v-if="processando">
      <div class="spinner-border text-info text-center" role="status"></div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import methodsSankhya from "@/components/integracoes/sankhya/main.js";
import methodsBluesoft from "@/components/integracoes/bluesoft/main.js";

const userStore = useAuthStore();

export default {
  data() {
    return {
      //----------------------------------------------------------------
      //#region Atribuições vindas das Props

      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Locais

      listaSkus: "",
      processando: false,
      tipoIntegracao: userStore.user.idSolucaoIntegracao,

      //#endregion
      //----------------------------------------------------------------
    };
  },

  methods: {
    EnviarListaDirecionadaParaAceite(listaSkus) {
      var skuEnvio = new Object();

      if (!listaSkus || listaSkus.length <= 0) {
        Swal.fire({
          title: "Ops!",
          html: "Nenhuma informação foi encontrada no campo destinado para informe do(s) SKU(s).<br>Verifique e tente novamente.",
          icon: "error",
        });
        return;
      }

      switch (this.tipoIntegracao) {
        case "52":
          this.EnviarListaSankhya(listaSkus);
          break;

        case "53":
          this.EnviarListaBlueSoft(listaSkus);
          break;

        default:
          break;
      }
    },

    EnviarListaSankhya(listaSkus) {
      this.processando = true;

      const listaFiltro = listaSkus.split(";");
      var skuEnvio = new Object();
      skuEnvio.produtos = [];

      for (let index = 0; index < listaFiltro.length; index++) {
        const element = new Object();
        element.sku = Number(listaFiltro[index]);

        skuEnvio.produtos.push(element);
      }
      methodsSankhya.DefinirListaDirecionadaParaAceite_sankhya(this, skuEnvio);
    },

    EnviarListaBlueSoft(listaSkus) {
      this.processando = true;

      const listaFiltro = listaSkus.split(";");

      methodsBluesoft.DefinirListaDirecionadaParaAceite_bluesoft(
        this,
        listaFiltro
      );
    },

    RetornoEnvioDeSkus() {
      this.listaSkus = "";
      this.processando = false;
    },
  },
};
</script>

<style></style>
