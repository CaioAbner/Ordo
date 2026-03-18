import { buscarPassagem } from "./bibleService.js";

export const roteiros = {
    "Celebração Dominical": [1, 2, 3, 4, 5, 6],
    "Oração e Doutrina": [1, 2, 6],
    "Celebração Dominical - Ceia": [1, 2, 3, 4, 6, 7],
    "Personalizado": [1, 8]
};

const TRADUCOES = {
    data: "Data do Culto",
    dirigenteGeral: "Dirigente do Culto",
    louvoresAbertura: "Momento de Louvor",
    dirigenteLouvor: "Dirigente do Louvor",
    leituraCongregacional: "Leitura Congregacional",
    visitantes: "Visitantes",
    ofertas: "Dízimos e Ofertas",
    intercessao: "Momento de Intercessão",
    quemOrara: "Oração Intercessória",
    edificacao: "Pregação",
    oracaoFinal: "Oração de Encerramento",
    louvorFinal: "Música Final",
    bencao: "Bênção Apostólica",

    pregador: "Mensagem",
    referencia: "Referência Bíblica",
    leitura: "Leitura Congregacional",
    texto: "Versículos",
    musica: "Música",
    autor: "Autor",
    musicaPos: "Música Pós-Mensagem",
    autorPos: "Autor",
    oracaoOfertas: "Oração pelas Ofertas"
};

export function criarFormEstrutura() {
    return `
            <form class="order_form">
                <button type="button" class="btn_close"><i class='bx bx-x'></i></button>
                <h3>Selecione a forma do culto:</h3>
                <div id="options_container">
                    <div class="options">
                        <label for="lva">Celebração Dominical</label>
                        <input type="radio" name="tipo_culto" value="lva" id="lva" />
                    </div>
                    <div class="options">
                        <label for="ord">Oração e Doutrina</label>
                        <input type="radio" name="tipo_culto" value="ord" id="ord" />
                    </div>
                    <div class="options">
                        <label for="ceia">Celebração Dominical - Ceia</label>
                        <input type="radio" name="tipo_culto" value="ceia" id="ceia" />
                    </div>
                    <div class="options">
                        <label for="personalizado">Personalizado</label>
                        <input type="radio" name="tipo_culto" value="personalizado" id="personalizado" />
                    </div>
                </div>
                <button type="submit" class="confirm_btn">Confirmar</button>
            </form>
    `;
}

export function criarEstruturaBoletim(tipo) {
    const estruturas = {
        lva: {
            tipoCulto: "Celebração Dominical",
            etapaAtual: 1,
            dataCulto: "",
            dirigenteGeral: "",
            louvoresAbertura: [],
            dirigenteLouvor: "",
            leituraCongregacional: { referencia: "", texto: "" },
            visitantes: { musica: "", autor: "" },
            ofertas: { referencia: "", texto: "", musica: "", autor: "", oracaoOfertas: "" },
            edificacao: { pregador: "", musicaPos: "", autor: "" },
            oracaoFinal: "",
            louvorFinal: { musica: "", autor: "" }
        },
        ord: {
            tipoCulto: "Oração e Doutrina",
            etapaAtual: 1,
            dataCulto: "",
            dirigenteGeral: "",
            louvoresAbertura: [],
            dirigenteLouvor: "",
            edificacao: { pregador: "" },
            oracaoFinal: ""
        },
        ceia: {
            tipoCulto: "Celebração Dominical - Ceia",
            etapaAtual: 1,
            dataCulto: "",
            dirigenteGeral: "",
            louvoresAbertura: [],
            dirigenteLouvor: "",
            leituraCongregacional: { referencia: "", texto: "" },
            ofertas: { referencia: "", texto: "", musica: "" },
            edificacao: { pregador: "" },
            ceia: [],
            oracaoFinal: "",
            louvorFinal: { musica: "", autor: "" }
        },
        personalizado: {
            tipoCulto: "Personalizado",
            etapaAtual: 1,
            dataCulto: "",
            dirigenteGeral: "",
            cronograma: []
        }
    };
    return estruturas[tipo] || { etapaAtual: 1, cronograma: [] };
}

export function fecharModal(tela, modal_opcoes) {
    if (modal_opcoes && tela.contains(modal_opcoes)) {
        tela.removeChild(modal_opcoes);
    }
}

export function confirmarTipoCulto(opcao_selecionada) {
    return criarEstruturaBoletim(opcao_selecionada);
}

