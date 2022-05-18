# Primerio Projeto com Node.js

* Instalando Biblioteca uuid para gerar os IDs.
```javascript
yarn add uuid
```

- Sempre request e response tem que ser nessa ordem.

>## Arrays

* No ES6 ganhamos funções para tratar arrays.Dado o array -> const arr = [1,3,4,5,8,9];
* forEach: Percorre todos os elementos
* Map: Percorre todos os elementos e faz algo com seus valores(retorna novo valor)
* Reduce: Reduz os elementos em um único valor.
* Filter: Filtra os elementos dado uma condição.
* Find: Encontra uma determinada informação.
* Every: verifica se todos os elementos respeitam dada condição
* Some: Verifica se existe pelo menos um elemento que respeita dada condição.

```javascript
//forEach
const newArray = numeros.forEach(function (numero) {
console.log(numero); //1,3,4,5,8,9
});

//Map
const dobro = numeros.map(function (numero) {
return numero \* 2;
});
console.log(dobro); // 2,6,8,10,18

//Filter
const maioresQueTres = numeros.filter(function (numero) {
return numero > 3;
});
console.log(maioresQueTres); // 6,8,10,18

//Find
const tres = numeros.find(function (numero) {
return numero === 2;
});
console.log(tres); // 2

//Every
const todosMaiorQueZero = numeros.every(function (numero) {
return numero > 0;
});
console.log(todosMaiorQueZero); // true

//Some
const algumMaiorQueQuatro = numeros.some(function (numero) {
return numero > 4;
});
console.log(algumMaiorQueQuatro); // true

//Reduce
const soma = numeros.reduce(function (soma, numero) {
return soma + numero;
}, 0);
console.log(soma); // 15

//FindIdex
const indice = numeros.findIndex((repository) => repository.id === id);
console.log(indice); // 2
```

>## Middleware

* Aquilo que esta no meio, uma função que fica entre nossa requisição (request) e entre nosso response.
* Recebe 3 parametros, sendo eles: request, response e next.
* Existe 2 formas de usar o middleware e pode ser aplicado quantos middlewares necessitar.
  * Entre a rota e o request, response. Utilizado quando tenho um middleware especifico.
  * Usar com o conceito de app.use(); Utilizado quando quero adicionar a todas as rotas.
* Podemos atribuir no request uma variavel e depois usar na função, ex:

```javascript
request.customer = customer;
```

E dentro da função recebemos o customer

```javascript
const { customer } = request;
```

