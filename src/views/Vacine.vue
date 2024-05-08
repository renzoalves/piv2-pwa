<template>
  <LayoutSidebar>
    <ChatWhatsapp :assinante="true"></ChatWhatsapp>
    <div v-if="processando" id="loading">
      <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>
    <div v-if="!perfilConfigurado">
      <h5 class="ml-3 mr-3">
        Olá {{ nome }}. Antes de continuarmos, precisamos configurar o seu
        Perfil. Nos informe no chat se precisar de ajuda&#128521;
      </h5>
      <hr />
      <TaxProfile
        :ufs="ufs"
        :ctribs="ctribs"
        :vacine="true"
        :solucaoid="21"
        :key="chave"
        :p_perfil="perfil"
        :index="perfil.prfIndex"
      />
    </div>

    <div class="container-fluid" v-else>
      <div class="row mt-5">
        <div class="mt-3">
          <TaxProfileInfo
            :multiplosPerfis="false"
            :solution="21"
            v-on:emit-atualizar-dados="AtualizarDadosPerfil"
          />
        </div>
      </div>

      <form class="mt-4" @submit.prevent="fetchVacine" id="app">
        <div class="container-fluid">
          <fieldset class="row">
            <div class="col-md-6">
              <h1>Destinatário</h1>
              <div class="card mb-2">
                <div class="card-body">
                  <div class="row">
                    <div class="campos col-md-12">
                      <label for="substICMSPerfil">Substituição ICMS</label>
                      <select
                        v-model="substICMSPerfil"
                        type="text"
                        id="substICMSPerfil"
                        class="form-control"
                      >
                        <option value="S">Sim</option>
                        <option value="N">Não</option>
                      </select>
                    </div>
                  </div>

                  <div class="row">
                    <div class="campos col-md-6 mb-2">
                      <label for="cnaeCaracTribPerfil">Atividade</label>
                      <select
                        class="form-control"
                        v-model="cnaeCaracTribPerfil"
                        type="text"
                        id="cnaeCaracTribPerfil"
                      >
                        <option value="0">INDÚSTRIA</option>
                        <option value="1">DISTRIBUIDOR</option>
                        <option value="2">ATACADO</option>
                        <option value="3">VAREJO</option>
                        <option value="4">
                          PRODUTOR RURAL PESSOA JURÍDICA
                        </option>
                        <option value="6">PRODUTOR RURAL PESSOA FÍSICA</option>
                        <option value="7">
                          PESSOA JURÍDICA NÃO CONTRIBUINTE DO ICMS
                        </option>
                        <option value="8">
                          PESSOA FÍSICA NÃO CONTRIBUINTE DO ICMS
                        </option>
                      </select>
                    </div>

                    <div class="campos col-md-6 mb-2">
                      <label for="regimeTribPerfil">Regime Tributário</label>
                      <select
                        class="form-control"
                        v-model="regimeTribPerfil"
                        type="text"
                        id="regimeTribPerfil"
                      >
                        <option value="SN">SIMPLES NACIONAL</option>
                        <option value="LR">LUCRO REAL</option>
                        <option value="LP">LUCRO PRESUMIDO</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <h1>Variação</h1>
              <div class="card">
                <div class="card-body variacao">
                  <div class="row">
                    <div class="campos col-md-6">
                      <label for="origem">Origem</label>
                      <input
                        class="form-control"
                        v-model="origem"
                        type="text"
                        id="origem"
                      />
                    </div>

                    <div class="campos col-md-6">
                      <label for="finalidade">Finalidade</label>
                      <input
                        class="form-control"
                        v-model="finalidade"
                        type="text"
                        id="finalidade"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="campos col-md-6">
                      <label for="cfop">CFOP</label>
                      <input
                        class="form-control"
                        v-model="cfop"
                        type="text"
                        id="cfop"
                      />
                    </div>

                    <div class="campos col-md-6">
                      <label for="codigos">Códigos</label>
                      <input
                        class="form-control"
                        v-model="codigos[0]"
                        type="text"
                        id="codigos"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </fieldset>

          <div class="row" style="align-items: center">
            <div class="campos col-md-1">
              <!-- Botão para acionar modal -->
              <button
                type="button"
                class="btn btn-sm btn-default btn-vacine"
                data-toggle="modal"
                data-target="#modalVacine"
              >
                Vacine
              </button>
            </div>
          </div>

          <!-- Modal Exportação -->
          <div
            class="modal fade"
            id="modalVacine"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">
                    Escolha o tipo
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <div class="modal-body">
                  <form>
                    <div class="form-group">
                      <select
                        class="form-control"
                        id="cbTipoNota"
                        v-model="tipoNota"
                      >
                        <option
                          v-for="i in tiposNota"
                          v-bind:key="i.tipo"
                          v-bind:value="i.tipo"
                        >
                          {{ i.descricao }}
                        </option>
                      </select>
                    </div>
                  </form>
                </div>

                <div class="modal-footer">
                  <label for="selecao-arquivo">
                    <span class="geral-button btn-sm">
                      Vacine
                      <input
                        v-bind:value="xml"
                        type="file"
                        id="selecao-arquivo"
                        accept=".xml, .txt"
                        @input="lerXml"
                      />
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="response != null" class="mt-3">
            <!-- class="table table-striped table-bordered table-sm " -->
            <table
              class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
            >
              <thead>
                <th class="text-center" scope="col">Chave</th>
                <th class="text-left" scope="col">Mensagem</th>
                <th class="text-center" scope="col">Prod. Enviados</th>
                <th class="text-center" scope="col">Prod. Retornados</th>
                <th scope="col" v-if="response.produtos.length > 0"></th>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{ response.chave }}</td>
                  <td class="text-left">{{ response.mensagem }}</td>
                  <td class="text-center">{{ response.prodEnv }}</td>
                  <td class="text-center">{{ response.prodRet }}</td>
                  <td
                    @click="mostrarProdutos"
                    v-if="response.produtos.length > 0"
                    style="cursor: pointer"
                    class="text-center"
                  >
                    <i class="fa fa-search lupa"></i>
                  </td>
                </tr>

                <tr v-if="mostraProdutos">
                  <td colspan="11">
                    <div style="display: block">
                      <table
                        class="table table-divider table-striped table-sm table-bordered"
                      >
                        <thead>
                          <th class="text-center" scope="col">ID</th>
                          <th class="text-center" scope="col">EAN</th>
                          <th class="text-left" scope="col">Descrição</th>
                          <th class="text-center" scope="col">Código</th>
                          <th class="text-center" scope="col">CFOP</th>
                          <th class="text-center" scope="col"></th>
                        </thead>
                        <tbody
                          v-for="(produto, index) in response.produtos"
                          :key="index"
                        >
                          <tr>
                            <td class="text-center" scope="row">
                              {{ produto.id }}
                            </td>
                            <td class="text-center">{{ produto.ean }}</td>
                            <td class="text-left">{{ produto.descricao }}</td>
                            <td class="text-center">{{ produto.codProd }}</td>
                            <td class="text-center">{{ produto.cfopProd }}</td>
                            <td class="text-center">
                              <i
                                v-if="produto.erros.length > 0"
                                v-bind:style="colorAlert"
                                class="fas fa-info-circle"
                                title="Produto vacinado apresentou Erros."
                                v-on:click.stop.prevent="MostrarErros(index)"
                              ></i>

                              <i
                                v-if="produto.advertencias.length > 0"
                                v-bind:style="colorWarning"
                                class="fas fa-info-circle"
                                title="Produto vacinado gerou Advertências."
                                @click.stop.prevent="MostrarAdvertencias(index)"
                              ></i>
                            </td>
                          </tr>

                          <tr v-if="index == iErros && abrirErro">
                            <td colspan="11">
                              <div style="display: block">
                                <table class="table table-sm">
                                  <caption style="caption-side: top">
                                    Erros
                                  </caption>
                                  <thead>
                                    <th class="text-left" scope="col">ID</th>
                                    <th class="text-left" scope="col">
                                      Mensagem
                                    </th>
                                    <th class="text-center" scope="col">
                                      Original
                                    </th>
                                    <th class="text-center" scope="col">
                                      Sugestão
                                    </th>
                                    <th class="text-left" scope="col">
                                      Base legal
                                    </th>
                                  </thead>

                                  <tbody>
                                    <tr
                                      v-for="(erro, index) in produto.erros"
                                      :key="index"
                                    >
                                      <td>{{ erro.id }}</td>
                                      <td>{{ erro.mensagem }}</td>
                                      <td class="text-center">
                                        {{ erro.original }}
                                      </td>
                                      <td class="text-center">
                                        {{ erro.sugestao }}
                                      </td>
                                      <td>{{ TirarAspas(erro.baseLegal) }}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>

                          <tr v-if="index == iAdvertencia && abrirAdv">
                            <td colspan="11">
                              <div style="display: block">
                                <table class="table table-sm">
                                  <caption style="caption-side: top">
                                    Advertencias
                                  </caption>
                                  <thead>
                                    <th class="text-left" scope="col">ID</th>
                                    <th class="text-left" scope="col">
                                      Mensagem
                                    </th>
                                    <th class="text-center" scope="col">
                                      Original
                                    </th>
                                    <th class="text-center" scope="col">
                                      Sugestão
                                    </th>
                                    <th class="text-left" scope="col">
                                      Base legal
                                    </th>
                                  </thead>
                                  <tbody>
                                    <tr
                                      v-for="(
                                        advertencia, index
                                      ) in produto.advertencias"
                                      :key="index"
                                    >
                                      <td class="text-left">
                                        {{ advertencia.id }}
                                      </td>
                                      <td class="text-left">
                                        {{ advertencia.mensagem }}
                                      </td>
                                      <td class="text-center">
                                        {{ advertencia.original }}
                                      </td>
                                      <td class="text-center">
                                        {{ advertencia.sugestao }}
                                      </td>
                                      <td>
                                        {{ TirarAspas(advertencia.baseLegal) }}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  </LayoutSidebar>
