<template>
<div id="appProfilePoc">
    <div class="loading-page" v-if="processando">
        <IconifyIcon class="loading-icon" icon="line-md:loading-twotone-loop" />
    </div>

    <div class="container-fluid">
        <div class="row">
            <div class="col-md-2">
                <label class="col-form-label">UF</label>
                <select class="form-control form-control-sm" v-model="uf" id="selectUf">
                    <option v-for="item in ufs" v-bind:key="item">
                        {{ item }}
                    </option>
                </select>
            </div>

            <div class="col-md-3">
                <label class="col-form-label">Atividade</label>
                <select class="form-control form-control-sm" v-model="tipoCnae" id="selectCnae">
                    <option v-for="item in localTiposCnae" v-bind:key="item.tipo">
                        {{ item.tipo }}
                    </option>
                </select>
            </div>

            <div class="col-md-5">
                <label class="col-form-label">Regime Tribut.</label>
                <select class="form-control form-control-sm" v-model="ctrib" id="selectCtrib">
                    <option v-for="item in ctribs" v-bind:key="item.tipo">
                        {{ item }}
                    </option>
                </select>
            </div>

            <!-- Só exibirá esse campo quando o parâmetro não for omitido. -->
            <div class="col-md-2" v-if="cnae">
                <label class="col-form-label">CNAE</label>
                <input type="text" v-model="cnae" class="form-control form-control-sm" id="selectedCnae" maxlength="7" />
            </div>
        </div>

        <div class="row">
            <div class="col-md-2" v-if="!gt || !vacine">
                <label class="col-form-label">CFOP</label>
                <input type="text" v-model.number="cfop" class="form-control form-control-sm" id="cfop" maxlength="4" />
            </div>

            <div class="col-md-5">
                <label class="col-form-label">Apelido do Perfil</label>
                <input type="text" v-model="apelido" class="form-control form-control-sm" style="text-transform: uppercase" id="apelido" maxlength="20" required />
            </div>

            <div class="col-md-3" v-if="(san3 || gt) && lstRegimesEspeciais.length > 0">
                <label class="col-form-label">Regime Especial</label>
                <select class="form-control form-control-sm" v-model="regime" v-onchange="AlterarDescricaoRegime()">
                    <option v-for="item in lstRegimesEspeciais" v-bind:key="item">
                        {{ item }}
                    </option>
                </select>
            </div>

            <!-- Só exibirá esse campo quando "Regime Tribut." for 'SIMPLES NACIONAL'. -->
            <div class="col-md-5" v-if="ctrib == 'SIMPLES NACIONAL'">
                <label class="col-form-label">Receita Bruta em 12 meses (R$)</label>
                <input type="text" style="text-align: right" v-model="recBruta" class="form-control form-control-sm" id="receitaBruta" maxlength="14" />
            </div>
            <div class="col-md-3" v-if="ctrib == 'SIMPLES NACIONAL'">
                <label class="col-form-label" title="Data da última atualização da Receita Bruta">Dt. Últ. Atualização</label>
                <input type="text" style="text-align: center" v-model="dtUltRec" class="form-control form-control-sm" id="dataUltReceitaBruta" disabled="true" />
            </div>
        </div>

        <div class="row" v-if="(san3 || gt) && lstRegimesEspeciais.length > 0 && descricaoRegime.length > 0">
            <div class="col-md-12">
                <label class="col-form-label">&nbsp;</label>
                <textarea class="form-control form-control-sm" rows="3" cols="5" readonly v-model="descricaoRegime"></textarea>
            </div>
        </div>

        <button class="geral-button mt-3 mb-4" v-on:click="SalvarPerfil(uf, ctrib, tipoCnae, cnae, cfop, recBruta, apelido)">
            Salvar
        </button>

        <div v-if="ctrib == 'GERAL' || tipoCnae == 'GERAL'" class="alert alert-warning" role="alert">
            O tipo "Geral" na Atividade e Regime Tributário é utilizado para busca
            de informações universais na consulta.
        </div>

        <div class="alert alert-warning" role="alert" v-if="!gt || !vacine">
            O campo CFOP não será usado na formação de preço do Moostri.
        </div>
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
import {
    useAuthStore
} from "@/stores/user";
import {
    useAlertStore
} from "@/stores";

