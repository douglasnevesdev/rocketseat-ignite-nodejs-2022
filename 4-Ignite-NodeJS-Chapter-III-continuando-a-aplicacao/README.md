
# Continunando a aplicação

## Conhecendo o Docker

>### O que é ?

* Ferramenta para criação de containers.
* Container: Ambiente isolado
* imagens: instruções para criação de um container
* O que "roda" localmente "roda" em produção
* Mesmo SO, compartilhando recursos da máquina host

O Docker é responsavel para fazer a criação dos containers, ele pega a imagem que criamos e cria um container, ele seria como um midlaware entre o sistema operacional e o container que estamos criando.

Podemos usar imagens oficiais que estão no docker ou personalizar nossas imagens.

* Criamos um arquivo Dockerfile no diretorio raiz, que tera todo passo a passo para rodar a imagem da aplicação.
* Instale a extensão do docker no vscode.
* No site hub.docker.com/search é exibido todas as imagens que tem disponivel.
* Criamos um arquivo .dockerignore para indicar as pastas ignoradas.

No arquivo Dockerfile, informe o codigo abaixo, esse codigo tem como objetivo criar uma maquina com a imagem do node.js dentro de um container docker.
```javascript
FROM node //Qual imagem que você quer montar, confira no site hub.docker.com/search
WORKDIR /use/app //Diretorio para armazenar nossas informações
COPY package.json  //Informo que quero copiar o package.json para dentro do diretorio.
RUN npm install //Depois copiou tudo ele instala
COPY . . //Depois que instalou as dependencias, ele deve copiar tudo para a pasta raiz.
EXPOSE 3333 //Vai habilitar nessa porta.
CMD ["npm","run","dev"] //Lista de comandos que ele precisa executar, tem que ser array.
```

Para construir a imagem que criamos dentro do arquivo Dockerfile, execute o seguinte comando no terminal:
```javascript
docker build -t nomeImagem . // Constroi uma imagem com as definições do arquivo Dockerfile.
docker run -p 3333:3333 nomeImagem // Executa o container e mapeia para  porta 3333
```

Para gerenciar o container criado, use o comando:
```javascript
docker exec -it nomedocontainer /bin/bash //Abre o gerenciamento do container.
ls
```

>### Docker compose

Funciona como uma orquestrador de containers, aonde definimos quais serviços usar e se um serviço depende de outro serviço, conseguimos definir variaveis de ambiente entre outros.

* Criamos um arquivo docker-compose.yml e definimos uma configuração.

```javascript
docker-compose build //Apos preencher o arquivo docker-compose.yml execute este comando para gerar uma imagem.
docker-compose up // Iniciar o docker container (execute depois do build)
docker-compose up -d // Roda o docker em background
docker-compose logs rentx -f // Mostra logs
docker-compose stop // Parar o docker-compose
docker-compose down // Remove todo o docker-compose
docker-compose up --force-recreate // Força o build se ja tiver algo criado.

```

Nesse projeto vamos usar o docker-composer para utilizar um container do node.js com um container do postgres, segue codigo abaixo:

```javascript
version: "3.9"

services:
  database: #ESSE É O NOME DO SERVICE QUE DEVE ESTAR NO ARQUIVO DE CRIAÇÃO DE CONEXÃO
    image: postgres
    container_name: database_ignite
    restart: always
    ports: 
      - 5432:5432
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=ignite
      - POSTGRES_DB=rentx
    volumes:
      - pgdata:/data/postgres


  app:
    build: .
    container_name: rentx
    restart: always
    ports: 
      - 3333:3333
      - 9229:9229 #Você pode inserir essa porta tbm pra poder usar o debug
    volumes: 
      - .:/usr/app
    links: 
      - database
    depends_on:
      - database



volumes:
  pgdata:
    driver: local
```

Observe que no codigo acima iniciamos primeiro o container do banco de dados postgres e depois o container do node.js, como estamos usando o docker-compose temos que utilizar o comando:

```javascript
docker-compose up // Iniciar o docker container
```

>### Comandos Docker

```javascript
docker ps // Lista todos os containers
docker ps -a// Lista todos os containers que estão em execução ou parado
docker rm image // Remove um container
docker start container// Inicia o container
docker logs nomedaimagem -f // Exibe ultimos logs, com -f fica monitorando.
```




## Trabalhando com Banco de dados

3 Formas para trabalhar com banco e dados
* Drivers Nativos, é mais trabalhoso e para cada banco de dados que precisar tem que usar um driver diferente e tem suas particularidades.
* Query Builders (KNex.js), independente do banco o query builders tem um padrão.
* ORM (TypeORM), Object Relation Map, semelhante ao midleware aonde tem algo no meio entre o banco de dados e nossa aplicação.

Escolhemos o TypeORM para o projeto porque é compativel com TypeScript.

>### Instalando o TypeORM
```javascript
yarn add typeorm reflect-metadata
yarn add pg
```

