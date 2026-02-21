import { musicas } from "./musicas.js";
import { buscarMusicas, configurarBuscaBiblica, confirmarTipoCulto, criarCardMusica, criarFormEstrutura, fecharModal, roteiros, configurarPainelOpcoes } from "./config.js";
import { cultoPersonalizado, edificacaoEEncerramento, gerarHtmlBloco, infosInicias, intercessao, leituraCongregacional, louvores, louvoresCeia, visitantesEOfertas } from "./etapas.js";
import { extratoresDeDados, obterResumoOrdenado } from "./genData.js";

const tela = document.querySelector("body");
const btn_create = document.querySelector("#btn_novo");
let dadosBoletim = {};

window.addEventListener("load", renderizarBoletins);

function capturarItensPersonalizados() {
    const cardsMomentos = document.querySelectorAll("[id^='momento-']");
    const listaFinal = [];

    cardsMomentos.forEach(bloco => {
        const isLouvor = card.querySelector(".bx-music") !== null;
        const tipo = isLouvor ? "Louvor" : "Leitura";

        const tituloMomento = card.querySelector(".input-titulo-momento")?.value || "";

        const momentoObjeto = {
            tipo: tipo,
            titulo: tituloMomento,
            conteudo: []
        }

        if (tipo === "louvor") {
            const blocosMusica = card.querySelectorAll(".musica-personalizada-item");

            momentoObjeto.conteudo = Array.from(blocosMusica).map(bloco => {
                return {
                    referencia: bloco.querySelector(".referencia-louvor-item")?.value || "",
                    musica: bloco.querySelector(".louvor-item")?.value || "",
                    autor: bloco.querySelector(".autor-louvor-item")?.value || "",
                    textoReferencia: bloco.querySelector("[id^='preview-ref-']")?.innerText || "",
                };
            });
        } else {
            momentoObjeto.conteudo = {
                referencia: card.querySelector(".referencia-biblica-input")?.value || "",
                texto: card.querySelector("[id^='preview-ref-']")?.innerText || ""
            };
        }

        listaFinal.push(momentoObjeto);
    });

    return listaFinal;
}

