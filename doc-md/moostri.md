# <div id="doc-moostri">Moostri v2.0.3.x</div>
> [🔗Início](../README.md#portal-imendes) | 
> [Sumário](#doc-moostri-sumario)

O Moostri é uma ferramenta concebida para integrar o cenário tributário ao processo de compras e formação de preços. Com base em nossa vasta experiência em questões tributárias, nossa ferramenta realiza cálculos precisos. Algumas de suas funcionalidades-chave englobam o cálculo de custos, determinação do preço de venda, identificação da margem líquida e a formação do preço de venda.

> Endpoints:

- GetStatusService <br>
- LoginUser <br>
- CalculoImpostos <br>
- Importacao 

## <div id="doc-moostri-historico">📅 Doc Histórico [🔼topo](#doc-moostri)</div>
| Data | Descrição | Responsável | InfoTech |
| --- |--- |--- |--- |
| 03/05/2024 | Adicionado o endpoint GetStatusService | Renzo Alves | |
| 17/04/2024 | _IMPORTAÇÃO_ : Caso a posição correspondente à informação de 'Simples Nacional' para o perfil do Fornecedor não for informada, o Moostri marcará como: "N" | Renzo Alves | jira-app-8759 - 2024.04.17-1029 |
| 17/04/2024 | Criação | Renzo Alves | |


## <div id="doc-moostri-sumario">📝Sumário [🔼topo](#doc-moostri)</div>
### Tela
- <a href="#doc-moostri-area-produto">**Produto:** _Área relacionada a informações dos produtos a serem consultados_;</a>

### Consumo de APIs
- <a href="#m2-token-get-status-service">**Token/GetStatusService** (_Verificação se o serviço está disponível para utilização_);</a>
- <a href="#m2-token-login-user">**Token/LoginUser** (_Geração do Token para consumo dos demais end-points_);</a>
- <a href="#m2-calculo-impostos">**CalculoImpostos** (_Cálculo do preço de venda, margem e/ou preço de compra_);</a>
- <a href="#m2-importacao">**Importacao** (_Cálculos considerando Importação_);</a>
<hr>




## Tela:
### <div id="doc-moostri-area-determinacao-do-resultado"> - Determinação do Resultado [🔼sumário](#doc-moostri-sumario) | [🔼topo](#doc-moostri)</div>

### <div id="doc-moostri-area-produto"> - Produto [🔼sumário](#doc-moostri-sumario) | [🔼topo](#doc-moostri)</div>

#### _IMPORTAÇÃO DE PRODUTOS EM LOTE_:
- Caso a posição correspondente à informação de 'Simples Nacional' para o perfil do Fornecedor não for informada, o Moostri marcará como: "N"

### <div id="doc-moostri-area-destinatario"> - Destinatário [🔼sumário](#doc-moostri-sumario) | [🔼topo](#doc-moostri)</div>

### <div id="doc-moostri-area-sugestao-calculada"> - Sugestão Calculada [🔼sumário](#doc-moostri-sumario) | [🔼topo](#doc-moostri)</div>





## Consumo de APIs:
### <div id="m2-token-get-status-service"> Consumo de APIs: _Token GetStatusService_ [🔼topo](#doc-moostri-sumario)</div>
- Host: http://consultatributos.com.br:8080/moostri-api/v1/
- Host QA: http://consultatributos.com.br:8080/moostri-api-hom/v1/
- Método: GET
- Rota: Token/GetStatusService
- Retorno: HttpResponseMessage

**HEADERS**

<details>
<summary>📨 Envio: </summary>
<br>

~~~json
~~~

| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |


<br>
</details>

<details>
<summary>😀 JSON Retorno (sucesso): </summary>

~~~json
API Moostri operando na versão <numero_da_versao>
~~~

| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |

</details>

<details>
<summary>☹️ JSON Retorno (falha): </summary>

### HTTP 401 Unauthorized
~~~json
~~~

### HTTP 400 Bad Request
~~~json
~~~

</details>
<br>

### <div id="m2-token-login-user"> Consumo de APIs: _Token LoginUser_ [🔼topo](#doc-moostri-sumario)</div>
- Host: http://consultatributos.com.br:8080/moostri-api/v1/
- Host QA: http://consultatributos.com.br:8080/moostri-api-hom/v1/
- Método: POST
- Rota: Token/LoginUser
- Retorno: HttpResponseMessage

**HEADERS**
| Key | Value | Description |
|--- |--- |--- |
| CnpjCpf | < cnpj_cpf > | CNPJ/CPF do Parceiro ligado ao Usuário |
| Password | < senha > | Senha do Parceiro ligado ao Usuário |
| Content-Type | application/json ||

<details>
<summary>📨 Envio: </summary>
<br>

~~~json
{
    "cnpjCpf": "29707440820014",
    "password": "imdstestes"
}
~~~

| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |
| CNPJ/CPF			| cnpjCpf	| String  	| 11-14 | CNPJ/CPF do Parceiro do Usuário. |
| Senha de acesso   | password  | String    | 1-n	| Senha de acesso do Parceiro ligado ao Usuário. |

<br>
</details>

<details>
<summary>😀 JSON Retorno (sucesso): </summary>

~~~json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 (...)",
    "expiration": "2024-02-21T11:29:31.9987434-03:00"                   
}
~~~

| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |
| Token 	| token 	    | String  	| n     | Token de acesso para demais consumos dessa API |
| Expiração | expiration    | String    | 33    | Momento de expiração do Token de acesso gerado |


</details>

<details>
<summary>☹️ JSON Retorno (falha): </summary>

### HTTP 401 Unauthorized
~~~json
""
~~~

### HTTP 400 Bad Request
~~~json
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-bacce469fdfd729b91de38900c9631fe-34c4989f82441192-00",
    "errors": {
        "": [
            "A non-empty request body is required."
        ],
        "importacaoEnvio": [
            "The importacaoEnvio field is required."
        ]
    }
}
~~~

