<template>
  <LayoutSidebar>
    <div v-if="processando" id="loading">
      <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 mb-3">
          <!-- ESCOLHA A MELHOR OPÇÃO PARA VOCÊ -->
          <h1>
            <b>{{ solucaoName }}</b>
          </h1>
          <h5>{{ solucaoMensagem }}</h5>
        </div>
      </div>

      <div class="row justify-content-center">
        <!-- STANDART -->
        <div :class="cssCols">
          <div class="card border-0" style="border-radius: 10px">
            <div class="card-img-top" :style="CssColunas(false)">
              <h3 class="card-title text-center mt-3">STANDARD</h3>
              <h6 class="card-title text-center">&nbsp;</h6>
            </div>

            <div class="card-body">
              <h4 class="card-text text-center mb-2">
                {{ planoBasico.valor }}/mensal
              </h4>
              <h6 class="card-text text-center">
                ou {{ planoBasico.valor_avista }} à vista
                <br />
                no plano anual
              </h6>

              <h6>&nbsp;</h6>
              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBasico.cons_individual < 0"
                  >Consulta Individual <b>Ilimitada</b></span
                >
                <span v-else-if="planoBasico.cons_individual == 0"
                  >SEM consulta individual</span
                >
                <span v-else
                  >Consulta Individual {{ planoBasico.cons_individual }}</span
                >
              </h6>

              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBasico.cons_lote < 0"
                  >Consulta em Lote <b>Ilimitada</b></span
                >
                <span v-else-if="planoBasico.cons_lote == 0"
                  >SEM Consulta em Lote</span
                >
                <span v-else>
                  Consulta em Lote:
                  {{ planoBasico.cons_lote }} por mês
                </span>
              </h6>

              <h6 class="card-text">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBasico.licencas < 0"
                  >Licenças: <b>Ilimitada</b></span
                >
                <span v-else-if="planoBasico.licencas == 0"
                  ><b>Licença única</b></span
                >
                <span v-else
                  ><b>
                    Licenças disponíveis:
                    {{ planoBasico.licencas }}</b
                  >
                </span>
              </h6>
            </div>

            <div class="card-footer">
              <div
                class="geral-button btn-sm col-md-12 mt-1"
                @click.stop.prevent="PixBoletoTransf()"
                v-if="planoBasico.valor > 0"
                style="text-align: center; cursor: pointer"
              >
                Contratar
              </div>
            </div>
          </div>
        </div>

        <!-- PREMIUM -->
        <div :class="cssCols">
          <div class="card border-0" style="border-radius: 10px">
            <div class="card-img-top" :style="CssColunas(true)">
              <h3 class="card-title text-center mt-3">PREMIUM</h3>
              <h6 class="card-title text-center">
                Plano ideal para sua empresa
              </h6>
            </div>

            <div class="card-body">
              <h4 class="card-text text-center mb-2">
                {{ planoPremium.valor }}/mensal
              </h4>
              <h6 class="card-text text-center">
                ou {{ planoPremium.valor_avista }} à vista
                <br />
                no plano anual
              </h6>

              <h6>&nbsp;</h6>
              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoPremium.cons_individual < 0"
                  >Consulta Individual <b>Ilimitada</b></span
                >
                <span v-else-if="planoPremium.cons_individual == 0"
                  >SEM consulta individual</span
                >
                <span v-else
                  >Consulta Individual {{ planoPremium.cons_individual }}</span
                >
              </h6>

              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoPremium.cons_lote < 0"
                  >Consulta em Lote <b>Ilimitada</b></span
                >
                <span v-else-if="planoPremium.cons_lote == 0"
                  >SEM Consulta em Lote</span
                >
                <span v-else>
                  Consulta em Lote:
                  {{ planoPremium.cons_lote }} por mês
                </span>
              </h6>

              <h6 class="card-text">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoPremium.licencas < 0"
                  >Licenças: <b>Ilimitada</b></span
                >
                <span v-else-if="planoPremium.licencas == 0"
                  ><b>Licença única</b></span
                >
                <span v-else>
                  <b>Licenças disponíveis: {{ planoPremium.licencas }}</b>
                </span>
              </h6>
            </div>

            <div class="card-footer">
              <div
                class="geral-button btn-sm col-md-12 mt-1"
                @click.stop.prevent="PixBoletoTransf(0)"
                v-if="planoPremium.valor > 0"
                style="text-align: center; cursor: pointer"
              >
                Contratar
              </div>
            </div>
          </div>
        </div>

        <!-- BUSINESS -->
        <div :class="cssCols">
          <div class="card border-0" style="border-radius: 10px">
            <div class="card-img-top" :style="CssColunas(false)">
              <h3 class="card-title text-center mt-3">BUSINESS</h3>
              <h6 class="card-title text-center">&nbsp;</h6>
            </div>

            <div class="card-body">
              <h4 class="card-text text-center mb-2">
                {{ planoBusiness.valor }}/mensal
              </h4>
              <h6 class="card-text text-center">
                ou {{ planoBusiness.valor_avista }} à vista
                <br />
                no plano anual
              </h6>

              <h6>&nbsp;</h6>
              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBusiness.cons_individual < 0"
                  >Consulta Individual <b>Ilimitada</b></span
                >
                <span v-else-if="planoBusiness.cons_individual == 0"
                  >SEM consulta individual</span
                >
                <span v-else
                  >Consulta Individual {{ planoBusiness.cons_individual }}</span
                >
              </h6>

              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBusiness.cons_lote < 0"
                  >Consulta em Lote <b>Ilimitada</b></span
                >
                <span v-else-if="planoBusiness.cons_lote == 0"
                  >SEM Consulta em Lote</span
                >
                <span v-else>
                  Consulta em Lote:
                  {{ planoBusiness.cons_lote }} por mês
                </span>
              </h6>

              <h6 class="card-text">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBusiness.licencas < 0"
                  >Licenças: <b>Ilimitada</b></span
                >
                <span v-else-if="planoBusiness.licencas == 0"
                  ><b>Licença única</b></span
                >
                <span v-else>
                  <b>Licenças disponíveis: {{ planoBusiness.licencas }}</b>
                </span>
              </h6>
            </div>

            <div class="card-footer">
              <div
                class="geral-button btn-sm col-md-12 mt-1"
                @click.stop.prevent="PixBoletoTransf(0)"
                v-if="planoBusiness.valor > 0"
                style="text-align: center; cursor: pointer"
              >
                Contratar
              </div>
            </div>
          </div>
        </div>

        <!-- TRIAL -->
        <div :class="cssCols" v-if="!userLogado">
          <div class="card border-0" style="border-radius: 10px">
            <div class="card-img-top" :style="CssColunas(false)">
              <h3 class="card-title text-center mt-3">TRIAL</h3>
              <h6 class="card-title text-center">&nbsp;</h6>
            </div>

            <div class="card-body">
              <h4 class="card-text text-center">
                Teste 
                <strong>GRÁTIS</strong> <br />
                por 7 dias.
              </h4>
              <br />

              <h6>&nbsp;</h6>
              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBasico.cons_individual < 0"
                  >Consulta Individual <b>Ilimitada</b></span
                >
                <span v-else-if="planoBasico.cons_individual == 0"
                  >SEM consulta individual</span
                >
                <span v-else
                  >Consulta Individual {{ planoBasico.cons_individual }}</span
                >
              </h6>

              <h6 class="card-text mb-3">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBasico.cons_lote < 0"
                  >Consulta em Lote <b>Ilimitada</b></span
                >
                <span v-else-if="planoBasico.cons_lote == 0"
                  >SEM Consulta em Lote</span
                >
                <span v-else>
                  Consulta em Lote:
                  {{ planoBasico.cons_lote }} por mês
                </span>
              </h6>

              <h6 class="card-text">
                <i class="fa-regular fa-circle-check mr-1"></i>
                <span v-if="planoBasico.licencas < 0"
                  >Licenças: <b>Ilimitada</b></span
                >
                <span v-else-if="planoBasico.licencas == 0"
                  ><b>Licença única</b></span
                >
                <span v-else>
                  <b>Licenças disponíveis: {{ planoBasico.licencas }}</b>
                </span>
              </h6>
            </div>

            <div class="card-footer">
              <div
                class="geral-button btn-sm col-md-12 mt-1"
                @click.stop.prevent="PixBoletoTransf(0)"
                v-if="planoBasico.valor > 0"
                style="text-align: center; cursor: pointer"
              >
                Cadastar Agora
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutSidebar>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";