export default {
    props: {
        ufs: Object,
        tiposCnae: Object,
        ctribs: Object,
        cnae: String,
        recbruta: Number,
        san3: Boolean,
        dtmaistrinta: Boolean,
        gt: Boolean,
        vacine: Boolean,
        solucaoid: String,
        p_perfil: Object,
        index: Number,
    },
    data() {
        return {
            userStore: useAuthStore(),
            alertStore: useAlertStore(),
            processando: false,
            perfis: [],
            perfil: this.p_perfil,
            apelido: this.p_perfil.prfApelido,
            principal: this.p_perfil.prfPrincipal,
            uf: this.p_perfil.prfUF,
            ctrib: helpers.DefCaracTrib(this.p_perfil.prfTaxRegime),
            cnae: "",
            localTiposCnae: [{
                    tipo: "GERAL"
                }, {
                    tipo: "ATACADO"
                },
                {
                    tipo: "CONSTRUCAO"
                }, {
                    tipo: "INDUSTRIA"
                },
                {
                    tipo: "FARMA"
                }, {
                    tipo: "VAREJO"
                },
            ],
            tipoCnae: this.p_perfil.prfTypeCnae,
            menuAtivo: this.p_perfil.hasProfile,
            recBruta: this.p_perfil.prfRecBruta,
            cfop: this.p_perfil.prfCfop,
            dtUltRec: this.p_perfil.prfDtUltRec,
            lstRegimesEspeciais: [],
            regime: this.p_perfil.prfSpecialRegime,
            descricaoRegime: "",
        };
    },
    methods: {
        SalvarPerfil(uf, regTrib, atividade, cnae, cfop, recBruta, apelido) {
            if (apelido == "" || apelido == undefined) {
                this.alertStore.error("Informe um apelido para o perfil.");
                return;
            }

            let dtUltRec = this.GetDataGravacao();

            regTrib = helpers.DefCaracTrib(regTrib);

            if (!cnae) cnae = "";

            if (recBruta.toString().indexOf(",") >= 0) {
                this.alertStore.error("O campo Receita Bruta não pode possuir vírgulas.");
                return;
            }

            let perfil = this.GerarObjeto(uf, regTrib, atividade, cnae, recBruta, cfop, dtUltRec, apelido);

            if (this.index >= 0) this.AtualizarPerfil(perfil);
            else this.InserirPerfil(perfil);
        },

        InserirPerfil(perfil) {
            this.processando = true;
            this.perfis = this.userStore.user.userProfile;

            let temPerfil = this.userStore.user.profile.hasProfile;
            let mensagemRetorno = "";

            let token = "";
            let url = RetUrlAPI() + "RegisterProfile";

            CallPostAsync("usuario", token, url, perfil)
                .then((data) => {
                    if (data == "OK") {
                        perfil.dtUltRec = perfil.dtUltRec.split("-")[2] + "/" + perfil.dtUltRec.split("-")[1] + "/" + perfil.dtUltRec.split("-")[0];

                        this.processando = false;

                        mensagemRetorno = data;

                        helpers.GravarLog(
                            "Inseriu perfil",
                            "profile.js",
                            "RegisterProfile",
                            mensagemRetorno,
                            null,
                            "portal"
                        );

                        if (temPerfil == false) {
                            this.userStore.user.profile.hasProfile = true;
                            this.userStore.user.profile.prfPrincipal = true;
                            this.userStore.user.profile.prfApelido = this.apelido ? this.apelido.toUpperCase() : "";
                            this.userStore.user.profile.prfTaxRegime = perfil.taxRegime;
                            this.userStore.user.profile.prfTypeCnae = perfil.typeCnae;
                            this.userStore.user.profile.prfUF = perfil.uf;
                            this.userStore.user.profile.prfRecBruta = perfil.recBruta;
                            this.userStore.user.profile.prfCfop = perfil.cfop;
                            this.userStore.user.profile.prfDtUltRec = perfil.dtUltRec;
                            this.userStore.user.profile = perfil.specialRegime;
                            this.userStore.user.profile.prfPrincipal = true;
                            this.userStore.user.profile.prfIndex = 0;
                        }

                        this.perfil = {
                            hasProfile: true,
                            prfPrincipal: !temPerfil,
                            prfApelido: this.apelido ? this.apelido.toUpperCase() : "",
                            prfTaxRegime: perfil.taxRegime,
                            prfTypeCnae: perfil.typeCnae,
                            prfUF: perfil.uf,
                            prfRecBruta: perfil.recBruta,
                            prfCfop: perfil.cfop,
                            prfDtUltRec: perfil.dtUltRec,
                            prfSpecialRegime: perfil.specialRegime,
                            prfIndex: this.perfis.length + 1,
                        };

                        this.perfis.push(this.perfil);
                        this.userStore.user.userProfile = this.perfis;

                        // Atualiza a data de registro do ultimo update do perfil
                        this.userStore.user.lastAccessDate = helpers.ConvDataToYyyyMmDd(
                            Date()
                        );
                        this.alertStore.success("Perfil inserido com sucesso.");

                        this.$emit("emit-perfil");
                    } else {
                        this.processando = false;

                        mensagemRetorno = data.message;

                        helpers.GravarLog(
                            "Inseriu perfil",
                            "profile.js",
                            "RegisterProfile",
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
                        "Inseriu perfil",
                        "profile.js",
                        "RegisterProfile",
                        mensagemRetorno,
                        null,
                        "portal"
                    );

                    this.alertStore.error(mensagemRetorno);
                });
        },
        AtualizarPerfil(perfil) {
            this.processando = true;

            let mensagemRetorno = "";

            let token = "";
            let url = RetUrlAPI() + "UpdateProfile";

            CallPostAsync("usuario", token, url, perfil)
                .then((data) => {
                    if (data == "OK") {
                        perfil.dtUltRec =
                            perfil.dtUltRec.split("-")[2] +
                            "/" +
                            perfil.dtUltRec.split("-")[1] +
                            "/" +
                            perfil.dtUltRec.split("-")[0];

                        this.processando = false;

                        mensagemRetorno = data;

                        this.perfis = this.userStore.user.userProfile;

                        if (this.principal) {
                            this.userStore.user.profile.hasProfile = true;
                            this.userStore.user.profile.prfApelido = this.apelido ?
                                this.apelido.toUpperCase() :
                                "";
                            this.userStore.user.profile.prfTaxRegime = perfil.taxRegime;
                            this.userStore.user.profile.prfTypeCnae = perfil.typeCnae;
                            this.userStore.user.profile.prfUF = perfil.uf;
                            this.userStore.user.profile.prfRecBruta = perfil.recBruta;
                            this.userStore.user.profile.prfCfop = perfil.cfop;
                            this.userStore.user.profile.prfDtUltRec = perfil.dtUltRec;
                            this.userStore.user.profile.prfSpecialRegime =
                                perfil.specialRegime;
                            this.userStore.user.profile.prfPrincipal = true;
                            this.userStore.user.profile.prfIndex = this.index;
                        }

                        this.perfis[this.index].hasProfile = true;
                        this.perfis[this.index].prfApelido = this.apelido ?
                            this.apelido.toUpperCase() :
                            "";
                        this.perfis[this.index].prfTaxRegime = perfil.taxRegime;
                        this.perfis[this.index].prfTypeCnae = perfil.typeCnae;
                        this.perfis[this.index].prfUF = perfil.uf;
                        this.perfis[this.index].prfRecBruta = perfil.recBruta;
                        this.perfis[this.index].prfCfop = perfil.cfop;
                        this.perfis[this.index].prfDtUltRec = perfil.dtUltRec;
                        this.perfis[this.index].prfSpecialRegime = perfil.specialRegime;

                        this.userStore.user.userProfile = this.perfis;

                        this.userStore.user.lastAccessDate = helpers.ConvDataToYyyyMmDd(
                            Date()
                        );

                        this.alertStore.success("Perfil atualizado com sucesso.");

                        helpers.GravarLog(
                            "Atualizar perfil",
                            "profile.js",
                            "UpdateProfile",
                            mensagemRetorno,
                            null,
                            "portal"
                        );

                        this.$emit("emit-perfil");
                    } else {
                        this.processando = false;

                        mensagemRetorno = data.message;

                        helpers.GravarLog(
                            "Atualizar perfil",
                            "profile.js",
                            "UpdateProfile",
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
                        "Atualizar perfil",
                        "profile.js",
                        "UpdateProfile",
                        mensagemRetorno,
                        null,
                        "portal"
                    );

                    this.alertStore.error(mensagemRetorno);
                });
        },

        GerarObjeto(
            uf,
            regTrib,
            atividade,
            cnae,
            recBruta,
            cfop,
            dtUltRec,
            apelido
        ) {
            let perfil = new Object();

            perfil.uf = uf;
            perfil.profileId = this.perfil.prfId;
            perfil.taxRegime = regTrib;
            perfil.typeCnae = atividade;
            perfil.userId = this.userStore.user.userId;
            perfil.cnae = cnae;
            perfil.recBruta = Number(recBruta).toFixed(2);
            perfil.cfop = cfop == null ? "" : cfop;
            perfil.dtUltRec = dtUltRec;
            perfil.principal = this.perfil.prfPrincipal;
            perfil.specialRegime = "";
            perfil.apelido = apelido;

            if (this.regime != null || this.regime != undefined)
                perfil.specialRegime = this.regime;

            if (this.regime == "NÃO") perfil.specialRegime = "";

            return perfil;
        },

        //----------------------------------------------------------------------
        // Retorna a Data para gravação
        //----------------------------------------------------------------------
        GetDataGravacao() {
            let today = new Date();

            if (this.userStore.user.profile.prfDtUltRec != "") {
                let perfData = helpers.ConvDataToMmDdYyyy(
                    this.userStore.user.profile.prfDtUltRec
                );
                let dtPerfil = new Date(perfData);

                if (dtPerfil > today) {
                    today = dtPerfil;
                }
            }

            let day = today.getDate();
            let month = today.getMonth() + 1;
            let year = today.getFullYear();
            let dtRetorno = "";

            //----------------------------------------------------------------------
            // Será TRUE quando o usuário marcar a opção "Me lembre em 30 dias" no
            // modal "Atualização da Receita Bruta"
            //----------------------------------------------------------------------
            if (this.dtmaistrinta) {
                month = today.getMonth() + 2;
            }
            //----------------------------------------------------------------------

            dtRetorno =
                year +
                "-" +
                ("" + month).padStart(2, "0") +
                "-" +
                ("" + day).padStart(2, "0");

            return dtRetorno;
        },

        BuscarRegimesEspeciais(ufAlterada = false) {
            if (this.san3 || this.gt) {
                if (ufAlterada) this.regime = "";

                let tokenSessao = sessionStorage.getItem("tokenSessao");
                let id = GetSessionStorageData("DadosCliente", "userId");

                let url =
                    RetUrlAPI() +
                    `SearchSpecialRegime?uf=${this.uf}&userID=${id}&sessionToken=${tokenSessao}`;

                CallGetAsync(url)
                    .then((data) => {
                        if (data != null) {
                            this.lstRegimesEspeciais = data;
                            this.lstRegimesEspeciais.push({
                                code: "NÃO",
                                description: ""
                            });

                            if (this.regime == "") this.regime = "NÃO";
                        } else {
                            this.lstRegimesEspeciais = [];
                        }
                    })
                    .catch((reason) => {});
            }
        },

        AlterarDescricaoRegime() {
            let lstAux = this.lstRegimesEspeciais.find((x) => x.code == this.regime);

            if (lstAux) this.descricaoRegime = lstAux.description;
        },
    },
};
</script>

<style scoped lang="less"></style>