</details>
<br>


## <div id="m2-calculo-impostos">CalculoImpostos  [🔼topo](#doc-moostri-sumario)</div>
- Host: http://consultatributos.com.br:8080/moostri-api/v1/
- Host QA: http://consultatributos.com.br:8080/moostri-api-hom/v1/
- Método: POST / GET
- Rota: CalculoImpostos
- Retorno: HttpResponseMessage

<details>
<summary>📨 Envio: </summary>
<br>

**AUTHORIZATION**
| Key | Value | Description |
|--- |--- |--- |
| Type | Bearer Token | Modelo de autenticação usada |
| Token | < token > | Token de acesso fornecido no retorno do método Token/LoginUser |

**HEADERS**
| Key | Value | Description |
|--- |--- |--- |
| login | < cnpj_cpf > | CNPJ/CPF do Parceiro ligado ao Usuário |
| senha | < senha > | Senha do Parceiro ligado ao Usuário |
| Content-Type | application/json |

**JSON DE ENVIO**
~~~json
{
    "perfil": [
        {
            "perfilId": 4398,
            "usuarioId": 2863,
            "cnpj": "10353098000114",
            "regimeImposto": 0,
            "tipoCnae": "GERAL",
            "cnae": "",
            "recBruta": "0.00",
            "uf": "GO",
            "cfop": "",
            "dtUltRec": "15/02/2024",
            "regimeEspecial": "",
            "substICMS": "N"
        }
    ],
    "destinatarios": [
        {
            "destId": 62,
            "usuarioId": 2863,
            "perfil": 3,
            "ufDest": "SP",
            "finalidade": 0,
            "tipoOperacao": 0,
            "simplesNacional": false,
            "margem": 10,
            "frete": 0,
            "comissao": 0,
            "outrasDespesas": 0
        }
    ],
    "produtos": [
        {
            "cabecalhoProduto": {
                "origemProduto": 0,
                "tipoOperacao": 1,
                "perfilFornecedor": 0,
                "caracteristicaTributariaDestinatario": 7,
                "determinacaoResultado": 0,
                "autoCalc": true,
                "usuarioID": 2,
                "precoLiquidoPretendido": 0,
                "precoCompra": "5.00",
                "precoVenda": "0.00",
                "custoBaseInformado": "0.00",
                "margemLucroDesejada": "15.00",
                "percentualFrete": "0.00",
                "comissao": "0.00",
                "outrasDespesas": "0.00",
                "produtoEan": "07892970030421",
                "produtoCodImendes": "",
                "produtoCodInterno": "",
                "producaoPropria": "N",
                "ufFornecedor": "MG",
                "ufDestinatario": "SP",
                "descricao": "FRALDA"
            }
        }
    ]
}
~~~

