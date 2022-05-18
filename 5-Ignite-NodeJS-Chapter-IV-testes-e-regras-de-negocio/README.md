
# Testes e regras de negócio

## Testes

>### Conhecendo tipos de testes

* Testes unitários
  * Testar pedaços da aplicação.
  * Testar regras de negocio.
  * Conseguimos validar os casos de sucesso e erro da regra de negocio.
  * Não testamos no banco real.


* Testes de Integração
  * Testar a aplicação inteira.
  * Desde o momento em que a uma rota é chamada ate o retorno da requisição.
  * Testamos o fluxo completo da aplicação. 
  * Não testamos no banco real.
  * Routes -> Controllers -> UseCases -> Repository
  * Repository <- UseCases <- Controllers <- routes


* TDD (Test Driven Development)
  * Metodologia para realizar teste.
  * Começamos pelo teste primeiro, para depois a funcionalidade.
  * A vantagem é que se uma regra de negocio mudar, quando fazemos o teste, você identifica, ajudando a prever erros.
  * A devantagem é o tempo para adaptação.


>### Criando o primeiro teste

* Instalar a biblioteca JEST para realizar testes.
```javascript
yarn add jest @types/jest -d
```

* Agora execute o comando:
```javascript
yarn jest --init
```

* Preencha o questionario
```javascript
Would you like to use Jest when running "test" script in "package.json"? -> YES
Would you like to use Typescript for the configuration file? -> YES
Choose the test environment that will be used for testing  -> Node
Do you want Jest to add coverage reports? -> No
Which provider should be used to instrument code for coverage? -> V8
Automatically clear mock calls and instances between every test? -> Yes
```
* Um arquivo jest.config.ts sera criado na raiz do projeto.

* Para usar o jest com javascript sera necessario instalar uma dependencia.
```javascript
yarn add ts-jest -d
```

* Agora no arquivo de configuração do Jest, faça a seguinte alteração:
```javascript
preset: "ts-jest",
```

* Definimos a pasta aonde vai ocorrer os testes, para esse projeto optamos em deixar para as pastas de useCase, então definimos para ele encontrar em todas as pastas os arquivos .spec.ts
```javascript
  testMatch: [
    "**/*.spec.ts"
  ],
```

* Ainda no arquivo jest.config.ts modificamos a propriedade abaixo que define para o jest parar caso encontre algum erro.
```javascript
bail: true, 
```

* A partir deste momento, criamos nossos testes em cada caso de uso, exemplo: CreateCategoryUseCase.spec.ts
* Estruturando o teste
  * describe('Criar categoria', ()=>{}) dentro dele colocamos tudo o que o teste faz.
  * it(' descrição do que espera do teste ', ()=>{}) fica dentro do describe, esse é o teste.
  * expect() Define o que esperamos do resultado.
  * Exemplo abaixo:
```javascript
describe('Criar categoria', () => {
  it(' Espero que 2 + 2 seja 4 ', () => {
    const soma = 2 + 2;
    const resultado = 4;
    expect(soma).toBe(resultado);
  });

  it('Espero que 2 +2  não seja 5', () => {
    const soma = 2 + 2;
    const resultado = 5;
    expect(soma).not.toBe(resultado);
  })
});
```  

>### Teste de criação de categoria

* Criamos uma pasta chamada in-memory dentro da pasta repositories de um modulo, nessa pasta teremos fake banco de dados.
* Modificamos o arquivo tsconfig.json.
```javascript
"baseUrl": ".",
``` 
>### Teste de autenticação do usuário

* Criamos os teste da parte de autenticação.
* Para criar um teste unitario, siga os passos:
  * Crie um repositorio (in-memory)
  * Agora crie um arquivo com o nome do useCase com o final .spec.ts
  * Crie as variaveis com repositorios e useCases que você precisar, lembre-se de usar repositorio in-memory(fake).
  * Inicie o codigo de teste com describe('', ()=>{});
  * Dentro dele use o beforeEach(()=>{}) para carregar os objetos.
  * Depois, utilizando o metodo it('', ()=>{}) Define o teste.
  * Não se esqueça de declarar no final o que é esperado do teste, usando o metodo .expect(() => {});

>### Imports da aplicação

* O TypeScript fornece um recurso para facilitar a importação.
  * Dentro do arquivo tsconfig.json, temos uma propriedade paths, definimos nessa propriedade os imports.

