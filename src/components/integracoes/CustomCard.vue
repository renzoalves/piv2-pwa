<template>
  <div
    class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ml-0 mr-0 mt-2 mb-1"
    :title="cardTitle"
  >
    <div class="card-label">
      <div class="card-label-header">
        <div>
          <!-- <img :src="require(imgPath)" :alt="imgAlt" /> -->
          <img
            v-if="imgAlt === 'cliente'"
            src="@/assets/images/icons/user-tie-solid.svg"
            :alt="imgAlt"
          />
          <img
            v-if="imgAlt === 'prod-finalizados'"
            src="@/assets/images/icons/check-double-solid.svg"
            :alt="imgAlt"
          />
          <img
            v-if="imgAlt === 'prod-analise'"
            src="@/assets/images/icons/ranking-star-solid.svg"
            :alt="imgAlt"
          />
          <img
            v-if="imgAlt === 'analisado'"
            src="@/assets/images/icons/percent-solid.svg"
            :alt="imgAlt"
          />
        </div>

        <div>
          <h6 class="ml-1 mt-0">
            <strong>{{ titulo }}</strong>
          </h6>
        </div>
      </div>

      <p class="ml-2 mr-2 text-center"><slot> texto-slot </slot></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    p_titulo: String,
    p_icone: String,
  },
  data() {
    return {
      titulo: this.p_titulo,
      icone: this.p_icone,
      cardTitle: "",
      imgPath: "",
      imgAlt: "",
    };
  },
  methods: {
    ObterIcone(tipoIcone) {
      this.imgAlt = tipoIcone;

      switch (tipoIcone) {
        case "cliente":
          this.imgPath = "'@/assets/images/icons/user-tie-solid.svg'";
          this.cardTitle = "CNPJ e Razão Social do Cliente";
          break;

        case "prod-finalizados":
          this.imgPath = "'@/assets/images/icons/check-double-solid.svg'";
          this.cardTitle = "Produtos Finalizados";
          break;
        case "prod-analise":
          this.imgPath = "'@/assets/images/icons/ranking-star-solid.svg'";
          this.cardTitle = "Produtos em Análise";
          break;

        case "analisado":
          this.imgPath = "'@/assets/images/icons/percent-solid.svg'";
          this.cardTitle = "Percentual já Analisado";
          break;

        default:
          break;
      }
    },
  },

  created() {
    this.ObterIcone(this.p_icone);
  },

  mounted() {},

  watch: {},

  computed: {},
};
</script>

<style></style>