**Entidade "perfil" (lista de)**
| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |
| ID do Perfil              | perfilId          | Int     | n    | Código ID do Perfil |
| ID do Usuário             | usuarioId         | Int     | n    | Código ID do Usuário logado |
| CNPJ                      | cnpj              | String  | 14   | CNPJ do Usuário |
| Regime Tributário         | regimeImposto     | Int     | 1    | Regime tributário: 0=Geral; 1=Simples Nacional; 2=Lucro Real; 3=Lucro Presumido |
| Tipo CNAE	(Atividade)     | typeCnae          | String  | n    | Atividade (CNAE): 'GERAL', 'CONSTRUCAO', 'FARMA', 'ATACADO', 'VAREJO' ou 'INDUSTRIA' |
| Receita Bruta             | receitaBruta      | Decimal | 1-14 | Valor da Receita Bruta nos últimos 12 meses. Deve ser informado se 'regimeImposto'=1 |
| UF						| uf                | String  | 2	 | Sigla UF |
| CFOP                      | cfop 		        | String  | 4	 | CFOP para a consulta. Padrão: "5102" | 
| Data última atualização   | dtUltRec 		    | String  | 10   | Data da última atualização da Receita Bruta | 
| Regime Especial           | regimeEspecial    | String  | n    | [opcional] Informe um Regime Especial ao qual o CNPJ está inserido. Consultar IMendes para lista válida. | 
| Substituto de ICMS        | substICMS         | String  | 1    | Cliente Substituto de ICMS: S=Sim, N=Não. | 

**Entidade "destinatarios" (lista de)**
| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |
| ID do Destinatario        | destId                | Int     | n    | Código ID do Destinatário |
| ID do Usuário             | usuarioId             | Int     | n    | Código ID do Usuário logado |
| Característica Tributária | perfil                | Int     | 1	 | 0=Industrial, 1=Distribuidor, 2=Atacadista, 3=Varejista, 4=Produtor Rural Pessoa Jurídica, 5=Produtor Rural Pessoa Física, 6=Pessoa Jurídica não contribuinte de ICMS, 7=Pessoa Física não contribuinte de ICMS |
| UF						| ufDest			    | String  | 2	 | Sigla UF do Destinatário da operação |
| Finalidade    			| finalidade            | Int     | 1	 | Finalidade da Operação: 0=Revenda, 1=Insumo, 2= Uso e Consumo ou Ativo Imobilizado |
| Tipo da operação     		| tipoOperacao          | Int     | 1	 | Tipo de Operação: 0=Tranferência; 1=Venda; 2=Compra |
| Simples Nacional      	| simplesNacional       | Bool    | n	 | Informa se o Destinatário pertence ao Regime Tributário Simples Nacional |
| Substituto de ICMS        | substICMS             | String  | 1    | Destinatário Substituto de ICMS: S=Sim, N=Não. | 
| Simples Nacional      	| simplesNacional       | Bool    | - 	 | Informa se o Destinatário pertence ao Regime Tributário Simples Nacional |
| Perc. Margem              | margem                | Decimal | 6,4  | Percentual para Margem de Lucro desejada |
| Perc. Frete               | frete                 | Decimal | 6,4  | Percentual de Frete |
| Perc. Comissão            | comissao              | Decimal | 6,4  | Percentual de Comissão |
| Perc. de Outras Despesas  | outrasDespesas        | Decimal | 6,4  | Percentual para Outras Despesas |


**Entidade "produtos" (lista de "cabecalhoProduto")** <br>
**Entidade "cabecalhoProduto"**

| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |
| Origem da Mercadoria   			| origemProduto 			| Int 	    | 1	    | 0=Nacional, exceto as indicadas nos códigos 3 a 5, <br>1=Estrangeira - Importação direta, exceto a indicada no código 6', <br>2=Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7', <br>3=Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40%', <br>4=Nacional, conforme Decreto-Lei nº 288/1967 , e as Leis nºs 8.248/1991, 8.387/1991, 10.176/2001 e 11.484/2007', <br>5=Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%', <br>6=Estrangeira - Importação direta, sem similar nacional, constante em lista de Resolução Camex e gás natural', <br>7=Estrangeira - Adquirida no mercado interno, sem similar nacional, constante em lista de Resolução Camex e gás natural', <br>8=Nacional - Mercadoria ou bem com Conteúdo de Importação superior a 70% (setenta por cento)' |
| Tipo de Operação 		    		| tipoOperacao		        | Int 	    | 1	    | 0=Venda para Consumidor Final;  <br>1=Venda para Consumidor Final Não Contribuinte;  <br>2=Venda para Revenda;  <br>3=Venda para utilização em processo de Industrialização. |
| Perfil do Fornecedor              | perfilFornecedor          | Int       | 1	    | 0=Normal;  <br>1=Atacado/Distribuidor;  <br>2=Indústria ou Equiparado;  <br>3=ME (Simples Nacional); 9=Outros. |
| UF do Fornecedor 	        		| ufFornecedor              | String 	| 2     | UF do Fornecedor |
| Caracteristica Tributaria do Destinatário | caracteristicaTributariaDestinatario  | Int	    | 1	    | 0=Industrial;  <br>1=Distribuidor;  <br>2=Atacadista;  <br>3=Varejista;  <br>4=Produtor Rural Pessoa Jurídica;  <br>5=Produtor Rural Pessoa Física;  <br>6=Pessoa Jurídica Não Contribuinte do ICMS;  <br>7=Pessoa Física Não Contribuinte do ICMS; |
| Determinacao do Resultado		    | determinacaoResultado     | Int       | 1	    | 0=Preço de Venda; <br>1=Valor de Compra; <br>2=Margem de Lucro. |
| Cálculo Automatizado              | autoCalc                  | Bool      | -	    | Autocalcular: <br>TRUE = Sistema calcula automaticamento o Custo Base; <br>FALSE = Usuário informa Custo Base por input |
| ID do Usuário                     | usuarioId                 | Int       | n     | Código ID do Usuário logado |
| Preço Líquido Pretendido          | precoLiquidoPretendido    | Decimal   | 12,4  | Preço Líquido Pretendido |
| Preço de Compra	    			| precoCompra 		        | Decimal 	| 12,4  | Preço de Compra | 
| Preço de Venda                    | precoVenda  		        | Decimal 	| 12,4  | Preço de Venda | 
| Custo Base informado              | custoBaseInformado        | Decimal 	| 12,4  | Valor do Custo Base quando informado pelo usuário | 
| Margem de Lucro desejada          | margemLucroDesejada       | Decimal 	| 6,4   | Margem de Lucro desejada pelo usuário <br> _Será substiruído pela informação vinda do Destinatário_ |
| Percentual para Frete             | percentualFrete           | Decimal	| 6,4   | Percentual para Frete <br> _Será substiruído pela informação vinda do Destinatário_ |
| Percentual para Comissão          | comissao			        | Decimal	| 6,4   | Percentual para Comissão <br> _Será substiruído pela informação vinda do Destinatário_ |
| Percentual para Outras despesas   | outrasDespesas	        | Decimal	| 6,4   | Percentual para Outras Despesas <br> _Será substiruído pela informação vinda do Destinatário_ |
| Código Interno		    		| produtoCodInterno		    | String	| 1-50  | Código Interno do produto na base do usuário. (Requer Intergração com APIs de Saneamento) |
| Código EAN (Barras) do Produto    | produtoEan 			    | String 	| 8-14  | Código do produto. Para código EAN, use os tamanhos: 8, 12, 13 ou 14 |
| Código do Produto na IMendes      | produtoCodImendes         | String 	| 1-50  | Código IMendes (Somente números) |
| Produção Própria 		         	| producaoPropria		    | String	| 1	    | Produto de produção própria pelo usuário: S=Sim, N=Não |
| UF do Destinatário                | ufDestinatario            | String 	| 2     | UF do Fornecedor  <br> _Será substiruído pela informação vinda do Destinatário_ |
| Descrição do Produto              | descricao                 | String	| 1-100 | Descrição do Produto. |

<br>
</details>

<details>
<summary>😀 JSON Retorno (sucesso): </summary>

### HTTP 200 OK

