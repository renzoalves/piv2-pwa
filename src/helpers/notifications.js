import { useAuthStore } from "@/stores/user";
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";
import helpers from "@/helpers";
import { useAlertStore } from "@/stores";

const notifications = {
  data() {
    return {
      nota_condicional: 1,
      onClassNotifications: "row alert alert-danger ml-2 mr-2",
      onClassNotificationsRead: "row alert alert-success ml-2 mr-2",
      mensagemNaoLida: false,
      alertStore: useAlertStore(),
    };
  },
  MarcarComoLido(obj, el) {
    let arrSend = Array();

    obj.not_lido = el.checked;
    this.marcarComoLido = true;

    arrSend.push({
      id: obj.not_id,
      visualized: el.checked,
    });

    this.SalvarNotificacoes(arrSend);
  },
  SalvarNotificacoes(arrSend) {
    let url = RetUrlAPI() + "SetNotificationsStatus";
    let objEnv = new Object();

    objEnv.notifications = arrSend;
    objEnv.message = "";

    this.processando = true;

    CallPostAsync("usuario", "", url, objEnv)
      .then((data) => {
        if (data.success) {
          this.processando = false;

          helpers.GravarLog(
            "Gravando status de uma notificação.",
            "notifications.html",
            "SetNotificationsUser",
            "OK",
            null,
            "portal"
          );
        } else {
          this.processando = false;
          helpers.GravarLog(
            "Não foi possível atualizar o status de leitura da notificação.",
            "notifications.html",
            "SetNotificationsUser",
            data.message,
            null,
            "portal"
          );
          this.alertStore.error(data.message);
        }
      })
      .catch((reason) => {
        this.processando = false;
        helpers.GravarLog(
          "Falha ao tentar gravar o status de leitura da notificação.",
          "notifications.html",
          "SetNotificationsUser",
          data.mensagem,
          null,
          "portal"
        );
        this.alertStore.error(data.mensagem);
      });
  },
  BuscarDadosNotificacoes() {
    let user = useAuthStore().user;

    let userLogado = user.hasAuth;
    let tokenSessao = user.tokenSession;
    let id = user.userId;
    let url =
      RetUrlAPI() +
      "GetNotificationsUser?userID=" +
      id +
      "&sessionToken=" +
      tokenSessao;

    if (!userLogado) return;

    this.processando = true;
    this.notificacoes = [];

    CallGetAsync(url)
      .then((data) => {
        if (data.notifications != null && data.notifications.length > 0) {
          data.notifications.forEach((el) => {
            let nota = new Object();

            nota.not_id = el.id;
            nota.not_usua_id = el.usuaId;
            nota.not_descricao = el.description;
            nota.not_dt_criacao = el.dateCreation.substring(0, 10);
            nota.not_hr_criacao = el.timeCreation;
            nota.not_lido = el.visualized;
            nota.not_dt_leitura = el.dateRead.substring(0, 10);
            nota.not_hr_leitura = el.timeRead;

            this.notificacoes.push(nota);
          });

          user.contadorNotifications = 0;
        }

        this.processando = false;
        this.NotificacoesNaoLidas();

        user.unread = this.mensagemNaoLida;
        user.notifications = this.notificacoes;
      })
      .catch((reason) => {
        this.processando = false;
      });
  },

  NotificacoesNaoLidas() {
    this.mensagemNaoLida = false;
    this.notificacoes.forEach((el) => {
      if (!el.not_lido) {
        this.mensagemNaoLida = true;
        return;
      }
    });
  },

  //   watch: {
  //     notificacoes: {
  //       handler() {
  //         this.NotificacoesNaoLidas();
  //       },
  //       deep: true,
  //     },
  //   },
};

export default notifications;