```javascript
   "paths": {
      "@modules/": [
        "modules/*"
      ],
      "@config/": [
        "config/*"
      ],
      "@shared/": [
        "shared/*"
      ],
      "@errors/*": [
        "errors/*"
      ],
      "@utils/*": [
        "@utils/*"
      ]
    },
``` 
* No eslintrc.json, modificamos a parte de imports para o eslint entender que toda importação com @ pertence a nossa aplicação

```javascript
"groups": [
          "module",
          "/^@/",
          [
            "parent",
            "sibling",
            "index"
          ]
        ],
```

* Infelizmente o ts-nod-dev não entende as novas importações com @, então precisamos instalar uma dependencia.
```javascript
yarn add tsconfig-paths -d
```
* Agora dentro do arquivo package.json, precisamos adicionar um parametro no script. 
```javascript
-r tsconfig-paths/register
```
* Alteramos então o dev e typeorm conforme abaixo.
```javascript
  "dev": "ts-node-dev -r tsconfig-paths/register --inspect --transpile-only --ignore-watch node_modules --respawn src/server.ts ",
  "typeorm": "ts-node-dev -r tsconfig-paths/register ./node_modules/typeorm/cli",
```

>### Corrigindo as importações

* Precisamos mudar o jest.config.ts para que os testes execute aceitando as importações com @.
* No jest.config.ts faça a seguinte importação:
```javascript
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import { compilerOptions  } from './tsconfig.json';
```
* Ainda no jest.config.ts faça a seguinte configuração:
```javascript
 moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/src/"
  }),
```
* Agora no arquivo tsconfig.json, apague os comentarios.

>### Refatorando a aplicação

* Vamos criar uma camada chamada infraestrutura aonde vamos armazenar nossa camada externa (framework de banco, biblioteca para envio de e-mails), que não deve ser responsabilidade da regra de negocio, vamos inserir na pasta infra.
* Dentro de cada modulo, criamos uma pasta infra.
* Migramos nossas entidades para a pasta infra, nesse projeto as entidades estão vinculadas com TypeORM, dessa forma é importante pertencer a pasta infra.
* Migramos nossos repositorios para a pasta infra, nesse projeto os repositories estão vinculados com TypeORM, dessa forma é importante pertencer a pasta infra.
* Dentro de shared, criamos uma pasta infra, aonde armazenamos os middlewares da aplicação que tem ligação com Express.
* Dentro de shared, migramos as rotas da aplicação, porque elas tem ligação com Express e são utilizadas por toda aplicação.
* Server.ts é baseado em Express, migramos para a pasta shared.
* A pasta errors é utilzado de forma global por toda aplicação, então migramos para a pasta shared.
* Fique atento a um ponto, observe que tenho itens dentro de shared que são usados de modo global e tenho itens dentro da pasta infra que é aonde é definido um tipo de tecnologia utilizada como por exemplo typeorm e express.
* Migramos a pasta databse para shared/infra, porque o banco de dados esta ligado a typeorm e renomeamos a pasta database para typeorm.
* Mudamos o script no arquivo package.json para reconhecer o novo caminho do server.ts.
* Mudar no arquivo container.ts o caminho de acordo com nossa configuração.

## Requisitos

>### **RF** => Requisitos 
Funcionalidades que nossa aplicação vai ter, exemplo, o usuario pode cadastrar uma categoria, resetar uma senha e etc.

>### **RNF** => Requisitos não funcionais 
Não estão ligados a regra de negocio, exemplo, os dados devem ser guardados no banco de dados postgres, é mais um conceito de qual biblioteca utilizar.

>### **RN** => Regra de Negocio
São as regras por tras dos requisitos, exemplo, não deve ser possivel cadastrar uma categoria com tamanho inferior a 4.

### Cadastro de Carros

**RF**
* Deve ser possivel cadastrar um novo carro.


**RN**
* Não deve ser possivel cadastrar um carro com uma placa ja existente.
* O carro deve ser cadastrado, por padrão, com disponibilidade.
** O usuario responsavel pelo cadastro deve ser um usuario administrador.

### Listagem de Carros

