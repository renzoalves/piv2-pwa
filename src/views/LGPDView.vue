<template>

    <LayoutSidebar>
        <ChatWhatsapp :assinante="userLogged"></ChatWhatsapp>

        <div class="content">

            <h1>LGPD (Lei Geral de Proteção dos Dados)</h1>
    
            <div class="text">
    
                <h3>Overview</h3>
    
                <p>
                    A LGPD é uma lei sancionada no Brasil em Agosto de 2018 e que entrou em vigor no início de 2020, inspirada na GDPR (General Data Protection Regulation ou Regulamento Geral de Proteção de Dados) feita pelo Parlamento Europeu. Em resumo, sua principal função é determinar como as empresas deverão fazer o tratamento de dados dos seus clientes, estabelecendo parâmetros de como os dados PESSOAIS serão coletados, processados e armazenados ou, em alguns casos, destruídos.
                </p>
    
                <h3>Atores</h3>
    
                <p>
                    <span class="bold">Titular: é o cliente que disponibiliza os dados;</span>
                    <span class="bold">Controlador: processa e armazena os dados;</span>
                    <span class="bold">Operador: é o ator indicado pelo controlador para fazer a comunicação entre o Titular e Controlador;</span>
                    <span class="bold">Agente de tratamento: é o Controlador e o Operador.</span>
                </p>

                <h3>Direitos dos Titulares</h3>

                <ul>
                    <li>Confirmação de que existe tratamento de dados;</li>
                    <li>Acesso aos dados pessoais que lhe digam respeito;</li>
                    <li>Correção de dados pessoais desatualizados, incorretos ou incompletos;</li>
                    <li>Portabilidade dos seus dados para outro fornecedor de serviço;</li>
                    <li>Eliminação dos Dados (exceto quando o tratamento é legal);</li>
                    <li>Informações sobre compartilhamento dos dados;</li>
                    <li>Informações sobre o não consentimento;</li>
                    <li>Revogação do consentimento nos termos da lei;</li>
                    <li>Reclamação contra o controlador;</li>
                    <li>Oposição, caso discorde de alguma informação ou algum tratamento.</li>
                </ul>
    
                <h3>Dados Pessoais</h3>
    
                <p>
                    Todo o dado que possa identificar ou que seja identificável de alguma pessoa natural. Dados como: CPF, RG, endereço e demais dados que identificam o indivíduo.
                </p>

                <h3>Dados Anônimos</h3>
    
                <p>
                    São dados que se referem a pessoas que não podem ser identificadas – como dados estatísticos, por exemplo.
                </p>

                <h3>Dados Sensíveis</h3>
    
                <p>
                    Referente à preferência (escolha de gênero), opiniões políticas ou convicção (religiosa e/ou filosófica), o que poderia incidir em repressão e preconceito caso os mesmos fossem vazados.
                </p>

                <h3>Processos Afetados</h3>
    
                <ul>
                    <li>Base de dados</li>
                    <li>Política de Privacidade</li>
                    <li>Termos de Uso</li>
                </ul>

                <h3>Tratamento de Dados</h3>
    
                <p>
                    É toda operação que envolve Coleta, Produção, Recepção, Classificação, Utilização, Acesso, Reprodução, Transmissão, Distribuição, Processamento, Arquivamento, Armazenamento, Eliminação (ponto importante no contrato, se a empresa deseja ou não ter os seus dados eliminados após o serviço prestado), Avaliação. E também o Controle, Modificação, Comunicação, Transferência, Difusão e Extração de informações.
                </p>
    
                <h3>Links Úteis</h3>
    
                <div class="links">
    
                    <router-link class="geral-link" to="/cookies">
                        Cookies
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

        ul{
            margin-top: 20px;
            list-style-type: disc;
            display: flex;
            flex-direction: column;
            gap: 10px;
            
            li{
                font-weight: bold;
                color: #000;
                margin-left: 50px;
            }
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