<template>

    <LayoutSidebar>
        <ChatWhatsapp :assinante="userLogged"></ChatWhatsapp>

        <div class="content">

            <h1>Cookies</h1>
    
            <div class="text">
    
                <h3>Overview</h3>
    
                <p>
                    Os dados pessoais utilizados são obtidos de forma consensual pela realização do cadastro no site IMendes e concordância com a política de privacidade da empresa. A IMendes trabalha conforme a lei geral de proteção de dados a LGPD. O usuário tem direito a saber quais dados foram utilizados e de que forma. Caso seja necessário, é possível solicitar a exclusão dos dados a qualquer momento.
                </p>
    
                <h3>Cookies</h3>
    
                <p>
                    Cookies são arquivos de texto salvos no seu computador que possuem algumas informações para que o site possa lembrar de suas preferências, além de outros dados. Abaixo seguem os cookies utilizados:
                </p>
    
                <GeralTable
                    csize="repeat(3, 1fr)"
                    :header="['Cookie', 'Domínio', 'Informações']"
                    :rows="[
                        ['_ga', '.bootstrapcdn.com', 'Bootstrap Policy'],
                        ['mp_153b95f810bd70752a0f1f7e63f16ad2_mixpanel', '.fontawesome.com', 'Font Awesome Privacy'],
                        ['_ga', '.fontawesome.com', 'Font Awesome Privacy'],
                        ['_fbp', '.fontawesome.com', 'Font Awesome Privacy'],
                        ['__utmz', '.fontawesome.com', 'Font Awesome Privacy'],
                        ['__utma', '.fontawesome.com', 'Font Awesome Privacy'],
                        ['__stripe_mid', '.fontawesome.com', 'Font Awesome Privacy'],
                        ['pga4_session', '127.0.0.1', 'Sessão do Banco de Dados'],
                    ]"
                />
    
                <h3>Armazenamento Local</h3>
    
                <p>
                    Os navegadores possuem um armazenamento local, no qual guardamos algumas informações. Tanto o Session Storage (dados não persistentes) quanto o Local Storage (dados persistentes) são utilizados para um melhor funcionamento do nosso portal. Para seu conhecimento, seguem abaixo informações de quais dados são utilizados e de como ocorre essa utilização.
                </p>
    
                <h3>Session Storage</h3>
    
                <p>
                    Relação dos dados utilizados:
                </p>
    
                <GeralTable
                    csize="repeat(2, 0.5fr) 3fr 0.5fr"
                    :header="['Informação', 'Descrição', 'Uso', 'Dado Pessoal']"
                    :rows="[
                        ['token', 'E-mail Criptografado', 'Estritamente necessário para realizar autenticação na nossa API e confirmar que o usuário possui acesso aos nossos recursos.', 'Sim (criptografado)'],
                        ['tokenSessao', 'E-mail e horário de login criptografados', 'Estritamente necessário para realizar autenticação e confirmar que o usuário logado é o usuário correto e não um impostor.', 'Sim (criptografado)'],
                    ]"
                />
    
                <h3>Local Storage</h3>
    
                <p>
                    Relação dos dados utilizados:
                </p>
    
                <GeralTable
                    csize="repeat(2, 0.5fr) 3fr"
                    :header="['Informação', 'Descrição', 'Uso']"
                    :rows="[
                        ['Geral', 'DadosCliente, DadosConsulta, Perfil', 'Utilizado para conter os dados mencionados abaixo, facilitando as consultas, autenticação, entre outros serviços de nossa API.'],
                        ['DadosCliente', 'Dados do Cliente', 'Utilizado para questões de apresentação ao usuário, além de acesso e autenticação em nossa API, para obter os resultados das consultas, entre outros serviços.'],
                        ['DadosConsulta', 'Dados de Consulta do Usuário', 'Utilizado para controlar resultados das consultas obtidas na API, além de facilitar a comunicação nesses processos.'],
                        ['Perfil', 'Dados do Perfil Tributário do Usuário', 'Utilizado para gravar as informações do Perfil Tributário do Usuário para facilitar a comunicação com nossa API e retornar os resultados conforme o perfil cadastrado.'],
                    ]"
                />
    
                <p class="obs">*Utilizamos esses dados para melhorar sua experiência e para questões estatísticas. Dessa maneira, poderemos entregar um serviço de melhor qualidade. Qualquer dúvida, estamos à disposição.</p>
    
                <h3>Links Úteis</h3>
    
                <div class="links">
    
                    <router-link class="geral-link" to="/lgpd">
                        LGPD
                    </router-link>

                    
                    <!-- <router-link class="geral-link" to="/contato">
                        Contato
                    </router-link> -->
    
                </div>
    
            </div>

        </div>

    </LayoutSidebar>

</template>
  
<script setup>
import { useAuthStore } from "@/stores/user";

const userStore = useAuthStore();
const userLogged = userStore.user.hasAuth;

</script>
  
<style scoped lang="less">

    .content{
        padding-bottom: 100px;
    }

    h1{
        color: @primaryBlue;
    }

    h3{
        color: @primaryBlue;
        margin-top: 50px;
    }

    .text{
        margin-top: 100px;

        p{
            margin-top: 20px;
            line-height: 24px;
            color: @primaryGray;
            width: 80%;
        }

        .obs{
            padding-top: 5px;
            width: 80%;
            font-weight: bold;
            color: @primaryBlue;
        }
    }

    .links{
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
    }

    @media only screen and (max-width: 1024px){
        h1{
            font-size: 26px;
        }
    }

    @media only screen and (max-width: 768px){
        .text{
            margin-top: 50px;
            p{
                width: 100%;
            }
        }
    }

</style>