**RF**
* Deve ser possivel listar todos os carros disponiveis.
* Deve ser possivel listar todos os carros disponiveis pelo nome da categoria.
* Deve ser possivel listar todos os carros disponiveis pelo nome da marca.
* Deve ser possivel listar todos os carros disponiveis pelo nome da carro.

**RN**
* O usuario não precisa estar logado no sistema.

### Cadastro de especificação do carro

**RF**
* Deve ser possivel cadastrar um especificação para um carro.
* Deve ser possivel lsitar todas as especificações.
* Deve ser possivel listar todos os carros.

**RN**
* Não deve ser possivel cadastrar uma especificação para um carro não cadastrado.
* Não deve ser possivel cadastrar uma especificação ja existente para o mesmo carro.
* O usuario responsavel pelo cadastro deve ser um usuario administrador.

### Cadastro de imagens do carro

**RF**
* Deve ser possivel cadastrar a imagem do carro.

**RNF** 
* Utilizar o multer para upload de arquivos


**RN**
* O usuario deve poder cadastrar mais de uma imagem para o mesmo carro.
* O usuario responsavel pelo cadastro deve ser um usuario administrador.

### Aluguel de carro

**RF**
* Deve ser possivel cadastrar um aluguel

**RNF**

**RN**
* O aluguel deve ter duração minimo de 24 horas.
* Não deve ser possivel cadastrar um novo aluguel caso ja exista um aberto para o mesmo usuario.
* Não deve ser possivel cadastrar um novo aluguel caso ja exista um aberto para o mesmo carro.

### Devolução de carro

**RF**
* Deve ser possivel realizar a devolução de um carro

**RNF**

**RN**
* Se o carro for devolvido com menos de 24 horas, deverá ser cobrado diaria completa.
* Ao realizar devolução, o carro deverá ser liberado para outro aluguel.


## Carros

>### TDD na prática

* Segue o ciclo de TDD
  * Criamos um teste simples que vai falhar
  * Faremos o mesmo teste passar.
  * Refatoramos com a regra de negocio.

>### Estruturando a entidade de carros

* Para facilitar, na entidade, podemos ter acesso a um objeto do tipo necessario, por exemplo, na entidade carros temosum category_id, para facilitar, adicionamos um objeto do tipo categoria para ter acesso as informações.
  * Para isso criamos uma variavel do tipo Categoria na entidade carro.
  * Usamos a anotação JoinColumn fazendo referencia a variavel category_id.
  * Declaramos tambem que podemos ter muitos carros para uma categoria, ou seja, sempre pensamos da nossa entidade para o relacionamento, então ficaria de carros para categorias.

```javascript
  @ManyToOne(() => Category)
  @JoinColumn({ name: "category_id" })
  category: Category;

  @Column()
  category_id: string;
```  

* Passos do desenvolvimento - TDD
  * Criar entidade, não precisa estar relacionada no typeorm inicialmente.
  * Criar o TDD + Service, inicialemente, o Service não vai usar um repositorio real e não tera injeção.
  * Criar interface do repositorio de acordo com a necessidade.
  * Criar repositorio in-memory
  * Validar o teste TDD.
* Uma vez aprovado no teste, faça o seguinte:
  * Na entidade, adicionar o typeORM.
  * Criar um repositorio.
  * Adicionar na injeção de dependencia (context).
  * Criar o controller. 
  * Criar rotas

>### Criando seed de usuário

* Seed: Quando criamos um dado e rodamos pela propria aplicação.
* Criamos uma pasta em typeorm, dentro de shared com o nome seed.
* Dentro da pasta seed, criamos uma função de criação de usuario administrador.
* Modificamos o arquivo de conexão com banco de dados para a conexão do banco de dados, com isso podemos usar essa conexão nos seed.

>### Criando middleware de administrador

* Criamos um middleware para validar se o usuario é administrador.
* Na rota de cars, adicionamos o middleware de autenticação e admin.
* Middleware é executado por ordem de declaração na função.

>### Criando migrations especificação dos carros (Many to Many)

* Iniciamos criando a tabela, utilizando o migration.
  * Existe algumas formas de criar uma ForeignKey, compare a migration CreateCars e CreateSpecificationsCars.
* Criar o useCase
  * Metodo execute()
  * Utilizar interfaces para os parametros utilizados pelo execute.
  * Inicialmente, como estamos fazendo teste, não usamos injeção de dependencia.
  * Utilizar o construtor para receber uma instancia do repositorio que vai seguir uma interface.
