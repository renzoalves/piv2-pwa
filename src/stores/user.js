import axios from "axios";
import router from "@/router/index";
import {
  defineStore
} from "pinia";
import {
  useAlertStore
} from "@/stores";
import {
  useStorage
} from "@vueuse/core";
import {
  RetUrlAPI
} from "@/helpers/axios.js";
import {
  CallPostAsync
} from "@/helpers/axios.js";
import {
  CallGetAsync
} from "@/helpers/axios.js";
import notifications from "@/helpers/notifications.js";
import helpers from "@/helpers";

export const useAuthStore = defineStore("user", {
  // Armezanando o estado de User na sessionStorage usando VueUse com o primeiro parâmetro sendo
  // o nome do dado, o segundo seu valor de inicialização e o terceiro definindo explicitamente para
  // salvar na sessionStorage (utiliza o localStorage por padrgão)
  // utilizando o VueUse para isso, o estado se mantém reativo, atualizando na sessionStorage sempre que alterado no state

  state: () => ({
    user: useStorage("user", {
      hasAuth: false
    }, sessionStorage),
  }),

  actions: {

    // Login
    async signIn(email, password) {
      let alertStore = useAlertStore();
      let city = localStorage.getItem('cidade');
      let perfis = [];

      let url = RetUrlAPI() + "Login";
      let login = new Object();

      login.email = email;
      login.password = password;

      let DadosConsulta = {
        consultas: 0,
      };

      return new Promise((resolve, reject) => {
        CallPostAsync("usuario", "", url, login)
          .then(async (data) => {

            let user = new Object();

            if (data == null) {
              alertStore.error("Retorno nulo do serviço!");

            } else if (data["messageToReturn"] != "OK") {
              alertStore.error(data);

            } else {

              user = data;
              user.hasAuth = true;

              perfis = this.definePerfis(user.userProfile);

              user.userProfile = perfis;
              user.profile = this.definePerfilPrincipal(perfis);
              user.city = '';

              user.dataQueries = DadosConsulta;

              if (city) {
                user.city = city;
              }

              this.user = user;

              // this.pegarDadosIp();
              this.salvarTokenSessao();
            }

            resolve(user);
          })
          .catch((reason) => {
            alertStore.error(reason);
            reject(reason);
          });
      });
    },

    signOut() {
      this.user = {
        hasAuth: false
      };
      router.push("/");
    },

    definePerfis(perfis) {
      let Perfil = {};
      let Perfis = [];

      if (!perfis) return [];

      perfis.forEach(function (linha, index) {
        Perfil = {};

        Perfil.hasProfile = true;
        Perfil.prfId = linha.profileId;                               // 4597
        Perfil.prfApelido = linha.apelido;                            // VENDAS NORMAL
        Perfil.prfDtUltRec = linha.dtUltRec;                          // 08/04/2024
        Perfil.prfTaxRegime = linha.taxRegime;  // 1
        Perfil.prfTypeCnae = linha.typeCnae;  // VAREJO
        Perfil.prfUF = linha.uf;  // SP
        Perfil.prfRecBruta = linha.recBruta.replace(",", ".");  // 0
        Perfil.prfCfop = linha.cfop;  // 5102
        Perfil.prfSpecialRegime = linha.specialRegime;  // ""
        Perfil.prfPrincipal = linha.principal;  // FALSE
        Perfil.prfIndex = index;  // 

        if( Perfil.prfSpecialRegime === "" ) 
          Perfil.prfSpecialRegime = "NÃO";

        if( !Perfil.prfPrincipal && perfis.length <= 1 ) 
          Perfil.prfPrincipal = true;

        if (Perfil.prfDtUltRec.length > 10)
          Perfil.prfDtUltRec = Perfil.prfDtUltRec.substring(0, 10);

        Perfis.push(Perfil);
      });

      return Perfis;
    },

    definePerfilPrincipal(perfis) {
      if (perfis.length <= 0) {
        let objReturn = new Object();

        objReturn.hasProfile = false;
        objReturn.prfId = 0;
        objReturn.prfUF = "AC";
        objReturn.prfTaxRegime = 0;
        objReturn.prfTypeCnae = "GERAL";
        objReturn.prfRecBruta = 0;
        objReturn.prfCfop = "";
        objReturn.prfDtUltRec = "";
        objReturn.prfSpecialRegime = "";
        objReturn.prfApelido = "PERFIL PRINCIPAL";
        objReturn.prfPrincipal = true;

        return objReturn;
      }

      const profile = perfis.filter((prof) => prof.prfPrincipal == true);
      return profile[0];
    },

    forgotPassword(email) {
      let alertStore = useAlertStore();
      try {
        let url = RetUrlAPI() + "CheckEmail";

        let autenticUser = new Object();
        autenticUser.email = email;

        this.processando = true;

        CallPostAsync("usuario", "", url, autenticUser)
          .then((data) => {
            if (data != "OK") {
              this.processando = false;
              alertStore.error("Email não encontrado no cadastro!");
            } else {
              helpers.GerarTokenEmail(email);
            }
          })
          .catch((reason) => {
            this.processando = false;
            alertStore.error("Erro ao verificar email: " + reason);
          });
      } catch (error) {
        this.processando = false;
        alertStore.error("Erro ao enviar lembrete de senha.");
      }
    },

    registerUser(user) {
      let alertStore = useAlertStore();
      let cadSimplificado = false;
      let codigoCliente = "";
      let url = RetUrlAPI() + "Register";
      let token = "";
      let dadosEmail = new Object();

      dadosEmail.nome = user.nome;
      dadosEmail.senha = user.password;

      CallPostAsync("usuario", token, url, user)
        .then((data) => {
          if (data.message) {
            if (!data.message.startsWith("OK")) {
              this.processando = false;
              alertStore.error(data.message);
              return;
            }
          }

          if (data.startsWith("OK")) {
            this.processando = false;

            if (data.length > 2) {
              let Perfil = new Object();

              codigoCliente = data.substring(3, data.length);

              this.user = {
                userId: codigoCliente
              };

              if (cadSimplificado) {
                helpers.GravarLog(
                  "Realizou cadastro e através da tela de Contratos.",
                  "Tela de Cadastro Intuitivo",
                  "Register",
                  "OK",
                  null,
                  "portal"
                );
              } else {
                helpers.GravarLog(
                  "Realizou cadastro e aceitou os termos.",
                  "Tela de Cadastro",
                  "Register",
                  "OK",
                  null,
                  "portal"
                );
              }
            }

            alertStore.success(
              "Usuário cadastrado com sucesso!! Verifique seu e-mail."
            );

            helpers.EnviarEmail(
              cadSimplificado ? 6 : 0,
              user.email,
              dadosEmail
            );

            if (cadSimplificado) {
              return codigoCliente;
            } else {
              helpers.LimparTokenSessao(true, true);
              return;
            }
          } else {
            this.processando = false;
            alertStore.error(data);
          }
        })
        .catch((reason) => {
          this.processando = false;
          alertStore.error(reason);
        });
    },

    salvarTokenSessao() {
      let token = this.user.token;
      let tokenSessao = this.user.tokenSession;

      let url =
        RetUrlAPI() +
        "SaveTokenSession?token=" +
        token +
        "&tokenSession=" +
        tokenSessao;

      let autenticUser = new Object();
      autenticUser.token = token;
      autenticUser.tokenSession = tokenSessao;

      CallPostAsync("usuario", "", url, autenticUser).then((data) => {
        if (data == "OK") {
          notifications.BuscarDadosNotificacoes();
        }
      });
    },

    async pegarDadosIp() {
      // let url = "https://iplist.cc/api";
      // let url = "https://api64.ipify.org/";
      let url = "https://jsonip.com/";

      await CallGetAsync(url, false).then((data) => {
        if (data != null) {
          // return data.city;
          localStorage.setItem('cidade', data.ip);
          return data.ip;
        }
      });
    },

    verificarEmail(user) {
      let alertStore = useAlertStore();

      let url = RetUrlAPI() + "NewSessionToken";
      let token = "";
      let email = new Object();

      email.DestinationEmail = user.mail;

      CallPostAsync("usuario", token, url, email)
        .then((data) => {
          if (data.messageToReturn == "OK") {
            let dadosEmail = new Object();
            dadosEmail.token = data.token;
            dadosEmail.dataHora = data.dateHour;
            dadosEmail.destinationEmail = user.mail;
            dadosEmail.nome = this.usrNome;
            dadosEmail.senha = this.getSenhaAleatoria();

            this.gravarTokenDeAutenticacao(dadosEmail);

            this.processando = false;
          } else {
            this.processando = false;
            alertStore.error(
              "Ocorreu um erro durante a operação de verificação de E-mail, por favor tente novamente!"
            );
          }
        })
        .catch((reason) => {
          this.processando = false;
          alertStore.error("Não foi possível estabelecer conexão com o servidor ao validar a Verificação de E-mail.");
        });
    },

    gravarTokenDeAutenticacao(dadosEmail) {
      let url = RetUrlAPI() + "RequestEmailValidation?token=" + dadosEmail.token + "&data=" + dadosEmail.senha + "&inf=" + dadosEmail.dataHora;

      this.processando = true;

      // Grava o Token no cadastro do usuário
      CallGetAsync(url, false)
        .then((data) => {
          var t = "m";
          helpers.EnviarEmail(7, dadosEmail.destinationEmail, dadosEmail);

          this.processando = false;
        })
        .catch((reason) => {
          this.processando = false;
        });


      this.processando = false;
    },

    getSenhaAleatoria() {
      const varAux = new Date();
      let pwd = `${varAux.getDay()}${varAux.getMilliseconds()}${varAux.getDate()}${varAux.getDay()}`;

      if (pwd.length < 6) {
        pwd = pwd.padStart(6, "0");
      }

      if (pwd.length > 6) {
        pwd = pwd.substring(0, 6);
      }

      return pwd;
    },

    alterarSenha(senha, confirmarSenha) {
      let alertStore = useAlertStore();

      if (senha == confirmarSenha) {
        var auxDados = this.obterDados();
        var user = new Object();

        user.email = auxDados.token.replace('%20', '+').replace('%20', '+') + "=";
        user.password = senha;
        user.confirmPassword = confirmarSenha;
        user.dateHour = auxDados.inf.replace('%20', '+').replace('%20', '+') + "=";
        user.forgotPassword = 'S';

        let url = RetUrlAPI() + 'AlterPassword';
        let token = ""

        CallPostAsync("usuario", token, url, user)
          .then(data => {
            if (data == "OK") {

              helpers.GravarLog("Alterou a senha", "user.js", "AlterPassword", "", null, "portal");
              alertStore.success("Senha alterada com sucesso.");

            } else {
              alertStore.error(data["message"]);
            }
          })
          .catch(reason => {
            alertStore.error(reason);
          });
      } else {
        alertStore.error("As senhas não conferem!");
        return;
      }
    },

    // Método para obter dados da url
    obterDados() {
      // Pegar a url e depois quebrar token(email) e inf(token + dataHora)
      // var query = window.location.search.slice(1);
      // var partes = query.split('&');
      // var data = {};
      // partes.forEach(function (parte) {
      //   var chaveValor = parte.split('=');
      //   var chave = chaveValor[0];
      //   var valor = chaveValor[1];
      //   data[chave] = valor;
      // });

      var query = window.location.pathname;
      query = query.substring(9);

      var partes = query.split('=');
      var data = new Object();

      data.token = partes[0];
      data.inf = partes[1].substring(1);

      return data;
    },

  },

  created() {
    this.PegarDadosIp();
  },

});