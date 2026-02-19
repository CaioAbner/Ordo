import { musicas } from "./musicas.js";
import { buscarMusicas, configurarBuscaBiblica, confirmarTipoCulto, criarCardMusica, criarFormEstrutura, fecharModal, roteiros, configurarPainelOpcoes } from "./config.js";
import { edificacaoEEncerramento, infosInicias, intercessao, leituraCongregacional, louvores, louvoresCeia, visitantesEOfertas } from "./etapas.js";
import { extratoresDeDados, obterResumoOrdenado } from "./genData.js";

const tela = document.querySelector("body");
const btn_create = document.querySelector("#btn_novo");
let dadosBoletim = {};

window.addEventListener("load", renderizarBoletins);

function salvarCultoFinalizado() {
    const cultosSalvos = JSON.parse(localStorage.getItem("meus_boletins")) || [];

    const resumoLimpo = obterResumoOrdenado(dadosBoletim);

    const novoCulto = {
        ...resumoLimpo,
        id: Date.now()
    };

    cultosSalvos.push(novoCulto);
    localStorage.setItem("meus_boletins", JSON.stringify(cultosSalvos));

}

function renderizarBoletins() {
    const container = document.querySelector("#lista_boletins");
    if (!container) return;

    const cultos = JSON.parse(localStorage.getItem("meus_boletins")) || [];

    if (cultos.length === 0) {
        container.innerHTML = `<span class="text-muted small">Nenhum boletim criado.</span>`;
        return;
    }

    container.innerHTML = cultos.map(culto => {
        const stopSplit = culto.data || culto.dataCulto;
        if (!stopSplit) return "";
        const tipoCulto = culto.tipo;

        const [ano, mes, dia] = stopSplit.split("-");
        const dataExibicao = `${dia}/${mes}/${ano.slice(-2)}`;

        return `
            <div class="card-culto-flex shadow-sm gap-1" style="cursor: pointer;">
                <div class="texts-container">
                    <span>Culto dia ${dataExibicao}</span>
                    <h6 class="text-secondary" id="tipoCulto">(${tipoCulto})</h6>
                </div>
                <button class="btn btn-link text-dark btn-options" id="options-btn" data-id="${culto.id}">
                    <i class='bx bx-dots-vertical-rounded fs-1'></i>
                </button>
            </div>
        `;

    }).join("");

    document.querySelectorAll(".btn-options").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;

            configurarPainelOpcoes(id, {
                onUpdate: renderizarBoletins,
                onView: (id) => {
                    import("./config.js").then(module => {
                        module.mostrarVisualizacao(id, renderizarBoletins);
                    });
                }
            });
        });
    });

}

function abrirModal() {
    let telaModal = document.createElement("div");
    telaModal.classList.add("containerModal");

    telaModal.innerHTML = criarFormEstrutura();

    tela.append(telaModal);

    const btn_close = document.querySelector(".btn_close");
    btn_close.addEventListener("click", () => fecharModal(tela, telaModal));

    const btn_confirm = document.querySelector(".confirm_btn");
    btn_confirm.addEventListener('click', (e) => {
        e.preventDefault();
        const opcao_selecionada = document.querySelector('input[name="tipo_culto"]:checked');
        if (!opcao_selecionada) {
            alert("Você precisa selecionar alguma opção para prosseguir.")
            return;
        }

        dadosBoletim = confirmarTipoCulto(opcao_selecionada.value);

        fecharModal(tela, telaModal);

        renderizarPasso();

    });

}

function salvarLocalStorage() {
    localStorage.setItem("boletim_atual", JSON.stringify(dadosBoletim));
}

function configurarEventosNavegacao() {
    const btnProximo = document.querySelector("#btn_proximo");
    const btnVoltar = document.querySelector("#btn_voltar");

    const roteiro = roteiros[dadosBoletim.tipoCulto];
    const indexAtual = roteiro.indexOf(dadosBoletim.etapaAtual);

    btnProximo.addEventListener("click", () => {

        if (extratoresDeDados[dadosBoletim.etapaAtual]) {
            Object.assign(dadosBoletim, extratoresDeDados[dadosBoletim.etapaAtual]());
        }

        if (indexAtual === roteiro.length - 1) {
            salvarCultoFinalizado();
            localStorage.removeItem("boletim_atual");
            alert("Culto salvo com sucesso!");
            location.reload();
            return;
        }

        dadosBoletim.etapaAtual = roteiro[indexAtual + 1];
        salvarLocalStorage();
        renderizarPasso();

    });

    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            if (indexAtual > 0) {
                dadosBoletim.etapaAtual = roteiro[indexAtual - 1];
                renderizarPasso();
            }
        });
    }

}