export function criarCardMusica(contador, dados) {
    return `
        <div class="border-bottom pb-3 mb-2">
            <label class="small fw-bold text-primary">Música ${contador}</label>
                        
                <div class="input-group mb-1">
                            <input type="text" class="form-control referencia-louvor-item referencia-biblica-input" 
                                placeholder="Referência (ex: Salmos 23:1 ou Jó 2:1-4)" 
                                value="${dados.referencia}" 
                                data-index="${contador - 1}">
                            <button class="btn btn-primary btn-buscar-ref" type="button" data-index="${contador - 1}">
                                <i class='bx bx-search'></i>
                            </button>
                </div>

                <div id="preview-ref-${contador - 1}" class="small text-muted mb-2 p-2 bg-light rounded" 
                            style="min-height: 20px; font-style: italic;">
                            ${dados.referencia ? 'Clique na lupa para carregar...' : 'Aguardando referência...'}
                </div>

                <div class="busca-musica-container" style="position: relative;">
                            <input type="text" class="form-control louvor-item mb-1" data-index="${contador - 1}" placeholder="Nome da música" value="${dados.musica}" />
                            <ul id="sugestoes-musica-${contador - 1}" class="list-group lista-sugestoes"
                                style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                            <input type="text" class="form-control autor-louvor-item" placeholder="Autor/Banda" value="${dados.autor}" />
                </div>
        </div>
    `;
}

export function configurarBuscaBiblica(container) {
    container.addEventListener("click", async (e) => {
        const btn_buscar_ref = e.target.closest(".btn-buscar-ref");

        if (btn_buscar_ref) {
            const index = btn_buscar_ref.dataset.index;
            const textoRef = document.querySelector(`.referencia-biblica-input[data-index="${index}"]`);
            const previewDiv = document.querySelector(`#preview-ref-${index}`);

            if (!textoRef || !previewDiv) return;

            if (textoRef.value.length >= 3) {
                previewDiv.innerText = "Buscando...";
                try {
                    const textoBiblico = await buscarPassagem(textoRef.value);
                    previewDiv.innerHTML = textoBiblico;
                    textoRef.setAttribute("data-texto", textoBiblico);
                } catch (error) {
                    previewDiv.innerText = "Erro ao buscar passagem.";
                }
            }
        }
    });
}

export function buscarMusicas(container, musicas) {
    container.addEventListener("input", (e) => {
        const input = e.target;
        if (input.classList.contains("louvor-item")) {
            const termoBusca = input.value.toLowerCase().trim();

            const buscaContainer = input.closest(".busca-musica-container");
            if (!buscaContainer) return;

            const listaUl = buscaContainer.querySelector(".lista-sugestoes");
            if (!listaUl) return;

            if (termoBusca.length < 2) {
                listaUl.style.display = "none";
                return;
            }

            if (typeof musicas !== 'undefined') {
                const filtradas = musicas.filter(m => {
                    const nomeMusica = (m.titulo || "").toLowerCase();
                    const nomeAutor = (m.autor || "").toLowerCase();
                    return nomeMusica.includes(termoBusca) || nomeAutor.includes(termoBusca);
                }).slice(0, 5);

                if (filtradas.length > 0) {
                    listaUl.innerHTML = filtradas.map(m => `
                        <li class="list-group-item list-group-item-action item-sugestao" 
                            data-titulo="${m.titulo}" 
                            data-autor="${m.autor}" 
                            style="cursor: pointer; font-size: 0.85rem;">
                            <strong>${m.titulo}</strong> <br>
                            <small class="text-muted">${m.autor}</small>
                        </li>`).join("");
                    listaUl.style.display = "block";
                } else {
                    listaUl.style.display = "none";
                }
            }
        }
    });

    container.addEventListener("click", (e) => {
        const item = e.target.closest(".item-sugestao");
        if (item) {
            const buscaContainer = item.closest(".busca-musica-container");
            const inputMusica = buscaContainer.querySelector(".louvor-item");
            const inputAutor = buscaContainer.querySelector(".autor-louvor-item");

            if (inputMusica) inputMusica.value = item.dataset.titulo;
            if (inputAutor) inputAutor.value = item.dataset.autor;

            item.parentElement.style.display = "none";
        }
    });

    document.addEventListener("click", (e) => {
        if (!e.target.classList.contains("louvor-item")) {
            document.querySelectorAll(".lista-sugestoes").forEach(ul => ul.style.display = "none");
        }
    });
}

export function fecharSheet() {
    const sheet = document.querySelector("#bottom-sheet");
    const overlay = document.querySelector("#overlay");
    if (sheet) {
        sheet.classList.remove("active");
        sheet.style.transform = '';
    };
    if (overlay) overlay.style.display = "none";

    document.body.classList.remove("modal-open");
}

