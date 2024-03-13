<template>
  <div class="footer-info">
    <div class="actions">
      <a
        style="color: dimgray"
        href="#"
        data-toggle="modal"
        data-target="#profileModal"
        data-backdrop="static"
        data-keyboard="false"
        title="Editar as características tributárias básicas."
      >
        <i
          class="fa fa-address-card"
          style="color: chocolate"
          aria-hidden="true"
        ></i
        >&nbsp;Editar Perfil
      </a>
      &nbsp;
      <a
        style="color: dimgray; justify-content: right"
        href="#"
        data-toggle="modal"
        data-target="#modalVigencia"
        data-backdrop="static"
        data-keyboard="false"
        title="Informar da Data de Vigência desejada."
      >
        <i
          class="fa fa-calendar"
          style="color: chocolate"
          aria-hidden="true"
        ></i
        >&nbsp;Def. Vigência
      </a>
    </div>
    <div class="info" v-if="!multiplosPerfis">
      <span>
        Perfil ativo:     <i>{{ userStore.user.profile.prfApelido }} </i>&nbsp;
        |UF:              <i>{{ userStore.user.profile.prfUF }} </i>&nbsp;
        |Atividade:       <i>{{ userStore.user.profile.prfTypeCnae }} </i>&nbsp;
        |Reg. Tributário: <i>{{ helpers.DefCaracTrib(userStore.user.profile.prfTaxRegime) }} </i>&nbsp;
        |Vigência:        <i>{{ helpers.ConverterDataBr(dataVigencia) }} </i>
        </span>
    </div>
    <div class="list" v-else>
      <ul v-for="(item, index) in perfis" v-bind:key="index">
        <li class="info">
            <span>
                Perfil ativo:       <i>{{ item.prfApelido }} </i>&nbsp;
                | UF:               <i>{{ item.prfUF }} </i>&nbsp;
                | Atividade:        <i>{{ item.prfTypeCnae }} </i>&nbsp;
                | Reg. Tributário:  <i>{{ helpers.DefCaracTrib(item.prfTaxRegime) }} </i>&nbsp;
                | Vigência:         <i>{{ helpers.ConverterDataBr(dataVigencia) }}  </i>
            </span>
        </li>
      </ul>
    </div>
  </div>
  <!-- Modal Perfil -->
  <div
    class="modal fade bd-example-modal-lg"
    id="profileModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="TituloModalCentralizado"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal-Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="TituloModalCentralizado">
            Configurar Perfil
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Fechar"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!-- Modal-Body -->
        <div class="modal-body">
          <TaxProfile
            :ufs="UFs"
            :ctribs="Tribs"
            :p_perfil="perfil"
            :index="perfil.prfIndex"
            v-on:emit-perfil="
              FecharModal('#profileModal');
              this.$emit('emit-atualizar-dados');
            "
          />
        </div>
      </div>
    </div>
  </div>
  <!-- Modal Data Vigência -->
  <div
    class="modal fade"
    id="modalVigencia"
    tabindex="-1"
    role="dialog"
    aria-labelledby="TituloModalCentralizado"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="TituloModalCentralizado">
            Data Vigência
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Fechar"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <input
            type="date"
            class="form-control form-control-sm"
            v-model="dataVigencia"
            id="dataVigencia"
            autofocus
          />
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="geral-button btn-sm"
            v-on:click="DefinirDataVigencia()"
            data-dismiss="modal"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/user";
import TaxProfile from "@/components/TaxProfile.vue";
import GeralModal from "@/components/GeralModal.vue";
import GeralInput from "@/components/GeralInput.vue";
import helpers from "@/helpers";

const userStore = useAuthStore();

const UFs = helpers.getUFs();
const Tribs = helpers.getTribs();
const Cnaes = helpers.getCnaes();

const showEditValidtyModal = ref(false);
const showTaxProfileModal = ref(false);

const perfil = userStore.user.profile;
const perfis = userStore.user.userProfile;
let dataVigencia = userStore.user.profile.prfValidity
  ? userStore.user.profile.prfValidity
  : new Date().toISOString().slice(0, 10);

const FecharModal = (modal) => {
  $(modal).modal("hide");
};

const DefinirDataVigencia = () => {
  userStore.user.profile.prfValidity = dataVigencia;
};

const props = defineProps({
  multiplosPerfis: Boolean,
});
</script>

<style>
.footer-info {
  position: relative;
  left: 15px !important;
  top: -60px;
  word-wrap: wrap;
  /* border: 1px solid black; */
  max-width: 1000px;
}

.info {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  /* justify-content: end; */
  gap: 5px;
}

span {
  font-weight: normal;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.modal-title.data-title {
  margin-bottom: 30px;
}

.list {
  max-height: 50px;
  overflow-y: scroll;
}

.list li {
  margin-bottom: 10px;
}

.list::-webkit-scrollbar {
  width: 18px;
}

.list::-webkit-scrollbar-thumb {
  background: #febd11;
  border-left: 4px solid #faf6ed;
  border-right: 4px solid #faf6ed;
}

.list::-webkit-scrollbar-track {
  background: #faf6ed;
}
</style>