function renderizarPasso() {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    const roteiro = roteiros[dadosBoletim.tipoCulto];
    const totalEtapas = roteiro.length;
    const posicaoNoRoteiro = roteiro.indexOf(dadosBoletim.etapaAtual) + 1;

    const wrapper = document.createElement("div");
    wrapper.classList.add("form-step-container");

    let stepsHTML = roteiro.map((passo, index) => `
        <div class="step ${dadosBoletim.etapaAtual >= passo ? 'active' : ''}">${index + 1}</div>
    `).join("");

    let timelineHTML = `
        <div class="timeline-container">
            <div class="timeline-line"></div>
            ${stepsHTML}
        </div>
        <h6 class="text-center text-muted mb-4">Passo ${posicaoNoRoteiro} de ${totalEtapas}</h6>
    `;

    let conteudoEtapa = "";

    if (dadosBoletim.etapaAtual === 1) conteudoEtapa = infosInicias(dadosBoletim);
    else if (dadosBoletim.etapaAtual === 2) conteudoEtapa = louvores(dadosBoletim);
    else if (dadosBoletim.etapaAtual === 3) conteudoEtapa = leituraCongregacional(dadosBoletim);
    else if (dadosBoletim.etapaAtual === 4) conteudoEtapa = visitantesEOfertas(dadosBoletim);
    else if (dadosBoletim.etapaAtual === 5) conteudoEtapa = intercessao(dadosBoletim);
    else if (dadosBoletim.etapaAtual === 6) conteudoEtapa = edificacaoEEncerramento(dadosBoletim);
    else if (dadosBoletim.etapaAtual === 7) conteudoEtapa = louvoresCeia(dadosBoletim);

    const ultimaEtapa = posicaoNoRoteiro === totalEtapas;

    wrapper.innerHTML = `
        ${timelineHTML}
        <div class="step-card">
            ${conteudoEtapa}
            <div class="d-flex gap-2 mt-4">
                ${posicaoNoRoteiro > 1 ? `<button class="btn btn-light border w-100" id="btn_voltar">Voltar</button>` : ''}
                <button class="btn btn-primary w-100" id="btn_proximo">
                    ${ultimaEtapa ? 'Finalizar e Salvar' : 'Próximo'}
                </button>
            </div>
        </div>
    `;

    container.appendChild(wrapper);

    if (dadosBoletim.etapaAtual === 2 || dadosBoletim.etapaAtual === 4 || dadosBoletim.etapaAtual === 5) {
        buscarMusicas(container, musicas);
    }

    if (dadosBoletim.etapaAtual === 2) {
        const inputQtd = document.querySelector("#qtd_louvores");
        const containerInputs = document.querySelector("#lista_inputs_louvores");

        const gerarInputs = (qtd) => {
            containerInputs.innerHTML = "";
            for (let i = 1; i <= qtd; i++) {
                const lista = dadosBoletim.louvoresAbertura || [];
                const dadosAnteriores = lista[i - 1] || { referencia: "", musica: "", autor: "" };
                containerInputs.innerHTML += criarCardMusica(i, dadosAnteriores);
            }

            buscarMusicas(containerInputs, musicas);
            configurarBuscaBiblica(containerInputs);

        }

        if (dadosBoletim.louvoresAbertura?.length > 0) {
            gerarInputs(dadosBoletim.louvoresAbertura.length);
        }
        inputQtd.addEventListener("input", (e) => gerarInputs(e.target.value));

    }

    if (dadosBoletim.etapaAtual === 3) {
        configurarBuscaBiblica(container)
    }

    if (dadosBoletim.etapaAtual === 6) {
        buscarMusicas(container, musicas);
    }

    if (dadosBoletim.etapaAtual === 7) {
        buscarMusicas(container, musicas);
    }

    configurarEventosNavegacao();
}

btn_create.addEventListener('click', abrirModal);

window.addEventListener("load", renderizarBoletins);