<template>
<div class="modal-dialog modal-dialog-centered modal-lg" role="document" id="modalImport">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="TituloModalCentralizado" v-if="pagina == 1">
                Insira os dados para cadastrar os produtos desejados
            </h5>
            <h5 class="modal-title" id="TituloModalCentralizado" v-else>
                Insira os Dados para consulta
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="modal-body">
            <span class="badge-danger">
                {{ mensagemAviso }}
            </span>
            <!-- MINHA CONTA -->
            <div v-if="pagina == 1">
                <div class="row mt-2">
                    <div class="col-md-3">
                        <label for="cbUF">UF
                            <i class="fas fa-exclamation-circle" title="Escolha mais de uma UF se necessário" style="color: steelblue"></i>
                        </label>

                        <div id="divUfsLote">
                            <div v-for="(item, index) in ufs" :key="item">
                                <input class="ml-2" type="checkbox" v-bind:id="'chk' + item.sigla" v-bind:name="item.sigla" v-bind:checked="item.checado" v-on:click="ChecarLstUFsLote(index, 'chk' + item.sigla)" />
                                <label for="item.sigla" class="corLabelCombo">{{
                    item.sigla
                  }}</label>
                            </div>
                        </div>

                        <input class="mt-3" type="checkbox" id="chkTodasUFs" v-on:click="MarcarTodasUFs()" />
                        <label for="chkTodasUFs">Marcar todas UFs</label>
                    </div>

                    <div class="col-md-7">
                        <label for="cbCaracTrib">Característica Tributária
                            <i class="fas fa-exclamation-circle" title="Escolha mais de uma Característica Tributária se necessário" style="color: steelblue"></i></label>
                        <select class="form-control form-control-sm" v-model="caracTrib" name="cbCaracTrib" size="4">
                            <option v-for="(item, index) in caracTribs" v-bind:key="index" v-bind:value="item.value">
                                {{ item.text }}
                            </option>
                        </select>
                    </div>
                </div>
                <div>
                    <p>
                        Para realizar a consulta, fazer igual o layout de Exemplo,
                        presente no botão "Planilha Exemplo". Deve ser seguido sempre o
                        mesmo padrão, primeiro o código (Interno ou EAN), seguido pela
                        descrição, separados por ';'.
                    </p>
                </div>
            </div>
            <!-- GT CONSULTA -->
            <div v-else>
                <div>
                    <div class="row mt-2">
                        <div class="col-md-12">
                            <input type="checkbox" id="chkLote" class="mr-1" v-on:click="ControlarCheckLote()" />
                            <label for="chkLote">Desconsiderar a data de vigência do perfil.</label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-4">
                            <input type="date" class="form-control form-control-sm" id="datalote" v-model="dataLote" />
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="mt-2 mb-2">Exemplo:</h4>
                    <div class="mb-3" v-if="criterio == 'NCM'">
                        <p>
                            Será feita a consulta da NCM, uma por linha ou uma NCM + EX por
                            linha, separados por ';'(ponto-e-vírgula). Abaixo segue o
                            exemplo de como ficará os modos de pesquisa. Caso necessário
                            consultar mais de uma EX para uma mesma NCM, repita o código da
                            NCM:<br /><br />
                            "22021000", da NCM "22021000" com a EX "01" e da NCM "22021000"
                            com a EX "02":<br /><br />22021000<br />22021000;01<br />22021000;02
                        </p>
                    </div>
                    <div class="mb-3" v-else>
                        <p>
                            Será feita a consulta dos códigos (um código por linha):
                            <br /><br />7899768065498<br />7896544910102<br />7896004712048
                        </p>
                    </div>
                </div>
            </div>

            <h6>
                Escolha o arquivo a ser importado, caso deseje.
                <i class="fas fa-info-circle" title="O arquivo CSV ou XLSX deve seguir o mesmo padrão apresentado acima, cada produto deve estar em uma linha." style="color: steelblue"></i>
            </h6>

            <div class="row">
                <div class="col-md-12 mt-1 mb-3">
                    <div class="input-group input-sm">
                        <input type="text" class="form-control form-control-sm mr-1" id="fileNameUpload" readonly />
                        <label class="input-group-btn">
                            <span class="btn btn-sm btnModalGeral">
                                <i class="fa fa-search" title="Buscar arquivo"></i><input id="file-upload" type="file" accept=".csv, .ods, .xlsx" style="display: none" v-on:change="EnviarDadosArquivo($event, this)" />
                            </span>
                        </label>
                        <label class="input-group-btn ml-1">
                            <span class="btn btn-sm btnModalGeral" v-on:click="LimparInputFile()">
                                <i class="fa fa-eraser" title="Limpar arquivo"></i>
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <a style="color: steelblue; cursor: pointer;" v-on:click.stop.prevent="txtLote = RemoverCabecalho(txtLote)" title="Remove o cabeçalho do arquivo importado.">
                <i class="fa fa-trash" style="color: steelblue" aria-hidden="true"></i>&nbsp;Remover Cabeçalho
            </a>

            <textarea class="form-control form-control-sm mt-2" v-model="txtLote" id="consultaLote" rows="5" autofocus placeholder="Código...">
        </textarea>

            <!-- TEMPLATES/TABELAS PARA SEREM EXPORTADAS PARA EXEMPLIFICAR OS MODELOS DE ARQUIVOS PARA OPERAÇÃO EM LOTE -->
            <div v-show="tblExemp">
                <table id="TblExempCodigo">
                    <thead>
                        <tr>
                            <th class="fontSteel">CODIGO EAN</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tableexport-string">7899768065498</td>
                        </tr>
                        <tr>
                            <td class="tableexport-string">7896544910102</td>
                        </tr>
                        <tr>
                            <td class="tableexport-string">7896004712048</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-show="tblExemp">
                <table id="TblExempNCM">
                    <thead>
                        <tr>
                            <th class="fontSteel">CODIGO NCM</th>
                            <th class="fontSteel">EX.IPI</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tableexport-string">22021000</td>
                        </tr>
                        <tr>
                            <td class="tableexport-string">22021000</td>
                            <td>01</td>
                        </tr>
                        <tr>
                            <td class="tableexport-string">22021000</td>
                            <td>02</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-show="tblExemp">
                <table id="TblExempMinhaConta">
                    <thead>
                        <tr>
                            <th class="fontSteel">CODIGO EAN/INTERNO</th>
                            <th class="fontSteel">DESCRIÇÃO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="tableexport-string">7899768065498</td>
                            <td class="tableexport-string">
                                BOMBONIERE DE VIDRO FRUIT LYOR
                            </td>
                        </tr>
                        <tr>
                            <td class="tableexport-string">7896544910102</td>
                            <td class="tableexport-string">
                                ESPARADRAPO MISSNER 10CMX4 5M
                            </td>
                        </tr>
                        <tr>
                            <td class="tableexport-string">123</td>
                            <td class="tableexport-string">TESTE</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- -------------------------------------------------------------------------------- -->
        </div>

        <div class="modal-footer">
            <p v-if="txtLote != ''">
                Total: {{ TotalItens(txtLote) }} | Total Distintos-x2:
                {{ ConsultarDistintos(txtLote) }}
            </p>
        </div>
        <div class="modal-footer">
            <div class="mr-auto">
                <button 
                  type="button" 
                  class="btn btnModalPrimary" 
                  data-toggle="modal" data-target="#modalPlanExemplo" data-backdrop="static" data-keyboard="false" data-dismiss="modal" 
                  title="Exporta em formato de planilha um exemplo de como deve ser montado o arquivo para importacao." 
                  v-on:click="GerarPlanilhaXLSXCSV(templateExport, 'Exemplo de Arquivo por ' + mensagemExport, 'xlsx')">
                    Planilha Exemplo XLSX
                </button>

                <button 
                  type="button" 
                  class="btn btnModalPrimary ml-2" 
                  data-toggle="modal" data-target="#modalPlanExemplo" data-backdrop="static" data-keyboard="false" data-dismiss="modal" 
                  title="Exporta em formato de planilha um exemplo de como deve ser montado o arquivo para importacao." 
                  v-on:click="GerarPlanilhaXLSXCSV(templateExport, 'Exemplo de Arquivo por ' + mensagemExport, 'csv' )">
                    Planilha Exemplo CSV
                </button>
            </div>
            <div class="float-right" v-if="pagina == 1">
                <button type="button" class="btn btn-primary btn-sm btnBold" data-dismiss="modal" v-if="pagina == 1" @click="AdicionarProdutos()">
                    <i class="fa fa-plus-circle gold"></i> Adicionar Produtos
                </button>
            </div>
            <div class="float-right" v-else>
                <button type="button" class="btn btnModalGeral" data-dismiss="modal" @click="ConsultaLoteCodigoNCM()">
                    <i class="fa fa-search gold"></i> Consultar {{ mensagemExport }}
                </button>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import { useAuthStore } from "@/stores/user";
