const resultado = document.getElementById("container");
const input = document.getElementById("input");
const status = document.getElementById("status");
const btnInstalar = document.getElementById("btnInstalar");

let deferredPrompt = null;

async function carregarAleatorio() {
  const random = Math.random() > 0.5 ? "dog" : "cat";
  buscarAPI(random);
}

function buscarAnimal() {
  const valor = input.value.trim().toLowerCase();

  if (valor === "dog" || valor === "cat") {
    buscarAPI(valor);
  } else {
    resultado.innerHTML = `<div class="mensagem">Digite apenas <strong>dog</strong> ou <strong>cat</strong>.</div>`;
  }
}

async function buscarAPI(tipo) {
  resultado.innerHTML = `<div class="mensagem">Carregando...</div>`;

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

    resultado.innerHTML = `
      <article class="card">
        <img src="${imagem}" alt="Imagem de ${tipo}">
        <div class="info">
          <h2>${tipo}</h2>
          <p>Imagem carregada pela API com sucesso.</p>
        </div>
      </article>
    `;
  } catch (erro) {
    resultado.innerHTML = `<div class="mensagem">Erro ao carregar imagem.</div>`;
  }
}

function pegarLocalizacao() {
  if (!navigator.geolocation) {
    status.innerHTML = "Geolocalização não suportada neste navegador.";
    return;
  }

  status.innerHTML = "Buscando localização...";

  navigator.geolocation.getCurrentPosition(
    (posicao) => {
      const latitude = posicao.coords.latitude.toFixed(4);
      const longitude = posicao.coords.longitude.toFixed(4);

      status.innerHTML = `
        Latitude: ${latitude}<br>
        Longitude: ${longitude}
      `;
    },
    () => {
      status.innerHTML = "Não foi possível pegar sua localização.";
    }
  );
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredPrompt = event;
  btnInstalar.hidden = false;
});

btnInstalar.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  btnInstalar.hidden = true;
});