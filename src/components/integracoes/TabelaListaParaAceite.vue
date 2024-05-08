<template>
  <div class="row">
    <div class="col-12">
      <div
        class="col-sm-12 col-md-12 col-lg-2 col-xl-2 float-left pl-1 mb-1 mt-3"
      >
        <i
          id="btnAtualizar"
          style="
            font-size: 1.3rem;
            color: #2e354c;
            font-weight: bold;
            cursor: pointer;
            border: 1px solid;
            border-radius: 5px;
            border-color: #ccc;
            padding: 10px;
          "
          class="fa fa-refresh shadow mr-2"
          aria-hidden="true"
          title="Clique para atualizar a lista de itens pendentes de Aceitação."
          @click="
            listaAceiteProcessando = true;
            RecarregarLista(true);
          "
          v-if="opcaoDeRecarga"
        >
        </i>

        <i
          id="btnConfirmaAcao"
          style="
            font-size: 1.3rem;
            color: #008000;
            font-weight: bold;
            cursor: pointer;
            border: 1px solid;
            border-radius: 5px;
            border-color: #ccc;
            padding: 10px;
          "
          class="fa fa-check-circle-o shadow"
          aria-hidden="true"
          title='Confirma a seleção presente na coluna "AÇÂO".'
          @click="ConfirmarAceite(listaAlteracoes)"
          v-if="Paginar.length > 0"
        >
        </i>
      </div>

      <div
        class="col-sm-12 col-md-6 col-lg-1 col-xl-1 float-left mb-2 mt-2 pl-1"
      >
        <span
          >Filtro:
          <i
            class="fas fa-info-circle"
            title="FILTRO: \n- Nenhum=Traz a lista disponível completa. (Clique no ícone da Lupa após sua seleção).\n- SKU(s): Informe o SKU desejado. Para mais de um, separe por ponto-e-vírgula."
            style="color: steelblue; cursor: pointer"
          />
        </span>
        <select
          class="form-control form-control-sm md-auto"
          v-model="lpa_filtro"
          style="cursor: pointer"
        >
          <option
            v-for="(item, i) in lpa_filtros"
            :key="i"
            v-bind:value="item.value"
          >
            {{ item.label }}
          </option>
        </select>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4 float-left mb-2 mt-2">
        <span>&nbsp;</span>
        <input
          type="text"
          class="form-control form-control-sm valor"
          placeholder="Informe o valor para o filtro..."
          v-on:keyup.enter="
            LpaFiltrarLista({ lpa_filtroTipo, lpa_filtro, lpa_filtroValor });
            OrganizarNavegacao();
          "
          v-model="lpa_filtroValor"
        />

        <div
          id="lupa-sku-filtro"
          v-on:click="
            LpaFiltrarLista({ lpa_filtroTipo, lpa_filtro, lpa_filtroValor });
            OrganizarNavegacao();
          "
        >
          <i class="fa fa-search lupa" title="Aplicar filtro."></i>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-2 col-xl-2 float-right mb-1 mt-4">
        <input
          type="number"
          class="form-control form-control-sm valor"
          placeholder="Página"
          v-model="lpa_paginaEscolhida"
          v-on:keyup.enter="
            lpa_pagina = lpa_paginaEscolhida;
            LpaFiltrarLista({
              lpa_filtroTipo,
              lpa_filtro,
              lpa_filtroValor,
              lpa_limite,
              lpa_paginaEscolhida,
            });
            OrganizarNavegacao();
          "
        />

        <div
          id="lupa"
          v-on:click="
            lpa_pagina = lpa_paginaEscolhida;
            LpaFiltrarLista({
              lpa_filtroTipo,
              lpa_filtro,
              lpa_filtroValor,
              lpa_limite,
              lpa_paginaEscolhida,
            });
            OrganizarNavegacao();
          "
        >
          <i class="fa fa-search lupa"></i>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-1 col-xl-1 float-right mb-3 mt-4">
        <select
          class="form-control form-control-sm"
          v-model="lpa_limite"
          title="Altera o limite de linhas por página."
          v-on:change="
            lpa_pagina = 1;
            LpaFiltrarLista({
              lpa_filtroTipo,
              lpa_filtro,
              lpa_filtroValor,
              lpa_limite,
              lpa_paginaEscolhida,
            });
            PaginarTabela();
          "
        >
          <option v-for="(item, i) in lpa_limites" :key="i" v-bind:value="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>

    <div class="col-12">
      <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-left mb-1 mt-1">
          <!-- <span>Linhas de {{ lpa_filtroDe }} até {{ lpa_filtroPara }} de {{ this.registros }} registros.</span> -->
          <span>{{ Paginar.length }} de {{ this.registros }} registros.</span>
        </div>

        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-right mb-1 mt-1">
          <span
            >Pagina {{ lpa_pagina }} de
            {{ lpa_qtdePaginas <= 0 ? 1 : lpa_qtdePaginas }}.</span
          >
        </div>
      </div>
    </div>

    <div class="text-center" v-if="listaAceiteProcessando">
      <div class="text-info text-center">
        Processando comando de Aceite. Aguarde...
      </div>
      <div class="spinner-border text-info text-center" role="status"></div>
    </div>

    <table
      class="table table-responsive"
      id="tblResultadoListaAceite"
      v-show="tblResultadoListaAceiteMostrar"
    >
      <thead>
        <tr>
          <th class="fontSteel">SKU</th>
          <th class="fontSteel">EAN</th>
          <th class="fontSteel">Descrição</th>
          <th class="fontSteel">Operação</th>
          <th class="fontSteel">UF Orig.</th>
          <th class="fontSteel">UF Dest.</th>
          <th class="fontSteel">NCM Antes</th>
          <th class="fontSteel">NCM Depois</th>
          <th class="fontSteel">PIS/COFINS Antes</th>
          <th class="fontSteel">PIS/COFINS Depois</th>
          <th class="fontSteel">CFOP</th>
          <th class="fontSteel">CST Antes</th>
          <th class="fontSteel">CST Depois</th>
          <th class="fontSteel">Ex Antes</th>
          <th class="fontSteel">Ex Depois</th>
          <th class="fontSteel">CEST Antes</th>
          <th class="fontSteel">CEST Depois</th>
          <th class="fontSteel">Aliq. ICMS Antes</th>
          <th class="fontSteel">Aliq. ICMS Depois</th>
          <th class="fontSteel">FCP Antes</th>
          <th class="fontSteel">FCP Depois</th>
          <th class="fontSteel">Red. BC ICMS Antes</th>
          <th class="fontSteel">Red. BC ICMS Depois</th>
          <th class="fontSteel">Diferimento Antes</th>
          <th class="fontSteel">Diferimento Depois</th>
          <th class="fontSteel">Aliq. ICMS ST Antes</th>
          <th class="fontSteel">Aliq. ICMS ST Depois</th>
          <th class="fontSteel">IVA Antes</th>
          <th class="fontSteel">IVA Depois</th>
          <th class="fontSteel">IVA Ajust. Antes</th>
          <th class="fontSteel">IVA Ajust. Depois</th>
          <th class="fontSteel">Red. BC ST Antes</th>
          <th class="fontSteel">Red. BC ST Depois</th>
          <th class="fontSteel">Aliq. ICMS Interestadual Antes</th>
          <th class="fontSteel">Aliq. ICMS Interestadual Depois</th>
          <th class="fontSteel">Red. BC Interestadual Antes</th>
          <th class="fontSteel">Red. BC Interestadual Depois</th>
          <th class="fontSteel">Código Benefício Fiscal Antes</th>
          <th class="fontSteel">Código Benefício Fiscal Depois</th>
          <th class="fontSteel">Emb. Legal Antes</th>
          <th class="fontSteel">Emb. Legal Depois</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in Paginar" v-bind:key="index">
          <tr>
            <td class="tableexport-string">{{ item.sku }}</td>
            <td class="tableexport-string">{{ item.ean }}</td>
            <td class="tableexport-string">{{ item.produto }}</td>
            <td class="tableexport-string">{{ item.operacao }}</td>
            <td class="tableexport-string">{{ item.ufOrigem }}</td>
            <td class="tableexport-string">{{ item.ufDestino }}</td>
            <td class="tableexport-string">{{ item.ncmAntes }}</td>
            <td class="tableexport-string">{{ item.ncm }}</td>
            <td class="tableexport-string">{{ item.pisCofinsAntes }}</td>
            <td class="tableexport-string">{{ item.pisCofins }}</td>
            <td class="tableexport-string">{{ item.cfop }}</td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.cst }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">{{ item.icms.cst }}</td>
            <td class="tableexport-string">{{ item.exAntes }}</td>
            <td class="tableexport-string">{{ item.ex }}</td>
            <td class="tableexport-string">{{ item.cestAntes }}</td>
            <td class="tableexport-string">{{ item.cest }}</td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.aliq.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.aliq.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.fcp.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.fcp.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.reducaoBC.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.reducaoBC.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.diferimento.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.diferimento.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.aliqSt.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.aliqSt.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.iva.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.iva.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.ivaAjustado.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.ivaAjustado.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.reducaoSt.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.reducaoSt.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.aliqInterestadual.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.aliqInterestadual.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.reducaoBCInterestadual.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.reducaoBCInterestadual.toFixed(2) }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.codigoBeneficio }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.codigoBeneficio }}
            </td>
            <td class="tableexport-string" v-if="item.icmsAntes != null">
              {{ item.icmsAntes.baseLegal }}
            </td>
            <td class="tableexport-string" v-else></td>
            <td class="tableexport-string">
              {{ item.icms.baseLegal }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="table-responsive w-100 col-12">
      <table
        class="table table-divider table-striped table-sm table-responsive-lg tableFixHead table-bordered"
      >
        <thead>
          <tr>
            <th scoped="col" class="text-center">
              <select
                class="form-control form-control-sm"
                v-model="tabAcao"
                title="Ações em Lote."
                v-on:change="AcoesEmLote()"
                v-if="listaAlteracoes.length > 0"
              >
                <option
                  v-for="(acao, i) in tabAcoes"
                  :key="i"
                  v-bind:value="acao.value"
                >
                  {{ acao.label }}
                </option>
              </select>
              <span v-else> AÇÕES </span>
            </th>

            <th scoped="col" class="text-center">
              SKU
              <i
                class="fas fa-info-circle"
                title="Posicione sobre o código SKU para ver o código EAN."
                style="color: #febd11; cursor: pointer"
              />
            </th>

            <th scoped="col" class="text-center">EAN</th>
            <th scoped="col" class="text-left">Descrição</th>
            <th scoped="col" class="text-center">Operação</th>
            <th scoped="col" class="text-center">UF Orig.</th>
            <th scoped="col" class="text-center">UF Dest.</th>
            <th scoped="col" class="text-center">PIS/COFINS</th>
            <th scoped="col" class="text-center">IPI</th>
            <th scoped="col" class="text-center">Cód. ANP</th>
            <th scoped="col" class="text-center" title="Código CST">CST</th>

            <th scoped="col" class="text-center">Detalhes</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(item, index) in Paginar" v-bind:key="index">
            <tr>
              <td class="text-left">
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="opcAceitar"
                    :name="item.id"
                    v-model="item.status"
                    value="0"
                    :checked="item.status == 0"
                  />
                  <label class="form-check-label" for="opcAceitar"
                    >Aprovar</label
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input
                    class="form-check-input"
                    type="radio"
                    id="opcAceitar"
                    :name="item.id"
                    v-model="item.status"
                    value="1"
                    :checked="item.status == 1"
                  />
                  <label class="form-check-label" for="opcDeclinar"
                    >Declinar</label
                  >
                </div>
                <!-- <div class="form-check form-check-inline"> -->
                <!--     <input class="form-check-input" type="radio" id="opcAceitar" :name="'status' + item.sku" v-model="item.status" value=2 :checked="item.status==2"> -->
                <!--     <label class="form-check-label" for="opcInativar">Inativar</label> -->
                <!-- </div> -->
              </td>

              <td
                class="text-left"
                :title="'EAN: ' + item.ean"
                style="cursor: pointer"
              >
                {{ item.sku }}
              </td>

              <td class="text-center">{{ item.ean }}</td>
              <td class="text-left">{{ item.produto }}</td>
              <td class="text-center">{{ item.operacao }}</td>
              <td class="text-center">{{ item.ufOrigem }}</td>
              <td class="text-center">{{ item.ufDestino }}</td>
              <td class="text-center">{{ item.pisCofins }}</td>
              <td class="text-center">{{ item.ipi }}</td>
              <td class="text-center">{{ item.codigoAnp }}</td>
              <td class="text-center">{{ item.icms.cst }}</td>
              <td class="text-center">
                <i
                  class="fa fa-search lupa mouseHand"
                  title="Detalhes"
                  data-toggle="modal"
                  data-target="#modalDdetalhes"
                  @click="ConsultDetails(item)"
                ></i>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- <div class="col-md-5 col-lg-3 mt-3 mb-2">
      <button
        class="geral-button btn-sm ml-1"
        @click="ExportarXLSXDownload('tblResultadoListaAceite')"
      >
        Exportar
      </button>
    </div> -->

    <template v-if="lpa_qtdePaginas > 1">
      <div class="col-md-5 col-lg-7 mb-1 mr-0 mt-3">
        <nav
          class="d-lg-flex justify-content-end overflow-auto"
          aria-label="xyz"
        >
          <ul class="pagination">
            <li class="page-item" v-if="lpa_pagina != 1">
              <a
                class="page-link"
                v-on:click.prevent.stop="
                  lpa_pagina = 1;
                  lpa_paginaEscolhida = lpa_pagina;
                  LpaFiltrarLista({
                    lpa_filtroTipo,
                    lpa_filtro,
                    lpa_filtroValor,
                    lpa_limite,
                    lpa_paginaEscolhida,
                  });
                  OrganizarNavegacao();
                "
                href="#"
              >
                <i class="fas fa-angle-double-left"></i>
              </a>
            </li>

            <li class="page-item" v-if="lpa_pagina != 1">
              <a
                class="page-link"
                v-on:click.prevent.stop="
                  lpa_pagina--;
                  lpa_paginaEscolhida = lpa_pagina;
                  LpaFiltrarLista({
                    lpa_filtroTipo,
                    lpa_filtro,
                    lpa_filtroValor,
                    lpa_limite,
                    lpa_paginaEscolhida,
                  });
                  OrganizarNavegacao();
                "
                href="#"
              >
                <i class="fas fa-angle-left"></i>
              </a>
            </li>

            <li
              v-for="item in lpa_paginaNavegacao"
              class="page-item"
              :class="{ active: item === lpa_pagina }"
              :key="item"
              v-on:click.prevent.stop="
                lpa_pagina = item;
                lpa_paginaEscolhida = lpa_pagina;
                LpaFiltrarLista({
                  lpa_filtroTipo,
                  lpa_filtro,
                  lpa_filtroValor,
                  lpa_limite,
                  lpa_paginaEscolhida,
                });
                OrganizarNavegacao();
              "
            >
              <a class="page-link" href="#">{{ item }}</a>
            </li>

            <li
              class="page-item"
              v-if="lpa_pagina < lpa_qtdePaginas"
              v-on:click.prevent.stop="
                lpa_pagina++;
                lpa_paginaEscolhida = lpa_pagina;
                LpaFiltrarLista({
                  lpa_filtroTipo,
                  lpa_filtro,
                  lpa_filtroValor,
                  lpa_limite,
                  lpa_paginaEscolhida,
                });
                OrganizarNavegacao();
              "
            >
              <a class="page-link" href="#">
                <i class="fas fa-angle-right"></i>
              </a>
            </li>

            <li
              class="page-item"
              v-if="lpa_qtdePaginas > 1 && lpa_pagina < lpa_qtdePaginas"
              v-on:click.prevent.stop="
                lpa_pagina = lpa_qtdePaginas;
                lpa_paginaEscolhida = lpa_pagina;
                LpaFiltrarLista({
                  lpa_filtroTipo,
                  lpa_filtro,
                  lpa_filtroValor,
                  lpa_limite,
                  lpa_paginaEscolhida,
                });
                OrganizarNavegacao();
              "
            >
              <a class="page-link" href="#">
                <i class="fas fa-angle-double-right"></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </template>

    <!-- MODAL DETALHES -->
    <div
      class="modal fade bd-example-modal"
      id="modalDetalhesListaAceite"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title" id="exampleModalLongTitle">
              {{ lpa_detalhes.sku }} - {{ lpa_detalhes.produto }}
            </h6>

            <div>
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
            <table
              class="table table-divider table-striped table-sm table-responsive-lg table-bordered tabela-detalhes"
            >
              <thead>
                <th scope="col"></th>
                <th scope="col" class="text-right">Antes</th>
                <th scope="col" class="text-right">Depois</th>
              </thead>
              <tbody>
                <!-- NCM -->
                <tr>
                  <th class="text-left">NCM</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.ncmAntes != lpa_detalhes.ncm,
                    }"
                    v-if="lpa_detalhes.ncmAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.ncmAntes != lpa_detalhes.ncm,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.ncmAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.ncmAntes != lpa_detalhes.ncm,
                    }"
                    v-if="lpa_detalhes.ncm == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.ncmAntes != lpa_detalhes.ncm,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.ncm }}
                  </td>
                </tr>
                <!-- EX -->
                <tr>
                  <th class="text-left">Ex</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.exAntes != lpa_detalhes.ex,
                    }"
                    v-if="lpa_detalhes.exAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.exAntes != lpa_detalhes.ex,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.exAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.exAntes != lpa_detalhes.ex,
                    }"
                    v-if="lpa_detalhes.exAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.exAntes != lpa_detalhes.ex,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.ex }}
                  </td>
                </tr>
                <!-- CEST -->
                <tr>
                  <th class="text-left">CEST</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.cestAntes != lpa_detalhes.cest,
                    }"
                    v-if="lpa_detalhes.cestAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.cestAntes != lpa_detalhes.cest,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.cestAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.cestAntes != lpa_detalhes.cest,
                    }"
                    v-if="lpa_detalhes.cest == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.cestAntes != lpa_detalhes.cest,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.cest }}
                  </td>
                </tr>
                <!-- PIS/COFINS -->
                <tr>
                  <th class="text-left">PIS/COFINS</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.pisCofinsAntes != lpa_detalhes.pisCofins,
                    }"
                    v-if="lpa_detalhes.pisCofinsAntes == null"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.pisCofinsAntes != lpa_detalhes.pisCofins,
                    }"
                    v-else
                  >
                    {{ lpa_detalhes.pisCofinsAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.pisCofinsAntes != lpa_detalhes.pisCofins,
                    }"
                  >
                    {{ lpa_detalhes.pisCofins }}
                  </td>
                </tr>
                <!-- CFOP -->
                <tr>
                  <th class="text-left">CFOP</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        lpa_detalhes.cfop != lpa_detalhes.cfop,
                    }"
                  >
                    {{ lpa_detalhes.cfop }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        lpa_detalhes.cfop != lpa_detalhes.cfop,
                    }"
                  >
                    {{ lpa_detalhes.cfop }}
                  </td>
                </tr>
                <template v-if="lpa_detalhes.icmsAntes == null">
                  <!-- CST ICMS-->
                  <tr>
                    <th class="text-left">CST ICMS</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.cst }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS -->
                  <tr>
                    <th class="text-left">Aliq. ICMS</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.aliq.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- FCP -->
                  <tr>
                    <th class="text-left">FCP</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.fcp.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. -->
                  <tr>
                    <th class="text-left">Red. BC ICMS</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.reducaoBC.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Diferimento -->
                  <tr>
                    <th class="text-left">Diferimento</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.diferimento.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliquota ICMS ST -->
                  <tr>
                    <th class="text-left">Aliq. ICMS ST</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.aliqSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA -->
                  <tr>
                    <th class="text-left">IVA</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.iva.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA Ajustado -->
                  <tr>
                    <th class="text-left">IVA Ajust.</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.ivaAjustado.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC ST -->
                  <tr>
                    <th class="text-left">Red. BC ST</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.reducaoSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS Interestadual -->
                  <tr>
                    <th class="text-left">Aliq. ICMS Interestadual</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.aliqInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. Interestadual -->
                  <tr>
                    <th class="text-left">Red. BC Interestadual</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ lpa_detalhes.icms.reducaoBCInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Código Benefício Fiscal -->
                  <tr>
                    <th class="text-left">Código Benefício Fiscal</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td
                      class="text-right indicacao-alteracao-depois"
                      v-if="
                        lpa_detalhes.icms.codigoBeneficio == '' ||
                        lpa_detalhes.icms.codigoBeneficio == null
                      "
                    >
                      Não se aplica
                    </td>
                    <td class="text-right indicacao-alteracao-depois" v-else>
                      {{ lpa_detalhes.icms.codigoBeneficio }}
                    </td>
                  </tr>
                  <!-- Emb. Legal -->
                  <tr>
                    <th class="text-left">Emb. Legal</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icms.baseLegal == '' ||
                          lpa_detalhes.icms.baseLegal == null,
                      }"
                    >
                      -
                    </td>
                    <td
                      class="text-right"
                      v-if="
                        lpa_detalhes.icms.baseLegal == '' ||
                        lpa_detalhes.icms.baseLegal == null
                      "
                    >
                      -
                    </td>
                    <td class="text-right" v-else>
                      {{ lpa_detalhes.icms.baseLegal }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <!-- CST ICMS-->
                  <tr>
                    <th class="text-left">CST ICMS</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.cst != lpa_detalhes.icms.cst,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.cst }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.cst != lpa_detalhes.icms.cst,
                      }"
                    >
                      {{ lpa_detalhes.icms.cst }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS -->
                  <tr>
                    <th class="text-left">Aliq. ICMS</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.aliq != lpa_detalhes.icms.aliq,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.aliq.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.aliq != lpa_detalhes.icms.aliq,
                      }"
                    >
                      {{ lpa_detalhes.icms.aliq.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- FCP -->
                  <tr>
                    <th class="text-left">FCP</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.fcp != lpa_detalhes.icms.fcp,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.fcp.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.fcp != lpa_detalhes.icms.fcp,
                      }"
                    >
                      {{ lpa_detalhes.icms.fcp.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. -->
                  <tr>
                    <th class="text-left">Red. BC ICMS</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.reducaoBC !=
                          lpa_detalhes.icms.reducaoBC,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.reducaoBC.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.reducaoBC !=
                          lpa_detalhes.icms.reducaoBC,
                      }"
                    >
                      {{ lpa_detalhes.icms.reducaoBC.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Diferimento -->
                  <tr>
                    <th class="text-left">Diferimento</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.diferimento !=
                          lpa_detalhes.icms.diferimento,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.diferimento.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.diferimento !=
                          lpa_detalhes.icms.diferimento,
                      }"
                    >
                      {{ lpa_detalhes.icms.diferimento.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliquota ICMS ST -->
                  <tr>
                    <th class="text-left">Aliq. ICMS ST</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.aliqSt !=
                          lpa_detalhes.icms.aliqSt,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.aliqSt.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.aliqSt !=
                          lpa_detalhes.icms.aliqSt,
                      }"
                    >
                      {{ lpa_detalhes.icms.aliqSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA -->
                  <tr>
                    <th class="text-left">IVA</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.iva != lpa_detalhes.icms.iva,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.iva.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.iva != lpa_detalhes.icms.iva,
                      }"
                    >
                      {{ lpa_detalhes.icms.iva.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA Ajustado -->
                  <tr>
                    <th class="text-left">IVA Ajust.</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.ivaAjustado !=
                          lpa_detalhes.icms.ivaAjustado,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.ivaAjustado.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.ivaAjustado !=
                          lpa_detalhes.icms.ivaAjustado,
                      }"
                    >
                      {{ lpa_detalhes.icms.ivaAjustado.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC ST -->
                  <tr>
                    <th class="text-left">Red. BC ST</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.reducaoSt !=
                          lpa_detalhes.icms.reducaoSt,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.reducaoSt.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.reducaoSt !=
                          lpa_detalhes.icms.reducaoSt,
                      }"
                    >
                      {{ lpa_detalhes.icms.reducaoSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS Interestadual -->
                  <tr>
                    <th class="text-left">Aliq. ICMS Interestadual</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.aliqInterestadual !=
                          lpa_detalhes.icms.aliqInterestadual,
                      }"
                    >
                      {{ lpa_detalhes.icmsAntes.aliqInterestadual.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.aliqInterestadual !=
                          lpa_detalhes.icms.aliqInterestadual,
                      }"
                    >
                      {{ lpa_detalhes.icms.aliqInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. Interestadual -->
                  <tr>
                    <th class="text-left">Red. BC Interestadual</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.reducaoBCInterestadual !=
                          lpa_detalhes.icms.reducaoBCInterestadual,
                      }"
                    >
                      {{
                        lpa_detalhes.icmsAntes.reducaoBCInterestadual.toFixed(2)
                      }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.reducaoBCInterestadual !=
                          lpa_detalhes.icms.reducaoBCInterestadual,
                      }"
                    >
                      {{ lpa_detalhes.icms.reducaoBCInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Código Benefício Fiscal -->
                  <tr>
                    <th class="text-left">Código Benefício Fiscal</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.codigoBeneficio !=
                          lpa_detalhes.icms.codigoBeneficio,
                      }"
                      v-if="
                        lpa_detalhes.icmsAntes.codigoBeneficio == '' ||
                        lpa_detalhes.icmsAntes.codigoBeneficio == null
                      "
                    >
                      Não se aplica
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.codigoBeneficio !=
                          lpa_detalhes.icms.codigoBeneficio,
                      }"
                      v-else
                    >
                      {{ lpa_detalhes.icmsAntes.codigoBeneficio }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.codigoBeneficio !=
                          lpa_detalhes.icms.codigoBeneficio,
                      }"
                      v-if="
                        lpa_detalhes.icmsAntes.codigoBeneficio == '' ||
                        lpa_detalhes.icmsAntes.codigoBeneficio == null
                      "
                    >
                      Não se aplica
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.codigoBeneficio !=
                          lpa_detalhes.icms.codigoBeneficio,
                      }"
                      v-else
                    >
                      {{ lpa_detalhes.icms.codigoBeneficio }}
                    </td>
                  </tr>
                  <!-- Emb. Legal -->
                  <tr>
                    <th class="text-left">Emb. Legal</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.baseLegal !=
                          lpa_detalhes.icms.baseLegal,
                      }"
                      v-if="
                        lpa_detalhes.icmsAntes.baseLegal == '' ||
                        lpa_detalhes.icms.baseLegal == null
                      "
                    >
                      -
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          lpa_detalhes.icmsAntes.baseLegal !=
                          lpa_detalhes.icms.baseLegal,
                      }"
                      v-else
                    >
                      {{ lpa_detalhes.icmsAntes.baseLegal }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.baseLegal !=
                          lpa_detalhes.icms.baseLegal,
                      }"
                      v-if="
                        lpa_detalhes.icmsAntes.baseLegal == '' ||
                        lpa_detalhes.icms.baseLegal == null
                      "
                    >
                      -
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          lpa_detalhes.icmsAntes.baseLegal !=
                          lpa_detalhes.icms.baseLegal,
                      }"
                      v-else
                    >
                      {{ lpa_detalhes.icms.baseLegal }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
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
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import helpers from "@/helpers";

const userStore = useAuthStore();

export default {
  props: {
    payload: Array,
    opcao_de_recarga_de_lista: Boolean,
    registros: Number,
  },
  data() {
    return {
      lpa_detalhes: {
        sku: 0,
        ean: "",
        produto: "",
        operacao: "",
        data: "",
        cfop: 0,
        finalidade: 0,
        ctrib: 0,
        ufOrigem: "",
        ufDestino: "",
        ncmAntes: "",
        ncm: "",
        exAntes: "",
        ex: "",
        cestAntes: "",
        cest: "",
        ipiAntes: "",
        ipi: "",
        pisCofinsAntes: "",
        pisCofins: "",
        icmsAntes: {
          aliq: 0,
          reducaoBC: 0,
          aliqInterestadual: 0,
          reducaoBCInterestadual: 0,
          aliqSt: 0,
          reducaoSt: 0,
          iva: 0,
          ivaAjustado: 0,
          fcp: 0,
          codigoBeneficio: "",
          cst: "",
          diferimento: 0,
          baseLegal: "",
        },
        icms: {
          aliq: 0,
          reducaoBC: 0,
          aliqInterestadual: 0,
          reducaoBCInterestadual: 0,
          aliqSt: 0,
          reducaoSt: 0,
          iva: 0,
          ivaAjustado: 0,
          fcp: 0,
          codigoBeneficio: "",
          cst: "",
          diferimento: 0,
          baseLegal: "",
        },
      },

      //----------------------------------------------------------------
      //#region Atribuições vindas das Props

      listaAlteracoes: this.payload,
      tabListaAtualizada: this.payload,
      opcaoDeRecarga: this.opcao_de_recarga_de_lista,
      tipoIntegracao: userStore.user.idSolucaoIntegracao,

      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Controle de Paginação

      lpa_pagina: 1, // (1) página corrente
      lpa_qtdePaginas: 1, // (2) qtde total de páginas
      lpa_limite: 25, // (3) limite de itens por página
      lpa_limites: [10, 25, 50, 100], // (4) controla o valor de 'limite'
      lpa_listaItens: [], // (5) lista de dados que serão exibidos
      lpa_listaItensPaginado: [], // (6) lista resultante dos cálculos de controle de paginação. É essa lista que será exibida.
      lpa_paginaNavegacao: [], // (7) lista auxiliar para o controle de paginação
      lpa_paginaEscolhida: null, // (8) página escolhida via INPUT

      //#endregion
      //----------------------------------------------------------------

      //----------------------------------------------------------------
      //#region Locais

      lpa_filtroDe: 0,
      lpa_filtroPara: 0,
      lpa_filtroPagina: "",
      lpa_filtroValor: "",
      lpa_filtro: 1,
      lpa_filtros: [
        {
          label: "Nenhum",
          value: 0,
        },
        {
          label: "SKU(s)",
          value: 1,
        },
      ],

      lpa_filtroTipo: 0,
      lpa_filtroTipos: [
        {
          label: "Implantação",
          value: 0,
        },
        {
          label: "Atualização",
          value: 1,
        },
      ],

      tabListaAtualizada: this.payload,
      tabAcao: 0,
      tabAcoes: [
        {
          label: "AÇÕES",
          value: 0,
        },
        {
          label: "Aprovar Todos",
          value: 1,
        },
        {
          label: "Declinar Todos",
          value: 2,
        },
        // {
        //     label: "Inativar Todos",
        //     value: 3
        // },
      ],

      skuEnvio: {},

      listaAceiteProcessando: false,
      tblResultadoListaAceiteMostrar: false,

      //#endregion
      //----------------------------------------------------------------
    };
  },

  methods: {
    OrganizarNavegacao() {
      if (this.lpa_pagina == "..." || this.lpa_pagina > this.lpa_qtdePaginas)
        return;

      this.lpa_pagina = parseInt(this.lpa_pagina);

      if (isNaN(this.lpa_pagina)) return;

      this.lpa_paginaNavegacao = [];

      if (this.lpa_pagina > 1) {
        let paginasAnteriores = this.lpa_pagina - 2;

        for (let z = paginasAnteriores; z < this.lpa_pagina; z++) {
          if (z > 0 && z != this.lpa_pagina) this.lpa_paginaNavegacao.push(z);
        }
      }

      this.lpa_paginaNavegacao.push(this.lpa_pagina);

      if (this.lpa_pagina != this.lpa_qtdePaginas) {
        let paginasPosteriores = this.lpa_pagina + 2;

        for (let x = this.lpa_pagina; x < paginasPosteriores; x++) {
          if (x != this.lpa_pagina) this.lpa_paginaNavegacao.push(x);
        }

        if (this.lpa_pagina - 3 < this.lpa_qtdePaginas - 5) {
          this.lpa_paginaNavegacao.push("...");
          this.lpa_paginaNavegacao.push(this.lpa_qtdePaginas);
        }
      }
    },

    Paginacao(itens) {
      let pagina = this.lpa_pagina;
      let qtdeLinhas = this.lpa_limite;
      let de = pagina * qtdeLinhas - qtdeLinhas;
      let para = pagina * qtdeLinhas;

      this.lpa_filtroDe = de <= 0 ? 1 : de + 1;
      this.lpa_filtroPara = para > this.registros ? this.registros : para;

      // this.lpa_listaItensPaginado = itens.slice(de, para);
      this.lpa_listaItensPaginado = [...itens];

      return this.lpa_listaItensPaginado;
    },

    PaginarTabela() {
      // let tamanhoTotal = this.listaAlteracoes.length;
      let tamanhoTotal = this.registros;
      let qtdeLinhas = this.lpa_limite;
      let totalLinhas = tamanhoTotal;
      let paginas = Math.ceil(totalLinhas / qtdeLinhas);

      this.lpa_qtdePaginas = 0;

      for (let i = 0; i < paginas; i++) {
        this.lpa_qtdePaginas++;
      }

      this.OrganizarNavegacao();
    },

    LpaFiltrarLista(filtro) {
      if (filtro.lpa_filtro == 1)
        filtro.lpa_filtroValor = filtro.lpa_filtroValor.toUpperCase();

      this.$emit("emit-aplicar-filtro-lista-aceite", filtro);

      this.lpa_paginaEscolhida = "";
      // this.lpa_filtroValor = ""; conforme tarefa https://ti-imendes.atlassian.net/browse/APP-848
    },

    AcoesEmLote() {
      switch (this.tabAcao) {
        case 1:
          this.AceitarTodos();
          break;

        case 2:
          this.DeclinarTodos();
          break;

        case 3:
          this.InativarTodos();
          break;

        default:
          break;
      }
      this.tabAcao = 0;
    },

    AceitarTodos() {
      let lista = [...this.listaAlteracoes];

      lista.forEach((el) => {
        el.status = 0;
      });
      this.tabListaAtualizada = [...lista];
    },

    DeclinarTodos() {
      let lista = [...this.listaAlteracoes];

      lista.forEach((el) => {
        el.status = 1;
      });
      this.tabListaAtualizada = [...lista];
    },

    InativarTodos() {
      let lista = [...this.listaAlteracoes];

      lista.forEach((el) => {
        el.status = 2;
      });
      this.tabListaAtualizada = [...lista];
    },

    RecarregarLista(param) {
      var params = new Object();

      params.modo = this.lpa_filtroTipo;
      params.recarregar = param;

      this.$emit("emit-recarregar-lista-aceite", params);
      this.listaAceiteProcessando = false;
    },

    ConfirmarAceite(listaAlteracoes) {
      if (this.tipoIntegracao == "52") {
        Swal.fire({
          title: "Controle de Aceite",
          text: "Confirma o envio dos SKUs com suas respectivas marcações?",
          icon: "question",
          showCancelButton: true,

          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",

          confirmButtonText: "Sim, enviar!",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            const objAceite = new Object();

            objAceite.tipo = this.lpa_filtroTipo;
            objAceite.listaAlteracoes = listaAlteracoes;

            this.listaAceiteProcessando = true;
            this.$emit("emit-confirmar-lista-aceite", objAceite);
          }
        });
      } else if (this.tipoIntegracao == "53") {
        const objAceite = new Object();

        objAceite.tipo = this.lpa_filtroTipo;
        objAceite.listaAlteracoes = listaAlteracoes;

        this.listaAceiteProcessando = true;
        this.$emit("emit-confirmar-lista-aceite", objAceite);
      }
    },

    // Recebo os dados sa SessionStorage
    // Verifico se são válidos
    // Crio uma string para o processamento do filtro
    // Alimento o campo para o filtro e seleciono o tipo de filtro que será usado.
    // Aciono o Elemento do formulário para executar o filtro
    // Limpo a Session Storage
    // Limpo o campo de filtro
    LpaFiltrarListaComSkusDaConsultaDirecionada() {
      const dadosVindosDaConsultaDirecionada = sessionStorage.getItem(
        "consultaDirecionada"
      );

      if (dadosVindosDaConsultaDirecionada) {
        const lstSkus = JSON.parse(dadosVindosDaConsultaDirecionada);
        let listaRetorno = "";

        lstSkus.produtos.forEach((el) => {
          listaRetorno += `${el.sku};`;
        });
        this.lpa_filtroValor = listaRetorno.substring(
          0,
          listaRetorno.length - 1
        );
        this.lpa_filtro = 1;

        const btnLupaSkuFiltro = document.getElementById("lupa-sku-filtro");
        btnLupaSkuFiltro.click();

        sessionStorage.removeItem("consultaDirecionada");
        this.lpa_filtroValor = "";

        this.AceitarTodos();
      }
    },

    ConsultDetails(detalhe) {
      this.lpa_detalhes = detalhe;

      $("#modalDetalhesListaAceite").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
      });
    },
    ExportarXLSXDownload(idTabela) {
      helpers.GerarPlanilhaXLSXCSV(
        idTabela,
        "Exportação GT Integrado - Atualizações Tributárias",
        "xlsx"
      );
    },
  },

  created() {},

  mounted() {
    this.LpaFiltrarListaComSkusDaConsultaDirecionada();
    this.AceitarTodos();
    this.PaginarTabela();
  },

  watch: {
    // Verificar se a pagina é menor que a quantidade total, ou se a página é igua a '...'
    lpa_pagina: function (newPage, lastPage) {
      if (newPage == "..." || newPage > this.lpa_qtdePaginas)
        this.lpa_pagina = lastPage;
    },

    registros: function (newPage, lastPage) {
      this.PaginarTabela();
    },

    payload: {
      immediate: true,
      deep: true,
      handler() {
        this.listaAlteracoes = this.payload;
      },
    },

    tabListaAtualizada: {
      deep: true,
      handler() {
        this.listaAlteracoes = this.tabListaAtualizada;
      },
    },
  },

  computed: {
    Paginar() {
      if (this.listaAlteracoes) {
        return this.Paginacao(this.listaAlteracoes);
      }
    },
  },
};
</script>

<style></style>
