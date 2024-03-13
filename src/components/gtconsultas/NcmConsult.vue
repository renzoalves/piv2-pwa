<template>
  <div>
    <div v-if="processando" id="loading">
      <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>

    <p
      class="text-right p-0"
      v-if="objNCM.ncMs.length > 0"
      style="color: dimgray"
    >
      Itens Retornados: {{ objNCM.ncMs.length }}
      <span v-if="totalEnviados > 1">
        ({{ ((objNCM.ncMs.length / totalEnviados) * 100).toFixed(2) }}%)
        <i
          class="fas fa-question"
          data-toggle="tooltip"
          data-placement="top"
          title="Todos os itens foram retornados, mas o valor é menor em razão de duplicidade no envio"
          v-if="
            totalEnviados < enviadosInicial &&
            (objNCM.ncMs.length / totalEnviados) * 100 == 100
          "
        >
        </i>
      </span>
    </p>

    <div v-if="objNCM.ncMs.length > 0" class="mt-3">
      <table v-bind:class="classeNcm">
        <thead>
          <tr>
            <th
              class="fontSteel"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              v-if="mostrarAtividade"
            >
              Atividade
              <!-- v-if="tipoConsulta == 1 || tipoConsulta == 4" -->
              <i
                class="fa fa-refresh mouseHand"
                aria-hidden="true"
                v-on:click="RestaurarLista()"
                data-toggle="tooltip"
                data-placement="top"
                title="Restaura lista"
              ></i>
            </th>

            <!-- <th class="fontSteel" data-toggle="tooltip" data-placement="top" title="" v-if="mostrarSimples"> Simples Nacional </th> -->
            <th class="fontSteel" v-if="consultaLoteCodigo">Código</th>
            <th class="fontSteel">Descrição</th>
            <th class="fontSteel">
              NCM
              <i
                class="fas fa-info-circle"
                title="NOMENCLATURA COMUM DO MERCOSUL"
              ></i>
            </th>
            <th class="fontSteel">
              CEST
              <i
                class="fas fa-info-circle"
                title="CÓDIGO ESPECIFICADOR DA SUBSTITUIÇÃO TRIBUTÁRIA"
              ></i>
            </th>
            <th class="fontSteel">
              PIS e COFINS
              <i
                class="fas fa-info-circle"
                title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA DE PIS E COFINS."
              ></i>
            </th>
            <th class="fontSteel">
              NRI
              <i
                class="fas fa-info-circle"
                title="CÓDIGO DA NATUREZA DA RECEITA ISENTA"
              ></i>
            </th>
            <th class="fontSteel">
              CST ICMS | CSOSN
              <i
                class="fas fa-info-circle"
                title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA PARA ICMS OU CSOSN"
              ></i>
            </th>
            <th class="fontSteel">
              AD REM ICMS
              <i class="fas fa-info-circle" title="AD REM ICMS"></i>
            </th>
            <th class="fontSteel">
              ICMS(%)
              <i
                class="fas fa-info-circle"
                title="IMPOSTO SOBRE CIRCULAÇÃO DE MERCADORIAS E SERVIÇOS"
              ></i>
            </th>
            <th class="fontSteel">
              Redução ICMS(%)
              <i
                class="fas fa-info-circle"
                title="REDUÇÃO DA BASE DE CÁLCULO DO ICMS"
              ></i>
            </th>

            <th class="fontStell">
              ICMS PDV(%)
              <i
                class="fas fa-info-circle"
                title="ALÍQUOTA DO ICMS OPERAÇÃO COM PONTO DE VENDA"
              ></i>
            </th>

            <th class="fontSteel">
              Detalhes
              <i
                class="fas fa-info-circle"
                title="INFORMAÇÕES DETALHADAS SOBRE O PRODUTO"
              ></i>
            </th>
          </tr>
        </thead>

        <tbody>
          <!-- Template com os dados descritivos da NCM -->
          <!-- <template v-for="(i, index) in objNCM.ncMs"> -->
          <template v-for="(i, index) in Paginar" v-bind:key="index">
            <tr>
              <td v-if="mostrarAtividade">
                <!-- {{ GetSessionStorageData('Perfil', 'prfTypeCnae') }} -->
                <i
                  data-toggle="tooltip"
                  data-placement="top"
                  title="BUSCAR APENAS PRODUTOS COM MESMA ATIVIDADE"
                  class="fas fa-equals mouseHand"
                  v-on:click="FiltrarResultado('igual', i.activity)"
                ></i>

                <i
                  data-toggle="tooltip"
                  data-placement="top"
                  title="BUSCAR APENAS PRODUTOS COM OUTRA ATIVIDADE"
                  class="fas fa-not-equal mouseHand"
                  v-on:click="FiltrarResultado('diferente', i.activity)"
                ></i>

                {{ i.activity == "U" ? "GERAL" : i.activity }}
              </td>

              <td class="text-center" v-if="consultaLoteCodigo">
                {{ i.codBarras.replace(/^0+/, "") }}
              </td>

              <td v-if="i.federal.descricao">
                {{ RemoverResiduos(i.federal.descricao) }}
              </td>
              <td v-else>-</td>

              <td class="text-center" v-if="i.ncmCode">
                {{ MascaraNCM(i.ncmCode) }}
              </td>
              <td class="text-center" v-else>-</td>

              <td class="text-center" v-if="i.federal.cestCodigo">
                {{ i.federal.cestCodigo }}
              </td>
              <td class="text-center" v-else>-</td>

              <td class="text-center" v-if="i.federal.cstPisCofinsSaida">
                {{ i.federal.cstPisCofinsSaida }}
              </td>
              <td class="text-center" v-else>-</td>

              <td class="text-center" v-if="i.federal.natRecIsenta">
                {{ i.federal.natRecIsenta }}
                <i
                  class="fa fa-search lupa mouseHand"
                  title="Detalhes"
                  @click="
                    this.$emit(
                      'buscar-nri',
                      i.federal.natRecIsenta,
                      i.federal.cstPisCofinsSaida
                    )
                  "
                ></i>
              </td>
              <td class="text-center" v-else>-</td>

              <td class="text-center" v-if="i.state.cstIcms">
                {{ i.state.cstIcms }}
              </td>
              <td class="text-center" v-else>-</td>

              <td class="text-right" v-if="i.state.adRemICMS">
                {{ i.state.adRemICMS }}
              </td>
              <td class="text-center" v-else>-</td>

              <td class="text-right">{{ i.state.aliquota.toFixed(2) }}</td>
              <td class="text-right">{{ i.state.reducaoBC.toFixed(2) }}</td>

              <td
                class="text-right"
                v-if="i.state.pdv && i.state.pdv.aliqIcmsPdv"
              >
                {{ i.state.pdv.aliqIcmsPdv.toFixed(2) }}
              </td>
              <td class="text-right" v-else>0.00</td>

              <td class="text-center">
                <i
                  class="fa fa-search lupa mouseHand"
                  title="Detalhes"
                  v-on:click="ConsultDetailsNcm(i)"
                >
                </i>
                <!-- v-on:click="$parent.ConsultDetails(i.codImendes, ctrib, tipoCnae, i.atividade, i.codBarras )"></i> -->
                <!-- <img class="mouseHand" src="/assets/imgs/icons/search2.png" data-toggle="modal" v-on:click="$parent.ConsultDetails(index, i.caracTrib, i.atividade, i.codBarras, i.state.codigo, i.state.codExcecao)" /> -->
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Navegação e Exportação -->
      <div>
        <div class="row">
          <!-- <template v-if="qtdePaginas > 1 && (tipoConsulta == 1 || tipoConsulta == 4) && objNCM.ncMs.length > 0"> -->
          <template v-if="qtdePaginas > 1 && objNCM.ncMs.length > 0">
            <div class="col-md-5 col-lg-4"></div>
            <div class="col-md-5 col-lg-7 mb-1 mr-0 mt-3">
              <nav
                class="d-lg-flex justify-content-end overflow-auto"
                aria-label="Page navigation example"
              >
                <ul class="pagination">
                  <li class="page-item" v-if="pagina != 1">
                    <a
                      class="page-link"
                      v-on:click.prevent.stop="
                        pagina = 1;
                        OrganizarNavegacao();
                      "
                      href="#"
                      ><i class="fas fa-angle-double-left"></i>
                    </a>
                  </li>

                  <li class="page-item" v-if="pagina != 1">
                    <a
                      class="page-link"
                      v-on:click.prevent.stop="
                        pagina--;
                        OrganizarNavegacao();
                      "
                      href="#"
                      ><i class="fas fa-angle-left"></i
                    ></a>
                  </li>
                  <li
                    v-for="item in paginaNavegacao"
                    class="page-item"
                    :class="{ active: item === pagina }"
                    v-on:click.prevent.stop="
                      pagina = item;
                      OrganizarNavegacao();
                    "
                    :key="item"
                  >
                    <a class="page-link" href="#">{{ item }}</a>
                  </li>
                  <li
                    class="page-item"
                    v-if="pagina < qtdePaginas"
                    v-on:click.prevent.stop="
                      pagina++;
                      OrganizarNavegacao();
                    "
                  >
                    <a class="page-link" href="#"
                      ><i class="fas fa-angle-right"></i
                    ></a>
                  </li>
                  <li
                    class="page-item"
                    v-if="qtdePaginas > 1 && pagina < qtdePaginas"
                    v-on:click.prevent.stop="
                      pagina = qtdePaginas;
                      OrganizarNavegacao();
                    "
                  >
                    <a class="page-link" href="#"
                      ><i class="fas fa-angle-double-right"></i
                    ></a>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="col-md-2 col-lg-1 mb-1 mt-3">
              <input
                type="number"
                class="form-control form-control-sm valor"
                placeholder="Página"
                v-model="paginaEscolhida"
                v-on:keyup.enter="
                  pagina = paginaEscolhida;
                  OrganizarNavegacao();
                "
              />
              <div
                id="lupa"
                v-on:click="
                  pagina = paginaEscolhida;
                  OrganizarNavegacao();
                "
              >
                <i class="fa fa-search lupa"></i>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- MODAL DETALHES NCM -->
    <ConsultDetails v-bind:p_itemncm="objncmdetalhe"> </ConsultDetails>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";
