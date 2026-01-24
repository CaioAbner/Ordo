import { musicas } from "./musicas.js";
import { buscarMusicas, configurarBuscaBiblica, confirmarTipoCulto, fecharModal } from "./config.js";
import { infosInicias, leituraCongregacional, louvores, visitantes } from "./etapas.js";

const tela = document.querySelector("body");
const btn_create = document.querySelector("#btn_novo");
let dadosBoletim = {};

function abrirModal(e) {
    let telaModal = document.createElement("div");
    telaModal.classList.add("containerModal");

    telaModal.innerHTML = `
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

function configurarEventosNavegacao() {
    const btnProximo = document.querySelector("#btn_proximo");
    const btnVoltar = document.querySelector("#btn_voltar");

    btnProximo.addEventListener("click", () => {
        if (dadosBoletim.etapaAtual === 1) {
            dadosBoletim.dataCulto = document.querySelector("#data_input").value;
            dadosBoletim.dirigenteCulto = document.querySelector("#dirigente_input").value;
        } else if (dadosBoletim.etapaAtual === 2) {
            const refs = document.querySelectorAll(".referencia-louvor-item");
            const musicas = document.querySelectorAll(".louvor-item");
            const autores = document.querySelectorAll(".autor-louvor-item");

            dadosBoletim.louvoresAbertura = Array.from(musicas).map((input, index) => {
                return {
                    referencia: refs[index].value,
                    musica: input.value,
                    autor: autores[index].value
                }
            });
        } else if (dadosBoletim.etapaAtual === 3) {
            const inputRef = document.querySelector("#ref_leitura");
            const previewDiv = document.querySelector("#preview-ref-leitura");

            dadosBoletim.leituraCongregacional = {
                referencia: inputRef.value,
                texto: previewDiv.innerHTML
            };

        }

        dadosBoletim.etapaAtual++;
        renderizarPasso();

    });

    if (btnVoltar) {
        btnVoltar.addEventListener("click", () => {
            dadosBoletim.etapaAtual--;
            renderizarPasso();
        });
    }

}

function renderizarPasso() {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.classList.add("form-step-container");

    let timelineHTML = `
        <div class="timeline-container">
            <div class="timeline-line"></div>
            <div class="step ${dadosBoletim.etapaAtual >= 1 ? 'active' : ''}">1</div>
            <div class="step ${dadosBoletim.etapaAtual >= 2 ? 'active' : ''}">2</div>
            <div class="step ${dadosBoletim.etapaAtual >= 3 ? 'active' : ''}">3</div>
            <div class="step ${dadosBoletim.etapaAtual >= 4 ? 'active' : ''}">4</div>
        </div>
        <h6 class="text-center text-muted mb-4">Passo ${dadosBoletim.etapaAtual} de 4</h6>
    `;

    let conteudoEtapa = "";

    if (dadosBoletim.etapaAtual === 1) {

        conteudoEtapa = infosInicias(dadosBoletim);

    } else if (dadosBoletim.etapaAtual === 2) {

        conteudoEtapa = louvores(dadosBoletim);

    } else if (dadosBoletim.etapaAtual === 3) {

        if (dadosBoletim.leituraCongregacional) {
            conteudoEtapa = leituraCongregacional(dadosBoletim);
        } else {
            dadosBoletim.etapaAtual++;
            renderizarPasso();
            return;
        }

    } else if (dadosBoletim.etapaAtual === 4) {

        if (dadosBoletim.visitantes) {
            conteudoEtapa = visitantes(dadosBoletim);
        } else {
            dadosBoletim.etapaAtual++;
            renderizarPasso();
            return;
        }

    }

    wrapper.innerHTML = `
        ${timelineHTML}
        <div class="step-card">
            ${conteudoEtapa}
            <div class="d-flex gap-2 mt-4">
                ${dadosBoletim.etapaAtual > 1 ? `<button class="btn btn-light border w-100" id="btn_voltar">Voltar</button>` : ''}
                <button class="btn btn-primary w-100" id="btn_proximo">
                    ${dadosBoletim.etapaAtual === 4 ? 'Finalizar' : 'Próximo'}
                </button>
            </div>
        </div>
    `;

    container.appendChild(wrapper);

    if (dadosBoletim.etapaAtual === 2 || dadosBoletim.etapaAtual === 4) {
        buscarMusicas(container, musicas);
    }

    if (dadosBoletim.etapaAtual === 2) {
        const inputQtd = document.querySelector("#qtd_louvores");
        const containerInputs = document.querySelector("#lista_inputs_louvores");

        const gerarInputs = (qtd) => {
            containerInputs.innerHTML = "";
            for (let i = 1; i <= qtd; i++) {
                const dadosAnteriores = dadosBoletim.louvoresAbertura[i - 1] || { referencia: "", musica: "", autor: "" };
                containerInputs.innerHTML += `
                    <div class="border-bottom pb-3 mb-2">
                        <label class="small fw-bold text-primary">Música ${i}</label>
                        
                        <div class="input-group mb-1">
                            <input type="text" class="form-control referencia-louvor-item referencia-biblica-input" 
                                placeholder="Referência (ex: Salmos 23:1 ou Jó 2:1-4)" 
                                value="${dadosAnteriores.referencia}" 
                                data-index="${i - 1}">
                            <button class="btn btn-primary btn-buscar-ref" type="button" data-index="${i - 1}">
                                <i class='bx bx-search'></i>
                            </button>
                        </div>

                        <div id="preview-ref-${i - 1}" class="small text-muted mb-2 p-2 bg-light rounded" 
                            style="min-height: 20px; font-style: italic;">
                            ${dadosAnteriores.referencia ? 'Clique na lupa para carregar...' : 'Aguardando referência...'}
                        </div>

                        <div class="busca-musica-container" style="position: relative;">
                            <input type="text" class="form-control louvor-item mb-1" data-index="${i - 1}" placeholder="Nome da música" value="${dadosAnteriores.musica}" />
                            <ul id="sugestoes-musica-${i - 1}" class="list-group lista-sugestoes" 
                                style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                            <input type="text" class="form-control autor-louvor-item" placeholder="Autor/Banda" value="${dadosAnteriores.autor}" />
                        </div>
                    </div>
                `;
            }

            buscarMusicas(containerInputs, musicas);
            configurarBuscaBiblica(containerInputs);

        }

        if (dadosBoletim.louvoresAbertura.length > 0) gerarInputs(dadosBoletim.louvoresAbertura.length);
        inputQtd.addEventListener("input", (e) => gerarInputs(e.target.value));
        
    }

    if (dadosBoletim.etapaAtual === 3) {
        configurarBuscaBiblica(container)
    }

    configurarEventosNavegacao();
}



btn_create.addEventListener('click', abrirModal);