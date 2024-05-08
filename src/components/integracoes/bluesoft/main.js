import { RetUrlAPI } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import helpers from "@/helpers";
import { useAlertStore } from "@/stores";
import { useAuthStore } from "@/stores/user";

const alertStore = useAlertStore();
const userStore = useAuthStore();

const methodsBluesoft = {
    ObterHistAltTribut_bluesoft(componente, filtroTipo, filtroDados, filtroQtdePagina, filtroPagina) {
        let url = RetUrlAPI('Integracoes', 'v1') + 'bluesoft/historico?';
        let filtroAdicional = '';

        switch (filtroTipo) {

            /* OBSOLETO */
            case 1: // IMPLANTAÇÃO / ALTERAÇÃO
                filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'tipo=' + filtroDados;
                break;

            case 2: // SKU(s)
                if (filtroDados.length > 0) {
                    const skus = filtroDados.split(';');
                    for (let I = 0; I < skus.length; I++) {
                        filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'skus=' + skus[I];
                    }
                }
                break;

            default:
                break;
        }

        // ----------------------------------------------------------------------
        // Quantidade de produtos por página 
        filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'quantidadePagina=' + ((filtroQtdePagina) ? filtroQtdePagina : '25');

        // ----------------------------------------------------------------------
        // Definição de qual página será exibida 
        filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'pagina=' + ((filtroPagina) ? filtroPagina : '1');

        // ----------------------------------------------------------------------
        // Consome a API buscando os dados dos planos para a Soluição selecionada
        // ----------------------------------------------------------------------
        url += filtroAdicional;
        CallGetAsync(url)
            .then(data => {
                if (data.isOk) {
                    componente.DefinirAlteracoesTributariasProdutos(data.historico, data.quantidadeTotal);
                    document.location.href = "#topoAltTrib";
                }
            })
            .catch(reason => {
                helpers.VerificarAutenticacao();
                alertStore.error('Falha ao atualizar as informações da lista de Histórico de Alterações Tributárias.');
            });
    },

    ObterListaParaAceite_bluesoft(componente, filtroTipo, filtroDados, filtroQtdePagina, filtroPagina) {
        let url = RetUrlAPI('Integracoes', 'v1') + 'bluesoft/pendencias?';
        let filtroAdicional = '';

        switch (filtroTipo) {
            case 1: // SKU(s)
                if (filtroDados.length > 0) {
                    const skus = filtroDados.split(';');
                    for (let I = 0; I < skus.length; I++) {
                        filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'skus=' + skus[I];
                    }
                }
                break;

            default:
                break;
        }

        // ----------------------------------------------------------------------
        // Quantidade de produtos por página 
        filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'quantidadePagina=' + ((filtroQtdePagina) ? filtroQtdePagina : '25');

        // ----------------------------------------------------------------------
        // Definição de qual página será exibida 
        filtroAdicional += ((filtroAdicional.length > 0) ? '&' : '') + 'pagina=' + ((filtroPagina) ? filtroPagina : '1');

        // ----------------------------------------------------------------------
        // Consome a API buscando os dados dos planos para a Soluição selecionada
        // ----------------------------------------------------------------------
        url += filtroAdicional;
        CallGetAsync(url)
            .then(data => {
                if (data.isOk) {
                    componente.DefinirListaParaAceite(data.produtosPendentes, data.quantidadeTotal);
                }

            })
            .catch(reason => {
                alertStore.error('Falha ao atualizar as informações da lista de produtos de Implantação Pendentes.');
            });
    },

    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region POST - Definição/Envio dos Dados

    //----------------------------------------------------------------
    // Envia os SKUs para inclusão no processo de Implantação
    //----------------------------------------------------------------
    DefinirListaDirecionadaParaAceite_bluesoft(componente, skuEnvio) {
        const lstEnvio = new Object();

        const url = RetUrlAPI('integra-bluesoft') + 'consulta-direcionada';
        const user = userStore.user.mail;
        const token = userStore.user.tokenSession;

        lstEnvio.cadastro = {
            "email": user,
            "tokenSession": token,
            "data": new Date().toISOString().split('T')[0]
        }
        lstEnvio.produtos = skuEnvio;

        CallPostAsync(user, token, url, lstEnvio)

        alertStore.success("Os SKUs foram enviados com sucesso. Assim que os produtos forem tributados, ficarão disponíveis na tela Controle de Aceite.")

        componente.RetornoEnvioDeSkus();

        const lstSkuDirecionada = JSON.stringify(skuEnvio);
        sessionStorage.setItem('consultaDirecionada', lstSkuDirecionada);

        const btnControleDeAceite = document.getElementById('pills-contact-tab');
        btnControleDeAceite.click();

    },

    //----------------------------------------------------------------
    // Envia os IDs (guid) para rotinas de Aceite 
    //----------------------------------------------------------------
    ConsumirApiAceite_bluesoft(listaGuid) {
        let url = "";

        const btnRecarregarLista = document.getElementById('btnAtualizar');

        const lstEnvio = new Object();
        const user = userStore.user.mail;
        const token = userStore.user.tokenSession;

        url = RetUrlAPI('integra-bluesoft') + 'pendencias/aprovar';

        lstEnvio.cadastro = {
            "email": user,
            "tokenSession": token,
            "data": new Date().toISOString().split('T')[0]
        }
        lstEnvio.produtosIds = [...listaGuid];

        CallPostAsync(user, token, url, lstEnvio)
            .then(data => {
                if (data) {
                    alertStore.success("Sua lista de Aceite foi enviada com sucesso!");
                    btnRecarregarLista.click();
                }
            })
            .catch(reason => {
                helpers.VerificarAutenticacao();
                alertStore.error('Falha ao consumir API de Aceite.');
                btnRecarregarLista.click();
            });
    },

    //#endregion
    //----------------------------------------------------------------
};

export default methodsBluesoft;