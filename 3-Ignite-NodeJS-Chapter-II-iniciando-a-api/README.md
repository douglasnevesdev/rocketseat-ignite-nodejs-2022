
# Iniciando a API

## TypeScript

>### O que é Typescript?

* Uma linguagem open-source
* Superset do Javascript
* Tipagem estática

>### Por que usar o TypeScript?

* Controle maior dos parametros e tipos de variaveis.

>### Mitos e Verdades TypeScript?

* Mito -> Typescript veio para substituir o Javascript.
* Verdade -> Posso usar o typescript com Javascript no mesmo projeto.
* Verdade/Mito -> A produtividade co Typescript diminui.
* Mito -> Typescript veio para transformar JS em C# ou Java.
* Verdade -> Typescript auxilia no desenvolvimento

>### Criando projeto com Typescript

```javascript
yarn init -y
yarn add express
```

* Usar extensão .ts porque estamos usando typescript.
* Sempre instalar os tipos, ex: @types/express, observar que fica ... na biblioteca que precisa instalar os tipos.

Instalação do TypeScript.
```javascript
yarn add typescript -D
```
Inicializar o TypeScript, apos rodar o comando sera criado um arquivo de configuração do Typescript.
```javascript
yarn tsc --init
```
Para converte codigo javascript para Typescript use o comando:
```javascript
yarn tsc
```
Configurações feitas no config do TypeScript
```javascript
"outDir": "./dist" //Diretorio dos arquvios .js transformados em .ts pelo comando yarn tsc
```
Executando o arquivo .ts
```javascript
node dist/server.js
```
* Apresentou o conceito de interface para definir os tipos de atributos do objeto.
* Recomendação de utilizar objeto no parametros ao inves de cada parametro.

## Criando a API com NodeJS

>### Configurar Eslint, Prettier e EditorConfig

* Instale a extensão do Eslint.
* Configure o settings do vscode.
```javascript
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```
>### Eslint
```javascript
yarn add eslint -D
yarn eslint --init
```
Escolha as seguintes opções:
* To check syntax, find problems and enforce code style
* Javascript modules (import/export)
* None of these
* Yes
* Node
* Use a popular style guide
* Airbnb
* JSON
* Yes

Agora digite:
```javascript
yarn
yarn add -D eslint-plugin-import-helpers eslint-import-resolver-typescript
```
Crie um arquivo na raiz .eslintignore com conteudo
```javascript
/*.js
node_modules
dist
```
Configuração final do arquivo .eslintrc.json
```javascript
{
    "env": {
        "es2020": true,
        "node": true,
				"jest": true
    },
    "extends": [
        "airbnb-base",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "eslint-plugin-import-helpers"
    ],
    "rules": {
      "camelcase": "off",
			"import/no-unresolved": "error",
			"@typescript-eslint/naming-convention": [
			  "error",
			  {
			    "selector": "interface",
			    "format": ["PascalCase"],
			    "custom": {
			      "regex": "^I[A-Z]",
			      "match": true
			    }
			  }
			],
			"class-methods-use-this": "off",
			"import/prefer-default-export": "off",
			"no-shadow": "off",
			"no-console": "off",
			"no-useless-constructor": "off",
			"no-empty-function": "off",
			"lines-between-class-members": "off",
			"import/extensions": [
			  "error",
			  "ignorePackages",
			  {
			    "ts": "never"
			  }
			],
			"import-helpers/order-imports": [
			  "warn",
			  {
			    "newlinesBetween": "always",
			    "groups": ["module", "/^@shared/", ["parent", "sibling", "index"]],
			    "alphabetize": { "order": "asc", "ignoreCase": true }
			  }
			],
			"import/no-extraneous-dependencies": [
			  "error",
			  { "devDependencies": ["**/*.spec.js"] }
			]
    },
    "settings": {
        "import/resolver": {
            "typescript": {}
        }
    }
}
```


>### Prettier

Antes de começar a configuração é importante que você se certifique de remover a extensão Prettier - Code Formatter do seu VS Code, ela pode gerar incompatibilidades com as configurações que vamos fazer.

```javascript
yarn add prettier eslint-config-prettier eslint-plugin-prettier -D
```

