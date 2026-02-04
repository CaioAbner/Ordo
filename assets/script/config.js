import { buscarPassagem } from "./bibleService.js";

export const roteiros = {
    "Celebração Dominical": [1, 2, 3, 4, 5],
    "Oração e Doutrina": [1, 2, 3, 5],
    "Celebração Dominical - Ceia": [1, 2, 3, 4, 5, 6]
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