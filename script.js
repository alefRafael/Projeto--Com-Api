const container = document.getElementById("container");

async function carregarAleatorio() {
  const random = Math.random() > 0.5 ? "dog" : "cat";
  buscarAPI(random);
}

function buscarAnimal() {
  const valor = document.getElementById("input").value.toLowerCase();

  if (valor === "dog" || valor === "cat") {
    buscarAPI(valor);
  } else {
    container.innerHTML = "Digite 'dog' ou 'cat'";
  }
}

async function buscarAPI(tipo) {
  container.innerHTML = "Carregando...";

  try {
    let url = "";

    if (tipo === "dog") {
      url = "https://dog.ceo/api/breeds/image/random";
    } else {
      url = "https://api.thecatapi.com/v1/images/search";
    }

    const resposta = await fetch(url);
    const dados = await resposta.json();

    let imagem = "";

    if (tipo === "dog") {
      imagem = dados.message;
    } else {
      imagem = dados[0].url;
    }

    container.innerHTML = `<img src="${imagem}">`;

  } catch (erro) {
    container.innerHTML = "Erro ao carregar";
  }
}