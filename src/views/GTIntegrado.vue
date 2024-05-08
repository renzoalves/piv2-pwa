<template>
  <LayoutSidebar>
    <ChatWhatsapp :assinante="true"></ChatWhatsapp>
    <div v-if="processando" id="loading">
      <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>

    <TaxProfileInfo v-if="!isMobile" :multiplosPerfis="false" :solution="101" />

    <div class="container-fluid" style="position: relative; top: -40px">
      <!-- CARDS -->
      <div class="row">
        <CustomCard :p_titulo="cards.user.cnpj" :p_icone="'cliente'">
          {{ cards.user.razaoSocial }}
        </CustomCard>

        <CustomCard
          :p_titulo="'Produtos Finalizados'"
          :p_icone="'prod-finalizados'"
        >
          <span class="span-gt-integrado" v-if="cardsProcessados">
            {{ obterProdutosFinalizados }}
          </span>
          <div class="spinner-border text-info" role="status" v-else></div>
        </CustomCard>

        <CustomCard :p_titulo="'Produtos em Análise'" :p_icone="'prod-analise'">
          <span class="span-gt-integrado" v-if="cardsProcessados">{{
            obterProdutosAnalise
          }}</span>
          <div class="spinner-border text-info" role="status" v-else></div>
        </CustomCard>

        <CustomCard :p_titulo="'Analisado'" :p_icone="'analisado'">
          <span class="span-gt-integrado" v-if="cardsProcessados"
            >{{ obterPercAnalisado }}%</span
          >
          <div class="spinner-border text-info" role="status" v-else></div>
        </CustomCard>
      </div>

      <!-- PILLS -->
      <div class="row mt-2">
        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ml-0 mr-0 mt-2 mb-1">
          <label for="dtUltimaAtualizacaoRealizadaEm"
            >Última atualização:</label
          >
          <div
            id="dtUltimaAtualizacaoRealizadaEm"
            class="alert alert-dark text-center"
            role="alert"
          >
            <span class="span-gt-integrado" v-if="pillsProcessados">{{
              obterUltimaAtualizao
            }}</span>
            <div class="text-secondary" v-else>lembrando...</div>
          </div>
        </div>

        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ml-0 mr-0 mt-2 mb-1">
          <label for="dtConsultaProgramada"
            >Consulta completa programada para:</label
          >
          <div
            id="dtConsultaProgramada"
            class="alert alert-dark text-center"
            role="alert"
            
          >
            <p v-if="pills.dtConsultaCompletaProgramada">{{ pills.dtConsultaCompletaProgramada }}</p>
            <p v-else>-</p>
          </div>
        </div>

        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ml-0 mr-0 mt-2 mb-1">
          <label for="numConsultasRealizadas"
            >Consultas realizadas na semana:</label
          >
          <div
            id="numConsultasRealizadas"
            class="alert alert-dark text-center"
            role="alert"
          >
            <span class="span-gt-integrado" v-if="pillsProcessados">{{
              obterConsultasSemanal
            }}</span>
            <div class="text-secondary" v-else>contando...</div>
          </div>
        </div>

        <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3 ml-0 mr-0 mt-2 mb-1">
          <label for="strStatusIntegracao">Status da Integração:</label>
          <div
            id="strStatusIntegracao"
            class="alert alert-dark text-center"
            role="alert"
          >
            <span class="span-gt-integrado" v-if="pillsProcessados">{{
              obterStatusIntegracao
            }}</span>
            <div class="text-secondary" v-else>analisando...</div>
          </div>
        </div>

        <!-- <div class="col-sm-12 col-md-12 col-lg-2 col-xl-2 ml-0 mr-0 mt-2 mb-1">
          <label for="strStatusIntegracao">Integração:</label>
          <div
            id="strStatusIntegracao"
            class="alert alert-dark text-center"
            role="alert"
          >
            <span class="span-gt-integrado" v-if="pillsProcessados">{{
              nomeIntegracao
            }}</span>
            <div class="text-secondary" v-else>analisando...</div>
          </div>
        </div> -->
      </div>

      <div class="row mt-2">
        <!-- -------------------------------------------------------------------------------------------------------------- -->
        <!-- AÇOÕES E INTERAÇÕES -->
        <!-- <div class="col-12" v-else> -->
        <div class="col-12">
          <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                id="pills-home-tab"
                data-toggle="pill"
                data-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
                style="cursor: pointer !important;"
              >
                Alterações Tributárias
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-contact-tab"
                data-toggle="pill"
                data-target="#pills-contact"
                type="button"
                role="tab"
                aria-controls="pills-contact"
                v-on:click="ObterListaParaAceiteIntegracao()"
                aria-selected="false"
                style="cursor: pointer !important;"
              >
                Atualizações Tributárias
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                id="pills-profile-tab"
                data-toggle="pill"
                data-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
                style="cursor: pointer !important;"
              >
                Busca Personalizada
              </button>
            </li>
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <!-- TABELAS DE DADOS: ALTERAÇÕES TRIBUTÁRIAS  -->
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabindex="0"
            >
              <!-- TABELAS DE DADOS -->
              <div class="col-12 justify-content-center">
                <p class="tituloIndex-0 mt-3" id="topoAltTrib">
                  Alterações
                  <span class="span-gt-integrado" style="color: #febd11"
                    >Tributárias</span
                  >
                </p>
              </div>

              <span
                class="span-gt-integrado"
                v-if="altTributariasProcessadasProdutos"
              >
                <TabAltTributaria
                  :payload="obterListaProduto"
                  :registros="obterTotalRegistrosAltTrib"
                  @emit-aplicar-filtro="AplicarFiltroAlteracoesTributarias"
                >
                </TabAltTributaria>
              </span>
              <div class="text-center" v-else>
                <div class="spinner-border text-info" role="status"></div>
              </div>
              <!-- -------------------------------------------------------------------------------------------------------------- -->
            </div>

            <!-- ACEITE: ATUALIZAÇÕES TRIBUTÁRIAS -->
            <div
              class="tab-pane fade"
              id="pills-contact"
              role="tabpanel"
              aria-labelledby="pills-contact-tab"
              tabindex="0"
            >
              <div class="col-12 justify-content-center">
                <p class="tituloIndex-0 mt-3" id="topoCtrlAceite">
                  Atualizações
                  <span class="span-gt-integrado" style="color: #febd11"
                    >Tributárias</span
                  >
                </p>
              </div>

              <div class="col-12">
                <tab-lista-aceite
                  v-if="listaParaAceiteProcessadas"
                  :payload="obterListaParaAceite"
                  :opcao_de_recarga_de_lista="true"
                  :registros="obterTotalRegistrosCtrlAceite"
                  @emit-recarregar-lista-aceite="RecarregarListaParaAceite"
                  @emit-confirmar-lista-aceite="ConfirmarListaAceite"
                  @emit-aplicar-filtro-lista-aceite="FiltrarListaAceite"
                >
                </tab-lista-aceite>
                <div class="text-center" v-else>
                  <div
                    class="spinner-border text-info text-center"
                    role="status"
                  ></div>
                </div>
              </div>
            </div>

            <!-- ACEITE: BUSCA PERSONALIZADA -->
            <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabindex="0"
            >
              <div class="col-12 justify-content-center">
                <p class="tituloIndex-0 mt-3" id="topoCtrlAceite">
                  Busca
                  <span class="span-gt-integrado" style="color: #febd11"
                    >Personalizada</span
                  >
                </p>
              </div>

              <div class="col-12">
                <TabListaDirecionada></TabListaDirecionada>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutSidebar>