~~~json
{
    "demonstrativos":
    [{
            "codInterno": "N",
            "codProduto": "07892970030421",
            "descricao": "FRALDA",
            "ufDest": "SP",
            "perfilId": "4398",
            "destId": "62",
            "determinacao": "0",
            "valor": {
                "valorTotalNF": 5.410096,
                "ipi": 0.000000,
                "icmsStOpeSubsequente": 0.000000,
                "icmsStDifal": 0.000000,
                "receitaBruta": 5.410096,
                "pisCofins": 0.000000,
                "pis": 0.000000,
                "pisExcluidoIcms": 0.000000,
                "cofins": 0.000000,
                "cofinsExcluidoIcms": 0.000000,
                "icmsOpePropria": -0.649212,
                "icmsDifalNaoContribuinte": 0.000000,
                "das": 0.000000,
                "receitaLiquida": 4.760884,
                "cmvCpv": -4.219875,
                "lucroBruto": 0.541009,
                "frete": 0.000000,
                "comissao": 0.000000,
                "outrasDespesas": 0.000000,
                "freteComissaoOutrasDespesas": 0.000000,
                "lucroLiquido": 0.541009
            },
            "percentual": {
                "valorTotalNF": 0.00,
                "ipi": 0.00,
                "icmsStOpeSubsequente": 0.00,
                "icmsStDifal": 0.00,
                "receitaBruta": 100.00,
                "pisCofins": 0.00,
                "pis": 0.00,
                "pisExcluidoIcms": 0.00,
                "cofins": 0.00,
                "cofinsExcluidoIcms": 0.00,
                "icmsOpePropria": -12.00,
                "icmsDifalNaoContribuinte": 0.00,
                "das": 0.00,
                "receitaLiquida": 88.00,
                "cmvCpv": -78.00,
                "lucroBruto": 10.00,
                "frete": 0.00,
                "comissao": 0.00,
                "outrasDespesas": 0.00,
                "freteComissaoOutrasDespesas": 0.00,
                "lucroLiquido": 10.00
            },
            "custo": {
                "valorDoProdutoNaCompra": 5.000000,
                "ipi": 0.000000,
                "icmsSt": 0.000000,
                "icms": -0.350000,
                "pis": -0.076725,
                "cofins": -0.353400,
                "custo": 4.219875
            },
            "retorno": "OK",
            "mensagem": "CALCULOS EXECUTADOS COM SUCESSO!",
            "spotlight": 5.410096
        }
    ],
    "retorno": "OK",
    "mensagem": "",
    "versaoApi": "1.2.0.0"
}
~~~

</details>

<details>
<summary>☹️ JSON Retorno (falha): </summary>

### HTTP 401 Unauthorized

~~~json
""
~~~

### HTTP 400 Bad Request

~~~json
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-7d606ed39075dcda7c7835930d9dd718-51785ec50ed63fc6-00",
    "errors": {
        "Produtos": [
            "The Produtos field is required."
        ]
    }
}
~~~

</details>
<br>

## <div id="m2-importacao">Importacao [🔼topo](#doc-moostri-sumario)</div>
- Host: http://consultatributos.com.br:8080/moostri-api/v1/
- Host QA: http://consultatributos.com.br:8080/moostri-api-hom/v1/
- Método: GET
- Rota: Importacao
- Retorno: HttpResponseMessage

<details>
<summary>📨 Envio: </summary>
<br>

**AUTHORIZATION**
| Key | Value | Description |
|--- |--- |--- |
| Type | Bearer Token | Modelo de autenticação usada |
| Token | < token > | Token de acesso fornecido no retorno do método Token/LoginUser |

**HEADERS**
| Key | Value | Description |
|--- |--- |--- |
| login | < cnpj_cpf > | CNPJ/CPF do Parceiro ligado ao Usuário |
| senha | < senha > | Senha do Parceiro ligado ao Usuário |
| Content-Type | application/json |

**JSON DE ENVIO**
~~~json
{
    "frete": 2,
    "seguro": 3,
    "valorProduto": 100,
    "capatazia": 50,
    "taxaSiscomex": 0,
    "outrasDespesas": 0,
    "despesasOperacionais": 0,
    "icms": 10,
    "iva": 100,
    "ipi": 5,
    "codInterno": "N",
    "codigo": "07892970030421",
    "descricao": "ANAN NANOANA OA ONA",
    "ncm": "",
    "cstPisCofins": "01",
    "ufDesembaraco": "SP",
    "pisCofinsRecup": true,
    "ipiRecup": true,
    "icmsRecup": true
}
~~~

