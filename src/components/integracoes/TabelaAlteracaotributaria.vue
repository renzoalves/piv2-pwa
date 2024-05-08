<template>
  <div class="row">
    <div class="col-12">
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
          v-model="altTrib_filtro"
          style="cursor: pointer"
        >
          <option
            v-for="(item, i) in altTrib_filtros"
            v-bind:value="item.value"
            :key="i"
          >
            {{ item.label }}
          </option>
        </select>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5 float-left mb-2 mt-2">
        <span>&nbsp;</span>
        <input
          type="text"
          class="form-control form-control-sm valor"
          placeholder="Informe o valor para o filtro..."
          v-on:keyup.enter="
            FiltrarLista({
              altTrib_filtroTipo,
              altTrib_filtro,
              altTrib_filtroValor,
              altTrib_limite,
            })
          "
          v-model="altTrib_filtroValor"
        />

        <div
          id="lupa"
          v-on:click="
            FiltrarLista({
              altTrib_filtroTipo,
              altTrib_filtro,
              altTrib_filtroValor,
              altTrib_limite,
            })
          "
        >
          <i class="fa fa-search lupa" title="Aplicar filtro."></i>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-2 col-xl-2 float-right mb-2 mt-3">
        <input
          type="number"
          class="form-control form-control-sm valor"
          placeholder="Página"
          v-model="altTrib_paginaEscolhida"
          v-on:keyup.enter="
            altTrib_pagina = altTrib_paginaEscolhida;
            FiltrarLista({
              altTrib_filtroTipo,
              altTrib_filtro,
              altTrib_filtroValor,
              altTrib_limite,
              altTrib_paginaEscolhida,
            });
            OrganizarNavegacao();
          "
        />

        <div
          id="lupa"
          v-on:click="
            altTrib_pagina = altTrib_paginaEscolhida;
            FiltrarLista({
              altTrib_filtroTipo,
              altTrib_filtro,
              altTrib_filtroValor,
              altTrib_limite,
              altTrib_paginaEscolhida,
            });
            OrganizarNavegacao();
          "
        >
          <i class="fa fa-search lupa"></i>
        </div>
      </div>

      <div class="col-sm-12 col-md-6 col-lg-1 col-lx-1 float-right mb-2 mt-3">
        <select
          class="form-control form-control-sm"
          v-model="altTrib_limite"
          title="Altera o limite de linhas por página."
          v-on:change="
            altTrib_pagina = 1;
            FiltrarLista({
              altTrib_filtroTipo,
              altTrib_filtro,
              altTrib_filtroValor,
              altTrib_limite,
            });
            PaginarTabela();
          "
        >
          <option
            v-for="(item, i) in altTrib_limites"
            v-bind:value="item"
            :key="i"
          >
            {{ item }}
          </option>
        </select>
      </div>
    </div>

    <div class="col-12">
      <div class="row">
        <div
          class="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-left mb-1 mt-1"
        ></div>

        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 text-right mb-1 mt-1">
          <span
            >Pagina {{ altTrib_pagina }} de
            {{ altTrib_qtdePaginas <= 0 ? 1 : altTrib_qtdePaginas }}.</span
          >
        </div>
      </div>
    </div>

    <table
      class="table table-responsive"
      id="tblResultadoPrincipal"
      v-show="tblResultadoPrincipalMostrar"
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
            <th class="text-center">SKU</th>
            <th class="text-center">EAN</th>
            <th class="text-left">Descrição</th>
            <th class="text-center">Operação</th>
            <th class="text-center">UF Orig.</th>
            <th class="text-center">UF Dest.</th>
            <th class="text-center">NCM</th>
            <th class="text-center">PIS/COFINS</th>
            <th class="text-center">CFOP</th>
            <th class="text-center">CST</th>
            <th class="text-center">Detalhes</th>
          </tr>
        </thead>

        <tbody>
          <template v-for="(item, index) in Paginar" v-bind:key="index">
            <tr>
              <td class="text-center">{{ item.sku }}</td>
              <td class="text-center">{{ item.ean }}</td>
              <td class="text-left">{{ item.produto }}</td>
              <td class="text-center">{{ item.operacao }}</td>
              <td class="text-center">{{ item.ufDestino }}</td>
              <td class="text-center">{{ item.ufOrigem }}</td>
              <td class="text-center">{{ item.ncm }}</td>
              <td class="text-center">{{ item.pisCofins }}</td>
              <td class="text-center">{{ item.cfop }}</td>
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
        @click="ExportarXLSXDownload('tblResultadoPrincipal')"
      >
        Exportar
      </button>
    </div> -->

    <template v-if="altTrib_qtdePaginas > 1">
      <div class="col-md-5 col-lg-7 mb-1 mr-0 mt-3">
        <nav
          class="d-lg-flex justify-content-end overflow-auto"
          aria-label="xyz"
        >
          <ul class="pagination">
            <li class="page-item" v-if="altTrib_pagina != 1">
              <a
                class="page-link"
                v-on:click.prevent.stop="
                  altTrib_pagina = 1;
                  altTrib_paginaEscolhida = altTrib_pagina;
                  FiltrarLista({
                    altTrib_filtroTipo,
                    altTrib_filtro,
                    altTrib_filtroValor,
                    altTrib_limite,
                    altTrib_paginaEscolhida,
                  });
                  OrganizarNavegacao();
                "
                href="#"
              >
                <i class="fas fa-angle-double-left"></i>
              </a>
            </li>

            <li class="page-item" v-if="altTrib_pagina != 1">
              <a
                class="page-link"
                v-on:click.prevent.stop="
                  altTrib_pagina--;
                  altTrib_paginaEscolhida = altTrib_pagina;
                  FiltrarLista({
                    altTrib_filtroTipo,
                    altTrib_filtro,
                    altTrib_filtroValor,
                    altTrib_limite,
                    altTrib_paginaEscolhida,
                  });
                  OrganizarNavegacao();
                "
                href="#"
              >
                <i class="fas fa-angle-left"></i>
              </a>
            </li>

            <li
              v-for="item in altTrib_paginaNavegacao"
              :key="item"
              class="page-item"
              :class="{ active: item === altTrib_pagina }"
              v-on:click.prevent.stop="
                altTrib_pagina = item;
                altTrib_paginaEscolhida = altTrib_pagina;
                FiltrarLista({
                  altTrib_filtroTipo,
                  altTrib_filtro,
                  altTrib_filtroValor,
                  altTrib_limite,
                  altTrib_paginaEscolhida,
                });
                OrganizarNavegacao();
              "
            >
              <a class="page-link" href="#">{{ item }}</a>
            </li>

            <li
              class="page-item"
              v-if="altTrib_pagina < altTrib_qtdePaginas"
              v-on:click.prevent.stop="
                altTrib_pagina++;
                altTrib_paginaEscolhida = altTrib_pagina;
                FiltrarLista({
                  altTrib_filtroTipo,
                  altTrib_filtro,
                  altTrib_filtroValor,
                  altTrib_limite,
                  altTrib_paginaEscolhida,
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
              v-if="
                altTrib_qtdePaginas > 1 && altTrib_pagina < altTrib_qtdePaginas
              "
              v-on:click.prevent.stop="
                altTrib_pagina = altTrib_qtdePaginas;
                altTrib_paginaEscolhida = altTrib_pagina;
                FiltrarLista({
                  altTrib_filtroTipo,
                  altTrib_filtro,
                  altTrib_filtroValor,
                  altTrib_limite,
                  altTrib_paginaEscolhida,
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
      id="modalDDdetalhes"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h6 class="modal-title" id="exampleModalLongTitle">
              {{ altTrib_detalhes.sku }} - {{ altTrib_detalhes.produto }}
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
                        altTrib_detalhes.ncmAntes != altTrib_detalhes.ncm,
                    }"
                    v-if="altTrib_detalhes.ncmAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.ncmAntes != altTrib_detalhes.ncm,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.ncmAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        altTrib_detalhes.ncmAntes != altTrib_detalhes.ncm,
                    }"
                    v-if="altTrib_detalhes.ncm == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        altTrib_detalhes.ncmAntes != altTrib_detalhes.ncm,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.ncm }}
                  </td>
                </tr>
                <!-- EX -->
                <tr>
                  <th class="text-left">Ex</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.exAntes != altTrib_detalhes.ex,
                    }"
                    v-if="altTrib_detalhes.exAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.exAntes != altTrib_detalhes.ex,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.exAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.exAntes != altTrib_detalhes.ex,
                    }"
                    v-if="altTrib_detalhes.exAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        altTrib_detalhes.exAntes != altTrib_detalhes.ex,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.ex }}
                  </td>
                </tr>
                <!-- CEST -->
                <tr>
                  <th class="text-left">CEST</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.cestAntes != altTrib_detalhes.cest,
                    }"
                    v-if="altTrib_detalhes.cestAntes == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.cestAntes != altTrib_detalhes.cest,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.cestAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.cestAntes != altTrib_detalhes.cest,
                    }"
                    v-if="altTrib_detalhes.cest == ''"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        altTrib_detalhes.cestAntes != altTrib_detalhes.cest,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.cest }}
                  </td>
                </tr>
                <!-- PIS/COFINS -->
                <tr>
                  <th class="text-left">PIS/COFINS</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.pisCofinsAntes !=
                        altTrib_detalhes.pisCofins,
                    }"
                    v-if="altTrib_detalhes.pisCofinsAntes == null"
                  >
                    -
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.pisCofinsAntes !=
                        altTrib_detalhes.pisCofins,
                    }"
                    v-else
                  >
                    {{ altTrib_detalhes.pisCofinsAntes }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        altTrib_detalhes.pisCofinsAntes !=
                        altTrib_detalhes.pisCofins,
                    }"
                  >
                    {{ altTrib_detalhes.pisCofins }}
                  </td>
                </tr>
                <!-- CFOP -->
                <tr>
                  <th class="text-left">CFOP</th>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-antes':
                        altTrib_detalhes.cfop != altTrib_detalhes.cfop,
                    }"
                  >
                    {{ altTrib_detalhes.cfop }}
                  </td>
                  <td
                    class="text-right"
                    :class="{
                      'indicacao-alteracao-depois':
                        altTrib_detalhes.cfop != altTrib_detalhes.cfop,
                    }"
                  >
                    {{ altTrib_detalhes.cfop }}
                  </td>
                </tr>
                <template v-if="altTrib_detalhes.icmsAntes == null">
                  <!-- CST ICMS-->
                  <tr>
                    <th class="text-left">CST ICMS</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.cst }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS -->
                  <tr>
                    <th class="text-left">Aliq. ICMS</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.aliq.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- FCP -->
                  <tr>
                    <th class="text-left">FCP</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.fcp.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. -->
                  <tr>
                    <th class="text-left">Red. BC ICMS</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.reducaoBC.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Diferimento -->
                  <tr>
                    <th class="text-left">Diferimento</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.diferimento.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliquota ICMS ST -->
                  <tr>
                    <th class="text-left">Aliq. ICMS ST</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.aliqSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA -->
                  <tr>
                    <th class="text-left">IVA</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.iva.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA Ajustado -->
                  <tr>
                    <th class="text-left">IVA Ajust.</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.ivaAjustado.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC ST -->
                  <tr>
                    <th class="text-left">Red. BC ST</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.reducaoSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS Interestadual -->
                  <tr>
                    <th class="text-left">Aliq. ICMS Interestadual</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{ altTrib_detalhes.icms.aliqInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. Interestadual -->
                  <tr>
                    <th class="text-left">Red. BC Interestadual</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td class="text-right indicacao-alteracao-depois">
                      {{
                        altTrib_detalhes.icms.reducaoBCInterestadual.toFixed(2)
                      }}
                    </td>
                  </tr>
                  <!-- Código Benefício Fiscal -->
                  <tr>
                    <th class="text-left">Código Benefício Fiscal</th>
                    <td class="text-right indicacao-alteracao-antes">-</td>
                    <td
                      class="text-right indicacao-alteracao-depois"
                      v-if="
                        altTrib_detalhes.icms.codigoBeneficio == '' ||
                        altTrib_detalhes.icms.codigoBeneficio == null
                      "
                    >
                      Não se aplica
                    </td>
                    <td class="text-right indicacao-alteracao-depois" v-else>
                      {{ altTrib_detalhes.icms.codigoBeneficio }}
                    </td>
                  </tr>
                  <!-- Emb. Legal -->
                  <tr>
                    <th class="text-left">Emb. Legal</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icms.baseLegal == '' ||
                          altTrib_detalhes.icms.baseLegal == null,
                      }"
                    >
                      -
                    </td>
                    <td
                      class="text-right"
                      v-if="
                        altTrib_detalhes.icms.baseLegal == '' ||
                        altTrib_detalhes.icms.baseLegal == null
                      "
                    >
                      -
                    </td>
                    <td class="text-right" v-else>
                      {{ altTrib_detalhes.icms.baseLegal }}
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
                          altTrib_detalhes.icmsAntes.cst !=
                          altTrib_detalhes.icms.cst,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.cst }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.cst !=
                          altTrib_detalhes.icms.cst,
                      }"
                    >
                      {{ altTrib_detalhes.icms.cst }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS -->
                  <tr>
                    <th class="text-left">Aliq. ICMS</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.aliq !=
                          altTrib_detalhes.icms.aliq,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.aliq.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.aliq !=
                          altTrib_detalhes.icms.aliq,
                      }"
                    >
                      {{ altTrib_detalhes.icms.aliq.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- FCP -->
                  <tr>
                    <th class="text-left">FCP</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.fcp !=
                          altTrib_detalhes.icms.fcp,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.fcp.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.fcp !=
                          altTrib_detalhes.icms.fcp,
                      }"
                    >
                      {{ altTrib_detalhes.icms.fcp.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. -->
                  <tr>
                    <th class="text-left">Red. BC ICMS</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.reducaoBC !=
                          altTrib_detalhes.icms.reducaoBC,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.reducaoBC.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.reducaoBC !=
                          altTrib_detalhes.icms.reducaoBC,
                      }"
                    >
                      {{ altTrib_detalhes.icms.reducaoBC.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Diferimento -->
                  <tr>
                    <th class="text-left">Diferimento</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.diferimento !=
                          altTrib_detalhes.icms.diferimento,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.diferimento.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.diferimento !=
                          altTrib_detalhes.icms.diferimento,
                      }"
                    >
                      {{ altTrib_detalhes.icms.diferimento.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliquota ICMS ST -->
                  <tr>
                    <th class="text-left">Aliq. ICMS ST</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.aliqSt !=
                          altTrib_detalhes.icms.aliqSt,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.aliqSt.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.aliqSt !=
                          altTrib_detalhes.icms.aliqSt,
                      }"
                    >
                      {{ altTrib_detalhes.icms.aliqSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA -->
                  <tr>
                    <th class="text-left">IVA</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.iva !=
                          altTrib_detalhes.icms.iva,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.iva.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.iva !=
                          altTrib_detalhes.icms.iva,
                      }"
                    >
                      {{ altTrib_detalhes.icms.iva.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- IVA Ajustado -->
                  <tr>
                    <th class="text-left">IVA Ajust.</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.ivaAjustado !=
                          altTrib_detalhes.icms.ivaAjustado,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.ivaAjustado.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.ivaAjustado !=
                          altTrib_detalhes.icms.ivaAjustado,
                      }"
                    >
                      {{ altTrib_detalhes.icms.ivaAjustado.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC ST -->
                  <tr>
                    <th class="text-left">Red. BC ST</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.reducaoSt !=
                          altTrib_detalhes.icms.reducaoSt,
                      }"
                    >
                      {{ altTrib_detalhes.icmsAntes.reducaoSt.toFixed(2) }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.reducaoSt !=
                          altTrib_detalhes.icms.reducaoSt,
                      }"
                    >
                      {{ altTrib_detalhes.icms.reducaoSt.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Aliq. ICMS Interestadual -->
                  <tr>
                    <th class="text-left">Aliq. ICMS Interestadual</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.aliqInterestadual !=
                          altTrib_detalhes.icms.aliqInterestadual,
                      }"
                    >
                      {{
                        altTrib_detalhes.icmsAntes.aliqInterestadual.toFixed(2)
                      }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.aliqInterestadual !=
                          altTrib_detalhes.icms.aliqInterestadual,
                      }"
                    >
                      {{ altTrib_detalhes.icms.aliqInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <!-- Red. BC. Interestadual -->
                  <tr>
                    <th class="text-left">Red. BC Interestadual</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.reducaoBCInterestadual !=
                          altTrib_detalhes.icms.reducaoBCInterestadual,
                      }"
                    >
                      {{
                        altTrib_detalhes.icmsAntes.reducaoBCInterestadual.toFixed(
                          2
                        )
                      }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.reducaoBCInterestadual !=
                          altTrib_detalhes.icms.reducaoBCInterestadual,
                      }"
                    >
                      {{
                        altTrib_detalhes.icms.reducaoBCInterestadual.toFixed(2)
                      }}
                    </td>
                  </tr>
                  <!-- Código Benefício Fiscal -->
                  <tr>
                    <th class="text-left">Código Benefício Fiscal</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.codigoBeneficio !=
                          altTrib_detalhes.icms.codigoBeneficio,
                      }"
                      v-if="
                        altTrib_detalhes.icmsAntes.codigoBeneficio == '' ||
                        altTrib_detalhes.icmsAntes.codigoBeneficio == null
                      "
                    >
                      Não se aplica
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.codigoBeneficio !=
                          altTrib_detalhes.icms.codigoBeneficio,
                      }"
                      v-else
                    >
                      {{ altTrib_detalhes.icmsAntes.codigoBeneficio }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.codigoBeneficio !=
                          altTrib_detalhes.icms.codigoBeneficio,
                      }"
                      v-if="
                        altTrib_detalhes.icmsAntes.codigoBeneficio == '' ||
                        altTrib_detalhes.icmsAntes.codigoBeneficio == null
                      "
                    >
                      Não se aplica
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.codigoBeneficio !=
                          altTrib_detalhes.icms.codigoBeneficio,
                      }"
                      v-else
                    >
                      {{ altTrib_detalhes.icms.codigoBeneficio }}
                    </td>
                  </tr>
                  <!-- Emb. Legal -->
                  <tr>
                    <th class="text-left">Emb. Legal</th>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.baseLegal !=
                          altTrib_detalhes.icms.baseLegal,
                      }"
                      v-if="
                        altTrib_detalhes.icmsAntes.baseLegal == '' ||
                        altTrib_detalhes.icmsAntes.baseLegal == null
                      "
                    >
                      -
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-antes':
                          altTrib_detalhes.icmsAntes.baseLegal !=
                          altTrib_detalhes.icms.baseLegal,
                      }"
                      v-else
                    >
                      {{ altTrib_detalhes.icmsAntes.baseLegal }}
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.baseLegal !=
                          altTrib_detalhes.icms.baseLegal,
                      }"
                      v-if="
                        altTrib_detalhes.icmsAntes.baseLegal == '' ||
                        altTrib_detalhes.icmsAntes.baseLegal == null
                      "
                    >
                      -
                    </td>
                    <td
                      class="text-right"
                      :class="{
                        'indicacao-alteracao-depois':
                          altTrib_detalhes.icmsAntes.baseLegal !=
                          altTrib_detalhes.icms.baseLegal,
                      }"
                      v-else
                    >
                      {{ altTrib_detalhes.icms.baseLegal }}
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
import helpers from "@/helpers";
export default {
  props: {
    payload: Array,
    registros: Number,
  },
  data() {
    return {
      listaAlteracoes: this.payload,
      listaSkus: "",
      tblResultadoPrincipalMostrar: false,

      altTrib_pagina: 1, // (1) página corrente
      altTrib_qtdePaginas: 1, // (2) qtde total de páginas
      altTrib_limite: 25, // (3) limite de itens por página
      altTrib_limites: [10, 25, 50, 100], // (4) controla o valor de 'limite'
      altTrib_listaItens: [], // (5) lista de dados que serão exibidos
      altTrib_listaItensPaginado: [], // (6) lista resultante dos cálculos de controle de paginação. É essa lista que será exibida.
      altTrib_paginaNavegacao: [], // (7) lista auxiliar para o controle de paginação
      altTrib_paginaEscolhida: null, // (8) página escolhida via INPUT

      altTrib_filtroDe: 0,
      altTrib_filtroPara: 0,
      altTrib_filtroPagina: "",
      altTrib_filtroValor: "",
      altTrib_filtro: 2,
      altTrib_filtros: [
        {
          label: "Nenhum",
          value: 0,
        },
        // {
        //     label: 'Tipo',
        //     value: 1
        // },
        {
          label: "SKU(s)",
          value: 2,
        },
      ],

      altTrib_filtroTipo: 0,
      altTrib_filtroTipos: [
        {
          label: "Implantação",
          value: 0,
        },
        {
          label: "Atualização",
          value: 1,
        },
      ],

      // Detalhes
      altTrib_detalhes: {
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
    };
  },

  methods: {
    OrganizarNavegacao() {
      if (
        this.altTrib_pagina == "..." ||
        this.altTrib_pagina > this.altTrib_qtdePaginas
      )
        return;

      this.altTrib_pagina = parseInt(this.altTrib_pagina);

      if (isNaN(this.altTrib_pagina)) return;

      this.altTrib_paginaNavegacao = [];

      if (this.altTrib_pagina > 1) {
        let paginasAnteriores = this.altTrib_pagina - 2;

        for (let z = paginasAnteriores; z < this.altTrib_pagina; z++) {
          if (z > 0 && z != this.altTrib_pagina)
            this.altTrib_paginaNavegacao.push(z);
        }
      }

      this.altTrib_paginaNavegacao.push(this.altTrib_pagina);

      if (this.altTrib_pagina != this.altTrib_qtdePaginas) {
        let paginasPosteriores = this.altTrib_pagina + 2;

        for (let x = this.altTrib_pagina; x < paginasPosteriores; x++) {
          if (x != this.altTrib_pagina) this.altTrib_paginaNavegacao.push(x);
        }

        if (this.altTrib_pagina - 3 < this.altTrib_qtdePaginas - 5) {
          this.altTrib_paginaNavegacao.push("...");
          this.altTrib_paginaNavegacao.push(this.altTrib_qtdePaginas);
        }
      }
    },

    Paginacao(itens) {
      let pagina = this.altTrib_pagina;
      let qtdeLinhas = this.altTrib_limite;
      let de = pagina * qtdeLinhas - qtdeLinhas;
      let para = pagina * qtdeLinhas;

      this.altTrib_filtroDe = de <= 0 ? 1 : de + 1;
      this.altTrib_filtroPara = para > this.registros ? this.registros : para;

      // this.altTrib_listaItensPaginado = itens.slice(de, para);
      this.altTrib_listaItensPaginado = [...itens];

      return this.altTrib_listaItensPaginado;
    },

    PaginarTabela() {
      // let tamanhoTotal = this.listaAlteracoes.length;
      let tamanhoTotal = this.registros;
      let qtdeLinhas = this.altTrib_limite;
      let totalLinhas = tamanhoTotal;
      let paginas = Math.ceil(totalLinhas / qtdeLinhas);

      this.altTrib_qtdePaginas = 0;

      for (let i = 0; i < paginas; i++) {
        this.altTrib_qtdePaginas++;
      }

      this.OrganizarNavegacao();
    },

    FiltrarLista(filtro) {
      if (filtro.altTrib_filtro == 1)
        filtro.altTrib_filtroValor = filtro.altTrib_filtroValor.toUpperCase();

      this.$emit("emit-aplicar-filtro", filtro);

      this.altTrib_paginaEscolhida = "";
      this.altTrib_filtroValor = "";
    },

    ConsultDetails(detalhe) {
      this.altTrib_detalhes = detalhe;

      $("#modalDDdetalhes").modal({
        show: true,
        backdrop: "static",
        keyboard: false,
      });
    },
    ExportarXLSXDownload(idTabela) {
      helpers.GerarPlanilhaXLSXCSV(
        idTabela,
        "Exportação GT Integrado - Alterações Tributárias",
        "xlsx"
      );
    },
  },

  created() {},

  mounted() {
    this.PaginarTabela();
  },

  watch: {
    // Verificar se a pagina é menor que a quantidade total, ou se a página é igua a '...'
    altTrib_pagina: function (newPage, lastPage) {
      if (newPage == "..." || newPage > this.altTrib_qtdePaginas)
        this.altTrib_pagina = lastPage;
    },

    registros: function (newPage, lastPage) {
      this.PaginarTabela();
    },

    payload: {
      immediate: true,
      handler() {
        this.listaAlteracoes = this.payload;
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

  //   mixins: [methodsSankhya, methodsBluesoft, mxIntegracoes],
};
</script>

<style></style>
