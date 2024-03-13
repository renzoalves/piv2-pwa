<template>
<LayoutSidebar>
    <ChatWhatsapp :assinante="true"></ChatWhatsapp>
    <div v-if="processando" id="loading">
        <img id="loading-image" src="@/assets/images/processando.gif" />
    </div>
    <div class="container-fluid">
        <!-- Alerta de mensagens não lida -->
        <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="mensagemNaoLida">
            <strong>Você possui mensagens não lidas.</strong>

            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <!-- Tabs -->
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
                <a class="nav-link active" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">Informações</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="plans-tab" data-toggle="tab" href="#plans" role="tab" aria-controls="plans" aria-selected="false" @click="BuscarDadosSolucoes()">Planos</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="users-tab" data-toggle="tab" href="#users" role="tab" aria-controls="users" aria-selected="false" @click="BuscarUsuariosVinculados()">Usuários Vinculados</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="notifications-tab" data-toggle="tab" href="#notifications" role="tab" aria-controls="notifications" aria-selected="false" @click="Notificacoes">Notificações</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false" @click="BuscarPerfis()">Perfis Tributário</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="remitte-tab" data-toggle="tab" href="#remitte" role="tab" aria-controls="remitte" aria-selected="false" @click="BuscarDestinatario">Destinatários</a>
            </li>
        </ul>
        <div class="tab-content card card-account" id="myTabContent">
            <!-- Minhas Informações -->
            <div class="tab-pane fade show active card-body" id="info" role="tabpanel" aria-labelledby="info-tab">
                <div class="row">
                    <div class="col-md-6">
                        <label for="txtNome">Nome</label>
                        <input class="form-control" type="text" v-model="nome" name="nome" id="txtNome" placeholder="Digite seu nome..." maxlength="40" />
                    </div>
                    <div class="col-md-6">
                        <label for="txtSobrenome">Sobrenome</label>
                        <input class="form-control" type="text" v-model="sobrenome" name="sobrenome" id="txtSobrenome" placeholder="Digite seu sobrenome..." maxlength="40" />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <label for="txtEmail">E-mail</label>
                        <input class="form-control" type="email" v-model="email" name="email" id="txtEmail" placeholder="Digite seu email..." maxlength="60" disabled />
                    </div>
                    <div class="col-md-2">
                        <label for="cbUfs">UF</label>
                        <select class="form-control" v-model="uf" name="uf" id="cbUfs">
                            <option v-for="item in ufs" :key="item">
                                {{ item }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="txtAssunto">Telefone</label>
                        <input class="form-control" type="text" v-model="telefone" name="telefone" placeholder="Digite seu telefone..." id="telefone" maxlength="14" />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-2">
                        <label for="txtCnpjCpf">CNPJ</label>
                        <input class="form-control" type="text" v-model="cnpjcpf" name="txtCnpjCpf" id="txtCnpjCpf" placeholder="CNPJ(apenas números)..." maxlength="14" />
                    </div>
                    <div class="col-md-4">
                        <label for="cbSegmento">Segmento</label>
                        <select class="form-control" name="cbSegmento" v-model="segmento" id="cbSegmento">
                            <option v-for="i in lstSegmento" v-bind:key="i.segmentId">
                                {{ i.segmentId }} - {{ i.segmentDescription }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="txtEmpresa">Empresa</label>
                        <input class="form-control" type="text" v-model="empresa" name="empresa" id="txtEmpresa" placeholder="Digite o nome da empresa..." maxlength="50" />
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-12 info-actions">
                        <button class="geral-button primary" @click="AbrirModal('#modalEncerrar')">
                            Encerrar Conta
                        </button>
                        <button class="geral-button" @click="AbrirModal('#modalAlterarSenha')">
                            Alterar Senha
                        </button>
                        <button class="geral-button" @click="AtualizarUsuario()">
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
            <!-- Minhas Soluções -->
            <div class="tab-pane fade card-body" id="plans" role="tabpanel" aria-labelledby="plans-tab">
                <div v-if="!possuiSolucoes" class="alert alert-warning alert-dismissible" role="alert">
                    Você não possui nenhuma solução contratada nesse momento :(
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="row" v-if="mostrarDadosPlanos">
                    <div class="col-md-12">
                        <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                            <thead>
                                <tr class="text-center">
                                    <th>Descrição</th>
                                    <th>Data Cadastro</th>
                                    <th>Data Expiração</th>
                                    <th>Plano Cadastrado</th>
                                    <th v-if="userStore.user.type === 'G'">Editar Plano</th>
                                    <th v-if="userStore.user.type === 'G'">Contrato</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(i, index) in dadosSolucoes" v-bind:key="index">
                                    <td class="text-center">{{ i.solu_descricao }}</td>
                                    <td class="text-center">
                                        {{ i.usus_dtcad.substring(0, 10) }}
                                    </td>
                                    <td class="text-center">
                                        {{ i.usus_dtexp.substring(0, 10) }}
                                    </td>
                                    <td class="text-center" v-if="i.usus_plan_descricao">
                                        {{ i.usus_plan_descricao }}
                                        <i class="fas fa-info-circle" v-bind:title="
                          i.usus_plan_limite_lote < 0
                            ? 'Esse plano tem direito a Consultas em Lote ilimitadas.'
                            : 'Esse plano tem direito a ' +
                              i.usus_plan_limite_lote +
                              ' Consultas em Lote por mês.'
                        " style="color: steelblue">
                                        </i>
                                    </td>
                                    <td class="text-center" v-else>-</td>
                                    <td class="text-center" v-if="userStore.user.type === 'G'">
                                        <i class="fas fa-pencil-alt mouseHand" style="cursor: pointer" title="Clique para ser direcionado para o painel de Soluções" @click="Solucoes(i.usus_solu_id)">
                                        </i>
                                    </td>
                                    <td class="text-center" v-if="userStore.user.type === 'G'">
                                        <i class="fas fa-file-signature" style="cursor: pointer" title="Clique para fazer o download do contrato." @click="VerContrato(i.usus_pagto_uuid)"></i>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <!-- Usuários Vinculados -->
            <div class="tab-pane fade card-body" id="users" role="tabpanel" aria-labelledby="users-tab">
                <div v-if="userStore.user.type === 'G'">
                    <div v-if="!possuiUsuariosVinculados" class="alert alert-warning alert-dismissible" role="alert">
                        Você não possui usuário vinculado :(
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div v-if="saldoLicencas.length > 0">
                        <div v-for="licenca in saldoLicencas" :key="licenca.soluId">
                            <div class="alert alert-success" v-if="licenca.planLicencas == -1 || licenca.planLicencas == 0">
                                {{ licenca.soluId }} | {{ licenca.soluDescricao }} -
                                {{ licenca.planDescricao }}:
                                {{ licenca.msgLicencas }}
                            </div>
                            <div v-else>
                                <div class="alert alert-success" v-if="licenca.saldoLicencas > 0">
                                    {{ licenca.soluId }} | {{ licenca.soluDescricao }} -
                                    {{ licenca.planDescricao }}: {{ licenca.saldoLicencas }}
                                    {{ licenca.msgLicencas }}
                                </div>
                                <div class="alert alert-warning" v-else>
                                    Não há licenças disponíveis para o seu usuário.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="alert alert-warning" v-else>
                        Não há licenças disponíveis para o seu usuário.
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-center">Código Usuário</th>
                                        <th class="text-center">Data Vinculação</th>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>CNPJ</th>
                                        <th class="text-center">Status</th>
                                        <th class="text-center">Detalhes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(i, index) in dadosUsuariosVinculados" v-bind="index" :key="i">
                                        <td class="text-center">{{ i.usuv_usua_id }}</td>
                                        <td class="text-center">{{ i.usuv_dtvinc }}</td>
                                        <td>
                                            {{ i.usua_nome }}
                                            <span v-if="i.usuv_usersolicgestao == 'S' && i.usua_cnpjcpf">
                                                <i class="fas fa-exclamation-circle" style="color: red; cursor: pointer" title="Este usuário está requerendo a gestão dessa conta. Acesse: Detalhes > Transferir Gestão."></i>
                                            </span>
                                        </td>
                                        <td>{{ i.usua_email }}</td>
                                        <td class="text-center">{{ i.usua_cnpjcpf }}</td>
                                        <td class="text-center">
                                            {{ ConverterStatus(i.usua_status) }}
                                        </td>
                                        <td class="text-center">
                                            <i class="fas fa-search mouseHand" v-on:click="
                            ConsultarDetalhesUsuarioVinculado(
                              i.usuv_usua_id,
                              i.usuv_usersolicgestao
                            )
                          " style="cursor: pointer"></i>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <button class="geral-button" v-on:click="
                    LimparDadosUsuarioVinculado();
                    AbrirModal('#modalAdicionarUsuario');
                  " v-if="saldoLicencas.length > 0">
                                Novo Usuário
                            </button>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="alert alert-warning" role="alert">
                        Apenas usuários gestores podem adicionar/vincular usuários.
                    </div>

                    <button class="geral-button" @click="RequisitarGestao()" v-if="userStore.user.idGestor > 0">
                        Requisitar Gestão
                    </button>
                </div>
            </div>
            <!-- Notificações -->
            <div class="tab-pane fade card-body" id="notifications" role="tabpanel" aria-labelledby="notifications-tab">
                <div v-if="qtdeNotificacoes <= 0" class="alert alert-warning alert-dismissible" role="alert">
                    Você não possui notificações.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="row ml-2 mr-2 mb-3">
                            <button class="geral-button" @click="nota_condicional = nota_condicional == 1 ? 0 : 1">
                                {{
                    nota_condicional == 1 ? "Mostrar Tudo" : "Somente Não Lidos"
                  }}
                            </button>
                        </div>
                        <div v-for="nota in notificacoes" :key="nota.id" title="Clique para gerenciar a mensagem de notificação." @click="
                  notificacao = nota;
                  AbrirModal('#modalNotificacao');
                " style="cursor: pointer">
                            <div v-if="nota_condicional == 1 ? !nota.not_lido : true" :class="
                    nota.not_lido
                      ? onClassNotificationsRead
                      : onClassNotifications
                  ">
                                <div class="col-12">
                                    {{ nota.not_dt_criacao }} - {{ nota.not_hr_criacao }}h
                                </div>

                                <div class="col-12">
                                    {{ nota.not_id }} - {{ nota.not_descricao }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Perfis Tributário -->
            <div class="tab-pane fade card-body" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div v-if="!possuiPerfilConfigurado" class="alert alert-warning alert-dismissible" role="alert">
                    Você não possui perfil configurado :(
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered" v-if="possuiPerfilConfigurado">
                    <thead>
                        <tr>
                            <th class="text-center">#</th>
                            <th>Nome</th>
                            <th class="text-center">UF</th>
                            <th class="text-center">Atividade</th>
                            <th class="text-center">Regime Tributário</th>
                            <th class="text-center">CFOP</th>
                            <th class="text-center">Receita Bruta (R$)</th>
                            <th class="text-center">Dt. Últ. Atualização</th>
                            <th class="text-center">Data Vigência</th>
                            <th class="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i, index) in perfis" v-bind:key="index">
                            <td :class="{ selecionado: idPrincipal === index }" class="text-center" v-on:click="TrocarPerfilPrincipal(index)">
                                <i class="fas fa-star"></i>
                            </td>
                            <td>{{ i.prfApelido }}</td>
                            <td class="text-center">{{ i.prfUF }}</td>
                            <td class="text-center">{{ i.prfTypeCnae }}</td>
                            <td class="text-center">{{ DefCaracTrib(i.prfTaxRegime) }}</td>
                            <td class="text-center">{{ i.prfCfop }}</td>
                            <td class="text-center">{{ i.prfRecBruta }}</td>
                            <td class="text-center">{{ i.prfDtUltRec }}</td>
                            <td class="text-center">
                                {{ ConverterDataBr(dataVigencia) }}
                            </td>
                            <td class="text-center icones-acoes">
                                <i class="fa fa-pencil color-icon-edit" v-on:click="
                      AlterarPerfil(index);
                      AbrirModal('#profileModal');
                    "></i>
                                <i class="fas fa-trash color-icon-delete" v-on:click="
                      DefineIndexPerfil(index);
                      AbrirModal('#modalExcluirPerfil');
                    "></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button class="geral-button" v-on:click="
              NovoPerfil();
              AbrirModal('#profileModal');
            ">
                    Novo Perfil
                </button>
            </div>
            <!-- Destinatário -->
            <div class="tab-pane fade card-body" id="remitte" role="tabpanel" aria-labelledby="remitte-tab">
                <div v-if="!possuiDestinatarios" class="alert alert-warning alert-dismissible" role="alert">
                    Você não possui destinatário(s) configurado :(
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <table class="table table-divider table-striped table-sm table-responsive-lg table-bordered" v-if="possuiDestinatarios">
                    <thead>
                        <tr class="text-center">
                            <th>Perfil</th>
                            <th>UF</th>
                            <th>Subst. ICMS</th>
                            <th>Finalidade</th>
                            <th>Operação</th>
                            <th>Margem Líquida %</th>
                            <th>Frete %</th>
                            <th>Comissão %</th>
                            <th>Outras Desp. %</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(i, index) in destinatarios" v-bind:key="i.index">
                            <td class="text-center">{{ caracTrib[i.perfil].text }}</td>
                            <td class="text-center">{{ i.uf }}</td>
                            <td class="text-center">{{ i.substICMS == 'S' ? "Sim" : "Não" }}</td>
                            <td class="text-center">{{ destMerc[i.finalidade].text }}</td>
                            <td class="text-center">{{ destOperacao[i.operacao].text }}</td>
                            <td class="text-center">{{ i.margem }}</td>
                            <td class="text-center">{{ i.frete }}</td>
                            <td class="text-center">{{ i.comissao }}</td>
                            <td class="text-center">{{ i.outrasDespesas }}</td>
                            <td class="text-center icones-acoes">
                                <i class="fa fa-pencil color-icon-edit" v-on:click="
                      AlterarDestinatario(index);
                      AbrirModal('#remitteeModal');
                    "></i>
                                <i class="fas fa-trash color-icon-delete" v-on:click="
                      DefineIndexDestinatario(index);
                      AbrirModal('#modalExcluirDestinatario');
                    "></i>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button class="geral-button" v-on:click="NovoDestinatario();AbrirModal('#remitteeModal');">
                    Novo Destinatário
                </button>
            </div>
        </div>

        <!-- Modal Encerrar Conta (obsoleto?) -->
        <div class="modal" tabindex="-1" role="dialog" id="modalEncerrar">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Encerrar Conta</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="LimparModal()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            Tem certeza que deseja encerrar sua conta? <br />
                            Agradecemos por esse tempo que esteve conosco. <br />
                            Se estiver com dúvida sobre algo, por favor, entre em contato,
                            estamos à disposição :)
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="geral-button danger" v-on:click="AbrirModal('#modalEncerrarConta')" data-dismiss="modal">
                            Sim, desejo encerrar.
                        </button>
                        <button type="button" class="geral-button" v-on:click="EntrarContato()" data-dismiss="modal">
                            Não, desejo entrar em contato com um representante.
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Encerrar Conta -->
        <div class="modal" tabindex="-1" role="dialog" id="modalEncerrarConta">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Encerrar Conta</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="LimparModal()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <strong>Aviso:</strong> se você encerrar a conta seus dados
                            pessoais serão apagados, qualquer dúvida estamos a disposição.
                        </p>
                        <p>
                            Caso você tenha certeza que deseja encerrar sua conta e apagar
                            todos seus dados, por favor, marque a opção abaixo e preencha
                            sua senha atual.
                        </p>

                        <label class="p-0 m-0" for="textObservacoes">Sinta-se a vontade para nos deixar uma mensagem, caso ache
                            necessário. (opcional)</label>
                        <textarea class="mt-3 textAreaFeedback" id="textObservacoes" name="textObservacoes" rows="9" resize="none" maxlength="500" v-model="observacao" placeholder="">
              </textarea>
                        <p class="text-right">
                            Caracteres restantes:
                            {{ this.qtdeCaracteres - this.observacao.length }}
                        </p>

                        <div class="row">
                            <div class="col-md-6">
                                <input type="checkbox" id="chkEncerrarConta" v-model="confirmacao" />
                                <label for="chkEncerrarConta">Tenho certeza que desejo encerrar.</label>
                            </div>
                            <div class="col-md-6">
                                <input class="w-100" type="password" placeholder="Digite sua senha..." v-model="senhaModal" />
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btnModalGeral" data-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-sm btnStyleEncerrar" v-on:click="Encerrar()">
                            Encerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Alterar Senha -->
        <div class="modal" tabindex="-1" role="dialog" id="modalAlterarSenha">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Alterar Senha</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="LimparCamposAlteracao()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row form-group">
                            <div class="col-md-6">
                                <label for="txtSenhaAtual">Senha Atual:</label>
                                <input id="txtSenhaAtual" v-bind:type="tipoCampo" class="form-control" maxlength="12" v-model="senhaAtual" />
                            </div>
                        </div>
                        <div class="row form-group">
                            <div class="col-md-6">
                                <label for="txtNovaSenha">Nova Senha:</label>
                                <input id="txtNovaSenha" v-bind:type="tipoCampo" class="form-control" maxlength="12" v-model="novaSenha" />
                            </div>
                            <div class="col-md-6">
                                <label for="txtConfirmarSenha">Confirmar Senha:</label>
                                <input id="txtConfirmarSenha" v-bind:type="tipoCampo" class="form-control" maxlength="12" v-model="confirmarSenha" />
                            </div>
                        </div>

                        <button class="btn btn-secondary btn-sm" v-on:click.prevent.stop="MostrarSenha()">
                            <i v-bind:class="classeEye"></i>
                            {{ classeEye == "fa fa-eye" ? "Mostrar" : "Ocultar" }}
                            Senhas
                        </button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm geral-button" v-on:click="Alterar()">
                            Confirmar Alteração
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL DETALHES -->
        <div class="modal fade bd-example-modal-lg" id="modal-detalhes" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <template>
                            <h5 class="modal-title" id="exampleModalLongTitle">
                                DETALHES DO USUÁRIO:
                                {{ detalhesUsuarioAtualVinculado.usua_email }}
                            </h5>
                        </template>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="FecharModal('#modal-detalhes')">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body text-center">
                        <!-- CABEÇALHO -->
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" data-toggle="tab" href="#detalhes" role="tab" aria-controls="profile">Detalhes</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" data-toggle="tab" href="#planos" role="tab" aria-controls="messages">Planos</a>
                            </li>
                            <li class="nav-item" v-if="detalhesUsuarioAtualVinculado.usua_status == 'N'">
                                <a class="nav-link" data-toggle="tab" href="#excluir" role="tab" aria-controls="messages">Excluir Usuário Vinculado</a>
                            </li>
                            <li :class="
                    GetClassTransferManagement(detalhesUsuarioAtualVinculado)
                  " v-if="detalhesUsuarioAtualVinculado.usua_status == 'N'">
                                <a class="nav-link" data-toggle="tab" href="#transferir" role="tab" aria-controls="messages">Transferir Gestão</a>
                            </li>
                        </ul>

                        <!-- CONTEUDO -->
                        <div class="tab-content">
                            <!-- Detalhes -->
                            <div id="detalhes" class="tab-pane active overflow-auto table-responsive-sm table-responsive-md table-responsive-lg" role="tabpanel">
                                <br />
                                <br />
                                <table class="table table-sm table-bordered tableDetails" id="tableDetalhes" v-if="detalhesUsuarioAtualVinculado.usua_nome != undefined">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Sobrenome</th>
                                            <th>E-mail</th>
                                            <th>UF</th>
                                            <th>Telefone</th>
                                            <th>CNPJ</th>
                                            <th>Empresa</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                {{
                            FirstLetterUpper(
                              detalhesUsuarioAtualVinculado.usua_nome
                            )
                          }}
                                            </td>
                                            <td>
                                                {{
                            FirstLetterUpper(
                              detalhesUsuarioAtualVinculado.usua_sobrenome
                            )
                          }}
                                            </td>
                                            <td>{{ detalhesUsuarioAtualVinculado.usua_email }}</td>
                                            <td>{{ detalhesUsuarioAtualVinculado.usua_uf }}</td>
                                            <td>
                                                {{ detalhesUsuarioAtualVinculado.usua_telefone }}
                                            </td>
                                            <td>
                                                {{ detalhesUsuarioAtualVinculado.usua_cnpjcpf }}
                                            </td>
                                            <td>
                                                {{
                            FirstLetterUpper(
                              detalhesUsuarioAtualVinculado.usua_empresa
                            )
                          }}
                                            </td>
                                            <td>
                                                {{
                            ConverterStatus(
                              detalhesUsuarioAtualVinculado.usua_status
                            )
                          }}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Planos -->
                            <div class="tab-pane" id="planos" role="tabpanel">
                                <br />
                                <br />
                                <div v-if="detalhesPlanoUsuarioAtualVinculado.length > 0" class="overflow-auto table-responsive">
                                    <table class="table table-sm table-bordered tableDetails" id="tablePlanos" v-if="detalhesPlanoUsuarioAtualVinculado.length > 0">
                                        <thead>
                                            <tr>
                                                <th>Descição</th>
                                                <th>Data Cadastro</th>
                                                <th>Data Expiração</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(
                            i, index
                          ) in detalhesPlanoUsuarioAtualVinculado" :key="index">
                                                <td v-if="JaExpirado(i.usus_dtexp)">
                                                    <s>{{ i.solu_descricao }}</s>
                                                </td>
                                                <td v-else>{{ i.solu_descricao }}</td>
                                                <td class="text-center" v-if="JaExpirado(i.usus_dtexp)">
                                                    <s>{{ i.usus_dtcad.substring(0, 10) }}</s>
                                                </td>
                                                <td class="text-center" v-else>
                                                    {{ i.usus_dtcad.substring(0, 10) }}
                                                </td>
                                                <td class="text-center" v-if="JaExpirado(i.usus_dtexp)">
                                                    <s>{{ i.usus_dtexp.substring(0, 10) }}</s>
                                                </td>
                                                <td class="text-center" v-else>
                                                    {{ i.usus_dtexp.substring(0, 10) }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div v-else>
                                    <p>
                                        O usuário selecionado não possui nenhum plano cadastrado.
                                    </p>
                                </div>
                            </div>

                            <!-- Excluir (cliente vinculado) -->
                            <div class="tab-pane" id="excluir" role="tabpanel" v-if="detalhesUsuarioAtualVinculado.usua_status == 'N'">
                                <br />
                                <br />
                                <div class="overflow-auto text-left">
                                    <div class="alert alert-danger" role="alert">
                                        Você deseja realmente excluir o usuário vinculado
                                        <span class="alert-link">
                                            {{ detalhesUsuarioAtualVinculado.usua_email }}
                                        </span>
                                        ?

                                        <div class="row mt-1">
                                            <div class="col-md-6 mt-2">
                                                <input class="form-control-sm w-100" type="password" placeholder="Digite sua senha..." v-model="senhaConfirmarExclusao" />
                                            </div>

                                            <div class="col-md-6 mt-2">
                                                <button class="btn btn-sm btn-danger" @click="
                              VerificarSenha(
                                senhaConfirmarExclusao,
                                2,
                                GerarObjetoEnvio(
                                  '',
                                  detalhesUsuarioAtualVinculado.usua_id,
                                  detalhesUsuarioAtualVinculado.usua_email
                                )
                              );
                              FecharModal('#modal-detalhes');
                            ">
                                                    Confirmar Exclusão
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tranferir gestão -->
                            <div class="tab-pane" id="transferir" role="tabpanel" v-if="detalhesUsuarioAtualVinculado.usua_status == 'N'">
                                <br />
                                <br />
                                <div class="overflow-auto text-left">
                                    <div class="alert alert-warning" role="alert">
                                        Essa ação irá transferir todos os direitos de gestão e
                                        controle para o usuário
                                        <span class="alert-link">
                                            {{ detalhesUsuarioAtualVinculado.usua_email }} </span>.

                                        <div class="row mt-1">
                                            <div class="col-md-6 mt-2">
                                                <input class="form-control-sm w-100" type="password" placeholder="Digite sua senha..." v-model="senhaConfirmarTransferencia" />
                                            </div>

                                            <div class="col-md-6 mt-2">
                                                <button class="btn btn-sm btn-warning" @click="
                              VerificarSenha(
                                senhaConfirmarTransferencia,
                                3,
                                GerarObjetoEnvio(
                                  '',
                                  detalhesUsuarioAtualVinculado.usua_id,
                                  detalhesUsuarioAtualVinculado.usua_email
                                )
                              );
                              FecharModal('#modal-detalhes');
                            ">
                                                    Confirmar Transferência
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="geral-button" data-dismiss="modal" v-on:click="FecharModal('#modalAdicionar')">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL NOVO USUÁRIO VINCULADO -->
        <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" id="modalAdicionarUsuario">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Adicionar Usuário</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="LimparDadosUsuarioVinculado()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row form-group">
                                <div class="col-md-6">
                                    <label for="txtNome">Nome</label>
                                    <input class="form-control" type="text" v-model="nomeUsuarioVinculado" name="nomeUsuarioVinculado" placeholder="Digite seu nome..." maxlength="40" />
                                </div>
                                <div class="col-md-6">
                                    <label for="txtSobrenome">Sobrenome</label>
                                    <input class="form-control" type="tel" v-model="sobrenomeUsuarioVinculado" name="sobrenomeUsuarioVinculado" placeholder="Digite seu sobrenome..." maxlength="40" />
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-md-6">
                                    <label for="txtEmail">Email</label>
                                    <input class="form-control" type="emailUsuarioVinculado" v-model="emailUsuarioVinculado" name="emailUsuarioVinculado" placeholder="Digite seu email..." maxlength="60" />
                                </div>
                                <div class="col-md-2">
                                    <label for="cbUfs">UF</label>
                                    <select class="form-control" v-model="ufUsuarioVinculado" name="ufUsuarioVinculado">
                                        <option v-for="item in ufs" :key="item">
                                            {{ item }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-4">
                                    <label for="txtAssunto">Telefone</label>
                                    <input class="form-control" type="text" v-model="telefoneUsuarioVinculado" name="telefone" placeholder="Digite seu telefone..." id="telefoneUsuarioVinculado" onkeydown="FormatarTelefone()" maxlength="11" />
                                </div>
                            </div>
                            <div class="row form-group">
                                <div class="col-md-6">
                                    <label for="txtCNPJ">CNPJ</label>
                                    <input class="form-control" type="text" v-model="cnpjUsuarioVinculado" name="cnpjUsuarioVinculado" placeholder="Digite o CNPJ..." />
                                </div>
                                <div class="col-md-6">
                                    <label for="txtEmpresa">Empresa</label>
                                    <input class="form-control" type="text" v-model="empresaUsuarioVinculado" name="empresaUsuarioVinculado" placeholder="Digite o nome da empresa..." maxlength="50" />
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col-md-6">
                                    <label for="cbSegmentoVinculado">Segmento</label>
                                    <select class="form-control" v-model="segmentoVinculado">
                                        <option v-for="s in lstSegmento" v-bind:key="s.segmentId">
                                            {{ s.segmentId }} - {{ s.segmentDescription }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="row form-group mt-4">
                                <div class="col-md-12">
                                    <input type="checkbox" id="chkAceite" v-model="checkAceite" />
                                    <label for="chkAceite">Eu concordo que os dados aqui fornecidos serão utilizados
                                        para consultoria tributária, geração de logs e
                                        estatísticas.</label>
                                    <p>
                                        Eu concordo que os dados fornecidos via cadastro, sejam
                                        armazenados e processados para o propósito de receber
                                        consultoria tributária e suporte online.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="geral-button primary" data-dismiss="modal" v-on:click="LimparDadosUsuarioVinculado()">
                            Cancelar
                        </button>
                        <button type="button" class="geral-button" v-on:click="RegistrarUsuarioVinculado()">
                            Registrar
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Consulta de Notificação -->
        <div class="modal fade bd-example-modal-lg" id="modalNotificacao" tabindex="-1" role="dialog" aria-labelledby="TituloModalCentralizado" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Notificação #{{ notificacao.not_id }}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <form>
                            <!-- Mensagem da Notificação -->
                            <div class="row form-group">
                                <div class="col-md-12">
                                    <h6>{{ notificacao.not_descricao }}</h6>
                                </div>
                            </div>

                            <div class="row form-group">
                                <div class="col-md-12">
                                    <h6>
                                        <input type="checkbox" id="chkLido" v-model="marcarComoLido" />
                                        <label for="chkLido">Marcar como lido.</label>
                                    </h6>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div class="modal-footer">
                        <footer class="blockquote-footer">
                            Enviada em {{ notificacao.not_dt_criacao }} às
                            {{ notificacao.not_hr_criacao }}h
                        </footer>

                        <button type="button" class="geral-button" data-dismiss="modal" v-on:click="MarcarComoLido(notificacao)">
                            Ok
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Excluir perfil -->
        <div class="modal" tabindex="-1" role="dialog" id="modalExcluirPerfil">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Excluir Perfil</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="LimparModal()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p v-if="!principal" style="font-size: 16px">
                            Tem certeza que deseja excluir esse perfil?
                        </p>
                        <p v-if="principal" style="font-size: 16px">
                            Não é possível excluir o perfil principal, defina outro
                            principal antes de excluir.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" v-if="!principal" class="geral-button primary" data-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="geral-button" data-dismiss="modal" v-if="principal">
                            OK
                        </button>
                        <button type="button" v-if="!principal" class="geral-button" v-on:click="ExcluirPerfil()">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- VIEW/EDIT PROFILE-->
        <div class="modal fade bd-example-modal-lg" id="profileModal" tabindex="-1" role="dialog" aria-labelledby="TituloModalCentralizado" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <!-- Modal-Header -->
                    <div class="modal-header">
                        <h5 class="modal-title" id="TituloModalCentralizado">
                            Configurar Perfil
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar" @click="this.mostrarModalPerfil = false">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- Modal-Body -->
                    <div class="modal-body">
                        <TaxProfile :ufs="ufs" :ctribs="Tribs" :p_perfil="perfil" :index="idxPerfil" v-on:emit-perfil="BuscarPerfis" v-if="mostrarModalPerfil" />
                    </div>
                </div>
            </div>
        </div>

        <!-- VIEW/EDIT REMITTEE-->
        <div class="modal fade bd-example-modal-lg" id="remitteeModal" tabindex="-1" role="dialog" aria-labelledby="TituloModalCentralizado" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                    <!-- Modal-Header -->
                    <div class="modal-header">
                        <h5 class="modal-title" id="TituloModalCentralizado">
                            Destinatário
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <!-- Modal-Body -->
                    <div class="modal-body">
                        <TaxRemittee v-if="mostrarModalDestinatario" :ufs="ufs" :key="chaveDestinatario" :p_destinatario="destinatario" :index="idxDestinatario" v-on:emit-destinatario="BuscarDestinatario" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Excluir destinatario -->
        <div class="modal" tabindex="-1" role="dialog" id="modalExcluirDestinatario">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Excluir Destinatário</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="LimparModal()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p style="font-size: 16px">
                            Tem certeza que deseja excluir o destinatário?
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btnModalGeral" data-dismiss="modal">
                            Cancelar
                        </button>
                        <button type="button" class="btn btn-sm btnStyleEncerrar" v-on:click="ExcluirDestinatario()">
                            Excluir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</LayoutSidebar>
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
import TaxRemittee from "@/components/TaxRemittee.vue";

export default {
    data() {
        return {
            showTaxProfileModal: false,
            nota_condicional: 1,
            onClassNotifications: "row alert alert-danger ml-2 mr-2",
            onClassNotificationsRead: "row alert alert-success ml-2 mr-2",
            processando: false,
            userStore: useAuthStore(),

            // Campos
            nome: "",
            sobrenome: "",
            email: "",
            uf: "",
            telefone: "",
            cnpjcpf: "",
            segmento: "",
            lstSegmento: [],
            empresa: "",

            // Encerrar conta
            senhaModal: "",
            qtdeCaracteres: 500,
            observacao: "",
            confirmacao: false,

            dataVigencia: new Date().toISOString().slice(0, 10),
            possuiSolucoes: false,
            possuiUsuariosVinculados: false,

            mostrarDadosPlanos: false,
            mostrarDadosVinculados: false,

            detalhesPlanoUsuarioAtualVinculado: [],
            nomeUsuarioVinculado: "",
            sobrenomeUsuarioVinculado: "",
            telefoneUsuarioVinculado: "",
            ufUsuarioVinculado: "SP",
            emailUsuarioVinculado: "",
            segmentoVinculado: "",
            cnpjUsuarioVinculado: "",
            empresaUsuarioVinculado: "",
            checkAceite: false,

            notificacoes: [],
            qtdeNotificacoes: 0,
            mensagemNaoLida: false,

            // Perfis
            perfis: [],
            perfil: {},
            idPrincipal: 0,
            idxPerfil: -1,
            perfilPrincipal: false,
            mostrarModalPerfil: false,
            possuiPerfilConfigurado: false,
            principal: false,

            // Destinatários
            possuiDestinatarios: false,
            mostrarDadosDestinatario: false,
            mostrarModalDestinatario: false,
            destinatarios: [],
            destinatario: {},
            idxDestinatario: 0,
            chaveDestinatario: 0,

            password: true,
            tipoCampo: "password",
            classeEye: "fa fa-eye",
            novaSenha: "",
            confirmarSenha: "",
            senhaAtual: "",
            ufs: helpers.getUFs(),
            Tribs: helpers.getTribs(),
            Cnaes: helpers.getCnaes(),
            dadosSolucoes: [],
            dadosUsuariosVinculados: [],
            detalhesUsuarioAtualVinculado: [],
            saldoLicencas: [],
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
            alertStore: useAlertStore(),

            notificacao: {},
            marcarComoLido: true,
            classAcordeon: "accordion-collapse collapse show",
        };
    },
    methods: {
        AbrirModal(modal) {
            $(modal).modal({
                show: true,
                backdrop: "static",
                keyboard: false,
            });
        },
        FecharModal(modal) {
            $(modal).modal("hide");
        },
        RequisitarGestao() {
            let url = RetUrlAPI() + "RequestTransferManagement";
            let objSend = new Object();
            let manager = new Object();
            let applicant = new Object();

            manager.id = this.userStore.user.idGestor;
            manager.email = this.userStore.user.emailGestor;
            manager.notification = `O usuario (${this.userStore.user.userId}) ${this.userStore.user.mail} requisitou a gestão da conta.`;

            applicant.id = this.userStore.user.userId;
            applicant.email = this.userStore.user.mail;
            applicant.notification =
                "Sua solicitação de gestão foi enviado ao Gestor da conta.";

            objSend.manager = manager;
            objSend.applicant = applicant;

            if (this.userStore.user.type != "N") {
                this.alertStore.error(
                    "Seu tipo de usuário não permite a requisição de gestão"
                );
                return;
            }

            this.processando = true;

            CallPostAsync("usuario", "", url, objSend)
                .then((data) => {
                    if (data.success) {
                        this.processando = false;

                        this.alertStore.success("Requisição enviada para o Gestor.");

                        helpers.GravarLog(
                            "Enviou requisição de gestao da conta.",
                            "minhaconta.html",
                            "RequisitarGestao",
                            "OK",
                            null,
                            "portal"
                        );
                    } else {
                        this.processando = false;
                        helpers.GravarLog(
                            "A solicitação de requisição de gestão falhou.",
                            "minhaconta.html",
                            "RequisitarGestao",
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
                        "ERRO: Requisição de gestão",
                        "minhaconta.html",
                        "RequisitarGestao",
                        data.mensagem,
                        null,
                        "portal"
                    );
                    this.alertStore.error(data.mensagem);
                });
        },
        async TransferirGestao(userVinculado) {
            this.processando = true;
            let url = RetUrlAPI() + "TransferManagement";

            let send = new Object();
            let manager = new Object();
            let applicant = new Object();

            manager.id = this.userStore.user.userId;
            manager.email = this.userStore.user.mail;
            manager.notification = `Gestão da conta transferida para o usuário <${userVinculado.email}>.`;

            applicant.id = userVinculado.userId;
            applicant.email = userVinculado.email;
            applicant.notification = `Gestão da conta recebida do usuário <${manager.email}>.`;

            send.manager = manager;
            send.applicant = applicant;

            CallPostAsync("usuario", "", url, send)
                .then((data) => {
                    if (data.success) {
                        this.processando = false;

                        this.alertStore.success(manager.notification);

                        helpers.GravarLog(
                            "Transferência de gestão da conta",
                            "minhaconta.html",
                            "TransferManagement",
                            this.observacao,
                            null,
                            "portal"
                        );

                        /*this.userStore.user.type = "N";
                        this.userStore.user.idGestor = userVinculado.userId;
                        this.userStore.user.emailGestor = userVinculado.email;*/

                        helpers.LimparTokenSessao(true);
                    } else {
                        this.processando = false;
                        this.alertStore.error(data.message);
                    }
                })
                .catch((reason) => {
                    this.processando = false;
                    this.alertStore.error(reason);
                });
        },
        Encerrar() {
            if (!this.VerificarCampos()) {
                this.alertStore.error("Os dois campos precisam ser preenchidos.");
                return;
            }

            this.VerificarSenha(this.senhaModal, 0);
        },
        async EncerrarConta(userVinculado) {
            this.processando = true;

            let sendUser = this.GerarObjetoEnvio();

            if (userVinculado) sendUser = userVinculado;

            let url = RetUrlAPI() + "CloseAccount";

            CallPostAsync("usuario", "", url, sendUser).then((data) => {
                if (data == "OK") {
                    this.processando = false;

                    helpers.GravarLog(
                        "Encerrou conta",
                        "minhaconta.html",
                        "CloseAccount",
                        this.observacao,
                        null,
                        "portal"
                    );

                    helpers.EnviarEmail(3, this.userStore.user.mail);

                    this.$swal
                        .fire({
                            position: "center",
                            title: "Conta Encerrada",
                            text: "A conta foi encerrada. Para criar uma nova conta, faça o cadastro novamente.",
                            confirmButtonText: "OK",
                        })
                        .then((result) => {
                            if (userVinculado) {
                                this.dadosUsuariosVinculados = this.BuscarUsuariosVinculados();
                                return;
                            } else {
                                // this.userStore.user = { hasAuth: false };
                                helpers.LimparTokenSessao();
                                this.FecharModal("#modalAlterarSenha");
                                router.push("/");
                            }
                        });
                } else {
                    this.alertStore.error(data.message);
                }
            });
        },
        LimparModal() {
            let chkEncerrar = document.getElementById("chkEncerrarConta");

            chkEncerrar.checked = false;

            this.observacao = "";
            this.senhaModal = "";
            this.senhaConfirmarExclusao = "";
            this.senhaConfirmarTransferencia = "";
        },
        AlterarSenha() {
            this.processando = true;

            let userAlterPassword = this.GerarObjetoEnvioAlteracao();

            let url = RetUrlAPI() + "AlterPassword";

            CallPostAsync("usuario", "", url, userAlterPassword).then((data) => {
                if (data == "OK") {
                    this.processando = false;

                    helpers.GravarLog(
                        "Alterou sua senha",
                        "minhaconta.html",
                        "AlterPassword",
                        "OK",
                        null,
                        "portal"
                    );

                    this.alertStore.success("Senha alterada com sucesso!");
                    this.FecharModal("#modalAlterarSenha");
                } else {
                    this.alertStore.error(data.message);
                }
            });
        },
        ConverterStatus(status) {
            switch (status) {
                case "N":
                    return "N (Normal)";
                case "T":
                    return "T (Teste)";
                case "B":
                    return "B (Bloqueado)";
                case "D":
                    return "D (Descadastrado)";
            }
        },
        ConsultarDetalhesUsuarioVinculado(idUsuarioVinculado, userSolicGestao) {
            this.detalhesUsuarioAtualVinculado = [];
            this.detalhesPlanoUsuarioAtualVinculado = [];

            let tokenSessao = this.userStore.user.tokenSession;
            let idGestor = this.userStore.user.userId;

            let url =
                RetUrlAPI() +
                "UserInformations?userID=" +
                idUsuarioVinculado +
                "&sessionToken=" +
                tokenSessao +
                "&idGestor=" +
                idGestor;

            CallGetAsync(url)
                .then((data) => {
                    if (data.userInformations != null) {
                        this.detalhesUsuarioAtualVinculado = data.userInformations;
                        this.detalhesUsuarioAtualVinculado.usua_userSolicGestao =
                            userSolicGestao;

                        this.processando = false;
                    } else {
                        this.detalhesUsuarioAtualVinculado = [];

                        this.processando = false;

                        this.alertStore.error(
                            "Ocorreu um erro ao atualizar os dados, tente novamente!"
                        );
                    }
                })
                .catch((reason) => {
                    this.processando = false;
                });

            url =
                RetUrlAPI() +
                "UserSolutions?userID=" +
                idUsuarioVinculado +
                "&sessionToken=" +
                tokenSessao +
                "&idGestor=" +
                idGestor;

            CallGetAsync(url)
                .then((data) => {
                    if (data.solutions != null) {
                        this.processando = false;
                        this.detalhesPlanoUsuarioAtualVinculado = data.solutions;
                    } else {
                        this.detalhesPlanoUsuarioAtualVinculado = [];
                        this.processando = false;
                    }

                    // Limpa a senha que será usada para exclusão de usuários vinculados.
                    this.senhaConfirmarExclusao = "";
                    this.senhaConfirmarTransferencia = "";
                    $("#modal-detalhes").modal({
                        show: true,
                        backdrop: "static",
                        keyboard: false,
                    });
                })
                .catch((reason) => {
                    this.processando = false;
                });
        },
        BuscarDadosUsuario() {
            let token = this.userStore.user.token;

            let autenticUser = new Object();
            autenticUser.token = token;

            let url = RetUrlAPI() + "UserInformation";

            CallPostAsync("usuario", "", url, autenticUser);
        },
        async BuscarUsuariosVinculados() {
            this.processando = true;

            this.mostrarDadosVinculados = false;
            this.mostrarDadosPlanos = false;

            let data = await this.ObterUsuariosVinculados();

            if (data.linkedUsers.length > 0) {
                this.possuiUsuariosVinculados = true;
                this.dadosUsuariosVinculados = data.linkedUsers;
            } else {
                this.possuiUsuariosVinculados = false;
            }

            // Licenças disponíveis
            if (data.licencas.length > 0) {
                this.saldoLicencas = data.licencas;
            }

            this.mostrarDadosVinculados = true;
            this.processando = false;
        },
        async ObterUsuariosVinculados() {
            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;
            let url =
                RetUrlAPI() +
                "LinkedUsers?userID=" +
                id +
                "&sessionToken=" +
                tokenSessao;

            this.processando = true;

            let data = await CallGetAsync(url)
                .then((data) => {
                    this.processando = false;
                    return data;
                })
                .catch((reason) => {
                    this.processando = false;
                    return [];
                });

            return data;
        },
        BuscarDadosSolucoes() {
            this.processando = true;

            this.mostrarDadosPlanos = false;
            this.mostrarDadosVinculados = false;

            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url =
                RetUrlAPI() +
                "UserSolutions?userID=" +
                id +
                "&sessionToken=" +
                tokenSessao;

            CallGetAsync(url)
                .then((data) => {
                    if (data.solutions != null) {
                        this.processando = false;

                        this.possuiSolucoes = true;

                        this.dadosSolucoes = data.solutions;
                        this.dadosSolucoes.forEach((solution) => {
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

                        this.mostrarDadosPlanos = true;
                    } else {
                        this.processando = false;

                        this.possuiSolucoes = false;
                    }
                })
                .catch((reason) => {
                    this.processando = false;
                });
        },
        AtualizarDadosConta() {
            this.processando = true;

            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url =
                RetUrlAPI() +
                "UserInformations?userID=" +
                id +
                "&sessionToken=" +
                tokenSessao;

            CallGetAsync(url)
                .then((data) => {
                    this.AtualizarFormulario(data.userInformations);
                    this.processando = false;
                })
                .catch((reason) => {
                    this.processando = false;
                    this.alertStore.error(
                        "Ocorreu um erro ao atualizar os dados, tente novamente!"
                    );
                });
        },
        AtualizarUsuario() {
            this.processando = true;

            let telefoneSemMascara = this.telefone
                .replace("(", "")
                .replace(")", "")
                .replace("-", "");

            if (this.segmento != "")
                this.segmento = this.segmento
                .substring(0, this.segmento.indexOf("-"))
                .trim();

            this.cnpjcpf = this.cnpjcpf
                .replaceAll(".", "")
                .replaceAll("-", "")
                .replaceAll("/", "");

            let user = this.DadosUsuario(
                this.nome,
                this.sobrenome,
                this.email,
                this.uf,
                telefoneSemMascara,
                this.empresa,
                this.cnpjcpf,
                this.segmento
            );

            let url = RetUrlAPI() + "UpdateUser";
            CallPostAsync("usuario", "", url, user)
                .then((data) => {
                    if (data == "OK") {
                        this.processando = false;
                        this.alertStore.success("Alteração realizada com sucesso!");
                        helpers.GravarLog(
                            "Alterou seus dados cadastrais",
                            "minhaconta.html",
                            "UpdateUser",
                            "OK",
                            null,
                            "portal"
                        );
                    } else {
                        this.alertStore.error("Não foi possível realizar a alteração.");
                        this.processando = false;
                        helpers.GravarLog(
                            "Alterou seus dados cadastrais",
                            "minhaconta.html",
                            "UpdateUser",
                            data.message,
                            null,
                            "portal"
                        );
                    }
                })
                .catch((reason) => {
                    this.processando = false;

                    let mensagemRetorno =
                        "Não foi possível estabelecer conexão com o servidor.";

                    helpers.GravarLog(
                        "Alterou seus dados cadastrais",
                        "minhaconta.html",
                        "UpdateUser",
                        mensagemRetorno,
                        null,
                        "portal"
                    );

                    this.alertStore.error(mensagemRetorno);
                });
        },
        AtualizarFormulario(dados) {
            this.nome = dados.usua_nome;
            this.sobrenome = dados.usua_sobrenome;
            this.email = dados.usua_email;
            this.uf = dados.usua_uf;
            this.telefone = dados.usua_telefone;
            this.cnpjcpf = dados.usua_cnpjcpf;
            this.empresa = dados.usua_empresa;

            if (this.lstSegmento.length > 0) {
                this.segmento = "";

                if (dados.usua_segmento_id != "") {
                    let segAux = this.lstSegmento.find(
                        (x) => x.segmentId == dados.usua_segmento_id
                    );
                    this.segmento = this.segmentoVinculado =
                        segAux.segmentId + " - " + segAux.segmentDescription;
                }
            }
        },
        Alterar() {
            if (this.VerificarCamposAlteracao()) {
                this.VerificarSenha(this.senhaAtual, 1);
            }
        },
        VerificarCamposAlteracao() {
            if (
                this.novaSenha == "" ||
                this.novaSenha.length < 6 ||
                this.novaSenha.length > 12
            ) {
                this.alertStore.error(
                    "Por favor informar nova senha. (Deve conter no mínimo 6 caracteres e no máximo 12 caracteres)."
                );
                return false;
            }

            if (
                this.confirmarSenha == "" ||
                this.confirmarSenha.length < 6 ||
                this.confirmarSenha.length > 12
            ) {
                this.alertStore.error(
                    "Por favor confirmar a nova senha. (No mínimo 6 caracteres e no máximo 12 caracteres)."
                );
                return false;
            }

            if (this.novaSenha != this.confirmarSenha) {
                this.alertStore.error("As senhas não conferem.");
                return false;
            }

            if (
                this.senhaAtual == "" ||
                this.senhaAtual.length < 6 ||
                this.senhaAtual.length > 12
            ) {
                this.alertStore.error(
                    "Por favor informar sua senha atual, para poder alterar sua senha. (6 a 12 caracteres)S"
                );
                return false;
            }

            return true;
        },
        VerificarCampos() {
            if (!this.confirmacao) return false;

            if (this.senhaModal == "") return false;

            return true;
        },
        async PreencherComboSegmentos() {
            let dadosSegmento = await helpers.getSegments();

            if (dadosSegmento.statusCode == 200) {
                this.lstSegmento = dadosSegmento.segments;
            }
        },
        DadosUsuario(
            nome,
            sobrenome,
            email,
            uf,
            telefone,
            empresa,
            cnpjcpf,
            segmento
        ) {
            var user = new Object();

            user.name = nome;
            user.surname = sobrenome;
            user.email = email;
            user.uf = uf;
            user.phone = telefone;
            user.company = empresa;
            user.password = "!@#$%*";
            user.cnpjcpf = cnpjcpf;
            user.segment = segmento;

            if (this.senha) {
                user.password = this.senha;
            }
            user.confirmPassword = user.password;

            return user;
        },
        MostrarSenha() {
            if (this.password) {
                this.tipoCampo = "text";
                this.classeEye = "fa fa-eye-slash";
            } else {
                this.tipoCampo = "password";
                this.classeEye = "fa fa-eye";
            }

            this.password = !this.password;
        },
        VerificarSenha(senha, opcao, userVinculado) {
            let sendUser = this.GerarObjetoEnvio(senha);

            if (senha.length <= 0) {
                this.alertStore.error(
                    "A senha não pode estar em branco. Verifique e tente novamente."
                );
                return;
            }

            let url = RetUrlAPI() + "CheckPassword";

            CallPostAsync("usuario", "", url, sendUser).then((data) => {
                if (data == "OK") {
                    switch (opcao) {
                        case 0:
                            this.EncerrarConta();
                            break;

                        case 1:
                            this.AlterarSenha();
                            break;

                        case 2:
                            this.EncerrarConta(userVinculado);
                            this.senhaConfirmarExclusao = "";
                            break;

                        case 3:
                            this.TransferirGestao(userVinculado);
                            this.senhaConfirmarTransferencia = "";
                            break;

                        default:
                            break;
                    }
                } else {
                    alertStore.error(data.message);
                }
            });
        },
        GerarObjetoEnvio(senha, userId, userEmail) {
            let sendUser = new Object();

            sendUser.email = this.userStore.user.mail;
            sendUser.password = senha;
            sendUser.userId = this.userStore.user.userId;

            if (userId) sendUser.userId = userId;

            if (userEmail) sendUser.email = userEmail;

            return sendUser;
        },
        GerarObjetoEnvioAlteracao() {
            let userAlterPassword = new Object();

            userAlterPassword.email = this.userStore.user.mail;
            userAlterPassword.DateHour = new Date();
            userAlterPassword.password = this.novaSenha;
            userAlterPassword.confirmPassword = this.confirmarSenha;
            userAlterPassword.forgotPassword = "N";

            return userAlterPassword;
        },
        GetClassTransferManagement(user) {
            let addWarning = "";

            if (user) {
                if (user.usua_userSolicGestao == "S") {
                    addWarning = " alert-warning";
                }
            }

            return "nav-item" + addWarning;
        },
        FirstLetterUpper(value) {
            return helpers.FirstLetterUpper(value);
        },
        JaExpirado(dataExpiracao) {
            let dataHoje = new Date();
            dataHoje.setHours(0, 0, 0, 0);

            dataExpiracao = helpers.FormatarDataBRParaEua(dataExpiracao);

            if (dataExpiracao < dataHoje) return true;

            return false;
        },
        // Usuario vinculado
        LimparDadosUsuarioVinculado() {
            this.nomeUsuarioVinculado = "";
            this.sobrenomeUsuarioVinculado = "";
            this.ufUsuarioVinculado = this.userStore.user.uf;
            this.emailUsuarioVinculado = "";
            this.telefoneUsuarioVinculado = "";
            this.empresaUsuarioVinculado = this.userStore.user.company;
            this.cnpjUsuarioVinculado = this.userStore.user.clientCNPJCPF;

            let chkAceite = document.getElementById("chkAceite");
            chkAceite.checked = false;

            this.FecharModal("#modalAdicionarUsuario");
        },
        GerarObjetoEnvioUsuarioVinculado() {
            let user = new Object();

            user.name = this.nomeUsuarioVinculado;
            user.surname = this.sobrenomeUsuarioVinculado;
            user.uf = this.ufUsuarioVinculado;
            user.phone = this.telefoneUsuarioVinculado;
            user.company = this.empresaUsuarioVinculado;
            user.cnpjcpf = this.cnpjUsuarioVinculado
                .replaceAll(".", "")
                .replaceAll("-", "")
                .replaceAll("/", "");
            user.email = this.emailUsuarioVinculado;
            user.managerId = this.userStore.user.userId;
            user.urlContext = RetUrlAPI();

            // Senha manual somente para entrar na API - lá dentro é gerada uma senha aleatória
            user.password = "!@#321";
            user.confirmPassword = "!@#321";

            if (this.segmentoVinculado != "")
                user.segment = this.segmentoVinculado
                .substring(0, this.segmentoVinculado.indexOf("-"))
                .trim();

            return user;
        },
        ValidacaoUsuarioVinculado() {
            if (this.cnpjUsuarioVinculado != "") {
                if (!helpers.ValidaCNPJ(this.cnpjUsuarioVinculado)) {
                    this.alertStore.error("Atenção! CNPJ inválido!");

                    this.processando = false;
                    return false;
                }
            }

            if (!this.checkAceite) {
                this.alertStore.error(
                    "Para realizar o cadastro, você precisa aceitar o checkbox concordando com os termos."
                );
                this.processando = false;
                return false;
            }

            return true;
        },
        EnviarEmailNovoUsuario(email, senha) {
            let dadosEmail = new Object();
            dadosEmail.nome = this.nomeUsuarioVinculado;

            dadosEmail.message =
                "Olá," +
                dadosEmail.nome +
                ". Seja bem-vindo(a) ao nosso portal. <br><br> Seu login de acesso é: <strong>" +
                email +
                "</strong> e sua senha é: <strong>" +
                senha +
                "</strong>." +
                "<br><br> Fique à vontade para trocar a senha dentro da página de gestão da sua conta. <br><br>";

            helpers.EnviarEmail(5, email, dadosEmail);
        },
        async RegistrarUsuarioVinculado() {
            this.processando = true;

            if (this.ValidacaoUsuarioVinculado()) {
                let user = this.GerarObjetoEnvioUsuarioVinculado();

                let url = RetUrlAPI() + "Register";

                CallPostAsync("usuario", "", url, user)
                    .then((data) => {
                        if (data.message) {
                            this.processando = false;
                            this.alertStore.error(data.message);
                            this.FecharModal("#modalAdicionarUsuario");
                            return;
                        }

                        if (data.startsWith("OK")) {
                            this.processando = false;

                            helpers.GravarLog(
                                "Realizou cadastro através do Gestor (aceitou os termos).",
                                "Tela Minha Conta",
                                "Register",
                                "OK",
                                null,
                                "portal"
                            );

                            this.alertStore.success(
                                "Usuário cadastrado com sucesso! O usuário receberá um email com suas credenciais"
                            );

                            this.processando = false;

                            this.FecharModal("#modalAdicionarUsuario");

                            let senha = data.split(";");

                            this.EnviarEmailNovoUsuario(this.emailUsuarioVinculado, senha[2]);

                            this.LimparDadosUsuarioVinculado();

                            this.dadosUsuariosVinculados = this.BuscarUsuariosVinculados();
                        } else {
                            this.processando = false;
                            this.alertStore.error(data);
                            this.FecharModal("#modalAdicionarUsuario");
                        }
                    })
                    .catch((reason) => {
                        this.processando = false;
                        this.alertStore.error(
                            "Não foi possível estabelecer conexão com o servidor."
                        );
                    });
            }
        },
        FormatarTelefone() {
            // helpers.FormatarTelefone(this.telefoneUsuarioVinculado);
            console.log(this.telefoneUsuarioVinculado);
        },
        BuscarPerfis() {
            this.mostrarModalPerfil = false;
            this.FecharModal("#profileModal");
            this.processando = true;

            let perfis = [];
            let perfil = new Object();
            let perfilPrincipal = 0;

            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url =
                RetUrlAPI() +
                "InformationProfile?userID=" +
                id +
                "&tokenSession=" +
                tokenSessao;

            CallGetAsync(url)
                .then((data) => {
                    if (data.length > 0) {
                        data.forEach(function (p, i) {
                            perfil = {};

                            perfil.hasProfile = true;
                            perfil.prfId = p.profileId;
                            perfil.prfApelido = p.apelido;
                            perfil.prfDtUltRec = p.dtUltRec;
                            perfil.prfTaxRegime = p.taxRegime;
                            perfil.prfTypeCnae = p.typeCnae;
                            perfil.prfUF = p.uf;
                            perfil.prfRecBruta = p.recBruta.replace(",", ".");
                            perfil.prfCfop = p.cfop;
                            perfil.prfSpecialRegime = p.specialRegime;
                            perfil.prfPrincipal = false;
                            perfil.prfIndex = i;

                            if (perfil.prfDtUltRec.length > 10) {
                                perfil.prfDtUltRec = perfil.prfDtUltRec.substring(0, 10);
                            }

                            if (p.principal) {
                                perfil.prfPrincipal = true;
                                perfilPrincipal = i;
                            }

                            perfis.push(perfil);
                        });

                        this.perfis = perfis;
                        this.perfil = this.perfis[perfilPrincipal];

                        this.idPrincipal = perfilPrincipal;
                        this.possuiPerfilConfigurado = this.perfil.hasProfile;

                        this.userStore.user.profiles = this.perfis;
                        this.userStore.user.profile = this.perfil;
                    }

                    this.processando = false;
                })
                .catch((reason) => {
                    this.processando = false;
                    this.alertStore.error(reason);
                });
        },
        TrocarPerfilPrincipal(index) {
            if (this.idPrincipal === index) {
                return;
            }

            this.processando = true;

            this.perfis[this.idPrincipal].prfPrincipal = false;
            this.perfis[index].prfPrincipal = true;

            this.perfil = this.perfis[index];

            let perfil = this.GerarObjetoPerfil(
                this.perfil.prfUF,
                this.perfil.prfTaxRegime,
                this.perfil.prfTypeCnae,
                this.perfil.prfApelido,
                this.perfil.prfId,
                this.perfil.prfTypeCnae,
                this.perfil.prfRecBruta,
                this.perfil.prfCfop,
                this.perfil.prfDtUltRec
            );

            let url = RetUrlAPI() + "UpdateProfile";
            CallPostAsync("usuario", "", url, perfil)
                .then((data) => {
                    if (data == "OK") {
                        this.userStore.user.userProfile = this.perfis;
                        this.userStore.user.profile = this.perfis[index];
                        this.idPrincipal = index;
                    } else {
                        this.alertStore.error(data.message);
                    }

                    this.processando = false;
                })
                .catch((reason) => {
                    this.processando = false;

                    let mensagemRetorno =
                        "Não foi possível estabelecer conexão com o servidor.";

                    this.alertStore.error(mensagemRetorno);
                });
        },
        GerarObjetoPerfil(
            uf,
            regTrib,
            atividade,
            apelido,
            idPerfil,
            cnae,
            recBruta,
            cfop,
            dtUltRec,
            principal = true
        ) {
            let perfil = new Object();

            perfil.principal = principal;
            perfil.uf = uf;
            perfil.taxRegime = regTrib;
            perfil.typeCnae = atividade;
            perfil.apelido = apelido;
            perfil.profileId = idPerfil;
            perfil.userId = this.userStore.user.userId;
            perfil.cnae = cnae;
            perfil.recBruta = Number(recBruta).toFixed(2);
            perfil.cfop = cfop == null ? "" : cfop;
            perfil.dtUltRec = dtUltRec;
            perfil.specialRegime = "";

            if (this.regime != null || this.regime != undefined)
                perfil.specialRegime = this.regime;

            if (this.regime == "NÃO") perfil.specialRegime = "";

            return perfil;
        },
        DefineIndexPerfil(index) {
            if (this.perfis[index].prfPrincipal) {
                this.principal = true;
                return;
            }

            this.idxPerfil = index;
            this.principal = false;
        },
        ExcluirPerfil() {
            let id = -1;
            let ids = [this.perfis[this.idxPerfil].prfId];

            let url = RetUrlAPI() + "DeleteProfiles";
            CallPostAsync("usuario", "", url, ids).then((data) => {
                if (data == "OK") {
                    this.perfis.splice(this.idxPerfil, 1);
                    this.userStore.user.userProfile.splice(this.idxPerfil, 1);

                    this.perfis.forEach(function (p, i) {
                        if (p.prfPrincipal) {
                            id = i;
                            return;
                        }
                    });

                    this.idPrincipal = id;

                    this.alertStore.success("Perfil excluido com sucesso!");
                    this.FecharModal("#modalExcluirPerfil");
                } else {
                    this.alertStore.error(data.message);
                    this.FecharModal("#modalExcluirPerfil");
                }
            });
        },
        NovoPerfil() {
            this.chavePerfil++;
            this.idxPerfil = -1;
            this.perfil = {
                hasProfile: false,
                prfId: 0,
                prfUF: "AC",
                prfTaxRegime: 0,
                prfTypeCnae: "GERAL",
                prfRecBruta: 0,
                prfCfop: "",
                prfDtUltRec: "",
                prfSpecialRegime: "",
            };
            this.mostrarModalPerfil = true;
        },
        AlterarPerfil(index) {
            this.chavePerfil++;
            this.idxPerfil = index;
            this.perfil = this.perfis[index];
            this.mostrarModalPerfil = true;
        },
        BuscarDestinatario() {
            this.mostrarModalDestinatario = false;
            this.FecharModal("#remitteeModal");
            // this.processando = true;

            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url = RetUrlAPI() + "RecipientsRead?userID=" + id + "&sessionToken=" + tokenSessao;

            CallGetAsync(url)
                .then((data) => {

                    this.processando = false;

                    if (data.length > 0) {

                        if (data == "[]") {
                            this.alertStore.error('Nenhum Destinatário encontrado.');
                        } else {
                            this.destinatarios = data;

                            this.userStore.user.userRecipients = this.destinatarios;
                            this.mostrarDadosDestinatario = true;
                            this.possuiDestinatarios = this.destinatarios.length > 0;
                        }

                    }

                })
                .catch((reason) => {
                    this.processando = false;
                    this.alertStore.error(reason);
                });
        },

        DefineIndexDestinatario(index) {
            this.idxDestinatario = index;
        },

        ExcluirDestinatario() {
            let ids = [this.destinatarios[this.idxDestinatario].destId];

            let tokenSessao = this.userStore.user.tokenSession;
            let id = this.userStore.user.userId;

            let url =
                RetUrlAPI() +
                "RecipientsDelete?userID=" +
                id +
                "&sessionToken=" +
                tokenSessao;

            CallPostAsync("usuario", "", url, ids).then((data) => {
                if (data == "OK") {
                    this.destinatarios.splice(this.idxDestinatario, 1);
                    this.userStore.user.userRecipients = this.destinatarios;

                    this.alertStore.success("Destinatário excluido com sucesso!");
                    this.FecharModal("#modalExcluirDestinatario");
                } else {
                    this.alertStore.error(data.message);
                    this.FecharModal("#modalExcluirDestinatario");
                }
            });
        },

        AlterarDestinatario(index) {
            this.chaveDestinatario++;
            this.idxDestinatario = index;
            this.destinatario = this.destinatarios[index];
            this.mostrarModalDestinatario = true;
        },

        DefCaracTrib(value) {
            return helpers.DefCaracTrib(value);
        },

        MarcarComoLido(notificacao) {
            notifications.MarcarComoLido(
                notificacao,
                document.getElementById("chkLido")
            );
        },

        NovoDestinatario() {
            this.chaveDestinatario++;
            this.idxDestinatario = -1;
            this.mostrarModalDestinatario = true;

            this.destinatario = {
                cTrib: 0,
                uf: "AC",
                finalidade: 0,
                operacao: 0,
                margemLiquida: "0.00",
                frete: "0.00",
                comissao: "0.00",
                outrasDespesas: "0.00",
            };
        },

        Notificacoes() {
            this.notificacoes = this.userStore.user.notifications;
            this.qtdeNotificacoes = this.notificacoes.length;

            this.mensagemNaoLida = this.userStore.user.unread;
        },

        ConverterDataBr(data) {
            helpers.ConverterDataBr(data);
        },

        Solucoes(idSolucao) {
            if (idSolucao != 19 && idSolucao != 20) {
                window.open("https://www.grupoimendes.com.br/oferta/", "blank");
                return;
            }

            router.push(`/contrato?${idSolucao}`);
        },

        VerContrato(uuid) {
            let url = RetUrlAPI() + "PostDocumentDownload";
            let objEnv = new Object();

            //----------------------------------------------------------------------
            if (!uuid) {
                this.alertStore.error(
                    "O Contrato para essa solução não foi encontrado."
                );
                return;
            }

            this.processando = true;

            objEnv.uuid = uuid;

            CallPostAsync("usuario", "", url, objEnv)
                .then((data) => {
                    if (data.success) {
                        if (data.url) {
                            this.processando = false;
                            window.open(data.url);
                        }
                    } else {
                        this.processando = false;
                        this.alertStore.error(data.message);
                    }
                })
                .catch((reason) => {
                    this.processando = false;
                    this.alertStore.error(
                        "Falha ao atualizar as informações vindas do servidor."
                    );
                });
        },

        EntrarContato() {
            window.open("https://api.whatsapp.com/send?l=pt&phone=5516981440284", "_blank");
        },

    },

    mounted() {
        helpers.VerificarAutenticacao();
        this.PreencherComboSegmentos();
        this.AtualizarDadosConta();
        notifications.BuscarDadosNotificacoes();
        this.mensagemNaoLida = this.userStore.user.unread;
    },

    computed: {

        // countNotifications() {
        //     return notifications.CountNotifications();
        // },

    },

    mixins: [notifications],
};
</script>

<style lang="less">
.card-account {
    border-top: none;
}

.nav-link {
    color: var(--primaryBlue);
    padding: 10px 25px;
}

.info-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    width: 100%;
}

.selecionado {
    color: #febd11;
}

p {
    margin-bottom: 10px;
}

.textAreaFeedback {
    width: 100% !important;
}

.icones-acoes i {
    margin: 5px;
}
</style>
