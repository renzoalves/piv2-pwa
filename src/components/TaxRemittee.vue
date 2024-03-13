<template>
<div id="appProfilePoc">
    <div class="loading-page" v-if="processando">
        <IconifyIcon class="loading-icon" icon="line-md:loading-twotone-loop" />
    </div>

    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <label class="col-form-label">Perfil</label>
                <select class="form-control form-control-sm" v-model="ctrib" id="selectCtrib">
                    <option v-for="(item, i) in caracTrib" v-bind:key="i" v-bind:value="item.value">
                        {{ item.text }}
                    </option>
                </select>
            </div>

            <div class="col-md-2">
                <label class="col-form-label">UF</label>
                <select class="form-control form-control-sm" v-model="uf" id="selectUf">
                    <option v-for="item in ufs" v-bind:key="item.sigla">
                        {{ item }}
                    </option>
                </select>
            </div>

            <div class="col-md-2">
                <label class="col-form-label">Subst. ICMS</label>
                <select class="form-control form-control-sm" v-model="substICMS" id="selectSubstICMS">
                    <option value="S">Sim</option>
                    <option value="N">Não</option>
                </select>
            </div>

            <div class="col-md-2">
                <label class="col-form-label">Finalidade</label>
                <select class="form-control form-control-sm" v-model="destino" id="selectFinalidade">
                    <option v-for="(item, i) in destMerc" v-bind:key="i" v-bind:value="item.value">
                        {{ item.text }}
                    </option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="col-form-label">Operação</label>
                <select class="form-control form-control-sm" v-model="operacao" id="selectOperacao">
                    <option v-for="(item, i) in destOperacao" v-bind:key="i" v-bind:value="item.value">
                        {{ item.text }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <label class="col-form-label">Margem Líquida %</label>
                <input type="text" v-model="margemLiquida" class="form-control form-control-sm" id="margemLiquida" maxlength="5" />
            </div>
            <div class="col-md-3">
                <label class="col-form-label">Frete %</label>
                <input type="text" v-model="frete" class="form-control form-control-sm" id="frete" maxlength="5" />
            </div>
            <div class="col-md-3">
                <label class="col-form-label">Comissão %</label>
                <input type="text" v-model="comissao" class="form-control form-control-sm" id="comissao" maxlength="5" />
            </div>
            <div class="col-md-3">
                <label class="col-form-label">Outras Desp. %</label>
                <input type="text" v-model="outrasDespesas" class="form-control form-control-sm" id="outrasDespesas" maxlength="5" />
            </div>
        </div>

        <button class="geral-button mt-3 mb-3" v-on:click="
          SalvarDestinatario(
            uf,
            substICMS,
            ctrib,
            destino,
            operacao,
            margemLiquida,
            frete,
            comissao,
            outrasDespesas
          )
        ">
            Salvar
        </button>
    </div>
</div>
</template>

<script>
import {
    RetUrlAPI
} from "@/helpers/axios.js";
import {
    CallPostAsync
} from "@/helpers/axios.js";
import {
    CallGetAsync
} from "@/helpers/axios.js";
import helpers from "@/helpers";
import notifications from "@/helpers/notifications.js";
import {
    useAuthStore
} from "@/stores/user";
import {
    useAlertStore
} from "@/stores";
import {
    ref
} from "vue";
import router from "@/router/index";
import TaxProfile from "@/components/TaxProfile.vue";

export default {
    props: {
        ufs: Object,
        p_destinatario: Object,
        index: Number,
    },
    data() {
        return {
            userStore: useAuthStore(),
            alertStore: useAlertStore(),
            processando: false,
            destinatarios: [],
            destinatario: this.p_destinatario,
            uf: this.p_destinatario.uf,
            substICMS: this.p_destinatario.substICMS,
            ctrib: this.p_destinatario.perfil,
            caracTrib: [{
                    text: "0-Industrial",
                    value: 0,
                },
                {
                    text: "1-Distribuidor",
                    value: 1,
                },
                {
                    text: "2-Atacadista",
                    value: 2,
                },
                {
                    text: "3-Varejista",
                    value: 3,
                },
                {
                    text: "4-Produtor Rural Pessoa Jurídica",
                    value: 4,
                },
                {
                    text: "5-Produtor Rural Pessoa Física",
                    value: 5,
                },
                {
                    text: "6-Pessoa Jurídica não Contribuinte do ICMS",
                    value: 6,
                },
                {
                    text: "7-Pessoa Física não Contribuinte do ICMS",
                    value: 7,
                },
            ],
            destino: this.p_destinatario.finalidade,
            destMerc: [{
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
            operacao: this.p_destinatario.operacao,
            destOperacao: [{
                    text: "Transferência",
                    value: 0,
                },
                {
                    text: "Venda",
                    value: 1,
                },
                {
                    text: "Compra",
                    value: 2,
                },
            ],
            margemLiquida: this.p_destinatario.margem,
            frete: this.p_destinatario.frete,
            comissao: this.p_destinatario.comissao,
            outrasDespesas: this.p_destinatario.outrasDespesas,
            lstRegimesEspeciais: [],
        };
    },
    methods: {

        SalvarDestinatario(
            uf,
            substICMS,
            regTrib,
            destino,
            operacao,
            margemLiquida,
            frete,
            comissao,
            outrasDespesas
        ) {
            this.destinatarios = this.userStore.user.userRecipients;

            if (Number(margemLiquida) <= 0) {
                this.alertStore.error(
                    "O campo Margem Líquida % não podem estar zerada."
                );
                return;
            }

            if (
                margemLiquida.toString().indexOf(",") >= 0 ||
                frete.toString().indexOf(",") >= 0 ||
                comissao.toString().indexOf(",") >= 0 ||
                outrasDespesas.toString().indexOf(",") >= 0
            ) {
                this.alertStore.error("Os campos % não podem possuir vírgulas.");
                return;
            }

            let destinatario = this.GerarObjeto(
                uf,
                substICMS,
                regTrib,
                destino,
                operacao,
                margemLiquida,
                frete,
                comissao,
                outrasDespesas
            );

            if (this.index >= 0) this.AtualizarDestinatario(destinatario);
            else this.InserirDestinatario(destinatario);
        },

        InserirDestinatario(destinatario) {
            this.processando = true;

            let mensagemRetorno = "";
            let token = "";
            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url = RetUrlAPI() + "RecipientsCreate?userID=" + id + "&sessionToken=" + tokenSessao;

            CallPostAsync("usuario", token, url, [destinatario])
                .then((data) => {
                    if (data == "OK") {
                        this.processando = false;

                        mensagemRetorno = data.message;

                        helpers.GravarLog("Inseriu destinatário", "remitte.js", "RecipientsCreate", mensagemRetorno, null, "portal");

                        this.destinatario = {
                            cTrib: destinatario.cTrib,
                            uf: destinatario.uf,
                            finalidade: destinatario.finalidade,
                            operacao: destinatario.operacao,
                            margemLiquida: destinatario.margemLiquida,
                            frete: destinatario.frete,
                            comissao: destinatario.comissao,
                            outrasDespesas: destinatario.outrasDespesas,
                        };

                        this.destinatarios.push(this.destinatario);
                        this.userStore.user.userRecipients = this.destinatarios;

                        this.alertStore.success("Destinatário inserido com sucesso.");

                        this.$emit("emit-destinatario");
                    } else {

                        this.processando = false;

                        if (Array.isArray(data)) {

                            data.forEach(msg => {
                                mensagemRetorno += msg + ";";
                            });

                            mensagemRetorno = mensagemRetorno.substring(0, mensagemRetorno.length - 1);
                        } else
                            mensagemRetorno = data.message;

                        helpers.GravarLog("Inseriu destinatário", "remitte.js", "RecipientsCreate", mensagemRetorno, null, "portal");
                        this.alertStore.error(mensagemRetorno);
                    }
                })
                .catch((reason) => {
                    this.processando = false;

                    mensagemRetorno =
                        "Não foi possível estabelecer conexão com o servidor.";

                    helpers.GravarLog("Inseriu destinatário", "remitte.js", "RecipientsCreate", mensagemRetorno, null, "portal");

                    this.alertStore.error(mensagemRetorno);
                });
        },

        AtualizarDestinatario(destinatario) {
            this.processando = true;

            let mensagemRetorno = "";

            let token = "";
            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url = RetUrlAPI() + "RecipientsUpdate?userID=" + id + "&sessionToken=" + tokenSessao;

            CallPostAsync("usuario", token, url, destinatario)
                .then((data) => {
                    if (data == "OK") {
                        this.destinatarios[this.index].cTrib = destinatario.cTrib;
                        this.destinatarios[this.index].uf = destinatario.uf;
                        this.destinatarios[this.index].finalidade = destinatario.finalidade;
                        this.destinatarios[this.index].operacao = destinatario.operacao;
                        this.destinatarios[this.index].margemLiquida =
                            destinatario.margemLiquida;
                        this.destinatarios[this.index].frete = destinatario.frete;
                        this.destinatarios[this.index].comissao = destinatario.comissao;
                        this.destinatarios[this.index].outrasDespesas =
                            destinatario.outrasDespesas;

                        this.userStore.user.userRecipients = this.destinatarios;

                        this.alertStore.success("Destinatário alterado com sucesso.");

                        mensagemRetorno = data.message;

                        helpers.GravarLog(
                            "Atualizar destinatário",
                            "remitte.js",
                            "RecipientsCreate",
                            mensagemRetorno,
                            null,
                            "portal"
                        );

                        this.$emit("emit-destinatario");
                    } else {
                        this.processando = false;

                        mensagemRetorno = data.message;

                        helpers.GravarLog(
                            "Atualizar destinatário",
                            "remitte.js",
                            "RecipientsCreate",
                            mensagemRetorno,
                            null,
                            "portal"
                        );

                        this.alertStore.error(data.message);
                    }
                })
                .catch((reason) => {
                    this.processando = false;

                    mensagemRetorno =
                        "Não foi possível estabelecer conexão com o servidor.";

                    helpers.GravarLog(
                        "Atualizar destinatário",
                        "remitte.js",
                        "RecipientsCreate",
                        mensagemRetorno,
                        null,
                        "portal"
                    );

                    this.alertStore.error(mensagemRetorno);
                });
        },

        GerarObjeto(
            uf,
            substICMS,
            regTrib,
            destino,
            operacao,
            margemLiquida,
            frete,
            comissao,
            outrasDespesas
        ) {
            let destinatario = new Object();

            destinatario.uf = uf;
            destinatario.substICMS = substICMS;
            destinatario.usuaId = this.userStore.user.userId;
            destinatario.destId = this.destinatario.destId;
            destinatario.apelido = "dest " + uf;
            destinatario.principal = false;
            destinatario.perfil = regTrib;
            destinatario.simplesNacional = false;
            destinatario.finalidade = destino;
            destinatario.operacao = operacao;
            destinatario.margem = Number(margemLiquida);
            destinatario.frete = Number(frete);
            destinatario.comissao = Number(comissao);
            destinatario.outrasDespesas = Number(outrasDespesas);

            return destinatario;
        },
    },
};
</script>

<style scoped lang="less"></style>
