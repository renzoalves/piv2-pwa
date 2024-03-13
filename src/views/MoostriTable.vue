<template>
<LayoutSidebar>
    <ChatWhatsapp :assinante="true"></ChatWhatsapp>
    <div v-if="processando" id="loading">
        <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>
    <div v-if="processMoostri" id="loading">
        <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>
    <div v-if="!perfilConfigurado">
        <h5 class="ml-3 mr-3">
            Olá {{ nome }}. Antes de continuarmos, precisamos configurar o seu
            Perfil. Nos informe no chat se precisar de ajuda&#128521;
        </h5>
        <hr />
        <TaxProfile :ufs="ufs" :ctribs="ctribs" :vacine="true" :solucaoid="20" :key="chave" :p_perfil="perfil" :index="perfil.prfIndex" />
    </div>
    <div v-else class="container-fluid">
        <div class="row mt-5">
            <div class="mt-3">
                <TaxProfileInfo :multiplosPerfis="true" :solution="20" v-if="!isMobile" />
            </div>
        </div>
        <div class="row">

            <!-- DETERMINAÇÃO DO RESULTADO -->
            <div class="col-md-12 mb-4">
                <h1>Determinação do Resultado</h1>
                <div class="card">
                    <div class="card-body">

                        <div class="row card-row">

                            <div class="col-md-3">
                                <label for="txtDetResultado">Resultado</label>
                                <select class="form-control form-control-sm" v-model="determResult" name="txtDetResultado" :disabled="determTravado">
                                    <option v-for="(item, index) in determResultados" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-9">

                                <div v-if="determResult == 0">
                                    <label for="txtDetResultado">Resultado: Preço de Venda</label>
                                    <p>Com base nos cálculos de créditos e débitos tributários inscidentes mais o Preço de Compra, traz como resultado o Preço de Venda sugerido para os produtos.</p>
                                </div>

                                <div v-if="determResult == 1">
                                    <label for="txtDetResultado">Resultado: Valor de Compra</label>
                                    <p>Com base nos cálculos de créditos e débitos tributários inscidentes mais o Preço de Venda, traz como resultado o Preço de Compra desejável para os produtos.</p>
                                </div>

                                <div v-if="determResult == 2">
                                    <label for="txtDetResultado">Resultado: Margem de Lucro</label>
                                    <p>Com base nos cálculos de créditos e débitos tributários inscidentes mais o Preço de Compra e o Preço de Venda, traz como resultado o Preço de Compra desejável para os produtos.</p>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <!-- PRODUTO -->
            <div class="col-md-12 mb-4">
                <h1>Produto</h1>
                <div class="card">
                    <div class="card-body">

                        <div class="row card-row">
                            <div class="col-md-2">
                                <label for="txtCodigo">Código</label>
                                <input class="form-control form-control-sm" type="text" name="codigo" placeholder="Código" maxlength="50" v-model="codigo" @blur="ConsultaProduto(cnpj, codigo)" />
                            </div>

                            <div class="col-md-9">
                                <label for="txtDescricao">Descrição</label>
                                <input class="form-control form-control-sm" type="text" v-model="descricao" name="descricao" placeholder="Descrição do produto..." maxlength="50" readonly />
                            </div>
                        </div>

                        <div class="row card-row">

                            <div class="col-md-4">
                                <label for="txtOrigem">Origem</label>
                                <select class="form-control form-control-sm" v-model="origem" name="origem">
                                    <option v-for="(item, index) in lstOrigem" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-1">
                                <label for="txtUfFornec">UF Fornec.</label>
                                <select class="form-control form-control-sm" v-model="ufOrig" name="ufOrig">
                                    <option v-for="(item, index) in ufs" v-bind:key="index">
                                        {{ item }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-3">
                                <span class="row-perfil-fornec">
                                    <label for="txtPerfilFornec">Perfil Fornecedor</label>
                                    <label for="perfilSimples" style="margin-left: auto">Simples Nacional</label>
                                    <input type="checkbox" class="chk" id="perfilSimples" name="perfilSimples" checked v-model="fornecOptSimplesNacional" />
                                </span>

                                <select class="form-control form-control-sm" v-model="fornecPerfil" name="cboPerfilFornec">
                                    <option v-for="(item, index) in fornecPerfis" v-bind:key="index" v-bind:value="item.idPerfil">
                                        {{ item.texto }}
                                    </option>
                                </select>
                            </div>

                            <!-- DETERMINAÇÃO DO PREÇO DE VENDA SUGERIDO -->
                            <template v-if="determResult == 0">

                                <div class="col-md-1">
                                    <label for="txtpFabrica" title="Preço de Fábrica" style="cursor: pointer">P. Fábrica R$</label>
                                    <input class="form-control form-control-sm" type="text" v-model="pFabrica" name="pFabrica" placeholder="0.00" maxlength="50" readonly />
                                </div>

                                <div class="col-md-1">
                                    <label for="txtDesconto" title="Percentual de Desconto" style="cursor: pointer">% Desc.</label>
                                    <input class="form-control form-control-sm" type="number" v-model="desconto" :readonly="pFabrica <= 0" name="desconto" placeholder="0.00" :onkeyup="CalcularPrecoCompra" maxlength="50" />

                                </div>

                                <div class="col-md-1">
                                    <label for="txtpCompra" title="Preço de Compra" style="cursor: pointer">P. Compra R$</label>
                                    <input class="form-control form-control-sm" type="number" v-model="pCompra" name="pCompra" placeholder="0.00" :onkeyup="CalcularPercDesconto" maxlength="50" />
                                </div>

                            </template>

                            <!-- DETERMINAÇÃO DO PREÇO DE COMPRA -->
                            <template v-if="determResult == 1">

                                <div class="col-md-1">&nbsp;</div>

                                <div class="col-md-1">&nbsp;</div>

                                <div class="col-md-1">
                                    <label for="txtpVenda" title="Preço de Venda" style="cursor: pointer">P. Venda R$</label>
                                    <input class="form-control form-control-sm" type="number" v-model="pVenda" name="pVenda" placeholder="0.00" maxlength="50" />
                                </div>

                            </template>

                            <!-- DETERMINAÇÃO DA MARGEM DE LUCRO -->
                            <template v-if="determResult == 2">

                                <div class="col-md-1">&nbsp;</div>

                                <div class="col-md-1">
                                    <label for="txtpCompra" title="Preço de Compra" style="cursor: pointer">P. Compra R$</label>
                                    <input class="form-control form-control-sm" type="number" v-model="pCompra" name="pCompra" placeholder="0.00" maxlength="50" />
                                </div>

                                <div class="col-md-1">
                                    <label for="txtpVenda" title="Preço de Venda" style="cursor: pointer">P. Venda R$</label>
                                    <input class="form-control form-control-sm" type="number" v-model="pVenda" name="pVenda" placeholder="0.00" maxlength="50" />
                                </div>

                            </template>

                            <div class="col-md-1 icon icon-large">
                                <i class="fas fa-plus-circle" title="Adicionar produto" @click="AdicionarProdutoLista"></i>
                                <i class="fas fa-cloud-upload-alt" title="Abre modal para importação de produtos em lote" @click="AbrirImportacao()"></i>
                            </div>
                        </div>

                        <div class="row card-row" v-if="produtos.length > 0">
                            <div class="col-md-12">
                                <div class="table-responsive-sm table-responsive-md table-responsive-lg">
                                    <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                        <thead>
                                            <tr>
                                                <th class="text-center">
                                                    Código
                                                </th>
                                                <th class="text-left">
                                                    Descrição
                                                </th>
                                                <th class="text-center">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-for="(i, index) in produtosPaginados" v-bind:key="i.index">
                                                <tr>
                                                    <td class="text-center">
                                                        {{ i.codigo }}
                                                    </td>
                                                    <td>
                                                        {{i.descricao}}
                                                    </td>
                                                    <td class="text-center icones-acoes" v-if="idxProduto != index">
                                                        <i class="fas fa-plus" title="Mostra detalhes do produto" @click="MostarDetalhesProduto(index)"></i>
                                                        <i class="fas fa-trash icon-delete" title="Remove produto da lista de consulta" @click="RemoverProdutos(index)"></i>
                                                    </td>
                                                    <td class="text-center" v-else>
                                                        <i class="fas fa-window-minimize" title="Oculta detalhes do produto" @click="idxProduto = -1;detalhes = [];"></i>
                                                    </td>
                                                </tr>
                                                <tr v-if="index == idxProduto">
                                                    <td colspan="3" class="td-resultado">
                                                        <div class="row row-detalhes" v-for="(j, index) in detalhes" v-bind:key="j.index">
                                                            <div class="col-md-1">
                                                                <label v-if="index == 0" for="txtDescricao">UF Perfil</label>
                                                                <input class="form-control form-control-sm" type="text" v-model="j.ufPerfil" name="ufPerfil" placeholder="UF Perfil" maxlength="50" readonly />
                                                            </div>

                                                            <div class="col-md-1">
                                                                <label v-if="index == 0" for="txtUfFornec">UF Fornec.</label>
                                                                <select class="form-control form-control-sm" v-model="j.ufFornec" name="ufOrig" readonly>
                                                                    <option v-for="(item,index) in ufs" v-bind:key="index" disabled>{{item}}</option>
                                                                </select>
                                                            </div>

                                                            <div class="col-md-2">
                                                                <label v-if="index == 0" for="txtOrigem">Origem</label>
                                                                <select class="form-control form-control-sm" v-model="j.origem" name="origem" readonly>
                                                                    <option v-for="(item,index) in lstOrigem" v-bind:key="index" v-bind:value="item.value" disabled>
                                                                        {{item.text}}
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            <div class="col-md-2">
                                                                <label v-if="index == 0" for="perfilSimplesDetalhes">Simples Nacional</label>
                                                                <select class="form-control form-control-sm" v-model="j.fornecOptSimplesNacional" name="cboPerfilSimplesNacional" readonly>
                                                                    <option v-for="(item,index) in opcSimplesNacional" v-bind:key="index" v-bind:value="item.value" disabled>
                                                                        {{item.texto}}
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            <div class="col-md-3">
                                                                <label for="txtPerfilFornec" v-if="index == 0">Perfil Fornecedor</label>
                                                                <select class="form-control form-control-sm" v-model="j.fornecPerfil" name="cboPerfilFornec" readonly>
                                                                    <option v-for="(item,index) in fornecPerfis" v-bind:key="index" v-bind:value="item.idPerfil" disabled>
                                                                        {{item.texto}}
                                                                    </option>
                                                                </select>
                                                            </div>

                                                            <!-- DETERMINAÇÃO DO PREÇO DE VENDA -->
                                                            <template v-if="determResult == 0">
                                                                <div class="col-md-1">
                                                                    <label for="txtpFabrica" title="Preço de Fábrica" style="cursor: pointer;" v-if="index == 0">P. Fábrica R$</label>
                                                                    <input class="form-control form-control-sm" type="text" v-model="j.pFabrica" name="pFabrica" placeholder="0.00" maxlength="50" readonly />
                                                                </div>

                                                                <div class="col-md-1">
                                                                    <label for="txtDesconto" title="Percentual de Desconto" style="cursor: pointer;" v-if="index == 0">% Desc.</label>
                                                                    <input class="form-control form-control-sm" type="number" v-model="j.desconto" name="desconto" placeholder="0.00" maxlength="50" readonly />
                                                                </div>

                                                                <div class="col-md-1">
                                                                    <label for="txtpCompra" title="Preço de Compra" style="cursor: pointer;" v-if="index == 0">P. Compra R$</label>
                                                                    <input class="form-control form-control-sm" type="number" v-model="j.pCompra" name="pCompra" placeholder="0.00" maxlength="50" readonly />
                                                                </div>
                                                            </template>

                                                            <!-- DETERMINAÇÃO DO VALOR DE COMPRA -->
                                                            <template v-if="determResult == 1">
                                                                <div class="col-md-1">&nbsp;</div>
                                                                <div class="col-md-1">&nbsp;</div>

                                                                <div class="col-md-1">
                                                                    <label for="txtpVenda" title="Preço de Venda" style="cursor: pointer;" v-if="index == 0">P. Venda R$</label>
                                                                    <input class="form-control form-control-sm" type="number" v-model="j.pVenda" name="pVenda" placeholder="0.00" maxlength="50" readonly />
                                                                </div>
                                                            </template>

                                                            <!-- DETERMINAÇÃO DA MARGEM DE LUCRO -->
                                                            <template v-if="determResult == 2">
                                                                <div class="col-md-1">&nbsp;</div>

                                                                <div class="col-md-1">
                                                                    <label for="txtpCompra" title="Preço de Compra" style="cursor: pointer;" v-if="index == 0">P. Compra R$</label>
                                                                    <input class="form-control form-control-sm" type="number" v-model="j.pCompra" name="pCompra" placeholder="0.00" maxlength="50" readonly />
                                                                </div>

                                                                <div class="col-md-1">
                                                                    <label for="txtpVenda" title="Preço de Venda" style="cursor: pointer;" v-if="index == 0">P. Venda R$</label>
                                                                    <input class="form-control form-control-sm" type="number" v-model="j.pVenda" name="pVenda" placeholder="0.00" maxlength="50" readonly />
                                                                </div>
                                                            </template>

                                                            <!-- <div class="col-md-1 icon">
                                                                <i class="fas fa-times-circle" title="Remove parametrização da UF de perfil" @click="RemoveProdutoLista(index)"></i>
                                                            </div> -->

                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <nav class="mt-10" v-if="paginas > 1">
                                <ul class="pagination">
                                    <li class="page-item" :class="{disabled: paginaAtual === 1,}">
                                        <a class="page-link" href="#" @click="MudarPagina(paginaAtual - 1)">Anterior</a>
                                    </li>
                                    <li class="page-item" v-for="pagina in paginas" :key="pagina" :class="{active:pagina === paginaAtual,}">
                                        <a class="page-link" href="#" @click="MudarPagina(pagina)">{{ pagina }}</a>
                                    </li>
                                    <li class="page-item" :class="{disabled:paginaAtual === paginas.length,}">
                                        <a class="page-link" href="#" @click="MudarPagina(paginaAtual + 1)">Próximo</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                    </div>
                </div>
            </div>

            <!-- DESTINATÁRIO -->
            <div class="col-md-12 mb-4" v-if="produtos.length > 0">
                <h1>Destinatário</h1>
                <div class="card">
                    <div class="card-body">

                        <div class="row card-row mb-3">

                            <div class="col-md-12" v-if="!destinatarioFiltrado">
                                <div class="alert alert-warning p-3" role="alert">
                                    Escolha a finalidade e operação dos destinatários antes de prosseguir.
                                </div>
                            </div>

                            <div class="col-md-2">
                                <label for="txtDestino">Finalidade</label>
                                <select class="form-control form-control-sm" v-model="destino" name="destino" @click="FiltrarDestinatarios()">
                                    <option v-for="(item, index) in destMerc" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-2">
                                <label for="txtOrigem">Operação</label>
                                <select class="form-control form-control-sm" v-model="operacao" name="operacao" @click="FiltrarDestinatarios()">
                                    <option v-for="(item, index) in destOperacao" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <div class="row card-row" v-if="destinatarioFiltrado && (destino >= 0) && (operacao >= 0)">
                            <div class="col-md-2">
                                <span class="row-perfil-fornec">
                                    <label for="txtPerfil">Perfil</label>
                                    <label for="simples" style="margin-left: auto">Simples Nac.</label>
                                    <input type="checkbox" class="chk" id="simples" name="simples" checked v-model="destOptSimplesNacional" />
                                </span>

                                <select class="form-control form-control-sm" v-model="cTrib" name="cboPerfil">
                                    <option v-for="(item, index) in caracTrib" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-1">
                                <label for="txtUfFornec">UF</label>
                                <select class="form-control form-control-sm" v-model="ufDest" name="ufDest">
                                    <option v-for="(item, index) in ufs" v-bind:key="index">
                                        {{ item }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-2">
                                <label for="txtDestino">Finalidade</label>
                                <select class="form-control form-control-sm" v-model="destino" name="destino" disabled>
                                    <option v-for="(item, index) in destMerc" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>

                            <div class="col-md-2">
                                <label for="txtOrigem">Operação</label>
                                <select class="form-control form-control-sm" v-model="operacao" name="operacao" disabled>
                                    <option v-for="(item, index) in destOperacao" v-bind:key="index" v-bind:value="item.value">
                                        {{ item.text }}
                                    </option>
                                </select>
                            </div>

                            <!-- 
                                Permite a edição da informção Margem Líquida se a 
                                determinação do Resultado não for igual a 'Determinação da Margem de Lucro' 
                                -->
                            <template v-if="determResult == 2">
                                <div class="col-md-1">&nbsp;</div>
                            </template>
                            <template v-else>
                                <div class="col-md-1">
                                    <label for="txtMargem">Marg. L. %</label>
                                    <input class="form-control form-control-sm" type="number" v-model="margemLiquida" name="margemLiquida" placeholder="0.00" maxlength="50" :readonly="operacao == 0" />
                                </div>
                            </template>
                            <!-- ------------------------------- -->

                            <div class="col-md-1">
                                <label for="txtFrete">Frete %</label>
                                <input class="form-control form-control-sm" type="number" v-model="frete" name="frete" placeholder="0.00" maxlength="50" />
                            </div>

                            <div class="col-md-1">
                                <label for="txtComissao">Com. %</label>
                                <input class="form-control form-control-sm" type="number" v-model="comissao" name="comissao" placeholder="0.00" maxlength="50" :readonly="operacao == 0" />
                            </div>

                            <div class="col-md-1">
                                <label for="txtOutrasDesp">Outras D. %</label>
                                <input class="form-control form-control-sm" type="number" v-model="outrasDespesas" name="outrasDespesas" placeholder="0.00" maxlength="50" />
                            </div>

                            <div class="col-md-1 icon icon-large">
                                <i class="fas fa-plus-circle" title="Adiciona destinatário" @click="AdicionarDestinatarioLista" v-if="idxDestinatario < 0"></i>
                                <i class="fas fa-check-circle" title="Salva alterações no destinatário" @click="SalvarDestinatarioLista" v-else></i>
                            </div>
                        </div>

                        <div class="row card-row mt-30" v-if="destinatarios.length > 0 && destinatarioFiltrado">
                            <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-center">
                                            Perfil
                                        </th>
                                        <th class="text-center">
                                            Simples Nacional
                                        </th>
                                        <th class="text-center">UF</th>
                                        <th class="text-center">
                                            Finalidade
                                        </th>
                                        <th class="text-center">
                                            Operação
                                        </th>
                                        <th class="text-center">
                                            Margem Líquida %
                                        </th>
                                        <th class="text-center">
                                            Frete %
                                        </th>
                                        <th class="text-center">
                                            Comissão %
                                        </th>
                                        <th class="text-center">
                                            Outras Desp. %
                                        </th>
                                        <th class="text-center">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, index) in destinatarios" :class="{selecionado: idxDestinatario === index,}" v-bind:key="i.index" class="tr-regular">
                                        <td class="text-center">
                                            {{caracTrib[i.perfil].text}}
                                        </td>
                                        <td class="text-center">
                                            {{i.simplesNacional ? "Sim" : "Não"}}
                                        </td>
                                        <td class="text-center">
                                            {{ i.uf }}
                                        </td>
                                        <td class="text-center">
                                            {{ ObterFinalidade( i.finalidade )}}
                                            <!-- {{destMerc[i.finalidade].text}} -->
                                        </td>
                                        <td class="text-center">
                                            {{ ObterOperacao( i.operacao ) }}
                                            <!-- {{destOperacao[i.operacao].text}} -->
                                        </td>
                                        <td class="text-center">
                                            {{ ( this.determResult == 2) ? '-' : parseFloat(i.margem).toFixed(2) }}
                                            <!-- {{parseFloat(i.margem).toFixed(2)}} -->
                                        </td>
                                        <td class="text-center">
                                            {{parseFloat(i.frete).toFixed(2)}}
                                        </td>
                                        <td class="text-center">
                                            {{parseFloat(i.comissao).toFixed(2)}}
                                        </td>
                                        <td class="text-center">
                                            {{parseFloat(i.outrasDespesas).toFixed(2)}}
                                        </td>
                                        <td class="text-center icones-acoes">
                                            <i class="fa fa-pencil color-icon-edit" title="Habilita edição das configurações do destinatário selecionado" v-on:click="AlterarDestinatario(index)"></i>
                                            <i class="fas fa-trash icon-delete" title="Remove destinatário" v-on:click="RemoveDestinatarioLista(index)"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <button class="geral-button btn-sm col-md-1 float-right mb-2" @click="MostrarResultado" v-if="destinatarioFiltrado">
                        Moostri
                    </button>
                </div>
            </div>

            <div class="col-md-12 mb-4" v-if="mostrarResultado">

                <!-- <h1>Sugestão de Preço de Transferência</h1> -->
                <h1>Sugestão Calculada</h1>
                <!-- <h6>IN: {{ timeIn }} OUT: {{ ObterMomento() }}</h6> -->

                <!-- <textarea
                    class="form-control form-control-sm mt-2"
                    v-model="timeOut"
                    id="consultaLote_timeOut"
                    rows="15">
                </textarea> -->

                <div class="card">
                    <div class="card-body">
                        <div class="row card-row">
                            <div class="expande-resultado" v-for="(i, index) in resultados" v-bind:key="i.index">
                                <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                    <thead>
                                        <tr>
                                            <th colspan="12" class="text-left font-1-s-bold">
                                                Produto: {{ i.codigo }} - {{ i.descricao }}
                                                <i class="fas fa-plus ico-maximize" title="Mostra detlhes do resultado" v-if="idxResultado != index" @click="MostrarDetalhesResultado(index)"></i>
                                                <i class="fas fa-window-minimize ico-minimize" title="Oculta detalhes do resultado" v-else @click="idxResultado = -1"></i>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="idxResultado == index">
                                        <tr>
                                            <td class="text-center"> # </td>
                                            <td class="text-center"> UF Fornec. </td>
                                            <td class="text-center"> Perfil </td>
                                            <td class="text-center"> UF Destino </td>
                                            <td class="text-center"> Custo Compra </td>
                                            <td class="text-center"> Valor Transferência </td>
                                            <td class="text-center"> Custo Varejo </td>
                                            <td class="text-center"> Destaque </td>
                                        </tr>
                                        <tr v-for="(j, index) in resultados[index].detalhes" v-bind:key="j.index" class="tr-regular">
                                            <td class="text-center">
                                                <i class="fas fa-info-circle" title="Abre demonstração do resultado" @click="AbrirDemostracao(index)"></i>
                                            </td>
                                            <td class="text-center">{{ j.ufFornec }}</td>
                                            <td class="text-center">{{ j.perfil }}</td>
                                            <td class="text-center">{{ j.ufDestino }}</td>
                                            <td class="text-center">{{ j.custoCompra }}</td>
                                            <td class="text-center">{{ j.valorTransferencia }}</td>
                                            <td class="text-center">{{ j.custoVarejo }}</td>
                                            <td class="text-center">{{ j.spotlight}}</td>
                                        </tr>
                                    </tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PLANILHA DE EXPORTAÇÃO -->
            <div class="col-md-12 mb-4" v-if="mostrarResultado" v-show="false">
                <div class="card">
                    <div class="card-body">
                        <div class="row card-row">

                            <table class="table table-divider table-striped table-sm table-responsive table-bordered" id="lstExportResult">

                                <thead>
                                    <tr>
                                        <th rowspan="2" class="text-center"> Cód. Produto</th>
                                        <th rowspan="2" class="text-center"> Descrição </th>

                                        <th rowspan="2" class="text-center"> UF Fornec. </th>
                                        <th rowspan="2" class="text-center"> Perfil </th>
                                        <th rowspan="2" class="text-center"> UF Destino </th>
                                        <th rowspan="2" class="text-center"> Custo Compra </th>
                                        <th rowspan="2" class="text-center"> Valor Transferência </th>
                                        <th rowspan="2" class="text-center"> Custo Varejo </th>
                                        <th rowspan="2" class="text-center"> Destaque </th>

                                        <th colspan="6" class="text-center"> Composição do Custo Entrada </th>
                                        <th colspan="24" class="text-center"> Composição do Preço de Venda </th>
                                    </tr>

                                    <tr>
                                        <th class="text-center">Valor do Produto da Compra </th>
                                        <th class="text-center">(+) IPI </th>
                                        <th class="text-center">(+) ICMS-ST </th>
                                        <th class="text-center">(-) ICMS </th>
                                        <th class="text-center">(-) Pis/Confins </th>
                                        <th class="text-center">(=) Custo </th>

                                        <th class="text-center">Valor Total da Nota </th>
                                        <th class="text-center">$ (-) IPI </th>
                                        <th class="text-center">$ (-) ICMS-ST </th>
                                        <th class="text-center">$ (-) ICMS-ST DIFAL </th>
                                        <th class="text-center">$ (=) Receita Bruta </th>
                                        <th class="text-center">% (=) Receita Bruta </th>
                                        <th class="text-center">$ (-) ICMS Op. Própria </th>
                                        <th class="text-center">% (-) ICMS Op. Própria </th>
                                        <th class="text-center">$ (-) ICMS DIFAL Cons. Final </th>
                                        <th class="text-center">% (-) ICMS DIFAL Cons. Final </th>
                                        <th class="text-center">$ (-) DAS </th>
                                        <th class="text-center">% (-) DAS </th>
                                        <th class="text-center">$ (-) PIS/CONFINS </th>
                                        <th class="text-center">% (-) PIS/CONFINS </th>
                                        <th class="text-center">$ (=) Receita Líquida </th>
                                        <th class="text-center">% (=) Receita Líquida </th>
                                        <th class="text-center">$ (-) Custo (CMV/CPV) </th>
                                        <th class="text-center">% (-) Custo (CMV/CPV) </th>
                                        <th class="text-center">$ (=) Lucro Bruto </th>
                                        <th class="text-center">% (=) Lucro Bruto </th>
                                        <th class="text-center">$ (-) Despesas de Venda </th>
                                        <th class="text-center">% (-) Despesas de Venda </th>
                                        <th class="text-center">$ (=) Lucro Líquido </th>
                                        <th class="text-center">% (=) Lucro Líquido </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr v-for="(lExp, index) in listaExportacao" v-bind:key="index" class="tr-regular">

                                        <td class="text-center"> {{lExp.codigo}} </td>
                                        <td class="text-left"> {{lExp.descricao}} </td>

                                        <td class="text-center"> {{lExp.ufFornec}} </td>
                                        <td class="text-center"> {{lExp.perfil}} </td>
                                        <td class="text-center"> {{lExp.ufDestino}} </td>
                                        <td class="text-center"> {{lExp.custoCompra}} </td>
                                        <td class="text-center"> {{lExp.valorTransferencia}} </td>
                                        <td class="text-center"> {{lExp.custoVarejo}} </td>
                                        <td class="text-center"> {{lExp.spotlight}} </td>

                                        <td class="text-center"> {{lExp.custo_cEnt_valorDoProdutoDaCompra}} </td>
                                        <td class="text-center"> {{lExp.custo_cEnt_ipi}} </td>
                                        <td class="text-center"> {{lExp.custo_cEnt_icmsSt}} </td>
                                        <td class="text-center"> {{lExp.custo_cEnt_icms}} </td>
                                        <td class="text-center"> {{lExp.custo_cEnt_pisCofins}} </td>
                                        <td class="text-center"> {{lExp.custo_cEnt_custo}} </td>

                                        <!-- <td class="text-center"> {{lExp.custo_cTransf_custo}} </td>
                                        <td class="text-center"> {{lExp.custo_cTransf_ipi}} </td>
                                        <td class="text-center"> {{lExp.custo_cTransf_icmsSt}} </td>
                                        <td class="text-center"> {{lExp.custo_cTransf_icmsOpePropria}} </td>
                                        <td class="text-center"> {{lExp.custo_cTransf_pisCofins}} </td>
                                        <td class="text-center"> {{lExp.custo_cTransf_valorDoProduto}} </td>
                                        <td class="text-center"> {{lExp.custo_cTransf_lucroLiquido}} </td> -->

                                        <!-- <td class="text-center"> {{lExp.custo_cVarejo_valorDoProdutoDaCompra}} </td>
                                        <td class="text-center"> {{lExp.custo_cVarejo_ipi}} </td>
                                        <td class="text-center"> {{lExp.custo_cVarejo_icmsSt}} </td>
                                        <td class="text-center"> {{lExp.custo_cVarejo_icms}} </td>
                                        <td class="text-center"> {{lExp.custo_cVarejo_pis}} </td>
                                        <td class="text-center"> {{lExp.custo_cVarejo_cofins}} </td>
                                        <td class="text-center"> {{lExp.custo_cVarejo_custo}} </td> -->

                                        <td class="text-center"> {{lExp.custo_dre_valorTotalDaNota}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_ipi}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_icmsSt}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_icmsStDifal}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vReceitaBrura}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pReceitaBrura}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vIcmsOpePropria}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pIcmsOpePropria}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vIcmsDifalConsFinal}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pIcmsDifalConsFinal}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vDas}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pDas}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vPisCofins}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pPisCofins}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vReceitaLiquida}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pReceitaLiquida}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vCustoCmvCpv}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pCustoCmvCpv}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vLucroBruto}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pLucroBruto}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vDespesasDeVenda}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pDespesasDeVenda}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_vLucroLiquido}} </td>
                                        <td class="text-center"> {{lExp.custo_dre_pLucroLiquido}} </td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RODAPÉ DE AÇÕES -->
            <div class="col-md-12 mb-4">
                <div class="card">
                    <div class="card-body">

                        <div class="row card-row">

                            <button class="geral-button btn-sm col-md-2 float-right mb-2 mr-1 ml-1" @click="Novo" title="Limpa consulta atual e prepara os campos para uma nova consulta.">
                                <i class="fas fa-file mr-2" aria-hidden="true"></i>
                                Novo
                            </button>

                            <button class="geral-button btn-sm col-md-2 float-right mb-2 mr-1 ml-1" @click="GerarPlanilhaXLSXCSV('lstExportResult', 'Exportacao Moostri - Demonstracao do Resultado', 'xlsx')" title="Exporta o resulta da consulta para um arquivo XLSX." v-if="mostrarResultado">
                                <i class="fas fa-cloud-download mr-2" aria-hidden="true"></i>
                                Exportar Resultado XLSX
                            </button>

                            <button class="geral-button btn-sm col-md-2 float-right mb-2 mr-1 ml-1" @click="GerarPlanilhaXLSXCSV('lstExportResult', 'Exportacao Moostri - Demonstracao do Resultado', 'csv')" title="Exporta o resulta da consulta para um arquivo CSV." v-if="mostrarResultado">
                                <i class="fas fa-cloud-download mr-2" aria-hidden="true"></i>
                                Exportar Resultado CSV
                            </button>

                        </div>

                    </div>
                </div>
            </div>

        </div>

        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" id="modalResultado" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title font-1-l-bold cor11">
                            Demostração do Resultado
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">

                        <!-- COMPOSIÇÃO DO CUSTO ENTRADA -->
                        <div class="card">
                            <h1 class="font-1-m cor11 text-center">
                                Composição do Custo Entrada
                            </h1>
                            <div class="card-body">
                                <div class="row card-row">
                                    <div class="expande-resultado">
                                        <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">
                                                        Descrição
                                                    </th>
                                                    <th class="text-center" width="20%">
                                                        Valor ($)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="i in custoEntrada" v-bind:key="i.index" class="tr-regular">
                                                    <td>
                                                        {{ i.descricao }}
                                                    </td>
                                                    <td class="text-center" width="20%">
                                                        {{parseFloat(i.valor).toFixed(2)}}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- DRE: Composição do Custo de Venda -->
                        <div class="card mt-30">
                            <h1 class="font-1-m cor11 text-center">
                                Composição do Preço de Venda
                            </h1>

                            <div class="card-body">
                                <div class="row card-row">
                                    <div class="expande-resultado">
                                        <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">Descrição</th>
                                                    <th class="text-center" width="20%">Valor ($)</th>
                                                    <th class="text-center" width="20%">Percentual (%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="i in dre" v-bind:key="i.index" class="tr-regular">
                                                    <td>{{ i.descricao }}</td>
                                                    <td class="text-center" width="20%">{{ parseFloat(i.valor).toFixed(2) }}</td>
                                                    <td class="text-center" width="20%">{{ (i.percentual==="" ? "": parseFloat(i.percentual).toFixed(2) ) }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- COMPOSIÇÃO DO CUSTO TRANSFERÊNCIA
                        <div class="card mt-30">
                            <h1 class="font-1-m cor11 text-center">
                                Composição do Custo Transferência
                            </h1>

                            <div class="card-body">
                                <div class="row card-row">
                                    <div class="expande-resultado">
                                        <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">
                                                        Descrição
                                                    </th>
                                                    <th class="text-center">
                                                        Valor ($)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="i in custoTransferencia" v-bind:key="i.index" class="tr-regular">
                                                    <td>
                                                        {{ i.descricao }}
                                                    </td>
                                                    <td class="text-center">
                                                        {{ parseFloat(i.valor).toFixed(2) }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div> -->

                        <!-- COMPOSIÇÃO DO CUSTO VAREJO
                        <div class="card mt-30">
                            <h1 class="font-1-m cor11 text-center">
                                Composição do Custo Varejo
                            </h1>
                            <div class="card-body">
                                <div class="row card-row">
                                    <div class="expande-resultado">
                                        <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                            <thead>
                                                <tr>
                                                    <th class="text-center">
                                                        Descrição
                                                    </th>
                                                    <th class="text-center">
                                                        Valor ($)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="i in custoVarejo" v-bind:key="i.index" class="tr-regular">
                                                    <td>
                                                        {{ i.descricao }}
                                                    </td>
                                                    <td class="text-center">
                                                        {{ parseFloat(i.valor).toFixed(2) }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div> -->

                        <h2 class="mt-30 font-1-s cor-11">
                            (*) O valor final pode apresentar variação na somatória por conta dos arredondamentos
                        </h2>
                    </div>
                </div>
            </div>
        </div>

        <!-- #MODAL: Modal Consulta em Lote para o Cálculo de Vendas -->
        <div class="modal fade bd-example-modal-lg" id="modalTabulacaoCalcVendasLote" tabindex="-1" role="dialog" aria-labelledby="TituloModalCentralizado" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="TituloModalImportacaoLote">
                            Insira os dados para consulta
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <span class="badge-danger">Atenção! Serão considerados apenas os 1000 primeiros códigos.</span>

                        <div class="row mt-3">
                            <p class="col-md-12">
                                Será feita a consulta dos produtos linha a linha. As informações devem ser separadas por ';' (ponto-e-vírgula)
                                <!--<a href="" data-toggle="modal" data-target="#modalTabulacaoCalcVendasLoteAjuda" data-backdrop="static" data-keyboard="false">Ajuda</a>., respeitando o posicionamento informado em -->
                            </p>
                        </div>

                        <div class="row mt-3">
                            <div class="col-md-12">
                                <h6 class="mb-2">
                                    Escolha o arquivo a ser importado, caso deseje.
                                    <i class="fas fa-info-circle" title="O arquivo CSV deve seguir o mesmo padrão apresentado acima, cada produto deve estar em uma linha, separados por (;)." style="color: steelblue" />
                                </h6>

                                <div class="input-group input-sm">
                                    <input type="text" class="form-control form-control-sm mr-1" id="fileNameUpload" readonly />
                                    <label class="input-group-btn">
                                        <span class="btn btn-sm btnModalGeral">
                                            <i class="fa fa-search" title="Buscar arquivo"></i>
                                            <input id="file-upload" type="file" accept=".csv, .ods, .xlsx, .xml" style="display: none" v-on:change="LerArquivo($event, this)" multiple="multiple" />
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

                        <div class="row mt-2">
                            <div class="col-md-12">
                                <p class="mb-3">
                                    Informe os dados para execução da consulta:
                                </p>
                            </div>
                        </div>

                        <a style="color: steelblue" v-on:click.stop.prevent="consLote = RemoverCabecalho(consLote)" title="Remove o cabeçalho do arquivo importado.">
                            <i class="fa fa-trash" style="color: steelblue" aria-hidden="true"></i>&nbsp;Remover Cabeçalho
                        </a>

                        <div class="row">
                            <textarea class="form-control form-control-sm ml-2 mr-2 mt-2" v-model="consLote" id="consultaLote" rows="5" autofocus placeholder="Informações tabuladas..."></textarea>
                            <p v-if="consLote != ''" class="text-right ml-2">
                                Total: {{ TotalItens(consLote) }} | Total Distintos: {{ ConsultarDistintos(consLote) }}
                            </p>
                        </div>

                        <div v-show="mostrarTabelaExemplo">
                            <table class="table table-divider table-striped table-sm table-responsive tableDetails table-bordered" id="TblConsultaVendaTeste">
                                <thead>
                                    <tr>
                                        <th>Codigo</th>
                                        <th>Origem</th>
                                        <th>UF</th>
                                        <th>Perfil Fornecedor</th>
                                        <th>Valor de Compra</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td class="tableexport-string">
                                            7898268910178
                                        </td>
                                        <td>0</td>
                                        <td>SP</td>
                                        <td>0</td>
                                        <td>10</td>
                                    </tr>

                                    <tr>
                                        <td class="tableexport-string">
                                            7898268910208
                                        </td>
                                        <td>0</td>
                                        <td>MG</td>
                                        <td>1</td>
                                        <td>10</td>
                                    </tr>

                                    <tr>
                                        <td class="tableexport-string">
                                            7896653705156
                                        </td>
                                        <td>0</td>
                                        <td>BA</td>
                                        <td>2</td>
                                        <td>10</td>
                                    </tr>

                                    <tr>
                                        <td class="tableexport-string">
                                            7896653702438
                                        </td>
                                        <td>0</td>
                                        <td>RJ</td>
                                        <td>1</td>
                                        <td>10</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <div class="mr-auto">
                            <button type="button" class="btn btnModalPrimary ml-2" data-toggle="modal" data-target="#modalPlanExemplo" data-backdrop="static" data-keyboard="false" title="Exporta em formato de planilha um exemplo de como deve ser montado o arquivo para importação." @click="GerarPlanilhaXLSXCSV(
                                            'TblConsultaVendaTeste',
                                            'Exemplo do XLSX para Calculo de Venda(Lote)',
                                            'xlsx')">
                                Planilha Exemplo XLSX
                            </button>
                            <button type="button" class="btn btnModalPrimary ml-2" data-toggle="modal" data-target="#modalPlanExemplo" data-backdrop="static" data-keyboard="false" title="Exporta em formato de planilha um exemplo de como deve ser montado o arquivo para importação." @click="GerarPlanilhaXLSXCSV(
                                            'TblConsultaVendaTeste',
                                            'Exemplo do CSV para Calculo de Venda(Lote)',
                                            'csv')">
                                Planilha Exemplo CSV
                            </button>
                            <button type="button" class="btn btnModalPrimary ml-2" title="Preenche a caixa de texto com as informações devidamente tabuladas." @click="consLote = GetTextoTabulado()">
                                Texto de Exemplo
                            </button>
                        </div>

                        <button type="button" class="btn btnModalGeral" data-dismiss="modal" @click="AddListaLote()">
                            <i class="fa fa-plus-circle" title="Adiciona produto(s)"></i>&nbsp;Adicionar à Lista
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</LayoutSidebar>
</template>

<script>
import router from "@/router/index";
import axios from "axios";
import helpers from "@/helpers/index.js";
import {
    RetUrlAPI,
    CallPostAsync
} from "@/helpers/axios.js";
import {
    useAuthStore
} from "@/stores/user";
import {
    useAlertStore
} from "@/stores";

const userStore = useAuthStore();

export default {

    data() {
        return {
            alertStore: useAlertStore(),
            processando: false,
            processMoostri: false,
            perfilConfigurado: false,
            isMobile: false,
            perfil: userStore.user.profile,
            nome: userStore.user.name,
            xml: null,
            consLote: "",
            mostrarTabelaExemplo: false,
            paginaAtual: 1,
            produtosPorPagina: 5,
            idxProduto: -1,
            idxDestinatario: -1,
            idxResultado: -1,
            cnpj: "",
            cnae: "",
            cfop: "",
            codigo: "",
            descricao: "",
            produtos: [],
            produto: {},
            detalhes: [],
            detalhe: {},
            destinatarios: [],
            destinatario: {},
            mostrarResultado: false,
            resultado: {},
            resultados: [],
            custoEntrada: [],
            custoTransferencia: [],
            dre: [],
            custoVarejo: [],

            timeIn: '',
            timeOut: '',

            // Controla se serão carragados os dados do produto que foi consultado na tela de Calculo de Importação
            loadImported: "N",

            // Tipo de ambiente
            amb: 1,

            // Determinação do Resultado: 0=Preço de Venda; 1=Valor de Compra; 2=Margem de Lucro.
            determTravado: false,
            determResult: 0,
            determResultados: [{
                    text: "0-Preço de Venda Sugerido",
                    value: 0
                },
                {
                    text: "1-Determinação do Valor de Compra",
                    value: 1
                },
                {
                    text: "2-Determinação da Margem de Lucro",
                    value: 2
                },
            ],

            // Código fo regime tributário da Empresa
            crt: 1,
            codigoCrt: [{
                    text: "1-Simples Nacional",
                    value: 1
                },
                {
                    text: "2-SN com excesso sublimite de receita bruta;",
                    value: 2,
                },
                {
                    text: "3-Regime Normal",
                    value: 3
                },
            ],

            // Regime Tributário
            regTrib: "LR",
            regimeTributario: [{
                    text: "LR-Lucro Real",
                    value: "LR",
                },
                {
                    text: "LP-Lucro Presumido",
                    value: "LP",
                },
                //{ text: 'SN-Simples Nacional', value: 'SN' },
            ],

            // Característica Tributário
            cTrib: 3, // Trago a opção de Varegista como padrão
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

            // Finalidade
            mostrarDestino: false,
            destino: -1,
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

            // Operação
            operacao: 1,
            destOperacao: [
                // {   text: "Transferência",  value: 0,   },
                {
                    text: "Venda",
                    value: 1,
                },
                // {    text: "Compra", value: 2,   },
                // {    text: "Compra", value: 2,   },
            ],

            // Simples Nacional
            mostrarSimples: false,
            simples: "N",
            simplesNac: [{
                    text: "Sim",
                    value: "S",
                },
                {
                    text: "Não",
                    value: "N",
                },
            ],

            // Origem
            origem: 0,
            lstOrigem: [{
                    text: "0-Nacional, exceto as indicadas nos códigos 3 a 5",
                    value: 0,
                },
                {
                    text: "1-Estrangeira - Importação direta, exceto a indicada no código 6",
                    value: 1,
                },
                {
                    text: "2-Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7",
                    value: 2,
                },
                {
                    text: "3-Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40%",
                    value: 3,
                },
                {
                    text: "4-Nacional, conforme Decreto-Lei nº 288/1967 , e as Leis nºs 8.248/1991, 8.387/1991, 10.176/2001 e 11.484/2007",
                    value: 4,
                },
                {
                    text: "5-Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%",
                    value: 5,
                },
                {
                    text: "6-Estrangeira - Importação direta, sem similar nacional, constante em lista de Resolução Camex e gás natural",
                    value: 6,
                },
                {
                    text: "7-Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista de Resolução Camex e gás natural",
                    value: 7,
                },
                {
                    text: "8-Nacional - Marcadoria ou bem com Conteúdo de Importação superior a 70% (setenta por cento)",
                    value: 8,
                },
            ],

            // Produção Própria
            producaoPropria: "N",
            prodProp: [{
                    text: "Não",
                    value: "N",
                },
                {
                    text: "Sim",
                    value: "S",
                },
            ],

            destOptSimplesNacional: false,

            // Perfil do Fornecedor
            fornecOptSimplesNacional: false,
            opcSimplesNacional: [{
                    value: true,
                    texto: "Sim",
                },
                {
                    value: false,
                    texto: "Não",
                },
            ],
            fornecPerfil: 0,
            fornecPerfis: [
                // (Antigo "Normal") Padrão RPA. O regime Lucro Real ou Presumido, acompanhará o do usuário se usuário não for Simples Nacional.
                // texto: '0 - Outras Atividades (Não optante pelo Simples Nacional)'
                {
                    idPerfil: 0,
                    texto: "0 - Outras Atividades",
                },

                // texto: '1 - Atacado / Distribuidor (Não optante pelo Simples Nacional)'
                {
                    idPerfil: 1,
                    texto: "1 - Atacado / Distribuidor",
                },

                // texto: '2 - Indústria ou Equiparado (Não optante pelo Simples Nacional)'
                {
                    idPerfil: 2,
                    texto: "2 - Indústria ou Equiparado",
                },

                //----------------------------------------------------------------------
                // Se a copção "Optante pelo Simples Nacional" (fornecOptSimplesNacional)
                // estiver marcada, "fornecPerfil" receberá "3", senão, o sistema
                // respeitará a seleção do usuário.
                //----------------------------------------------------------------------
                //{ idPerfil: 3, texto: '3 - ME (Simples Nacional)'},
            ],

            // Indicador da Inscrição Estadual
            indIE: 1,
            indInscrEstadual: [{
                    text: "1-Contribuinte ICMS",
                    value: 1,
                },
                {
                    text: "2-Não Contribuinte ICMS",
                    value: 2,
                },
            ],

            //Define o que será mostrado na UF de acordo com a operação realizada
            tipoUfOper: "",

            // Estados
            ufs: helpers.getUFs(),
            ctribs: helpers.getTribs(),

            pFabrica: 0,
            desconto: 0,
            pCompra: 0,
            pVenda: 0,

            margemLiquida: 0,
            frete: 0,
            comissao: 0,
            outrasDespesas: 0,

            // Objeto de envio
            envio: {
                emit: {
                    amb: "",
                    cnpj: "",
                    crt: "",
                    regimeTrib: "",
                    indIE: "",
                    uf: "",
                    cnae: "",
                },
                perfil: {
                    uf: [],
                    cfop: "",
                    caracTrib: [],
                    finalidade: 0,
                    simplesN: "N",
                    origem: "",
                },
                produtos: [{
                    codigo: "",
                    codInterno: "",
                    descricao: "",
                }, ],
            },

            // Objeto de retorno
            retConsulta: {},

            ufOrig: "",
            ufDest: "",

            // Dados de Retorno
            retTransacao: 0,
            retProdCodImendes: "",
            retProdEan: "",
            retProdCodInterno: "",

            retGrupo_Codigo: "",
            retGrupo_Ncm: "",
            retGrupo_Cest: "",
            retGrupo_Lista: "",
            retGrupo_Tipo: "",
            retGrupo_CodAnp: "",
            retGrupo_PassivelPmc: "",

            retPisCofin_CstEnt: "",
            retPisCofin_CstSai: "",
            retPisCofin_AliqPis: 0.0,
            retPisCofin_AliqCofins: 0.0,
            retPisCofin_Nri: "",
            retPisCofin_RedPis: "",
            retPisCofin_RedCofins: "",
            retPisCofin_AmpLegal: "",

            retIpi_CstEnt: "",
            retIpi_CstSai: "",
            retIpi_AliqIpi: 0.0,
            retIpi_CodEnq: "",
            retIpi_Ex: "",

            retRgr_Uf: "",
            retRgr_Mensagem: "",

            retRgr_Cfop: "",
            retRgr_CaracTrib_Codigo: "",
            retRgr_CaracTrib_Finalidade: "",
            retRgr_CaracTrib_CodRegra: "",
            retRgr_CaracTrib_Cfop: "",
            retRgr_CaracTrib_Cst: "",
            retRgr_CaracTrib_Csosn: "",
            retRgr_CaracTrib_AliqIcmsInterna: 0.0,
            retRgr_CaracTrib_AliqIcmsInterestadual: 0.0,
            retRgr_CaracTrib_AliqIcmsInterestadualRedBc: 0.0,
            retRgr_CaracTrib_pIsencao: 0.0,
            retRgr_CaracTrib_ReducaoBcIcms: 0.0,
            retRgr_CaracTrib_ReducaoBcIcmsSt: 0.0,
            retRgr_CaracTrib_AliqIcmsSt: 0.0,
            retRgr_CaracTrib_Iva: 0.0,
            retRgr_CaracTrib_IvaAjust: 0.0,
            retRgr_CaracTrib_Fcp: 0.0,
            retRgr_CaracTrib_CodBenef: "",
            retRgr_CaracTrib_PDifer: 0.0,
            retRgr_CaracTrib_Antecipado: "",
            retRgr_CaracTrib_Desonerado: "",
            retRgr_CaracTrib_Isento: "",
            retRgr_CaracTrib_InfPDV: [],
            retRgr_CaracTrib_pICMSPDV: 0.0,
            retRgr_CaracTrib_simbPDV: "",
            retRgr_CaracTrib_cstICMS: "",
            retRgr_CaracTrib_csosn: "",
            retRgr_CaracTrib_aliqIcmsInterna: 0.0,
            retRgr_CaracTrib_cstEnt: "",
            retRgr_CaracTrib_cstSai: "",
            retRgr_CaracTrib_aliqPis: 0.0,
            retRgr_aliqCofins: 0.0,

            retRgr_CaracTrib_Protocolo_ProtNome: "",
            retRgr_CaracTrib_Protocolo_Descricao: "",
            retRgr_CaracTrib_Protocolo_DtVigIni: "",
            retRgr_CaracTrib_Protocolo_DtVigFin: "",
            retRgr_CaracTrib_Protocolo_Isento: "",
            retRgr_CaracTrib_Protocolo_SubsTrib: "",
            retRgr_CaracTrib_Protocolo_RespTrib: "",
            retRgr_CaracTrib_Protocolo_AliqIcmsInterestadual: "",
            retRgr_CaracTrib_Protocolo_RedBcInterestadual: "",
            retRgr_CaracTrib_Protocolo_AliqEfetiva: "",
            retRgr_CaracTrib_Protocolo_Iva: "",

            retRgr_CaracTrib_Convenio_ConvId: 0,
            retRgr_CaracTrib_Convenio_ConvNome: "",
            retRgr_CaracTrib_Convenio_Descricao: "",
            retRgr_CaracTrib_Convenio_RespTrib: "",
            retRgr_CaracTrib_Convenio_AliqIcmsInterestadual: "",
            retRgr_CaracTrib_Convenio_RedBcInterestadual: "",
            retRgr_CaracTrib_Convenio_AliqEfetiva: "",
            retRgr_CaracTrib_Convenio_Iva: "",

            retRgr_Pmpf_pmpfCodigo: "",
            retRgr_Pmpf_prodCodigo: "",
            retRgr_Pmpf_pTrava: 0,
            retRgr_Pmpf_pTravaAjust: 0,
            retRgr_Pmpf_vPmpf: 0,
            retRgr_Pmpf_vMultiplo: 0,
            retRgr_Pmpf_amparoLegal: "",
            retRgr_Pmpf_dtVigenciaInicial: "",
            retRgr_Pmpf_dtVigenciaFinal: "",

            retRgr_Pmc_ean: "",
            retRgr_Pmc_registro: "",
            retRgr_Pmc_pmc: 0,
            retRgr_Pmc_pmcPercDesconto: 0,

            mostrarPmpf: false,
            mostrarPMC: false,

            // Variável para controlar se CST é entrada ou saída
            cstAtivo: true,

            //--------------------------------------------------------------------------------
            // Dados para cálculo atomatizado do custo base em saleDRE
            //--------------------------------------------------------------------------------
            dadosParaCusto: {
                cbAmb: "",
                cbCnpj: "",
                cbCRT: "",
                cbCnae: "",
                cbCfop: "",
                cbCTrib: "",
                cbDestino: "",
                cbSimples: "",
                cbCodInt: "",
                cbCodigo: "",
                cbDescricao: "",
            },

            //--------------------------------------------------------------------------------

            dataVigencia: new Date().toISOString().slice(0, 10),
            destinatarioFiltrado: false,
        };
    },

    methods: {

        Novo() {
            this.resultados = [];
            this.mostrarResultado = false;

            this.produtos = [];
            this.produto = {};
            this.detalhes = [];
            this.detalhe = {};
            this.destinatarios = [];
            this.destinatario = {};
            this.mostrarResultado = false;
            this.resultado = {};
            this.resultados = [];
            this.custoEntrada = [];
            this.custoTransferencia = [];
            this.dre = [];
            this.custoVarejo = [];

            this.pFabrica = 0;
            this.desconto = 0;
            this.pCompra = 0;
            this.pVenda = 0;
            this.margemLiquida = 0;
            this.frete = 0;
            this.comissao = 0;
            this.outrasDespesas = 0;

            this.codigo = "";
            this.descricao = "";

            this.determResult = 0;
            this.determTravado = false;

            this.crt = 1;
            this.regTrib = "LR";
            this.cTrib = 3;
            this.destino = -1;
            this.operacao = 1;
            this.mostrarSimples = false;
            this.simples = "N";
            this.origem = 0;
            this.fornecPerfil = 0;
            this.indIE = 1;

            this.perfilConfigurado = userStore.user.profile.hasProfile;
            this.destinatarios = userStore.user.userRecipients ? [...userStore.user.userRecipients] : [];

            this.destinatarioFiltrado = false;
        },

        CalcularPrecoCompra() {
            if (this.pFabrica > 0) {
                let res = this.pFabrica - (this.pFabrica * this.desconto / 100);

                if (res > 0) {
                    this.pCompra = res;
                }
            }
        },

        CalcularPercDesconto() {
            if (this.pFabrica > 0) {
                let res = 100 - ((this.pCompra / this.pFabrica) * 100);

                if (res > 0) {
                    this.desconto = res;
                }
            }
        },

        MudarPagina(pagina) {
            if (pagina >= 1 && pagina <= this.paginas) {
                this.paginaAtual = pagina;
            }
        },

        MostrarResultado() {
            if (this.destinatarios.length <= 0) {
                this.alertStore.error("Por favor, informe os dados do(s) destinatário(s).");
                return;
            }

            this.resultados = [];
            this.mostrarResultado = true;

            this.processando = true;
            let envio = new Object();
            this.timeIn = this.ObterMomento();

            envio.perfil = this.EnvioPerfil();
            envio.destinatarios = this.EnvioDestinatario();
            envio.produtos = this.EnvioProdutos();

            let user = userStore.user.partnerCNPJCPF;
            let pwd = userStore.user.partnerPassword;
            let urlToken = RetUrlAPI("Moostri") + "Token/LoginUser";
            let url = RetUrlAPI("Moostri") + "CalculoImpostos";

            this.processMoostri = true;

            CallPostAsync("", "", urlToken, {
                    "CnpjCpf": user,
                    "Password": pwd
                })
                .then((data) => {

                    this.processando = true;

                    if (data.token) {

                        CallPostAsync(user, pwd, url, envio, true, data.token)
                            .then((data) => {

                                this.processando = false;
                                this.processMoostri = false;

                                this.timeOut = this.ObterMomento();
                                // this.timeOut = JSON.stringify(data.demonstrativos);

                                if (!data.demonstrativos) {
                                    this.alertStore.error(data);
                                    return;
                                }

                                this.produtos.forEach((prod) => {
                                    this.resultado = {};

                                    this.resultado.codigo = prod.codigo;
                                    this.resultado.descricao = prod.descricao;
                                    this.resultado.detalhes = [];

                                    prod.detalhes.forEach((det) => {

                                        var filtroRetornoApi = data.demonstrativos.filter(filt => filt.perfilId == det.perfilId);

                                        let ufFornec = det.ufFornec;
                                        let pApelido = det.perfilApelido;

                                        filtroRetornoApi.forEach((res) => {

                                            var retMoostri = new Object();

                                            retMoostri.ufFornec = ufFornec;
                                            retMoostri.perfil = pApelido;
                                            retMoostri.ufDestino = res.ufDest;
                                            retMoostri.custoCompra = parseFloat(res.custo.custo).toFixed(2);
                                            retMoostri.valorTransferencia = 0;
                                            retMoostri.custoVarejo = 0;
                                            retMoostri.spotlight = parseFloat(res.spotlight).toFixed(2);

                                            retMoostri.custos = {
                                                custoEntrada: [{
                                                        descricao: "Valor do Produto da Compra",
                                                        valor: res.custo.valorDoProdutoNaCompra,
                                                    },
                                                    {
                                                        descricao: "(+) IPI",
                                                        valor: res.custo.ipi,
                                                    },
                                                    {
                                                        descricao: "(+) ICMS-sT",
                                                        valor: res.custo.icmsSt,
                                                    },
                                                    {
                                                        descricao: "(-) ICMS",
                                                        valor: res.custo.icms,
                                                    },
                                                    {
                                                        descricao: "(-) Pis/Confins",
                                                        valor: res.custo.pis + res.custo.cofins,
                                                    },
                                                    {
                                                        descricao: "(=) Custo",
                                                        valor: res.custo.custo,
                                                    },
                                                ],
                                                custoTransferencia: [{
                                                        descricao: "(=) Custo*",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(+) IPI",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(+) ICMS-sT",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(+) ICMS Ope. Própria",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(+) Pis/Confins",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "Valor do Produto",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(=) Lucro Líquido",
                                                        valor: 0.00,
                                                    },
                                                ],
                                                custoVarejo: [{
                                                        descricao: "Valor do Produto da Compra",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(+) IPI",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(+) ICMS-sT",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(-) ICMS",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(-) PIS",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(-) CONFINS",
                                                        valor: 0.00,
                                                    },
                                                    {
                                                        descricao: "(=) Custo*",
                                                        valor: 0.00,
                                                    },
                                                ],
                                                dre: [{
                                                        descricao: "Valor Total da Nota",
                                                        valor: res.valor.valorTotalNF,
                                                        percentual: "",
                                                    },
                                                    {
                                                        descricao: "(-) IPI",
                                                        valor: res.valor.ipi,
                                                        percentual: "",
                                                    },
                                                    {
                                                        descricao: "(-) ICMS-ST",
                                                        valor: res.valor.icmsStOpeSubsequente,
                                                        percentual: "",
                                                    },
                                                    {
                                                        descricao: "(-) ICMS-ST DIFAL",
                                                        valor: res.valor.icmsStDifal,
                                                        percentual: "",
                                                    },
                                                    {
                                                        descricao: "(=) Receita Bruta",
                                                        valor: res.valor.receitaBruta,
                                                        percentual: res.percentual.receitaBruta,
                                                    },
                                                    {
                                                        descricao: "(-) ICMS Op. Própria",
                                                        valor: res.valor.icmsOpePropria,
                                                        percentual: res.percentual.icmsOpePropria,
                                                    },
                                                    {
                                                        descricao: "(-) ICMS DIFAL Cons. Final",
                                                        valor: res.valor.icmsDifalNaoContribuinte,
                                                        percentual: res.percentual.icmsDifalNaoContribuinte,
                                                    },
                                                    {
                                                        descricao: "(-) DAS",
                                                        valor: res.valor.das,
                                                        percentual: res.percentual.das,
                                                    },
                                                    {
                                                        descricao: "(-) PIS/CONFINS",
                                                        valor: res.valor.pisExcluidoIcms + res.valor.cofinsExcluidoIcms,
                                                        percentual: res.percentual.pisExcluidoIcms + res.percentual.cofinsExcluidoIcms,
                                                    },
                                                    {
                                                        descricao: "(=) Receita Líquida",
                                                        valor: res.valor.receitaLiquida,
                                                        percentual: res.percentual.receitaLiquida,
                                                    },
                                                    {
                                                        descricao: "(-) Custo (CMV/CPV)",
                                                        valor: res.valor.cmvCpv,
                                                        percentual: res.percentual.cmvCpv,
                                                    },
                                                    {
                                                        descricao: "(=) Lucro Bruto*",
                                                        valor: res.valor.lucroBruto,
                                                        percentual: res.percentual.lucroBruto,
                                                    },
                                                    {
                                                        descricao: "(-) Despesas de Venda",
                                                        valor: res.valor.freteComissaoOutrasDespesas,
                                                        percentual: res.percentual.freteComissaoOutrasDespesas,
                                                    },
                                                    {
                                                        descricao: "(=) Lucro Líquido*",
                                                        valor: res.valor.lucroLiquido,
                                                        percentual: res.percentual.lucroLiquido,
                                                    },
                                                ],
                                            }

                                            this.resultado.detalhes.push(retMoostri);
                                        });

                                    });

                                    this.resultados.push(this.resultado);
                                });

                                // console.log('resultados', this.resultados);

                                this.mostrarResultado = true;

                            }).catch((reason) => {
                                this.processando = false;
                                this.processMoostri = false;
                                this.alertStore.error(url + ' | ' + reason);
                                // this.alertStore.error("Falha ao atualizar as informações vindas do servidor.");
                            });

                    } else {
                        this.processando = false;
                        this.processMoostri = false;
                        this.alertStore.error(data);
                    }

                    this.processando = false;
                }).catch((reason) => {
                    this.processando = false;
                    this.processMoostri = false;
                    this.alertStore.error(urlToken + ' | ' + reason);
                    // this.alertStore.error("Falha ao atualizar as informações vindas do servidor.");
                });
        },

        EnvioPerfil() {
            let perfis = [];
            let perfil = new Object();

            userStore.user.userProfile.forEach(p => {
                perfil = {};

                perfil.perfilId = p.prfId;
                perfil.usuarioId = userStore.user.userId;
                perfil.cnpj = userStore.user.clientCNPJCPF;
                perfil.regimeImposto = p.prfTaxRegime;
                perfil.tipoCnae = p.prfTypeCnae;
                perfil.cnae = "";
                perfil.recBruta = p.prfRecBruta;
                perfil.uf = p.prfUF;
                perfil.cfop = p.prfCfop;
                perfil.dtUltRec = p.prfDtUltRec;
                perfil.regimeEspecial = p.prfSpecialRegime;
                perfil.substICMS = "N"; // Onde pegar depois?

                perfis.push(perfil);
            });

            return perfis;
        },

        EnvioDestinatario() {
            let envDestinatarios = [];
            let envDestinatario = new Object();

            this.destinatarios.forEach(dest => {
                envDestinatario = {};

                envDestinatario.destId = dest.destId;
                envDestinatario.usuarioId = dest.usuaId;
                envDestinatario.perfil = dest.perfil;
                envDestinatario.ufDest = dest.uf;
                envDestinatario.substICMS = dest.substICMS;
                envDestinatario.finalidade = dest.finalidade;
                envDestinatario.tipoOperacao = dest.operacao;
                envDestinatario.simplesNacional = dest.simplesNacional;
                envDestinatario.margem = dest.margem;
                envDestinatario.frete = dest.frete;
                envDestinatario.comissao = dest.comissao;
                envDestinatario.outrasDespesas = dest.outrasDespesas;

                envDestinatarios.push(envDestinatario);
            });

            return envDestinatarios;
        },

        EnvioProdutos() {
            let produtos = [];
            let produto = new Object();
            let cabecalho = new Object();

            this.produtos.forEach(prod => {
                // console.log(prod)
                cabecalho = {};
                produto = {};

                produto.origemProduto = prod.detalhes[0].origem;
                produto.tipoOperacao = this.operacao;
                produto.perfilFornecedor = prod.detalhes[0].fornecPerfil;
                produto.caracteristicaTributariaDestinatario = this.destinatarios[0].perfil;
                produto.determinacaoResultado = this.determResult;
                produto.autoCalc = true;
                produto.usuarioID = userStore.user.userId;

                produto.precoLiquidoPretendido = 0;
                produto.precoCompra = prod.detalhes[0].pCompra;
                produto.precoVenda = prod.detalhes[0].pVenda;
                produto.custoBaseInformado = "0.00";

                produto.margemLucroDesejada = "10.00";
                produto.percentualFrete = "0.00";
                produto.comissao = "0.00";
                produto.outrasDespesas = "0.00";

                produto.produtoEan = helpers.VerificaDigito(prod.codigo) ? prod.codigo : "";
                produto.produtoCodImendes = "";
                produto.produtoCodInterno = !helpers.VerificaDigito(prod.codigo) ? prod.codigo : "";
                produto.producaoPropria = "N";
                produto.ufFornecedor = prod.detalhes[0].ufFornec;
                produto.ufDestinatario = this.destinatarios[0].uf;
                produto.descricao = prod.descricao;

                cabecalho.cabecalhoProduto = produto;

                produtos.push(cabecalho);
            });

            // console.log('produtos', produtos);

            return produtos;
        },

        MostrarResultadoMock() {
            this.processando = true;

            this.resultados = [];
            this.idxResultado = -1;

            if (this.produtos.length === 1) {
                this.idxResultado = 0;
            }
            this.produtos.forEach((result) => {
                this.resultado = {};

                this.resultado.codigo = result.codigo;
                this.resultado.descricao = result.descricao;

                this.resultado.detalhes = [{
                        ufFornec: "SP",
                        perfil: "CD TESTE MG",
                        ufDestino: "BA",
                        custoCompra: 7.88,
                        valorTransferencia: 9.33,
                        custoVarejo: 8.68,
                        custos: {
                            custoEntrada: [{
                                    descricao: "Valor do Produto da Compra",
                                    valor: 10.0,
                                },
                                {
                                    descricao: "(+) IPI",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS-sT",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(-) ICMS",
                                    valor: -1.2,
                                },
                                {
                                    descricao: "(-) Pis/Confins",
                                    valor: -0.92,
                                },
                                {
                                    descricao: "(=) Custo",
                                    valor: 7.88,
                                },
                            ],
                            custoTransferencia: [{
                                    descricao: "(=) Custo*",
                                    valor: 7.88,
                                },
                                {
                                    descricao: "(+) IPI",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS-sT",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS Ope. Própria",
                                    valor: 0.65,
                                },
                                {
                                    descricao: "(+) Pis/Confins",
                                    valor: 0.8,
                                },
                                {
                                    descricao: "Valor do Produto",
                                    valor: 9.33,
                                },
                                {
                                    descricao: "(=) Lucro Líquido",
                                    valor: 0.0,
                                },
                            ],
                            custoVarejo: [{
                                    descricao: "Valor do Produto da Compra",
                                    valor: 9.33,
                                },
                                {
                                    descricao: "(+) IPI",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS-sT",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(-) ICMS",
                                    valor: -0.65,
                                },
                                {
                                    descricao: "(-) PIS",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(-) CONFINS",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(=) Custo*",
                                    valor: 8.68,
                                },
                            ],
                        },
                    },
                    {
                        ufFornec: "SP",
                        perfil: "CD TESTE MG",
                        ufDestino: "BA",
                        custoCompra: 7.88,
                        valorTransferencia: 9.33,
                        custoVarejo: 8.68,
                        custos: {
                            custoEntrada: [{
                                    descricao: "Valor do Produto da Compra",
                                    valor: 10.0,
                                },
                                {
                                    descricao: "(+) IPI",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS-sT",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(-) ICMS",
                                    valor: -1.2,
                                },
                                {
                                    descricao: "(-) Pis/Confins",
                                    valor: -0.92,
                                },
                                {
                                    descricao: "(=) Custo",
                                    valor: 7.88,
                                },
                            ],
                            custoTransferencia: [{
                                    descricao: "(=) Custo*",
                                    valor: 7.88,
                                },
                                {
                                    descricao: "(+) IPI",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS-sT",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS Ope. Própria",
                                    valor: 0.65,
                                },
                                {
                                    descricao: "(+) Pis/Confins",
                                    valor: 0.8,
                                },
                                {
                                    descricao: "Valor do Produto",
                                    valor: 9.33,
                                },
                                {
                                    descricao: "(=) Lucro Líquido",
                                    valor: 0.0,
                                },
                            ],
                            custoVarejo: [{
                                    descricao: "Valor do Produto da Compra",
                                    valor: 9.33,
                                },
                                {
                                    descricao: "(+) IPI",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(+) ICMS-sT",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(-) ICMS",
                                    valor: -0.65,
                                },
                                {
                                    descricao: "(-) PIS",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(-) CONFINS",
                                    valor: 0.0,
                                },
                                {
                                    descricao: "(=) Custo*",
                                    valor: 8.68,
                                },
                            ],
                        },
                    },
                ];

                this.resultados.push(this.resultado);
            });

            this.mostrarResultado = true;
            this.processando = false;
        },

        MostarDetalhesProduto(index) {
            this.idxProduto = index;
            this.detalhes = this.produtos[index].detalhes;
        },

        MostrarDetalhesResultado(index) {
            this.idxResultado = index;
        },

        AdicionarProdutoLista() {
            let _pFabrica = this.pFabrica;
            let _pCompra = this.pCompra;
            let _pVenda = this.pVenda;
            let _determResult = this.determResult;

            this.idxProduto = -1;

            if (this.codigo == "") {
                this.alertStore.error("Não é possível adicionar um produto com o código vazio.");
                return;
            }

            // DET. PREÇO DO RESULADO: PREÇO DE VENDA SUGERIDO
            if (_determResult == 0) {
                if (_pFabrica + _pCompra <= 0) {
                    this.alertStore.error("Não é possível adicionar um produto sem Preço de Fábrica e sem Preço de Compra.");
                    return;
                }

                if (_pCompra == 0) {
                    this.pCompra = _pFabrica;
                }
            }

            // DET. PREÇO DO RESULADO: DETE. DO VALOR DE COMPRA
            if (_determResult == 1) {
                if (_pVenda <= 0) {
                    this.alertStore.error("Não é possível adicionar um produto para um resultado de Determinação do Valor de Compra com o preço de Venda menor ou igual a zero.");
                    return;
                }
            }

            // DET. PREÇO DO RESULADO: DETE. DO VALOR DE COMPRA
            if (_determResult == 2) {

                if (_pVenda <= 0 || _pCompra <= 0) {
                    this.alertStore.error("Não é possível adicionar um produto para um resultado de Determinação da Margem de Lucro com o preço de Venda ou o preço de Compra menor ou igual a zero.");
                    return;
                }

            }

            // ----------------------------------------------------------------------
            //#region Estadual - Características Tributárias - PMC (Preço Máximo ao Consumidor)
            if (_determResult != 1) {

                let pmpf = 0;
                let trava = 0;
                let travaAjustada = 0;

                let pmc = 0;
                let pmcDesconto = 0;
                
                let usarPMPF = false;
                let usarPMC = false;
                let usarIVA = false;

                let ufOrig = this.ufOrig;
                let ufDest = this.ufDest;
                let cnae = this.cnae;

                console.log('ufOrig', ufOrig);
                console.log('ufDest', ufDest);

                if (this.mostrarPmpf) {
                    pmpf = parseFloat(this.retRgr_Pmpf_vPmpf);
                    trava = parseFloat(this.retRgr_Pmpf_pTrava);
                    travaAjustada = parseFloat(this.retRgr_Pmpf_pTravaAjust);
                }

                if (this.mostrarPMC) {
                    pmc = parseFloat(this.retRgr_Pmc_pmc);
                    pmcDesconto = parseFloat(this.retRgr_Pmc_pmcDesconto);
                }

                usarPMPF = this.UsarPmpfCompra( ufOrig, ufDest, cnae, pmpf, trava, travaAjustada, pmc, _pCompra);
                usarPMC = this.UsarPmcCompra(   ufOrig, ufDest, cnae, pmpf, pmc, _pCompra);
                usarIVA = !(usarPMC || usarPMPF);

                if (usarPMC || usarPMPF) {
                    let exMsg = "Não é possível prosseguir se o Preço de Compra/Fábrica for maior que o ";
                
                    if (usarPMPF){
                        if( pmpf > 0 && _pCompra > pmpf ) {
                            exMsg += `PMPF ($ ${pmpf}).`;
                            this.alertStore.error(exMsg);
                            return;
                        }
                    }

                    if (usarPMC){
                        if( pmc > 0 && _pCompra > pmc) {
                            exMsg += `PMC ($ ${pmc}).`;

                            this.alertStore.error(exMsg);
                            return;
                        }
                    }
                }
            }
            //#endregion
            // ----------------------------------------------------------------------

            this.produto.codigo = this.codigo;
            this.produto.descricao = this.descricao;
            this.produto.verDetalhes = true;

            this.detalhes = [];

            let perfis = userStore.user.userProfile;
            perfis.forEach((perfil) => {
                this.detalhe = {};
                this.detalhe.perfilId = perfil.prfId;
                this.detalhe.perfilApelido = perfil.prfApelido
                this.detalhe.ufPerfil = perfil.prfUF;
                this.detalhe.origem = parseInt(this.origem);
                this.detalhe.ufFornec = this.ufOrig;
                this.detalhe.fornecOptSimplesNacional = this.fornecOptSimplesNacional;
                this.detalhe.fornecPerfil = this.fornecPerfil;
                this.detalhe.pFabrica = this.pFabrica;
                this.detalhe.desconto = this.desconto;
                this.detalhe.pCompra = this.pCompra;
                this.detalhe.pVenda = this.pVenda;

                this.detalhes.push(this.detalhe);
            });

            this.produto.detalhes = this.detalhes;
            this.produtos.push(this.produto);

            this.produto = {};
            this.detalhes = [];
            this.determTravado = true;
        },

        RemoveProdutoLista(index) {
            if (this.produtos[this.idxProduto].detalhes.length <= 1) {
                this.produtos.splice(this.idxProduto, 1);
            }

            this.produtos[this.idxProduto].detalhes.splice(index, 1);
        },

        RemoverProdutos(index) {
            Swal.fire({
                title: "Tem certeza que deseja excluir esse produto?",
                showCancelButton: true,
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
            }).then((result) => {
                if (result.isConfirmed) {
                    this.produtos.splice(index, 1);
                }
            });
        },

        LimparCamposProdutos() {
            this.codigo = "";
            this.descricao = "";
            this.pCompra = 0.0;
        },

        ObterFinalidade(valor) {
            let res = this.destMerc.filter(fin => fin.value === valor);
            return res[0].text;
        },

        ObterOperacao(valor) {
            var res = this.destOperacao.filter(oper => oper.value === valor);
            return res[0].text;
        },

        AdicionarDestinatarioLista() {
            const data = new Date(); // momento atual 
            const horas = data.getHours();
            const minutos = data.getMinutes();
            const segundos = data.getSeconds();
            const mseg = data.getMilliseconds();
            const aleaId = [horas, minutos, segundos, mseg].join('');

            if (!this.ValidarValores()) return;

            let auxDest = new Object();

            auxDest.destId = parseFloat(aleaId).toFixed(0);
            auxDest.usuaId = userStore.user.userId;
            auxDest.substICMS = 'N';
            auxDest.perfil = this.cTrib;
            auxDest.simplesnacional = this.simples;
            auxDest.uf = this.ufDest;
            auxDest.finalidade = this.destino;
            auxDest.operacao = this.operacao;
            auxDest.margem = parseFloat(this.margemLiquida).toFixed(2);
            auxDest.frete = parseFloat(this.frete).toFixed(2);
            auxDest.comissao = parseFloat(this.comissao).toFixed(2);
            auxDest.outrasDespesas = parseFloat(this.outrasDespesas).toFixed(2);

            this.destinatarios.push(auxDest);

            this.LimparCamposDestinatario();
        },

        SalvarDestinatarioLista() {

            if (!this.ValidarValores()) return;

            this.destinatarios[this.idxDestinatario].perfil = this.cTrib;
            this.destinatarios[this.idxDestinatario].simplesnacional = this.simples;
            this.destinatarios[this.idxDestinatario].uf = this.ufDest;
            this.destinatarios[this.idxDestinatario].finalidade = this.destino;
            this.destinatarios[this.idxDestinatario].operacao = this.operacao;
            this.destinatarios[this.idxDestinatario].margem = parseFloat(this.margemLiquida).toFixed(2);
            this.destinatarios[this.idxDestinatario].frete = parseFloat(this.frete).toFixed(2);
            this.destinatarios[this.idxDestinatario].comissao = parseFloat(this.comissao).toFixed(2);
            this.destinatarios[this.idxDestinatario].outrasDespesas = parseFloat(this.outrasDespesas).toFixed(2);

            this.LimparCamposDestinatario();
            this.idxDestinatario = -1;
        },

        ValidarValores() {
            // VALIDANDO TOTAL DOS PERCENTUAIS
            let _margem = parseFloat(this.margemLiquida);
            let _frete = parseFloat(this.frete);
            let _comissao = parseFloat(this.comissao);
            let _outrasDespesas = parseFloat(this.outrasDespesas);

            if (this.determResult < 2) {
                if (_margem <= 0) {
                    this.alertStore.error("O percentual da Margem Líquida deve ser maior que Zero.");
                    return false;
                }
            }

            if (_margem < 0) {
                this.alertStore.error("O percentual da Margem Líquida não pode ser menor que Zero.");
                return false;
            }

            if (_frete < 0) {
                this.alertStore.error("O percentual da Frete não pode ser menor que Zero.");
                return false;
            }

            if (_comissao < 0) {
                this.alertStore.error("O percentual da Comissão não pode ser menor que Zero.");
                return false;
            }

            if (_outrasDespesas < 0) {
                this.alertStore.error("O percentual da Outras Despesas não pode ser menor que Zero.");
                return false;
            }

            if ((_margem + _frete + _comissao + _outrasDespesas) > 99) {
                this.alertStore.error("A soma dos percentuais não pode ser superior a 99%.");
                return false;
            }

            return true;
        },

        AlterarDestinatario(index) {
            this.cTrib = this.destinatarios[index].perfil;
            this.simples = this.destinatarios[index].simplesnacional;
            this.ufDest = this.destinatarios[index].uf;
            this.destino = this.destinatarios[index].finalidade;
            this.operacao = this.destinatarios[index].operacao;
            this.margemLiquida = this.destinatarios[index].margem;
            this.frete = this.destinatarios[index].frete;
            this.comissao = this.destinatarios[index].comissao;
            this.outrasDespesas = this.destinatarios[index].outrasDespesas;

            this.idxDestinatario = index;
        },

        RemoveDestinatarioLista(index) {
            this.destinatarios.splice(index, 1);
        },

        LimparCamposDestinatario() {
            this.cTrib = 3;
            this.simples = false;
            this.ufDest = this.ufOrig;
            this.margemLiquida = 0.0;
            this.frete = 0.0;
            this.comissao = 0.0;
            this.outrasDespesas = 0.0;

            //----------------------------------------------------------------------
            // Estes campos não são mais 'limpos' porque agora a Operação e a 
            // Finalidade(destino) são fixados antes da seleção de um novo Destinatário.
            //----------------------------------------------(Renzo Alves 04/032024)-
            // this.destino = -1;
            // this.operacao = -1;
        },

        FiltrarDestinatarios() {
            if (this.operacao == -1 || this.destino == -1) {
                this.destinatarioFiltrado = false;
                return;
            }

            this.destinatarioFiltrado = true;

            this.destinatarios = [];

            if (userStore.user.userRecipients == null) return;

            userStore.user.userRecipients.forEach((dest) => {
                this.destinatario = {};
                if (dest.finalidade === this.destino && dest.operacao === this.operacao) {

                    this.destinatario.destId = dest.destId;
                    this.destinatario.usuaId = dest.usuaId;
                    this.destinatario.perfil = dest.perfil;
                    this.destinatario.simplesNacional = dest.simplesNacional;
                    this.destinatario.uf = dest.uf;
                    this.destinatario.substICMS = dest.substICMS;
                    this.destinatario.finalidade = dest.finalidade;
                    this.destinatario.operacao = dest.operacao;
                    this.destinatario.margem = dest.margem;
                    this.destinatario.frete = dest.frete;
                    this.destinatario.comissao = dest.comissao;
                    this.destinatario.outrasDespesas = dest.outrasDespesas;

                    this.destinatarios.push(this.destinatario);
                }
            });
        },

        SetupCalcTrib(pUf, pRegime, pRecBruta, pCnpjCpf) {
            this.amb = 2;
            this.ufOrig = pUf;
            this.cnpj = pCnpjCpf;
            this.recBruta = pRecBruta;

            //----------------------------------------------------------------------
            // Esta campo está sendo alimentado com a mesma UF do Perfil apenas para
            // completar os dados para um consumo "simples" da API, que nesse ponto
            // serve apenas para consultar a descrição do produto.
            //----------------------------------------------------------------------
            this.ufDest = this.ufOrig;
            //----------------------------------------------------------------------

            // Definindo Regime
            switch (pRegime) {
                case 1:
                    this.regTrib = "LR";
                    this.crt = 3;
                    break;
                case 2:
                    this.regTrib = "SN";
                    this.crt = 1;
                    break;
                case 3:
                    this.regTrib = "LP";
                    this.crt = 3;
                    break;

                default:
                    this.regTrib = "LR";
                    this.crt = 3;
                    break;
            }
        },

        AbrirImportacao() {
            this.determTravado = true;
            $("#modalTabulacaoCalcVendasLote").modal("show");
        },

        async EnviarDadosArquivo(e, vm) {
            try {
                this.consLote = await helpers.CarregarArquivo(e, vm);
            } catch (error) {
                this.alertStore.error(error);
            }
        },

        AbrirDemostracao(index) {
            $("#modalResultado").modal("show");

            this.custoEntrada = this.resultados[this.idxResultado].detalhes[index].custos.custoEntrada;
            this.custoTransferencia = this.resultados[this.idxResultado].detalhes[index].custos.custoTransferencia;
            this.custoVarejo = this.resultados[this.idxResultado].detalhes[index].custos.custoTransferencia;
            this.dre = this.resultados[this.idxResultado].detalhes[index].custos.dre;
        },

        AddListaLote() {
            let lstProdLote = [];

            lstProdLote = this.consLote.split("\n");

            lstProdLote.forEach((element) => {
                let produto = element.split(";");

                this.codigo = produto[0];
                this.origem = produto[1];
                this.ufOrig = produto[2];
                this.fornecPerfil = produto[3];
                this.pCompra = produto[4];

                this.AdicionarProdutoLista();
            });
        },

        GetTextoTabulado() {
            return (
                "0;N;N;7898268910178;DOCE PACOCA AIRON 160 G;MG;3;0;S;MG;0;;0;0;0;0;0;0;0;20;0;0;0;100;0;0;N;N;N;N;N\n" +
                "0;N;N;7898268910208;PACOQUINHA DIET 20G AIRON;MG;3;0;N;;;;0;0;0;0;0;0;100;10;0;0;0;0;0;0;N;N;N;N;N\n" +
                "1;N;N;7896653705156;PACOCA CAST. C/CHOC. ZERO FLORMEL;SP;3;0;S;;;MG;10;250;100;70;0;0;0;20;0;5;0;100;150;1;N;N;N;N;N\n" +
                "1;N;N;7896653702438;PACOQUINHA PREMIUM FLORMEL SM 90G;MG;3;0;S;;;MG;1;2;3;4;5;0;0;0;0;0;0;100;150;2;N;N;N;N;N"
            );
        },

        LerArquivo(event, vm) {
            let tipoArquivo = helpers.VerificarTipoArquivo(
                event.target.files[0].name
            );

            if (tipoArquivo === "XML") {
                this.LerXml(event);
            } else {
                this.EnviarDadosArquivo(event, vm);
            }
        },

        LerXml(event) {
            for (let i = 0; i < event.target.files.length; i++) {
                const file = event.target.files[i];

                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.xml = e.target.result;
                        this.PegarDadosXml(this.xml);
                    };
                    reader.readAsText(file);
                }
            }
        },

        PegarDadosXml(xml) {
            let parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            const cEANList = xmlDoc.getElementsByTagName("cEAN");
            const cDescricao = xmlDoc.getElementsByTagName("xProd");
            const origList = xmlDoc.getElementsByTagName("orig");
            const ufList = xmlDoc.getElementsByTagName("UF");
            const crt = xmlDoc.getElementsByTagName("CRT");
            const vCompra = xmlDoc.getElementsByTagName("vUnTrib");

            for (let i = 0; i < cEANList.length; i++) {
                this.codigo = cEANList[i].childNodes[0].nodeValue;
                this.descricao = cDescricao[i].childNodes[0].nodeValue;
                this.origem = origList[i].childNodes[0].nodeValue;
                this.pCompra = vCompra[i].childNodes[0].nodeValue;

                this.ufOrig = ufList[0].childNodes[0].nodeValue;
                this.fornecOptSimplesNacional =
                    crt[0].childNodes[0].nodeValue == "1" ? true : false;

                this.AdicionarProdutoLista();
            }

            this.LimparCamposProdutos();
            $("#modalTabulacaoCalcVendasLote").modal("hide");
        },

        PegarDadosXLSX(xlsx) {
            console.log(xlsx);
        },

        TotalItens(lote) {
            return helpers.TotalItens(lote);
        },

        ConsultarDistintos(lote) {
            return helpers.ConsultarDistintos(lote);
        },

        RemoverCabecalho(texto) {
            return helpers.RemoverCabecalho(texto);
        },

        GerarPlanilhaXLSXCSV(idTabela, nomeArquivo, formato) {
            $("#modalTabulacaoCalcVendasLote").modal("hide");
            return helpers.GerarPlanilhaXLSXCSV(idTabela, nomeArquivo, formato);
        },

        DefCFOP(origem, producaoPropria, ufOrig, ufDest) {
            let retCFOP = "";

            switch (origem) {
                case 1:
                case 2:
                case 6:
                case 7:
                    // Quando for um produto de origem Importada:
                    // Se for para mesma UF: 5102, se for para outra UF: 6102
                    retCFOP = ufOrig == ufDest ? "5102" : "6102";
                    break;

                default:
                    // Quando for um produto de origem Nacional:
                    if (ufOrig == ufDest)
                        retCFOP = producaoPropria == "S" ? "5101" : "5102";
                    else retCFOP = producaoPropria == "S" ? "6101" : "6102";

                    break;
            }
            return retCFOP;
        },

        ConsomeAPI(amb, cnpj, crt, regTrib, ufOrig, cnae, ufDest, cfop,
            cTrib, destino, simples, origem, codInt, codigo, descricao, producaoPropria) {

            this.retRgr_CaracTrib_InfPDV = [];

            // Define o código CFOP de acordo com as características cruzadas da Origem e Produção Própria
            cfop = this.DefCFOP(origem, producaoPropria, ufOrig, ufDest);
            cnae = userStore.user.userProfile.prfTypeCnae;

            if (userStore.user.profile.prfValidity != undefined)
                this.dataVigencia = userStore.user.profile.prfValidity;

            // Vigência
            let dia = this.dataVigencia.substring(8, 10);
            let mes = this.dataVigencia.substring(5, 7);
            let ano = this.dataVigencia.substring(0, 4);

            // Colocar CNPJ da IMendes, quando usuário for do tipo S
            if (userStore.user.clientStatus == "T" && cnpj == "") {
                cnpj = "zmxN9vlsfffMb20TRA7+GQ==";
                this.cnpj = cnpj;
            }

            if (this.VerificarCampos(cnpj, ufOrig, ufDest, cfop, cTrib, codigo, descricao)) {

                this.processando = true;
                this.retTransacao = 0;

                let user = "";
                let pwd = "";
                let url = RetUrlAPI("SaneamentoGrades");

                this.envio.emit = this.DadosEmit(amb, cnpj, crt, regTrib, ufOrig, cnae, dia, mes, ano);
                this.envio.perfil = this.DadosPerfil(ufDest, cfop, cTrib, destino, simples, origem);
                this.envio.produtos = [this.DadosPord(codInt, codigo.trim(), descricao), ];

                CallPostAsync(user, pwd, url, this.envio, true)
                    .then((data) => {
                        if (data.ret) {
                            this.alertStore.error(data.ret.mensagem);
                            this.processando = false;
                        } else {
                            if (data.Cabecalho.mensagem == "OK") {
                                var retGrupos = data["Grupos"][0];

                                this.cfop = retGrupos.Regras[0].uFs[0].CFOP.cFOP;
                                let cfopInf = parseInt(this.cfop);

                                // Verificar se CST é Entrada(CFOP < 5000) ou Saída(CFOP > 5000)
                                if (cfopInf > 5000) this.cstAtivo = false;
                                else this.cstAtivo = true;

                                // Este objeto será utilizado para os Cálculos Tributários no componente 'dre'
                                this.retConsulta = data["Grupos"][0];

                                if (retGrupos.Mensagem == "OK") {
                                    // ----------------------------------------------------------------------
                                    //#region Declarações e Setagens

                                    var retPisCofins = retGrupos.pisCofins;
                                    var retIpi = retGrupos.iPI;

                                    try {
                                        var retRegrasUf = retGrupos.Regras[0].uFs[0];
                                        var retCaracTrib = retRegrasUf.CFOP.CaracTrib[0];

                                        // ----------------------------------------------------------------------
                                        //#region Estadual

                                        this.retRgr_Uf = retRegrasUf.uF;
                                        this.retRgr_Mensagem = retRegrasUf.mensagem;
                                        this.retRgr_Cfop = retRegrasUf.CFOP.cFOP;

                                        //#endregion
                                        // ----------------------------------------------------------------------

                                        // ----------------------------------------------------------------------
                                        //#region Estadual - Características Tributárias

                                        this.retRgr_CaracTrib_Codigo = retCaracTrib.codigo;
                                        this.retRgr_CaracTrib_Finalidade = retCaracTrib.finalidade;
                                        this.retRgr_CaracTrib_CodRegra = retCaracTrib.codRegra;
                                        this.retRgr_CaracTrib_Cfop = retCaracTrib.cFOP;
                                        this.retRgr_CaracTrib_Cst = retCaracTrib.cST;
                                        this.retRgr_CaracTrib_Csosn = retCaracTrib.cSOSN;
                                        this.retRgr_CaracTrib_AliqIcmsInterna = retCaracTrib.aliqIcmsInterna.toFixed(2);
                                        this.retRgr_CaracTrib_AliqIcmsInterestadual = retCaracTrib.aliqIcmsInterestadual.toFixed(2);
                                        this.retRgr_CaracTrib_AliqIcmsInterestadualRedBc = "0.00";

                                        if (retCaracTrib.redBcICMsInterestadual)
                                            this.retRgr_CaracTrib_AliqIcmsInterestadualRedBc = retCaracTrib.redBcICMsInterestadual.toFixed(2);

                                        this.retRgr_CaracTrib_pIsencao = retCaracTrib.pIsencao.toFixed(2);

                                        this.pFabrica = 0;
                                        if (retCaracTrib.precoFabrica)
                                            this.pFabrica = retCaracTrib.precoFabrica[0].pf;

                                        this.retRgr_CaracTrib_ReducaoBcIcms = retCaracTrib.reducaoBcIcms.toFixed(2);
                                        this.retRgr_CaracTrib_ReducaoBcIcmsSt = retCaracTrib.reducaoBcIcmsSt.toFixed(2);
                                        this.retRgr_CaracTrib_AliqIcmsSt = retCaracTrib.aliqIcmsSt.toFixed(2);
                                        this.retRgr_CaracTrib_Iva = retCaracTrib.iVA.toFixed(2);
                                        this.retRgr_CaracTrib_IvaAjust = retCaracTrib.iVAAjust.toFixed(2);
                                        this.retRgr_CaracTrib_Fcp = retCaracTrib.fCP.toFixed(2);
                                        this.retRgr_CaracTrib_CodBenef = retCaracTrib.codBenef;
                                        this.retRgr_CaracTrib_PDifer = retCaracTrib.pDifer.toFixed(2);
                                        this.retRgr_CaracTrib_Antecipado = retCaracTrib.antecipado == "S" ? "SIM" : "NÃO";
                                        this.retRgr_CaracTrib_Desonerado = retCaracTrib.desonerado == "S" ? "SIM" : "NÃO";
                                        this.retRgr_CaracTrib_Isento = retCaracTrib.isento == "S" ? "SIM" : "NÃO";

                                        this.DefTipoUfOper(cfopInf);
                                    } catch {
                                        this.alertStore.error("Informações de IMCS não encontradas.");
                                        this.processando = false;
                                    }

                                    var retProt = retCaracTrib.Protocolo;
                                    var retConvenio = retCaracTrib.Convenio;
                                    var retPmpf = retCaracTrib.Pmpf;
                                    var retPcm = retCaracTrib.precoMaximoConsumidor;

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Retorno (Identificação)

                                    this.retTransacao = data.Cabecalho.transacao;
                                    try {
                                        this.retProdCodImendes = splitString(retGrupos.prodCodImendes[0], ";");
                                        // console.log('prodCodImendes', retGrupos.prodCodImendes[0]);

                                    } catch {
                                        this.retProdCodImendes = "";
                                    }

                                    try {
                                        this.retProdEan = splitString(retGrupos.prodEan[0], ";");
                                        // console.log('prodEan', retGrupos.prodEan[0]);
                                    } catch {
                                        this.retProdEan = "";
                                    }

                                    try {
                                        this.retProdCodInterno = splitString(retGrupos.prodCodInterno[0], ";");
                                        // console.log('prodCodInterno', retGrupos.prodCodInterno[0]);
                                    } catch {
                                        this.retProdCodInterno = "";
                                    }

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Federal - Grupo

                                    this.retGrupo_Codigo = retGrupos.codigo;
                                    this.retGrupo_Ncm = retGrupos.nCM;
                                    this.retGrupo_Cest = retGrupos.cEST;
                                    this.retGrupo_Lista = retGrupos.lista;
                                    this.retGrupo_Tipo = retGrupos.tipo;
                                    this.retGrupo_CodAnp = retGrupos.codAnp;
                                    this.retGrupo_PassivelPmc = retGrupos.passivelPMC == "S" ? "SIM" : "NÃO";

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Federal - Grupo - PIS/COFINS

                                    this.retPisCofin_CstEnt = retPisCofins.cstEnt;
                                    this.retPisCofin_CstSai = retPisCofins.cstSai;
                                    this.retPisCofin_AliqPis = retPisCofins.aliqPis.toFixed(2);
                                    this.retPisCofin_AliqCofins = retPisCofins.aliqCofins.toFixed(2);
                                    this.retPisCofin_Nri = retPisCofins.nri;
                                    this.retPisCofin_RedPis = retPisCofins.redPis;
                                    this.retPisCofin_RedCofins = retPisCofins.redCofins;
                                    this.retPisCofin_AmpLegal = retPisCofins.ampLegal;

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Federal - Grupo - IPI

                                    this.retIpi_CstEnt = retIpi.cstEnt;
                                    this.retIpi_CstSai = retIpi.cstSai;
                                    this.retIpi_AliqIpi = retIpi.aliqipi.toFixed(2);
                                    this.retIpi_CodEnq = retIpi.codenq;
                                    this.retIpi_Ex = retIpi.ex;

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // Informações PDV quando houver
                                    if (retCaracTrib.InfPDV != null) {
                                        this.retRgr_CaracTrib_InfPDV.push(retCaracTrib.InfPDV);
                                        this.retRgr_CaracTrib_pICMSPDV = retCaracTrib.InfPDV.pICMSPDV.toFixed(2);
                                        this.retRgr_CaracTrib_simbPDV = retCaracTrib.InfPDV.simbPDV;
                                        this.retRgr_CaracTrib_cstICMS = retCaracTrib.InfPDV.cstICMS;
                                        this.retRgr_CaracTrib_csosn = retCaracTrib.InfPDV.csosn;
                                        //this.retRgr_CaracTrib_aliqIcmsInterna = retCaracTrib.InfPDV.aliqIcmsInterna;
                                        this.retRgr_CaracTrib_cstEnt = retCaracTrib.InfPDV.cstEnt;
                                        this.retRgr_CaracTrib_cstSai = retCaracTrib.InfPDV.cstSai;
                                        this.retRgr_CaracTrib_aliqPis = retCaracTrib.InfPDV.aliqPis.toFixed(2);
                                        this.retRgr_CaracTrib_aliqCofins = retCaracTrib.InfPDV.aliqCofins.toFixed(2);
                                    }
                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Estadual - Características Tributárias - Protocolo

                                    this.LimparCamposProtocolo();
                                    if (retProt.protId > 0) {
                                        this.retRgr_CaracTrib_Protocolo_ProtNome = retProt.protNome;
                                        this.retRgr_CaracTrib_Protocolo_Descricao = retProt.descricao;
                                        this.retRgr_CaracTrib_Protocolo_DtVigIni = retProt.dtVigIni;
                                        this.retRgr_CaracTrib_Protocolo_DtVigFin = retProt.dtVigFin;
                                        this.retRgr_CaracTrib_Protocolo_Isento = retProt.isento;
                                        this.retRgr_CaracTrib_Protocolo_SubsTrib = retProt.subsTrib;
                                        this.retRgr_CaracTrib_Protocolo_RespTrib = retProt.respTrib;
                                        this.retRgr_CaracTrib_Protocolo_AliqIcmsInterestadual = retProt.aliqIcmsInterestadual.toFixed(2);
                                        this.retRgr_CaracTrib_Protocolo_RedBcInterestadual = retProt.redBcInterestadual.toFixed(2);
                                        this.retRgr_CaracTrib_Protocolo_AliqEfetiva = retProt.aliqEfetiva.toFixed(2);
                                        this.retRgr_CaracTrib_Protocolo_Iva = retProt.iva.toFixed(2);
                                    }

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Estadual - Características Tributárias - Convênio

                                    this.LimparCamposConvenio();
                                    if (retConvenio != null && retConvenio.aliqIcmsInterestadual != undefined) {

                                        if (retConvenio.descricao != "null")
                                            this.retRgr_CaracTrib_Convenio_Descricao = retConvenio.descricao;

                                        this.retRgr_CaracTrib_Convenio_ConvId = retConvenio.convId;
                                        this.retRgr_CaracTrib_Convenio_ConvNome = retConvenio.convNome;
                                        this.retRgr_CaracTrib_Convenio_RespTrib = retConvenio.respTrib;
                                        this.retRgr_CaracTrib_Convenio_AliqIcmsInterestadual = retConvenio.aliqIcmsInterestadual.toFixed(2);
                                        this.retRgr_CaracTrib_Convenio_RedBcInterestadual = retConvenio.redBcInterestadual.toFixed(2);
                                        this.retRgr_CaracTrib_Convenio_AliqEfetiva = retConvenio.aliqEfetiva.toFixed(2);
                                        this.retRgr_CaracTrib_Convenio_Iva = retConvenio.iva.toFixed(2);
                                    }

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Estadual - Características Tributárias - PMPF

                                    this.LimparCamposPMPF();
                                    this.mostrarPmpf = false;
                                    if (retPmpf != null && retPmpf != undefined && retPmpf.length > 0) {
                                        this.retRgr_Pmpf_pmpfCodigo = retPmpf[0].pmpfCodigo;
                                        this.retRgr_Pmpf_prodCodigo = retPmpf[0].prodCodigo;
                                        this.retRgr_Pmpf_pTrava = retPmpf[0].pTrava.toFixed(2);
                                        this.retRgr_Pmpf_pTravaAjust = retPmpf[0].pTravaAjust.toFixed(2);
                                        this.retRgr_Pmpf_vPmpf = retPmpf[0].vPmpf.toFixed(2);
                                        this.retRgr_Pmpf_vMultiplo = retPmpf[0].vMultiplo;
                                        this.retRgr_Pmpf_amparoLegal = retPmpf[0].amparoLegal;
                                        this.retRgr_Pmpf_dtVigenciaInicial = retPmpf[0].dtVigenciaInicial;
                                        this.retRgr_Pmpf_dtVigenciaFinal = retPmpf[0].dtVigenciaFinal;

                                        this.mostrarPmpf = true;
                                    }

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Estadual - Características Tributárias - PMC (Preço Máximo ao Consumidor)

                                    this.LimparCamposPMC();
                                    this.mostrarPMC = false;
                                    if (retPcm != null && retPcm != undefined && retPcm.length > 0) {
                                        this.retRgr_Pmc_ean = retPcm[0].ean;
                                        this.retRgr_Pmc_registro = retPcm[0].registro;
                                        this.retRgr_Pmc_pmc = retPcm[0].pmc.toFixed(2);

                                        if (retPcm[0].pmcPercDesconto)
                                            this.retRgr_Pmc_pmcPercDesconto = retPcm[0].pmcPercDesconto.toFixed(2);

                                        this.mostrarPMC = true;
                                    }

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    // ----------------------------------------------------------------------
                                    //#region Dados para Cálculo Automatizado do Custo Base

                                    this.dadosParaCusto.cbAmb = amb;
                                    this.dadosParaCusto.cbCnpj = cnpj;
                                    this.dadosParaCusto.cbCRT = crt;
                                    this.dadosParaCusto.cbCnae = cnae;
                                    this.dadosParaCusto.cbCfop = this.DefCFOP(origem, producaoPropria, ufOrig, ufDest);
                                    this.dadosParaCusto.cbCTrib = cTrib;
                                    this.dadosParaCusto.cbDestino = destino;
                                    this.dadosParaCusto.cbSimples = simples;
                                    this.dadosParaCusto.cbCodInt = codInt;
                                    this.dadosParaCusto.cbCodigo = codigo;
                                    this.dadosParaCusto.cbDescricao = descricao;
                                    this.dadosParaCusto.cbCTrib = cTrib;
                                    this.dadosParaCusto.cbDestino = destino;

                                    //#endregion
                                    // ----------------------------------------------------------------------

                                    this.processando = false;
                                    
                                } else {
                                    this.alertStore.error(retGrupos.Mensagem);
                                    this.processando = false;
                                }
                            } else {
                                if (data.Grupos.length < 1) {
                                    if (!data.Cabecalho.mensagem)
                                        this.alertStore.error("Informações de PIS/COFINS não encontradas.");
                                    else {
                                        this.alertStore.error(data.Cabecalho.mensagem);
                                    }
                                } else
                                    this.alertStore.error(data.Cabecalho.mensagem);

                                this.processando = false;
                            }
                        }
                    })
                    .catch((reason) => {
                        console.log(reason);
                        this.alertStore.error("Falha ao atualizar as informações vindas do servidor.");
                        this.alertStore.error(reason);
                        this.processando = false;
                    });
            }
        },

        UsarPmpfCompra(ufOrig, ufDest, cnae, pmpf, trava, travaAjustada, pmc, baseCalculo) {
            let usarPMPF = true;
            let userUf = ufDest; // UF do Fornecedor
            let destinatarioUf = ufOrig; // UF do Usuário Moostri

            let fornecedorUf = ufOrig; // UF do Fornecedor
            let fornecedorPerfil = this.fornecPerfil;

            let lista = this.retGrupo_Lista;
            let tipo = this.retGrupo_Tipo;

            if ((lista == null || lista == "") || (tipo == null || tipo == ""))
                return false;

            if (userUf == "SP" && destinatarioUf == "SP") {
                if ((fornecedorUf == "SP") && (fornecedorPerfil == 2)) {
                    if ((pmc == 0 && pmpf == 0) || (baseCalculo >= (pmpf * trava)))
                        usarPMPF = false;

                    if (pmc > 0) {
                        if ((pmc < pmpf) && (pmc < baseCalculo))
                            usarPMPF = false;

                        if ((baseCalculo > pmc))
                            usarPMPF = false;
                    }
                }
            }

            let cenarioUm = ((userUf != "SP") && (destinatarioUf == "SP"));
            let cenarioDois = ((userUf != "SP") && (fornecedorUf != "SP"));

            if (cenarioUm || cenarioDois) {
                if ((pmc == 0 && pmpf == 0) || (baseCalculo >= (pmpf * travaAjustada)))
                    usarPMPF = false;

                if (pmc > 0) {
                    if ((pmc < pmpf) && (pmc < baseCalculo))
                        usarPMPF = false;

                    if ((baseCalculo > pmc))
                        usarPMPF = false;
                }
            }

            return usarPMPF;
        },

        UsarPmcCompra(ufOrig, ufDest, pmpf, pmc, baseCalculo) {
            let usarPMC = false;
            let lista = this.retGrupo_Lista;
            let tipo = this.retGrupo_Tipo;
            let ehMedicamento = (lista == null || lista == "") || (tipo == null || tipo == "");

            let usuarioUf = ufDest; // UF do Usuário Moostri
            let destinoUf = ufOrig; // UF do Fornecedor

            if (!ehMedicamento)
                return false;

            // SÃO PAULO(SP)
            if (usuarioUf == "SP" && destinoUf == "SP") {
                if (pmc > 0) {
                    if ((pmc < pmpf) && (pmc < baseCalculo))
                        usarPMC = true;

                    if (baseCalculo > pmc)
                        usarPMC = true;
                }
            }

            return usarPMC;
        },

        ConsultaProduto(cnpj, codigo) {
            if (!codigo) return;

            let codInt = "S";

            if (cnpj == "") {
                cnpj = userStore.user.clientCNPJCPF;
                this.cnpj = cnpj;
            }

            if (helpers.VerificaDigito(codigo)) {
                codInt = "N";
            }

            let user = "";
            let pwd = "";
            let url = RetUrlAPI("PostDescricoes");

            let objEnvio = {};
            let cabecalho = {};
            let produto = [codigo.trim()];
            let auxCodigo = codigo.trim();

            // Colocar CNPJ da IMendes, quando usuário for do tipo S
            if (userStore.user.clientStatus == "T") {
                cnpj = "zmxN9vlsfffMb20TRA7+GQ==";
                this.cnpj = cnpj;
            }

            cabecalho.cnpjcpf = cnpj;
            cabecalho.codInterno = codInt;

            objEnvio.Cabecalho = cabecalho;
            objEnvio.Produto = produto;

            // this.ufOrig = userStore.user.profile.prfUF;
            // this.ufDest = this.ufOrig;
            this.processando = true;

            this.SetupCalcTrib(
                userStore.user.profile.prfUF,
                userStore.user.profile.prfTaxRegime,
                userStore.user.profile.prfRecBruta,
                cabecalho.cnpjcpf);

            CallPostAsync(user, pwd, url, objEnvio, true)
                .then((data) => {
                    if (data.ret) {
                        this.alertStore.error(data.ret.mensagem);
                        this.processando = false;
                    } else {
                        if (data.cabecalho.mensagem == "OK") {
                            let retProdutos = data.produto;

                            if (retProdutos.length > 0) {
                                this.codigo = retProdutos[0].ean;
                                this.descricao = retProdutos[0].descricao;

                                //----------------------------------------------------------------------
                                // Restaura o código digitado pelo usuário quando for CódigoInterno = 'S'
                                //----------------------------------------------------------------------
                                if (codInt == "S") this.codigo = auxCodigo;

                                this.ConsomeAPI(
                                    this.amb, this.cnpj, this.crt, this.regTrib, this.ufOrig,
                                    this.cnae, this.ufDest, this.cfop, this.cTrib, this.destino,
                                    this.simples, this.origem, codInt, this.codigo, this.descricao,
                                    this.producaoPropria
                                );

                            } else {
                                this.alertStore.error("O Produto consultado não foi encontrado. Verifique e tente novamente.");
                                this.descricao = "";
                            }
                        } else {
                            this.alertStore.error(data.cabecalho.mensagem);
                        }
                        this.processando = false;
                    }
                })
                .catch((reason) => {
                    console.log(reason);
                    this.alertStore.error("Falha ao atualizar as informações vindas do servidor.");
                    this.alertStore.error(reason);
                    this.processando = false;
                });
        },

        DadosEmit(amb, cnpj, crt, regime, uf, cnae, dia, mes, ano) {
            var emit = new Object();

            emit.amb = amb;
            emit.cnpj = cnpj;
            emit.crt = crt;
            emit.regimeTrib = regime;
            //emit.indIE = indIE;
            emit.uf = uf;
            emit.cnae = cnae;
            emit.dia = dia;
            emit.mes = mes;
            emit.ano = ano;
            emit.regimeEspecial = '';
            emit.regimeEspecial = userStore.user.profile.prfSpecialRegime;

            return emit;
        },

        DadosPerfil(uf, cfop, cTrib, destino, simples, origem) {
            var perfil = new Object();

            perfil.uf = [uf];
            perfil.cfop = cfop;
            perfil.caracTrib = [Number(cTrib)];
            perfil.finalidade = Number(destino);
            perfil.simplesN = simples;
            perfil.origem = origem;

            return perfil;
        },

        DadosPord(interno, codigo, descr) {
            var produto = new Object();

            produto.codigo = codigo;
            produto.codInterno = interno;
            produto.descricao = descr;

            return produto;
        },

        VerificarCampos(cnpj, ufOrig, ufDest, cfop, cTrib, codigo, descricao) {
            // if(ObterDadoLocalStorage('Perfil', 'prfTaxRegime') != 2) {
            //     this.alertStore.error( 'Essa solução só está homologada para empresas do Simples Nacional até o momento.');
            //     return false;
            // }

            if (!cnpj) {
                this.alertStore.error("Por favor informar CNPJ.");
                return false;
            }

            if (!ufOrig) {
                this.alertStore.error("Por favor informar uf Origem.");
                return false;
            }

            if (!ufDest) {
                this.alertStore.error("Por favor informar uf Destino.");
                return false;
            }

            if (!cfop) {
                this.alertStore.error("Por favor informar CFOP.");
                return false;
            }

            if (cTrib == null) {
                this.alertStore.error("Por favor informar carac. tributária.");
                return false;
            }

            if (!codigo) {
                this.alertStore.error("Por favor informar o código do produto.");
                return false;
            }

            if (!descricao) {
                this.alertStore.error("Por favor informar a descrição do produto.");
                return false;
            }

            return true;
        },

        // Caso CFOP comece com 2 ou 6 habilitar o campo finalidade
        InformacaoCFOP(cfop) {
            if (!cfop) {
                this.mostrarDestino = false;
                this.destino = 0;
            } else {
                if (cfop.startsWith(2) || cfop.startsWith(6))
                    if (cfop.length == 4) this.mostrarDestino = true;
                    else this.destino = 0;
            }
        },

        // Caso a carac. trib for entre 0 e 4 habilitar o campo Simples
        InformacaoSimples(cTrib) {
            if (cTrib < 5 && cTrib != null) {
                this.mostrarSimples = true;
                return;
            }

            this.simples = "N";
            this.mostrarSimples = false;
        },

        //Define o que será mostrado na UF de acordo com a operação realizada
        DefTipoUfOper(cfop) {
            if (cfop < 5000) {
                if (cfop.toString().startsWith(2)) this.tipoUfOper = "Origem";
                else this.tipoUfOper = "UF";
            } else if (cfop > 5000) {
                if (cfop.toString().startsWith(6)) this.tipoUfOper = "Destino";
                else this.tipoUfOper = "UF";
            }
        },

        LimparCamposProtocolo() {
            this.retRgr_CaracTrib_Protocolo_ProtNome = "";
            this.retRgr_CaracTrib_Protocolo_Descricao = "";
            this.retRgr_CaracTrib_Protocolo_DtVigIni = "";
            this.retRgr_CaracTrib_Protocolo_DtVigFin = "";
            this.retRgr_CaracTrib_Protocolo_Isento = "";
            this.retRgr_CaracTrib_Protocolo_SubsTrib = "";
            this.retRgr_CaracTrib_Protocolo_RespTrib = "";
            this.retRgr_CaracTrib_Protocolo_AliqIcmsInterestadual = "";
            this.retRgr_CaracTrib_Protocolo_RedBcInterestadual = "";
            this.retRgr_CaracTrib_Protocolo_AliqEfetiva = "";
            this.retRgr_CaracTrib_Protocolo_Iva = "";
        },

        LimparCamposConvenio() {
            this.retRgr_CaracTrib_Convenio_ConvId = 0;
            this.retRgr_CaracTrib_Convenio_ConvNome = "";
            this.retRgr_CaracTrib_Convenio_Descricao = "";
            this.retRgr_CaracTrib_Convenio_RespTrib = "";
            this.retRgr_CaracTrib_Convenio_AliqIcmsInterestadual = "";
            this.retRgr_CaracTrib_Convenio_RedBcInterestadual = "";
            this.retRgr_CaracTrib_Convenio_AliqEfetiva = "";
            this.retRgr_CaracTrib_Convenio_Iva = "";
        },

        LimparCamposPMPF() {
            this.retRgr_Pmpf_pmpfCodigo = "";
            this.retRgr_Pmpf_prodCodigo = "";
            this.retRgr_Pmpf_pTrava = 0;
            this.retRgr_Pmpf_pTravaAjust = 0;
            this.retRgr_Pmpf_vPmpf = 0;
            this.retRgr_Pmpf_vMultiplo = 0;
            this.retRgr_Pmpf_amparoLegal = "";
            this.retRgr_Pmpf_dtVigenciaInicial = "";
            this.retRgr_Pmpf_dtVigenciaFinal = "";
        },

        LimparCamposPMC() {
            this.retRgr_Pmc_ean = "";
            this.retRgr_Pmc_registro = "";
            this.retRgr_Pmc_pmc = 0;
            this.retRgr_Pmc_pmcPercDesconto = 0;
        },

        CarregaDadosImportacao() {
            let imported = new Object();
            imported = JSON.parse(localStorage.getItem("Imported"));

            this.origem = 1;
            this.codInt = imported.codigoInterno;
            this.codigo = imported.prodCodigo;
            this.descricao = imported.descProduto;
        },

        ObterMomento() {
            let momento = new Date();

            return momento.getDate() + '/' + momento.getMonth() + 1 + '/' + momento.getFullYear() + ' ' +
                momento.getHours() + ':' + momento.getMinutes() + ':' + momento.getSeconds();
        },

    },
    mounted() {
        helpers.VerificarAutenticacao();
        let autorizado = helpers.VerificarAcessos(20);

        if (!autorizado) {
            this.alertStore.error(
                "Você ainda não possui a solução do Moostri. Entre em contato com o nosso time de comercial!!"
            );

            router.push("/");
        }

        this.perfilConfigurado = userStore.user.profile.hasProfile;
        this.destinatarios = userStore.user.userRecipients ? [...userStore.user.userRecipients] : [];
    },

    computed: {
        produtosPaginados() {
            const inicio = (this.paginaAtual - 1) * this.produtosPorPagina;
            const fim = this.paginaAtual * this.produtosPorPagina;

            return this.produtos.slice(inicio, fim);
        },

        paginas() {
            return Math.ceil(this.produtos.length / this.produtosPorPagina);
        },

        listaExportacao() {
            let lista = [];

            this.resultados.forEach(res => {
                let item = new Object();

                let codigo = res.codigo;
                let descricao = res.descricao;

                res.detalhes.forEach(det => {
                    let cEntrada = det.custos.custoEntrada;
                    let cTransf = det.custos.custoTransferencia;
                    let cVarejo = det.custos.custoVarejo;
                    let cDre = det.custos.dre;

                    item.codigo = codigo;
                    item.descricao = descricao;

                    item.ufFornec = det.ufFornec;
                    item.perfil = det.perfil;
                    item.ufDestino = det.ufDestino;
                    item.custoCompra = parseFloat(det.custoCompra).toFixed(2).toString();
                    item.valorTransferencia = parseFloat(det.valorTransferencia).toFixed(2).toString();;
                    item.custoVarejo = parseFloat(det.custoVarejo).toFixed(2).toString();
                    item.spotlight = parseFloat(det.spotlight).toFixed(2).toString();

                    item.custo_cEnt_valorDoProdutoDaCompra = parseFloat(cEntrada[0].valor).toFixed(2).toString();
                    item.custo_cEnt_ipi = parseFloat(cEntrada[1].valor).toFixed(2).toString();
                    item.custo_cEnt_icmsSt = parseFloat(cEntrada[2].valor).toFixed(2).toString();
                    item.custo_cEnt_icms = parseFloat(cEntrada[3].valor).toFixed(2).toString();
                    item.custo_cEnt_pisCofins = parseFloat(cEntrada[4].valor).toFixed(2).toString();
                    item.custo_cEnt_custo = parseFloat(cEntrada[5].valor).toFixed(2).toString();

                    item.custo_cTransf_custo = parseFloat(cTransf[0].valor).toFixed(2).toString();
                    item.custo_cTransf_ipi = parseFloat(cTransf[1].valor).toFixed(2).toString();
                    item.custo_cTransf_icmsSt = parseFloat(cTransf[2].valor).toFixed(2).toString();
                    item.custo_cTransf_icmsOpePropria = parseFloat(cTransf[3].valor).toFixed(2).toString();
                    item.custo_cTransf_pisCofins = parseFloat(cTransf[4].valor).toFixed(2).toString();
                    item.custo_cTransf_valorDoProduto = parseFloat(cTransf[5].valor).toFixed(2).toString();
                    item.custo_cTransf_lucroLiquido = parseFloat(cTransf[6].valor).toFixed(2).toString();

                    item.custo_cVarejo_valorDoProdutoDaCompra = parseFloat(cVarejo[0].valor).toFixed(2).toString();
                    item.custo_cVarejo_ipi = parseFloat(cVarejo[1].valor).toFixed(2).toString();
                    item.custo_cVarejo_icmsSt = parseFloat(cVarejo[2].valor).toFixed(2).toString();
                    item.custo_cVarejo_icms = parseFloat(cVarejo[3].valor).toFixed(2).toString();
                    item.custo_cVarejo_pis = parseFloat(cVarejo[4].valor).toFixed(2).toString();
                    item.custo_cVarejo_cofins = parseFloat(cVarejo[5].valor).toFixed(2).toString();
                    item.custo_cVarejo_custo = parseFloat(cVarejo[6].valor).toFixed(2).toString();

                    item.custo_dre_valorTotalDaNota = parseFloat(cDre[0].valor).toFixed(2).toString();
                    item.custo_dre_ipi = parseFloat(cDre[1].valor).toFixed(2).toString();
                    item.custo_dre_icmsSt = parseFloat(cDre[2].valor).toFixed(2).toString();
                    item.custo_dre_icmsStDifal = parseFloat(cDre[3].valor).toFixed(2).toString();
                    item.custo_dre_vReceitaBrura = parseFloat(cDre[4].valor).toFixed(2).toString();
                    item.custo_dre_pReceitaBrura = parseFloat(cDre[4].percentual).toFixed(2).toString();
                    item.custo_dre_vIcmsOpePropria = parseFloat(cDre[5].valor).toFixed(2).toString();
                    item.custo_dre_pIcmsOpePropria = parseFloat(cDre[5].percentual).toFixed(2).toString();
                    item.custo_dre_vIcmsDifalConsFinal = parseFloat(cDre[6].valor).toFixed(2).toString();
                    item.custo_dre_pIcmsDifalConsFinal = parseFloat(cDre[6].percentual).toFixed(2).toString();
                    item.custo_dre_vDas = parseFloat(cDre[7].valor).toFixed(2).toString();
                    item.custo_dre_pDas = parseFloat(cDre[7].percentual).toFixed(2).toString();
                    item.custo_dre_vPisCofins = parseFloat(cDre[8].valor).toFixed(2).toString();
                    item.custo_dre_pPisCofins = parseFloat(cDre[8].percentual).toFixed(2).toString();
                    item.custo_dre_vReceitaLiquida = parseFloat(cDre[9].valor).toFixed(2).toString();
                    item.custo_dre_pReceitaLiquida = parseFloat(cDre[9].percentual).toFixed(2).toString();
                    item.custo_dre_vCustoCmvCpv = parseFloat(cDre[10].valor).toFixed(2).toString();
                    item.custo_dre_pCustoCmvCpv = parseFloat(cDre[10].percentual).toFixed(2).toString();
                    item.custo_dre_vLucroBruto = parseFloat(cDre[11].valor).toFixed(2).toString();
                    item.custo_dre_pLucroBruto = parseFloat(cDre[11].percentual).toFixed(2).toString();
                    item.custo_dre_vDespesasDeVenda = parseFloat(cDre[12].valor).toFixed(2).toString();
                    item.custo_dre_pDespesasDeVenda = parseFloat(cDre[12].percentual).toFixed(2).toString();
                    item.custo_dre_vLucroLiquido = parseFloat(cDre[13].valor).toFixed(2).toString();
                    item.custo_dre_pLucroLiquido = parseFloat(cDre[13].percentual).toFixed(2).toString();

                    lista.push(item);
                });
            });

            return lista;
        }
    },

    watch: {},

};
</script>

