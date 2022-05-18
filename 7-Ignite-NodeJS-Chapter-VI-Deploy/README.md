# Refresh Token
* O token é utilizado para fazer a requisição, quando o token expirar o usuario utiliza o refresh token para criar um novo token.
* Quem define tudo é o token e o refresh token é apenas utilizado para gerar um novo token quando necessario.
  
# Configuração AWS
* Storages (s3) -> Armazenamentos especificos utlizado para realizar uploads.
* Criar conta no amazon.
* Criar conta s3
  * No amazon, escolha IAM.
  * Crie um usuario e selecione Acesso programático.
  * Nas permissões, digite na pesquisa s3 e selecione AmazonS3FullAccess.
  * Nas proximas tela, avance ate o final.
    *ID da chave de acesso -> ***, Chave secreta -> *****, usuario -> rentx-s3
* Agora pesquise por S3 no amazon e vai aparecer um elemento com icone verde, nessa tela vamos criar um Buckets.
  * Crie um novo bucket -> api-rentx99, importante, desmarque Bloquear todo o acesso publico, lembre-se o nome precisa ser unico, ou seja, unico para toda a amazon.
  * Agora podemos fazer upload diretamente dentro da amazon ou dentro da aplicação.
* Agora instale a biblioteca no backend.
```javascript 
yarn add aws-sdk
```  
* No google, pesquise por -> aws sdk environment variables ou acesse o link -> https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-environment.html, para facilitar, a amazon fornece as variaveis de ambientes que vamos precisar adcionar no .env
* Adicionamos as variaveis necessarias.
  * AWS_ACCESS_KEY_ID=*******
  * AWS_SECRET_ACCESS_KEY=********
  * AWS_BUCKET=api-rentx99
* Para obter os formatos certos dos arquivos de upload vamos usar uma biblioteca mime.
```javascript
yarn add mime
yarn add @types/mime -D
```  
* Toda vez que no await temos ... significa que não é uma promise, ou seja, podemos transforma ele em uma promise utilizando a função promise() no fim do metodo.
```javascript
await this.client.putObject({
  Bucket: `${process.env.AWS_BUCKET}/${folder}`,
  Key: file,
  ACL: 'public-read',
  Body: fileContent,
  ContentType
}).promise();
```
* Instalar a dependencia dotenv para as variaveis globais funcionar em toda aplicação, declaramos a mesma no arquivo app.ts, uma vez que a aplicação é iniciada as variaveis são funcionais para toda aplicação.
```javascript
yarn add dotenv
```
* Conceito de mapper, quando queremos arrumar as informações do objeto para o usuario.
  * Criamos uma pasta no dominio accounts com o nome mapper.
* Adicionamos a biblioteca class-transformer que tem como objetivo manipular a entidade.
  * Essa biblioteca permite fazer manipulação de alguma classe, utilizamos nesse projeto com intenção de obter uma url para as imagens de avatar diretamente da entidade, então manipulamos nossa entidade para pegar a imagem do avatar que ela possui e retorna a url dessa imagem independente de ela estar no S3 ou Local, no mapper do usuario, retornamos as imagens, se precisar Verifique na entidade User.ts, UserMap.ts e ProfileUserUseCase
```javascript  
yarn add class-transformer
```
* Criamos uma rota estatica para visualizar imagens e arquivos necessarios.  

>### Configurando o e-mail em produção
* Serviço do amazon para enviar e-mail, SES HOME.
  * Quando trabalhamos SMTP abrimos uma requisição para o e-mail ser enviado, em alguns serviços do qual temos que enviar um e-mail em massa nosso e-mail pode ser bloqueado.
  * O Amazon SES ele tem uma forma diferente de fazer o envio, ele não abre uma nova requisição para envio de email, ele utiliza a mesma conexão para fazer envio de e-mail.
  * A Amazon fornece o recurso de SMTP porem recomenda utilizar API.
  * Para usar esse serviço, precisamos de um dominio e um e-mail dentro do Amazon SES.
* Serviço para criar e-mail gratuitamente -> https://www.zoho.com/pt-br/
* Agora acesse o IAM do amazon para conceder permissão ao usuario do bucket, ou seja, vamos integrar o mesmo usuario do bucket com o serviço de e-mail.
  * Abra o IAM.
  * Acesse o item de menu Usuarios
  * Clique no usuario utilizado no bucket.
  * Clique no botão Adicionar Permissões.
  * Escolha Anexar politicas existentes de forma direta.
  * Pesquise por ses
  * Escolha AmazonSESFullAccess
  * Confirme as demais telas.
* Dessa forma a mesma credencial podera ser utilizada.

>### Criando provider de SESMail
* No SES do Amazon o HTML retornado do e-mail fica sem formatação, para corrigir esse processo fizemos um ajuste no arquivo forgotPassword.hbs.
* No HTML do e-mail o flexbox não funciona.