import { useAlertStore } from "@/stores";
import helpers from "@/helpers";

const userStore = useAuthStore();

export default {
    props: {
        key: Number,
        pagina: Number,
        criterio: String,
    },
    data() {
        return {
            alertStore: useAlertStore(),
            mensagemAviso: "Atenção! Serão considerados apenas os 1000 primeiros códigos.",
            templateExport: "",
            mensagemExport: "",
            txtLote: "",
            dataLote: new Date().toISOString().slice(0, 10),
            //emailLote: '',
            tblExemp: false,
            uf: [userStore.user.profile.prfUF],
            ufs: [{
                    sigla: "AC",
                    checado: false
                },
                {
                    sigla: "AL",
                    checado: false
                },
                {
                    sigla: "AM",
                    checado: false
                },
                {
                    sigla: "AP",
                    checado: false
                },
                {
                    sigla: "BA",
                    checado: false
                },
                {
                    sigla: "CE",
                    checado: false
                },
                {
                    sigla: "DF",
                    checado: false
                },
                {
                    sigla: "ES",
                    checado: false
                },
                {
                    sigla: "GO",
                    checado: false
                },
                {
                    sigla: "MA",
                    checado: false
                },
                {
                    sigla: "MG",
                    checado: false
                },
                {
                    sigla: "MS",
                    checado: false
                },
                {
                    sigla: "MT",
                    checado: false
                },
                {
                    sigla: "PA",
                    checado: false
                },
                {
                    sigla: "PB",
                    checado: false
                },
                {
                    sigla: "PE",
                    checado: false
                },
                {
                    sigla: "PI",
                    checado: false
                },
                {
                    sigla: "PR",
                    checado: false
                },
                {
                    sigla: "RJ",
                    checado: false
                },
                {
                    sigla: "RN",
                    checado: false
                },
                {
                    sigla: "RO",
                    checado: false
                },
                {
                    sigla: "RR",
                    checado: false
                },
                {
                    sigla: "RS",
                    checado: false
                },
                {
                    sigla: "SC",
                    checado: false
                },
                {
                    sigla: "SE",
                    checado: false
                },
                {
                    sigla: "SP",
                    checado: false
                },
                {
                    sigla: "TO",
                    checado: false
                },
            ],
            caracTrib: 3,
            caracTribs: [{
                    text: "0=Industrial",
                    value: 0
                },
                {
                    text: "1=Distribuidor",
                    value: 1
                },
                {
                    text: "2=Atacadista",
                    value: 2
                },
                {
                    text: "3=Varejista",
                    value: 3
                },
                {
                    text: "4=Produtor Rural Pessoa Jurídica",
                    value: 4
                },
                {
                    text: "6=Produtor Rural Pessoa Física",
                    value: 6
                },
                {
                    text: "7=Pessoa Jurídica não Contribuinte do ICMS",
                    value: 7
                },
                {
                    text: "8=Pessoa Física não Contribuinte do ICMS",
                    value: 8
                },
            ],
            lstUFsSelecionadas: [],
        };
    },
    methods: {
        Configuracoes() {
            if (this.pagina == 1) {
                this.templateExport = "TblExempMinhaConta";
                this.mensagemExport = "Produtos";
                this.mensagemAviso =
                    "Atenção! Serão desconsiderados produtos sem descrição.";
            } else {
                if (this.criterio == "GTIN") {
                    this.templateExport = "TblExempCodigo";
                    this.mensagemExport = "Códigos";
                } else {
                    this.templateExport = "TblExempNCM";
                    this.mensagemExport = "NCMs";
                }
            }
        },
        FecharModal() {
            this.$parent.FecharModal();
        },
        async EnviarDadosArquivo(e, vm) {
            try {
                this.txtLote = await helpers.CarregarArquivo(e, vm);
            } catch (error) {
                this.alertStore.error(error);
            }
        },
        LimparInputFile() {
            // Limpar dados da importação
            this.txtLote = "";
            document.getElementById("file-upload").value = "";
            document.getElementById("fileNameUpload").value = "";
        },
        ControlarCheckLote() {
            let chkLote = document.getElementById("chkLote");
            let data = document.getElementById("datalote");

            if (chkLote.checked) {
                userStore.user.dataQueries.dadosLote = true;
                data.disabled = false;
            } else {
                userStore.user.dataQueries.dadosLote = false;
                data.disabled = true;
            }
        },
        DesabilitarCamposLote() {
            document.getElementById("datalote").disabled = true;
            document.getElementById("chkLote").checked = false;
        },
        ConsultaLoteCodigoNCM() {
            let chkLote = document.getElementById("chkLote");

            userStore.user.dataQueries.dataLote = this.dataLote;

            if (chkLote.checked) {
                userStore.user.dataQueries.dadosLote = true;

                if (helpers.VerificarCamposLote(this.dataLote) == false) {
                    return;
                }
            } else {
                userStore.user.dataQueries.dadosLote = false;
            }

            this.txtLote = this.txtLote.trim();

            if (this.criterio == "NCM") {
                this.$emit("consulta-lote-ncm", this.txtLote);
            } else this.$emit("consulta-lote-codigo", this.txtLote);
        },
        MarcarTodasUFs() {
            let marcarUFs = document.getElementById("chkTodasUFs").checked;

            this.ufs.forEach((uf) => {
                uf.checado = marcarUFs;
            });
        },
        AdicionarProdutos() {
            if (this.ValidarUFs()) {
                if (this.ValidarProdutos()) {
                    this.$parent.FecharModal();
                    this.$parent.ConsumirSaneamentoGrades(
                        this.caracTrib,
                        this.lstUFsSelecionadas,
                        this.txtLote
                    );
                }
            }
        },
        ValidarProdutos() {
            this.txtLote = this.txtLote.trim();

            if (!this.txtLote) {
                this.alertStore.error("Por favor, inserir pelo menos um produto.");
                return false;
            }

            if (!this.txtLote.includes(";")) {
                this.alertStore.error(
                    'Por favor, inserir código e descrição separados por ";"'
                );
                return false;
            }

            return true;
        },
        ValidarUFs() {
            this.lstUFsSelecionadas = [];

            this.ufs.forEach((uf) => {
                if (uf.checado) this.lstUFsSelecionadas.push(uf.sigla);
            });

            if (this.lstUFsSelecionadas.length == 0) {
                this.alertStore.error("Nenhuma UF selecionada!");
                return false;
            }

            return true;
        },
        ChecarLstUFsLote(index, chk) {
            let chkSelecionado = document.getElementById(chk);

            if (chkSelecionado.checked) this.ufs[index].checado = true;
            else this.ufs[index].checado = false;
        },
        GerarPlanilhaXLSXCSV(templateExport, mensagemExport, tipo) {
            helpers.GerarPlanilhaXLSXCSV(templateExport, mensagemExport, tipo);
        },

        TotalItens(vetor) {
            return helpers.TotalItens(vetor);
        },

        ConsultarDistintos(vetor) {
            return helpers.ConsultarDistintos(vetor);
        },
        RemoverCabecalho(texto) {
            return helpers.RemoverCabecalho(texto);
        },
    },
    mounted() {
        if (this.pagina == 2) {
            this.DesabilitarCamposLote();
            this.ControlarCheckLote();
        }
    },
    created() {
        this.Configuracoes();
    },
};
</script>

<style></style>