</template>

<script>
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";
import methodsSankhya from "@/components/integracoes/sankhya/main.js";
import methodsBluesoft from "@/components/integracoes/bluesoft/main.js";
import helpers from "@/helpers/index.js";
import axios from "axios";
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";
import router from "@/router/index";
import CustomCard from "@/components/integracoes/CustomCard.vue";
import TabAltTributaria from "@/components/integracoes/TabelaAlteracaotributaria.vue";
import TabListaAceite from "@/components/integracoes/TabelaListaParaAceite.vue";
import TabListaDirecionada from "@/components/integracoes/TabelaListaDirecionadaParaAceite.vue";

const userStore = useAuthStore();
//
export default {
  components: {
    CustomCard,
    TabAltTributaria,
    TabListaAceite,
    TabListaDirecionada,
  },
  data() {
    return {
      alertStore: useAlertStore(),
      processando: false,
      isMobile: false,
      gtConsultas: false,
      moostri: false,
      vacine: false,
      grades: false,
      sankhya: true,

      cardsProcessados: false,
      pillsProcessados: false,
      altTributariasProcessadasProdutos: false,
      altTributariasProcessadasRegrasEstaduais: false,
      listaParaAceiteProcessadas: false,
      listaDirecionadaParaAceiteProcessadas: false,

      enums: {
        integracoes: {
          sankhya: "52",
          blue_soft: "53",
          e_auditoria: "102",
          totvs: "104",
          pr_info: "105",
          microvix: "106",
        },
      },

      //----------------------------------------------------------------
      //#region Construct
      lpaQtdeTotalRetornada: 0,
      altTribQtdeTotalRetornada: 0,
      altTributariasProdutos: [],
      altTributariasRegrasEstaduais: [],
      listaParaAceite: [],

      cards: {
        user: {
          cnpj: "",
          razaoSocial: "",
        },
        prodFinalizados: 0.0,
        prodAnalise: 0.0,
        percAnalisado: 0.0,
      },

      pills: {
        dtUltimaAtualizacao: "", // '07/10/2023', // resumo.dataUltimoConsumo
        dtConsultaCompletaProgramada: "", // '14/10/2023', // aguardando recurso (pós MVP) - vem do retaguarda
        consultasSemanal: 0, // 592, // somatorio das 'requisições' [hoje() -7] (detalhes[0].requisicoes)
        statusIntegracao: "", /// 'ATIVO', // tem uma marcação vinda do retaguarda - aguardar nome do campo. (RET-349)
      },

      // Controle de Aceite
      lstAprovacoes: [],
      lstProdutos: [],
      lstRegrasInativadas: [],
      lstGuid: [],
      produto: {
        sku: 1,
        produto: "",
        ncm_antes: "",
        ncm_depois: "",
        cest_antes: "",
        cest_depois: "",
        pisCofins_antes: "",
        pisCofins_depois: "",
        icms_antes: "",
        icms_depois: "",
        ufDest: "",
        status: {
          aceito: false,
          declinado: false,
          inativado: false,
        },
      },
      listaSkus: "",

      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Vaiáveis para o módulo de Notificações - Não tirar daqui
      notificacoes: [],
      notificacao: {},
      marcarComoLido: true,
      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Variáveis para paginação
      qtdePaginas: 0,
      pagina: 1,
      limite: 10,
      active: false,
      tipoConsulta: 0,
      paginaNavegacao: [],
      paginaEscolhida: null,
      resultado: [],
      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Controle do Step_Barr
      stepDtRevisaoImplantacao: "",
      stepOkImplantacao: false,
      stepTitulo: "Jornada da Implantação",
      stepStatus: 0,
      stepRevisao: "",
      stepRevisaoOk: false,
      stepAceite: false,
      stepLista: [
        {
          label: "Setup",
          value: 0,
        },
        {
          label: "Analise",
          value: 1,
        },
        {
          label: "Revisão",
          value: 2,
        },
        {
          label: "Aceite",
          value: 3,
        },
      ],
      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Controle de ENUMs
      //

      // Definição do Tipo de Integração:
      // 0 = Sankhya
      //----------------------------------------------------------------
      tipoIntegracao: 0,
      nomeIntegracao: "",

      // Definição do Tipo de Origem de dados e destinação
      //----------------------------------------------------------------
      TIPO_IMPLANTACAO: 0,
      TIPO_ATUALIZACAO: 1,

      //#endregion
      //----------------------------------------------------------------
    };
  },
  methods: {
    Setup() {
      // CARDS
      this.cards.user.cnpj = userStore.user.clientCNPJCPF;
      this.cards.user.razaoSocial = userStore.user.company;

      // DEFININDO PERFIL DA INTEGRAÇÃO
      this.tipoIntegracao = userStore.user.idSolucaoIntegracao;

      switch (this.tipoIntegracao) {
        case this.enums.integracoes.sankhya:
          this.nomeIntegracao = "SANKHYA";
          break;

        case this.enums.integracoes.blue_soft:
          this.nomeIntegracao = "BLUESOFT";
          break;

        default:
          break;
      }

      // PILLS
      this.pills.dtConsultaCompletaProgramada =
        userStore.user.dtConsultaProgramada;

      this.pills.statusIntegracao = userStore.user.clienteVinculadoStatus;

      // DEFININDO DADOS SOBRE O ANDAMENTO DA INTEGRAÇÃO
      this.stepDtRevisaoImplantacao = userStore.user.dtRevisaoImplantacao;
      this.stepOkImplantacao = userStore.user.okImplantacao;
    },

    /* CONTROLLER PARA APIs ESPECÍFICAS PARA CADA MODELO DE INTEGRAÇÃO */
    ObterDados(tipoIntegracao) {
      const usarDadosMockados = false;

      //----------------------------------------------------------------
      //#region CARDs E PILLs
      //
      // CARDS: ObterIndicadores
      // PILLS: ObterHistoricoAcesso
      //----------------------------------------------------------------
      if (usarDadosMockados) {
        this.ObterIndicadores_mock(); // CARDS
        this.ObterHistoricoAcesso_mock(); // PILLS
      } else {
        this.ObterIndicadores(); // CARDS
        this.ObterHistoricoAcesso(); // PILLS
      }
      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region ALTERAÇÕES TRIBUTÁRIAS (HISTÓRICO)
      //----------------------------------------------------------------
      switch (tipoIntegracao) {
        case this.enums.integracoes.sankhya:
          if (usarDadosMockados) {
            methodsSankhya.ObterHistAltTribut_Implantacao_sankhya_mock(this);
          } else {
            methodsSankhya.ObterHistAltTribut_Implantacao_sankhya(this);
          }
          break;

        case this.enums.integracoes.blue_soft:
          methodsBluesoft.ObterHistAltTribut_bluesoft(this);
          break;

        default:
          break;
      }
      //#endregion
      //----------------------------------------------------------------
    },

    ObterHistoricoAcesso() {
      let url = RetUrlAPI("Integracoes") + "historico-acesso";

      // ----------------------------------------------------------------------
      // Consome a API buscando os dados dos planos para a Soluição selecionada
      // ----------------------------------------------------------------------
      CallGetAsync(url)
        .then((data) => {
          if (data.header) {
            let pills = new Object();

            pills.dtConsultaCompletaProgramada = "";
            pills.statusIntegracao = "";
            pills.dtUltimaAtualizacao = data.header.dtUltimoConsumo;
            pills.consultasSemanal = data.header.totalRequisicoes;

            this.DefinirPills(pills);
          }
        })
        .catch((reason) => {
          this.alertStore.error(
            "Falha ao atualizar as informações vindas do Histórico Acesso."
          );
        });
    },

    ObterHistoricoAcesso_mock() {
      const url = "http://localhost:3000/historicoacesso/";

      // ----------------------------------------------------------------------
      // Consome a API buscando os dados dos planos para a Soluição selecionada
      // ----------------------------------------------------------------------
      CallGetAsync(url)
        .then((data) => {
          if (data.header) {
            let pills = new Object();

            pills.dtConsultaCompletaProgramada = "";
            pills.statusIntegracao = "";
            pills.dtUltimaAtualizacao = data.header.dtUltimoConsumo;
            pills.consultasSemanal = data.header.totalRequisicoes;

            this.DefinirPills(pills);
          }
        })
        .catch((reason) => {
          this.alertStore.error(
            "Falha ao atualizar as informações vindas do Histórico Acesso."
          );
        });
    },

    ObterIndicadores() {
      let cards = new Object();
      let user = new Object();
      let prodFin = 0;
      let prodAnalise = 0;

      let url = RetUrlAPI("Integracoes") + "obter-indicadores";

      // ----------------------------------------------------------------------
      // Consome a API buscando os dados dos planos para a Soluição selecionada
      // ----------------------------------------------------------------------
      CallGetAsync(url)
        .then((data) => {
          if (data.produtosFinalizados) prodFin = data.produtosFinalizados;

          if (data.produtosPendentes) prodAnalise = data.produtosPendentes;

          let analisado = (1 - prodAnalise / prodFin) * 100;

          user.cnpj = userStore.user.clientCNPJCPF;
          user.razaoSocial = userStore.user.company;

          cards.user = user;
          cards.prodFinalizados = helpers.FormataNumeroPontos(prodFin);
          cards.prodAnalise = helpers.FormataNumeroPontos(prodAnalise);
          cards.percAnalisado = helpers.FormatarMoeda(analisado);

          this.DefinirCards(cards);
        })
        .catch((reason) => {
          this.alertStore.error(
            "Falha ao atualizar as informações vindas do servidor."
          );
        });
    },

    async ObterIndicadores_mock() {
      const url = "http://localhost:3000/obterindicadores/";

      let cards = new Object();
      let user = new Object();
      let prodFin = 0;
      let prodAnalise = 0;

      // ----------------------------------------------------------------------
      // Consome a API buscando os dados dos planos para a Soluição selecionada
      // ----------------------------------------------------------------------
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.produtosFinalizados) prodFin = data.produtosFinalizados;

          if (data.produtosPendentes) prodAnalise = data.produtosPendentes;

          let analisado = (1 - prodAnalise / prodFin) * 100;

          user.cnpj = userStore.user.clientCNPJCPF;
          user.razaoSocial = userStore.user.company;

          cards.user = user;
          cards.prodFinalizados = helpers.FormataNumeroPontos(prodFin);
          cards.prodAnalise = helpers.FormataNumeroPontos(prodAnalise);
          cards.percAnalisado = helpers.FormatarMoeda(analisado);

          this.DefinirCards(cards);
        })
        .catch((reason) => {
          this.alertStore.error(
            "Falha ao atualizar as informações vindas do servidor."
          );
        });
    },

    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region DEFINIÇÃO DE DADOS DOS COMPONENTES

    AtualizaLista(lista, de, para) {
      const novaLista = lista.map((alteracao) => ({
        ...alteracao,
        tipo: alteracao.tipo === `${de}` ? `${para}` : alteracao.tipo,
      }));

      return novaLista;
    },

    DefinirTamanhoLimite(lista, limite) {
      let tamanhoLista = lista.length;

      if (tamanhoLista > limite) return lista.slice(0, limite);

      return lista;
    },

    DefinirAlteracoesTributariasProdutos(listaAlteracoes, quantidadeTotal) {
      this.altTribQtdeTotalRetornada = quantidadeTotal;
      this.altTributariasProdutos = this.DefinirTamanhoLimite(
        listaAlteracoes,
        1000
      );
      this.altTributariasProcessadasProdutos = true;
    },

    DefinirAlteracoesTributariasRegrasEstaduais(listaAlteracoes) {
      this.altTributariasRegrasEstaduais = this.DefinirTamanhoLimite(
        listaAlteracoes,
        1000
      );
      this.altTributariasProcessadasRegrasEstaduais = true;
    },

    DefinirListaParaAceite(
      listaAlteracoes,
      quantidadeTotal,
      usarDadosDirecionados
    ) {
      let lstProvisoria = this.DefinirTamanhoLimite(listaAlteracoes, 1000);
      this.lpaQtdeTotalRetornada = quantidadeTotal;

      this.listaParaAceite = lstProvisoria;
      this.listaParaAceiteProcessadas = true;
    },

    async ListaDirecionadaParaAceite(listaSkus) {
      const listaFiltro = Number(listaSkus.split(";"));

      methodsSankhya.ObterListaDirecionadaParaAceite_sankhya_mock(listaFiltro);
    },

    DefinirPills(pills) {
      // this.pills = pills;
      this.pills.dtUltimaAtualizacao = pills.dtUltimaAtualizacao;
      this.pills.consultasSemanal = pills.consultasSemanal;
      this.pillsProcessados = true;
    },

    DefinirCards(cards) {
      this.cards.user.cnpj = cards.user.cnpj;
      this.cards.user.razaoSocial = cards.user.razaoSocial;

      this.cards.prodFinalizados = cards.prodFinalizados;
      this.cards.prodAnalise = cards.prodAnalise;
      this.cards.percAnalisado = cards.percAnalisado;

      this.cardsProcessados = true;
    },

    AplicarFiltroAlteracoesTributarias(filtro) {
      const tipo = filtro.altTrib_filtroTipo;
      const filtroTela = filtro.altTrib_filtro;
      const dados = filtro.altTrib_filtroValor;
      const qtdItensPorPagina = filtro.altTrib_limite;
      const paginaSelecionada = filtro.altTrib_paginaEscolhida;

      if (this.enums.integracoes.sankhya === this.tipoIntegracao)
        switch (tipo) {
          case this.TIPO_IMPLANTACAO:
            methodsSankhya.ObterHistAltTribut_Implantacao_sankhya(
              this,
              filtroTela,
              dados,
              qtdItensPorPagina,
              paginaSelecionada
            );
            break;

          case this.TIPO_ATUALIZACAO:
            methodsSankhya.ObterHistAltTribut_Atualizacao_sankhya(
              filtroTela,
              dados,
              qtdItensPorPagina,
              paginaSelecionada
            );
            break;
        }
      else if (this.enums.integracoes.blue_soft === this.tipoIntegracao)
        methodsBluesoft.ObterHistAltTribut_bluesoft(
          this,
          filtroTela,
          dados,
          qtdItensPorPagina,
          paginaSelecionada
        );
    },

    RecarregarListaParaAceite(params) {
      if (!params || params === undefined || params === null) return;

      const tipo = params.modo ? params.modo : this.TIPO_IMPLANTACAO;
      const recarregar = params.recarregar;

      if (recarregar) {
        this.listaParaAceite = [];

        switch (this.tipoIntegracao) {
          case this.enums.integracoes.sankhya:
            switch (tipo) {
              case this.TIPO_IMPLANTACAO:
                methodsSankhya.ObterListaParaAceite_Implantacao_sankhya(this);
                break;

              case this.TIPO_ATUALIZACAO:
                methodsSankhya.ObterListaParaAceite_Atualizacao_sankhya();
                break;
            }
            break;

          case this.enums.integracoes.blue_soft:
            methodsBluesoft.ObterListaParaAceite_bluesoft(this);
            break;
        }
      }
    },

    FiltrarListaAceite(filtro) {
      const tipo = filtro.lpa_filtroTipo;
      const filtroTela = filtro.lpa_filtro;
      const dados = filtro.lpa_filtroValor;
      const qtdItensPorPagina = filtro.lpa_limite;
      const paginaSelecionada = filtro.lpa_paginaEscolhida;

      switch (this.tipoIntegracao) {
        case this.enums.integracoes.sankhya:
          switch (tipo) {
            case this.TIPO_IMPLANTACAO:
              methodsSankhya.ObterListaParaAceite_Implantacao_sankhya(
                this,
                filtroTela,
                dados,
                qtdItensPorPagina,
                paginaSelecionada
              );
              break;

            case this.TIPO_ATUALIZACAO:
              methodsSankhya.ObterListaParaAceite_Atualizacao_sankhya(
                filtroTela,
                dados,
                qtdItensPorPagina,
                paginaSelecionada
              );

              break;
          }
          break;

        case this.enums.integracoes.blue_soft:
          methodsBluesoft.ObterListaParaAceite_bluesoft(
            this,
            filtroTela,
            dados,
            qtdItensPorPagina,
            paginaSelecionada
          );
          break;
      }
    },

    ConfirmarListaAceite(objAceite) {
      let listaGuid = new Array();
      let possuiInativacao = false;

      this.lstRegrasInativadas = [];

      const listaAceite = objAceite.listaAlteracoes.filter(function (item) {
        return Number(item.status) === 0;
      });

      listaAceite.forEach((el) => {
        if (el.regraFiscalId != null) this.lstRegrasInativadas.push(el);
        listaGuid.push(el.id);
      });

      possuiInativacao = this.lstRegrasInativadas.length > 0;

      // Se a integração for do tipo sankhya, faz o aceite normalmente.
      switch (this.tipoIntegracao) {
        case this.enums.integracoes.sankhya:
          methodsSankhya.ConsumirApiAceite_sankhya(objAceite.tipo, listaGuid);
          break;

        case this.enums.integracoes.blue_soft:
          this.lstGuid = listaGuid;

          if (!possuiInativacao) {
            methodsBluesoft.ConsumirApiAceite_bluesoft(this.lstGuid);
          } else {
            this.PaginarTabela();
            $("#modalRegrasDesativadas").modal("show");
          }

          break;
      }
    },

    ConfirmarIntivacaoRegras() {
      $("#modalRegrasDesativadas").modal("hide");

      Swal.fire({
        title: "Sucesso",
        text: "Suas regras estão sendo desativadas. Estamos criando as novas regras para você 🙂",
        icon: "success",
      });

      methodsBluesoft.ConsumirApiAceite_bluesoft(this.lstGuid);
    },

    CancelarInativaoRegra() {
      $("#modalRegrasDesativadas").modal("hide");

      const btnRecarregarLista = document.getElementById("btnAtualizar");
      btnRecarregarLista.click();
    },

    //#endregion
    //----------------------------------------------------------------

    ObterListaParaAceiteIntegracao() {
      const usarDadosMockados = false;

      switch (this.tipoIntegracao) {
        case this.enums.integracoes.sankhya:
          if (usarDadosMockados) {
            methodsSankhya.ObterListaParaAceite_Implantacao_sankhya_mock();
          } else {
            methodsSankhya.ObterListaParaAceite_Implantacao_sankhya(this);
          }
          break;

        case this.enums.integracoes.blue_soft:
          methodsBluesoft.ObterListaParaAceite_bluesoft(this);
          break;

        default:
          break;
      }
    },

    //----------------------------------------------------------------
    //#region PAGINAÇÃO  REGRAS INATIVADAS

    PaginarTabela() {
      let tamanhoTotal = this.lstRegrasInativadas.length;

      this.qtdePaginas = 0;

      let qtdeLinhas = this.limite;
      let totalLinhas = tamanhoTotal;
      let paginas = Math.ceil(totalLinhas / qtdeLinhas);

      for (let i = 0; i < paginas; i++) {
        this.qtdePaginas++;
      }

      this.OrganizarNavegacao();
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
    Paginacao(itens) {
      let pagina = this.pagina;
      let qtdeLinhas = this.limite;
      let de = pagina * qtdeLinhas - qtdeLinhas;
      let para = pagina * qtdeLinhas;

      this.resultado = itens.slice(de, para);

      return this.resultado;
    },

    //#endregion
    //----------------------------------------------------------------
  },

  created() {
    this.Setup();
  },

  mounted() {
    this.isMobile = false;

    if (window.screen.width <= 768) {
      this.isMobile = true;
    }

    helpers.VerificarAutenticacao();
    let autorizado = helpers.VerificarAcessos(101);

    if (!autorizado) {
      userStore.user.mensagem =
        "Você não possui acesso ao GTIntegrado. Entre em contato com o nosso time de comercial!";
      router.push("/");
    }

    this.ObterDados(this.tipoIntegracao);
  },

  computed: {
    Paginar() {
      if (this.lstRegrasInativadas) {
        return this.Paginacao(this.lstRegrasInativadas);
      }
    },

    //----------------------------------------------------------------
    //#region NOTIFICAÇÕES
    countNotifications() {
      return this.CountNotifications();
    },
    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region CARDS
    obterProdutosFinalizados() {
      return this.cards.prodFinalizados;
    },
    obterProdutosAnalise() {
      return this.cards.prodAnalise;
    },
    obterPercAnalisado() {
      return this.cards.percAnalisado;
    },
    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region PILLS
    obterUltimaAtualizao() {
      return this.pills.dtUltimaAtualizacao;
    },
    obterConsultasSemanal() {
      return helpers.FormataNumeroPontos(this.pills.consultasSemanal);
    },
    obterStatusIntegracao() {
      let retStatus = this.pills.statusIntegracao;

      switch (retStatus) {
        case "1":
          retStatus = "NORMAL - NIP";
          break;
        case "N":
          retStatus = "NORMAL";
          break;
        case "B":
          retStatus = "BLOQUEADO";
          break;
        case "C":
          retStatus = "CANCELADO";
          break;
        case "D":
          retStatus = "DEGUSTAÇÃO API 2.0";
          break;
        case "H":
          retStatus = "HOMOLOGAÇÃO";
          break;
        case "S":
          retStatus = "SUSPENSO PARA CONSUMO";
          break;
        default:
          break;
      }

      return retStatus;
    },
    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region LISTAS (tables)
    obterListaProduto() {
      return this.altTributariasProdutos;
    },
    obterTotalRegistrosAltTrib() {
      return this.altTribQtdeTotalRetornada;
    },
    obterTotalRegistrosCtrlAceite() {
      return this.lpaQtdeTotalRetornada;
    },
    obterListaRegrasEstaduais() {
      return this.altTributariasRegrasEstaduais;
    },
    obterListaParaAceite() {
      return this.listaParaAceite;
    },
    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region JORNADA DA IMPLANTAÇÃO
    obterStep() {
      return 4;

      let stepStatus = this.stepStatus;

      if (this.cards.prodFinalizados == 0) {
        this.stepStatus = 0;
        return 0;
      }

      if (this.cards.percAnalisado > 0 && this.cards.percAnalisado < 100) {
        this.stepStatus = 1;
        this.stepLista[1].label += ` ${this.cards.percAnalisado}%`;
        return 1;
      }

      if (this.cards.percAnalisado >= 100) {
        let step;

        this.stepStatus = step = 2;
        this.stepLista[1].label += ` ${this.stepRevisao}`;

        if (this.stepRevisaoOk) this.stepStatus = step = 3;

        return step;
      }

      if (this.stepAceite) {
        this.stepStatus = 4;
        return 4;
      }

      return stepStatus;
    },

    obterStepStatus() {
      return this.stepStatus;
    },
    //#endregion
    //----------------------------------------------------------------
  },
};
</script>