export function configurarPainelOpcoes(id, callbacks) {
    const sheet = document.querySelector("#bottom-sheet");
    const overlay = document.querySelector("#overlay");
    const btnDelete = document.querySelector("#btn-delete-sheet");
    const btnView = document.querySelector("#btn-view");
    const btnPdf = document.querySelector("#btn-pdf-sheet");

    const handle = document.querySelector(".sheet-handle");

    document.body.classList.add("modal-open");

    let startY = 0;
    let currentY = 0;

    const onTouchStart = (e) => {
        startY = e.touches[0].clientY;
    };

    const onTouchMove = (e) => {
        e.preventDefault();
        currentY = e.touches[0].clientY;
        const deltaY = currentY - startY;

        if (deltaY > 0) {
            sheet.style.transform = `translateY(${deltaY}px)`;
            sheet.style.transition = 'none';
        }
    };

    const onTouchEnd = () => {
        const deltaY = currentY - startY;
        sheet.style.transition = 'transform 0.3s ease';

        if (deltaY > 100) {
            fecharSheet();
        } else {
            sheet.style.transform = 'translateY(0)';
        }

        startY = 0;
        currentY = 0;
    };

    handle.addEventListener("touchstart", onTouchStart);
    handle.addEventListener("touchmove", onTouchMove);
    handle.addEventListener("touchend", onTouchEnd);

    handle.onclick = fecharSheet;

    sheet.classList.add("active");
    sheet.style.transform = "translateY(0)";
    overlay.style.display = "block";
    overlay.onclick = fecharSheet;

    btnDelete.onclick = () => {
        if (confirm("Deseja realmente excluir esse boletim?")) {
            const cultos = JSON.parse(localStorage.getItem("meus_boletins")) || [];
            const novosCultos = cultos.filter(culto => Number(culto.id) !== Number(id));
            localStorage.setItem("meus_boletins", JSON.stringify(novosCultos));

            fecharSheet();
            if (callbacks.onUpdate) callbacks.onUpdate();
        }
    };

    btnView.onclick = () => {
        fecharSheet();
        mostrarVisualizacao(id);
    };

    if (btnPdf) {
        btnPdf.onclick = () => {
            fecharSheet();
            const cultos = JSON.parse(localStorage.getItem("meus_boletins")) || [];
            const culto = cultos.find(culto => Number(culto.id) === Number(id));
            if (culto) {
                console.log("Gerar PDF para:", culto);
                gerarPDFBoletim(culto);
            } else {
                alert("Erro ao encontrar os dados do boletim.")
            }
        };
    }

}

function formatarValorVisualizacao(valor, chaveOriginal = "") {
    if (!valor) return '<span class="text-muted small">Não informado</span>';

    if (chaveOriginal === "ceia" && Array.isArray(valor)) {
        return valor.map(item => `
            <div class="bg-white p-3 rounded shadow-sm mb-2 border-start border-primary border-4">
                <div class="d-flex flex-column">
                    <small class="text-primary fw-bold text-uppercase d-block mb-1" style="font-size: 10px;">
                        Música - (${item.label})
                    </small>
                    <div class="text-dark">
                        <strong>${item.musica}</strong>
                        ${item.autor ? `<span class="text-muted ms-1 small">- (${item.autor})</span>` : ''}
                    </div>
                </div>
            </div>
        `).join("");
    }

    if (Array.isArray(valor)) {
        return valor.map(item => formatarValorVisualizacao(item, "musica")).join("");
    }

    if (typeof valor === 'string') {
        return `
            <div class="bg-white p-3 rounded shadow-sm mb-2 border-bottom">
                <small class="text-uppercase text-secondary fw-bold d-block mb-1" style="font-size: 10px;">
                    ${TRADUCOES[chaveOriginal] || chaveOriginal}
                </small>
                <div class="text-dark">${valor}</div>
            </div>`;
    }

    if (typeof valor === 'object' && valor !== null) {
        let htmlManual = "";

        if (valor.referencia && !valor.musica && !valor.titulo) {
            return `
                <div class="bg-white p-3 rounded shadow-sm mb-2 border-start border-primary border-4">
                    <small class="text-uppercase text-primary fw-bold d-block mb-1" style="font-size: 10px;">
                        ${TRADUCOES[chaveOriginal] || "Referência"}
                    </small>
                    <div class="text-dark fw-bold">${valor.referencia}</div>
                    <div class="mt-2 p-2 bg-light rounded fst-italic shadow-sm" style="font-size: 0.85rem; color: #444;">
                        ${valor.texto || 'Texto não carregado.'}
                    </div>
                </div>`;
        }

        if (valor.pregador) {
            htmlManual += formatarValorVisualizacao(valor.pregador, "pregador");
        }

        const nomeMusica = valor.musica || valor.musicaPos || valor.titulo;
        if (nomeMusica) {
            const nomeAutor = valor.autor || valor.autorPos;
            let labelDinamica = "Música";
            if (chaveOriginal === "edificacao") labelDinamica = "Música Pós-Mensagem";
            if (chaveOriginal === "musicaFinal") labelDinamica = "Música Final";

            htmlManual += `
            <div class="bg-white p-3 rounded shadow-sm mb-2 border-start border-primary border-4">
                <small class="text-uppercase text-primary fw-bold d-block mb-1" style="font-size: 10px;">${labelDinamica}</small>
                <div class="text-dark">
                    <strong>${nomeMusica} -</strong>
                    ${nomeAutor ? `<span class="text-muted small"> (${nomeAutor})</span>` : ''}
                </div>
                ${valor.referencia ? `
                    <div class="mt-2 p-2 bg-light rounded fst-italic shadow-sm" style="font-size: 0.85rem;">
                        <strong>${valor.referencia}:</strong> ${valor.texto || ''}
                    </div>` : ''}
            </div>`;
        }

        Object.entries(valor).forEach(([subChave, subValor]) => {
            const chavesJaTratadas = ['pregador', 'musica', 'musicaPos', 'titulo', 'autor', 'autorPos', 'referencia', 'texto'];
            if (!chavesJaTratadas.includes(subChave) && subValor) {
                htmlManual += formatarValorVisualizacao(subValor, subChave);
            }
        });

        return htmlManual;
    }

    return `<span>${valor}</span>`;
}