function adicionarNovoBloco(tipo) {
    const container = document.querySelector("#container-itens-personalizados");

    const divTemp = document.createElement("div");
    divTemp.innerHTML = gerarHtmlBloco(tipo);

    const novoBloco = divTemp.firstElementChild;

    const btnRemover = novoBloco.querySelector(".btn-remove-bloco");
    btnRemover.addEventListener("click", () => {
        novoBloco.classList.add("fade-out");
        setTimeout(() => novoBloco.remove(), 300);
    });

    container.appendChild(novoBloco);
}

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

        if (dadosBoletim.tipo === "Personalizado") {
            dadosBoletim.itensPersonalizados = capturarItensPersonalizados();
        }

        if (extratoresDeDados[dadosBoletim.etapaAtual]) {
            Object.assign(dadosBoletim, extratoresDeDados[dadosBoletim.etapaAtual]());
        }

        if (indexAtual === roteiro.length - 1) {
            if (dadosBoletim.tipo === "Personalizado") {
                const nomeEvento = document.querySelector("#nome-culto-personalizado")?.value;
                if (nomeEvento) dadosBoletim.nomeEvento = nomeEvento;

                dadosBoletim.itensPersonalizados = capturarItensPersonalizados();
            }
            
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
    else if (dadosBoletim.etapaAtual === 8) conteudoEtapa = cultoPersonalizado(dadosBoletim);

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

window.criarMomento = (tipo) => {
    document.querySelectorAll(".card-body:not(.d-none)").forEach(body => {
        const idExistente = body.id.replace("body-", "");
        window.toggleMomento(idExistente);
    });

    const container = document.querySelector("#container-momentos");
    const id = Date.now();
    let cor = tipo === 'louvor' ? 'primary' : 'success';

    const wrapper = document.createElement("div");
    wrapper.className = `card mb-2 shadow-sm border-0 border-start border-3 border-${cor}`;
    wrapper.id = `momento-${id}`;

    const idPrimeiraMusica = Date.now() + Math.random();

    wrapper.innerHTML = `
        <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center py-2">
            <div class="d-flex align-items-center gap-2 flex-grow-1">
                <i class='bx ${tipo === 'louvor' ? 'bx-music text-primary' : 'bx-book-open text-success'}'></i>
                <input type="text" class="form-control form-control-sm border-0 fw-bold p-0 bg-transparent input-titulo-momento" 
                       placeholder="${tipo === 'louvor' ? 'Ex: Momento de Louvor' : 'Ex: Leitura Bíblica'}">
            </div>
            
            <div class="d-flex align-items-center">
                <button type="button" class="btn btn-link text-secondary p-1 me-1" onclick="toggleMomento('${id}')">
                    <i class='bx bx-chevron-up fs-4 transition-icon' id="icon-toggle-${id}"></i>
                </button>
                <button type="button" class="btn btn-link text-danger p-1" onclick="removerMomento('${id}')">
                    <i class='bx bx-trash fs-5'></i>
                </button>
            </div>
        </div>
        
        <div class="card-body pt-0 animate__animated animate__fadeIn" id="body-${id}">
            <hr class="mt-0 mb-3 opacity-25">
            ${tipo === 'louvor' ? `
                <div id="lista-musicas-${id}">
                    <div class="musica-personalizada-item position-relative" id="item-musica-${idPrimeiraMusica}">
                        <button type="button" class="btn btn-link text-secondary position-absolute end-0 top-0 p-0 mt-n1 me-n1" 
                                onclick="document.getElementById('item-musica-${idPrimeiraMusica}').remove()" 
                                style="z-index: 10; text-decoration: none;">
                            <i class='bx bx-x fs-4'></i>
                        </button>
                        ${criarCardMusica(1, { referencia: "", musica: "", autor: "" })}
                    </div>
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary w-100 mt-2 border-dashed" 
                        onclick="adicionarMaisUmaMusica('${id}')">
                    <i class='bx bx-plus'></i> Adicionar outra música
                </button>
            ` : `
                <div class="input-group input-group-sm mb-2">
                    <input type="text" class="form-control referencia-biblica-input" data-index="${id}" placeholder="Referência (Ex: Salmos 23)">
                    <button class="btn btn-success btn-buscar-ref" type="button" data-index="${id}">
                        <i class='bx bx-search'></i>
                    </button>
                </div>
                <div id="preview-ref-${id}" class="small text-muted p-2 bg-light rounded shadow-inner" style="min-height: 40px;">
                    Versículos aparecerão aqui...
                </div>
            `}
        </div>
    `;

    container.appendChild(wrapper);

    const seletor = document.getElementById("seletor-modulos");
    if (seletor) seletor.classList.add("d-none");

    configurarBuscaBiblica(container);
    buscarMusicas(container, musicas);
};

window.toggleMomento = (id) => {
    const body = document.getElementById(`body-${id}`);
    const icon = document.getElementById(`icon-toggle-${id}`);

    if (body.classList.contains('d-none')) {
        body.classList.remove('d-none');
        icon.style.transform = "rotate(0deg)";
    } else {
        body.classList.add('d-none');
        icon.style.transform = "rotate(180deg)";
    }
};

window.removerMomento = (id) => {
    if (confirm("Deseja realmente remover este momento?")) {
        const elemento = document.getElementById(`momento-${id}`);
        elemento.classList.add('animate__animated', 'animate__fadeOutRight');
        setTimeout(() => elemento.remove(), 500);
    }
};

window.adicionarMaisUmaMusica = (containerId) => {
    const lista = document.getElementById(`lista-musicas-${containerId}`);
    const proximoNumero = lista.querySelectorAll('.musica-personalizada-item').length + 1;
    const itemMusicaId = Date.now();

    const div = document.createElement("div");
    div.className = "musica-personalizada-item position-relative";
    div.id = `item-musica-${itemMusicaId}`;

    div.innerHTML = `
        <button type="button" class="btn btn-link text-secondary position-absolute end-0 top-0 p-0 mt-n1 me-n1" 
                onclick="document.getElementById('item-musica-${itemMusicaId}').remove()" 
                style="z-index: 10; text-decoration: none;">
            <i class='bx bx-x fs-4'></i>
        </button>
        ${criarCardMusica(proximoNumero, { referencia: "", musica: "", autor: "" })}
    `;

    lista.appendChild(div);

    buscarMusicas(div, musicas);
    configurarBuscaBiblica(div);
};

window.abrirSeletorModulos = () => {
    const seletor = document.getElementById("seletor-modulos");
    if (seletor) seletor.classList.toggle("d-none");
};

window.criarMomento = criarMomento;
window.adicionarNovoBloco = adicionarNovoBloco;