<style>
#pills-home-tab.active {
  background-color: #1e233a;
  color: #fff;
}

#pills-profile-tab.active {
  background-color: #1e233a;
  color: #fff;
}

#pills-contact-tab.active {
  background-color: #1e233a;
  color: #fff;
}

.nav-link {
  border: none;
}

#btnAtualizar,
#btnConfirmaAcao {
  font-size: 1rem;
  color: #2e354c;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid;
  border-radius: 5px;
  border-color: #ccc;
  padding: 10px;
}

#btnConfirmaAcao {
  color: #008000;
}

#btnAtualizar:hover,
#btnConfirmaAcao:hover {
  cursor: pointer !important;
  transition: all 0.3s;
  box-sizing: border-box;
  max-width: 100%;
  transform: scale(1.2);
}

.card-label {
  background-color: #2e354c;
  background-color: #282d46;
  background-color: #1e233a;
  border-radius: 5px;
  height: 100px;
  box-shadow: 2px 2px 10px 0px #454d68;
}

.card-label-header {
  display: flex;
  align-items: center;
  /* height: 40px; */
}

.card-label h6 {
  color: #fff;
  color: #ccc;
  border-radius: 5px;
  margin: 0;
  padding: 0;
}

.card-label img {
  color: #2e354c;
  background-color: #ccc;
  border-radius: 5px;
  height: 35px;
  width: 35px;
  padding: 3px;
  margin: 5px;
}

.card-label p {
  color: #edbc31;
  color: #fff;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem;
}

.span-gt-integrado {
  font-weight: normal;
  font-size: unset;
}
</style>
