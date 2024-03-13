<template>
  <!-- MODAL DETALHES -->
  <div
    class="modal fade bd-example-modal-lg"
    id="modalDdetalhesNcm"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLongTitle"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title" id="exampleModalLongTitle">
            {{ tituloDetalhes }}
          </h6>

          <div>
            <span class="badge badge-dark p-2">UF: {{ icms.uf }}</span>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        </div>

        <div class="modal-body text-center">
          <!-- CABEÇALHO -->
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                data-toggle="tab"
                href="#piscofins"
                role="tab"
                aria-controls="profile"
                >PIS/COFINS</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#ipi"
                role="tab"
                aria-controls="messages"
                >IPI</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#icms"
                role="tab"
                aria-controls="settings"
                >ICMS</a
              >
            </li>
          </ul>

          <!-- CONTEUDO -->
          <div class="tab-content">
            <!-- PIS / COFINS -->

            <div id="piscofins" class="tab-pane active" role="tabpanel">
              <br />
              <br />
              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                id="tablePis"
              >
                <thead>
                  <th scope="col">Descrição</th>
                  <th scope="col">PIS/COFINS</th>
                </thead>

                <tbody>
                  <tr>
                    <th>
                      NCM
                      <i
                        class="fas fa-info-circle"
                        title="NOMENCLATURA COMUM DO MERCOSUL"
                      ></i>
                    </th>
                    <td v-if="pisCofins.ncm">{{ pisCofins.ncm }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      CST Entrada
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA DE ENTRADA"
                      ></i>
                    </th>
                    <td v-if="pisCofins.cstEntrada">
                      {{ pisCofins.cstEntrada }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      CST Saída
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA DE SAÍDA"
                      ></i>
                    </th>
                    <td v-if="pisCofins.cstSaida">{{ pisCofins.cstSaida }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      Aliq. PIS(%)
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DO PROGRAMA DE INTEGRAÇÃO SOCIAL"
                      ></i>
                    </th>
                    <td>{{ pisCofins.aliqPis }}</td>
                  </tr>
                  <tr>
                    <th>
                      Aliq. COFINS(%)
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DA CONTRIBUIÇÃO PARA O FINANCIAMENTO DA SEGURIDADE SOCIAL"
                      ></i>
                    </th>
                    <td>{{ pisCofins.aliqCofins }}</td>
                  </tr>
                  <tr>
                    <th>
                      NRI
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO NATUREZA DA RECEITA ISENTA"
                      ></i>
                    </th>
                    <td v-if="pisCofins.nri">{{ pisCofins.nri }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      Cód. ANP
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO PRODUTOS AGÊNCIA NACIONAL DO PETRÓLEO"
                      ></i>
                    </th>
                    <td v-if="pisCofins.codAnp">{{ pisCofins.codAnp }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>

              <br />

              <template v-if="ctrib == '2'">
                <div
                  class="alert alert-warning"
                  role="alert"
                  v-if="ctrib == '2' && tipoCnae != 'INDUSTRIA'"
                >
                  Para Simples Nacional, não serão utilizadas alíquotas. <br />
                  Vide ANEXO I da Sistemática de Alíquotas e Partilha do Simples
                  Nacional para o <strong>COMÉRCIO</strong> de acordo com a
                  faixa de faturamento.
                  <a
                    href="http://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=48430"
                    target="_blank"
                    >Anexo I</a
                  >
                </div>
                <div class="alert alert-warning" role="alert" v-else>
                  Para Simples Nacional, não serão utilizadas alíquotas. <br />
                  Vide ANEXO II da Sistemática de Alíquotas e Partilha do
                  Simples Nacional para a <strong>INDÚSTRIA</strong> de acordo
                  com a faixa de faturamento.
                  <a
                    href="http://normas.receita.fazenda.gov.br/sijut2consulta/anexoOutros.action?idArquivoBinario=48431"
                    target="_blank"
                    >Anexo II</a
                  >
                </div>
              </template>

              <!-- Amp. Legal PisCofins-->
              <div id="ampPC" v-if="pisCofins.amparo != ''">
                <!-- PARA PESQUISA POR NCM -->
                <table
                  class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                  v-if="
                    consultaPorNcm &&
                    pisCofins.amparo &&
                    pisCofins.amparo.length > 0
                  "
                >
                
                  <thead>
                    <tr>
                      <th>Amparo legal</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{{ pisCofins.amparo }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- PARA PESQUISA POR GTIN/DESCRICAO -->
                <table
                  class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                  v-if="!consultaPorNcm && pisCofins.amparo"
                >
                  <thead>
                    <tr>
                      <th>Amparo legal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in pisCofins.amparo"
                      v-bind:key="index.description"
                    >
                      <td>
                        {{ item.type.toUpperCase() }} - {{ item.description }}
                        <i
                          v-if="
                            pisCofins.cstSai != '01' &&
                            item.description.includes('TABELA')
                          "
                          class="fa fa-search lupa mouseHand"
                          v-on:click="
                            $parent.ChamarAlerta(
                              $parent.RetornarLinkDescricaoCST(item.description)
                            )
                          "
                        ></i>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div v-if="pisCofins.nri != ''">
                  <table
                    class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                    id=""
                    v-if="pisCofins.nri && pisCofins.nri.length > 0"
                  >
                    <thead>
                      <tr>
                        <th>Natureza da Receita Isenta</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          {{ pisCofins.nriDescri }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <span
                  id="pmcSpan"
                  v-if="pisCofins.pmc == 'S'"
                  class="badge badge-warning alerta"
                >
                  Produto passível de PMC (preço máximo ao consumidor)
                </span>
              </div>
            </div>

            <!-- IPI -->
            <div class="tab-pane" id="ipi" role="tabpanel">
              <br />
              <br />
              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                id="tableIpi"
              >
                <thead>
                  <th scope="col">Descrição</th>
                  <th scope="col">IPI</th>
                </thead>

                <tbody>
                  <tr>
                    <th>
                      CST Entrada
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA DE ENTRADA"
                      ></i>
                    </th>
                    <td v-if="ipi.cstEntrada">{{ ipi.cstEntrada }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      CST Saída
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA DE SAÍDA"
                      ></i>
                    </th>
                    <td v-if="ipi.cstSaida">{{ ipi.cstSaida }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      Aliq. IPI(%)
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DO IMPOSTO SOBRE PRODUTOS INDUSTRIALIZADOS"
                      ></i>
                    </th>
                    <td>{{ ipi.aliq }}</td>
                  </tr>
                  <tr>
                    <th>
                      Cód. Enq
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DE ENQUADRAMENTO DO IPI"
                      ></i>
                    </th>
                    <td v-if="ipi.codEnq">{{ ipi.codEnq }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      Ex
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO EXCEÇÃO DA TABELA DE IPI"
                      ></i>
                    </th>
                    <td v-if="ipi.ex">{{ ipi.ex }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>

              <div class="alert alert-info mb-2" role="alert">
                Para mais informações acesse:<a
                  href="https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/documentos-e-arquivos/tipi.pdf"
                  target="_blank"
                  ><span> TIPI</span></a
                >
              </div>
              <br />

              <div v-if="ipi.amparo != ''">
                <table
                  class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                  id="tablePis"
                  v-if="ipi.amparo && ipi.amparo.length > 0"
                >
                  <thead>
                    <tr>
                      <th>Amparo legal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="">
                      <td class="text-justify">{{ ipi.amparo }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- ICMS -->
            <div class="tab-pane" id="icms" role="tabpanel">
              <br />
              <br />
              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                id="tableIcms"
              >
                <thead>
                  <th scope="col">Descrição</th>
                  <th scope="col">ICMS</th>
                  <th scope="col">PDV</th>
                </thead>

                <tbody>
                  <tr>
                    <th>
                      CFOP
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO FISCAL DE OPERAÇÕES E PRESTAÇÕES"
                      ></i>
                    </th>
                    <td v-if="icms.cfop">{{ icms.cfop }}</td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      CEST
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO ESPECIFICADOR DA SUBSTITUIÇÃO TRIBUTÁRIA"
                      ></i>
                    </th>
                    <td v-if="icms.cest">{{ icms.cest }}</td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      CST/CSOSN
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA / CÓDIGO DE SITUAÇÃO DA OPERAÇÃO DO SIMPLES NACIONAL"
                      ></i>
                    </th>
                    <td v-if="icms.cstCsosn">{{ icms.cstCsosn }}</td>
                    <td v-else>-</td>
                    <td v-if="pdv.cstCsosn">{{ pdv.cstCsosn }}</td>
                    <td v-else>-</td>
                  </tr>
                  <tr v-if="icms.adRemIcms">
                    <th>
                      AD REM ICMS
                      <i class="fas fa-info-circle" title="AD REM ICMS"></i>
                    </th>
                    <td>
                      {{ icms.adRemIcms }}
                    </td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Aliq. ICMS(%)
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DO ICMS"
                      ></i>
                    </th>
                    <td>{{ icms.aliqIcms }}</td>
                    <td>{{ pdv.aliqIcmsPdv }}</td>
                  </tr>
                  <tr>
                    <th>
                      Red. BC ICMS(%)
                      <i
                        class="fas fa-info-circle"
                        title="REDUÇÃO BASE DE CÁLCULO ICMS"
                      ></i>
                    </th>
                    <td>{{ icms.redBcIcms }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Red. BC ICMS-ST(%)
                      <i
                        class="fas fa-info-circle"
                        title="REDUÇÃO BASE DE CÁLCULO DA SUBSTITUIÇÃO TRIBUTÁRIA DO ICMS"
                      ></i>
                    </th>
                    <td>{{ icms.redBcIcmsSt }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th v-if="icms.aliqIcmsSt">
                      Aliq. ICMS-ST(%)
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DA SUBSTITUIÇÃO TRIBUTÁRIA DO ICMS"
                      ></i>
                    </th>
                    <td v-if="icms.aliqIcmsSt">
                      {{ icms.aliqIcmsSt }}
                    </td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      IVA(%)
                      <i
                        class="fas fa-info-circle"
                        title="IMPOSTO SOBRE O VALOR ACRESCENTADO"
                      ></i>
                    </th>
                    <td>{{ icms.iva }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      FCP(%)
                      <i
                        class="fas fa-info-circle"
                        title="FUNDO DE COMBATE A POBREZA"
                      ></i>
                    </th>
                    <td>{{ icms.fcp }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Cód. Benefício
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DE BENEFÍCIO FISCAL"
                      ></i>
                    </th>
                    <td v-if="icms.codBenef">{{ icms.codBenef }}</td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Antecipado
                      <i
                        class="fas fa-info-circle"
                        title="SE O PAGAMENTO DO ICMS É REALIZADO ANTES DA OCORRÊNCIA DO FATO GERADOR"
                      ></i>
                    </th>
                    <td v-if="icms.antecipado == 'S'">Sim</td>
                    <td v-else>Não</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Diferido
                      <i
                        class="fas fa-info-circle"
                        title="ICMS RECOLHIDO PELO TOMADOR DA PRESTAÇÃO"
                      ></i>
                    </th>
                    <td v-if="icms.diferido == 'S'">Sim</td>
                    <td v-else>Não</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Diferimento
                      <i
                        class="fas fa-info-circle"
                        title="PORCENTAGEM DE DIFERIMENTO"
                      ></i>
                    </th>
                    <td>{{ icms.diferimento }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Isenção(%)
                      <i
                        class="fas fa-info-circle"
                        title="PORCENTAGEM DE ISENÇÃO"
                      ></i>
                    </th>
                    <td>{{ icms.isencao }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Simb. PDV
                      <i
                        class="fas fa-info-circle"
                        title="SIMBOLOGIA DO PDV"
                      ></i>
                    </th>
                    <td>-</td>
                    <td v-if="pdv.simbPdv">{{ pdv.simbPdv }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>

              <br />

              <div v-if="icms.amparo">
                <template v-if="icms.amparo.length > 0">
                  <table
                    class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                    id=""
                  >
                    <thead>
                      <tr>
                        <th>Amparo legal</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="(item, index) in icms.amparo"
                        v-bind:key="index"
                      >
                        <td>{{ item }}</td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </div>

              <div v-if="icms.cestDescricao">
                <table
                  class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                  id=""
                  v-if="icms.cestDescricao != ''"
                >
                  <thead>
                    <tr>
                      <th>CEST</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{{ icms.cestDescricao }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btnModalGeral btn-sm"
            data-dismiss="modal"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import { CallGetAsync } from "@/helpers/axios.js";
import { RetUrlAPI } from "@/helpers/axios.js";

const userStore = useAuthStore();

export default {
  props: {
    p_itemncm: {
      type: Object,
    },
    p_itemoutras: {
      type: Object,
    },
  },
  data() {
    return {
      env: {},

      pisCofins: {},
      ipi: {},
      icms: {},
      pdv: {},

      consultaPorNcm: false,
      temPdv: false,

      tituloDetalhes: "",
      ctrib: userStore.user.profile.prfTaxRegime,
      tipoCnae: userStore.user.profile.prfTypeCnae,

      modeloConsultaNcm: {
        ncmCode: "",
        federal: {
          cestCodigo: "",
          // cestDescricao: '',
          // descricaoGrupo: '',
          descricao: "",
          cstPisCofinsEntrada: "",
          cstPisCofinsSaida: "",
          aliqPis: 0.0,
          aliqCofins: 0.0,
          natRecIsenta: "",
          cstIpiEntrada: "",
          cstIpiSaida: "",
          aliqIpi: 0.0,
          exIpi: "",
          medicamento: "",
          usoVeterinario: "",
          medicamentoTipo: "",
          medicamentoLista: "",
          anpCodigo: "",
          amparoLegal: null,
        },
        state: {
          codigo: "",
          isento: "",
          aliquota: 0.0,
          aliquotaEfetiva: 0.0,
          iva: 0.0,
          reducaoBC: 0.0,
          aliqFCP: 0.0,
          estd_antecipado: "",
          reducaoBcSt: 0.0,
          aliqIcmsCredito: 0.0,
          percDiferimento: 0.0,
          percIsencao: 0.0,
          cstIcms: "",
          cfop: "",
          amparoLegal: null,
        },
      },
    };
  },

  mounted() {
    this.Setup(this.consultaPorNcm);
  },

  methods: {
    Setup(consultaPorNcm) {
      if (consultaPorNcm) {
        this.env = this.p_itemncm;
        this.tituloDetalhes = "Detalhes NCM";

        if (this.env) {
          if (this.env.federal) {
            this.tituloDetalhes = this.env.federal.descricao;

            this.SetObjects(this.env);

            if (this.pisCofins.nri != "") {
              this.BuscaDescrNRI(this.pisCofins.nri, this.pisCofins.cstSaida);
            }
          }
        }
      } else {
        this.env = this.p_itemoutras;
        this.tituloDetalhes = "Detalhes do Produto";

        if (this.env) {
          if (this.env.descricao) {
            this.tituloDetalhes = this.env.descricao;
            this.temPdv = this.env.pdv.simbPdv == "" ? false : true;

            this.SetObjects(this.env);

            if (this.pisCofins.nri != "") {
              this.BuscaDescrNRI(this.pisCofins.nri, this.pisCofins.cstSaida);
            }
          }
        }
      }
    },

    /** Setagem dos objetos principais para ebição no modal.
     * @param env Objeto principal recebido na chamada do componente.
     */
    SetObjects(env) {
      this.pisCofins = this.GetPisCofins(env);
      this.ipi = this.GetIpi(env);
      this.icms = this.GetIcms(env);
      this.pdv = this.GetPdv(env);
    },

    /** Retona objeto PisCofins populado.
     * @param env Objeto principal recebido na chamada do componente.
     */
    GetPisCofins(env) {
      let pisCofins = new Object();

      if (this.consultaPorNcm) {
        pisCofins = this.GetPisCofins_ncm(env);
      } else {
        pisCofins = this.GetPisCofins_outras(env);
      }

      this.BuscaDescrNRI(pisCofins.nri, pisCofins.cstSaida);

      return pisCofins;
    },

    /** Retorna objeto PisCofins populado.
     * @param env Objeto principal recebido na chamada do componente no formato 'modeloConsultaPorNcm'.
     */
    GetPisCofins_ncm(env) {
      let pisCofins = new Object();

      if (env.ncmCode) {
        pisCofins.ncm = env.ncmCode;
        pisCofins.cstEntrada = env.federal.cstPisCofinsEntrada;
        pisCofins.cstSaida = env.federal.cstPisCofinsSaida;
        pisCofins.aliqPis = env.federal.aliqPis.toFixed(2);
        pisCofins.aliqCofins = env.federal.aliqCofins.toFixed(2);
        pisCofins.nri = env.federal.natRecIsenta;
        pisCofins.nriDescri = "";
        pisCofins.codAnp = env.federal.anpCodigo;
        pisCofins.amparo = env.federal.amparoLegal;
        pisCofins.pmc = "N";

        if (pisCofins.amparo == undefined || pisCofins.amparo == null) {
          pisCofins.amparo = "";
        }

        if (pisCofins.nri == undefined || pisCofins.nri == null) {
          pisCofins.nri = "";
        }
      }

      return pisCofins;
    },

    /** Retorna objeto PisCofins populado.
     * @param env Objeto principal recebido na chamada do componente no formato 'modeloConsultaGeral'.
     */
    GetPisCofins_outras(env) {
      let pisCofins = new Object();

      pisCofins.ncm = env.pisCofins.ncm;
      pisCofins.cstEntrada = env.pisCofins.cstEnt;
      pisCofins.cstSaida = env.pisCofins.cstSai;
      pisCofins.aliqPis = env.pisCofins.aliqPis.toFixed(2);
      pisCofins.aliqCofins = env.pisCofins.aliqCofins.toFixed(2);
      pisCofins.nri = env.pisCofins.natRec;
      pisCofins.nriDescri = env.pisCofins.natRecDescription;
      pisCofins.codAnp = env.pisCofins.codAnp;
      pisCofins.amparo = env.pisCofins.amparoLegal;
      pisCofins.pmc = env.pisCofins.pcm;

      if (pisCofins.nri == undefined || pisCofins.nri == null) {
        pisCofins.nri = "";
      }

      if (pisCofins.nriDescri == undefined || pisCofins.nriDescri == null) {
        pisCofins.nriDescri = "";
      }

      return pisCofins;
    },

    GetIpi(env) {
      let ipi = new Object();

      if (this.consultaPorNcm) {
        ipi = this.GetIpi_ncm(env);
      } else {
        ipi = this.GetIpi_outras(env);
      }

      return ipi;
    },

    GetIpi_ncm(env) {
      let ipi = new Object();

      if (env.ncmCode) {
        ipi.cstEntrada = env.federal.cstIpiEntrada;
        ipi.cstSaida = env.federal.cstIpiSaida;
        ipi.aliq = env.federal.aliqIpi.toFixed(2);
        ipi.codEnq = "";
        ipi.ex = env.federal.exIpi;
        ipi.amparo = "";
      }

      return ipi;
    },

    GetIpi_outras(env) {
      let ipi = new Object();

      ipi.cstEntrada = env.ipi.cstEnt;
      ipi.cstSaida = env.ipi.cstSai;
      ipi.aliq = env.ipi.aliqIpi.toFixed(2);
      ipi.codEnq = env.ipi.codEnq;
      ipi.ex = env.ipi.ex;
      ipi.descriTipi = env.ipi.descriTipi;
      ipi.amparo = "";

      return ipi;
    },

    GetIcms(env) {
      let icms = new Object();

      if (this.consultaPorNcm) {
        icms = this.GetIcms_ncm(env);
      } else {
        icms = this.GetIcms_outras(env);
      }

      return icms;
    },

    GetIcms_ncm(env) {
      let icms = new Object();

      if (env.ncmCode) {
        icms.uf = userStore.user.profile.prfUF;
        icms.cfop = env.state.cfop;
        icms.cest = env.federal.cestCodigo;
        icms.cestDescricao = env.federal.descricao;
        icms.cstCsosn = env.state.cstIcms;
        if (env.state.adRemICMS)
          icms.adRemIcms = env.state.adRemICMS.toFixed(4);
        icms.aliqIcms = env.state.aliquota.toFixed(2);
        icms.redBcIcms = env.state.reducaoBC.toFixed(2);

        //----------------------------------------------------------------------
        // Aguardando o campo ser retornado pela API
        //-------------------------------------------(Renzo Alves - 26/05/2022)-
        // env.state.aliqIcmsSt.toFixed(2);

        icms.redBcIcmsSt = env.state.reducaoBcSt.toFixed(2);
        icms.iva = env.state.iva.toFixed(2);
        icms.fcp = env.state.aliqFCP.toFixed(2);
        icms.codBenef = env.state.codigoBenef; // null; // ???
        icms.antecipado = env.state.estd_antecipado;
        icms.diferido = "";
        icms.diferimento = env.state.percDiferimento.toFixed(2);
        icms.isencao = env.state.percIsencao.toFixed(2);
        icms.aliqIcmsCredito = 0.0;
        icms.desonerado = "N";
        icms.excecao = 0;
        icms.isento = "N";
        icms.amparo = new Array();

        if (
          env.state.amparoLegal == undefined ||
          env.state.amparoLegal == null
        ) {
          icms.amparo = [];
        } else {
          let auxAmparo = env.state.amparoLegal;

          auxAmparo.forEach((_amp) => {
            if (_amp.type == "icms") {
              let _desc = _amp.description.split("\r\n");

              for (var i = 0; i < _desc.length; i++) {
                icms.amparo.push(_desc[i]);
              }
            }
          });
        }

        if (icms.diferimento > 0) {
          icms.diferido = "S";
        }
      }

      return icms;
    },

    GetIcms_outras(env) {
      let icms = new Object();

      icms.uf = env.icms.uf;
      icms.cfop = env.icms.cfop;
      icms.cest = env.pisCofins.cest;
      icms.cestDescricao = env.pisCofins.cestDescription;
      icms.cstCsosn = env.icms.cstCsosn;
      if (env.icms.adRemICMS) icms.adRemIcms = env.icms.adRemICMS.toFixed(4);
      icms.aliqIcms = env.icms.aliqIcms.toFixed(2);
      icms.redBcIcms = env.icms.redBcIcms.toFixed(2);
      icms.aliqIcmsSt = env.icms.aliqIcmsSt.toFixed(2);
      icms.redBcIcmsSt = env.icms.redBcIcmsSt.toFixed(2);
      icms.iva = env.icms.iva.toFixed(2);
      icms.fcp = env.icms.fcp.toFixed(2);
      icms.codBenef = env.icms.codBenef;
      icms.antecipado = env.icms.antecipado;
      icms.diferido = "N";
      icms.diferimento = env.icms.percDifer.toFixed(2);
      icms.isencao = env.icms.pIsencao.toFixed(2);
      icms.aliqIcmsCredito = env.icms.aliqIcmsCredito;
      icms.desonerado = env.icms.desonerado;
      icms.excecao = env.icms.excecao;
      icms.isento = env.icms.isento;
      icms.amparo = new Array();

      if (env.icms.lawGrounds == undefined || env.icms.lawGrounds == null) {
        icms.amparo = [];
      } else {
        let auxAmparo = env.icms.lawGrounds;

        auxAmparo.forEach((_amp) => {
          if (_amp.type == "icms") {
            let _desc = _amp.description.split("\r\n");

            for (var i = 0; i < _desc.length; i++) {
              icms.amparo.push(_desc[i]);
            }
          }
        });
      }

      if (icms.diferimento > 0) {
        icms.diferido = "S";
      }

      return icms;
    },

    GetPdv(env) {
      let pdv = new Object();

      if (this.consultaPorNcm) {
        pdv = this.GetPdv_ncm(env);
      } else {
        pdv = this.GetPdv_outras(env);
      }
      return pdv;
    },

    GetPdv_ncm(env) {
      let pdv = new Object();

      if (env.pdv) {
        pdv.aliqCofins = env.pdv.aliqCofins.toFixed(2);
        pdv.aliqIcmsInterna = env.pdv.aliqIcmsInterna.toFixed(2);
        pdv.aliqIcmsPdv = env.pdv.aliqIcmsPdv.toFixed(2);
        pdv.aliqPis = env.pdv.aliqPis.toFixed(2);
        pdv.cstCsosn = env.pdv.cstCsosn;
        pdv.cstEnt = env.pdv.cstEnt;
        pdv.cstSai = env.pdv.cstSai;
        pdv.simbPdv = env.pdv.simbPdv;
      }

      if (env.state.pdv) {
        pdv.aliqCofins = env.state.pdv.aliqCofins.toFixed(2);
        pdv.aliqIcmsInterna = env.state.pdv.aliqIcmsInterna.toFixed(2);
        pdv.aliqIcmsPdv = env.state.pdv.aliqIcmsPdv.toFixed(2);
        pdv.aliqPis = env.state.pdv.aliqPis.toFixed(2);
        pdv.cstCsosn = env.state.pdv.cstCsosn;
        pdv.cstEnt = env.state.pdv.cstEnt;
        pdv.cstSai = env.state.pdv.cstSai;
        pdv.simbPdv = env.state.pdv.simbPdv;
      }

      return pdv;
    },

    GetPdv_outras(env) {
      let pdv = new Object();

      pdv.aliqCofins = env.pdv.aliqCofins.toFixed(2);
      pdv.aliqIcmsInterna = env.pdv.aliqIcmsInterna.toFixed(2);
      pdv.aliqIcmsPdv = env.pdv.aliqIcmsPdv.toFixed(2);
      pdv.aliqPis = env.pdv.aliqPis.toFixed(2);
      pdv.cstCsosn = env.pdv.cstCsosn;
      pdv.cstEnt = env.pdv.cstEnt;
      pdv.cstSai = env.pdv.cstSai;
      pdv.simbPdv = env.pdv.simbPdv;

      return pdv;
    },

    BuscaDescrNRI(nri, cstPisCofins) {
      if (!nri || !cstPisCofins) return;

      this.processando = true;

      let token = userStore.user.tokenSession;
      let userID = 1108;

      if (userStore.user.userId) {
        userID = userStore.user.userId;
      }

      let url = `${RetUrlAPI()}DefNatRecIsenta_Description?nriCode=${nri}&cstPisCofins=${cstPisCofins}&userID=${userID}&sessionToken=${token}`;

      CallGetAsync(url)
        .then((data) => {
          if (data.code != null) {
            this.processando = false;
            this.pisCofins.nriDescri = `${data.code} - ${data.description}`;
          } else {
            this.processando = false;
            this.pisCofins.nriDescri =
              "Descrição da NCM não foi encontrada em nossa base de dados.";
            // Mensagem(2, 'Ocorreu um erro ao buscar descrição, tente novamente!');
          }
        })
        .catch((reason) => {
          this.processando = false;
        });
    },
  },

  watch: {
    p_itemncm: function (newValue, oldValue) {
      this.consultaPorNcm = true;
      this.Setup(this.consultaPorNcm);
    },

    p_itemoutras: function (newValue, oldValue) {
      this.Setup(this.consultaPorNcm);
    },
  },
};
</script>

<style></style>
