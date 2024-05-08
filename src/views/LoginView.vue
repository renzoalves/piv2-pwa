<template>
    <div v-if="processando" id="loading">
        <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>

    <div class="form-wrapper">
        <div
            class="form-box"
            :class="{ biggerForm: showNewAccount, newPasswordForm: showNewPassword }"
        >
            <div class="header">
                <a href="/">
                    <img class="logo" src="@/assets/images/blue-logo.png" alt="Logotipo iMendes" />
                </a>
            </div>

            <!-- <h1>{{ mId }} / {{ mToken }} / {{ mInf }}</h1> -->

            <!-- (0) TELA LOGIN -->
            <transition appear @enter="fromRight">
                <form @submit.prevent="userLogin" v-if="showLogin" class="login-form">
                    <div class="row">
                        <label>E-mail: </label>
                        <div class="col-md-12 mb-2">
                            <input
                                type="email"
                                id="email-login"
                                name="email-login"
                                class="form-control form-control-sm"
                                placeholder="Email"
                                v-model="email"
                                data-test="email-login"
                            />
                        </div>

                        <div class="col-md-12 mb-1">
                            <label>Senha: </label>
                            <input
                                :type="typeInput"
                                id="senha-login"
                                name="senha-login"
                                class="form-control form-control-sm valor"
                                placeholder="Senha"
                                v-model="password"
                                data-test="senha-login"
                            />

                            <div id="lupa" v-on:click="showHidePassword()">
                                <i v-bind:class="classeEye"></i>
                            </div>
                        </div>
                    </div>

                    <GeralButton buttonType="submit" text="Entrar" :loading="isLoading" />

                    <button @click.prevent="showForms(1)" data-id="1" class="forgot-password-btn">
                        Esqueceu sua senha?
                    </button>
                </form>
            </transition>

            <!-- (1) RECUPERAÇÃO DE SENHA -->
            <transition @enter="fromRight">
                <form
                    @submit.prevent="userForgotPassword"
                    v-if="showRecover"
                    class="forgot-password-form"
                >
                    <div class="text">
                        <h5>Recuperação de Senha</h5>
                        <p>Não se preocupe, acontece com todos nós</p>
                    </div>

                    <label>E-mail: </label>
                    <div class="col-md-12 mb-2">
                        <input
                            type="email"
                            id="email-recover"
                            name="email-recover"
                            class="form-control form-control-sm"
                            placeholder="Email"
                            v-model="email"
                        />
                    </div>

                    <GeralButton
                        buttonType="submit"
                        text="Recuperar"
                        :loading="isLoading"
                        @click.prevent="
                            showForms(0);
                            notifyRecoverEmail();
                        "
                        data-id="0"
                    />

                    <button @click.prevent="showForms()" data-id="0" class="forgot-password-btn">
                        Voltar
                    </button>
                </form>
            </transition>

            <!-- (2) CRIAR CONTA -->
            <transition @enter="fromRight">
                <form
                    @submit.prevent="userForgotPassword"
                    v-if="showNewAccount"
                    class="new-account-form"
                >
                    <div class="text email-confirmation-text">
                        <h5>Informe seus dados para cadastro</h5>
                        <p>Teste grátis por 7 dias</p>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-2 pr-2">
                            <label>Nome: </label>
                            <input
                                id="new-name"
                                name="new-name"
                                type="text"
                                class="form-control form-control-sm"
                                placeholder="Nome"
                                v-model="newName"
                            />
                        </div>

                        <div class="col-md-6 mb-2 pr-2">
                            <label>Sobrenome: </label>
                            <input
                                id="new-surname"
                                name="new-surname"
                                type="text"
                                class="form-control form-control-sm"
                                placeholder="Sobrenome"
                                v-model="newSurname"
                            />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-2 pr-2">
                            <label>E-mail: </label>
                            <input
                                type="email"
                                id="new-email"
                                name="new-email"
                                class="form-control form-control-sm"
                                placeholder="Email"
                                v-model="newEmail"
                            />
                        </div>

                        <div class="col-md-6 mb-2 pr-2">
                            <label>Telefone: </label>
                            <input
                                type="text"
                                id="new-phone"
                                name="new-phone"
                                class="form-control form-control-sm"
                                placeholder="Telefone"
                                v-model="newPhone"
                            />
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6 mb-2 pr-2">
                            <label>Senha: </label>
                            <input
                                :type="typeInput"
                                id="new-pass"
                                name="new-pass"
                                class="form-control form-control-sm valor"
                                placeholder="Senha"
                                v-model="newPass"
                            />
                            <div id="lupa" v-on:click="showHidePassword()">
                                <i v-bind:class="classeEye"></i>
                            </div>
                        </div>

                        <div class="col-md-6 mb-2 pr-2">
                            <label>Confirme sua senha: </label>
                            <input
                                :type="typeInput"
                                id="new-confirm-pass"
                                name="new-confirm-pass"
                                class="form-control form-control-sm valor"
                                placeholder="Confirme sua senha"
                                v-model="newConfirmPass"
                            />
                            <div id="lupa" v-on:click="showHidePassword()">
                                <i v-bind:class="classeEye"></i>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-12">
                            <input
                                class="mr-1"
                                type="checkbox"
                                id="terms"
                                name="terms"
                                v-model="terms"
                            />
                            <label for="terms">
                                Atesto que li e aceitei os termos de uso e políticas de privacidade
                            </label>
                        </div>
                    </div>

                    <GeralButton
                        @click.prevent="registerUser"
                        buttonType="submit"
                        text="Cadastrar"
                        :loading="isLoading"
                    />

                    <button @click.prevent="showForms()" data-id="0" class="forgot-password-btn">
                        Voltar
                    </button>
                </form>
            </transition>

            <!-- (3) ALTERAÇÃO DE SENHA -->
            <transition @enter="fromRight">
                <form
                    @submit.prevent="userNewPassword"
                    v-if="showNewPassword"
                    class="new-password-form"
                >
                    <div class="text">
                        <h5>Alteração de Senha</h5>
                        <p>Digite a senha que deseja abaixo</p>
                    </div>

                    <div class="col-md-12 mb-5">
                        <label>Senha: </label>
                        <input
                            :type="typeInput"
                            id="new-password"
                            name="new-password"
                            class="form-control form-control-sm valor"
                            placeholder="Digite sua senha"
                            v-model="newPassword"
                        />
                        <div id="lupa" v-on:click="showHidePassword()">
                            <i v-bind:class="classeEye"></i>
                        </div>
                    </div>

                    <div class="col-md-12 mb-5">
                        <label>Senha: </label>
                        <input
                            :type="typeInput"
                            id="new-password-confirm"
                            name="new-password-confirm"
                            class="form-control form-control-sm valor"
                            placeholder="Confirme sua senha"
                            v-model="newPasswordConfirm"
                        />
                        <div id="lupa" v-on:click="showHidePassword()">
                            <i v-bind:class="classeEye"></i>
                        </div>
                    </div>

                    <GeralButton
                        buttonType="submit"
                        text="Atualizar"
                        :loading="isLoading"
                        @click.prevent="
                            userStore.alterarSenha(newPassword, newPasswordConfirm);
                            showForms(0);
                        "
                        data-id="0"
                    />
                </form>
            </transition>

            <!-- (4) VERIFICAÇÃO DE E-MAIL -->
            <transition @enter="fromRight">
                <div v-if="showConfirmEmail">
                    <div class="text email-confirmation-text">
                        <h5>E-mail não verificado</h5>
                        <p>
                            Olá, para confirmar sua identidade enviaremos um e-mail para:
                            <span class="bold">{{ userStore.user.mail }}</span>
                        </p>
                        <p class="second-text">
                            Clique no link indicado no e-mail e faça a validação do seu usuário. Se
                            não encontrar na sua caixa de entrada, procure na caixa de spam.
                        </p>
                    </div>

                    <GeralButton
                        @click.prevent="sendNewMail"
                        buttonType="submit"
                        text="Verificar e-mail"
                        :loading="false"
                    />

                    <button @click.prevent="router.push('/')" class="forgot-password-btn">
                        Continuar sem verificação
                    </button>
                </div>
            </transition>

            <!-- (5) VERIFICAÇÃO DE E-MAIL -->
            <transition @enter="fromRight">
                <div v-if="showConfirmedEmail">
                    <div class="text email-confirmation-text">
                        <h5 style="color: #008000 !important" v-if="emailVerificado">
                            E-mail verificado com sucesso!!
                        </h5>
                        <h5 style="color: #ff0000 !important" v-else>E-mail não verificado</h5>

                        <p class="second-text" v-if="emailVerificado">
                            Clique em continuar para ser direcionado para tela de Login.
                        </p>
                        <p class="second-text" v-else>
                            Clique no link indicado no e-mail e faça a validação do seu usuário. Se
                            não encontrar na sua caixa de entrada, procure na caixa de spam.
                        </p>
                    </div>

                    <GeralButton
                        buttonType="submit"
                        text="Continuar"
                        :loading="false"
                        @click.prevent="showForms(0)"
                        data-id="0"
                    />
                </div>
            </transition>
        </div>

        <div class="register-text" v-if="showLogin">
            Não tem uma conta?
            <button class="register-link" @click.prevent="showForms(2)" data-id="2">
                Crie uma gratuitamente
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useAuthStore } from "@/stores/user";
import helpers from "@/helpers";
import gsap from "gsap";
import { useAlertStore } from "@/stores";
import { useRouter } from "vue-router";
import { RetUrlAPI } from "@/helpers/axios.js";