<style lang="less">
label {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Cores */
:root {
    --cor-0: #ffffff;
    --cor-1: #2e354c;
    --cor-2: #febd11;
    --cor-3: #826310;
    --cor-4: #e2b12d;
    --cor-5: #fbc535;
    --cor-6: #ff4747;
    --cor-7: #f8f8f8;
    --cor-8: #707070;
    --cor-9: #ededed;
    --cor-10: #000000;
    --cor-11: #505356;
    --cor-12: #e7edf8;
    --cor-13: #d5dce4;
}

.cor0 {
    color: var(--cor-0);
}

.cor1 {
    color: var(--cor-1);
}

.cor2 {
    color: var(--cor-2);
}

.cor3 {
    color: var(--cor-3);
}

.cor4 {
    color: var(--cor-4);
}

.cor5 {
    color: var(--cor-5);
}

.cor6 {
    color: var(--cor-6);
}

.cor7 {
    color: var(--cor-7);
}

.cor8 {
    color: var(--cor-8);
}

.cor9 {
    color: var(--cor-9);
}

.cor10 {
    color: var(--cor-10);
}

.cor11 {
    color: var(--cor-11);
}

.cor12 {
    color: var(--cor-12);
}

.cor13 {
    color: var(--cor-13);
}

/* Tipografia */
.font-1-xl {
    font-weight: 700;
    font-size: 36px;
}

.font-1-l {
    font-weight: 400;
    font-size: 30px;
}

.font-1-l-bold {
    font-weight: 900;
    font-size: 30px;
}

.font-1-m {
    font-weight: 400;
    font-size: 24px;
}

.font-1-s-bold {
    font-weight: 900;
    font-size: 15px;
}

.font-1-s {
    font-weight: 700;
    font-size: 15px;
}

.icon {
    display: flex;
    font-size: 18px;
}

.icon i {
    place-self: end;
    padding-bottom: 5px;
    margin-left: auto;
    margin-right: auto;
}

.icon-large {
    font-size: 25px;
}

.icon-large i {
    color: var(--cor-1);
}

.icon-delete {
    color: var(--cor-6);
}

.row-perfil-fornec {
    display: flex;
    align-items: center;
}

.chk {
    margin-left: 5px;
    margin-bottom: 0.4rem;
}

.row-detalhes {
    margin: 0px 15px;
}

.td-resultado {
    border: none !important;
    padding: 0px !important;
}

.tr-regular td {
    font-weight: normal;
}

.icones-acoes i {
    margin: 5px;
}

.selecionado {
    background-color: var(--cor-12);
}

.expande-resultado {
    width: 100%;
    color: white;
}

.ico-minimize,
.ico-maximize {
    float: right;
    margin-right: 10px;
}

.ico-maximize {
    margin-top: 5px;
}

.modal-content {
    background-color: var(--cor-7);
}
</style>