| Campo | Alias | Tipo | Tamanho | Descrição |
|--- |--- |--- |--- |--- |
| Valor do Frete                    | frete                 | Decimal   | 12,4  | Valor do Frete |
| Valor do Seguro                   | seguro                | Decimal   | 12,4  | Valor do Seguro |
| Valor do Produto                  | valorProduto          | Decimal   | 12,4  | Valor do Produto |
| Valor do Capatazia                | capatazia             | Decimal   | 12,4  | Valor do Capatazia |
| Valor do da Taxa Siscomex         | taxaSiscomex          | Decimal   | 12,4  | Valor do da Taxa Siscomex |
| Valor do Outras Despesas          | outrasDespesas        | Decimal   | 12,4  | Valor do Outras Despesas |
| Valor do Despesas Operacionais    | despesasOperacionais  | Decimal   | 12,4  | Valor do Despesas Operacionais |
| Percentual de ICMS                | icms                  | Decimal   | 6,4   | Percentual de ICMS |
| Percentual de IVA                 | iva                   | Decimal   | 6,4   | Percentual de IVA |
| Percentual de IPI                 | ipi                   | Decimal   | 6,4   | Percentual de IPI  |
| Código Interno		    		| produtoCodInterno		| String    | 1     | S=Sim, N=Não. Define se 'codigo' deverá ser tratado como uma código de barras EAN ou como um código interno do produto na base do usuário. (Se "S", requer Intergração com APIs de Saneamento). |
| Código do Produto                 | codigo                | String 	| 8-14  | Código do produto. Para código EAN, use os tamanhos: 8, 12, 13 ou 14 |
| Descrição do Produto              | descricao             | String	| 1-100 | Descrição do Produto. |
| Código NCM 		    		    | ncm 		            | String	| 0-8 | [Opcional] Código NCM do Produto |
| Código CST de PIS/CONFIS de Entrada 		    		    | ncm 		    | String	| 0-8 | Código CST de PIS/CONFIS de Entrada |
| UF do local do Desembaraço        | ufDesembaraco 		| String	| 2     | UF do local do Desembaraço. Seu valor Padrão é a mesma UF do Usuário. |
| Pis/Cofins Recuperável*           | pisCofinsRecup        | Bool      | -	    | TRUE=Informa que o Cliente será beneficiado com créditos de Pis/Cofins. FALSE=Não recupera créditos. |
| ICMS Recuperável*                 | icmsRecup             | Bool      | -	    | TRUE=Informa que o Cliente será beneficiado com créditos de ICMS. FALSE=Não recupera créditos. |
| IPI Recuperável*                  | ipiRecup              | Bool      | -	    | TRUE=Informa que o Cliente será beneficiado com créditos de IPI. FALSE=Não recupera créditos. |

(*)**Nota:** <br> _É de responsabilidade do cliente informar se é ou não beneficiário desse recurso._ 

<br>
</details>

<details>
<summary>😀 JSON Retorno (sucesso): </summary>

### HTTP 200 OK

~~~json
{
    "codInterno": "",
    "codigo": "",
    "descricao": "",
    "valorAduaneiro": 0,
    "aliqII": 0,
    "aliqIPI": 0,
    "aliqPIS": 0,
    "aliqCOFINS": 0,
    "aliqICMS": 0,
    "aliqIVA": 0,
    "valorII": 0,
    "valorIPI": 0,
    "valorPIS": 0,
    "valorCOFINS": 0,
    "valorICMS": 0,
    "valorICMS_ST": 0,
    "totalMercadoria": 0,
    "frete": 0,
    "seguro": 0,
    "tributos": 0,
    "custoTotal": 0,
    "capatazia": 0,
    "taxaSiscomex": 0,
    "outrasDespesas": 0,
    "despesasOperacionais": 0,
    "retorno": "OK",
    "mensagem": "",
    "versaoApi": "1.2.0.0"
}
~~~

</details>

<details>
<summary>☹️ JSON Retorno (falha): </summary>

### HTTP 401 Unauthorized

~~~json
""
~~~

### HTTP 400 Bad Request

~~~json
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "00-bacce469fdfd729b91de38900c9631fe-34c4989f82441192-00",
    "errors": {
        "": [
            "A non-empty request body is required."
        ],
        "importacaoEnvio": [
            "The importacaoEnvio field is required."
        ]
    }
}
~~~

</details>
<br>