export default {
    data() {
        return {
            mId: null,
            mToken: null,
            mInf: null,

            router: null,

            email: null,
            password: null,
            isLoading: false,
            terms: false,

            newName: null,
            newSurname: null,
            newEmail: null,
            newPhone: null,
            newPass: null,
            newConfirmPass: null,

            showLogin: true,
            showRecover: false,
            showNewAccount: false,
            showNewPassword: false,
            showConfirmEmail: false,
            showConfirmedEmail: false,

            processando: false,

            emailVerificado: false,
            showPassword: false,
            typeInput: "password",
            classeEye: "fa fa-eye",

            formsToShow: [
                true, //this.showLogin,
                false, //this.showRecover,
                false, //this.showNewAccount,
                false, //this.showNewPassword,
                false, //this.showConfirmEmail,
            ],
            userStore: null,
        };
    },

    methods: {
        async userLogin() {
            if ((this.email != "", this.password != "")) {
                this.isLoading = true;

                const credentials = [this.email, this.password];

                try {
                    const updatedUser = await this.userStore.signIn(...credentials);

                    if (updatedUser.hasAuth && updatedUser.emailVerificado) {
                        this.router.push("/");
                    } else if (updatedUser.hasAuth && !updatedUser.emailVerificado) {
                        this.showForms(9);

                        // this.formsToShow.map((form) => {
                        //     form.value = false;
                        // });

                        this.showForms(4);
                        // this.showConfirmEmail = true;
                    }
                } catch (error) {
                    console.error(error);
                }

                this.isLoading = false;
            }
        },

        showHidePassword() {
            if (!this.showPassword) {
                this.typeInput = "text";
                this.classeEye = "fa fa-eye-slash";
            } else {
                this.typeInput = "password";
                this.classeEye = "fa fa-eye";
            }

            this.showPassword = !this.showPassword;
        },

        onEnter() {
            this.userLogin();
        },

        userForgotPassword() {
            if (helpers.validateInputs([this.userStore.email])) {
                const sendEmail = [this.userStore.email];
            }
        },

        showForms(index) {
            this.showLogin = false;
            this.showRecover = false;
            this.showNewAccount = false;
            this.showNewPassword = false;
            this.showConfirmEmail = false;
            this.showConfirmedEmail = false;

            switch (index) {
                case 0:
                    this.showLogin = true;
                    break;
                case 1:
                    this.showRecover = true;
                    break;
                case 2:
                    this.showNewAccount = true;
                    break;
                case 3:
                    this.showNewPassword = true;
                    break;

                // E-mail não verificado.
                case 4:
                    this.showConfirmEmail = true;
                    break;

                case 5:
                    this.showConfirmedEmail = true;
                    this.obterDadosEmailVerificado();
                    break;

                default:
                    this.showLogin = true;
                    this.showRecover = false;
                    this.showNewAccount = false;
                    this.showNewPassword = false;
                    this.showConfirmEmail = false;
                    this.showConfirmedEmail = false;
                    this.emailVerificado = false;
                    break;
            }
        },

        sendNewMail() {
            const alertStore = useAlertStore();

            this.userStore.verificarEmail(this.userStore.user);

            alertStore.success("Enviamos um e-mail com os passos para autenticar seu cadastro!");
        },

        registerUser() {
            const alertStore = useAlertStore();

            if (!this.terms) {
                alertStore.error(
                    "Você deve aceitar os termos e as políticas de privacidade para prosseguir"
                );
                return;
            }

            if(this.newName === null || this.newSurname === null || this.newEmail === null || 
                this.newPhone  === null ||this.newPass === null || this.newConfirmPass == null) {
                    alertStore.error("Todos os campos precisam estar preenchidos");
                    return;
                } 

            let user = this.UserDataInProduction(
                this.newName,
                this.newSurname,
                this.newEmail,
                "",
                this.newPhone,
                this.newPass,
                this.newConfirmPass
            );

            this.userStore.registerUser(user);
        },

        UserDataInProduction(
            nome,
            sobrenome,
            email,
            uf,
            telefone,
            senha,
            confirmarSenha,
            empresa,
            cnpj,
            segmento
        ) {
            var user = new Object();

            user.name = nome;
            user.surname = sobrenome;
            user.email = email;
            user.phone = telefone;
            user.password = senha;
            user.confirmPassword = confirmarSenha;
            user.managerId = "";
            user.urlContext = RetUrlAPI();

            // Campos não obrigatórios: 11/04/22
            user.uf = !uf ? "" : uf;
            user.company = !empresa ? "" : empresa;
            user.cnpjcpf = !cnpj ? "" : cnpj;
            user.segment = !segmento ? "0" : segmento;

            return user;
        },

        notifyRecoverEmail() {
            const alertStore = useAlertStore();
            this.userStore.forgotPassword(this.email);
        },

        fromRight(el) {
            gsap.fromTo(el, { x: 500, opacity: 0 }, { x: 0, opacity: 1, duration: 1 });
        },

        // Método para obter dados da url
        obterDadosEmailVerificado() {
            var query = window.location.pathname;
            
            query = query.substring(9);

            this.emailVerificado = (query === 'OK' );
        },
    },

    created() {
        this.mId = this.$route.params.id;
        this.mToken = this.$route.params.token;
        this.mInf = this.$route.params.inf;

        this.router = useRouter();
        this.userStore = useAuthStore();
    },

    watch: {
        mId: function (newValue, oldValue) {
            switch (newValue) {
                // Recuperação de senha
                case "3":
                    this.showForms(3);
                    break;

                // Recuperação de senha
                case "5":
                    this.showForms(5);
                    break;

                default:
                    return;
            }
        },
    },
};
</script>

