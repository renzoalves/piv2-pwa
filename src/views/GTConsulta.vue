<template>
  <div v-if="processando" id="loading">
    <img id="loading-image" src="@/assets/images/processando.gif" />
  </div>
  <div class="row">
    <div class="col-md-2">
      <select
        class="form-control form-control-sm"
        v-model="criterio"
        id="selectCriterio"
        v-on:click="LimparCamposCriterio(criterio)"
      >
        <option v-for="item in criterios" :key="item.tipo">
          {{ item.tipo }}
        </option>
      </select>
    </div>
    <div class="col-md-2 mb-1" v-if="criterio == 'DESCRICAO'">
      <select
        class="form-control form-control-sm"
        v-model="tipoDescr"
        id="selectTipoDescricao"
      >
        <option v-for="item in tiposDescricao" :key="item.tipo">
          {{ item.tipo }}
        </option>
      </select>
    </div>
    <div class="col-md-1 mb-1" v-if="criterio == 'NCM'">
      <input
        type="text"
        class="form-control form-control-sm"
        v-model="exIPI"
        id="exIPI"
        maxlength="2"
        placeholder="Ex. IPI"
      />
    </div>
    <div class="col-md-3 mb-1">
      <input
        class="form-control form-control-sm valor"
        v-model="valor"
        id="valor"
        v-bind:placeholder="'Informe ' + DescricaoTxtValor(criterio)"
        v-on:keyup.enter="Consult(valor, criterio, exIPI)"
      />
      <div id="lupa" v-on:click="Consult(valor, criterio, exIPI)">
        <i class="fa fa-search lupa"></i>
      </div>
    </div>
    <div class="col-md-2 mb-1" v-if="criterio == 'DESCRICAO'">
      <input
        type="text"
        class="form-control form-control-sm"
        v-model="cest"
        id="cest"
        maxlength="10"
        placeholder="CEST"
        v-on:keyup.enter="Consult(valor, criterio, exIPI)"
      />
    </div>
    <div
      class="col-md-2 ml-auto mt-2 text-right"
      v-if="criterio != 'DESCRICAO' && userLogged"
    >
      <a
        href=""
        class="btn-lote"
        data-toggle="modal"
        data-target="#modalConsultaLote"
        @click="ChamarModalConsultaLote()"
        >Consultar em lote</a
      >
    </div>
  </div>

  <div id="divHistorico">
    <div class="d-inline" v-for="item in ListaHistorico" :key="item.chave">
      <HistoryButtons
        @excluir-elemento="ExcluirComponente"
        @consult="Consult"
        v-bind:key="item.chave"
        v-bind:valor="item.valor"
      />
    </div>
  </div>

  <div class="row">
    <div v-if="tipoConsulta == 1 || tipoConsulta == 4" class="col-md-12 mt-3">
      <div
        class="row"
        v-if="qtdePaginas > 1 || limite >= itens.products.length"
      >
        <div class="col-md-11 float-right">
          <p
            class="mt-3"
            v-if="
              (tipoConsulta == 1 || tipoConsulta == 4) &&
              itens.products != undefined
            "
            style="color: dimgray"
          >
            <span v-if="itens.products.length > 1">
              Itens Retornados: {{ itens.products.length }}
            </span>
          </p>
        </div>

        <div class="col-md-1 float-right mb-1 mt-2">
          <select
            class="form-control form-control-sm"
            v-model="limite"
            v-if="itens.products.length > 10"
            title="Altera o limite de produtos por página."
            v-on:change="
              pagina = 1;
              PaginarTabela();
            "
          >
            <option v-for="item in limites" :key="item.qtde">
              {{ item.qtde }}
            </option>
          </select>
        </div>
      </div>

      <table
        class="table table-responsive"
        id="tblResultadoPrincipal"
        v-show="tblResultadoPrincipalMostrar"
      >
        <thead>
          <tr>
            <th name="thAtividade">Atividade</th>
            <th class="fontSteel">Código</th>
            <th class="fontSteel">Descrição</th>
            <th class="fontSteel">NCM</th>
            <th class="fontSteel">CEST</th>
            <th class="fontSteel">PIS e COFINS</th>
            <th class="fontSteel">NRI</th>
            <th class="fontSteel">CST ICMS | CSOSN</th>
            <th class="fontSteel">AD REM ICMS</th>
            <th class="fontSteel">ICMS (%)</th>
            <th class="fontSteel">Redução ICMS (%)</th>
            <th class="fontSteel">IVA (%)</th>
            <th class="fontSteel">Amparo Legal</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(i, index) in itens.products"
            v-bind:key="index.codImendes"
          >
            <td name="tdAtividade">{{ i.atividade }}</td>
            <td class="tableexport-string">{{ i.codBarras }}</td>
            <td class="tableexport-string">{{ i.descricao }}</td>
            <td class="tableexport-string">{{ i.pisCofins.ncm }}</td>
            <td class="tableexport-string">{{ i.pisCofins.cest }}</td>
            <td class="tableexport-string">{{ i.pisCofins.cstSai }}</td>
            <td class="tableexport-string">{{ i.pisCofins.natRec }}</td>
            <td class="tableexport-string">{{ i.icms.cstCsosn }}</td>
            <td class="tableexport-string" v-if="i.icms.adRemICMS">
              {{ i.icms.adRemICMS.toFixed(4) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ i.icms.aliqIcms.toFixed(2) }}
            </td>
            <td class="tableexport-string">
              {{ i.icms.redBcIcms.toFixed(2) }}
            </td>
            <td class="tableexport-string">{{ i.icms.iva.toFixed(2) }}</td>
            <td class="tableexport-string">
              {{ RetornarAmparoLegal(index) }}
            </td>
          </tr>
        </tbody>
      </table>

      <table
        class="table table-divider table-striped table-sm table-responsive-lg tableFixHead table-bordered"
        id="tabelaPrincipal"
      >
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
              <i
                class="fa fa-refresh mouseHand"
                aria-hidden="true"
                v-if="tipoConsulta == 1 || tipoConsulta == 4"
                v-on:click="RestaurarLista()"
                data-toggle="tooltip"
                data-placement="top"
                title="Restaura lista"
              ></i>
            </th>
            <th
              class="fontSteel"
              data-toggle="tooltip"
              data-placement="top"
              title=""
              v-if="mostrarSimples"
            >
              Simples Nacional
            </th>
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
                title="REDUÇÃO DA BASE DE xCÁLCULO DO ICMS"
              ></i>
            </th>
            <th class="fontStell">
              ICMS PDV(%)
              <i
                class="fas fa-info-circle"
                title="ALÍQUOTA DO ICMS OPERAÇÃO COM PONTO DE VENDA"
              ></i>
            </th>
            <!-- <th class="fontSteel" data-toggle="tooltip" data-placement="top" title="CÓDIGO FISCAL DE OPERAÇÕES"> CFOP</th> -->
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
          <template v-for="(i, index) in Paginar" v-bind:key="index.codImendes">
            <tr>
              <td v-if="mostrarAtividade">
                <i
                  data-toggle="tooltip"
                  data-placement="top"
                  title="BUSCAR APENAS PRODUTOS COM MESMA ATIVIDADE"
                  class="fas fa-equals mouseHand"
                  v-on:click="FiltrarResultado('igual', i.atividade)"
                ></i>
                <i
                  data-toggle="tooltip"
                  data-placement="top"
                  title="BUSCAR APENAS PRODUTOS COM OUTRA ATIVIDADE"
                  class="fas fa-not-equal mouseHand"
                  v-on:click="FiltrarResultado('diferente', i.atividade)"
                ></i>
                {{ i.atividade }}
              </td>
              <td class="text-center" v-if="mostrarSimples">
                {{ this.SimplesNacional(i.caracTrib) }}
              </td>
              <td class="text-center" v-if="consultaLoteCodigo">
                {{ i.codBarras.replace(/^0+/, "") }}
              </td>
              <td v-if="i.descricao">
                {{ RemoverResiduos(i.descricao) }}
              </td>
              <td v-else>-</td>
              <td class="text-center" v-if="i.pisCofins.ncm">
                {{ MascaraNCM(i.pisCofins.ncm) }}
              </td>
              <td class="text-center" v-else>-</td>
              <td class="text-center" v-if="i.pisCofins.cest">
                {{ i.pisCofins.cest }}
              </td>
              <td class="text-center" v-else>-</td>
              <td class="text-center" v-if="i.pisCofins.cstSai">
                {{ i.pisCofins.cstSai }}
              </td>
              <td class="text-center" v-else>-</td>
              <td class="text-center" v-if="i.pisCofins.natRec">
                {{ i.pisCofins.natRec }}
                <i
                  class="fa fa-search lupa mouseHand"
                  title="Detalhes"
                  v-on:click="
                    BuscaDescrNRI(i.pisCofins.natRec, i.pisCofins.cstSai)
                  "
                ></i>
              </td>
              <td class="text-center" v-else>-</td>
              <td class="text-center" v-if="i.icms.cstCsosn">
                {{ i.icms.cstCsosn }}
              </td>
              <td class="text-center" v-else>-</td>
              <td class="text-right" v-if="i.icms.adRemICMS">
                {{ i.icms.adRemICMS.toFixed(4) }}
              </td>
              <td class="text-center" v-else>-</td>
              <td class="text-right">{{ i.icms.aliqIcms.toFixed(2) }}</td>
              <td class="text-right">{{ i.icms.redBcIcms.toFixed(2) }}</td>

              <td class="text-right" v-if="i.pdv && i.pdv.aliqIcmsPdv">
                {{ i.pdv.aliqIcmsPdv.toFixed(2) }}
              </td>
              <td class="text-right" v-else>0.00</td>

              <td class="text-center">
                <i
                  class="fa fa-search lupa mouseHand"
                  title="Detalhes"
                  v-on:click="
                    ConsultDetails(
                      i.codImendes,
                      ctrib,
                      tipoCnae,
                      i.atividade,
                      i.codBarras,
                      i.icms.codRegra,
                      i.icms.codExcecao
                    )
                  "
                ></i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

  <div class="row">
    <div
      class="col-md-12 overflow-auto"
      v-if="consultaNCM == true && tipoConsulta != 5"
    >
      <NcmConsult
        @exportar-alterado="ExportarAlterado"
        @buscar-nri="BuscaDescrNRI"
        v-bind:opcao="0"
        v-bind:ncm="ncm"
        v-bind:ex="exIPI"
        v-bind:consLote="consLote"
        v-bind:consultaNCM="consultaNCM"
        v-bind:tamanho="1"
        v-bind:key="chave"
        v-bind:mostraratividade="tipoCnae == 'GERAL'"
      >
      </NcmConsult>
    </div>

    <div
      class="col-md-12 overflow-auto"
      v-if="tipoConsulta == 4 || tipoConsulta == 5"
    >
      <div class="overflow-auto" v-if="tipoConsulta == 5">
        <NcmConsult
          @exportar-alterado="ExportarAlterado"
          @buscar-nri="BuscaDescrNRI"
          v-bind:opcao="1"
          v-bind:ncm="ncm"
          v-bind:ex="exIPI"
          v-bind:consLote="consLote"
          v-bind:consultaNCM="consultaNCM"
          v-bind:tamanho="1"
          v-bind:key="chave"
          v-bind:mostraratividade="tipoCnae == 'GERAL'"
        >
        </NcmConsult>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-5 col-lg-3 mt-3 mb-2">
      <button
        class="geral-button btn-sm ml-1"
        v-if="exportar == true && userLogged"
        data-toggle="modal"
        data-target="#modalExportacao"
        data-backdrop="static"
        data-keyboard="false"
      >
        Exportar
      </button>
    </div>
    <template
      v-if="
        qtdePaginas > 1 &&
        (tipoConsulta == 1 || tipoConsulta == 4) &&
        itens.products.length > 0
      "
    >
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
      <div class="col-md-3 col-lg-2 mt-3">
        <input
          type="number"
          class="form-control valor"
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

  <!-- Modal Info NRI -->
  <div
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    id="modalNRI"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Informações NRI</h5>
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
          <div class="alert alert-info mb-2" role="alert">
            {{ infoNRI }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL DETALHES NCM -->
  <ConsultDetails v-bind:p_itemoutras="objdetalhe"></ConsultDetails>

  <!-- Modal Exportação -->
  <div
    class="modal fade"
    id="modalExportacao"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            Exportação do Resultado
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
            <div
              class="form-group"
              v-if="tipoConsulta == 1 || tipoConsulta == 4"
            >
              <label for="cbTipoExportacao" class="col-form-label"
                >Tipos de Exportação:</label
              >
              <select
                class="form-control"
                id="cbTipoExportacao"
                v-model="tipoExportacao"
              >
                <option
                  v-for="i in tiposExportacao"
                  v-bind:key="i.tipo"
                  v-bind:value="i.tipo"
                >
                  {{ i.descricao }}
                </option>
              </select>
            </div>
            <div
              class="form-group"
              v-if="tipoExportacao == 0 || tipoConsulta == 5"
            >
              <label for="emailUsuario" class="col-form-label"> Email: </label>
              <input
                type="email"
                class="form-control"
                id="emailUsuario"
                v-model="emailUsuario"
              />
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn geral-button primary btn-sm"
            data-dismiss="modal"
          >
            Cancelar
          </button>
          <button
            v-if="tipoExportacao == 0"
            type="button"
            class="btn geral-button btn-sm"
            v-on:click="RetornarExportacao()"
          >
            Enviar Exportação
          </button>
          <button
            v-else
            type="button"
            class="btn geral-button btn-sm"
            v-on:click="RetornarExportacao()"
          >
            Exportar
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Consulta em Lote -->
  <div
    class="modal fade bd-example-modal-lg"
    id="modalConsultaLote"
    tabindex="-1"
    role="dialog"
    aria-labelledby="TituloModalCentralizado"
    aria-hidden="true"
  >
    <ModalImport
      @consulta-lote-codigo="ConsultaLoteCodigo"
      @consulta-lote-ncm="ConsultaLoteNCM"
      @click="this.consultaNCM = false"
      v-bind:key="chaveModalImport"
      v-bind:criterio="criterio"
      pagina="2"
    />
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";
import helpers from "@/helpers";
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";

import HistoryButtons from "@/components/buttons/HistoryButtons.vue";
import ConsultDetails from "@/components/gtconsultas/ConsultDetails.vue";
import NcmConsult from "@/components/gtconsultas/NcmConsult.vue";
import ModalImport from "@/components/ModalImport.vue";

import _ from "lodash";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const userStore = useAuthStore();

export default {
  components: {
    HistoryButtons,
    ConsultDetails,
    NcmConsult,
    ModalImport,
  },
  data() {
    return {
      alertStore: useAlertStore(),
      userLogged: userStore.user.hasAuth,
      processando: false,
      tblExempCodigo: false,
      tblExempNCM: false,
      isMobile: false,
      teste: false,

      itens: [],
      resultado: [],
      itensDetalhes: [],
      objPISCOFINS: [],
      objICMS: [],
      objIPI: [],
      objPDV: [],
      objNCM: [],
      objdetalhe: {},

      cest: "",
      valor: "",
      criterios: [
        {
          tipo: "GTIN",
        },
        {
          tipo: "DESCRICAO",
        },
      ],
      criterio: "GTIN",
      ufs: [
        {
          sigla: "AC",
        },
        {
          sigla: "AL",
        },
        {
          sigla: "AM",
        },
        {
          sigla: "AP",
        },
        {
          sigla: "BA",
        },
        {
          sigla: "CE",
        },
        {
          sigla: "DF",
        },
        {
          sigla: "ES",
        },
        {
          sigla: "GO",
        },
        {
          sigla: "MA",
        },
        {
          sigla: "MG",
        },
        {
          sigla: "MS",
        },
        {
          sigla: "MT",
        },
        {
          sigla: "PA",
        },
        {
          sigla: "PB",
        },
        {
          sigla: "PE",
        },
        {
          sigla: "PI",
        },
        {
          sigla: "PR",
        },
        {
          sigla: "RJ",
        },
        {
          sigla: "RN",
        },
        {
          sigla: "RO",
        },
        {
          sigla: "RR",
        },
        {
          sigla: "RS",
        },
        {
          sigla: "SC",
        },
        {
          sigla: "SE",
        },
        {
          sigla: "SP",
        },
        {
          sigla: "TO",
        },
      ],

      tiposDescricao: [
        {
          tipo: "INICIA COM",
        },
        {
          tipo: "IGUAL",
        },
        {
          tipo: "SIMILAR",
        },
      ],
      tipoDescr: "IGUAL",

      //---------------------------------- Critérios Perfil ------------------------------
      // uf: userStore.user.profile.prfUF,
      ctribs: [
        {
          tipo: "GERAL",
        },
        {
          tipo: "SIMPLES NACIONAL",
        },
        {
          tipo: "LUCRO REAL",
        },
        {
          tipo: "LUCRO PRESUMIDO",
        },
      ],
      ctrib: helpers.DefCaracTrib(userStore.user.profile.prfTaxRegime),
      tiposCnae: [
        {
          tipo: "GERAL",
        },
        {
          tipo: "ATACADO",
        },
        {
          tipo: "CONSTRUCAO",
        },
        {
          tipo: "INDUSTRIA",
        },
        {
          tipo: "FARMA",
        },
        {
          tipo: "VAREJO",
        },
      ],
      tipoCnae: userStore.user.profile.prfTypeCnae,
      recBruta: userStore.user.profile.prfRecBruta,
      dataVigencia: new Date().toISOString().slice(0, 10),
      exIPI: "",

      //---------------------------------- Critérios Perfil ------------------------------
      simplesNacional: "Não",
      atividade: "",
      exTipi: [],
      // dias: sessionStorage.getItem("dias"),
      qtdePaginas: 0,
      pagina: 1,
      active: false,
      tipoConsulta: 0,
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

      // Consulta em Lote
      consLote: "",

      // Variáveis NCM
      ncm: "",
      consultaNCM: false,
      consultaNCMBotao: false,
      chave: 0,

      // Variáveis Lote
      emailLote: "",
      dataLote: new Date().toISOString().slice(0, 10),

      // Variável contador de consultas
      consultas: userStore.user.dataQueries.consultas,

      // Contador itens enviados
      totalEnviados: 0,
      enviadosInicial: 0,

      // Variável de controle do botão Exportar
      exportar: false,

      // Variável para verificar se é consultaLote
      consultaLoteCodigo: false,

      botoesHistorico: [],

      chaveModalImport: 0,

      auxConsLote: "",

      mostrarSimples: false,

      infoNRI: "",

      naoMostrarCFOP: true,

      mostrarAtividade: false,

      tblResultadoPrincipalMostrar: false,

      tipoExportacao: 0,
      tiposExportacao: [
        {
          tipo: 0,
          descricao: "EMAIL",
        },
        {
          tipo: 1,
          descricao: "XLSX",
        },
        {
          tipo: 2,
          descricao: "PDF",
        },
      ],
      emailUsuario: userStore.user.mail,

      notificacoes: [],
      notificacao: {},
      marcarComoLido: true,
    };
  },
  methods: {
    Consult(valor, criterio, exIPI, acessoPrincipal, cestHist) {
      this.consultaLoteCodigo = false;
      this.itens.products = [];
      this.totalEnviados = 0;
      this.enviadosInicial = 0;

      this.valor = valor;
      this.criterio = criterio;

      this.exportar = false;

      let mensagemRetorno = "";

      if (cestHist != undefined) {
        this.cest = cestHist;
      }

      if (this.cest != "") {
        if (
          !helpers.ValidaNumero(this.cest.replaceAll(".", "")) ||
          this.cest.replaceAll(".", "").length < 7
        ) {
          this.alertStore.error("CEST inválido!");
          return;
        }
      }

      // Verificar se o usuário possui permissão para utilizar o método (esquema do login único)
      let acesso = false;
      if (acessoPrincipal) {
        acesso = true;
      } else {
        acesso = helpers.VerificarAcesso(19);
        // acesso = "OK";
      }

      if (acesso) {
        this.PegarValoresPerfil();
        this.LimparListas();

        if (valor) {
          this.pagina = 1;

          let url = "";

          // Variável de controle da coluna SN
          if (this.ctrib == 2 || this.ctrib == "SIMPLES NACIONAL")
            this.simplesNacional = "Sim";
          else this.simplesNacional = "Não";

          // Variável de controle da coluna Atividade
          if (this.tipoCnae == "GERAL") this.atividade = "GERAL";
          else this.atividade = "";

          this.tipoConsulta = 1;
          this.consultaNCM = false;

          if (criterio != "NCM") url = RetUrlAPI() + "Consult";
          else {
            this.AtualizarDadosConsultaNCM(valor.trim(), exIPI);
            return;
          }

          let rootObject = this.GerarObjetoEnvio(valor.trim(), criterio);

          if (rootObject == null) return;

          this.totalEnviados = rootObject.products.length;

          this.processando = true;

          CallPostAsync("usuario", "", url, rootObject)
            .then((data) => {
              if (data != null) {
                if (!data.products) {
                  let objConfigAux = new Object();
                  objConfigAux.textoBotao = "Editar Plano";
                  objConfigAux.urlRedirect = "/pages/contratos.html?19";
                  objConfigAux.urlTarget = "_self";

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
                  } else this.alertStore.error(data);

                  mensagemRetorno = "OK";

                  this.itens.products = [];

                  return;
                }

                mensagemRetorno = "OK";

                this.consLote = "";

                data.products.forEach((element) => {
                  this.consLote += element.codImendes + "\n";
                });

                this.exportar = true;

                userStore.user.dataQueries.valorGT = valor;
                userStore.user.dataQueries.ultimoCriterio = this.criterio;
                userStore.user.dataQueries.ultimoTipoDescr = this.tipoDescr;

                // Incrementar Consultas
                this.consultas++;
                userStore.user.dataQueries.consultas = this.consultas;

                //debugger;
                this.itens = data;

                let itensLocal = JSON.stringify(data);
                userStore.user.itens = itensLocal;

                this.AtualizarDadosBotoesHistorico(valor, this.cest);

                this.processando = false;

                this.PaginarTabela();

                helpers.GravarLog(
                  "Consultou - " + criterio + " : " + valor,
                  "consultatributos.html",
                  "Consult",
                  mensagemRetorno,
                  JSON.stringify(rootObject),
                  "portal"
                );
              } else {
                this.processando = false;

                this.itens.products = [];

                mensagemRetorno = reason;

                helpers.GravarLog(
                  "Consultou - " + criterio + " : " + valor,
                  "consultatributos.html",
                  "Consult",
                  mensagemRetorno,
                  JSON.stringify(rootObject),
                  "portal"
                );

                this.alertStore.error(reason);
              }
            })
            .catch((reason) => {
              this.processando = false;

              this.itens.products = [];

              mensagemRetorno = reason;

              helpers.GravarLog(
                "Consultou - " + criterio + " : " + valor,
                "consultatributos.html",
                "Consult",
                mensagemRetorno,
                JSON.stringify(rootObject),
                "portal"
              );

              this.alertStore.error(reason);
            });
        } else {
          var valor = document.getElementById("valor" + criterio);

          valor.focus();
        }
      } else {
        Swal.fire({
          position: "center",
          title: "Novo acesso detectado",
          text: "Verificamos que sua conta teve um novo acesso, para sua segurança vamos te deslogar, favor entrar em contato com nosso suporte no chat inicial!",
          icon: "warning",
          confirmButtonText: "OK",
          heightAuto: false,
        }).then((result) => {
          if (result.value) {
            window.location.href = "/index.html";
          }
        });
      }
    },
    ConsultaLoteCodigo(txtLote, dataLote, emailLote) {
      this.consLote = txtLote;
      this.auxConsLote = txtLote;

      let mensagemRetorno = "";
      this.itens = [];
      this.pagina = 1;

      this.consultaNCM = false;

      this.PegarValoresPerfil();

      // Variável de controle da coluna Atividade
      if (this.tipoCnae == "GERAL") {
        this.atividade = "GERAL";
        this.mostrarAtividade = true;
      } else {
        this.atividade = "";
        this.mostrarAtividade = false;
      }

      let url = RetUrlAPI() + "Consult";
      let rootObject = new Object();
      let cHeader = new Object();
      let aProdutos = [];

      // Populando a lista de Produtos para Consulta
      try {
        if (txtLote.length <= 0) {
          this.alertStore.error(
            "Nenhuma informação foi inserida para pesquisa."
          );
          return;
        }

        var linhaTexto = txtLote;
        var linhasDoTexto = linhaTexto.split("\n");

        this.enviadosInicial = linhasDoTexto.length;

        // Remover itens duplicados
        linhasDoTexto = linhasDoTexto.filter(function (elem, pos, self) {
          return self.indexOf(elem) == pos;
        });

        // Remover itens caso haja mais de 1000 Códigos
        if (linhasDoTexto.length > 1000) linhasDoTexto.splice(1000);

        linhasDoTexto.forEach(function (linha) {
          let objProduto = new Object();
          objProduto.code = linha.trim();

          aProdutos.push(objProduto);
        });

        //----------------------------------------------------------------------
        // HEADER - Criando
        cHeader.uf = this.uf;
        cHeader.taxRegime = this.ctrib;
        cHeader.taxRegimeType = helpers.DefinirCTRibEnumGT(this.ctrib);
        cHeader.activity = this.tipoCnae;
        cHeader.consultType = 1;
        cHeader.batch = true;
        cHeader.token = userStore.user.tokenSession;
        cHeader.email = userStore.user.mail;
        cHeader.clientStatus = userStore.user.userStatus;
        cHeader.clientCnpjCpf = userStore.user.clientCnpjCpf;

        cHeader.clientBehavior = userStore.user.clientBehavior;
        cHeader.partnerBehavior = userStore.user.partnerBehavior;
        cHeader.company = userStore.user.company;
        cHeader.userID = userStore.user.userId;

        cHeader.managerId = userStore.user.idGestor;
        cHeader.managerEmail = userStore.user.emailGestor;

        cHeader.method = "GTCONSULTA_LOTE";
        cHeader.requestSource = "PORTAL";
        cHeader.userLogged = false;

        if (userStore.user.hasAuth) {
          cHeader.userLogged = userStore.user.hasAuth;
        }

        if (userStore.user.dataQueries.dadosLote == true) {
          cHeader.emailExport = this.emailLote;
          cHeader.validity = userStore.user.dataQueries.dataLote;
        } else {
          cHeader.validity = this.dataVigencia;
          cHeader.emailExport = userStore.user.mail;
        }

        //----------------------------------------------------------------------
        // Construindo o objeto de Consumo
        rootObject.header = cHeader;
        rootObject.products = aProdutos;

        this.processando = true;

        this.totalEnviados = rootObject.products.length;

        //----------------------------------------------------------------------
        // Consume API
        CallPostAsync("usuario", "", url, rootObject)
          .then((data) => {
            if (data != null) {
              this.consultaLoteCodigo = true;

              // Incrementar Consultas
              this.consultas++;
              userStore.user.dataQueries.consultas = this.consultas;

              //--- START TESTE ---------------

              if (!data.products) {
                let objConfigAux = new Object();
                objConfigAux.textoBotao = "Editar Plano";
                objConfigAux.urlRedirect = "/pages/contratos.html?19";
                objConfigAux.urlTarget = "_self";

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
                } else this.alertStore.error(data);

                mensagemRetorno = "OK";

                this.itens.products = [];

                return;
              }

              //--- END TESTE -----------------

              this.itens = data;

              let itensLocal = JSON.stringify(data);
              userStore.user.itens = itensLocal;

              this.processando = false;
              this.tipoConsulta = 4;
              this.PaginarTabela();

              if (this.itens.products.length > 0) this.exportar = true;
              else this.exportar = false;

              mensagemRetorno = "OK";

              this.consLote = "";

              data.products.forEach((element) => {
                this.consLote +=
                  element.codImendes +
                  ";" +
                  element.icms.codRegra +
                  ";" +
                  element.icms.codExcecao +
                  "\n";
              });

              userStore.user.dataQueries.ultimoCriterio = this.criterio;

              helpers.GravarLog(
                "Consultou em lote:",
                "consultatributos.html",
                "ConsultaLoteCodigo",
                mensagemRetorno,
                JSON.stringify(rootObject),
                "portal"
              );

              this.alertStore.success("Consulta em lote finalizada.");
            } else {
              this.alertStore.error(data.message);

              this.exportar = false;

              mensagemRetorno = data.message;

              helpers.GravarLog(
                "Consulou em lote:",
                "consultatributos.html",
                "ConsultaLoteCodigo",
                mensagemRetorno,
                JSON.stringify(rootObject),
                "portal"
              );

              this.processando = false;
            }
          })
          .catch((reason) => {
            mensagemRetorno =
              "Não foi possível estabelecer conexão com o servidor.";

            this.exportar = false;

            this.alertStore.error(mensagemRetorno);

            helpers.GravarLog(
              "Consultou em lote:",
              "consultatributos.html",
              "ConsultaLoteCodigo",
              mensagemRetorno,
              JSON.stringify(rootObject),
              "portal"
            );

            this.processando = false;
          });
      } catch (error) {
        mensagemRetorno =
          "Erro ao formar lista de retorno para Consulta de Produtos em Lote.";

        this.exportar = false;

        this.alertStore.error(mensagemRetorno);

        helpers.GravarLog(
          "Consultou em lote:",
          "consultatributos.html",
          "ConsultaLoteCodigo",
          mensagemRetorno,
          JSON.stringify(rootObject),
          "portal"
        );

        this.processando = false;
      }
      //-----------------------------------------------------------------------------------------------------------------------------------------------------------
    },
    ConsultaLoteNCM(txtLote) {
      this.consLote = txtLote;
      this.auxConsLote = txtLote;

      this.tipoConsulta = 5;
      this.chave++;
      this.consultaNCM = true;
    },
    GerarObjetoEnvio(
      valor,
      criterio,
      txtLote,
      tipoConsulta,
      codRegra,
      codExcecao
    ) {
      let rootObject = new Object();
      let cHeader = new Object();
      let aProdutos = [];

      // Populando a lista de Produtos para Consulta
      try {
        let objProduto = new Object();

        cHeader.clientBehavior = userStore.user.clientBehavior;
        cHeader.partnerBehavior = userStore.user.partnerBehavior;
        cHeader.clientStatus = userStore.user.clientStatus;
        cHeader.clientCnpjCpf = userStore.user.clientCnpjCpf;
        cHeader.userID = userStore.user.userId;
        cHeader.specialRegime = userStore.user.profile.prfSpecialRegime;

        cHeader.managerId = userStore.user.idGestor;
        cHeader.managerEmail = userStore.user.emailGestor;

        cHeader.method = "GTCONSULTA_INDIVIDUAL";
        cHeader.requestSource = "PORTAL";
        cHeader.userLogged = false;

        if (userStore.user.hasAuth) {
          cHeader.userLogged = userStore.user.hasAuth;
        }

        switch (criterio) {
          case "GTIN":
            objProduto.code = valor;
            cHeader.consultType = 1;
            cHeader.batch = false;
            break;
          case "DESCRICAO":
            objProduto.description = valor;
            objProduto.cest = this.cest.replaceAll(".", "");
            cHeader.consultType = 3;
            cHeader.batch = false;
            if (this.tipoDescr == "INICIA COM") {
              cHeader.consultTypeFilter = 1;
            } else if (this.tipoDescr == "IGUAL") {
              cHeader.consultTypeFilter = 2;
            } else {
              cHeader.consultTypeFilter = 3;
            }
            break;
          case "CODIMENDES":
            objProduto.code = valor;
            objProduto.ruleCode = codRegra;
            objProduto.exceptionCode = codExcecao;
            cHeader.consultType = 2;
            cHeader.batch = false;
            break;
          case "LOTE":
            objProduto.code = valor;
            cHeader.consultType = 2;
            cHeader.batch = true;
            cHeader.method = "GTCONSULTA_LOTE";
            break;
        }

        if (!txtLote) {
          aProdutos.push(objProduto);
          cHeader.validity = this.dataVigencia;
        } else {
          var linhaTexto = txtLote;
          var linhasDoTexto = linhaTexto.split("\n");

          this.enviadosInicial = linhasDoTexto.length;

          // Remover itens repetidos
          linhasDoTexto = linhasDoTexto.filter(function (elem, pos, self) {
            return self.indexOf(elem) == pos;
          });

          // Remover itens caso haja mais de 1000 Códigos
          if (linhasDoTexto.length > 1000) linhasDoTexto.splice(1000);

          linhasDoTexto.forEach(function (linha) {
            let objProduto = new Object();

            let itensAux = linha.split(";");

            if (linha.length > 1) {
              objProduto.code = itensAux[0]; // Código IMendes
              objProduto.ruleCode = itensAux[1]; // Código da Regra Estadual
              objProduto.exceptionCode = itensAux[2]; // Código da Exceção
            } else {
              objProduto.code = linha.replace("\r", "");
            }

            aProdutos.push(objProduto);
          });

          // Verificar se a data de vigência é a do perfil ou a definida na consulta em lote
          if (userStore.user.dataQueries.dadosLote && tipoConsulta == 4)
            cHeader.validity = userStore.user.dataQueries.dataLote;
          else cHeader.validity = this.dataVigencia;
        }

        // HEADER - Criando
        cHeader.uf = this.uf;
        cHeader.email = userStore.user.mail;
        cHeader.company = userStore.user.company;

        cHeader.emailExport = this.emailUsuario;

        this.ctrib = userStore.user.profile.prfTaxRegime;

        cHeader.taxRegimeType = helpers.DefinirCTRibEnumGT(this.ctrib);

        if (this.ctrib == 3) this.ctrib = 1;

        // Mostrar coluna Atividade somente quando o perfil for GERAL
        if (this.tipoCnae == "GERAL") this.mostrarAtividade = true;
        else this.mostrarAtividade = false;

        cHeader.taxRegime = this.ctrib;
        cHeader.activity = this.tipoCnae;
        cHeader.token = userStore.user.tokenSession;

        // Construindo o objeto de Consumo
        rootObject.header = cHeader;
        rootObject.products = aProdutos;

        return rootObject;
      } catch (error) {
        this.alertStore.error(
          "Erro ao formar lista de retorno para Consulta de Produtos em Lote."
        );

        return null;
      }
    },
    AtualizarDadosConsultaNCM(ncm, exIPI) {
      this.ncm = ncm.trim().replaceAll(".", "");
      this.exIPI = exIPI;
      this.chave++;
      this.consultaNCM = true;
      this.tipoConsulta = 2;
    },
    DescricaoTxtValor(criterio) {
      switch (criterio) {
        case "GTIN":
          return "o código";
        case "CODIGO":
          return "o código";
        case "DESCRICAO":
          return "a descrição";
        case "NCM":
          return "a NCM";
      }
    },
    RetornarAmparoLegal(index) {
      let amparos = this.itens.products[index].icms.lawGrounds;
      let retorno = "";

      if (amparos != undefined) {
        amparos.forEach((element) => {
          retorno += element.description;
        });
      }

      return retorno;
    },
    PegarValoresPerfil() {
      this.recBruta = userStore.user.profile.prfRecBruta;
      this.uf = userStore.user.profile.prfUF;
      this.ctrib = userStore.user.profile.prfTaxRegime;
      this.tipoCnae = userStore.user.profile.prfTypeCnae;

      if (userStore.user.profile.prfValidity)
        this.dataVigencia = userStore.user.profile.prfValidity;
    },
    LimparListas() {
      this.objPISCOFINS = [];
      this.objICMS = [];
      this.objIPI = [];
      this.objPDV = [];
      this.objNCM = [];
    },
    // Histórico
    AtualizarDadosBotoesHistorico(val, cest) {
      let item = _.find(this.botoesHistorico, function (aux) {
        return aux.key === "btn" + val;
      });

      if (item) {
        item.valor = val;
        item.cest = cest;
      } else {
        this.botoesHistorico.push({
          key: "btn" + val,
          valor: val,
          cest: cest,
        });
      }

      userStore.user.historic = JSON.stringify(this.botoesHistorico);
    },
    LerHistoricoPesquisa() {
      if (!userStore.user.historic) return;

      let sessionHistoric = JSON.parse(userStore.user.historic);

      this.botoesHistorico = [];

      sessionHistoric.forEach((item) => {
        this.botoesHistorico.push(item);
      });
    },
    ExcluirComponente(key) {
      this.botoesHistorico = _.remove(this.botoesHistorico, function (n) {
        return n.key != key;
      });
      userStore.user.historic = JSON.stringify(this.botoesHistorico);
    },
    ExportarAlterado(item, ncmIndividual) {
      if (ncmIndividual != "")
        this.AtualizarDadosBotoesHistorico(ncmIndividual);

      this.exportar = item;
      userStore.user.dataQueries.ultimoCriterio = this.criterio;

      this.tipoExportacao = 0;
    },
    ConsultDetails(
      codIMendes,
      ctrib,
      tipoCnae,
      atividade,
      codBarras,
      codRegra,
      codExcecao
    ) {
      this.consultaLoteCodigo = false;

      let mensagemRetorno = "";
      let ctrib_temp = "";

      try {
        ctrib_temp = userStore.user.profile.prfTaxRegime;

        if (ctrib_temp == "2") {
          ctrib = ctrib_temp;
        }
      } catch (error) {
        ctrib_temp = "";
      }

      this.ctrib = ctrib;

      this.tipoCnae = tipoCnae;

      let rootObject = this.GerarObjetoEnvio(
        codIMendes,
        "CODIMENDES",
        null,
        null,
        codRegra,
        codExcecao
      );

      if (rootObject == null) return;

      let url = RetUrlAPI() + "ConsultDetails";

      this.processando = true;

      this.LimparListas();

      CallPostAsync("usuario", "", url, rootObject)
        .then((data) => {
          if (data != null) {
            this.itensDetalhes = data;

            this.LimparListas();

            mensagemRetorno = "";

            helpers.GravarLog(
              "Consultou - GTIN : " + codBarras,
              "consultatributos.html",
              "ConsultDetails",
              mensagemRetorno,
              JSON.stringify(rootObject),
              "portal"
            );

            // Caso tenha mais de uma regra, verificar se tem a regra que foi especificada e trazer a exata
            if (data.products.length > 0) {
              let auxProducts = data.products.filter(function (obj) {
                return obj.atividade == atividade;
              });

              if (auxProducts.length > 0) data.products = auxProducts;
            }

            if (data.products[0]) {
              // Incrementar Consultas
              this.consultas++;
              userStore.user.dataQueries.consultas = this.consultas;

              this.objPISCOFINS.push(data.products[0].pisCofins);
              this.objICMS.push(data.products[0].icms);
              this.objIPI.push(data.products[0].ipi);
              this.objPDV.push(data.products[0].pdv);

              this.objdetalhe = data.products[0];

              mensagemRetorno = "OK";

              $("#modalDdetalhesNcm").modal({
                show: true,
                backdrop: "static",
                keyboard: false,
              });
            }

            this.processando = false;
          }
        })
        .catch((reason) => {
          this.processando = false;

          mensagemRetorno = reason;

          helpers.GravarLog(
            "Consultou - GTIN : " + codBarras,
            "consultatributos.html",
            "ConsultDetails",
            mensagemRetorno,
            JSON.stringify(rootObject),
            "portal"
          );

          this.alertStore.error(reason);
        });
    },

    LimparCamposCriterio(criterio) {
      if (criterio != "DESRICAO") {
        this.cest = "";
      }
    },

    MostrarSimplesNacional(res) {
      // Buscar Regras SN
      if (res.find((x) => x.caracTrib == "2") != undefined) {
        this.mostrarSimples = true;
        return;
      }

      this.mostrarSimples = false;
    },

    PaginarTabela() {
      let tamanhoTotal = this.itens.products.length;

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

      this.MostrarSimplesNacional(this.resultado);

      return this.resultado;
    },

    RemoverResiduos(descricao) {
      return helpers.RemoverResiduos(descricao);
    },

    MascaraNCM(ncm) {
      return helpers.MascaraNCM(ncm);
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
            this.infoNRI = `${data.code} - ${data.description}`;
            $("#modalNRI").modal({
              show: true,
              backdrop: "static",
              keyboard: false,
            });

            this.processando = false;
          } else {
            this.processando = false;
            this.alertStore.error(
              "Ocorreu um erro ao buscar descrição, tente novamente!"
            );
          }
        })
        .catch((reason) => {
          this.processando = false;
        });
    },

    /* Exportação */

    RetornarExportacao() {
      switch (this.tipoExportacao) {
        case 0:
          this.EnviarEmailExportacao();
          break;
        case 1:
          this.ExportarXLSXDownload("tblResultadoPrincipal");
          break;
        case 2:
          this.GerarPDF();
          break;
      }
    },

    GerarPDF() {
      // Inicializar o documento a ser exportado (PDF)
      // let jsPDF = window.jspdf.jsPDF;
      var doc = new jsPDF("l", "pt", "a4");

      // Obter Cabecalho e Corpo da Tabela Resultante
      let dadosTabela = this.DadosTabelaPDF();

      // Adicionar as informações no PDF
      this.AdicionarDadosPDF(doc, dadosTabela);

      // Utilizado para pegar os segundos e milisegundos
      let now = new Date();

      doc.save(
        `GT_Consulta_${helpers
          .HoraAtual(false)
          .replaceAll("/", "_")}_${now.getSeconds()}_${now.getMilliseconds()}`
      );
    },

    /** Método para gerar CABECALHO e CORPO da tabela */
    DadosTabelaPDF() {
      let DadosTabela = new Object();
      let valores = [];
      let amparoLegal;

      // Percorrer produtos para preencher valores
      this.itens.products.forEach((element) => {
        amparoLegal = "";

        if (element.icms.lawGrounds != undefined) {
          element.icms.lawGrounds.forEach((element) => {
            amparoLegal += element.description;
          });
        }

        valores.push([
          element.atividade,
          this.SimplesNacional(element.caracTrib),
          element.codBarras,
          this.RemoverResiduos(element.descricao),
          element.pisCofins.ncm,
          element.pisCofins.cest,
          element.pisCofins.cstSai,
          element.pisCofins.natRec,
          element.icms.cstCsosn,
          element.icms.adRemICMS,
          element.icms.aliqIcms.toFixed(2),
          element.icms.redBcIcms.toFixed(2),
          element.icms.iva.toFixed(2),
          amparoLegal,
        ]);
      });

      // Preencher ifnormações do Objeto DadosTabela
      DadosTabela.corpo = valores;
      DadosTabela.cabecalho = [
        [
          "Atividade",
          "Simples Nacional",
          "Código",
          "Descrição",
          "NCM",
          "CEST",
          "PIS e COFINS",
          "NRI",
          "CST ICMS | CSOSN",
          "AD REM ICMS",
          "ICMS(%)",
          "REDUÇÃO ICMS(%)",
          "IVA(%)",
          "Amparo Legal",
        ],
      ];

      // Remover Coluna Atividade se o perfil não for GERAL
      if (!this.mostrarAtividade) {
        DadosTabela.cabecalho[0].splice(0, 1);

        valores.forEach((element) => {
          element.splice(0, 1);
        });
      }

      // Remover Coluna Simples Nacional, caso a linha não seja do tipo SN
      if (!this.mostrarSimples) {
        if (this.mostrarAtividade) DadosTabela.cabecalho[0].splice(1, 1);
        else DadosTabela.cabecalho[0].splice(0, 1);

        valores.forEach((element) => {
          if (this.mostrarAtividade) element.splice(1, 1);
          else element.splice(0, 1);
        });
      }

      return DadosTabela;
    },

    AdicionarDadosPDF(doc, dadosTabela) {
      let retornados = this.itens.products.length;
      let imageData =
        "data:@file/png;base64, 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";
      let vigencia = this.dataVigencia;
      let columns = new Object();

      columns = {
        0: {
          halign: "center",
        },
        1: {
          halign: "center",
        },
        2: {
          halign: "center",
        },
        3: {
          halign: "left",
        },
        4: {
          halign: "center",
        },
        5: {
          halign: "center",
        },
        6: {
          halign: "center",
        },
        7: {
          halign: "center",
        },
        8: {
          halign: "center",
        },
        9: {
          halign: "right",
        },
        10: {
          halign: "right",
        },
        11: {
          halign: "right",
        },
        12: {
          halign: "left",
        },
      };

      if (!this.mostrarSimples) {
        columns[8].halign = "right";
        columns[11].halign = "left";
        delete columns[12];
      }

      if (!this.mostrarAtividade) {
        if (columns[12] != undefined) {
          columns[10].halign = "right";
          columns[11].halign = "left";
          delete columns[12];
        } else {
          columns[7].halign = "right";
          columns[9].halign = "right";
          columns[10].halign = "left";
          delete columns[11];
        }
      }

      // Adicionar uma tabela simples
      doc.autoTable({
        styles: {
          fontSize: 6,
        },
        headStyles: {
          fillColor: [37, 50, 74],
          halign: "center",
        },
        startY: 120,
        head: dadosTabela.cabecalho,
        body: dadosTabela.corpo,
        theme: "striped",
        showHead: "everyPage",
        columnStyles: columns,
        didDrawPage: function (data) {
          // Header
          if (data.pageNumber == 1) {
            doc.setFillColor(37, 50, 74);
            doc.rect(0, 0, 1000, 85, "F");
            doc.addImage(imageData, "PNG", 30, 20, 130, 40);
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7);
            doc.text(
              `CNPJ: ${userStore.user.clientCNPJCPF} - ${userStore.user.company}`,
              640,
              25
            );
            doc.text(
              `Atividade: ${userStore.user.profile.prfTypeCnae}`,
              640,
              35
            );
            doc.text(
              `Regime Tributário: ${helpers.DefCaracTrib(
                userStore.user.profile.prfTaxRegime
              )}`,
              640,
              45
            );
            doc.text(`UF: ${userStore.user.profile.prfUF}`, 640, 55);
            doc.text(`Vigência: ${helpers.ConverterDataBr(vigencia)}`, 640, 65);
            doc.setTextColor(37, 50, 74);
            doc.text(`Itens Retornados: ${retornados}`, 735, 110);
          }
        },
      });

      this.AdicionarRodapePDF(doc);
    },

    AdicionarRodapePDF(doc) {
      // jsPDF 1.4+ uses getWidth, <1.4 uses .width
      var pageSize = doc.internal.pageSize;
      var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();

      let imageTimbrado =
        "data:@file/png;base64,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";

      doc.addImage(
        imageTimbrado,
        "PNG",
        0,
        pageHeight - 125,
        pageSize.width,
        180
      );
    },

    GerarObjetoEnvioNCMExportacao() {
      let rootObject = new Object();
      let ncms = [];
      let codigo = "";
      let ex = "";
      let data = "";

      // NCM Individual
      if (this.tipoConsulta == 2) {
        let objNCM = new Object();

        objNCM.code = this.valor;
        objNCM.ex = this.exIPI;
        // objNCM.validity = this.dataVigencia;

        ncms.push(objNCM);
      } else {
        //let linhaTexto = this.consLote;
        let linhaTexto = this.auxConsLote;
        let linhasDoTexto = linhaTexto.split("\n");

        // Remover itens repetidos
        linhasDoTexto = linhasDoTexto.filter(function (elem, pos, self) {
          return self.indexOf(elem) == pos;
        });

        // Remover itens caso haja mais de 1000 NCMs
        if (linhasDoTexto.length > 1000)
          linhasDoTexto = linhasDoTexto.splice(1000);

        if (userStore.user.dataQueries.dadosLote == true) {
          data = userStore.user.dataQueries.dataLote;
        } else {
          data = this.dataVigencia;
        }

        linhasDoTexto.forEach(function (linha) {
          let objNCM = new Object();
          if (linha.includes(";")) {
            objNCM.code = linha.substring(0, linha.indexOf(";"));
            objNCM.ex = linha.substring(linha.indexOf(";") + 1, linha.length);
          } else {
            objNCM.code = linha;
            objNCM.ex = "";
          }
          // objNCM.validity = data;
          ncms.push(objNCM);
        });
      }

      rootObject.nCms = ncms;
      rootObject.email = userStore.user.mail;
      rootObject.clientStatus = userStore.user.userStatus;
      rootObject.clientCnpjCpf = userStore.user.clientCNPJCPF;
      // Novos Campos
      rootObject.uf = this.uf;
      rootObject.taxRegime = this.ctrib;
      rootObject.taxRegimeType = helpers.DefinirCTRibEnumGT(this.ctrib);
      rootObject.activity = this.tipoCnae;
      rootObject.company = userStore.user.company;
      rootObject.emailExport = this.emailUsuario;
      rootObject.validity = data;

      return rootObject;
    },

    ChamarModalConsultaLote() {
      this.teste = true;
      this.chaveModalImport++;
      this.consultaLoteCodigo = false;
      this.consLote = "";
      this.emailLote = "";
      this.dataLote = new Date().toISOString().slice(0, 10);
    },

    ExportarXLSXDownload(idTabela) {
      this.ApresentarAtividadeXLSX();
      helpers.GerarPlanilhaXLSXCSV(idTabela, "Exportação GT Consulta", "xlsx");
    },

    ApresentarAtividadeXLSX() {
      let tdAtividade = document.getElementsByName("tdAtividade");
      let thAtividade = document.getElementsByName("thAtividade");

      thAtividade[0].classList = [];

      tdAtividade.forEach((td) => {
        td.classList = [];
      });

      if (!this.mostrarAtividade) {
        thAtividade[0].classList.add("tableexport-ignore");

        tdAtividade.forEach((td) => {
          td.classList.add("tableexport-ignore");
        });
      }
    },

    EnviarEmailExportacao() {
      if (helpers.VerificarEmail(this.emailUsuario)) {
        if (this.emailUsuario != userStore.user.mail)
          this.emailLote = this.emailUsuario;

        $("#modalExportacao").modal("hide");

        this.ExportarResultado(this.tipoConsulta);
      } else {
        this.alertStore.error("Email inválido!");
      }
    },

    ExportarResultado(tipo) {
      this.PegarValoresPerfil();

      let mensagemRetorno = "";
      let rootObject = new Object();
      let url = "";
      let consultaTipo = "";

      this.consLote = "";

      if (!this.itens.products) this.itens.products = [];

      this.itens.products.forEach((element) => {
        this.consLote +=
          element.codImendes +
          ";" +
          element.icms.codRegra +
          ";" +
          element.icms.codExcecao +
          "\n";
      });

      // Código ou Descrição
      if (tipo == 1 || tipo == 4) {
        if (tipo == 1) {
          if (this.criterio == "GTIN") {
            consultaTipo = "GTIN INDIVIDUAL";
          } else {
            consultaTipo = "Descrição INDIVIDUAL";
          }

          rootObject = this.GerarObjetoEnvio(
            "",
            "LOTE",
            this.consLote.trim(),
            tipo
          );
        } else {
          consultaTipo = "Código LOTE";
          rootObject = this.GerarObjetoEnvio(
            "",
            "LOTE",
            this.consLote.trim(),
            tipo
          );
        }

        if (rootObject == null) return;

        url = RetUrlAPI() + "ExportProducts";
      }
      // NCM
      else {
        if (tipo == 2) consultaTipo = "NCM INDIVIDUAL";
        else consultaTipo = "NCM LOTE";

        rootObject = this.GerarObjetoEnvioNCMExportacao();

        url = RetUrlAPI() + "ExportProductsNCM";
      }

      this.alertStore.success(
        "Logo você receberá um email com o arquivo de exportação!"
      );

      CallPostAsync("usuario", "", url, rootObject)
        .then((data) => {
          if (data != null) {
            this.processando = false;

            mensagemRetorno = "OK";

            helpers.GravarLog(
              "Exportou resultado consulta (" + consultaTipo + ")",
              "consultatributos.html",
              "ExportProducts",
              mensagemRetorno,
              JSON.stringify(rootObject),
              "portal"
            );
          } else {
            this.processando = false;

            mensagemRetorno = reason;

            helpers.GravarLog(
              "Exportou resultado consulta (" + consultaTipo + ")",
              "consultatributos.html",
              "ExportProducts",
              mensagemRetorno,
              JSON.stringify(rootObject),
              "portal"
            );

            this.alertStore.error(reason);
          }
        })
        .catch((reason) => {
          this.processando = false;

          mensagemRetorno = reason;

          helpers.GravarLog(
            "Exportou resultado consulta lote (" + consultaTipo + ")",
            "consultatributos.html",
            "ExportProducts",
            mensagemRetorno,
            JSON.stringify(rootObject),
            "portal"
          );

          this.alertStore.error(reason);
        });
    },

    SimplesNacional(ctrib) {
      if (ctrib == "2") return "Sim";
      else return "Não";
    },

    SetupPesqDescricao() {
      try {
        let mainSearch = new Object();
        mainSearch = JSON.parse(userStore.user.mainSearch);

        if (mainSearch != "") {
          this.criterio = mainSearch.type;
          this.valor = mainSearch.text;

          this.Consult(this.valor, this.criterio, "", true);

          userStore.user.mainSearch = JSON.stringify("");
        }
      } catch (error) {
        this.alertStore.error(error);
      }
    },
  },
  created() {
    if (userStore.user.hasAuth) {
      this.criterios.push({
        tipo: "NCM",
      });
    }
  },
  mounted() {
    if (userStore.user.mainSearch) this.SetupPesqDescricao();
    this.LerHistoricoPesquisa();
  },
  computed: {
    Paginar() {
      if (this.itens.products) {
        return this.Paginacao(this.itens.products);
      }
    },

    ListaHistorico() {
      this.LerHistoricoPesquisa();
      return this.botoesHistorico;
    },
  },
  watch: {
    // Verificar se a pagina é menor que a quantidade total, ou se a página é igua a '...'
    pagina: function (newPage, lastPage) {
      if (newPage == "..." || newPage > this.qtdePaginas)
        this.pagina = lastPage;
    },
  },
};
</script>

<style lang="less">
.btn-lote {
  text-decoration: underline;
  color: @primaryBlue;
}
</style>
