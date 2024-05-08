import { RetUrlAPI } from "@/helpers/axios.js";
import { CallGetAsync } from "@/helpers/axios.js";
import { CallPostAsync } from "@/helpers/axios.js";
import helpers from "@/helpers";
import { useAlertStore } from "@/stores";
import { useAuthStore } from "@/stores/user";

const alertStore = useAlertStore();
const userStore = useAuthStore();

const methodsSankhya = {
    //----------------------------------------------------------------
    //#region GET - Obtenção dos Dados

    /* INFO: ------------------------------------------------------------------------------------------
     * filtroTipo: 0=Tipo (Implantação/Alteração), 1=Código SKU 
     * filtroDados: 
     *   > para (filtroTipo == 0): "I" ou "A"
     *   > para (filtroTipo == 1): código INT (quando mais de um, separado por ponto-e-vírgula)
     * Filtros da URL:
     *  &quantidadePagina=10
     *  &pagina=2
     *  &skus=2&skus=3 ...
     *  &tipo=I
     * 
     * Para que um filtro não seja aplicado, basta não informa-la na URL
     * --------------------------------------------------------------------------------------------- */
    ObterHistAltTribut_Implantacao_sankhya(componente, filtroTipo, filtroDados, filtroQtdePagina, filtroPagina) {
        // 00680516000124
        let url = RetUrlAPI('Integracoes', 'v1') + 'sankhya/historico?';
        let filtroAdicional = '';

        switch (filtroTipo) {

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

    ObterListaParaAceite_Implantacao_sankhya(componente, filtroTipo, filtroDados, filtroQtdePagina, filtroPagina) {
        let url = RetUrlAPI('Integracoes', 'v1') + 'sankhya/pendencias?';
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

                    const produtosComAceite = data.produtosPendentes.map(produto => ({
                        ...produto,
                        status: 0,
                    }));

                    componente.DefinirListaParaAceite(produtosComAceite, data.quantidadeTotal);
                }

            })
            .catch(reason => {
                helpers.VerificarAutenticacao();
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
    DefinirListaDirecionadaParaAceite_sankhya(componente, skuEnvio) {
        const url = RetUrlAPI('integra-sankhya') + 'consulta-direcionada';
        const user = userStore.user.mail;
        const token = userStore.user.tokenSession;

        /* ATENÇÃO */
        // Não excluir as informações comentadas abaixao pois ainda estão em análise se entrarão ou não no processamento. 
        // Renzo 20/12/2023.

        CallPostAsync(user, token, url, skuEnvio)
            .then(data => {
                // if (data) {
                //     Swal.fire({
                //         title: "Enviado!",
                //         text: "Os SKUs foram enviados com sucesso. Assim que os produtos forem tributados, ficarão disponíveis na tela Controle de Aceite.",
                //         icon: "success"
                //     });
                //     this.RetornoEnvioDeSkus();

                //     const lstSkuDirecionada = JSON.stringify(skuEnvio);
                //     sessionStorage.setItem('consultaDirecionada', lstSkuDirecionada);

                //     const btnControleDeAceite = document.getElementById('pills-contact-tab');
                //     btnControleDeAceite.click();
                // }
            })
        // .catch(reason => {
        //     console.log(reason);
        //     this.RetornoEnvioDeSkus();
        //     alertStore.error('Falha ao enviar Lista Direcionada para Aceite.');
        // });

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
    ConsumirApiAceite_sankhya(tipo, listaGuid) {
        let url = "";

        const lstEnvio = new Object();
        const user = userStore.user.mail;
        const token = userStore.user.tokenSession;

        url = RetUrlAPI('integra-sankhya') + 'aprovar';

        lstEnvio.ids = [...listaGuid];

        CallPostAsync(user, token, url, lstEnvio)
            .then(data => {
                if (data) {
                    alertStore.success("Sua lista de Aceite foi enviada com sucesso!");

                    const btnRecarregarLista = document.getElementById('btnAtualizar');
                    btnRecarregarLista.click();
                }
            })
            .catch(reason => {
                helpers.VerificarAutenticacao();
                alertStore.error('Falha ao consumir API de Aceite.');
            });
    },

    //#endregion
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //#region Métodos para Teste Mockados

    /* INFO:
     * filtroTipo: 0=Tipo (Implantação/Alteração), 1=Código SKU 
     * filtroDados: 
     *   > para (filtroTipo == 0): "I" ou "A"
     *   > para (filtroTipo == 1): código INT (quando mais de um, separado por ponto-e-vírgula)
     */
    async ObterHistAltTribut_Implantacao_sankhya_mock(componente, filtroTipo, filtroDados) {
        const url = 'http://localhost:3000/historico/';

        fetch(url)
            .then((response) => response.json())
            .then(data => {

                if (data.alteracoesTributarias) {
                    var listaProcessada = new Array();

                    switch (filtroTipo) {

                        case 1: // IMPLANTAÇÃO / ALTERAÇÃO
                            listaProcessada = data.alteracoesTributarias.filter((el) => {
                                return el.tipo == filtroDados
                            });
                            break;

                        case 2: // SKU(s)
                            let listaAux = filtroDados.split(';');

                            data.alteracoesTributarias.forEach(el => {

                                if (listaAux.includes(el.sku.toString()))
                                    listaProcessada.push(el);
                            });
                            break;

                        default:
                            listaProcessada = data.alteracoesTributarias;
                            break;
                    }

                    //----------------------------------------------------------------
                    // ATUALIZA DOM
                    //----------------------------------------------------------------
                    componente.DefinirAlteracoesTributariasProdutos(listaProcessada);
                    document.location.href = "#topoAltTrib";
                    //----------------------------------------------------------------
                }
            })
            .catch((err) => {
                helpers.VerificarAutenticacao();
                alertStore.error('Falha ao atualizar as informações da lista de Alterações Tributárias para Produtos.');
            });
    },

    /* OBSOLETO */
    async ObterAlteracoesTributariasRegrasEstaduais_sankhya_mock() {
        const url = 'http://localhost:3000/regrasestaduais/';

        fetch(url)
            .then((response) => response.json())
            .then(data => {
                if (data.alteracoesTributarias) {
                    this.DefinirAlteracoesTributariasRegrasEstaduais(data.alteracoesTributarias);
                }
            })
            .catch((err) => {
                helpers.VerificarAutenticacao();
                alertStore.error('Falha ao atualizar as informações da lista de Alterações Tributárias para Regras Estaduais.');
            });
    },

    async ObterListaParaAceite_Implantacao_sankhya_mock() {
        const url = 'http://localhost:3000/lstAprovacoes/';

        fetch(url)
            .then((response) => response.json())
            .then(data => {
                if (data.lstProdutos) {
                    this.DefinirListaParaAceite(data.lstProdutos);
                }
            })
            .catch((err) => {
                alertStore.error('Falha ao atualizar as informações da lista de Alterações Tributárias para aprovação e aceite do cliente.');
            });
    },

    async ObterListaDirecionadaParaAceite_sankhya_mock(listaDirecionadaSku) {
        const url = 'http://localhost:3000/lstAprovacoes/';

        fetch(url)
            .then((response) => response.json())
            .then(data => {
                if (data.lstProdutos) {
                    let listaDirecionadaParaAceiteProcessadas = new Array();

                    data.lstProdutos.forEach(el => {
                        if (listaDirecionadaSku.includes(el.sku))
                            listaDirecionadaParaAceiteProcessadas.push(el);
                    });

                    this.DefinirListaParaAceite(listaDirecionadaParaAceiteProcessadas);
                }
            })
            .catch((err) => {
                alertStore.error('Falha ao atualizar as informações da lista de Alterações Tributárias para aprovação e aceite do cliente.');
            });
    },

    //#endregion
    //----------------------------------------------------------------
};

export default methodsSankhya;