</template>

<script>
import { RetUrlAPI } from "@/helpers/axios.js";
import helpers from "@/helpers/index.js";
import axios from "axios";
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";
import router from "@/router/index";

const userStore = useAuthStore();

export default {
  data() {
    return {
      processando: false,
      perfilConfigurado: false,
      perfil: userStore.user.profile,
      nome: userStore.user.name,
      notificacoes: [],
      notificacao: {},
      produtos: {},

      iErros: -1,
      abrirErro: false,
      iAdvertencia: -1,
      abrirAdv: false,

      cnpjcpf: "00680516000124",
      crt: 3,
      xmlKey: "",
      xmlCnpj: "",
      xml: null,
      regimeTrib: helpers.DefCaracTrib(userStore.user.profile.prfTaxRegime),
      substICMS: "N",
      cnaeCaracTrib: helpers.DefCaracTrib(userStore.user.profile.prfTypeCnae),
      cnaeCaracTribPerfil: 2,
      substICMSPerfil: "N",
      regimeTribPerfil: "LR",
      origem: 0,
      finalidade: 0,
      cfop: "5405",
      codigos: [],
      response: null,
      variacoes: [],

      colorDefault: "",
      colorAlert: "color: red; cursor: pointer;",
      colorNormal: "color: green; cursor: pointer;",
      colorWarning: "color: #febd11; cursor: pointer;",
      mostrarErros: false,
      erros: [],
      advertencias: [],
      mostraProdutos: false,

      tipoNota: 0,
      tiposNota: [
        {
          tipo: 0,
          descricao: "Entrada",
        },
        {
          tipo: 1,
          descricao: "Saída",
        },
      ],
      exportar: true,
      tipoConsulta: 1,

      uf: userStore.user.profile.prfUf,
      ctribs: helpers.getTribs(),
      ctrib: helpers.DefCaracTrib(userStore.user.profile.prfTaxRegime),
      chave: 0,
      ufs: helpers.getUFs(),
      alertStore: useAlertStore(),
    };
  },
  methods: {
    AtualizarDadosPerfil() {
      this.uf = userStore.user.profile.prfUf;
      this.ctribs = helpers.getTribs();
      this.ctrib = helpers.DefCaracTrib(userStore.user.profile.prfTaxRegime);
      this.cnaeCaracTrib = helpers.DefCaracTrib(
        userStore.user.profile.prfTypeCnae
      );
      this.regimeTrib = helpers.DefCaracTrib(
        userStore.user.profile.prfTaxRegime
      );
      this.perfil = userStore.user.profile;
      this.nome = userStore.user.name;
    },
    fetchVacine: function () {
      this.processando = true;

      this.erros = [];
      this.advertencias = [];
      this.mostraProdutos = false;

      let url = RetUrlAPI("Vacine");

      if (this.codigos.length > 0) {
        this.variacoes.push({
          origem: this.origem,
          finalidade: this.finalidade,
          cfop: this.cfop,
          codigos: this.codigos[0],
        });
      }

      let data = {
        cnpjcpf: this.cnpjcpf,
        crt: this.changeCrt(this.changeRegimeT(this.regimeTrib)),
        xmlKey: this.xmlKey,
        xml: this.xml,
        amb: 2,
        homologacao: true,
        regimeTrib: this.changeRegimeT(this.regimeTrib),
        substICMS: this.substICMS,
        cnaeCaracTrib: this.changeAtividade(this.cnaeCaracTrib),
        perfil: {
          cnaeCaracTrib: parseInt(this.cnaeCaracTribPerfil),
          regimeTrib: this.regimeTribPerfil,
          substICMS: this.substICMSPerfil,
          variacoes: this.variacoes,
        },
      };

      if (this.changeAtividade(this.cnaeCaracTrib) == 99) {
        this.alertStore.error(
          "No Vacine, não são permitidos CNAE diferente de INDUSTRIA, ATACADO OU VAREJO, para prosseguir por favor, selecionar outro tipo."
        );

        this.processando = false;
        return;
      }

      if (this.changeRegimeT(this.regimeTrib) == 99) {
        this.alertStore.error(
          "No Vacine, não é permitido Regime Tributário 'Geral', para prosseguir por favor, selecionar outro tipo."
        );

        this.processando = false;
        return;
      }

      let config = {
        method: "POST",
        url: url,
        headers: {
          login: "29707440820014",
          senha: "imdstestes",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
      };

      axios
        .request(config)
        .then(async (response) => {
          this.response = response.data;

          // Ordenar
          this.response.produtos.sort(function (a, b) {
            if (a.descricao > b.descricao) {
              return 1;
            }
            if (a.descricao < b.descricao) {
              return -1;
            }
            return 0;
          });

          this.processando = false;
        })
        .catch((error) => {
        });
    },
    pegarXmlKey(arquivoXml) {
      let parser = new DOMParser();
      const tagXmlKey = parser.parseFromString(arquivoXml, "text/xml");
      let xmlKey = "";

      if (tagXmlKey.getElementsByTagName("infNFe")[0]) {
        xmlKey = tagXmlKey
          .getElementsByTagName("infNFe")[0]
          .attributes["Id"].value.substring(3);
      } else if (tagXmlKey.getElementsByTagName("infCFe")[0]) {
        xmlKey = tagXmlKey
          .getElementsByTagName("infCFe")[0]
          .attributes["Id"].value.substring(3);
      } else {
        Mensagem(2, "Formato XML inválido!");
        return;
      }
      return xmlKey;
    },
    pegarCnpj(arquivoXml) {
      let parser = new DOMParser();
      const tagXmlKey = parser.parseFromString(arquivoXml, "text/xml");
      const tagCnpj = parser.parseFromString(arquivoXml, "text/xml");

      // Verifica se o XML é CFe
      if (tagXmlKey.getElementsByTagName("infCFe")[0]) {
        this.xmlCnpj = tagCnpj
          .getElementsByTagName("emit")[0]
          .getElementsByTagName("CNPJ")[0].textContent;
        return this.xmlCnpj;
      }

      switch (this.tipoNota) {
        case 0:
          this.xmlCnpj = tagCnpj
            .getElementsByTagName("dest")[0]
            .getElementsByTagName("CNPJ")[0].textContent;
          break;
        case 1:
          this.xmlCnpj = tagCnpj
            .getElementsByTagName("emit")[0]
            .getElementsByTagName("CNPJ")[0].textContent;
          break;
      }

      return this.xmlCnpj;
    },
    lerXml: function (e) {
      this.response = null;
      const fileExtension = /xml.*/;
      const fileToBeRead = e.target.files[0];

      if (fileToBeRead.type.match(fileExtension)) {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          this.xml = fileReader.result;
          this.xml = this.xml.replaceAll('"', "'");

          this.xmlCnpj = this.pegarCnpj(this.xml);
          this.xml = this.xml.replaceAll(this.xmlCnpj, this.cnpjcpf);

          this.xmlKey = this.pegarXmlKey(this.xml);

          $("#modalVacine").modal("hide");

          this.fetchVacine();

          this.xml = "";
        };

        fileReader.readAsText(fileToBeRead);
      } else {
        this.xml = "";
      }

      this.anexo = true;
    },
    MostrarErros(index) {
      this.iErros = index;
      this.abrirErro = !this.abrirErro;
    },
    MostrarAdvertencias(index) {
      this.iAdvertencia = index;
      this.abrirAdv = !this.abrirAdv;
    },
    changeCrt(value) {
      switch (value) {
        case "SN":
          return 1;
          break;
        default:
          return 3;
          break;
      }
    },
    changeRegimeT(value) {
      switch (value) {
        case "SIMPLES NACIONAL":
          return "SN";
        case "LUCRO REAL":
          return "LR";
        case "LUCRO PRESUMIDO":
          return "LP";
        default:
          return 99;
      }
    },
    changeAtividade(value) {
      switch (value) {
        case "INDUSTRIA":
          return 0;
        case "ATACADO":
          return 2;
        case "VAREJO":
          return 3;
        default:
          return 99;
      }
    },
    mostrarProdutos() {
      this.mostraProdutos = true;
    },
    TirarAspas(value) {
      var texto = value.replaceAll("'", "");

      return texto;
    },
  },
  mounted() {
    helpers.VerificarAutenticacao();
    let autorizado = helpers.VerificarAcessos(21);

    if (!autorizado) {
      userStore.user.mensagem =
        "Você não possui acesso ao Vacine. Entre em contato com o nosso time de comercial!";
      router.push("/");
      // return;
    }
    
    this.perfilConfigurado = userStore.user.profile.hasProfile;
  },
};
</script>

<style lang="less">
.variacao {
  padding-bottom: 29px;
}

.campos {
  padding: 10px;
}

.btn-vacine {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 15px;
  border-radius: 5px;
  border: 3px solid var(--primaryYellow);
  box-sizing: border-box;
  color: #000;
  font-weight: 600;
  font-size: 18px;
  background: var(--primaryYellow);
  text-decoration: none;
  cursor: pointer;
  margin-left: 5px;
}

.btn-vacine:focus {
  box-shadow: inset 0px 5px 5px #00000029;
  border: 3px solid var(--darkYellow);
}

.btn-vacine:hover {
  background: var(--primaryYellowDarken);
  border: 3px solid var(--primaryYellowDarken);
}

.btn-vacine:disabled {
  opacity: 0.3;
  pointer-events: none;
  cursor: default;
  position: relative;
}

.appFooter {
  border: solid 2px black;
}
</style>