* Criar o useCase.spec
  * Iniciamos com describe, depois o it para descrever o teste.
  * Uma instancia do useCase.
  * BeforeEach para iniciar as instancias antes de realizar o teste.
  * Executar os testes para validar se funcionou.
  * Criar uma instancia do repositorio de teste.
* Criar o arquivo de interface do repositorio.  
* Criar o arquivo que implementa o repositorio em memoria para realizar os testes.
* Criar o aquivo que implementa o repositorio do banco de dados.

>### Criando migrations de imagens do carro

* Criar a migration
* Criar a pasta do useCase
* Criar a classe controller e useCase, apenas o arquivo com a classe declarada e as exportações.
* Criar entidades.
* Criar as intefaces do banco de dados.
* Criar a implementação do repositorio em in-memory.
* Criar a implementação do repositorio do banco de dados.
* Criar o caso de uso de teste junto com o caso de uso.
* Criar a rota


## Aluguel

>### Criando migrations do aluguel

* (1) Criar migrations.
* (2) Analisar se é um novo modulo ou pertence a um modulo existente, neste caso, modulo novo.
* (3) Criar pasta no useCase.
  * (9) Criar arquivo com a classe useCase.
    * (9.1) Utilizar o metodo execute()
  * (10) Criar arquivo com a classe controller.
    * (10.1) Utilizar o metodo handle()
  * (11) Criar arquivo TDD.  
* (4) Criar pasta repositories.
  * (13) Criar repositorio in-memory
    * (13.1) Utilizar array para armanzenar.
* (5) Criar pasta Infra.
  * (6) Criar pasta typeorm.
    * (7) Criar pasta entities
      * (12) Criar a entidade sem typeorm inicialmente.
    * (8) Criar pasta repositories


>### Trabalhando com datas com dayjs

* Biblioteca para trabalhar com datas
```javascript
yarn add dayjs
```

>### Criando Controller

* Para evitar problemas de reflect-metada, fizemos alterações.
  * Modificar o arquivo arquivo jest.config.ts
    * Adicionar import reflet-metada
    ```javascript
      import 'reflect-metadata';
    ```
    * Remover comentario da variavel.
    ```javascript
    setupFilesAfterEnv: ['<rootDir>/jest.config.ts'],
    ```
* Outra alternativa seria criar um arquivo jest.setup.ts na raiz do projeto, editar o jest.config.ts, no caso, descomentando a linha abaixo:
```javascript
 setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],   
```
* No arquivo jest.setup.ts fazer o import do reflect-metada.
* Essas 2 formas apresentadas soluciona o problema.


## Testes de integração

>### Configurando supertest

* Teste de integração da aplicação.
* Vamos instalar uma biblioteca (supertest) que crie uma especie de servidor http para testar toda aplicação.
```javascript
yarn add supertest @types/supertest
```
* Para cada controller da aplicação, foi elaborado um spec.ts.
* Renomeados o server.ts para app.ts e criamos outro server.ts no lugar.
* Com essa separação do app.ts e server.ts informamos ao nosso teste que não queremos de fato que a aplicação seja iniciada, mais que apenas faça o teste, em resumo, quando separamos conseguimos obter as informações do servidor (app.ts) sem iniciar o servidor (server.ts).
* Criamos uma database de teste para ser utilizada no supertest.
* Editamos o arquivo principal do typeorm para entender quando estamos usando o banco de dados de teste.
* Criamos nosso arquivo .env para armazenar as variaveis de ambiente da aplicação, um ponto importante é saber que no package.json podemos usar variaveis de ambiente, veja o exemplo abaixo:
```javascript
 "test": "set NODE_ENV=test && jest",
```
* Foi instalado a biblioteca cross-env para resolver o problema do windows não reconhecer a variavel de ambiente
```javascript
"test": "cross-env NODE_ENV=test jest",
```
* É necessario lembrar alguns pontos:
  * Cada useCase tem seu teste correspondente aonde obtemos as informações do banco de dados em memoria, ou seja, testamos as regras de negocio.
  * Cada Controller tem seu teste correspondente, aonde testamos cada rota da aplicação, obtemos as informações do banco de dados de teste que é criado igual ao banco de dados original que vamos usar porem é apagado quando os testes são concluidos.s