No Tsconfig.json configurar:
```javascript
"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

>### Conexão com banco de dados

* Criar a pasta database dentro de src
* Criar arquivo de comunicação do banco de dados conforme documentação.
* Criar arquivo de conexão conforme documentação do TypeORM.

Se não precisar usar o TypeORM e docker, use essa configuração no index.ts do database:
```javascript
import { createConnection } from 'typeorm';
createConnection();
```

Se precisar fazer conexão com banco de dados usando TypeORM e docker, use essa configuração:

```javascript
import { createConnection, getConnectionOptions } from 'typeorm';

interface IOptions {
  host: string;
}

getConnectionOptions().then(options => {
  const newOptions = options as IOptions;
  newOptions.host = 'database'; // Essa opção deverá ser EXATAMENTE o nome dado ao service do banco de dados
  createConnection({
    ...options,
  });
});
```


Criar script para o TypeOrm, dessa forma podemos usar o CLI do TypeORM.
```javascript
"typeorm": "ts-node-dev ./node_modules/typeorm/cli";
```

>### Migration


```javascript
yarn typeorm migration:run
yarn typeorm migration:create -n CreateCategories
yarn typeorm migration:create -n AlterUserDeleteUserName
```

>### Mapear modelo em tabela

* Mudamos o nome da pasta model para entities.
* Quando habilitamos as config de experimentalDecorators isso permitiu usar as anottations do TypeORM.
* Refatoramos todo o codigo dos repositorios para utilizar o TypeORM.

## Injeção de dependência

>### Conhecendo TSyringe

Biblioteca para realizar injeção de dependencias.

```javascript
yarn add tsyringe
```

* A injeção de dependencias sera utilizado por todos os modulos, crie uma pasta shared.
* Dentro de shared, foi criado uma pasta container e um arquivo index.ts que sera o arquivo principal para configurar as dependencias.
* No service, adicionamos o @inject("CategoriesRepository") e @injectable().
* @injectable() é uma anotação que declaramos no service para poder fazer uma injeção de dependencia no controller que vai usar esse service, exemplo: container.resolve(CreateCategoryUseCase)
* @inject("CategoriesRepository") que foi declarado no service tem como objetivo adicionar um objeto direamente do container (index.ts), neste caso o repositorio.

Se observar, podemos fazer injeção de dependencias do que esta cadastrado no arquivo container -> index.ts ou podemos declarar uma classe com a anotação @injectable() aonde poderemos fazer uma injeção dessa classe em algum lugar.

No projeto, estamos deixando o repositorio para ser injetado no service quando necessario e transformando as classes dos services em classes que serão injetadas pelo tsyringe.

## Usuário

Instalar a biblioteca
```javascript
yarn add bcrypt
yarn add @types/bcrypt
```

>### JWT
* Criar uma rota que valida a sessão.
* JWT é dividido em 3 partes
  * Header -> Define o tipo e o hash.
  * Payload -> Não passar dados criticos, apenas informações necessarias.
  * Verify Signature -> Composto pelo encode do Header e do Payload.

```javascript
yarn add jsonwebtoken
yarn add @types/jsonwebtoken
```  

* Metodo sign({},'senhatoken123456'); -> usado para gerar o token.
* Criar uma pasta middlewares dentro de src.
* Um token JWT tem como padrão a escrita: bearer codigoToken.
* Criar um middleware que valida os tokens, nesse middleware pegamos o cabeçalho da requisição e verificamos se existe um token.

>### Tratamento de exceções

* Criar uma pasta errors dentro de src.
* Criamos uma classe AppError para tratar as exceções dentro da pasta errors.
* A partir deste momento, importamos e usamos essa classe de erro.
* No arquivo principal, server.ts, criamos um middleware para tratar o erro.
* Instalar a biblioteca express-async-errors porque o express não sabe lidar com erro customizado.

```javascript
yarn add express-async-errors
``` 
* Importamos a biblioteca em server.ts

## Avatar de usuário

* Permiter que usuario faça upload do avatar.
* Quando estamos trabalhando com typescript, em dado momento podemos ter que escrever nossa propria tipagem ou sobrescrever.
  * Criamos uma pasta @types dentro do src.
  * Criamos uma pasta da biblioteca que queremos sobrescrever, no caso express.
  * Criamos um arquivo index.d.ts que é o arquivo de tipagem.
  * Dentro do arquivo index.d.ts, declaramos a interface Request do Express, adicionamos os parametros que precisamos.
* Refatoramos a organização do multer para realizar upload de arquivos.
  * Criar a pasta config dentro de src.
  * Criar arquivo upload.ts.
  * Utilizar o arquivo upload.ts nas rotas que precisa fazer upload.
* Criamos uma pasta util dentro de src que vai conter metodos util para toda a aplicação.
  * Criamos uma função para deletar um arquivo de uma pasta especifica.