Se precisar usar o prettier, altera o arquivo .eslintrc.json

```javascript
{
	...
  "extends": [
		...
    "prettier",
    "plugin:prettier/recommended"
  ],
  ...
  "plugins": [
    ...
    "prettier"
  ],
  "rules": {
    ...
		"prettier/prettier": "error"
  },
  ...
}
```

*Na raiz do projeto, crie um arquivo -> prettier.config.js com o seguinte conteudo.
```javascript
module.eports = {
  singleQuote: false,
}
```

>### EditorConfig
Instale a extensão editorconfig no vscode, deixe a configuração padrão.

>### Biblioteca auxiliar
A biblioteca ts-node-dev auxilia na conversão de javascript para typescript.
```javascript
yarn add ts-node-dev -D
```
Para utilizar a biblioteca criamos um script no packege.json.
* --transpile-only: Executa tudo ignorando os erros.
* --ignore-watch node_modules: Ignora a conversão de node_modules
* --respawn: Reinicia e inicia a aplicação quando houver mudanças.
```javascript
  "scripts": {
    "dev": "ts-node-dev --transpile-only --ignore-watch node_modules --respawn src/server.ts "
  },
```
No tsconfig.js desabilitamos o "strict": true que checa os erros na aplicacão, como estamos usando TypeScript que lida muito bem com essa parte, essa configuração pode ser ignorada.

>### Debugando a aplicação

* Para ativar o Debug, clique no menu esquerdo no icone com play+debug
* Depois clique em create a launch.json file.
* Escolha NodeJS.
* Deixe na seguinte configuração
```javascript 
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "outFiles": [
        "${workspaceFolder}/**/*.js"
      ]
    }
  ]
```
* Modifique o scripts -> dev, adicionando --inspect que permite nossa aplicação ser debugada.

```javascript 
  "scripts": {
    "dev": "ts-node-dev --inspect --transpile-only --ignore-watch node_modules --respawn src/server.ts "
  }
```

* Criação da pasta routes para organizar todas as rotas.
* Quando não usamos export default exemplo na importação usamos {}


>### UUID
Identificador unico universal.

```javascript 
yarn add uuid
yarn add @types/uuid -D
```

>### Model

* Criamos a pasta model para definir os tipos de modelos que vamos ter na aplicação, dessa forma podemos definir alguns padrões que esperamos nas variaveis da aplicação.

>### Object.assings()
Função que ajuda a construit um objeto.
```javascript 
  const category = new Category();
  Object.assign(category, {
    name,
    description,
    created_at: new Date(),
  });
```

>### Repositorios

Uma camada, uma classe que sera responsavel por fazer toda manipulação no banco de dados.

* Criamos uma pasta repositories

>###  DTO -> Data Transfer Object
Criar um objeto que sera responsavel para fazer transferencia entre uma camada ou classe e outras.
Usaremos o DTOs para pegar os valores que chegam da rota e receber nos repositorios.


## S.O.L.I.D

>### S -> SRP - Single Responsability Principle (Princípio da Responsabilidade Única)
* Criamos uma pasta services
* Um service tem apenas uma responsabilidade.
* Tem apenas um metodo, execute(){} e pode ter parametros.
* O service não reconhece o Request e Response, afinal estamos usando express e podemos mudar.
* Quando precisamos retorna um erro, lançamos um throw new Error(); que é uma classe fornecida pelo javascript.

>### O -> OCP - Open-Closed Principle (Princípio aberto/fechado)
>### L -> LSP - Liskov Substituion Principle (Princípio de Substituição de Liskov)

* Esta muito atrelado ao Dependy Inversion Principle.
* Se você tem uma classe S, e essa classe é um subtipo de T, então todos os objetos do tipo T dentro de um programa eles podem ser substituido por um objeto do tipo S, sem ser necessario alterar as propriedades desse programa.
* Para você criar um sistema de softwares, as partes intercambiaveis devem aderir um contrato que permita que elas sejam substituidas umas pelas outras sem que ocorra impactos no sistema.
* Isso significa que o Service tem que receber no construtor uma interface de um tipo de repository ao inves de uma classe concreta, ou seja, se eu tiver uma classe que implementa essa interface ela pode ser utilizada pelo service sem problemas, ex: Tenho uma classe que implementa essa interface e faz todos os processos para o banco postgres, se precisar trocar o banco para o mysql, basta criar uma classe Mysql que implementa a interface que nada afetara o service, no fim a classe Mysql é um subtipo da interface. 
* Então quando precisar trocar a forma como a informação é gravada, precisamos apenas criar uma classe, implementar a interface e utilizar sem prejudicar o funcionamento do service.