function formatarMomentoPersonalizado(item) {
    let html = "";

    const gerarCardPadrao = (label, principal, subPrincipal = "", referencia = "", texto = "") => {
        return `
           <div class="bg-white p-3 rounded shadow-sm mb-2 border-start border-primary border-4">
            <small class="text-uppercase text-primary fw-bold d-block mb-1" style="font-size: 10px;">
                ${label}
            </small>
            <div class="text-dark">
                <strong>${principal}</strong> 
                ${subPrincipal ? `<span class="text-muted small"> - (${subPrincipal})</span>` : ''}
            </div>
            
            ${texto ? `
                <div class="mt-2 p-2 bg-light rounded fst-italic shadow-sm" style="font-size: 0.85rem; color: #444;">
                    ${texto}
                </div>` : ''}
        </div>`;
    };

    switch (item.tipo) {
        case "louvor":
            item.musicas?.forEach(m => {
                html += gerarCardPadrao("Música", m.musica, m.autor, m.referencia, m.texto);
            });
            if (item.dirigenteLouvor) html += gerarCardPadrao("Dirigente do louvor", item.dirigenteLouvor);
            break;

        case "leitura":
            if (item.referencia) {
                html += gerarCardPadrao("Leitura Congregacional", item.referencia, "", "", item.texto);
            }
            break
        
        case "ceia":
            if (item.musicas && item.musicas.length > 0) {
                item.musicas.forEach(m => {
                    const labelCeia = `${m.elemento}`;
                    html += gerarCardPadrao(labelCeia, m.musica, m.autor);
                });
            }
            break;

        case "intercessao":
            if (item.musica) {
                html += gerarCardPadrao("Música", item.musica, item.autor);
                html += gerarCardPadrao("Oração Intercessória", item.pessoa);
            }
            break

        case "ofertas":
            if (item.musica) {
                html += gerarCardPadrao("Música", item.musica, item.autor, item.referencia, item.texto);
            }
            
            if (item.quemOrara) {
                html += gerarCardPadrao("Oração pelas Ofertas", item.quemOrara);
            }
            break;

        case "edificacao":
            if (item.pregador) html += gerarCardPadrao("Pregador", item.pregador);
            if (item.musicaPos) html += gerarCardPadrao("Música Pós-Mensagem", item.musicaPos, item.autorPos);
            if (item.oracaoFinal) html += gerarCardPadrao("Oração final", item.oracaoFinal);
            if (item.musicaFinal) html += gerarCardPadrao("Música Final", item.musicaFinal, item.autorFinal);
            break;

        case "avisos":
            html += `
                <div class="bg-white p-3 rounded shadow-sm mb-2 border-start border-primary border-4">
                    <div class="text-dark" style="white-space: pre-wrap;">${item.texto}</div>
                </div>`;
            break;

        default:
            const titulo = item.titulo || item.tipo;
            html += gerarCardPadrao(titulo, item.musica || item.pessoa || "", item.autor || "");
    }

    return html;
}

