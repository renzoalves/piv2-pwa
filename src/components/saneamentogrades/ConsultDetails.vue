<template>
  <!-- MODAL DETALHES -->
  <div class="modal fade bd-example-modal-lg" id="modalDdetalhes" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">

        <div class="modal-header">
          <h6 class="modal-title" id="exampleModalLongTitle">
            {{ p_detalhes.descricao }}
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

            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#pmpf"
                role="tab"
                aria-controls="settings"
                >Pauta (R$)</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#acordo"
                role="tab"
                aria-controls="settings"
                >Acordos</a
              >
            </li>
          </ul>

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
                      CST Entrada
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DA SITUAÇÃO TRIBUTÁRIA DE ENTRADA"
                      ></i>
                    </th>
                    <td v-if="p_detalhes.pisCofins.cstEnt">
                      {{ p_detalhes.pisCofins.cstEnt }}
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
                    <td v-if="p_detalhes.pisCofins.cstSai">
                      {{ p_detalhes.pisCofins.cstSai }}
                    </td>
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
                    <td>{{ p_detalhes.pisCofins.aliqPis }}</td>
                  </tr>
                  <tr>
                    <th>
                      Aliq. COFINS(%)
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DA CONTRIBUIÇÃO PARA O FINANCIAMENTO DA SEGURIDADE SOCIAL"
                      ></i>
                    </th>
                    <td>{{ p_detalhes.pisCofins.aliqCofins }}</td>
                  </tr>
                  <tr>
                    <th>
                      NRI
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO NATUREZA DA RECEITA ISENTA"
                      ></i>
                    </th>
                    <td v-if="p_detalhes.pisCofins.nri">
                      {{ p_detalhes.pisCofins.nri }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      Red. Pis(%)
                      <i class="fas fa-info-circle" title=""></i>
                    </th>
                    <td v-if="p_detalhes.pisCofins.redPis">
                      {{ p_detalhes.pisCofins.redPis }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      Red. Cofins(%)
                      <i class="fas fa-info-circle" title=""></i>
                    </th>
                    <td v-if="p_detalhes.pisCofins.redCofins">
                      {{ p_detalhes.pisCofins.redCofins }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>

              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
              >
                <thead>
                  <th>Amparo Legal</th>
                </thead>
                <tbody>
                  <tr>
                    <td v-if="p_detalhes.pisCofins.ampLegal">{{ p_detalhes.pisCofins.ampLegal }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>
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
                    <td v-if="p_detalhes.ipi.cstEnt">
                      {{ p_detalhes.ipi.cstEnt }}
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
                    <td v-if="p_detalhes.ipi.cstSai">
                      {{ p_detalhes.ipi.cstSai }}
                    </td>
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
                    <td>{{ p_detalhes.ipi.aliqipi }}</td>
                  </tr>
                  <tr>
                    <th>
                      Cód. Enq
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DE ENQUADRAMENTO DO IPI"
                      ></i>
                    </th>
                    <td v-if="p_detalhes.ipi.codenq">
                      {{ p_detalhes.ipi.codenq }}
                    </td>
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
                    <td v-if="p_detalhes.ipi.ex">{{ p_detalhes.ipi.ex }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>

              <div class="alert alert-info mb-2" role="alert">
                Para mais informações acesse:<a
                  href="https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/documentos-e-arquivos/tp_detalhes.ipi.pdf"
                  target="_blank"
                  ><span> TIPI</span></a
                >
              </div>
              <br />

              <div v-if="p_detalhes.ipi.amparo != ''">
                <table
                  class="table table-sm table-bordered tableDetails"
                  id="tablePis"
                  v-if="
                    p_detalhes.ipi.amparo && p_detalhes.ipi.amparo.length > 0
                  "
                >
                  <thead>
                    <tr>
                      <th>Amparo legal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr id="">
                      <td v-if="p_detalhes.ipi.amparo" class="text-justify">{{ p_detalhes.ipi.amparo }}</td>
                      <td v-else>-</td>
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
                  <th scope="col">ICMS Interno</th>
                  <th scope="col">ICMS Interestadual</th>
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
                    <td v-if="p_detalhes.icms.cFOP">
                      {{ p_detalhes.icms.cFOP }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      CST
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO FISCAL DE OPERAÇÕES E PRESTAÇÕES"
                      ></i>
                    </th>
                    <td v-if="p_detalhes.icms.cST">
                      {{ p_detalhes.icms.cST }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      CSOSN
                      <i
                        class="fas fa-info-circle"
                        title="CÓDIGO DE SITUAÇÃO DA OPERAÇÃO DO SIMPLES NACIONAL"
                      ></i>
                    </th>
                    <td v-if="p_detalhes.icms.cSOSN">
                      {{ p_detalhes.icms.cSOSN }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      %Aliq. ICMS
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DO ICMS"
                      ></i>
                    </th>
                    <td>
                      {{ p_detalhes.icms.aliqIcmsInterna.toFixed(2) }}
                    </td>
                    <td v-if="p_detalhes.icms.aliqIcmsInterestadual">
                      {{ p_detalhes.icms.aliqIcmsInterestadual.toFixed(2) }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>
                      %Aliq. ICMS ST
                      <i
                        class="fas fa-info-circle"
                        title="ALÍQUOTA DA SUBSTITUIÇÃO TRIBUTÁRIA DO ICMS"
                      ></i>
                    </th>
                    <td>
                      {{ p_detalhes.icms.aliqIcmsSt.toFixed(2) }}
                    </td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      %Red. B.C
                      <i
                        class="fas fa-info-circle"
                        title="REDUÇÃO BASE DE CÁLCULO ICMS"
                      ></i>
                    </th>
                    <td>
                      {{ p_detalhes.icms.reducaoBcIcms.toFixed(2) }}
                    </td>
                    <td>
                      {{ p_detalhes.icms.redBcICMsInterestadual.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <th>
                      %Red. B.C ST
                      <i
                        class="fas fa-info-circle"
                        title="REDUÇÃO BASE DE CÁLCULO DA SUBSTITUIÇÃO TRIBUTÁRIA DO ICMS"
                      ></i>
                    </th>
                    <td>
                      {{ p_detalhes.icms.reducaoBcIcmsSt.toFixed(2) }}
                    </td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      %IVA
                      <i
                        class="fas fa-info-circle"
                        title="IMPOSTO SOBRE O VALOR ACRESCENTADO"
                      ></i>
                    </th>
                    <td>{{ p_detalhes.icms.iVA.toFixed(2) }}</td>
                    <td>{{ p_detalhes.icms.iVAAjust.toFixed(2) }}</td>
                  </tr>
                  <tr>
                    <th>
                      %FCP
                      <i
                        class="fas fa-info-circle"
                        title="FUNDO DE COMBATE A POBREZA"
                      ></i>
                    </th>
                    <td>{{ p_detalhes.icms.fCP.toFixed(2) }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      %ICMS Diferimento
                      <i class="fas fa-info-circle" title=""></i>
                    </th>
                    <td>{{ p_detalhes.icms.pDifer.toFixed(2) }}</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      %ICMS Desonerado
                      <i class="fas fa-info-circle" title=""></i>
                    </th>
                    <td>{{ p_detalhes.icms.pICMSDeson.toFixed(2) }}</td>
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
                    <td v-if="p_detalhes.icms.codBenef">
                      {{ p_detalhes.icms.codBenef }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>
                      Tipo Calc. Difal
                      <i class="fas fa-info-circle" title=""></i>
                    </th>
                    <td>{{ p_detalhes.icms.tpCalcDifal }}</td>
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
                    <td v-if="p_detalhes.icms.antecipado == 'S'">Sim</td>
                    <td v-else>Não</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>

              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
              >
                <thead>
                  <th>Amparo Legal</th>
                </thead>
                <tbody>
                  <tr>
                    <td v-if=" p_detalhes.icms.ampLegal">{{ p_detalhes.icms.ampLegal }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pauta -->
            <div class="tab-pane" id="pmpf" role="tabpanel">
              <br />
              <br />
              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                id="tableIcms"
              >
                <thead>
                  <th scope="col">Descrição</th>
                  <th scope="col">PMPF</th>
                  <th scope="col">PF</th>
                  <th scope="col">PMC</th>
                </thead>
                <tbody>
                  <tr>
                    <th>Preço</th>
                    <td v-if="p_detalhes.pmpf.vPmpf">
                      {{ "R$ " + p_detalhes.pmpf.vPmpf.toFixed(2) }}
                    </td>
                    <td v-else>-</td>
                    <td v-if="p_detalhes.pf.pf">
                      {{ "R$ " + p_detalhes.pf.pf.toFixed(2) }}
                    </td>
                    <td v-else>-</td>
                    <td v-if="p_detalhes.pc.pmc">
                      {{ "R$ " + p_detalhes.pc.pmc.toFixed(2) }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>Trava(%)</th>
                    <td v-if="p_detalhes.pmpf.pTrava">
                      {{ p_detalhes.pmpf.pTrava.toFixed(2) }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Trava Ajust.(%)</th>
                    <td v-if="p_detalhes.pmpf.pTravaAjust">
                      {{ p_detalhes.pmpf.pTravaAjust.toFixed(2) }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Múltiplo</th>
                    <td v-if="p_detalhes.pmpf.vMultiplo">
                      {{ p_detalhes.pmpf.vMultiplo }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Vigência Inicial</th>
                    <td v-if="p_detalhes.pmpf.dtVigenciaInicial">
                      {{ p_detalhes.pmpf.dtVigenciaInicial }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Vigência Final</th>
                    <td v-if="p_detalhes.pmpf.dtVigenciaFinal">
                      {{ p_detalhes.pmpf.dtVigenciaFinal }}
                    </td>
                    <td v-else>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>                  
                </tbody>
              </table>

              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
              >
                <thead>
                  <th>Amparo Legal</th>
                </thead>
                <tbody>
                  <tr>
                    <td v-if="p_detalhes.pmpf.amparoLegal">{{ p_detalhes.pmpf.amparoLegal }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>

              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
              >
                <thead>
                  <th>Registro</th>
                </thead>
                <tbody>
                  <tr>
                    <td v-if="p_detalhes.pf.registro">{{ p_detalhes.pf.registro }}</td>
                    <td v-else-if="p_detalhes.pc.registro">{{ p_detalhes.pc.registro }}</td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Acordo -->
            <div class="tab-pane" id="acordo" role="tabpanel">
              <br />
              <br />
              <table
                class="table table-divider table-striped table-sm table-responsive-lg table-bordered"
                id="tableIcms"
              >
                <thead>
                  <th scope="col">Descrição</th>
                  <th scope="col">Protocolo</th>
                  <th scope="col">Convênio</th>
                </thead>
                <tbody>
                  <tr>
                    <th>Nome</th>
                    <td v-if="p_detalhes.acordos.protocolo.protNome">
                      {{ p_detalhes.acordos.protocolo.protNome }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.convNome">
                      {{ p_detalhes.acordos.convenio.convNome }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>Descrição</th>
                    <td v-if="p_detalhes.acordos.protocolo.descricao">
                      {{ p_detalhes.acordos.protocolo.descricao }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.descricao">
                      {{ p_detalhes.acordos.convenio.descricao }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>Dt. Vigência Inicial</th>
                    <td v-if="p_detalhes.acordos.protocolo.dtVigIni">
                      {{ p_detalhes.acordos.protocolo.dtVigIni }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.dtVigIni">
                      {{ p_detalhes.acordos.convenio.dtVigIni }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>Dt. Vigência Final</th>
                    <td v-if="p_detalhes.acordos.protocolo.dtVigFin">
                      {{ p_detalhes.acordos.protocolo.dtVigFin }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.dtVigFin">
                      {{ p_detalhes.acordos.convenio.dtVigFin }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>Isento</th>
                    <td v-if="p_detalhes.acordos.protocolo.isento == 'S'">Sim</td>
                    <td v-else>Não</td>

                    <td v-if="p_detalhes.acordos.convenio.isento == 'S'">Sim</td>
                    <td v-else>Não</td>
                  </tr>
                  <tr>
                    <th>Subs. Tributária</th>
                    <td v-if="p_detalhes.acordos.protocolo.subsTrib == 'S'">Sim</td>
                    <td v-else>Não</td>

                    <td v-if="p_detalhes.acordos.convenio.subsTrib == 'S'">Sim</td>
                    <td v-else>Não</td>
                  </tr>
                  <tr>
                    <th>Responsável Tributário</th>
                    <td v-if="p_detalhes.acordos.protocolo.respTrib">
                      {{ p_detalhes.acordos.protocolo.respTrib }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.respTrib">
                      {{ p_detalhes.acordos.convenio.respTrib }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>% ICMS Interestadual</th>
                    <td v-if="p_detalhes.acordos.protocolo.aliqIcmsInterestadual">
                      {{ p_detalhes.acordos.protocolo.aliqIcmsInterestadual }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.aliqIcmsInterestadual">
                      {{ p_detalhes.acordos.convenio.aliqIcmsInterestadual }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>% Red. BC Interestadual</th>
                    <td v-if="p_detalhes.acordos.protocolo.redBcInterestadual">
                      {{ p_detalhes.acordos.protocolo.redBcInterestadual }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.redBcInterestadual">
                      {{ p_detalhes.acordos.convenio.redBcInterestadual }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>% Aliq. Efetiva</th>
                    <td v-if="p_detalhes.acordos.protocolo.aliqEfetiva">
                      {{ p_detalhes.acordos.protocolo.aliqEfetiva }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.aliqEfetiva">
                      {{ p_detalhes.acordos.convenio.aliqEfetiva }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                  <tr>
                    <th>% IVA</th>
                    <td v-if="p_detalhes.acordos.protocolo.iva">
                      {{ p_detalhes.acordos.protocolo.iva }}
                    </td>
                    <td v-else>-</td>

                    <td v-if="p_detalhes.acordos.convenio.iva">
                      {{ p_detalhes.acordos.convenio.iva }}
                    </td>
                    <td v-else>-</td>
                  </tr>
                </tbody>
              </table>
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
export default {
  props: {
    p_detalhes: {
      type: Object,
    },
  },

  mounted() {},
};
</script>

<style></style>