let userStore = useAuthStore();

export default {
  data() {
    return {
      processando: false,
      userLogado: userStore.user.hasAuth,
      urlFunil:
        "https://api.whatsapp.com/send?phone=5516981440284&text=Ol%C3%A1%20gostaria%20de%20assinar%20o%20Portal%20IMendes%20via%20PIX%20ou%20Boleto",
      solucaoName: "",
      solucaoMensagem: "",
      recorrencia: true,
      idSolucao: window.location.href.split("?")[1],
      aguarde: false,

      // ----------------------------------------------------------------------
      // CONTROLE DE TELA E RODAPÉ
      // ----------------------------------------------------------------------
      alturaJanela: 0,
      alternarRodape: true,

      // D4Sign
      hostD4S_hom: "https://sandbox.d4sign.com.br/embed/viewblob",
      hostD4S_prod: "https://secure.d4sign.com.br/embed/viewblob",

      // ----------------------------------------------------------------------
      // Modalidade de pagamento
      // ----------------------------------------------------------------------
      modalidade: 3,
      modalidades: [
        {
          modId: 1,
          modLabel: "MENSAL (Pagamento a vista em 1x.)",
        },
        {
          modId: 3,
          modLabel: "ANUAL à vista (Pagamento à vista com desconto 1x.)",
        },
        {
          modId: 2,
          modLabel: "ANUAL parcelado (Pagamento 12x Valor Mensal.)",
        },
      ],

      resBD: [],
      plano: {
        id: "",
        solucaoId: "",
        tipo: "",
        modalidade: 3,
        consLote: 0,
        consIndividual: 0,
        numParcelas: "",
        valor: "",
        descricao: "",
        licencas: "",
      },

      planoBasico: {
        valor: 0,
        valor_avista: 0,
        cons_individual: 0,
        cons_lote: 0,
        licencas: 0,
      },

      planoPremium: {
        valor: 0,
        valor_avista: 0,
        cons_individual: 0,
        cons_lote: 0,
        licencas: 0,
      },

      planoBusiness: {
        valor: 0,
        valor_avista: 0,
        cons_individual: 0,
        cons_lote: 0,
        licencas: 0,
      },

      cliente: {
        id: "",
        nome: "",
        sobrenome: "",
        email: "",
        cnpjcpf: "",
        nomeEmpresa: "",
        telefone: "",
        cep: "",
        endereco: "",
        numero: 0,
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        aceito: false,
        uuid: "",
        signer_documentation: "",
      },

      dadosPagamento: {
        cartaoVinculado: "CPF", // 'CPF' ou 'CNPJ'
        mesmoDocumento: "S", // Mesmo 'CPF' ou 'CNPJ' informado no preenchimento do formário 'dadosCliente.js'
        documentoPagto: "", // Se (mesmoDocumento=='S') o usuário deve informar qual é o CPF/CNPJ vinculado ao cartão de crédito que será utilizado.
      },

      cssCols: "col-12 col-sm-12 col-md-6 col-lg-3 mb-3 mt-2",
    };
  },
  methods: {
    LoadPlanos() {
      let tokenSessao = "none";
      let id = "0";
      let idSolucao = "0";

      if (userStore.user.tokenSession) {
        tokenSessao = userStore.user.tokenSession;
      }

      if (userStore.user.userId) {
        id = userStore.user.userId;
      }

      if (this.idSolucao) {
        idSolucao = this.idSolucao;
      }

      let url =
        RetUrlAPI() +
        "GetPlanos?userID=" +
        id +
        "&sessionToken=" +
        tokenSessao +
        "&solucaoID=" +
        idSolucao;

      this.processando = true;

      CallGetAsync(url)
        .then((data) => {
          if (data.success) {
            this.LoadDadosAPI(data.solutions);
            this.GetSolucaoSelecionada();

            this.processando = false;
          } else {
            this.alertStore.error(data.message);
            this.processando = false;
          }
        })
        .catch((reason) => {
          console.log(reason);
          this.alertStore.error(
            "Falha ao atualizar as informações vindas do servidor."
          );
          this.processando = false;
        });
    },
    LoadDadosAPI(solutions) {
      this.resBD = [];
      solutions.forEach((solution) => {
        let obj = Object();

        solution.valormensal = solution.valormensal.replace(",", ".");
        solution.valoranual = solution.valoranual.replace(",", ".");

        obj.id = solution.id;
        obj.solucaoId = solution.solucaoid;
        obj.modalidade = solution.modalidade;
        obj.tipo = solution.tipo;
        obj.valorMensal = solution.valormensal;
        obj.valorAnual = solution.valoranual;
        obj.consIndividual = solution.consindividual;
        obj.consLote = solution.conslote;
        obj.licencas = solution.licencas;

        obj.valorMensal = solution.valormensal;
        obj.valorAnual = solution.valoranual;

        this.resBD.push(obj);
      });
    },
    GetSolucaoSelecionada() {
      switch (this.idSolucao) {
        case "19":
          this.solucaoName = "GESTOR TRIBUTÁRIO";
          this.solucaoMensagem =
            "Consulta individual e em lote das informações tributárias nos âmbitos Estadual e Federal.";
          this.SetPlanos(19);
          break;

        case "20":
          this.solucaoName = "MOOSTRI";
          this.solucaoMensagem =
            "Solução em tecnologia especializada e segura para garantia e aumento da margem de lucro.";
          this.SetPlanos(20);
          break;

        case "21":
          this.solucaoName = "VACINE";
          this.solucaoMensagem =
            "Auditoria e Insights tributários das NF-e, NFC-e e SAT.";
          this.SetPlanos(21);
          break;

        case "22":
          this.solucaoName = "GT 3.0";
          this.solucaoMensagem =
            "Consulta Individual e em lote das informações tributárias nos âmbitos Estadual e Federal para operações interestaduais.";
          this.SetPlanos(22);
          break;

        default:
          this.solucaoName = "GESTOR TRIBUTÁRIO";
          this.solucaoMensagem = "";
          this.SetPlanos(19);
          break;
      }
    },
    SetPlanos(solucao) {
      let solucao_id = solucao.toString();
      let res = this.resBD.filter(function (aux) {
        return aux.solucaoId == solucao_id;
      });

      res.forEach((solu) => {
        switch (solu.tipo) {
          case 0:
            this.SetPlanoBasico(solu);
            break;

          case 1:
            this.SetPlanoPremium(solu);
            break;

          case 2:
            this.SetPlanoBusiness(solu);
            break;
        }
      });
    },
    SetPlanoBasico(data) {
      this.planoBasico.id = data.id;
      this.planoBasico.valor = data.valorMensal;
      this.planoBasico.valor_avista = data.valorAnual;
      this.planoBasico.cons_individual = data.consIndividual;
      this.planoBasico.cons_lote = data.consLote;
      this.planoBasico.licencas = data.licencas;
    },
    SetPlanoPremium(data) {
      this.planoPremium.id = data.id;
      this.planoPremium.valor = data.valorMensal;
      this.planoPremium.valor_avista = data.valorAnual;
      this.planoPremium.cons_individual = data.consIndividual;
      this.planoPremium.cons_lote = data.consLote;
      this.planoPremium.licencas = data.licencas;
    },
    SetPlanoBusiness(data) {
      this.planoBusiness.id = data.id;
      this.planoBusiness.valor = data.valorMensal;
      this.planoBusiness.valor_avista = data.valorAnual;
      this.planoBusiness.cons_individual = data.consIndividual;
      this.planoBusiness.cons_lote = data.consLote;
      this.planoBusiness.licencas = data.licencas;
    },
    CssColunas(destaque) {
      let estilo = "";
      let bordas = "border-radius: ";
      let corFundo = "background-color: #";
      let largura = "width: auto;";

      //----------------------------------------------------------------------
      // Cor do fundo
      //----------------------------------------------------------------------
      corFundo += (destaque ? "EEBC2A" : "D5D5D5") + "; ";

      //----------------------------------------------------------------------
      // Cantos
      //----------------------------------------------------------------------
      let corner_top_left = " 10px";
      let corner_top_right = " 10px";
      let corner_bottom_left = " 0px";
      let corner_bottom_right = " 0px";

      bordas +=
        corner_top_left +
        corner_top_right +
        corner_bottom_right +
        corner_bottom_left +
        "; ";
      //----------------------------------------------------------------------

      estilo = corFundo + bordas + largura;

      return estilo;
    },
    PixBoletoTransf() {
      window.open(this.urlFunil, "_blank");
    },
  },
  created() {
    this.LoadPlanos();

    if (this.userLogado) this.cssCols += " ml-4";
  },
};
</script>

<style scoped>
.card-footer {
  background-color: white;
  border: none;
  border-radius: 10px;
}

.card {
  padding: 0;
  min-width: 280px;
}

.card-title {
  color: #2e354c;
}
</style>
