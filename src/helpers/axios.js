import axios from "axios";
import { useAuthStore } from "@/stores/user";
import { head } from "lodash";

const api = axios.create({
  baseURL: RetUrlAPI(),
  headers: {
    login: "29707440820014",
    senha: "imdstestes",
    origem: "portal",
  },
});

export default api;

export function RetUrlAPI(metodo, versaoAPI) {
  let modo = 2;
  let urlRetorno = "";

  let url_EnviaRecebeDados_prod = true;
  let url_EnviaRecebeDados_qa = false;
  let url_EnviaRecebeDados_dev = false;

  let url_PostDescricoes_prod = true;
  let url_PostDescricoes_qa = false;
  let url_PostDescricoes_dev = false;

  let url_SaneamentoGrades_prod = true;
  let url_SaneamentoGrades_qa = false;
  let url_SaneamentoGrades_dev = false;

  let url_Vacine_prod = true;
  let url_Vacine_qa = false;
  let url_Vacine_dev = false;

  let url_Moostri_prod = true;
  let url_Moostri_qa = false;
  let url_Moostri_dev = false;

  let url_Integracoes_prod = true;
  let url_Integracoes_qa = false;
  let url_Integracoes_dev = false;

  switch (metodo) {

    case 'Integracoes':
      let versao = (versaoAPI) ? versaoAPI : 'v2';

      if (url_Integracoes_dev)
        urlRetorno = 'https://consultatributos.com.br:8443/envia_recebe_dados/' + versao + '/integracao/';

      if (url_Integracoes_qa)
        urlRetorno = 'https://consultatributos.com.br:8443/QA/envia_recebe_dados/' + versao + '/integracao/';

      if (url_Integracoes_prod)
        urlRetorno = 'https://consultatributos.com.br:8443/envia_recebe_dados/' + versao + '/integracao/';

      break;

    case "EnviaRecebeDados":
      if (url_EnviaRecebeDados_prod)
        urlRetorno = "https://consultatributos.com.br:8443/api/v1/public/EnviaRecebeDados";

      if (url_EnviaRecebeDados_qa)
        urlRetorno = "https://consultatributos.com.br:8443/api/v1/public/EnviaRecebeDados";

      if (url_EnviaRecebeDados_dev)
        urlRetorno == "http://localhost:1234/v1/public/EnviaRecebeDados";

      break;

    case "PostDescricoes":
      if (url_PostDescricoes_prod)
        urlRetorno = "https://consultatributos.com.br:8443/api/v1/public/PostDescricoes";

      if (url_PostDescricoes_qa)
        urlRetorno = "https://consultatributos.com.br:8443/api/v1/public/PostDescricoes";

      if (url_PostDescricoes_dev)
        urlRetorno = "http://localhost:1234/v1/public/PostDescricoes";

      break;

    case "SaneamentoGrades":
      if (url_SaneamentoGrades_prod)
        urlRetorno = "https://consultatributos.com.br:8443/api/v3/public/SaneamentoGrades";

      if (url_SaneamentoGrades_qa)
        urlRetorno = "http://10.0.0.228:8080/QA/saneamento_grades/v3/public/SaneamentoGrades";

      if (url_SaneamentoGrades_dev)
        urlRetorno = "http://localhost:51417/v3/public/SaneamentoGrades";

      break;

    case "Vacine":
      if (url_Vacine_prod)
        urlRetorno = "https://consultatributos.com.br:8443/vaccine/v1/public/Vacina";

      if (url_Vacine_qa)
        urlRetorno = "https://consultatributos.com.br:8443/vaccine/v1/public/Vacina";

      if (url_Vacine_dev)
        urlRetorno = "http://localhost:1234/v1/public/Vacina";

      break;

    case "Moostri":
      if (url_Moostri_prod)
        urlRetorno = "http://consultatributos.com.br:8080/moostri-api-hom/v1/";

      if (url_Moostri_qa)
        urlRetorno = "http://consultatributos.com.br:8080/moostri-api-hom/v1/";

      if (url_Moostri_dev)
        urlRetorno = "https://localhost:44343/v1/";

      break;

    default:
      if (modo == 0) urlRetorno = "http://localhost:9999/v1/public/";

      if (modo == 1)
        urlRetorno = "https://consultatributos.com.br:8443/QA/portal_imendes/v1/public/";

      if (modo == 2)
        urlRetorno = "https://consultatributos.com.br:8443/portal_imendes/v1/public/";

      break;
  }

  return urlRetorno;
}

export async function CallPostAsync( user, pwd, url, objeto, apiSaneamento = false, bearerToken = "" ) {
  let dadosUsuario = useAuthStore().user;
  let headers = {};
  let pwdSan = pwd;

  if (pwd == "") pwd = dadosUsuario.tokenSession;

  if (!apiSaneamento) {

    if(bearerToken.length > 0) {
      
      headers = {
        method: "POST",
        url: url,
        headers: {
          Accept: "application/json", "Content-Type": "application/json",
          mode: "CORS",
          email: user,
          tokenSession: pwd,
          userID: dadosUsuario.userId,
          origem: "portal",
          Authorization: "Bearer " + bearerToken
          },
        data: JSON.stringify(objeto),
      };
    
    } else {
      headers = {
        method: "POST",
        url: url,
        headers: {
          Accept: "application/json", "Content-Type": "application/json",
          mode: "CORS",
          email: user,
          tokenSession: pwd,
          userID: dadosUsuario.userId,
          origem: "portal",
        },
        data: JSON.stringify(objeto),
      };
      
    }

  } else {
    headers = {
      method: "POST",
      url: url,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        mode: "CORS",
        login: user != "" ? user : "zmxN9vlsfffMb20TRA7+GQ==",
        senha: pwdSan != "" ? pwdSan : "eMgylYHfKETvQgffHE2AGw==",
        origem: "portal",
        Authorization: "Bearer " + bearerToken,
        token: dadosUsuario.tokenSession,
        userID: dadosUsuario.userId,
        email: dadosUsuario.mail,
      },
      data: JSON.stringify(objeto),
    };
  }

  try {
    let response = await axios.post(url, objeto, headers);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data) {
      return error.response.data;
    }
    throw "Servidor Indisponível.";
  }
}

export async function CallPost(user, pwd, url, objeto) {
  let dadosUsuario = useAuthStore().user;
  let headers = {};

  if (!pwd) pwd = dadosUsuario.tokenSession;

  headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
    email: user,
    tokenSession: pwd,
    userID: dadosUsuario.userId,
  };

  let result = null;

  try {
    const response = await axios.post(url, objeto, {
      headers
    });
    result = response.data;
  } catch (error) {
    result = error.response.data;
  }

  return result;
}

export async function CallGetAsync(url, enviarToken = true) {
  let dadosUsuario = useAuthStore().user;
  let headers = {};

  if (enviarToken) {
    headers = {
      tokenSession: dadosUsuario.tokenSession,
      userID: dadosUsuario.userId,
      email: dadosUsuario.mail,
    };
  }

  try {
    let response = await axios.get(url, headers);
    return response.data;
  } catch (error) {
    console.log(error);
    throw "Servidor Indisponível.";
  }
}