import helpers from "@/helpers";
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import ConsultDetails from "@/components/gtconsultas/ConsultDetails.vue";

const userStore = useAuthStore();
const alertStore = useAlertStore();

let aNCMs = [];
let auxDataVig = "";

export default {
  components: {
    ConsultDetails,
  },
  props: {
    opcao: {
      type: Number,
    },
    ncm: {
      type: String,
    },
    ex: {
      type: String,
    },
    consLote: {
      type: String,
    },
    // 0 - Normal 1 - Grande
    tamanho: {
      default: 0,
      type: Number,
    },
    mostraratividade: {
      type: Boolean,
    },
    mostrarsimples: {
      type: Boolean,
    },
    consultaLoteCodigo: {
      type: Boolean,
    },
  },
  data() {
    return {
      processando: false,
      objNCM: [],
      exTipi: [],
      consLote: "",
      opcao: this.opcao,
      totalEnviados: 0,
      enviadosInicial: 0,
      classeNcm:
        "table table-divider table-striped table-sm table-responsive tableDetails table-bordered",
      mostrarAtividade: this.mostraratividade,
      mostrarSimples: this.mostrarsimples,
      consultaLoteCodigo: false,
      tipoConsulta: 0,
      objncmdetalhe: {},
      //   tipoCnae: GetSessionStorageData("Perfil", "prfTypeCnae"),
      // Paginação
      qtdePaginas: 0,
      pagina: 1,
      resultado: [],
      paginaNavegacao: [],
      paginaEscolhida: null,
      limites: [
        {
          qtde: 10,
        },
        {
          qtde: 25,
        },
        {
          qtde: 50,
        },
        {
          qtde: 100,
        },
      ],
      limite: 10,
    };
  },
  methods: {
    //----------------------------------------------------------------------
    // Faz a consulta Individual ou em Lote.
    // var 'opcao'.......: 0=Individual; 1=Lote
    // var 'txtLote'.....: Se opcao==0 Então txtLote:='' Senao txtLote := conteudo_text_area
    // var 'valor'.......: informação do campo input correspondente.
    // var 'exIPI'.......: informação do campo input correspondente.
    // var 'dataVigencia': informação do campo input correspondente (A Vigência será a mesma para todas as NCMs).
    //----------------------------------------------------------------------
    NcmConsult(opcao, consLote, valor, exIPI, dataVigencia) {
      userStore.user.dataQueries.ncm = false;

      this.exportar = false;
      this.pagina = 1;

      this.enviadosInicial = 0;

      let mensagemRetorno = "";

      //----------------------------------------------------------------------
      // Declarações
      let url = "";
      let txtLote = "";

      let auxValor = valor;
      let auxEx = exIPI;
      auxDataVig = userStore.user.profile.prfValidity;

      url = RetUrlAPI() + "ConsultNCM";

      try {
        switch (opcao) {
          //----------------------------------------------------------------------
          // Se opção=0 (indicidual), não permite prosseguir se nenhum valor foi
          // informado
          //----------------------------------------------------------------------
          case 0:
            txtLote = auxValor;

            if (auxEx != undefined) txtLote += ";" + auxEx;

            break;

          //----------------------------------------------------------------------
          // Se opção=1 (em lote), não permite prosseguir se nenhum valor foi
          // informado
          //----------------------------------------------------------------------
          case 1:
            txtLote = consLote;
            if (txtLote.length <= 0) {
              this.exportar = false;
              this.NotificarMudancaExportacao("");
              alertStore.error(
                "Nenhuma informação foi inserida para pesquisa."
              );
              return;
            }
            break;
        }

        let rootObject = this.GerarObjetoEnvio(txtLote, opcao);

        this.totalEnviados = rootObject.nCms.length;

        this.processando = true;

        var jsonEnvio = JSON.stringify(rootObject);

        //----------------------------------------------------------------------
        // Consume API
        CallPostAsync("usuario", "", url, rootObject)
          .then((data) => {
            var jsonRetorno = JSON.stringify(data);

            if (data != null) {
              let objConfigAux = new Object();
              objConfigAux.textoBotao = "Editar Plano";
              objConfigAux.urlRedirect = "/pages/contratos.html?19";
              objConfigAux.urlTarget = "_self";

              if (data.ncMs == undefined) {
                this.processando = false;
                if (
                  data.includes("ssinatura") ||
                  data.includes("agamento") ||
                  data.includes("rédito") ||
                  data.includes("acesso ao período")
                ) {
                  MensagemRedirecionamentoPagamentosAssinaturas(
                    "Atenção",
                    "error",
                    data,
                    objConfigAux
                  );
                } else alertStore.error(data);
              } else if (data.ncMs.length > 0) {
                // Incrementar Consultas
                let consulta = userStore.user.dataQueries.consultas;
                userStore.user.dataQueries.consultas = consulta++;

                this.objNCM = data;
                this.consultaNCM = true;
                this.processando = false;

                let itensLocal = JSON.stringify(data);
                userStore.user.items = itensLocal;

                userStore.user.dataQueries.ncm = true;

                mensagemRetorno = "OK";

                this.exportar = true;

                // Log - Consulta em Lote
                if (opcao == 1) {
                  this.consLote = "";
                  this.tipoConsulta = 5;
                  helpers.GravarLog(
                    "Consulta em Lote de NCMs:",
                    "ncmConsult.js",
                    "ConsultLoteNCM",
                    mensagemRetorno,
                    JSON.stringify(rootObject),
                    "portal"
                  );

                  this.NotificarMudancaExportacao("");

                  alertStore.success("Consulta de NCM finalizada.");
                }

                if (opcao == 0) {
                  userStore.user.dataQueries.valorGT = valor;
                  helpers.GravarLog(
                    "Consultou Individual de NCM:",
                    "ncmConsult.js",
                    "ConsultNCM",
                    mensagemRetorno,
                    JSON.stringify(rootObject),
                    "portal"
                  );
                  this.NotificarMudancaExportacao(valor);
                }

                this.PaginarTabela();
              } else {
                this.exportar = false;
                this.NotificarMudancaExportacao("");

                mensagemRetorno =
                  "Nenhum registro encontrado com os dados de consulta/perfil informados.";

                alertStore.error(mensagemRetorno);

                if (opcao == 0)
                  helpers.GravarLog(
                    "Consultou Individual de NCM:",
                    "ncmConsult.js",
                    "ConsultNCM",
                    mensagemRetorno,
                    JSON.stringify(rootObject),
                    "portal"
                  );

                // Log - Consulta em Lote
                if (opcao == 1)
                  helpers.GravarLog(
                    "Consultou em Lote de NCMs:",
                    "ncmConsult.js",
                    "ConsultLoteNCM",
                    mensagemRetorno,
                    JSON.stringify(rootObject),
                    "portal"
                  );

                this.processando = false;
              }
            } else {
              alertStore.error(data.message);

              this.exportar = false;

              mensagemRetorno = data.message;

              this.NotificarMudancaExportacao("");

              if (opcao == 0) {
                helpers.GravarLog(
                  "Consultou Individual de NCM:",
                  "ncmConsult.js",
                  "ConsultNCM",
                  mensagemRetorno,
                  JSON.stringify(rootObject),
                  "portal"
                );
              }

              // Log - Consulta em Lote
              if (opcao == 1) {
                helpers.GravarLog(
                  "Consultou em Lote de NCMs:",
                  "ncmConsult.js",
                  "ConsultLoteNCM",
                  mensagemRetorno,
                  JSON.stringify(rootObject),
                  "portal"
                );
              }

              this.processando = false;
            }

            this.$emit("export", this.exportar);
          })
          .catch((reason) => {
            mensagemRetorno =
              "Não foi possível estabelecer conexão com o servidor.";

            this.exportar = false;
            this.NotificarMudancaExportacao("");

            if (opcao == 0)
              helpers.GravarLog(
                "Consultou Individual de NCM: " +
                  JSON.stringify(rootObject.aNCMs),
                "ncmConsult.js",
                "ConsultNCM",
                mensagemRetorno,
                JSON.stringify(rootObject),
                "portal"
              );

            // Log - Consulta em Lote
            if (opcao == 1)
              helpers.GravarLog(
                "Consultou em Lote de NCMs: " +
                  JSON.stringify(rootObject.aNCMs),
                "ncmConsult.js",
                "ConsultLoteNCM",
                mensagemRetorno,
                JSON.stringify(rootObject),
                "portal"
              );

            alertStore.error(mensagemRetorno);

            this.processando = false;
            this.tipoConsulta = 0;
          });
      } catch (error) {
        this.exportar = false;
        this.NotificarMudancaExportacao("");

        mensagemRetorno =
          "Erro ao formar lista de retorno para Consulta de NCMs.";

        alertStore.error(mensagemRetorno);

        if (opcao == 0)
          helpers.GravarLog(
            "Consultou Individual de NCM: " + JSON.stringify(aNCMs),
            "ncmConsult.js",
            "ConsultNCM",
            mensagemRetorno,
            JSON.stringify(rootObject),
            "portal"
          );

        // Log - Consulta em Lote
        if (opcao == 1)
          helpers.GravarLog(
            "Consultou em Lote de NCMs: " + JSON.stringify(aNCMs),
            "ncmConsult.js",
            "ConsultLoteNCM",
            mensagemRetorno,
            JSON.stringify(rootObject),
            "portal"
          );

        this.processando = false;
        this.tipoConsulta = 0;
      }
    },

    ConsultDetailsNcm(itemNcm) {
      this.objncmdetalhe = itemNcm;
      $("#modalDdetalhesNcm").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
      });
    },

    ConsultDetailsExTIPI(pExTipi) {
      this.exTipi = pExTipi.split(";");
      this.$eventHub.$emit("ConsultDetailsExTIPI", this.exTipi);
      $("#modal-extipi").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
      });
    },

    ExpandirResultado(elemento) {
      let x = document.getElementById(elemento);

      if (x.style.display === "none") x.style.display = "block";
      else x.style.display = "none";

      this.MudarBotao(elemento);
    },

    MudarBotao(elemento) {
      let nomeBotao = elemento.replace("ncm", "btn");

      let botao = document.getElementById(nomeBotao);

      // Fazer a troca botão '+' para '-' ou vice-versa
      if (botao.classList.contains("fa-plus")) {
        botao.classList.remove("fa-plus");
        botao.classList.add("fa-minus");
        this.classeNcm =
          "table table-divider table-striped table-sm table-responsive tableDetails table-bordered";
      } else {
        botao.classList.remove("fa-minus");
        botao.classList.add("fa-plus");
        this.classeNcm =
          "table table-divider table-striped table-sm table-responsive-lg tableDetails table-bordered";
      }
    },

    NotificarMudancaExportacao(ncmIndividual) {
      this.$emit("exportar-alterado", this.exportar, ncmIndividual);
    },

    GerarObjetoEnvio(txtLote, opcao) {
      let rootObject = new Object();
      aNCMs = [];
      let activity = "";

      //----------------------------------------------------------------------
      // Recebe a informação de 'txtLote' (sendo vinda diretamente do elemento
      // "textArea" do HTML ou da concatenação das informções dos campos de
      // INPUT) e formata para o consumo da API.
      //----------------------------------------------------------------------
      var linhaTexto = txtLote;
      var linhasDoTexto = linhaTexto.split("\n");

      this.enviadosInicial = linhasDoTexto.length;

      // Remover itens repetidos
      linhasDoTexto = linhasDoTexto.filter(function (elem, pos, self) {
        return self.indexOf(elem) == pos;
      });

      // Remover itens caso haja mais de 1000 NCMs
      if (linhasDoTexto.length > 1000) linhasDoTexto.splice(1000);

      linhasDoTexto.forEach(function (linha) {
        let objAuxNCM = new Object();
        let auxLinha = linha.split(";");

        if (auxLinha.length > 1) {
          objAuxNCM.code = auxLinha[0].replaceAll(".", "").trim();
          objAuxNCM.ex = auxLinha[1];
        } else {
          objAuxNCM.code = auxLinha[0].replaceAll(".", "").trim();
          objAuxNCM.ex = null;
        }

        if (userStore.user.dataQueries.dadosLote == true && opcao == 1)
          objAuxNCM.validity = userStore.user.dataQueries.dataLote;
        else objAuxNCM.validity = auxDataVig;

        aNCMs.push(objAuxNCM);
      });

      //----------------------------------------------------------------------
      // Construindo o objeto de Consumo
      rootObject.nCms = aNCMs;
      rootObject.token = userStore.user.tokenSession;

      // Novos Campos
      let Perfil = userStore.user.profile;
      rootObject.uf = Perfil.prfUF;
      rootObject.taxRegime = Perfil.prfTaxRegime;
      rootObject.taxRegimeType = helpers.DefinirCTRibEnumGT(
        Perfil.prfTaxRegime
      );
      rootObject.activity = Perfil.prfTypeCnae;
      rootObject.specialRegime = userStore.user.profile.prfSpecialRegime;

      //----------------------------------------------------------------------
      // Tratando 'atividade'
      let auxActivity = Perfil.prfTypeCnae;

      if (Perfil.prfTypeCnae == "GERAL") {
        auxActivity = "U";
      }
      rootObject.activity = auxActivity;

      // Comportamentos parceiro e cliente
      rootObject.clientBehavior = userStore.user.clientBehavior;
      rootObject.partnerBehavior = userStore.user.partnerBehavior;

      rootObject.email = userStore.user.mail;
      rootObject.company = userStore.user.company;
      rootObject.clientStatus = userStore.user.clientStatus;
      rootObject.clientCnpjCpf = userStore.user.clientCNPJCPF;

      rootObject.managerId = userStore.user.idGestor;
      rootObject.managerEmail = userStore.user.emailGestor;

      rootObject.requestSource = "PORTAL";
      rootObject.userID = userStore.user.userId;
      rootObject.userLogged = false;

      if (userStore.user.hasAuth) {
        rootObject.userLogged = userStore.user.hasAuth;
      }

      // Definir o tipo do método para salvar no banco
      if (opcao == 0) rootObject.method = "GTCONSULTA_INDIVIDUAL";
      else rootObject.method = "GTCONSULTA_LOTE";

      rootObject.emailExport = userStore.user.email;

      return rootObject;
    },

    PaginarTabela() {
      let tamanhoTotal = this.objNCM.ncMs.length;

      this.qtdePaginas = 0;

      let qtdeLinhas = this.limite;
      let totalLinhas = tamanhoTotal;
      let paginas = Math.ceil(totalLinhas / qtdeLinhas);

      for (let i = 0; i < paginas; i++) {
        this.qtdePaginas++;
      }

      this.OrganizarNavegacao();
    },

    Paginacao(itens) {
      let pagina = this.pagina;
      let qtdeLinhas = this.limite;
      let de = pagina * qtdeLinhas - qtdeLinhas;
      let para = pagina * qtdeLinhas;

      this.resultado = itens.slice(de, para);

      return this.resultado;
    },

    OrganizarNavegacao() {
      if (this.pagina == "..." || this.pagina > this.qtdePaginas) return;

      this.pagina = parseInt(this.pagina);

      if (isNaN(this.pagina)) return;

      this.paginaNavegacao = [];

      if (this.pagina > 1) {
        let paginasAnteriores = this.pagina - 2;

        for (let z = paginasAnteriores; z < this.pagina; z++) {
          if (z > 0 && z != this.pagina) this.paginaNavegacao.push(z);
        }
      }

      this.paginaNavegacao.push(this.pagina);

      if (this.pagina != this.qtdePaginas) {
        let paginasPosteriores = this.pagina + 2;

        for (let x = this.pagina; x < paginasPosteriores; x++) {
          if (x != this.pagina) this.paginaNavegacao.push(x);
        }

        if (this.pagina - 3 < this.qtdePaginas - 5) {
          this.paginaNavegacao.push("...");
          this.paginaNavegacao.push(this.qtdePaginas);
        }
      }
    },

    FiltrarResultado(tipo, atividade) {
      let aux = this.objNCM.ncMs;

      if (tipo == "diferente") {
        // Verificar se existe mais de uma atividade para não filtrar quando tiver apenas uma
        let item = _.find(aux, function (aux) {
          return aux.activity != atividade;
        });

        if (item)
          aux = _.filter(aux, function (aux) {
            return aux.activity != atividade;
          });
      } else
        aux = _.filter(aux, function (aux) {
          return aux.activity == atividade;
        });

      this.objNCM.ncMs = aux;

      this.pagina = 1;
      this.PaginarTabela();
    },

    RestaurarLista() {
      var objeto = sessionStorage.getItem("itens");
      this.objNCM = JSON.parse(objeto);

      this.pagina = 1;
      this.PaginarTabela();
    },

    RemoverResiduos(descricao) {
      return helpers.RemoverResiduos(descricao);
    },

    MascaraNCM(ncm) {
      return helpers.MascaraNCM(ncm);
    },
  },

  computed: {
    Paginar() {
      if (this.objNCM.ncMs) {
        return this.Paginacao(this.objNCM.ncMs);
      }
    },
  },

  beforeMount() {
    this.objNCM = [];
    this.objNCM.ncMs = [];
  },

  mounted() {
    if (this.tamanho == 1)
      this.classeNcm =
        "table table-divider table-striped table-sm table-responsive-lg tableDetails table-bordered";

    this.consLote = consultaLote.value;
    this.NcmConsult(this.opcao, this.consLote, this.ncm, this.ex);
  },
};
</script>

<style></style>