>### I -> ISP - Interface Segregation Principle (Princípio da Segregação de Interface)
>### D -> DIP - Dependency Inversion Principle (Principio da Inversão de Dependência)

* Um codigo que implementa uma politica de alto nivel não deve depender do codigo que implementa detalhes de baixo nivel.
* Exemplo: O service não tem que conhecer o tipo do repositorio, nosso service é o alto nivel (mais perto do dominio) e as rotas é o baixo nivel porque esta mais perto do usuario.
* Devido a isso preciamos ter a inversão de dependencia, ou seja, nosso service vai ter um construtor para receber o repositorio.



## Continuação da aplicação

Podemos estruturar nossa aplicação em modulos, podemos pensar em modulos sendo pequenos blocos da nossa aplicação.
* Criamos a pasta modules, aonde iremos isolar ainda mais as responsabilidades da aplicação.
* Iniciamos criando a interface do repositorio e depois sua implementação, apos conclusão desenvolvemos o service que vai receber no seu construtor a interface do repositorio e por ultimo criamos a rota.

Rotas estão com muita responsbilidade, afinal elas chama o service, então vamos separar ainda mais as responsabilidades utilizando Controllers, que basicamente recebe a requisição e retorna.

Dentro de modules criamos uma pasta UseCases (Regras de negocio da aplicação), aonde usaremos essa pasta para melhorar a organização, exemplo, um useCase para criação de categoria, outro para criação de Specifications e nesta pasta vamos criar o controller e ao inves de usar o service, nos vamos renomealos para UseCase.

Importante, no controller temos um metodo handle que vai receber um Request e um Response e um construtor para receber o service.

Criamos dentro da pasta modules/dominio uma pasta useCases, aonde tera como seu conteudo o service que foi renomeado para UseCase e um controller, por fim criamos um arquivo index.ts no useCases para que ele possa instanciar tudo que precisamos, neste caso uma implemementação de repositorio, um service que agora é usecase e um controller que espera receber um service.

Todo useCase tem apenas um controller.


>### Singleton
Tem como padrão criar apenas uma instancia de uma classe que sera utilizada globalmente.

>### Separação de repositorios

Criar uma pasta implementations dentro de repositorios, separando assim as implementações das interfaces.

>### Organização do Routes
Criar um arquivo index.ts dentro da pasta routes.

## Trabalhando com Upload

>### Multer

Biblioteca para leitura e upload de arquivos.
Criamos um midleware para receber os arquivos.
Criamos uma pasta temporaria no diretorio raiz.

```javascript 
yarn add multer
yarn add @types/multer
``` 

>### ReadyFile
Poderiamos usar o readyFile do node, porem se for um arquivo pesado, ele vai baixar de uma vez, isso pode travar o node.js ou usar muita memoria.

>### StreamFile
Permite ler um determinado arquivo por partes.
Podemos usar o fs que é nativo do nodejs para stream.
O nodejs tem um pacote de stream que tem varias funções para construir um player.

>### CSV Parser
Biblioteca para leitura de arquivo CSV, por exemplo, ela permite ler linha a linha.

>### Importante
Temos a função parseFile.on() aonde temos que esperar o retorno da função, para facilitar, usamos uma promise.

## Iniciando a documentação

Biblioteca para realizar documentação.
```javascript 
yarn add swagger-ui-express
``` 
É preciso importa dentro do server.ts, criar uma rota aonde a documentação sera iniciada e criar um arquivo .json de configuração da documentação dentro de src.

Dentro do arquivo tsconfig.json habilite o typescript para aceitar arquivos no formato json.
```javascript 
  "resolveJsonModule": true
``` 
Toda documentação precisar ser construida no arquivo swagger.json

