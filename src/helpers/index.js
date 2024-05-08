import { useAlertStore } from "@/stores";
import { useAuthStore } from "@/stores/user";
import axios from "axios";
import { RetUrlAPI } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import { CallPost } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";
import router from "@/router/index";
import XLSX from "xlsx";
import IMask from "imask";
import TableExport from "tableexport";

const helpers = {
  validateInputs: (values) => {
    const validate = [...values].map((e) => {
      if (e.value == "") {
        e.classList.add("invalid");
        e.focus();
        return false;
      }

      e.classList.remove("invalid");

      return true;
    });

    if (validate === false || validate.includes(false)) return false;
    else return true;
  },

  getUFs: () => {
    return [
      "AC",
      "AL",
      "AM",
      "AP",
      "BA",
      "CE",
      "DF",
      "ES",
      "GO",
      "MA",
      "MG",
      "MS",
      "MT",
      "PA",
      "PB",
      "PE",
      "PI",
      "PR",
      "RJ",
      "RN",
      "RO",
      "RR",
      "RS",
      "SC",
      "SE",
      "SP",
      "TO",
    ];
  },

  getTribs: () => {
    return ["GERAL", "SIMPLES NACIONAL", "LUCRO REAL", "LUCRO PRESUMIDO"];
  },

  getCnaes: () => {
    return ["GERAL", "ATACADO", "CONSTRUCAO", "INDUSTRIA", "FARMA", "VAREJO"];
  },

  getSegments: async () => {
    let url = RetUrlAPI() + "GetSegments";

    let data = await CallGetAsync(url, "")
      .then((data) => {
        return data;
      })
      .catch((reason) => {
        return [];
      });

    return data;
  },

  inputMasks: (input, mask) => {
    input = getMask[mask](input);

    // console.log(input);

    return input;
  },

  getSolutions: async (id, token) => {
    const url = `${import.meta.env.VITE_APP_API_ENDPOINT
      }/UserSolutions?userID=${id}&sessionToken=${token}`;

    // console.log(url);

    try {
      await axios.get(url).then((response) => {
        if (response.solutions != null) {
          const solutions = response.solutions;

          solutions.forEach((solution) => {
            if (solution.usus_plan_descricao.indexOf("-") > 0) {
              solution.usus_plan_descricao =
                solution.usus_plan_descricao.substring(
                  0,
                  solution.usus_plan_descricao.indexOf("-") - 1
                );
            }

            if (solution.usus_plan_descricao == "PERÍODO DE TESTES") {
              solution.usus_plan_limite_lote = "0(zero)";
            }
          });

          return solutions;
        } else {
          return false;
        }
      });
    } catch (error) {
      const alertStore = useAlertStore();
      alertStore.error(error.response.data);

      return false;
    }
  },

  DefCaracTrib(ctrib) {
    switch (ctrib) {
      case "GERAL":
        ctrib = 0;
        break;
      case "LUCRO REAL":
        ctrib = 1;
        break;
      case "LUCRO PRESUMIDO":
        ctrib = 3;
        break;
      case "SIMPLES NACIONAL":
        ctrib = 2;
        break;
      case "TODOS":
        ctrib = 9;
        break;

      case 0:
        ctrib = "GERAL";
        break;
      case 1:
        ctrib = "LUCRO REAL";
        break;
      case 2:
        ctrib = "SIMPLES NACIONAL";
        break;
      case 3:
        ctrib = "LUCRO PRESUMIDO";
        break;
      case 9:
        ctrib = "TODOS";
        break;
    }

    return ctrib;
  },

  EnviarEmail(opcao, emailUsuario, dadosEmail) {
    const alertStore = useAlertStore();
    let url = RetUrlAPI() + "SendEmail";

    let email = new Object();
    email.destinationEmail = emailUsuario;
    email.emailType = opcao;

    switch (opcao) {
      case 0:
        email.title = "Bem vindo(a) ao Portal IMendes 🙂";
        email.message =
          "Olá " +
          dadosEmail.nome +
          ", seja bem-vindo(a) ao Portal IMendes, onde a Gestão Tributária é Consciente. \n\n" +
          "Aproveite para desfrutar tudo o que o Portal oferece como experiência de produtividade e conhecimento. Ao término do seu período de teste " +
          "de presente, contate nosso time para mais informações de como aprofundar sua relação com as soluções IMendes e descobrir aquela que é ideal para você.\n\n" +
          "Conte com a gente!\n\n" +
          "IMendes.";
        break;

      case 1:
        email.title = "Alterar a senha";
        email.message =
          "Olá, para alterar sua senha acesse o seguinte link: " +
          RetUrlAPI() +
          "ClearUserPassWord?token=" +
          dadosEmail.token +
          "&inf=" +
          dadosEmail.dataHora;
        break;

      case 2:
        email.title = dadosEmail.titulo;
        email.message = dadosEmail.mensagem;
        break;

      case 3:
        email.title = "Aviso sobre encerramento de conta 🙁";
        email.message =
          "Olá. Identificamos que você solicitou o encerramento da sua conta no nosso portal. Pode deixar que seus dados já foram apagados da nossa base. \n\n" +
          "Caso exista algo que possamos fazer para reverter isso, ou caso não tenha sido você, por favor entre em contato.\n\n" +
          "Estamos à disposição 😉";
        break;

      case 5:
        email.title = "Bem vindo(a) ao Portal IMendes 🙂";
        email.message = dadosEmail.message;
        break;

      case 6:
        email.title = "Bem vindo(a) ao Portal IMendes 🙂";
        email.message =
          "Olá " +
          dadosEmail.nome +
          ", seja bem-vindo(a) ao Portal IMendes, onde a Gestão Tributária é Consciente. \n\n" +
          "Aproveite para desfrutar tudo o que o Portal oferece como experiência de produtividade e conhecimento. Ao término do seu período de teste " +
          "de presente, contate nosso time para mais informações de como aprofundar sua relação com as soluções IMendes e descobrir aquela que é ideal para você.\n\n" +
          "Para acessar o portal, use a senha " +
          dadosEmail.senha +
          ".\n\n" +
          "Conte com a gente!\n\n" +
          "IMendes.";
        break;

      case 7:
        email.title = "Bem vindo(a) ao Portal IMendes 🙂";
        email.message =
          "Olá " +
          dadosEmail.nome +
          ", seja bem-vindo(a) ao Portal IMendes, onde a Gestão Tributária é Consciente. \n\n";
        email.message +=
          "Para validar seu e-mail acesse o seguinte link: " +
          RetUrlAPI() +
          "EmailFinalValidation?token=" +
          dadosEmail.token +
          "&data=" +
          dadosEmail.senha +
          "&inf=" +
          dadosEmail.dataHora;
        email.message +=
          "\n\nIMPORTANTE: Este link é válido por até 2h.\n\n" +
          "Conte com a gente!\n\n" +
          "IMendes.";

        break;
    }

    if (opcao != 5) email.linkedUserInformation = "";

    CallPostAsync("usuario", "", url, email)
      .then((data) => {
        if (data != "Error") {
          if (opcao == 1) {
            alertStore.success(
              "Enviamos um e-mail com os passos para trocar a sua senha!"
            );
          } else if (opcao == 7) {
            alertStore.success(
              "Enviamos um e-mail com os passos para autenticar seu cadastro!"
            );

            setInterval(function () {
              router.push("/");
            }, 5000);
          } else {
            if (opcao != 3 && opcao != 5 && opcao != 6) router.push("/");
          }
        } else {
          alertStore.error(
            "Não encontramos esse email na nossa base de dados!"
          );
        }
      })
      .catch((reason) => {
        this.processando = false;
        alertStore.error(
          "Não foi possível estabelecer conexão com o servidor!"
        );
      });
  },

  FirstLetterUpper(text) {
    if (text) {
      let words = text.toLowerCase().split(" ");

      for (let i = 0; i < words.length; i++) {
        let w = words[i];
        words[i] = w === "" ? "" : w[0].toUpperCase() + w.slice(1);
      }

      return words.join(" ");
    }

    return "";
  },

  FormatarDataBRParaEua(data) {
    let dataFormatada = data.substring(0, 10).split("/");
    let mDay = dataFormatada[0];
    let mMonth = dataFormatada[1] - 1;
    let mYear = dataFormatada[2].substring(0, 4);

    mDay = "0" + mDay;
    mDay = mDay.slice(mDay.length - 2);

    mMonth = "0" + mMonth;
    mMonth = mMonth.slice(mMonth.length - 2);

    return new Date(mYear, mMonth, mDay);
  },

  ValidaCNPJ(cnpj) {
    if (cnpj == undefined) return false;

    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos.charAt(1)) return false;

    return true;
  },

  FormatarTelefone(telefone) {
    var maskOptions = {
      mask: "(00)00000-0000",
    };

    var mask = IMask(telefone, maskOptions);
  },

  VerificarEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
  },

  GravarLog(acao, pagina, metodo, retorno, jsonEnvio = null, api) {
    let user = useAuthStore().user;

    let log = new Object();
    log.logAction = acao;
    log.logPage = pagina;
    log.logMethod = metodo;
    log.logReturn = retorno;
    log.logAPI = api;
    log.logIp = (localStorage.getItem('cidade')) ? localStorage.getItem('cidade') : user.city;

    if (user.userId) {
      log.logIdUser = user.userId;
    } else {
      log.logIdUser = 1108;
    }

    if (jsonEnvio != null) {
      log.LogJSONB = jsonEnvio;
    }

    let url = RetUrlAPI() + "SaveLog";

    CallPostAsync("usuario", "", url, log)
      .then((data) => { })
      .catch((reason) => {
      });
  },

  ConvDataToMmDdYyyy(data) {
    let newDate = "";

    if (data != undefined) {
      newDate =
        data.split("/")[1] +
        "/" +
        data.split("/")[0] +
        "/" +
        data.split("/")[2];
    }

    return newDate;
  },

  ConvDataToYyyyMmDd(data) {
    let newDate = "";

    newDate =
      data.split("/")[2] + "-" + data.split("/")[1] + "-" + data.split("/")[0];

    return newDate;
  },

  GerarTokenEmail(emailUsuario) {
    const alertStore = useAlertStore();

    let email = new Object();
    email.destinationEmail = emailUsuario;

    let token = "";

    let url = RetUrlAPI() + "NewSessionToken";

    CallPostAsync("usuario", token, url, email)
      .then((data) => {
        // console.log(data);
        if (data.messageToReturn == "OK") {
          let dadosEmail = new Object();
          dadosEmail.token = data.token;
          dadosEmail.dataHora = data.dateHour;

          this.EnviarEmail(1, emailUsuario, dadosEmail);
        } else {
          alertStore.error(
            "Ocorreu um erro durante a operação, por favor tente novamente!"
          );
        }
      })
      .catch((reason) => {
        alertStore.error(
          "Não foi possível estabelecer conexão com o servidor."
        );
      });

    return token;
  },

  LimparTokenSessao(logout, direcionarParaLogin) {
    // Gravar Log de saída
    let userStore = useAuthStore();
    let timestamp = new Date();
    let direcionarParaContratacao = false; // (sessionStorage.getItem('automaticRedirectionToHiring') == "true");

    this.GravarLog(
      "Saiu do sistema",
      "Menu Superior",
      "Logout",
      "OK",
      null,
      "portal"
    );

    let url = RetUrlAPI() + "ClearTokenSession";

    let autenticUser = new Object();

    if (logout) {
      userStore.user = { hasAuth: false };

      if (direcionarParaLogin) {
        // router.push("/login");
        document.location.href = "/login";
        return;
      }
    }

    autenticUser.email = userStore.user.mail;

    CallPostAsync("usuario", "", url, autenticUser)
      .then((data) => {
        if (direcionarParaContratacao) {
          document.location.href = "/pages/contratos.html?19";
        } else {
          router.push("/");
        }
      })
      .catch((reason) => {
        router.push("/");
      });
  },

  ConverterDataBr(data) {
    return data.split("-").reverse().join("/");
  },

  FormatarMoeda(valor, nroCasasDecimais) {
    let decimais = (nroCasasDecimais) ? nroCasasDecimais : 2;
    let valorAux = (valor / 1).toFixed(decimais).replace(",", ".");
    return valorAux.toString().replace(/\B(?=(\d{decimais})+(?!\d))/g, ".");
  },

  VerificarAcessos(idSolucao) {
    let user = useAuthStore().user;
    let modulos = user.modules;
    let temSolucao = false;

    let dataExp;
    let dataHoje = new Date();
    dataHoje.setHours(0, 0, 0, 0);

    modulos.forEach((item) => {
      if (item.moduleId === idSolucao) {
        dataExp = this.FormatarDataBRParaEua(item.dtExpiracao);
        temSolucao = dataExp >= dataHoje;
      }
    });

    return temSolucao;
  },

  VerificaDigito(codigoBarra) {
    // Validações Iniciais
    if (codigoBarra == null) return false;
    if (codigoBarra.length < 8) return false;
    if (codigoBarra.length > 14) return false;

    //Leandro - Coloquei isso aqui em 23/11/17 porque todo código de barras com 14 digitos fazia virar código interno (retornava false)
    if ((codigoBarra.length == 14) & codigoBarra.startsWith("0"))
      codigoBarra = codigoBarra.substring(1, 14);
    if (codigoBarra.length == 13)
      if (codigoBarra.substring(0, 7) == "0000000") return false;
    try {
      if (codigoBarra.length > 13 && !codigoBarra.startsWith("00")) {
        if (isNaN(codigoBarra)) return false;
        else return true;
      } else {
        let digitoPassado = parseInt(
          codigoBarra.substring(codigoBarra.length - 1, codigoBarra.length)
        );

        codigoBarra = codigoBarra
          .substring(0, codigoBarra.length - 1)
          .padStart(12, "0");

        let soma = 0;
        let caracter = 0;

        for (let i = 0; i < codigoBarra.length; i++) {
          caracter = parseInt(codigoBarra.substring(i, i + 1));

          if (i % 2 == 0) soma = soma + caracter;
          else soma = soma + caracter * 3;
        }

        soma = soma % 10;
        soma = 10 - soma;

        if (soma >= 10) soma = 0;

        if (soma == digitoPassado) return true;
        else return false;
      }
    } catch (reason) {
      return false;
    }
  },

  splitString(stringToSplit, separador, posicaoDesejada) {
    var arrayOfStrings = stringToSplit.split(separador);

    if (posicaoDesejada) {
      return arrayOfStrings[posicaoDesejada];
    } else {
      return arrayOfStrings[0];
    }
  },

  VerificarTipoArquivo(nome) {
    nome = this.splitString(nome, ".", 1);
    switch (nome) {
      case "csv":
        return "CSV";
      case "xlsx":
        return "XLSX";
      case "xml":
        return "XML";
      default:
        return "INVALIDO";
    }
  },

  ProcessarArquivo(tipoArquivo, evt, vm) {
    let consLote = "";

    if (tipoArquivo == "CSV") {
      consLote = evt.target.result;
      consLote = consLote
        .replaceAll(",", ";")
        .replaceAll(/'/g, "")
        .replaceAll(/"/g, "");
      vm.processando = false;
    } else {
      vm.processando = false;
      var data = evt.target.result;

      var workbook = XLSX.read(data, {
        type: "binary",
      });

      workbook.SheetNames.forEach((sheet) => {
        let rowObject = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet]);
        consLote = rowObject;
        consLote = consLote
          .replaceAll(",", ";")
          .replaceAll(/'/g, "")
          .replaceAll(/"/g, "");
      });
    }

    return consLote;
  },

  CarregarArquivo(e, vm) {
    // Verificar XLSX ou CSV
    let tipoArquivo = this.VerificarTipoArquivo(e.target.files[0].name);
    let dadosArquivo = "";

    // Salvar o contexto atual
    let self = this;

    return new Promise((resolve, reject) => {
      if (tipoArquivo != "INVALIDO") {
        if (window.FileReader) {
          let reader = new FileReader();
          reader.readAsBinaryString(e.target.files[0]);

          reader.onload = async function (event) {
            dadosArquivo = self.ProcessarArquivo(tipoArquivo, event, vm);
            resolve(dadosArquivo);
          };

          reader.onerror = function (event) {
            reject(event.target.error.name);
          };
        } else {
          reject(
            "Infelizmente seu navegador não suporta esse tipo de operação, por favor tentar outro."
          );
        }
      } else {
        reject(
          "Arquivo inválido, por favor, inserir um arquivo XLSX ou CSV e tentar novamente"
        );
      }
    });
  },

  TotalItens(vetor) {
    vetor = vetor.trim().split("\n");

    return vetor.length;
  },

  ConsultarDistintos(vetor) {
    vetor = vetor.trim().split("\n");

    let distintos = vetor.filter((el, i, arr) => vetor.indexOf(el) == i);

    return distintos.length;
  },

  RemoverCabecalho(texto) {
    if (texto) {
      let dadosLote = texto.split("\n");

      if (dadosLote.length > 1) {
        dadosLote.splice(0, 1);

        var arraySemVazios = dadosLote.filter(function (i) {
          return i;
        });

        texto = arraySemVazios.join("\n");
      }

      return texto;
    }

    return "";
  },

  GerarPlanilhaXLSXCSV(idTabela, nomeArquivo, formato) {
    // Gerar arquivo no formato passado
    let table = TableExport(document.getElementById(idTabela), {
      headers: true, // (Boolean), display table headers (th or td elements) in the <thead>, (default: true)
      footers: true, // (Boolean), display table footers (th or td elements) in the <tfoot>, (default: false)
      formats: [formato], // (String[]), filetype(s) for the export, (default: ['xlsx', 'csv', 'txt'])
      filename: nomeArquivo, // (id, String), filename for the downloaded file, (default: 'id')
      position: "bottom", // (top, bottom), position of the caption element relative to table, (default: 'bottom')
      trimWhitespace: true, // (Boolean), remove all leading/trailing newlines, spaces, and tabs from cell text in the exported file(s) (default: false)
      sheetname: "Exportação", // (id, String), sheet name for the exported spreadsheet, (default: 'id'),
    });

    // Exportar arquivo para download
    let exportData = table.getExportData();
    let dataExport = exportData[idTabela][formato]; // Replace with the kind of file you want from the exportData
    table.export2file(
      dataExport.data,
      dataExport.mimeType,
      dataExport.filename,
      dataExport.fileExtension,
      dataExport.merges,
      dataExport.RTL,
      dataExport.sheetname
    );
  },

  async VerificarAcesso() {
    let user = useAuthStore().user;
    let url = RetUrlAPI() + "CheckTokenSessionEquals";

    let autenticUser = new Object();
    autenticUser.userId = user.userId;
    autenticUser.token = user.token;
    autenticUser.tokenSession = user.tokenSession;

    if (!autenticUser.userId) {
      return "OK";
    }

    let resultado = CallPost("usuario", "", url, autenticUser);

    return resultado;
  },

  async VerificarAutenticacao() {
    let autenticacao = await this.VerificarAcesso();

    if (autenticacao != "OK") {
      Swal.fire({
        position: "center",
        title: "Novo acesso detectado",
        text: "Verificamos que sua conta teve um novo acesso, para sua segurança vamos te deslogar, favor entrar em contato com nosso suporte no chat inicial!",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        this.LimparTokenSessao(true);
      });
    }
  },

  DefinirCTRibEnumGT(ctrib) {
    if (ctrib == 0) return 1;
    if (ctrib == 1) return 1;
    if (ctrib == 2) return 3;
    if (ctrib == 3) return 2;
  },

  RemoverResiduos(descricao) {
    return descricao
      .replace("!", "")
      .replace("@", "")
      .replace("#", "")
      .replace("$", "")
      .replace("%", "")
      .replace("&", "")
      .replace("*", "")
      .replace("(", "")
      .replace(")", "");
  },

  MascaraNCM(ncm) {
    let ncmMascarado = IMask.pipe(ncm, {
      mask: "0000.00.00",
    });

    return ncmMascarado;
  },
  FormataNumeroPontos(valor) {
    return valor.toLocaleString('pt-BR');
  },
  HoraAtual(dataCompleta = false) {
    let dtHoje = new Date();

    let dia = String(dtHoje.getDate()).padStart(2, "0");
    let mes = String(dtHoje.getMonth() + 1).padStart(2, "0");
    let ano = dtHoje.getFullYear();
    let hora = dtHoje.getHours();
    let minutos = dtHoje.getMinutes();

    if (dataCompleta) return `${dia}/${mes}/${ano} - ${hora}:${minutos}`;

    return `${dia}/${mes}/${ano}`;
  },
  ValidaNumero(valor) {
    try {
      var teste = Number(valor) / 1;

      if (isNaN(teste)) {
        return false;
      }
    } catch (error) {
      return false;
    }

    return true;
  },

  VerificarTipoConsulta(valor) {
    if (isNaN(valor)) return "DESCRICAO";
    else {
      if (valor.length == 8) return "NCM";
      else return "GTIN";
    }
  },
  ConsultarDistintos(vetor) {
    vetor = vetor.trim().split("\n");

    let distintos = vetor.filter((el, i, arr) => vetor.indexOf(el) == i);

    return distintos.length;
  },
  VerificarCamposLote(dataLote, emailLote, verificarEmail = false) {
    if (!dataLote) {
      this.alertStore.error("Favor definir data válida!");

      return false;
    }

    if (verificarEmail) {
      if (emailLote) {
        if (this.VerificarEmail(emailLote) == false) {
          this.alertStore.error("Email inválido!");

          return false;
        }
      } else {
        this.alertStore.error("Favor inserir email!");

        return false;
      }
    }

    return true;
  },
  DefinePerfilTemporario() {
    let userStore = useAuthStore();

    let _data = helpers.HoraAtual();
    let _perfil = Object();
    let _dadosConsulta = {
      consultas: 0,
    };

    _perfil.hasProfile = true;
    _perfil.prfCfop = "5102";
    _perfil.prfDtUltRec = _data; // 'DD/MM/YYYY';
    _perfil.prfId = 0;
    _perfil.prfRecBruta = "100000.00";
    _perfil.prfSpecialRegime = "";
    _perfil.prfTaxRegime = "1";
    _perfil.prfTypeCnae = "VAREJO";
    _perfil.prfUF = "SP";
    _perfil.prfValidity = helpers.ConvDataToYyyyMmDd(_data); // 'YYYY-MM-DD';

    userStore.user.profile = _perfil;
    userStore.user.dataQueries = _dadosConsulta;
  },
  ConverteCFOP(ufPerfil, cfop) {
    let userStore = useAuthStore();
    let aux = cfop.substring(1, cfop.length);

    if (userStore.user.prfUF == ufPerfil) {
      if (cfop > 5000) {
        return "5" + aux;
      }

      return "1" + aux;
    } else {
      if (cfop > 5000) return "6" + aux;

      return "2" + aux;
    }
  },
};

const getMask = {
  Phone: (v) => {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2");

    if (v.length == 13) {
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    } else if (v.length == 14) {
      v = v.replace(/(\d{1})(\d{4})(\d)/, "$1$2-$3");
    }

    return v;
  },

  CPF: function (v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return v;
  },

  CNPJ: function (v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
    return v;
  },

  CEP: function (v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    return v;
  },

  Data: function (v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    return v;
  },

  Value: function (v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d)(\d{11})$/, "$1.$2");
    v = v.replace(/(\d)(\d{8})$/, "$1.$2");
    v = v.replace(/(\d)(\d{5})$/, "$1.$2");

    v = v.replace(/(\d)(\d{2})$/, "$1,$2");
    return v;
  },
};

export default helpers;
