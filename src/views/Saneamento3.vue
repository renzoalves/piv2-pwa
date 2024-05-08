<template>
  <div v-if="processando" id="loading">
    <img id="loading-image" src="@/assets/images/processando.gif" />
  </div>

  <div class="row">
    <div class="col-md-12">
      <h1>{{ tipoPessoa }}</h1>
      <div class="card">
        <div class="row">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2">
                <label for="cbUfModalLote"
                  >UF
                  <i
                    class="fas fa-info-circle mr-2"
                    title="Escolha mais de uma UF se necessário"
                    style="color: steelblue"
                  ></i>

                  <label for="chkTodasUFs">Todas: </label>
                  <input
                    class="mt-2 ml-2 mr-2"
                    type="checkbox"
                    id="chkTodasUFs"
                    v-model="marcarTodasUfs"
                    v-on:click="MarcarTodasUFs()"
                  />
                </label>

                <div id="divUfsLote">
                  <div v-for="(item, index) in ufsModalLote" :key="item">
                    <label for="item.sigla" class="corLabelCombo">{{
                      item.sigla
                    }}</label>
                    <input
                      class="ml-2 mr-2"
                      type="checkbox"
                      v-bind:id="'chk' + item.sigla"
                      v-bind:name="item.sigla"
                      v-bind:checked="item.checado"
                      v-on:click="ChecarLstUFsLote(index, 'chk' + item.sigla)"
                    />
                  </div>
                </div>
              </div>

              <div class="col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2">
                <label for="selectCFOP">CFOP</label>
                <select
                  id="selectCFOP"
                  class="form-control form-control-sm"
                  v-model="cfop"
                  @change="DefineCFOP(cfop.substring(0, 1))"
                >
                  <option
                    v-for="item in cfops"
                    :key="item.tipo"
                    :value="item.tipo"
                  >
                    {{ item.descricao }}
                  </option>
                </select>
              </div>

              <div
                class="col-sm-12 col-md-6 col-lg-2 col-xl-2 mb-2"
                v-if="digitarCfopManual"
              >
                <label for="cfop">Digite o CFOP:</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="cfopManual"
                  id="cfop"
                  v-on:blur="
                    DefineTipoPessoa(cfopManual.toString().substring(0, 1))
                  "
                />
              </div>

              <div
                :class="
                  digitarCfopManual
                    ? 'col-sm-12 col-md-6 col-lg-3 col-xl-3 mb-2'
                    : 'col-sm-12 col-md-12 col-lg-3 col-xl-3 mb-2'
                "
              >
                <label for="cbCaracTrib"
                  >Característica Tributária
                  <i
                    class="fas fa-info-circle"
                    title="do Remetente/Destinatário."
                    style="color: steelblue"
                  ></i
                ></label>
                <select
                  class="form-control form-control-sm"
                  v-model="caracTrib"
                  name="cbCaracTrib"
                >
                  <option
                    v-for="(item, index) in caracTrib_"
                    v-bind:key="index"
                    v-bind:value="item.value"
                    v-on:click="InformacaoSimples(caracTrib)"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>

              <div class="col-md-12 col-md-6 col-lg-2 col-xl-2 mb-2">
                <label for="cbSubstICMSRemDest">Subst. ICMS</label>
                <select
                  class="form-control form-control-sm"
                  v-model="substICMSRemDest"
                  name="cbSubstICMSRemDest"
                >
                  <option
                    v-for="(item, index) in substICMSRemDest_"
                    v-bind:key="index"
                    v-bind:value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>
            </div>

            <div class="row">
              <!-- <div class="col-sm-4 col-md-4 col-lg-2 col-xl-2">
                            <input class="mt-2 mr-2" type="checkbox" id="chkTodasUFs" v-model="marcarTodasUfs" v-on:click="MarcarTodasUFs()" />
                            <label for="chkTodasUFs">Marcar todas UFs</label>
                        </div> -->
              <div
                class="col-sm-6 col-md-6 col-lg-2 col-xl-2 mb-2"
                v-if="mostrarSimples"
              >
                <label for="cbSimples">Simples Nacional</label>
                <select
                  class="form-control form-control-sm"
                  v-model="simples"
                  name="simples"
                >
                  <option
                    v-for="(item, index) in simplesNac"
                    v-bind:key="index"
                    v-bind:value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>

              <div class="col-sm-6 col-md-6 col-lg-3 col-xl-3 mb-2">
                <label for="cbFinalidade">Finalidade</label>
                <select
                  class="form-control form-control-sm"
                  v-model="finalidade"
                  name="finalidade"
                >
                  <option
                    v-for="(item, index) in finalidade_"
                    v-bind:key="index"
                    v-bind:value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>

              <div class="col-sm-12 col-md-12 col-lg-7 col-xl-7 mb-2">
                <label for="cbOrigem">Origem</label>
                <select
                  class="form-control form-control-sm"
                  v-model="origem"
                  name="origem"
                >
                  <option
                    v-for="(item, index) in origem_"
                    v-bind:key="index"
                    v-bind:value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row mt-4">
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
    <div class="col-md-2 mb-2" v-if="criterio == 'DESCRICAO'">
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
    <div class="col-md-1 mb-2" v-if="criterio == 'NCM'">
      <input
        type="text"
        class="form-control form-control-sm"
        v-model="exIPI"
        id="exIPI"
        maxlength="2"
        placeholder="Ex. IPI"
      />
    </div>
    <div class="col-md-3 mb-2">
      <input
        class="form-control form-control-sm valor"
        v-model="valor"
        id="valor"
        v-bind:placeholder="'Informe ' + DescricaoTxtValor(criterio)"
        v-on:blur="BuscarDescricao(valor)"
      />
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
    <div class="col-md-3" v-if="criterio == 'GTIN'">
      <input
        class="form-control form-control-sm valor"
        v-model="descricao"
        id="descricao"
        disabled
        placeholder="Descrição"
      />
    </div>
    <div class="col-md-2">
      <button
        class="geral-button"
        @click="BuscarDadosConsultas(valor, criterio)"
      >
        Consultar
      </button>
    </div>
    <div
      class="col-md-2 ml-auto mt-2 text-right"
      v-if="criterio == 'GTIN' && userLogged"
    >
      <a
        href=""
        class="btn-lote"
        data-toggle="modal"
        data-target="#modalConsultaLote"
        @click="VerificarTipoConsulta()"
        >Consultar em lote</a
      >
    </div>
  </div>

  <div id="divHistorico">
    <div class="d-inline" v-for="item in ListaHistorico" :key="item.chave">
      <HistoryButtons
        @excluir-elemento="ExcluirComponente"
        @consult="BuscarDadosConsultas"
        v-bind:key="item.chave"
        v-bind:valor="item.valor"
      />
    </div>
  </div>

  <div class="row">
    <div class="col-md-12 mt-2">
      <div class="row">
        <div class="col-md-11 float-right">
          <p class="mt-3" v-if="principal != undefined" style="color: dimgray">
            <span v-if="principal.length > 1">
              Itens Retornados: {{ principal.length }}
            </span>
          </p>
        </div>

        <div class="col-md-1 float-right mb-1 mt-2">
          <select
            class="form-control form-control-sm"
            v-model="limite"
            v-if="principal.length > 10"
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
        v-show="false"
      >
        <thead>
          <tr>
            <th class="fontSteel">Código</th>
            <th class="fontSteel">Descrição</th>
            <th class="fontSteel">UF</th>
            <th class="fontSteel">NCM</th>
            <th class="fontSteel">CEST</th>
            <th class="fontSteel">PIS e COFINS</th>
            <th class="fontSteel">CFOP</th>
            <th class="fontSteel">CST ICMS | CSOSN</th>
            <th class="fontSteel">%ICMS Interno</th>
            <th class="fontSteel">% ICMS Interest.</th>
            <th class="fontSteel">% Red. B.C. Interna</th>
            <th class="fontSteel">% Red. B.C. Interest.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i, index) in principal" :key="index">
            <td class="tableexport-string">{{ i.codigo }}</td>
            <td class="tableexport-string">{{ i.descricao }}</td>
            <td class="tableexport-string">{{ i.uf }}</td>
            <td class="tableexport-string">{{ i.ncm }}</td>
            <td class="tableexport-string">{{ i.cest }}</td>
            <td class="tableexport-string">{{ i.pisCofins }}</td>
            <td class="tableexport-string">{{ i.cfop }}</td>
            <td class="tableexport-string">{{ i.cstCsosn }}</td>
            <td class="tableexport-string">
              {{ i.aliqIcmsInterna.toFixed(2) }}
            </td>
            <td class="tableexport-string">
              {{ i.aliqIcmsInterestadual.toFixed(2) }}
            </td>
            <td class="tableexport-string">{{ i.reducaoBcIcms.toFixed(2) }}</td>
            <td class="tableexport-string">
              {{ i.reducaoBcIcmsSt.toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>

      <table
        class="table table-divider table-striped table-sm table-responsive-lg tableFixHead table-bordered"
        id="tabelaPrincipal"
        v-if="principal.length > 0"
      >
        <thead>
          <tr>
            <th>Descrição</th>
            <th>UF</th>
            <th>NCM</th>
            <th>CEST</th>
            <th>PIS e COFINS</th>
            <th>CFOP</th>
            <th>CST ICMS | CSOSN</th>
            <th>%ICMS Interno</th>
            <th>% ICMS Interest.</th>
            <th>% Red. B.C. Interna</th>
            <th>% Red. B.C. Interest.</th>
            <th>Detalhes</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i, index) in Paginar" :key="index">
            <td>{{ RemoverResiduos(i.descricao) }}</td>
            <td class="text-center">{{ i.uf }}</td>
            <td class="text-center">{{ MascaraNCM(i.ncm) }}</td>
            <td class="text-center">{{ i.cest }}</td>
            <td class="text-center">{{ i.pisCofins }}</td>
            <td class="text-center">{{ i.cfop }}</td>
            <td class="text-center">{{ i.cstCsosn }}</td>
            <td class="text-right">{{ i.aliqIcmsInterna.toFixed(2) }}</td>
            <td class="text-right">{{ i.aliqIcmsInterestadual.toFixed(2) }}</td>
            <td class="text-right">{{ i.reducaoBcIcms.toFixed(2) }}</td>
            <td class="text-right">{{ i.reducaoBcIcmsSt.toFixed(2) }}</td>
            <td class="text-center">
              <!-- <i class="fa fa-search lupa mouseHand" title="Detalhes" @click="ConsultDetails(index)"></i> -->
              <i
                class="fa fa-search lupa mouseHand"
                title="Detalhes"
                data-toggle="modal"
                data-target="#modalDdetalhes"
                @click="ConsultDetails(i)"
              >
              </i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="row">
    <div class="col-md-5 col-lg-3 mt-3 mb-2">
      <button
        class="geral-button btn-sm ml-1"
        v-if="exportar == true"
        data-toggle="modal"
        data-target="#modalExportacao"
        data-backdrop="static"
        data-keyboard="false"
      >
        Exportar
      </button>
    </div>
    <template v-if="qtdePaginas > 1 && principal.length > 0">
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
            <div class="form-group">
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

  <!-- MODAL CONSULTA EM LOTE-->
  <div
    class="modal fade bd-example-modal-lg"
    id="modalConsultaLote"
    tabindex="-1"
    role="dialog"
    aria-labelledby="TituloModalCentralizado"
    aria-hidden="true"
    ref="vuemodal"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="TituloModalCentralizado">
            Insira os Dados para consulta
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
          <span class="badge-danger">
            Atenção! Serão considerados apenas os 1000 primeiros códigos.
          </span>

          <div class="row mt-2">
            <div class="col-md-12">
              <input
                class="mr-1"
                type="checkbox"
                id="chkLote"
                v-model="chkLote"
                v-on:click="ControlarCheckLote()"
              />
              <label for="chkLote">Desconsiderar e-mail do perfil.</label>
            </div>
          </div>

          <div class="row">
            <div class="col-md-8">
              <input
                type="email"
                class="form-control form-control-sm"
                id="emaillote"
                placeholder="Insira o e-mail..."
                v-model="emailLote"
                :disabled="dEmailLote"
              />
            </div>
          </div>

          <h4 class="mt-2 mb-1">Exemplo:</h4>
          <div class="mb-3">
            <p>
              Para realizar a consulta, fazer igual o layout de Exemplo,
              presente no botão "Planilha Exemplo". A coluna código pode ser
              preenchida por código EAN ou Interno.
            </p>
          </div>

          <!-- TEMPLATES/TABELAS PARA SEREM EXPORTADAS PARA EXEMPLIFICAR OS MODELOS DE ARQUIVOS PARA OPERAÇÃO EM LOTE -->
          <div v-show="showTblExemplo">
            <table id="TblExemplo">
              <thead>
                <tr>
                  <th class="fontSteel">CODIGO (EAN/Interno)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="tableexport-string">7891000012109</td>
                </tr>
                <tr>
                  <td class="tableexport-string">123</td>
                </tr>
                <tr>
                  <td class="tableexport-string">7896024102027</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h6>
            Escolha o arquivo a ser importado, caso deseje.
            <i
              class="fas fa-info-circle"
              title="O arquivo CSV ou XLSX deve seguir o mesmo padrão apresentado acima, cada produto deve estar em uma linha, separados por (;) no caso do CSV, separar por colunas no arquivo XLSX."
              style="color: steelblue"
            >
            </i>
          </h6>

          <div class="row">
            <div class="col-md-12 mt-1 mb-3">
              <div class="input-group input-sm">
                <input
                  type="text"
                  class="form-control form-control-sm mr-1"
                  id="fileNameUpload"
                  readonly
                />
                <label class="input-group-btn">
                  <span class="btn btn-sm btnModalGeral">
                    <i class="fa fa-search" title="Buscar arquivo"></i>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".csv, .ods, .xlsx"
                      style="display: none"
                      v-on:change="EnviarDadosArquivo($event, this)"
                    />
                  </span>
                </label>
                <label class="input-group-btn ml-1">
                  <span
                    class="btn btn-sm btnModalGeral"
                    v-on:click="LimparInputFile()"
                  >
                    <i class="fa fa-eraser" title="Limpar arquivo"></i>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <a
            style="color: steelblue; cursor: pointer"
            v-on:click.stop.prevent="consLote = RemoverCabecalho(consLote)"
            title="Remove o cabeçalho do arquivo importado."
          >
            <i
              class="fa fa-trash"
              style="color: steelblue"
              aria-hidden="true"
            ></i
            >&nbsp;Remover Cabeçalho
          </a>

          <textarea
            class="form-control form-control-sm mt-2"
            v-model="consLote"
            id="consultaLote"
            rows="5"
            autofocus
            placeholder="Código..."
          ></textarea>

          <input
            class="mt-3 mr-1"
            type="checkbox"
            id="chkExportarResultado"
            checked
            v-on:click="ExportarTodos()"
          />
          <label for="chkExportarResultado">Enviar resultados por e-mail</label>
        </div>

        <div class="modal-footer">
          <p v-if="consLote != ''">
            Total: {{ TotalItens(consLote) }} | Total Distintos-x1:
            {{ ConsultarDistintos(consLote) }}
          </p>
        </div>

        <div class="modal-footer">
          <div class="mr-auto">
            <button
              type="button"
              class="btn btnModalPrimary"
              title="Exporta em formato de planilha um exemplo de como deve ser montado o arquivo para importacao."
              v-on:click="
                GerarPlanilhaXLSXCSV(
                  'TblExemplo',
                  'Exemplo de Arquivo por Códigos',
                  'xlsx'
                )
              "
            >
              Planilha Exemplo XLSX
            </button>

            <button
              type="button"
              class="btn btnModalPrimary ml-2"
              title="Exporta em formato de planilha um exemplo de como deve ser montado o arquivo para importacao."
              v-on:click="
                GerarPlanilhaXLSXCSV(
                  'TblExemplo',
                  'Exemplo de Arquivo por Códigos',
                  'csv'
                )
              "
            >
              Planilha Exemplo CSV
            </button>
          </div>

          <button
            type="button"
            class="btn btnModalGeral"
            name="btnConsultarProdutos"
            data-dismiss="modal"
            v-on:click="ConsomeAPI(1)"
          >
            <i class="fa fa-search"></i> Consultar Códigos
          </button>
        </div>
      </div>
    </div>
  </div>

  <ConsultDetailsGrades
    v-if="mostrarDetalhes"
    :p_detalhes="detalhes"
  ></ConsultDetailsGrades>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";
import helpers from "@/helpers";
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import ConsultDetailsGrades from "@/components/saneamentogrades/ConsultDetails.vue";
import _ from "lodash";

const userStore = useAuthStore();

export default {
  components: {
    ConsultDetailsGrades,
  },
  data() {
    return {
      processando: false,
      mostrarDetalhes: false,
      alertStore: useAlertStore(),
      userLogged: userStore.user.hasAuth,
      tipoPessoa: "Remetente",
      criterios: [
        {
          tipo: "GTIN",
        },
        {
          tipo: "DESCRICAO",
        },
        {
          tipo: "NCM",
        },
      ],
      criterio: "GTIN",
      cfops: [
        {
          descricao: "VENDA",
          tipo: "5102",
        },
        {
          descricao: "COMPRA",
          tipo: "1102",
        },
        {
          descricao: "SAIDA TRANSFERENCIA",
          tipo: "5152",
        },
        {
          descricao: "ENTRADA TRANSFERENCIA",
          tipo: "1152",
        },
        {
          descricao: "SAIDA AMOSTRA GRATIS",
          tipo: "5911",
        },
        {
          descricao: "ENTRADA AMOSTRA GRATIS",
          tipo: "1911",
        },
        {
          descricao: "SAIDA DEMONSTRACAO",
          tipo: "5912",
        },
        {
          descricao: "ENTRADA DEMONSTRACAO",
          tipo: "1912",
        },
        {
          descricao: "SAIDA BONIFICACAO",
          tipo: "5910",
        },
        {
          descricao: "ENTRADA BONIFICACAO",
          tipo: "1910",
        },
        {
          descricao: "LACAMENTO CUPOM FISCAL",
          tipo: "5929",
        },
        {
          descricao: "ENTRADA DEVOLUCAO",
          tipo: "1201",
        },
        {
          descricao: "SAIDA DEVOLUCAO",
          tipo: "5202",
        },
        {
          descricao: "ENTREGA FUTURA",
          tipo: "5117",
        },
        {
          descricao: "SIMPLES FATURAMENTO",
          tipo: "5922",
        },
        {
          descricao: "CONSIGNACAO",
          tipo: "5114",
        },
        {
          descricao: "REMESSA DE MERCADORIA OU BEM PARA CONSERTO OU REPARO",
          tipo: "5915",
        },
        {
          descricao: "RETORNO DE CONSERTO",
          tipo: "1916",
        },
        {
          descricao: "OUTRO",
          tipo: "0",
        },
      ],
      cfop: "5102",
      cfopManual: null,
      digitarCfopManual: false,
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
      valor: "",
      cest: "",

      chave: 0,
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

      // Dados Empresa GT
      substICMS: "N",
      substICMS_: [
        {
          text: "Sim",
          value: "S",
        },
        {
          text: "Não",
          value: "N",
        },
      ],
      interdependente: "N",
      interdependente_: [
        {
          text: "Sim",
          value: "S",
        },
        {
          text: "Não",
          value: "N",
        },
      ],

      mostrarSimples: true,
      simples: "N",
      simplesNac: [
        {
          text: "Sim",
          value: "S",
        },
        {
          text: "Não",
          value: "N",
        },
      ],

      // Dados Remetende/Destinatário
      uf: userStore.user.profile.prfUF,
      caracTrib: 3,
      caracTrib_: [
        {
          text: "0=Industrial",
          value: 0,
        },
        {
          text: "1=Distribuidor",
          value: 1,
        },
        {
          text: "2=Atacadista",
          value: 2,
        },
        {
          text: "3=Varejista",
          value: 3,
        },
        {
          text: "4=Produtor Rural Pessoa Jurídica",
          value: 4,
        },
        {
          text: "6=Produtor Rural Pessoa Física",
          value: 6,
        },
        {
          text: "7=Pessoa Jurídica não Contribuinte do ICMS",
          value: 7,
        },
        {
          text: "8=Pessoa Física não Contribuinte do ICMS",
          value: 8,
        },
      ],
      finalidade: 0,
      finalidade_: [
        {
          text: "0-Revenda",
          value: 0,
        },
        {
          text: "1-Insumo",
          value: 1,
        },
        {
          text: "2-Uso e Consumo Ou Ativo Imobilizado.",
          value: 2,
        },
      ],
      origem: 0,
      origem_: [
        {
          text: "0-Nacional, exceto as indicadas nos códigos 3 a 5",
          value: 0,
        },
        {
          text: "1-Estrangeira - Importação direta, exceto a indicada no código 6",
          value: 1,
        },
        {
          text: "2-Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7",
          value: 2,
        },
        {
          text: "3-Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40%",
          value: 3,
        },
        {
          text: "4-Nacional, conforme Decreto-Lei nº 288/1967 , e as Leis nºs 8.248/1991, 8.387/1991, 10.176/2001 e 11.484/2007",
          value: 4,
        },
        {
          text: "5-Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%",
          value: 5,
        },
        {
          text: "6-Estrangeira - Importação direta, sem similar nacional, constante em lista de Resolução Camex e gás natural",
          value: 6,
        },
        {
          text: "7-Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista de Resolução Camex e gás natural",
          value: 7,
        },
        {
          text: "8-Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70% (setenta por cento).",
          value: 8,
        },
      ],
      substICMSRemDest: "N",
      substICMSRemDest_: [
        {
          text: "Sim",
          value: "S",
        },
        {
          text: "Não",
          value: "N",
        },
      ],

      // Dados do Produto
      codInterno: "N",
      codInterno_: [
        {
          text: "Sim",
          value: "S",
        },
        {
          text: "Não",
          value: "N",
        },
      ],
      codigo: "",
      codigosImendes: [],
      descricao: "",

      mostrarDestino: false,

      // NCM dados
      botaoNCM: false,
      ncm: "",
      exIPI: "",
      consLote: "",

      // Objeto de envio
      envio: {
        emit: {
          amb: "",
          cnpj: "",
          crt: "",
          regimeTrib: "",
          indIE: "",
          uf: "",
          cnae: "",
        },
        perfil: {
          uf: [],
          cfop: "",
          caracTrib: [],
          finalidade: 0,
          simplesN: "N",
          origem: "",
        },
        produtos: [
          {
            codigo: "",
            codInterno: "",
            descricao: "",
          },
        ],
      },

      // Objeto de retorno
      retConsulta: {},

      ufOrig: "",
      ufDest: "",

      // Variável para controlar se CST é entrada ou saída
      cstAtivo: true,

      DadosEnvio: {},

      // Variáveis Consulta por Lote
      consultaLote: false,
      consLote: "",
      retLote: false,
      lstConsultaLote: [],
      emailLote: "",
      dEmailLote: false,
      chkLote: false,
      chkCamposLote: false,
      dCaracTribModalLote: false,
      dChkTodasUFs: false,
      dataLote: new Date().toISOString().slice(0, 10),

      ufModalLote: [userStore.user.profile.prfUF],
      ufsModalLote: [
        {
          sigla: "AC",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "AL",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "AM",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "AP",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "BA",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "CE",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "DF",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "ES",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "GO",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "MA",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "MG",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "MS",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "MT",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "PA",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "PB",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "PE",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "PI",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "PR",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "RJ",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "RN",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "RO",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "RR",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "RS",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "SC",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "SE",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "SP",
          checado: false,
          desabilitado: true,
        },
        {
          sigla: "TO",
          checado: false,
          desabilitado: true,
        },
      ],
      marcarTodasUfs: false,

      caracTribModalLote: 3,
      caracTribsModalLote: [
        {
          text: "0=Industrial",
          value: 0,
        },
        {
          text: "1=Distribuidor",
          value: 1,
        },
        {
          text: "2=Atacadista",
          value: 2,
        },
        {
          text: "3=Varejista",
          value: 3,
        },
        {
          text: "4=Produtor Rural Pessoa Jurídica",
          value: 4,
        },
        {
          text: "6=Produtor Rural Pessoa Física",
          value: 6,
        },
        {
          text: "7=Pessoa Jurídica não Contribuinte do ICMS",
          value: 7,
        },
        {
          text: "8=Pessoa Física não Contribuinte do ICMS",
          value: 8,
        },
      ],

      considerarCamposLote: false,

      totalEnviados: 0,
      enviadosInicial: 0,
      itensRetornados: 0,

      // Variáveis Paginação
      qtdePaginas: 0,
      pagina: 1,
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

      descricaoTipoConsulta: "Consulta em Lote",

      jsonENVIO: "",

      lstUFsSelecionadas: [],
      ultimaUFConsultada: "",

      showTblExemplo: false,

      exportarIndividual: false,

      // Variável para controlar classe de estilo da div de UFs
      isDisabledUfs: true,

      exportarTudo: true,

      mostrarProgresso: false,
      valorProgresso: 0,
      incremento: 1,
      dadosRetornoLote: [],
      mensagensLote: [],

      notificacoes: [],
      notificacao: {},
      marcarComoLido: true,

      botoesHistorico: [],

      exportar: false,
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
      ],
      emailUsuario: userStore.user.mail,

      /* Retornos */
      retorno: {},
      principal: [],
      detalhes: {},

      descricoes: [],
    };
  },
  methods: {
    async ConsomeAPI(tipo) {
      if (!this.valor && !this.consLote && !this.codigosImendes) return;

      this.processando = true;
      this.exportar = false;
      this.principal = [];

      this.PegarValoresPerfil();
      this.ObterUFsLote();
      this.lstUFsSelecionadas = this.ufModalLote;
      let uf = Object.values(this.lstUFsSelecionadas);

      let cnpj = userStore.user.clientCNPJCPF;
      if (userStore.user.userStatus == "T") cnpj = "zmxN9vlsfffMb20TRA7+GQ==";

      let ufOrig = userStore.user.profile.prfUF;
      let crt = helpers.DefCaracTrib(userStore.user.profile.prfTaxRegime);

      let cfopEnvio = "";
      let caracTribEnvio = [];

      if (userStore.user.profile.prfValidity != undefined)
        this.dataVigencia = userStore.user.profile.prfValidity;

      let dia = this.dataVigencia.substring(8, 10);
      let mes = this.dataVigencia.substring(5, 7);
      let ano = this.dataVigencia.substring(0, 4);

      let tipoRPA = "";
      let cnaeEnvio = "";

      if (this.tipoCnae == "GERAL") cnaeEnvio = "";
      else cnaeEnvio = this.tipoCnae;

      if (crt != "SIMPLES NACIONAL") {
        if (crt != "LUCRO PRESUMIDO")
          tipoRPA = "LR"; // Lucro Real 0 - Geral e 1 - Lucro Real
        else tipoRPA = "LP"; // Lucro Presumido 3 - Lucro Presumido

        // Estamos transformando o regime tributário do perfil de GERAL para 3, visando compatibilidade com a API saneamento grades
        crt = 3; // Regime Normal
      } else {
        crt = 1; // Simples Nacional
      }

      switch (tipo) {
        // Consulta Individual
        case 0:
          caracTribEnvio = this.caracTrib;
          cfopEnvio = this.cfop;
          break;
        case 1:
          if (this.chkLote) {
            userStore.user.dataQueries.dadosLoteSaneamento3 = true;

            if (
              helpers.VerificarCamposLote(
                this.dataLote,
                this.emailLote,
                true
              ) == false
            ) {
              return;
            }
          } else {
            userStore.user.dataQueries.dadosLoteSaneamento3 = false;
          }

          if (this.considerarCamposLote) {
            caracTribEnvio = this.caracTribModalLote;

            if (this.caracTribModalLote == 8 || this.caracTribModalLote == 7) {
              this.finalidade = 2;
              this.simples = "N";
            }
          } else {
            caracTribEnvio = this.caracTrib;
          }

          cfopEnvio = this.cfop;

          if (!cfopEnvio) {
            cfopEnvio = userStore.user.profile.prfCfop;
          }
          break;
      }

      if (
        this.ValidarCampos(
          cnpj,
          ufOrig,
          this.uf,
          cfopEnvio,
          crt,
          this.codigo,
          this.descricao
        )
      ) {
        let user = "";
        let pwd = "";
        let envio = new Object();
        let url = RetUrlAPI("SaneamentoGrades");

        if ((tipo == 0 && this.valor != "") || this.codigosImendes != "") {
          this.AtualizarDadosBotoesHistorico(this.valor);
        }

        envio.emit = this.DadosEmpresaGT(
          2,
          cnpj,
          crt,
          tipoRPA,
          ufOrig,
          cnaeEnvio,
          this.interdependente,
          this.substICMS,
          dia,
          mes,
          ano
        );
        envio.perfil = this.DadosPerfilEmitenteDestinatario(
          uf,
          cfopEnvio,
          caracTribEnvio,
          this.finalidade,
          this.simples,
          this.origem,
          this.substICMSRemDest
        );
        envio.produtos = this.PreencherProdutos(tipo);

        if (envio.produtos.length == 0) {
          this.alertStore.error(
            "Não foi possível enviar nenhum produto, por favor enviar todos com descrição"
          );
          this.retorno = null;
          this.processando = false;
        }

        envio = this.AtualizarInformacoesPortal(envio);

        let data = await CallPostAsync(user, pwd, url, envio, true)
          .then((data) => {
            this.PreencherRetornos(data, tipo);
            userStore.user.dataQueries.RetornoConsulta = JSON.stringify(data);
            this.totalEnviados = data.Cabecalho.prodEnv;
            this.itensRetornados = data.Cabecalho.prodRet;
            this.exportar = true;
            this.processando = false;
          })
          .catch((reason) => {
            this.alertStore.error(
              "Falha ao atualizar as informações vindas do servidor."
            );
            this.exportar = false;
            this.processando = false;
          });
      } else {
        this.retorno = null;
        this.processando = false;
        this.exportar = false;
      }
    },

    PegarValoresPerfil() {
      this.recBruta = userStore.user.profile.prfRecBruta;
      this.uf = userStore.user.profile.prfUF;
      this.tipoCnae = userStore.user.profile.prfTypeCnae;

      this.ufModalLote = [userStore.user.profile.prfUF];
    },

    ConsultDetails(item) {
      this.mostrarDetalhes = false;

      this.detalhes = {
        descricao: item.descricao,
        pisCofins: item.aPisCofins,
        ipi: item.aIpi,
        icms: item.aIcms,
        pmpf: item.aPmpf,
        pf: item.aPf,
        pc: item.aPc,
        acordos: {
          protocolo: item.aIcms.Protocolo,
          convenio: item.aIcms.Convenio,
        },
      };

      this.mostrarDetalhes = true;

      $("#modalDdetalhes").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
      });
    },

    PreencherRetornos(data, tipo) {
      let linha = new Object();
      let codigos = [];
      let codImendes = false;

      /* Buscar descrição */
      let user = "";
      let pwd = "";
      let root = [];
      let descricao = "";
      let url = RetUrlAPI("PostDescricoes");

      data.Grupos.forEach((grupo) => {
        if (grupo.prodCodInterno) {
          codigos = grupo.prodCodInterno;
          codImendes = false;
        } else if (grupo.prodEan) {
          codigos = grupo.prodEan;
          codImendes = false;
        } else if (grupo.prodCodImendes) {
          codigos = grupo.prodCodImendes;
          codImendes = true;
        }

        codigos.forEach((codigo, indice, array) => {
          root = this.GerarObjetoEnvioPOSTDescricoes(codigo);

          if (codImendes) {
            if (this.descricoes.length == 0) descricao = grupo.descricao;
            else {
              let desc = this.descricoes.find((obj) => obj.codigo === codigo);
              descricao = desc.descricao;
            }

            this.PreencherLinhas(grupo, codigo, descricao, indice, array);
            return;
          }

          CallPostAsync(user, pwd, url, root, true).then((data) => {
            descricao = "";

            if (
              !codImendes &&
              data.cabecalho.mensagem == "OK" &&
              data.cabecalho.prodRet > 0
            ) {
              descricao = data.produto[0].descricao;
            }

            this.PreencherLinhas(grupo, codigo, descricao, indice, array);
          });
        });
      });
    },

    PreencherLinhas(grupo, codigo, descricao, indice, array) {
      let linha = {};

      grupo.Regras[0].uFs.forEach((uf) => {
        linha = {};

        if (uf.CFOP.CaracTrib.length == 0) return;

        linha.codigo = codigo;
        linha.descricao = descricao;

        linha.ncm = grupo.nCM;
        linha.cest = grupo.cEST;

        if (this.tipoPessoa == "Remetente") {
          linha.pisCofins = grupo.pisCofins.cstEnt;
        } else if (this.tipoPessoa == "Destinatário") {
          linha.pisCofins = grupo.pisCofins.cstSai;
        }

        if (uf.CFOP.CaracTrib[0].cSOSN) {
          linha.cstCsosn = uf.CFOP.CaracTrib[0].cSOSN;
        } else {
          linha.cstCsosn = uf.CFOP.CaracTrib[0].cST;
        }

        linha.uf = uf.uF;
        linha.cfop = uf.CFOP.CaracTrib[0].cFOP;
        linha.aliqIcmsInterna = uf.CFOP.CaracTrib[0].aliqIcmsInterna;
        linha.aliqIcmsInterestadual =
          uf.CFOP.CaracTrib[0].aliqIcmsInterestadual;
        linha.reducaoBcIcms = uf.CFOP.CaracTrib[0].reducaoBcIcms;
        linha.reducaoBcIcmsSt = uf.CFOP.CaracTrib[0].reducaoBcIcmsSt;

        //----------------------------------------------------------------------
        // Info para Detalhes
        //----------------------------------------------------------------------
        linha.aPisCofins = grupo.pisCofins;
        linha.aIpi = grupo.iPI;
        linha.aIcms = uf.CFOP.CaracTrib[0];

        linha.aPmpf = {};
        if (uf.CFOP.CaracTrib[0].Pmpf) {
          const pmpf = uf.CFOP.CaracTrib[0].Pmpf.find(
            (obj) => (obj.prodCodigo = codigo)
          );

          if (pmpf) linha.aPmpf = pmpf;
        }

        linha.aPf = {};
        if (uf.CFOP.CaracTrib[0].precoFabrica) {
          const pf = uf.CFOP.CaracTrib[0].precoFabrica.find(
            (obj) => (obj.ean = codigo)
          );

          if (pf) linha.aPf = pf;
        }

        linha.aPc = {};
        if (uf.CFOP.CaracTrib[0].precoMaximoConsumidor) {
          const pc = uf.CFOP.CaracTrib[0].precoMaximoConsumidor.find(
            (obj) => (obj.ean = codigo)
          );

          if (pc) linha.aPc = pc;
        }
        //----------------------------------------------------------------------

        this.principal.push(linha);
      });

      if (indice === array.length - 1) this.PaginarTabela();
    },

    PreencherProdutos(tipo) {
      let produtos = [];
      let codImendes = false;
      let listaProdutos;

      switch (tipo) {
        case 0:
          if (helpers.VerificaDigito(this.valor)) this.codInterno = "N";
          else this.codInterno = "S";

          produtos.push(
            this.DadosProduto(this.codInterno, this.valor, this.descricao)
          );
          break;

        case 1:
          if (this.codigosImendes <= 0) {
            listaProdutos = this.consLote.split("\n");
          } else {
            listaProdutos = this.codigosImendes;
            codImendes = true;
          }

          // Remover itens duplicados
          listaProdutos = listaProdutos.filter(function (elem, pos, self) {
            return self.indexOf(elem) == pos;
          });

          // Remover itens em branco
          listaProdutos = listaProdutos.filter(
            (listaProdutos) => listaProdutos.length > 0
          );

          // Remover itens caso haja mais de 3000 Códigos
          if (listaProdutos.length > 3000) listaProdutos.splice(3000);

          if (listaProdutos.length > 0) {
            let prod;

            let codigoInterno = false;
            let tipoCodigo = "";

            listaProdutos.forEach((element) => {
              prod = element.split(";");

              if (prod.length > 1 && prod[1]) {
                prod[0] = prod[0].toUpperCase().replaceAll("\r", "");

                codigoInterno = helpers.VerificaDigito(prod[0].trim());

                if (codigoInterno) {
                  produtos.push(
                    this.DadosProduto(
                      "N",
                      !codImendes
                        ? prod[0]
                            .trim()
                            .replaceAll(/"/g, "")
                            .replaceAll(/'/g, "")
                        : "",
                      "",
                      codImendes ? prod[0] : ""
                    )
                  );
                } else {
                  produtos.push(
                    this.DadosProduto(
                      "S",
                      !codImendes
                        ? prod[0]
                            .trim()
                            .replaceAll(/"/g, "")
                            .replaceAll(/'/g, "")
                        : "",
                      "",
                      codImendes ? prod[0] : ""
                    )
                  );
                }
              } else {
                codigoInterno = helpers.VerificaDigito(prod[0].trim());
                tipoCodigo = "";

                if (codigoInterno) tipoCodigo = "N";
                else tipoCodigo = "S";

                produtos.push(
                  this.DadosProduto(
                    tipoCodigo,
                    !codImendes
                      ? prod[0].trim().replaceAll(/"/g, "").replaceAll(/'/g, "")
                      : "",
                    "",
                    codImendes ? prod[0] : ""
                  )
                );
              }
            });
          }
      }

      return produtos;
    },

    VerificarTipoConsulta() {
      this.consultaLote = true;
      $("#modalConsultaLote").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
      });

      this.retLote = false;
      this.qtdePaginas = [];
      this.pagina = 1;
      this.retTransacao = false;
      this.totalEnviados = 0;
      this.enviadosInicial = 0;
    },

    DadosProduto(codInterno, codigo, descricao, codImendes = "") {
      let produto = new Object();

      produto.codInterno = codInterno;
      produto.codigo = codigo;
      produto.codImendes = codImendes;
      produto.descricao = descricao;

      return produto;
    },

    AtualizarInformacoesPortal(envio) {
      if (envio.produtos.length == 1)
        envio.emit.portal.method = "GT3_INDIVIDUAL";

      return envio;
    },

    ValidarCampos(cnpj, ufOrig, ufDest, cfop, cTrib, codigo, descricao) {
      if (userStore.user.userStatus != "T") {
        if (!cnpj) {
          this.alertStore.error("Por favor informar CNPJ.");
          return false;
        }
      }

      let cnaePerfil = userStore.user.profile.prfTypeCnae;
      let ctribPerfil = helpers.DefCaracTrib(
        userStore.user.profile.prfTaxRegime
      );

      if (cnaePerfil == "GERAL" || ctribPerfil == "GERAL") {
        this.alertStore.error(
          'No saneamento 3.0, não são permitidos CNAE ou Característica Tributária como "GERAL", para prosseguir por favor, atualizar o perfil.'
        );
        return false;
      }

      if (!ufOrig) {
        this.alertStore.error("Por favor informar uf Origem.");
        return false;
      }

      if (this.lstUFsSelecionadas.length == 0) {
        this.alertStore.error("Por favor informar pelo menos uma uf destino.");
        return false;
      }

      if (!cfop) {
        this.alertStore.error("Por favor informar CFOP.");
        return false;
      }

      if (cTrib == null) {
        this.alertStore.error("Por favor informar carac. tributária.");
        return false;
      }

      return true;
    },
    DadosEmpresaGT(
      amb,
      cnpj,
      crt,
      regime,
      uf,
      cnae,
      interdependente,
      substICMS,
      dia,
      mes,
      ano,
      regimeEspecial
    ) {
      var emit = new Object();

      emit.cnpj = cnpj;
      emit.amb = amb;
      emit.crt = crt;
      emit.regimeTrib = regime;
      emit.uf = uf;
      emit.cnae = cnae;
      emit.interdependente = interdependente;
      emit.substICMS = substICMS;
      emit.dia = dia;
      emit.mes = mes;
      emit.ano = ano;
      emit.regimeEspecial = userStore.user.profile.prfSpecialRegime;

      let portal = new Object();

      portal.userID = userStore.user.userId;
      portal.method = "GT3_LOTE";

      emit.portal = portal;

      return emit;
    },

    DadosPerfilEmitenteDestinatario(
      uf,
      cfop,
      cTrib,
      finalidade,
      simples,
      origem,
      substICMS
    ) {
      var perfil = new Object();

      perfil.uf = uf;
      perfil.cfop = helpers.ConverteCFOP(uf, cfop);
      perfil.caracTrib = [cTrib];
      perfil.finalidade = finalidade;
      perfil.simplesN = simples;
      perfil.origem = origem;
      perfil.substICMS = substICMS;

      return perfil;
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

    LimparCamposCriterio(criterio) {
      if (criterio != "DESRICAO") {
        this.cest = "";
      }
    },

    DefineCFOP(cfop) {
      if (cfop != "0") {
        this.digitarCfopManual = false;
        this.DefineTipoPessoa(cfop);
      } else {
        this.digitarCfopManual = true;
      }
    },

    DefineTipoPessoa(cfop) {
      if (cfop == "5" || cfop == "6") {
        this.tipoPessoa = "Destinatário";
      } else if (cfop == "1" || cfop == "2") {
        this.tipoPessoa = "Remetente";
      }
    },

    MarcarTodasUFs() {
      if (!this.marcarTodasUfs) {
        this.ufsModalLote.forEach((element) => {
          element.checado = true;
        });
      } else {
        this.ufsModalLote.forEach((element) => {
          element.checado = false;
        });
      }
    },

    ObterUFsLote() {
      this.ufModalLote = [];

      this.ufsModalLote.forEach((element) => {
        if (element.checado) {
          this.ufModalLote.push(element.sigla);
        }
      });
    },

    ChecarLstUFsLote(index, chk) {
      let chkSelecionado = document.getElementById(chk);

      if (chkSelecionado.checked) this.ufsModalLote[index].checado = true;
      else this.ufsModalLote[index].checado = false;
    },

    BuscarDescricao(item, consultar = false) {
      if (this.criterio === "GTIN") {
        this.codigo = item;
        this.ObterDescricao(item, consultar);
      }
    },
    BuscarDadosConsultas(valor, tipoConsulta) {
      this.processando = true;

      this.valor = valor;
      this.criterio = tipoConsulta;

      this.ObterUFsLote();
      this.lstUFsSelecionadas = this.ufModalLote;

      if (this.lstUFsSelecionadas.length == 0) {
        this.alertStore.error("Por favor informar pelo menos uma uf destino.");
        this.retorno = null;
        this.processando = false;
        this.exportar = false;
        return;
      }

      if (tipoConsulta === "GTIN") {
        this.ConsomeAPI(0);
      } else if (tipoConsulta === "NCM") {
        this.ObterCodigoImendesNCM(valor);
      } else if (tipoConsulta === "DESCRICAO") {
        this.ObterCodigoImendesDescricao(valor);
      }
    },

    ObterCodigoImendesDescricao(valor) {
      let url = RetUrlAPI() + "Consult";

      let rootObject = this.GerarObjetoEnvio(valor.trim());

      if (rootObject == null) return;

      this.processando = true;

      CallPostAsync("usuario", "", url, rootObject).then((data) => {
        if (data != null) {
          if (!data.products) {
            this.alertStore.error(data);
            this.processando = false;
            return;
          }

          this.codigosImendes = [];
          this.descricoes = [];

          data.products.forEach((ret) => {
            this.codigosImendes.push(ret.codImendes.toString());
            this.descricoes.push({
              codigo: ret.codImendes.toString(),
              descricao: ret.descricao,
            });
          });

          if (this.codigosImendes.length > 50) this.codigosImendes.splice(50);

          this.ConsomeAPI(1);
        }
      });
    },
    GerarObjetoEnvio(valor) {
      let tipoFiltroDesc = 2;

      if (this.tipoDescr == "INICIA COM") {
        tipoFiltroDesc = 1;
      } else if (this.tipoDescr == "IGUAL") {
        tipoFiltroDesc = 2;
      } else {
        tipoFiltroDesc = 3;
      }

      let envio = {
        header: {
          clientBehavior: "",
          partnerBehavior: "",
          clientStatus: "N",
          clientCnpjCpf: userStore.user.clientCnpjCpf,
          userID: userStore.user.userId,
          managerId: 0,
          managerEmail: "",
          method: "GTCONSULTA_INDIVIDUAL",
          requestSource: "PORTAL",
          userLogged: "true",
          consultType: 3,
          batch: false,
          consultTypeFilter: tipoFiltroDesc,
          validity: this.dataVigencia,
          uf: "SP",
          email: "imendes@imendes.com.br",
          company: "IMENDES",
          emailExport: "",
          taxRegimeType: 1,
          taxRegime: 1,
          activity: "INDUSTRIA",
          token: userStore.user.tokenSession,
        },
        products: [
          {
            description: valor,
            cest: this.cest.replaceAll(".", ""),
          },
        ],
      };

      return envio;
    },
    ObterCodigoImendesNCM(ncm) {
      let user = userStore.user.partnerCNPJCPF;
      let pwd = userStore.user.partnerPassword;

      let urlToken = RetUrlAPI("EnviaRecebeDadosIntegracoes", "v1") + "login";
      let url = RetUrlAPI("EnviaRecebeDadosIntegracoes", "v1") + "consulta-ncm";

      CallPostAsync("", "", urlToken, {
        cnpj: user,
        senha: pwd,
      }).then((data) => {
        let envio = [
          {
            ncm: ncm,
            cest: "",
            ex: this.exIPI,
          },
        ];

        CallPostAsync("user", "", url, envio, false, data.valor).then(
          (data) => {
            if (data.retornados <= 0) {
              this.alertStore.error(
                "Não encontramos essa NCM. Verifique e tente novamente!"
              );
              this.retorno = null;
              this.processando = false;
              this.exportar = false;
              return;
            }

            this.codigosImendes = [];

            data.encontradas.forEach((ret) => {
              this.codigosImendes.push(ret.codigoImendes.toString());
            });

            this.ConsomeAPI(1);
          }
        );
      });
    },
    ObterDescricao(codigo, consultarProduto) {
      if (codigo.length === 0) return;

      let user = "";
      let pwd = "";

      let root = this.GerarObjetoEnvioPOSTDescricoes(codigo);
      let url = RetUrlAPI("PostDescricoes");

      this.processando = true;

      CallPostAsync(user, pwd, url, root, true)
        .then((data) => {
          if (data.cabecalho.mensagem == "OK" && data.cabecalho.prodRet > 0) {
            this.descricao = data.produto[0].descricao;
            this.processando = false;

            if (consultarProduto) this.ConsomeAPI(0);
          } else {
            this.alertStore.error(
              "O Produto consultado não foi encontrado. Verifique e tente novamente."
            );
            this.processando = false;
          }
        })
        .catch((reason) => {
          this.alertStore.error(reason);
          this.processando = false;
        });
    },
    GerarObjetoEnvioPOSTDescricoes(cod) {
      let root = new Object();
      let Cabecalho = new Object();

      cod = cod.trim();

      Cabecalho.cnpjcpf = userStore.user.clientCNPJCPF;

      if (helpers.VerificaDigito(cod)) Cabecalho.codInterno = "N";
      else Cabecalho.codInterno = "S";

      root.Cabecalho = Cabecalho;
      root.Produto = [cod];

      return root;
    },
    RemoverResiduos(descricao) {
      return helpers.RemoverResiduos(descricao);
    },
    MascaraNCM(ncm) {
      return helpers.MascaraNCM(ncm);
    },
    PaginarTabela() {
      let tamanhoTotal = this.principal.length;

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

      this.result = itens.slice(de, para);

      return this.result;
    },

    /* Histórico */
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

    BuscaDescricoes(cod) {
      let user = "";
      let pwd = "";

      let root = this.GerarObjetoEnvioPOSTDescricoes(cod);
      let url = RetUrlAPI("PostDescricoes");

      CallPostAsync(user, pwd, url, root, true)
        .then((data) => {
          if (data.cabecalho.mensagem == "OK" && data.cabecalho.prodRet > 0) {
            return data.produtos.descricao;
          }
        })
        .catch((reason) => {});
    },

    /* Exportação */
    RetornarExportacao() {
      switch (this.tipoExportacao) {
        case 0:
          this.ExportarProdutos(this.consLote);
          break;
        case 1:
          this.ExportarXLSXDownload("tblResultadoPrincipal");
          break;
      }
    },
    ExportarXLSXDownload(idTabela) {
      helpers.GerarPlanilhaXLSXCSV(idTabela, "Exportação GT 3.0", "xlsx");
    },
    ExportarProdutos(lote, mensagem = true) {
      let mensagemRetorno = "";
      let envio = new Object();
      let consultaTipo = "Individual";

      envio.Cabecalho = this.GerarJSONExportacaoCabecalho(lote);
      envio.Grupos = this.GerarJSONExportacaoGrupos(lote);

      if (lote) {
        envio.SemRetorno = this.GerarJSONExportacaoSemRetorno();
        consultaTipo = "em Lote";
      }

      let user = "";
      let pwd = "";
      let url = RetUrlAPI() + "ExportSaneamentoGrades";

      if (mensagem)
        this.alertStore.success(
          "Logo você receberá um email com o arquivo de exportação!"
        );

      $("#modalExportacao").modal("hide");

      CallPostAsync(user, pwd, url, envio)
        .then((data) => {
          if (data != null) {
            this.processando = false;

            mensagemRetorno = "OK";

            helpers.GravarLog(
              "Exportou resultado consulta (" +
                consultaTipo +
                ") saneamento grades.",
              "saneamento3.html",
              "ExportSaneamentoGrades",
              mensagemRetorno,
              null,
              "portal"
            );
          } else {
            this.processando = false;

            mensagemRetorno = reason;

            helpers.GravarLog(
              "Exportou resultado consulta ( " +
                consultaTipo +
                ") saneamento grades.",
              "saneamento3.html",
              "ExportSaneamentoGrades",
              mensagemRetorno,
              null,
              "portal"
            );

            this.alertStore.error(reason);
          }
        })
        .catch((reason) => {
          this.processando = false;

          mensagemRetorno = reason;

          helpers.GravarLog(
            "Exportou resultado consulta (" + consultaTipo + ")",
            "saneamento3.html",
            "ExportProducts",
            mensagemRetorno,
            "portal"
          );

          this.alertStore.error(reason);
        });
    },
    GerarJSONExportacaoCabecalho(lote) {
      let Cabecalho = new Object();

      Cabecalho.sent = 1;
      Cabecalho.returned = 1;
      Cabecalho.percReturned = 100;
      Cabecalho.notReturned = 0;
      Cabecalho.percNotReturned = 0;
      Cabecalho.activity = userStore.user.profile.prfTypeCnae;
      Cabecalho.taxRegime = helpers.DefCaracTrib(
        userStore.user.profile.prfTaxRegime
      );
      Cabecalho.company = userStore.user.company;
      Cabecalho.mail = userStore.user.mail;
      Cabecalho.cnpjcpf = userStore.user.clientCNPJCPF;

      if (this.ultimaUFConsultada) Cabecalho.uf = this.ultimaUFConsultada;
      else Cabecalho.uf = userStore.user.profile.prfUF;

      if (lote) {
        Cabecalho.sent = this.totalEnviados;
        Cabecalho.returned = this.itensRetornados;
        Cabecalho.percReturned =
          (Cabecalho.returned / this.totalEnviados) * 100;
        Cabecalho.notReturned = this.totalEnviados - Cabecalho.returned;
        Cabecalho.percNotReturned =
          (Cabecalho.notReturned / this.totalEnviados) * 100;

        Cabecalho.mail = this.emailUsuario;
      }

      return Cabecalho;
    },
    GerarJSONExportacaoGrupos(lote) {
      let Grupos = new Object();
      let retorno;

      retorno = JSON.parse(userStore.user.dataQueries.RetornoConsulta);

      Grupos = retorno.Grupos;

      Grupos.forEach((grupo) => {
        if (grupo.prodEan) {
          grupo.prodEan.forEach((cod, index) => {
            let descricao = this.BuscaDescricoes(cod);
            grupo.prodEan[index] = cod + ";" + descricao;
          });
        } else {
          grupo.prodCodImendes.forEach((cod, index) => {
            grupo.prodCodImendes[index] = cod + ";" + "";
          });
        }
      });

      return Grupos;
    },
    GerarJSONExportacaoSemRetorno() {
      let SemRetorno = new Object();

      let retorno = JSON.parse(userStore.user.dataQueries.RetornoConsulta);

      SemRetorno = retorno.SemRetorno;

      return SemRetorno;
    },
    GerarPlanilhaXLSXCSV(idTabela, nomeArquivo, formato) {
      return helpers.GerarPlanilhaXLSXCSV(idTabela, nomeArquivo, formato);
    },
    ControlarCheckLote() {
      if (this.chkLote) {
        userStore.user.dataQueries.dadosLoteSaneamento3 = false;
        this.dEmailLote = true;
      } else {
        userStore.user.dataQueries.dadosLoteSaneamento3 = true;
        this.dEmailLote = false;
      }
    },
    TotalItens(lote) {
      return helpers.TotalItens(lote);
    },
    ConsultarDistintos(vetor) {
      return helpers.ConsultarDistintos(vetor);
    },
    RemoverCabecalho(texto) {
      return helpers.RemoverCabecalho(texto);
    },
    async EnviarDadosArquivo(e, vm) {
      try {
        this.consLote = await helpers.CarregarArquivo(e, vm);

        var file = $("#file-upload")[0].files[0].name;
        document.getElementById("fileNameUpload").value = file;
      } catch (error) {
        this.alertStore.error(error);
      }
    },
    LimparInputFile() {
      // Limpar dados da importação
      this.consLote = "";
      document.getElementById("file-upload").value = "";
      document.getElementById("fileNameUpload").value = "";
    },
  },
  mounted() {
    if (userStore.user.profile.prfCfop)
      this.cfop = userStore.user.profile.prfCfop;
    this.LerHistoricoPesquisa();
  },
  computed: {
    Paginar() {
      if (this.principal) {
        return this.Paginacao(this.principal);
      }
    },

    ListaHistorico() {
      this.LerHistoricoPesquisa();
      return this.botoesHistorico;
    },
  },
};
</script>

<style>
#divUfsLote {
  overflow: auto;
  height: 45px;
}
</style>
