
# Fundamentos do NodeJS

## Conceitos

>### O que é o Node.js?

* Plataforma open-source permite execução da linguagem javascript do lado do servidor.
* v8 + libuv + conjunto de módulos.


>### O que Node.js veio resolver ?

* Ryan Dahl
* Barra de progresso de flickr
* Tecnologias da época não davam um bom suporte ao processo de I/O


>### Catacterísticas do Node.js ?

* Arquitetura Event Loop
  * Call Stack
* Single - Thread
* Non-blocking I/O
* Módulos próprios
  *http
  *dns
  *fs
  *buffer
* Call Stack é uma pilha que recebe as funções.
* Event Loop
  * É single thread.
  * Fica ouvindo as funções que entra no Call Stack e processa 1 por vez.
  * Uma vez que recebe a função do Call Stack ele distribui para 4 threads (default) podendo configurar para aumentar.


>### O que são gerenciadores de pacotes ?

* NPM e Yarn
* Instalar bibliotecas externas
* Disponibilizar bibliotecas


>### Frameworks

* Express
* Egg.js
* Next.js
* Adonis.js


>### O que é API ?

- Application Programmin Interface (Interface de programação de Aplicativos)
- Conjunto de especificações de possíveis interações entre aplicações
- Documentação para desenvolvedor


>### O que é REST ?

* Representation State Transfer (Transferência Representacional de Estado)
* Modelo de arquitetura
* 6 Regras
  * Client-Server
  * Stateless (Cliente pode realizar quantas requisições quiser e o servidor não armazenada nenhum sessão ou estado da requisição, então a cada requisição feita deve passar todas as informações para a requisição ser processada )
  * Cache (Tem que ser construida de alguma forma que garanta a possibilidade do cache)
  * Interface Uniforme
    *Identificação dos recursos (Ex: http://enderecoservidor.com.br/products ou /clients)
    * Representação dos recursos
    * Mensagens auto-descritivas
    * HATEOAS (Hypertext As The Engine Of Application State),ou seja, retorna links dentro da requisição (json)
    * Camadas (Balanciamento de cargas, segurança entre outros)
    * Código Sob Demanda (Permite que as funcionalidade do client sejam estendidas na forma de script ou mini aplicatios)


>### Métodos de Requisições - HTTP Verbs

* GET -> Leitura
* POST -> Criação
* PUT -> Atualização
* DELETE -> Deleção
* PATCH -> Atualização parcial


>### HTTP Codes

* 1xx -> Informativo, a solicitação foi aceita ou o processo continua em andamento;
* 2xx -> Confirmação
  * 200 -> Requisição bem sucedida
  * 201 -> Created, geralmente usado para POST após uma inserção
* 3xx -> Redirecionamento
  * 301 -> Moved Permanently
  * 302 -> Moved
* 4xx -> Erro do cliente
  * 400 -> Bad Request
  * 401 -> Unauthorized
  * 403 -> Forbidden
  * 404 -> Not Found
  * 422 -> Unprocessable Entity
* 5xx -> Erro no servidor, o servidor falou ao concluir a solicitação.
  * 500 -> Internal Server Error
  * 502 -> Bad Gateway

>### Parâmetros das Requisições

* Header Params -> Parametros que vão no cabeçalho da requisição, ex: Token, controle da sessão entre outros.
* Query Params -> Parametros inseridos no final de uma url, ex: ?page=2&limit=50
* Route Params -> Parametros que vão no meio da rota, exemplo: https://enderecoservidor.com.br/v1/users/{id}
* Body Params -> Parametros no corpo da requisição


>### Boas práticas API Rest

* A utilização correta dos métodos HTTP
* A utilização correta dos status no retorno das respostas
* Padrão de nomenclatura
  * Busca de usuários -> GET (https://enderecoservidor.com.br/v1/users/)
  * Busca de usuário por id - GET (https://enderecoservidor.com.br/v1/users/1)
  * Busca de endereço do usuario - GET (https://enderecoservidor.com.br/v1/users/1/address)
  * Deleção de um usuário - DELETE (https://enderecoservidor.com.br/v1/users/1)
  * Atualização do status do usuário - PATCH (https://enderecoservidor.com.br/v1/users/1/status)


## Configurando o projeto

>### Criando estrutura do projeto

```javascript
yarn init -y //Cria um arquivo package.json
yarn add express //Instala o Framework
node src/index.js //Inicia projeto
```

* Nodemon, atualiza automaticamente a aplicação.

```javascript
yarn add nodemon -d
```

* Criar parametro em package.json para executar a aplicação com nodemon.
```javascript
  "scripts": {
    "dev": "nodemon src/index.js"
  }
```
* GET -> Buscar informação do servidor
* POST -> Inserir uma informação no servidor
* PUT -> Alterar uma informação no servidor
* PATCH -> Alterar uma informação especifica
* DELETE -> Deletar uma informação no servidor
* Navegador aceita apenas rotas GET.
* Instale o Insomnia para realizar requisições
* Tipos de Parametros
  * Route Params -> Recebemos na rota, identifica um recurso para editar/deletar/buscar
  * Query Params -> Recebemos na rota de uma forma diferente, utilizado Paginação/Filtro
  * Body Params -> Recebemos no corpo da requisição, os objetos inserção/alteração (Normalmente JSON)


