<template>

    <LayoutSidebar>

            <div class="content">

                <h1>Contato</h1>

                <form>

                    <div class="form-grid">

                        <div class="input-wrapper">
                            <label>Nome</label>
                            <GeralInput type="text" name="name" placeholder="Digite seu nome..." v-model="name"/>
                        </div>

                        <div class="input-wrapper">
                            <label>Telefone</label>
                            <GeralInput type="text" name="phone" placeholder="Digite seu telefone..." v-model="phone"/>
                        </div>

                        <div class="input-wrapper">
                            <label>Email</label>
                            <GeralInput type="email" name="email" placeholder="Digite seu email..." v-model="email"/>
                        </div>

                        <div class="input-wrapper">
                            <label>Assunto</label>
                            <GeralInput type="email" name="subject" placeholder="Digite o assunto..." v-model="subject"/>
                        </div>

                    </div>

                    <div class="input-wrapper">
                        <label>Mensagem</label>
                        <GeralInput customClass="text-area" type="textarea" name="message" placeholder="Digite sua mensagem..." v-model="message"/>
                    </div>

                    <GeralButton buttonType="submit" text="Enviar" :loading="false"/>

                </form>

            </div>

    </LayoutSidebar>

</template>
  
<script setup>

</script>

<style lang="less">

    .text-area{
        height: 200px;
    }

</style>
  
<style scoped lang="less">

    .content{
        background: #FFF;
        padding: 30px;

        h1{
            color: @primaryBlue;
        }

        .input-wrapper{
            display: flex;
            flex-direction: column;
            gap: 10px;

            label{
                font-weight: bold;
            }
        }

        .form-grid{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 25px 40px;
            margin-bottom: 25px;
            margin-top: 50px;
        }

        .geral-button{
            margin-top: 30px;
            margin-left: auto;
        }

        .geral-textarea{
            height: 200px;
        }

    }

    @media only screen and (max-width:768px){
        .content .form-grid[data-v-ae84ca9b] {
            gap: 15px;
        }

        .geral-button{
            padding: 14px 70px;
            margin: 10px auto;
            font-size: 16px;
        }
    }

    @media only screen and (max-width:450px){
        .content .form-grid[data-v-ae84ca9b] {
            grid-template-columns: 1fr;
        }
    }

</style>