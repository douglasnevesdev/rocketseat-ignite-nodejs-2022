# Carro

* Alteração no package.json adicionado os seguintes parametros.
```javascript
    "test": "cross-env NODE_ENV=test jest --runInBand --detectOpenHandles",
```
  * --runInBand -> Garante que o codigo vai ser executado de forma sincrona.
  * --detectOpenHandles -> Detecta se tem algum teste em aberto, comprometendo o teste.
  
  
# Autenticação

>### Refresh Token
* O token esta programado para expirar.
* Toda vez que o token expira, para o usuario não precisar autenticar novamente, usamos o conceito de refresh token.
* No momento em que o usuario realiza a autenticação um refresh token é criado e sera utilizado posteriormente quando a aplicação identificar o token como expirado.
* Dessa forma o usuario sempre esta autenticado porem o token sempre vai mudar.
* Precisamos salvar o refresh token no banco de dados, o refresh token pode ser um dado criptografado.
* Podemos ter mais de um token para o mesmo usuario.
* Criamos uma tabela para armazenar o refresh token.
* Iniciamos o processo de criação do Refresh_token.
  * Criamos a tabela para armazenamento do refresh_token.
  * Criamos a entidade com typeorm.
  * Criamos o repositorio para armazenar as informações.
  * Dentro de AuthenticateuUserUseCase, adicionamos o repositorio do reflash_token.
  * Criamos um arquivo de configuração para autenticação dentro de config.
  * Criamos um usecase(execute) e controller(handle) para o refreshtoken.
* Partimos do principio que sempre que alguem solicitar um novo token, tera que enviar o refresh token, assim conseguimos validar.
* Em resumo, o RefreshTokenUseCase recebe o token, verifica se esta correto, obtenho as 2 informações que estão armazenadas no token, como sub (Id do usuario) e email, verificamos se o userToken existe, se existe, removo do banco de dados para não encher dados desnecessarios e gero um novo refresh token.


# Recuperação de Senha

* Usar esse serviço para receber e-mail fake.
* https://ethereal.email/
* Instalamos a biblioteca Nodemailer
```javascript
  yarn add nodemailer
```
>### Inserindo template engine para envio de e-mail
* Instalamos a biblioteca handlebars para criação de template de e-mail.
```javascript
  yarn add handlebars
```
* Essa biblioteca parte do principio que estamos construindo a view do e-mail a partir de um body, logo não precisa das declarações HTML.
  * Toda variavel que precisamos no e-mail colocamos entre {{variavel}}
  
# Testes
* A função spyOn(), utiliza em arquivos .spec.ts é fornecido pelo Jest fica espiando uma classe, se dentro da requisição esse classe for requisitada ele identifica.
* No arquivo jest.config.ts ativei opção 
```javascript
collectCoverage: true
```
* Mapeamos a pasta o Jest precisa analisar 
```javascript
 collectCoverageFrom: ['<rootDir>/src/modules/**/useCases/**/*.ts']
```
* Diretorio para o coverage salvar os arquivos necessarios   
```javascript
coverageDirectory: 'coverage'
```
* Reports
```javascript
  coverageReporters: [
    "text-summary",
    "lcov",
  ],
```
* Uma pasta sera criada na raiz do projeto chamada coverage.