<style scoped lang="less">
.form-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 30px;
    width: 100%;
    height: 100vh;
    background: @primaryBlue;

    .login-form {
        margin-top: 30px;
    }

    .register-text {
        text-transform: uppercase;
        color: #fff;
        font-size: 16px;
        font-weight: 300;

        .register-link {
            background: none;
            cursor: pointer;
            border: none;
            outline: none;
            font-weight: 600;
            text-decoration: underline;
            text-transform: uppercase;
            color: #fff;
            font-size: 16px;
        }
    }

    .form-box {
        padding: 45px 75px;
        background: #fff;
        box-shadow: 0px 2px 10px #00000029;
        border-radius: 5px;
        box-sizing: border-box;
        width: 30%;
        height: 55%;
        overflow: hidden;
        position: relative;

        form {
            width: 100%;
        }

        &.biggerForm {
            width: 45%;
            height: 75%;
        }

        &.newPasswordForm {
            height: 60%;
        }

        .new-account-form {
            .text {
                margin-top: 20px;
            }
            .create-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
                margin: 30px 0px;
            }
        }

        .text {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8.5px;
            margin: 40px 0px 30px;

            h5 {
                font-size: 24px;
                color: @primaryBlue;
            }
            p {
                color: @primaryGray;
                font-size: 16px;
            }

            &.email-confirmation-text {
                p {
                    text-align: center;
                }

                .bold {
                    font-weight: 600;
                }

                .second-text {
                    margin-top: 20px;
                }
            }
        }

        .custom-checkbox {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            font-weight: normal;
            font-size: 10px;
            text-transform: uppercase;
            margin-top: 20px;
            color: @primaryGray;

            input {
                visibility: hidden;
                height: 0px;
                width: 0px;
            }

            .checkbox {
                width: 18px;
                height: 18px;
                border: 2px solid @primaryGray;
                border-radius: 5px;
                cursor: pointer;
                .soft-transition();

                &.checked {
                    background: @primaryBlue;
                    border: 2px solid @primaryBlue;
                    position: relative;

                    &:after {
                        // content: url('https://api.iconify.design/material-symbols/check-small.svg?color=white&width=28&height=28');
                        content: url("https://api.iconify.design/material-symbols/check.svg?color=white&width=25&height=25");
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                    }
                }
            }
        }

        .forgot-password-btn {
            border: none;
            background: none;
            outline: none;
            text-transform: uppercase;
            text-decoration: underline;
            color: @primaryBlue;
            font-weight: 600;
            width: 100%;
            margin-top: 0px;
            cursor: pointer;
        }

        .header {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;

            .logo {
                width: 280px;
            }
        }

        .input-group {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .geral-button {
            margin: 35px auto 10px;
        }
    }
}