export function mostrarVisualizacao(id) {
    const cultos = JSON.parse(localStorage.getItem("meus_boletins")) || [];
    const culto = cultos.find(c => Number(c.id) === Number(id));
    const dataRef = culto.data || culto.dataCulto;
    const dataExibicao = dataRef ? dataRef.split("-").reverse().join("/") : "Data não informada."

    if (!culto) return;

    const modalRaiz = document.createElement("div");
    modalRaiz.className = "visualizacao-full";

    document.body.classList.add("modal-open");

    let conteudo = "";
    const camposIgnorar = ["id", "tipo", "data", "dataCulto", "etapaAtual", "tipoCulto"];

    Object.entries(culto).forEach(([chave, valor]) => {
        if (camposIgnorar.includes(chave)) return;

        if (!valor || (typeof valor === "object" && Object.values(valor).every(v => v === ""))) return;

        if (chave === "cronograma" && Array.isArray(valor)) {
            valor.forEach(item => {
                conteudo += `
                    <div class="secao-container mb-4">
                        <div class="d-flex align-items-center mb-2">
                            <div class="bg-primary rounded-circle me-2" style="width: 8px; height: 8px;"></div>
                            <h6 class="fw-bold text-uppercase m-0" style="font-size: 0.8rem; letter-spacing: 1.5px;">
                                ${item.titulo || item.tipo}
                            </h6>
                        </div>
                        <div>${formatarMomentoPersonalizado(item)}</div>
                    </div>
                `;
            });
            return;
        }

        const labelSeção = TRADUCOES[chave] || chave;
        conteudo += `
            <div class="secao-container mb-4">
                <div class="d-flex align-items-center mb-2">
                    <div class="bg-primary rounded-circle me-2" style="width: 8px; height: 8px;"></div>
                    <h6 class="fw-bold text-uppercase m-0" style="font-size: 0.8rem; letter-spacing: 1.5px;">${labelSeção}</h6>
                </div>
                <div>${formatarValorVisualizacao(valor, chave)}</div>
            </div>
        `;
    });

    modalRaiz.innerHTML = `
        <div class="header-view bg-white sticky-top shadow-sm p-3 d-flex align-items-center">
            <button id="btn-fechar-view" class="btn btn-light rounded-circle me-3" style="width: 40px; height: 40px;">
                <i class='bx bx-chevron-left h4 m-0'></i>
            </button>
            <div>
                <h6 class="m-0 fw-bold text-dark">${culto.tipo}</h6>
                <small class="text-muted" style="font-size: 0.7rem;">Modo de visualização</small>
                <small class="text-primary fw-bold" style="font-size: 0.75rem;">
                    <i class='bx bx-calendar-alt'></i> ${dataExibicao}
                </small>
            </div>
        </div>
        <div class="container-fluid p-4" style="background-color: #f0f2f5; min-height: 100vh;">
            <div class="row">
                <div class="col-12 col-md-8 mx-auto">
                    ${conteudo}
                    <div class="text-center py-5">
                        <img src="https://cdn-icons-png.flaticon.com/512/3246/3246610.png" style="width: 40px; opacity: 0.3;">
                        <p class="text-muted small mt-2">Fim do roteiro</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalRaiz);

    const fecharManual = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        modalRaiz.remove();
        document.body.classList.remove("modal-open");
        window.scrollTo(0, 0);
        modalRaiz.style.opacity = "0";
        modalRaiz.style.transition = "opacity 0.2s ease";
    };

    const btn = modalRaiz.querySelector("#btn-fechar-view");
    if (btn) {
        btn.onclick = fecharManual;
    };
}

export function gerarPDFBoletim(dados) {
    const areaImpressao = document.createElement("div");
    areaImpressao.className = "folha-pdf";

    areaImpressao.innerHTML = `
        <style>
            @page { size: A4 landscape; margin: 0; }
            body { margin: 0; padding: 0; background: #eee;}
            
            .folha-pdf {
                width: 297mm;
                height: 210mm;
                padding: 8mm 12mm;
                margin: 0;
                overflow: hidden;
                box-sizing: border-box;
                font-family: 'Arial', sans-serif;
                background: white;
                column-count: 2;
                column-gap: 15mm;
                column-rule: 1px solid #ddd;
                column-fill: auto;
            }

            .item-culto:last-child, .musica-item:last-child {
                margin-bottom: 0 !important;
            }

            /* Cabeçalho centralizado atravessando as colunas */
            .header-pdf { 
                column-span: none; 
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0.5rem;
                margin-bottom: 0.5rem;
                breack-inside: avoid;
            }

            .header-pdf h1 { font-size: 18pt; margin: 0; text-transform: uppercase; color: #000; font-weight: bold; }
            .header-pdf p { font-size: 12pt; margin: 0; font-style: italic; color: #0000FF; font-weight: bold; }
            .header-pdf span { font-size: 10pt; margin: 0; margin-top: 0.5rem; text-align: center; font-style: italic; color: #0000FF; font-weight: bold; }

            .container-ceia { display: flex; flex-direction: column; 
                & div {
                    margin: 0;
                }
            }

            /* Estilo dos Itens */
            .item-culto { break-inside: avoid; margin-bottom: 3mm; line-height: 1.2; font-size: 12pt; }
            
            .titulo-item { font-weight: bold; text-transform: uppercase; font-size: 12pt; color: #000; }
            .referencia-biblica { color: #00B050; font-weight: bold; font-size: 12pt; }
            .texto-biblico { font-size: 12pt; color: #0000FF; font-style: italic; display: block; margin-top: 2px; }
            
            .version-identifier { color: #FF0000 }
            .musica-item { font-size: 12pt; color: #E67E22; font-weight: bold; margin: 4mm 0; display: flex; align-items: center; flex-wrap: wrap; }
            .autor-musica { font-weight: 200; margin-left: 4px; font-size: 12pt; }
            .musica-index { font-weight: 200; margin-right: 4px; text-decoration: underline; font-size: 12pt; }
            .musica-index-alt { margin-right: 4px; text-decoration: underline; color: #000; font-size: 12pt; }
            .clave { font-size: 16pt; color: #000; margin-right: 8px; font-weight: normal; }
            
            .nome-pessoa { color: #E67E22; margin-left: 4px; font-size: 12pt; }
            .pessoas-identifier { margin-left: 4px; color: #0000FF; font-weight: 200; font-style: italic; font-size: 1.1rem; }
            .second-text { margin-left: 18px; color: #000; font-weight: 200; font-size: 1.1rem; }
        </style>

        <div class="conteudo-dinamico">
            ${dados.tipoCulto === "Personalizado"
                ? gerarConteudoPersonalizado(dados)
                : gerarConteudoCulto(dados)
            }
        </div>
    `;

    const meses = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];

    const dataFormatada = dados.data.split("-")
    const dia = dataFormatada[2];
    const mes = dataFormatada[1];
    const mesNome = meses[mes - 1];
    const ano = dataFormatada[0]

    const opt = {
        margin: 0,
        filename: `CULTO-DO-DIA-${dia}-DE-${mesNome}-DE-${ano}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
        pagebreak: { mode: 'css' }
    };

    html2pdf().set(opt).from(areaImpressao).save();
}

function gerarConteudoCulto(dados) {
    let html = "";
    const versao = "NVI"
    const clave = "&#119070;";

    const dataFormatada = new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    html += `
        <header class="header-pdf">
            <h1>${dados.tipo || 'CELEBRAÇÃO DOMINICAL'}</h1>
            <p>${dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}</p>
            <span>"Deus é Espírito, e é necessário que os seus adoradores o adorem em espírito e em verdade."</span>
        </header>
    `;

    html += `
        <div class="item-culto">
            <span class="clave">${clave}</span> <span class="titulo-item">PRELÚDIO:</span>
        </div>
        <div class="item-culto">
            <span class="titulo-item">ORAÇÃO:</span><span class="pessoas-identifier">${dados.dirigenteGeral || ''}</span>
        </div>
    `;

    if (dados.louvoresAbertura && dados.louvoresAbertura.length > 0) {
        dados.louvoresAbertura.forEach((l, index) => {

            if (l.referencia) {
                html += `
                    <div class="item-culto">
                        <span class="titulo-item" style="text-decoration: underline;">LEITURA CONGREGACIONAL ${index + 1}:</span> 
                        <span class="referencia-biblica">${l.referencia.toUpperCase()} <span class="version-identifier">(${versao})</span></span>
                        ${l.texto ? `<span class="texto-biblico">${l.texto}</span>` : ''}
                    </div>
                `;
            }

            html += `
                <div class="musica-item">
                    <span class="clave">${clave}</span> 
                    <span class="musica-index">MÚSICA ${index + 1}:</span> ${l.musica} - ${l.autor ? `<span class="autor-musica">(${l.autor})</span>` : ''}
                </div>
            `;
        });
    }

    if (dados.dirigenteLouvor) {
        html += `
                <div class="item-culto">
                    <span class="titulo-item">ORAÇÃO DE LOUVOR:</span>
                    <span class="pessoas-identifier">${dados.dirigenteLouvor || ''}</span>
                </div>
            `;
    }

    if (dados.leituraCongregacional) {
        let index = dados.louvoresAbertura.length;
        html += `
            <div class="item-culto">
                <span class="titulo-item" style="text-decoration: underline;">LEITURA CONGREGACIONAL ${index + 1}:</span> 
                <span class="referencia-biblica">${dados.leituraCongregacional.referencia.toUpperCase() || ''} <span class="version-identifier">(${versao})</span></span>
                <span class="texto-biblico">${dados.leituraCongregacional.texto || ''}</span>
            </div>
        `;
    }

    if (dados.visitantes?.musica) {
        html += `
            <div class="musica-item">
                <span class="clave">${clave}</span>
                <span class="titulo-item" style="text-decoration: underline;">VISITANTES:</span> 
                <span class="nome-pessoa">${dados.visitantes.musica} -${dados.visitantes.autor ? `<span class="autor-musica">(${dados.visitantes.autor})</span>` : ''}</span>
            </div>
        `;
    }

    if (dados.ofertas) {
        html += `
            <div class="item-culto">
                <span class="titulo-item" style="text-decoration: underline;">ENTREGA DÍZIMOS E OFERTAS:</span> 
                <span class="referencia-biblica">${dados.ofertas.referencia.toUpperCase() || ''} <span class="version-identifier">(${versao})</span></span>
                <span class="texto-biblico">${dados.ofertas.texto || ''}</span>
            </div>
            <div class="musica-item">
                <span class="clave">${clave}</span> <span class="musica-index-alt"> MÚSICA:</span> ${dados.ofertas.musica || ''} - ${dados.ofertas.autor ? `<span class="autor-musica">(${dados.ofertas.autor})</span>` : ''}
                <span class="second-text">Oração entregando as Ofertas:</span><span class="pessoas-identifier"> ${dados.ofertas.oracaoOfertas || ''}</span>
            </div>
        `;
    }

    if (dados.intercessao) {
        html += `
            <div class="musica-item">
                <span class="clave">${clave}</span> <span class="musica-index-alt"> MÚSICA:</span> ${dados.intercessao.musica || ''} - ${dados.intercessao.autor ? `<span class="autor-musica">(${dados.intercessao.autor})</span>` : ''}
                <span class="second-text">Oração Intercessória:</span><span class="pessoas-identifier"> ${dados.intercessao.quemOrara || ''}</span>
            </div>
        `;
    }

    if (dados.edificacao) {
        html += `
            <div class="item-culto">
                <span class="titulo-item" style="text-decoration: underline; font-size: 1rem;">MOMENTO DE EDIFICAÇÃO DA NOSSA FÉ</span><br>
                <span>Mensagem:</span><span class="pessoas-identifier">${dados.edificacao.pregador || ''}</span>
            </div>
        `;
    }


    if (dados.tipo != "Celebração Dominical - Ceia") {
        if (dados.edificacao.musicaPos && dados.edificacao.autorPos) {
            html += `
                <div class="musica-item">
                    <span class="musica-index-alt">MÚSICA PÓS MENSAGEM:</span> ${dados.edificacao.musicaPos || ''} - ${dados.edificacao.autorPos ? `<span class="autor-musica">(${dados.edificacao.autorPos})</span>` : ''}
                </div>
            `;
        }
    } else {
        html += `
           <span class="titulo-item" style="text-decoration: underline;">CEIA:</span><br> 
        `;

        dados.ceia.forEach((l) => {
            html += `
            <div class="container-ceia">
                <div class="musica-item">
                    <span class="musica-index-alt" style="text-decoration: none;">${l.label}:</span> ${l.musica || ''} - ${l.autor ? `<span class="autor-musica">(${l.autor})</span>` : ''}
                </div>
            </div>
            `;
        });
    }

    if (dados.oracaoFinal) {
        html += `
            <div class="item-culto" style="margin-top: 20px;">
                <span class="titulo-item" style="text-decoration: underline;">ORAÇÃO FINAL E BÊNÇÃO:</span> <span class="pessoas-identifier"> ${dados.oracaoFinal || ''}</span>
            </div>
        `;
    }

    if (dados.louvorFinal) {
        html += `
            <div class="musica-item">
                <span class="clave">${clave}</span> <span class="musica-index-alt"> MÚSICA FINAL:</span> ${dados.louvorFinal.musica || ''} - ${dados.louvorFinal.autor ? `<span class="autor-musica">(${dados.louvorFinal.autor})</span>` : ''}
            </div>
        `;
    }

    return html;
}

function gerarConteudoPersonalizado(dados) {
    let html = "";
    const versao = "NVI";
    const clave = "&#119070;";

    const dataFormatada = new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    html += `
        <header class="header-pdf">
            <h1>${dados.tipo || 'CELEBRAÇÃO'}</h1>
            <p>${dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}</p>
            <span>"Deus é Espírito, e é necessário que os seus adoradores o adorem em espírito e em verdade."</span>
        </header>
        <div class="item-culto">
            <span class="clave">${clave}</span> <span class="titulo-item">PRELÚDIO:</span>
        </div>
        <div class="item-culto">
            <span class="titulo-item">ORAÇÃO:</span><span class="pessoas-identifier">${dados.dirigenteGeral || ''}</span>
        </div>
    `;

    if (dados.cronograma && dados.cronograma.length > 0) {
        dados.cronograma.forEach((item) => {
            switch (item.tipo) {
                case "louvor":
                    item.musicas.forEach((m, idx) => {
                        if (m.referencia) {
                            html += `
                                <div class="item-culto">
                                    <span class="titulo-item" style="text-decoration: underline;">LEITURA CONGREGACIONAL ${idx + 1}:</span> 
                                    <span class="referencia-biblica">${m.referencia?.toUpperCase()} <span class="version-identifier">(${versao})</span></span>
                                    ${m.texto ? `<span class="texto-biblico">${m.texto}</span>` : ''}
                                </div>
                            `;
                        }

                        html += `
                            <div class="musica-item">
                                <span class="clave">${clave}</span> 
                                <span class="musica-index">MÚSICA ${idx + 1}:</span> ${m.musica} - ${m.autor ? `<span class="autor-musica">(${m.autor})</span>` : ''}
                            </div>
                        `;

                    if (item.dirigenteLouvor) {
                        html += `
                            <div class="item-culto">
                                <span class="titulo-item">ORAÇÃO DE LOUVOR:</span>
                                <span class="pessoas-identifier">${item.dirigenteLouvor}</span>
                            </div>
                        `;
                    }
                    });
                    break;

                case "leitura":
                    html += `
                        <div class="item-culto">
                            <span class="titulo-item" style="text-decoration: underline;">${item.titulo || 'LEITURA CONGREGACIONAL'}:</span> 
                            <span class="referencia-biblica">${item.referencia?.toUpperCase()} <span class="version-identifier">(${versao})</span></span>
                            <span class="texto-biblico">${item.texto || ''}</span>
                        </div>`;
                    break;

                case "ceia":
                    html += `<div class="item-culto" style="margin-top: 5mm;"><span class="titulo-item" style="text-decoration: underline;">${item.titulo}:</span></div>`;
                    item.musicas.forEach(m => {
                        html += `
                            <div class="container-ceia">
                                <div class="musica-item">
                                    <span class="musica-index-alt" style="text-decoration: none;">${m.elemento.toUpperCase()}:</span> ${m.musica || ''} - ${m.autor ? `<span class="autor-musica">(${m.autor})</span>` : ''}
                                </div>
                            </div>`;
                    });
                    break;

                case "ofertas":
                    html += `
                        <div class="item-culto">
                            <span class="titulo-item" style="text-decoration: underline;">ENTREGA DÍZIMOS E OFERTAS:</span> 
                            <span class="referencia-biblica">${item.referencia?.toUpperCase() || ''} <span class="version-identifier">(${versao})</span></span>
                            <span class="texto-biblico">${item.texto || ''}</span>
                        </div>
                        <div class="musica-item">
                            <span class="clave">${clave}</span> <span class="musica-index-alt"> MÚSICA:</span> ${item.musica || ''} - ${item.autor ? `<span class="autor-musica">(${item.autor})</span>` : ''}
                            <span class="second-text">Oração entregando as Ofertas:</span><span class="pessoas-identifier"> ${item.quemOrara || ''}</span>
                        </div>`;
                    break;

                case "edificacao":
                    html += `
                        <div class="item-culto">
                            <span class="titulo-item" style="text-decoration: underline; font-size: 1rem;">MOMENTO DE EDIFICAÇÃO DA NOSSA FÉ</span><br>
                            <span>Mensagem:</span><span class="pessoas-identifier">${item.pregador || ''}</span>
                        </div>`;
                    if (item.musicaPos) {
                        html += `<div class="musica-item">
                                    <span class="musica-index-alt">MÚSICA PÓS MENSAGEM:</span> ${item.musicaPos || ''} - ${item.autorPos ? `<span class="autor-musica">(${item.autorPos})</span>` : ''}
                                </div>`;
                    }

                    if (item.oracaoFinal) {
                        html += `
                            <div class="item-culto" style="margin-top: 20px;">
                                <span class="titulo-item" style="text-decoration: underline;">ORAÇÃO FINAL E BÊNÇÃO:</span> <span class="pessoas-identifier"> ${item.oracaoFinal || ''}</span>
                            </div>
                        `;
                    }

                    if (item.musicaFinal) {
                        html += `
                            <div class="musica-item">
                                <span class="clave">${clave}</span> <span class="musica-index-alt"> MÚSICA FINAL:</span> ${item.musicaFinal || ''} - ${item.autorFinal ? `<span class="autor-musica">(${item.autorFinal})</span>` : ''}
                            </div>
                        `;
                    }

                    break;

                case "intercessao":
                    html += `
                        <div class="musica-item">
                            <span class="clave">${clave}</span> <span class="musica-index-alt"> MÚSICA:</span> ${item.musica || ''} - ${item.autor ? `<span class="autor-musica">(${item.autor})</span>` : ''}
                            <span class="second-text">Oração Intercessória:</span><span class="pessoas-identifier"> ${item.pessoa || ''}</span>
                        </div>`;
                    break;

                case "visitantes":
                    html += `
                        <div class="musica-item">
                            <span class="clave">${clave}</span>
                            <span class="titulo-item" style="text-decoration: underline;">VISITANTES:</span> 
                            <span class="nome-pessoa">${item.musica} ${item.autor ? `<span class="autor-musica">(${item.autor})</span>` : ''}</span>
                        </div>`;
                    break;

                case "avisos":
                    html += `
                        <div class="item-culto">
                            <span class="titulo-item" style="text-decoration: underline;">AVISOS:</span>
                            <span class="texto-biblico" style="font-style: normal; color: #000;">${item.texto || ''}</span>
                        </div>`;
                    break;
            }
        });
    }

    return html;
}