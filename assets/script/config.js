import { buscarPassagem } from "./bibleService.js";

export const roteiros = {
    "Celebração Dominical": [1, 2, 3, 4, 5, 6],
    "Oração e Doutrina": [1, 2, 3, 6],
    "Celebração Dominical - Ceia": [1, 2, 3, 4, 6, 7]
};

const TRADUCOES = {
    data: "Data do Culto",
    dirigenteGeral: "Dirigente do Culto",
    louvoresAbertura: "Momento de Louvor",
    dirigente: "Dirigente do Louvor",
    leituraCongregacional: "Leitura da Palavra",
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
            dirigenteCulto: "",
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
            tipoCulto: "Culto de Oração e Doutrina",
            etapaAtual: 1,
            dataCulto: "",
            louvoresAbertura: [],
            dirigenteLouvor: "",
            edificacao: { pregador: "" },
            oracaoFinal: ""
        },
        ceia: {
            tipoCulto: "Celebração Dominical - Ceia",
            etapaAtual: 1,
            dataCulto: "",
            dirigenteCulto: "",
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
            tipoCulto: "",
            etapaAtual: 1,
            dataCulto: "",
            dirigenteCulto: "",
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
        if (e.target.classList.contains("louvor-item")) {
            const index = e.target.dataset.index;
            const termoBusca = e.target.value.toLowerCase().trim();
            const listaUl = document.querySelector(`#sugestoes-musica-${index}`);

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
                            style="cursor: pointer;">
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
            buscaContainer.querySelector(".louvor-item").value = item.dataset.titulo;
            buscaContainer.querySelector(".autor-louvor-item").value = item.dataset.autor;
            item.parentElement.style.display = "none";
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
    const btnPdf = document.querySelector("#btn-pdf-sheet");;

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
            if (culto) gerarPDFBoletim(culto);
        };
    }

}

function formatarValorVisualizacao(valor, chaveOriginal = "") {
if (!valor) return '<span class="text-muted small">Não informado</span>';

    if (typeof valor === 'string') {
        return `
            <div class="bg-white p-3 rounded shadow-sm mb-2 border-bottom">
                <small class="text-uppercase text-secondary fw-bold d-block mb-1" style="font-size: 10px;">
                    ${TRADUCOES[chaveOriginal] || chaveOriginal}
                </small>
                <div class="text-dark">${valor}</div>
            </div>`;
    }

    if (typeof valor === 'object' && !Array.isArray(valor)) {
        let htmlManual = "";

        if (valor.pregador) {
            htmlManual += formatarValorVisualizacao(valor.pregador, "pregador");
        }

        const nomeMusica = valor.musica || valor.musicaPos || valor.titulo;
        if (nomeMusica) {
            const nomeAutor = valor.autor || valor.autorPos;

            htmlManual += `
            <div class="bg-white p-3 rounded shadow-sm mb-2 border-start border-primary border-4">
                <div class="text-dark">
                    <strong>${nomeMusica} - </strong> 
                    ${nomeAutor ? `<span class="text-muted small">(${nomeAutor})</span>` : ''}
                </div>
                ${valor.referencia ? `
                    <div class="mt-2 p-2 bg-light rounded fst-italic shadow-sm" style="font-size: 0.85rem;">
                        <strong>${valor.referencia}:</strong> ${valor.texto || ''}
                    </div>` : ''}
            </div>`;
        }

        Object.entries(valor).forEach(([subChave, subValor]) => {
            const chavesJaRenderizadas = ['pregador', 'musica', 'musicaPos', 'titulo', 'autor', 'autorPos', 'referencia', 'texto'];
            if (!chavesJaRenderizadas.includes(subChave) && subValor) {
                htmlManual += formatarValorVisualizacao(subValor, subChave);
            }
        });

        return htmlManual;
    }

    if (Array.isArray(valor)) {
        return valor.map(item => formatarValorVisualizacao(item, "musica")).join("");
    }

    return `<span>${valor}</span>`;
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
    areaImpressao.className = "folha-a4";

    const dataFormatada = new Date(dados.data + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    areaImpressao.innerHTML = `
        <style>
            .folha-a4 { font-family: 'Arial', sans-serif; padding: 15mm; color: #333; background: white }
            .header-pdf { text-align: center; margin-bottom: 15px; }
            .header-pdf h1 { color: #000; text-transform: uppercase; font-size: 22px; margin-bottom: 0; }
            .header-pdf p { color: #0000FF; font-weight: bold; margin-top: 5px; text-transform: capitalize; }
            .versiculo-pdf { font-style: italic; color: #0000FF; text-align: center; margin-bottom: 25px; font-size: 13px; }
            
            .container-colunas {
                column-count: 2;
                column-gap: 30px;
                column-fill: auto;
                height: 235mm;
                text-align: left;
            }
            
            .item-culto { 
                margin-bottom: 15px;
                line-height: 1.3;
                break-inside: avoid;
            }
            .titulo-item { font-weight: bold; text-decoration: underline; text-transform: uppercase; display: block; margin-bottom: 2px; }
            .musica-item { color: #D35400; font-weight: bold; display: block; margin: 4px 0; }
            .leitura-pdf { color: #2ECC71; font-weight: bold; }
            .texto-leitura { color: #0000FF; font-size: 12px; display: block; margin-top: 4px; }
            .clave-sol { font-size: 16px; margin-right: 5px; }
        </style>

        <div class="header-pdf">
            <h1>${dados.tipo}</h1>
            <p>${dataFormatada}</p>
        </div>
        <div class="versiculo-pdf">
            "Deus é Espírito, e é necessário que os seus adoradores o adorem em espírito e em verdade."
        </div>

        <div class="container-colunas">
            ${gerarConteudoCulto(dados)}
        </div>
    `;

    const opt = {
        margin: 5,
        filename: `Boletim_${dados.data}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(areaImpressao).save();
}

function gerarConteudoCulto(dados, lado) {
    let html = "";
    const clave = "&#119070";

    html += `<div class="item-culto"><span class="titulo-item">PRELÚDIO:</span></div>`;
    html += `<div class="item-culto"><span class="titulo-item">ORAÇÃO:</span> ${dados.dirigenteGeral || ''}</div>`;

    if (dados.louvoresAbertura) {
        dados.louvoresAbertura.forEach((m, i) => {
            html += `
                <div class="item-culto">
                    <span class="musica-item">
                        <span class="clave-sol">${clave}</span> MÚSICA ${i + 1}: ${m.musica} <span style="font-weight:normal">(${m.autor || ''})</span>
                    </span>
                </div>`;
        });
    }

    if (dados.leitura) {
        html += `
            <div class="item-culto">
                <span class="titulo-item">LEITURA CONGREGACIONAL:</span> 
                <span class="leitura-pdf">${dados.leitura.referencia || ''}</span>
                <span class="texto-leitura">${dados.leitura.texto || ''}</span>
            </div>
        `;
    }

    if (dados.visitantes) {
        html += `
            <div class="item-culto">
                <span class="musica-item"><span class="clave-sol">${clave}</span> VISITANTES: ${dados.visitantes.musica || ''}</span>
            </div>
        `;
    }

    html += `
        <div class="item-culto">
            <span class="titulo-item">MOMENTO DE EDIFICAÇÃO DA NOSSA FÉ</span>
            <span>Mensagem: ${dados.edificacao?.pregador || ''}</span>
        </div>
        <div class="item-culto">
            <span class="musica-item"><span class="clave-sol">${clave}</span> MÚSICA PÓS-MENSAGEM:</span>
        </div>
    `;

    return html;
}