@media only screen and (max-width: 1600px) {
    .form-wrapper .form-box {
        .header .logo {
            width: 230px;
        }

        .text {
            margin: 20px 0px 20px;
        }
    }
}

@media only screen and (max-width: 1480px) {
    .form-wrapper .form-box {
        width: 35%;

        &.biggerForm {
            width: 50%;
        }

        .input-group[data-v-45f5edd7] {
            gap: 15px;
        }

        .new-account-form .create-grid {
            gap: 15px;
            margin: 15px 0px;
        }
    }
}

@media only screen and (max-width: 1366px) {
    .form-wrapper {
        .form-box {
            height: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 70%;

            .header .logo {
                width: 200px;
            }

            .geral-button {
                padding: 14px 75px;
                font-size: 16px;
                margin: 15px auto 15px;
            }

            .text {
                margin: 10px 0px 10px;
                h5 {
                    font-size: 20px;
                }

                &.email-confirmation-text {
                    margin-top: 10px;
                }
            }

            &.biggerForm {
                height: 85%;
            }
        }

        .login-form {
            margin-top: 10px;
        }
    }
}

@media only screen and (max-width: 1024px) {
    .form-wrapper .form-box {
        width: 50%;

        &.biggerForm {
            width: 70%;
        }
    }
}

@media only screen and (max-width: 768px) {
    .form-wrapper .form-box {
        width: 60%;

        .header {
            margin-bottom: 30px;
            .logo {
                width: 250px;
            }
        }

        .geral-button {
            margin: 50px auto 15px;
        }

        .new-account-form .create-grid {
            grid-template-columns: 1fr;
        }
    }
}

@media only screen and (max-width: 600px) {
    .form-wrapper .form-box {
        width: 90%;

        &.biggerForm {
            width: 90%;
        }
    }
}

@media only screen and (max-width: 450px) {
    .form-wrapper {
        .register-text {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .form-box {
            padding: 30px;

            &.biggerForm {
                height: 95%;
            }

            .header {
                margin-bottom: 10px;

                .logo {
                    width: 180px;
                }
            }

            .text {
                text-align: center;

                h5 {
                    font-size: 18px;
                }

                p {
                    font-size: 14px;
                }
            }

            .geral-button[data-v-45f5edd7] {
                margin: 20px auto 15px;
            }
        }
    }
}

@media only screen and (max-width: 375px) {
    .form-wrapper {
        .form-box {
            .geral-button {
                margin: 10px auto;
                padding: 10px 75px;
            }
            .custom-checkbox {
                gap: 0px;

                .checkbox[data-v-45f5edd7] {
                    width: 20px;
                    height: 15px;
                    margin-right: 10px;
                }
            }
        }
    }
}
</style>