# Preparando Deploy

>### Estrategias de deploy
* Devops é a pessoa responsavel para fazer o deploy da aplicação.

>### Criando uma instancia na AWS
* No amazon, procure por EC2 (Instancia).
  * Clique em instancias.
  * Executar Instancias
  * Agora selecione somente nivel gratuito.
  * Selecione Ubuntu Server 20.04 LTS 
  * Selecione a instancia gratuita disponivel e clique em proximo.
  * Nas configurações, deixe o padrão e clique em proximo.
  * Em armazenamento clique em proximo.
  * Nas TAGS clique em proximo.
  * No Security Group defina a porta de acesso usando o SSH, neste caso vamos usar 22.
  * Clique em Vericar e Ativar.
  * Clique em executar.
  * Selecione Criar um novo par de chaves, essas chaves serão usadas para fazer acesso, salve no computador.
  * Agora cliquem em executar instancias.
  * Para se conectar, selecione a instancia e tem um botão conectar.
  * Ainda no navegador, você tera uma opção de conectar que ao clicar o terminal da instancia é aberto.
  * Você pode usar o SSH para realizar a conexão.

>### Configurando instancia
* Iniciamos criando nosso usuario
  * sudo adduser app
  * defina a senha, neste caso app.
  * nos demais, aperte enter ate o fim e depois Y na ultima opção.
  * Conceda as permissões de root, digite -> sudo usermod -aG sudo app
  * Para conferir se tem permissão digite sudo su - app
* Para logar com usuario faça o seguinte
  * Crie uma pasta -> mkdir .ssh
  * De permissões na pasta -> chmod 700 .ssh/ (700 somente proprietario pode ler, abrir, escrever no diretorio)
  * Acesse o diretorio -> cd .ssh/
  * Agora vamos criar um arquivo -> touch authorized_keys
  * Vamos abrir o arquivo -> vi authorized_keys
  * Se usar mac/linux execute o comando ssh-keygen e aperte enter ate gerar um codigo, copie esse codigo.
  * Se for windows, ssh-keygen e aceite tudo.
  * Parei nesse processo porque achei complicado a parte de colar a key, assistir a aula Preparando Deploy -> Configurando instancia por volta do minuto 7:00.
* Atualizando instancia
  * Atualize os pacotes -> sudo apt update
  * Agora instale o node.js
  * Instalar o docker.
  * Instalar o docker-compose.
  * Instalar o yarn.

>### Configurando o Babel na aplicação
* Converteremos a aplicação para javascript.
  * Inicialmente, crie um script no package.json chamado build que executa o tsc.
  * No tsconfig.json, adicione o  "outDir": "./dist"
  * O TSC é lento, devido a isso vamos utilizar o babel diretamente.
* Babel
  * Converte todo o codigo de uma forma que todas as plataformas que interpreta javascript consiga realizar leitura.
  * Semelhante o TSC porem é muito mais rapido.
  * Instale as seguintes bibliotecas:
```javascript
yarn add @babel/cli @babel/core @babel/node @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/preset-env babel-plugin-module-resolver babel-plugin-transform-typescript-metadata @babel/preset-typescript -D
```  
* Agora na raiz do projeto, crie um arquivo babel.config.js e dentro dele defina os presents e plugins.
```javascript
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@modules": "./src/modules",
          "@config": "./src/config",
          "@shared": "./src/shared",
          "@errors": "./src/errors",
          "@utils": "./src/utils",
        },
      },
    ],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
  ],
};

```
* Mudamos no package o build para executar com babel.

# Deploy

>### Aplicação do GitHub
* Crie o repositorio no github
* Instale o git no computador.
* abra o diretorio com os arquivos do projeto.
* Execute o comando git init.
* digite git remote add origin git@github.com:douglasneves/nomedoprojeto.git
* Não se esqueça de usar o arquivo .gitignore para não enviar a pasta node_modules.
* Agora execute o comando git add .
* Se precisar visualizar algo digite git status.
* Agora vamos fazer o commit -> git commit -m "Descricao"
* Vamos fazer o push no master -> git push --set-upstream origin master
* Se precisar baixar alterações feitas utilize git pull, dessa forma ele baixa diretamente do repositorio.

>### Clonando aplicação para deploy



# CI/CD

>### Configurando PM2 na aplicação
* Gerenciador de processos do Node.js, podemos definir quais processos queremos iniciar.
* Instale o PM2 -> https://pm2.keymetrics.io/docs/usage/quick-start/

>### Configurando domínio e SSL
* No Amazon temos um serviço Route 53 para gerenciamento de DNS para nosso dominio.


# Segurança

>### Configurando Rate Limiter
* Evita ataques DDOS.
