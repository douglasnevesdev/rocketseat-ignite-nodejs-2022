<h1 align="center">Serverless</h1>

<p align="center">
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=8257E5&labelColor=000000">

<br>

## ✨ Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [Node.js](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Serverless Framework](serverless.com/)
- [Amazon Lambda](https://aws.amazon.com/pt/lambda/)

## 💻 Projeto

O projeto tem como responsabilidade gerar um certificado para um usuário e a possibilidade de pesquisar a validade de um certificado.

## 🚀 Como executar

- Clone o repositório

### Para rodar localmente

- Rode `yarn` para instalar as dependências
- Rode o `yarn dev` para iniciar a aplicação em ambiente local.
- Rode `yarn dynamo:start` para iniciar o banco de dados em ambiente local.

### Para fazer o deploy

- Configurar as credenciais do usuário
- Rode `yarn deploy` para subir o projeto para AWS Lambda

