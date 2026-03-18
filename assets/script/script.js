import { musicas } from "./musicas.js";
import { buscarMusicas, configurarBuscaBiblica, confirmarTipoCulto, criarCardMusica, criarFormEstrutura, fecharModal, roteiros, configurarPainelOpcoes, mostrarVisualizacao } from "./config.js";
import { cultoPersonalizado, edificacaoEEncerramento, gerarHtmlBloco, infosInicias, intercessao, leituraCongregacional, louvores, louvoresCeia, visitantesEOfertas } from "./etapas.js";
import { extratoresDeDados, obterResumoOrdenado } from "./genData.js";
import { CustomService } from "./customService.js";

const tela = document.querySelector("body");
const btn_create = document.querySelector("#btn_novo");
let dadosBoletim = {};

window.addEventListener("load", renderizarBoletins);

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

        if (dadosBoletim.tipoCulto === "Personalizado" && dadosBoletim.etapaAtual === 8) {
            const cronogramaExtraido = CustomService.extrairCronograma();
            dadosBoletim.cronograma = cronogramaExtraido;
            CustomService.salvarProgresso(dadosBoletim);
        } else if (extratoresDeDados[dadosBoletim.etapaAtual]) {
            Object.assign(dadosBoletim, extratoresDeDados[dadosBoletim.etapaAtual]());
        }

        if (indexAtual === roteiro.length - 1) {    
            if (dadosBoletim.tipoCulto === "Personalizado") {
                const boletimFinal = CustomService.prepararParaHistorico(dadosBoletim);
                const historico = JSON.parse(localStorage.getItem("meus_boletins")) || [];
                historico.push(boletimFinal);
                localStorage.setItem("meus_boletins", JSON.stringify(historico));
            } else {
                salvarCultoFinalizado();
            }

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
    document.querySelectorAll(".card-body").forEach(body => {
        if (!body.classList.contains("d-none")) {
            const idParaFechar = body.id.replace("body-", "");
            window.toggleMomento(idParaFechar);
        }
    });

    const container = document.querySelector("#container-momentos");
    if (!container) {
        console.error("Container #container-momentos não encontrado.");
        return;
    }

    const seletor = document.getElementById("seletor-modulos");
    if (seletor) seletor.classList.add("d-none");
    let cor = "secondary";

    const id = Date.now();

    const configs = {
        louvor: { cor: "primary", icone: "bx-music", label: "Ex: Momento de Louvor" },
        leitura: { cor: "success", icone: "bx-book-open", label: "Ex: Leitura Bíblica" },
        edificacao: { cor: "dark", icone: "bx-microphone", label: "Ex: Mensagem/Edificação" },
        ceia: { cor: "danger", icone: "bx-wine", label: "Ex: Santa Ceia" },
        intercessao: { cor: "info", icone: "bx-church", label: "Ex: Intercessão" },
        ofertas: { cor: "success", icone: "bx-coin-stack", label: "Ex: Dízimos e Ofertas" },
        visitantes: { cor: "warning", icone: "bx-group", label: "Ex: Visitantes" },
        avisos: { cor: "secondary", icone: "bx-bell", label: "Ex: Avisos" }
    };

    const c = configs[tipo] || configs.avisos;

    const wrapper = document.createElement("div");
    wrapper.className = `card mb-2 shadow-sm border-0 border-start border-3 border-${c.cor}`;
    wrapper.id = `momento-${id}`;
    wrapper.setAttribute("data-tipo", tipo);

    let htmlConteudo = "";

    if (tipo === "louvor") {
        htmlConteudo = `
        <div class="mb-3">
            <label for="dirigenteLouvor" class="form-label fw-bold">Dirigente de Louvor</label>
            <div class="input-group">
                <span class="input-group-text bg-light border-end-0"><i class='bx bx-user-voice'></i></span>
                <input type="text" id="dirigenteLouvor" class="form-control border-start-0" placeholder="Nome do dirigente do louvor">
            </div>
        </div>
            <div id="lista-musicas-${id}">
                <div class="musica-personalizada-item">
                    ${criarCardMusica(1, { referencia: "", musica: "", autor: "" })}
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline-primary w-100 mt-2" onclick="adicionarMaisUmaMusica('${id}')">
                <i class='bx bx-plus'></i> Adicionar música
            </button>
        `;
    } else if (tipo === "leitura") {
        htmlConteudo = `
            <div class="input-group input-group-sm mb-2">
                <input type="text" class="form-control referencia-biblica-input" data-index="${id}" placeholder="Referência (Ex: Salmos 23)">
                <button class="btn btn-success btn-buscar-ref" type="button" data-index="${id}"><i class='bx bx-search'></i></button>
            </div>
            <div id="preview-ref-${id}" class="small text-muted p-2 bg-light rounded">Versículos aparecerão aqui...</div>
        `;
    } else if (tipo === "edificacao") {
        htmlConteudo = `
            <div class="row g-2 bloco-edificacao p-1" id="bloco-edificacao-${id}">
                <div class="col-12 mb-1">
                    <label class="small fw-bold text-muted">Pregador:</label>
                    <input type="text" class="form-control form-control-sm pregador-input" placeholder="Ex: Pr. Etevaldo">
                </div>
                <div class="col-12 mb-1 busca-musica-container" style="position: relative;">
                    <label class="small fw-bold text-muted">Música Pós-Mensagem:</label>
                    <input type="text" class="form-control form-control-sm louvor-item musica-pos-input" data-index="pos-${id}" placeholder="Nome da música">
                    <ul id="sugestoes-musica-pos-${id}" class="list-group lista-sugestoes" style="display: none; position: absolute; z-index: 1000; width: 100%;"></ul>
                    <input type="text" class="form-control form-control-sm autor-louvor-item mt-1" placeholder="Autor da música pós">
                </div>
                <div class="col-12 mb-1">
                    <label class="small fw-bold text-muted">Oração Final e Benção:</label>
                    <input type="text" class="form-control form-control-sm oracao-final-input" placeholder="Quem fará a oração?">
                </div>
                <div class="col-12 busca-musica-container" style="position: relative;">
                    <label class="small fw-bold text-muted">Música Final:</label>
                    <input type="text" class="form-control form-control-sm louvor-item musica-final-input" data-index="final-${id}" placeholder="Música de saída">
                    <ul id="sugestoes-musica-final-${id}" class="list-group lista-sugestoes" style="display: none; position: absolute; z-index: 1000; width: 100%;"></ul>
                    <input type="text" class="form-control form-control-sm autor-louvor-item mt-1" placeholder="Autor da música final">
                </div>
            </div>
        `;
    } else if (tipo === "ceia") {
        htmlConteudo = `
            <div class="p-2 border rounded bg-light mb-2">
                <label class="small fw-bold d-block mb-1">Quantos momentos de louvor na Ceia?</label>
                <input type="number" class="form-control form-control-sm" id="qtd-ceia-${id}" min="1" max="5" placeholder="Ex: 2">
                <button type="button" class="btn btn-sm btn-danger w-100 mt-2" onclick="gerarCamposCeia('${id}')">Gerar Campos da Ceia</button>
            </div>
            <div id="lista-itens-ceia-${id}"></div>
        `;
    } else if (tipo === "intercessao") {
        htmlConteudo = `
            <div class="busca-musica-container" style="position: relative;">
                <label class="small fw-bold">Música de Fundo (Opcional):</label>
                <input type="text" class="form-control form-control-sm louvor-item" data-index="inter-${id}" placeholder="Nome da música">
                <ul id="sugestoes-musica-inter-${id}" class="list-group lista-sugestoes" style="display: none; position: absolute; z-index: 1000; width: 100%;"></ul>
                <input type="text" class="form-control form-control-sm autor-louvor-item mt-1" placeholder="Autor">
            </div>
            <input type="text" class="form-control form-control-sm mt-2 intercessor-input" placeholder="Quem fará a oração?">
        `;
    } else if (tipo === "ofertas") {
        htmlConteudo = `
            <div class="mb-3">
                <label class="small fw-bold text-success">Referência Bíblica:</label>
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control referencia-biblica-input" data-index="ofertas-${id}" placeholder="Ex: 2 Coríntios 9:7">
                    <button class="btn btn-success btn-buscar-ref" type="button" data-index="ofertas-${id}"><i class='bx bx-search'></i></button>
                </div>
                <div id="preview-ref-ofertas-${id}" class="small text-muted p-2 bg-light rounded mt-1" style="min-height: 30px;">
                    O texto bíblico aparecerá aqui...
                </div>
            </div>

            <div class="busca-musica-container" style="position: relative;">
                <label class="small fw-bold text-success">Música do Ofertório:</label>
                <input type="text" class="form-control form-control-sm louvor-item mb-1" placeholder="Nome da música">
                <ul class="list-group lista-sugestoes" style="display: none; position: absolute; z-index: 1000; width: 100%;"></ul>
                <input type="text" class="form-control form-control-sm autor-louvor-item" placeholder="Autor">
            </div>

            <div class="mt-2">
                <label class="small fw-bold text-success">Oração pelas Ofertas:</label>
                <input type="text" class="form-control form-control-sm oracao-ofertas-input" placeholder="Quem fará a oração?">
            </div>
        `;
    } else if (tipo === "visitantes") {
        htmlConteudo = `
            <div class="busca-musica-container" style="position: relative;">
                <label class="small fw-bold">Música de Recepção:</label>
                <input type="text" class="form-control form-control-sm louvor-item" data-index="visit-${id}" placeholder="Nome da música">
                <ul id="sugestoes-musica-visit-${id}" class="list-group lista-sugestoes" style="display: none; position: absolute; z-index: 1000; width: 100%;"></ul>
                <input type="text" class="form-control form-control-sm autor-louvor-item mt-1" placeholder="Autor">
            </div>
        `;
    } else if (tipo === "avisos") {
        cor = "secondary";
        htmlConteudo = `
            <textarea class="form-control form-control-sm" rows="3" placeholder="Digite os avisos aqui..."></textarea>
        `;
    }

    wrapper.innerHTML = `
            <div class="card-header bg-white border-0 d-flex justify-content-between align-items-center pb-0">
            <i class='bx bx-menu drag-handle'></i>
                <div class="d-flex align-items-center gap-2">
                    <i class='bx ${c.icone} text-${c.cor} fs-5'></i>
                    <input type="text" class="form-control form-control-sm border-0 fw-bold p-0 input-titulo-momento" placeholder="${c.label}">
                </div>
                <div class="d-flex">
                    <button class="btn btn-link text-secondary p-1" onclick="toggleMomento('${id}')"><i class='bx bx-chevron-up' id="icon-toggle-${id}"></i></button>
                    <button class="btn btn-link text-danger p-1" onclick="removerMomento('${id}')"><i class='bx bx-trash'></i></button>
                </div>
            </div>
            <div class="card-body" id="body-${id}">
                ${htmlConteudo}
            </div>
        `;

    container.appendChild(wrapper);
    ativarOrdenacaoMomentos();
    configurarBuscaBiblica(wrapper);
    buscarMusicas(wrapper, musicas);
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

window.gerarCamposCeia = (id) => {
    const qtd = document.getElementById(`qtd-ceia-${id}`).value;
    const container = document.getElementById(`lista-itens-ceia-${id}`);
    container.innerHTML = "";

    for (let i = 1; i <= qtd; i++) {
        const itemCeiaId = `${id}-${i}`;
        const div = document.createElement("div");
        div.className = "p-3 border rounded mb-3 bg-white shadow-sm busca-musica-container position-relative musica-ceia-item";

        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom" style="gap: 0.5rem;">
                <span class="badge bg-danger-subtle text-danger">Música ${i}</span>
                <div class="btn-group btn-group-sm">
                    <input type="radio" class="btn-check" name="tipo-${itemCeiaId}" id="pao-${itemCeiaId}" value="Pão" checked>
                    <label class="btn btn-outline-danger py-0 px-2" for="pao-${itemCeiaId}">🍞 Pão</label>
                    <input type="radio" class="btn-check" name="tipo-${itemCeiaId}" id="vinho-${itemCeiaId}" value="Vinho">
                    <label class="btn btn-outline-danger py-0 px-2" for="vinho-${itemCeiaId}">🍷 Vinho</label>
                </div>
            </div>
            <input type="text" class="form-control form-control-sm louvor-item mb-1" data-index="ceia-${itemCeiaId}" placeholder="Nome do louvor">
            <ul id="sugestoes-musica-ceia-${itemCeiaId}" class="list-group lista-sugestoes" style="display: none; position: absolute; z-index: 1000; width: 100%;"></ul>
            <input type="text" class="form-control form-control-sm autor-louvor-item" placeholder="Autor">
        `;
        container.appendChild(div);
    }

    buscarMusicas(container, musicas);
};

window.abrirSeletorModulos = () => {
    const seletor = document.getElementById("seletor-modulos");
    if (seletor) seletor.classList.toggle("d-none");
};

window.criarMomento = criarMomento;
window.adicionarNovoBloco = adicionarNovoBloco;

function ativarOrdenacaoMomentos() {
    const container = document.querySelector("#container-momentos");

    if (!container) return;

    new Sortable(container, {
        animation: 200,
        ghostClass: "drag-ghost",
        chosenClass: "drag-chosen",
        dragClass: "drag-dragging",
        handle: ".drag-handle"
    });

}