<template>
  <LayoutSidebar>
    <ChatWhatsapp :assinante="userLogged"></ChatWhatsapp>
    <div class="content">
      <div class="content-box">
        <div class="flex-box">
          <div class="text">
            <h2 v-if="!userStore.user.hasAuth">Bem-vindo ao Portal iMendes!</h2>

            <h2 v-else>
              {{ userStore.user.name }}, seja bem-vindo ao Portal iMendes!
            </h2>

            <p>
              Experimente gratuitamente <span>Gestor Tributário:</span> realize
              até 5 consultas individuais e/ou em lote de informações
              tributárias em âmbito Estadual e Federal
            </p>
          </div>
          <div class="search">
            <label>Pesquise um produto por descrição:</label>

            <form @submit.prevent="searchFromHome">
              <div class="col-md-12 mb-1">
                <input
                  class="form-control form-control-sm valor"
                  id="valor"
                  placeholder="Descrição"
                  v-model="searchValue"
                />
                <div id="lupa" v-on:click="searchFromHome">
                  <i class="fa fa-search lupa"></i>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div class="box-grid">
        <div class="content-box vertical">
          <div class="text">
            <img
              class="logo"
              src="@/assets/images/gt.png"
              alt="Logotipo Gestor Tributário"
            />

            <h2>Gestor Tributário</h2>

            <p>
              Decifre a tributação com facilidade! Use nossa ferramenta de
              consulta para obter informações detalhadas com código de barras,
              NCM ou descrição de produtos. Simplifique sua gestão fiscal e
              garanta a conformidade tributária!
            </p>

            <button
              class="geral-button"
              v-if="userStore.user.hasAuth && hasGT"
              @click="acessar(19)"
            >
              Acessar
            </button>

            <button
              class="geral-button"
              v-if="!hasGT"
              @click="openSolucoes(19)"
            >
              Contratar
            </button>
          </div>
        </div>

        <div class="content-box vertical">
          <div class="text">
            <img
              class="logo"
              src="@/assets/images/moostri.png"
              alt="Logotipo Moostri"
            />

            <h2>Moostri</h2>

            <p>
              Integre tributos às compras e preços com precisão. Calcule custos,
              preços de venda e margem líquida de forma eficiente.
            </p>

            <button
              class="geral-button"
              v-if="userStore.user.hasAuth && hasMT"
              @click="acessar(20)"
            >
              Acessar
            </button>

            <button
              class="geral-button"
              v-if="!hasMT"
              @click="openSolucoes(20)"
            >
              Contratar
            </button>
          </div>
        </div>
      </div>
    </div>
  </LayoutSidebar>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/user";
import { useRouter } from "vue-router";

const userStore = useAuthStore();
const router = useRouter();

const userLogged = userStore.user.hasAuth;
const searchValue = ref("");
const mustBeLoggedModal = ref(false);
const especialContractModal = ref(false);
const hasGT = ref(false);
const hasMT = ref(false);

const searchFromHome = () => {
  if (searchValue.value <= 0) return;

  let search = new Object();

  search.type = "DESCRICAO";
  search.text = searchValue.value;

  userStore.user.mainSearch = JSON.stringify(search);

  searchValue.value = "";

  router.push("/gestor-tributario/consulta");
};

const openSolucoes = (idSolucao) => {
  router.push(`/contrato?${idSolucao}`);
};

const acessar = (idSolucao) => {
  switch (idSolucao) {
    case 19:
      router.push("/gestor-tributario/consulta");
      break;
    case 20:
      router.push("/moostri");
      break;
  }
};

const modules = userStore.user.modules;

if (typeof modules != "undefined") {
  modules.forEach((e) => {
    if (e.description == "PORTAL IMENDES GT CONSULTA") {
      hasGT.value = true;
    }

    if (e.description == "PORTAL IMENDES MOOSTRI") {
      hasMT.value = true;
    }
  });
}
</script>

<style scoped lang="less">
.content-box {
  background: #fff;
  padding: 50px 70px;
  border-radius: 5px;
  gap: 180px;
  height: auto;

  p,
  label {
    font-size: 18px;
    color: @primaryGray;
    line-height: 22px;
    width: 75%;
  }

  h2 {
    font-size: 30px;
    color: @primaryBlue;
    margin-bottom: 15px;
  }
}

.modal-title .iconify {
  font-size: 78px;
  color: @primaryBlue;
  margin-bottom: 15px;
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;

  .geral-button {
    padding: 15px 80px;
  }
}

.small-modal-content {
  width: 400px;
  margin: 0px auto;
}

.blueButton {
  background: @primaryBlue;
  color: @primaryYellow;
  border: 3px solid @primaryBlue;

  &:hover {
    background: darken(@primaryBlue, 10%);
    border: 3px solid darken(@primaryBlue, 10%);
  }
}

.content {
  padding-bottom: 50px;

  .box-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 25px;
    gap: 30px;
  }

  .content-box {
    .flex-box {
      display: flex;
      align-items: center;
      gap: 50px;
    }

    &.vertical {
      .gt-actions {
        display: flex;
        align-items: center;
        gap: 20px;
      }

      .text {
        width: 100%;

        img {
          width: 65%;
          margin-bottom: 55px;
        }

        p {
          width: 90%;
        }
      }

      .geral-button {
        margin-top: 50px;
        width: 280px;
      }
    }

    .text {
      width: 50%;
    }

    .search {
      width: 40%;

      .input-wrapper {
        position: relative;

        .iconify {
          position: absolute;
          right: 0px;
          top: 50%;
          transform: translateX(-50%);
          font-size: 34px;
          color: @primaryBlue;
        }

        input {
          margin-top: 35px;
          width: 100%;
          background: @lightGray;
        }
      }
    }
  }
}

@media only screen and (max-width: 1366px) {
  .content .box-grid {
    margin-top: 15px;
    gap: 15px;
  }

  .content-box {
    padding: 30px 50px;
    h2 {
      font-size: 26px;
    }
  }
}

@media only screen and (max-width: 1024px) {
  .content {
    .content-box {
      padding: 30px;
      .flex-box {
        gap: 20px;
        flex-direction: column;

        .search {
          width: 100%;
        }

        .text {
          width: 100%;
        }
      }

      &.vertical .text p {
        width: 100%;
      }
    }
  }
}

@media only screen and (max-width: 768px) {
  .content .box-grid {
    grid-template-columns: 1fr;
  }

  .content-box p,
  .content-box label {
    width: 100%;
  }
}

@media only screen and (max-width: 600px) {
  .content-box h2 {
    font-size: 20px;
  }

  .content-box p,
  .content-box label {
    font-size: 16px;
  }
}
</style>
