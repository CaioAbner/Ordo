import { buscarPassagem } from "./bibleService.js";

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
            ofertas: { referencia: "", texto: "", musica: "", autor: "" },
            edificacao: { pregador: "" },
            oracaoFinal: "",
            louvorFinal: { musica: "", autor: "" },
            outro: []
        },
        ord: {
            tipoCulto: "Culto de Oração e Doutrina",
            etapaAtual: 1,
            dataCulto: "",
            louvoresAbertura: [],
            dirigenteLouvor: "",
            edificacao: { pregador: "" },
            oracaoFinal: "",
            outro: []
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
            louvorFinal: { musica: "", autor: "" },
            outro: []
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