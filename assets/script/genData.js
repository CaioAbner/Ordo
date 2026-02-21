function capturarItensPersonalizados() {
    const blocos = document.querySelectorAll(".bloco-item-personalizado");
    const listaFinal = [];

    blocos.forEach(bloco => {
        const tipo = bloco.dataset.tipo;

        const item = {
            tipo: tipo,
            titulo: bloco.querySelector('.input-titulo')?.value || "",
            musica: bloco.querySelector('.input-musica')?.value || "",
            autor: bloco.querySelector('.input-autor')?.value || "",
            referencia: bloco.querySelector('.input-referencia')?.value || "",
            texto: bloco.querySelector('.input-texto')?.value || "",
            pregador: bloco.querySelector('.input-pregador')?.value || ""
        };

        listaFinal.push(item);
    });

    return listaFinal;
}

export const extratoresDeDados = {
    1: () => ({
        dataCulto: document.querySelector("#data_input")?.value,
        dirigenteCulto: document.querySelector("#dirigente_input")?.value
    }),
    2: () => {
        const musicas = document.querySelectorAll(".louvor-item");
        const autores = document.querySelectorAll(".autor-louvor-item");
        const refs = document.querySelectorAll(".referencia-louvor-item");

        return {
            dirigenteLouvor: document.querySelector("#dirigente_louvor")?.value,
            louvoresAbertura: Array.from(musicas).map((input, i) => {
                const previewDiv = document.querySelector(`#preview-ref-${i}`);

                return {
                    musica: input.value,
                    autor: autores[i].value,
                    referencia: refs[i].value,
                    texto: previewDiv ? previewDiv.innerHTML : ""
                };
            })
        };
    },
    3: () => ({
        leituraCongregacional: {
            referencia: document.querySelector("#ref_leitura")?.value,
            texto: document.querySelector("#preview-ref-leitura")?.innerHTML
        }
    }),
    4: () => ({
        visitantes: {
            musica: document.querySelector("#musica_visitante")?.value,
            autor: document.querySelector("#autor_visitante")?.value
        },
        ofertas: {
            referencia: document.querySelector("#ref_ofertas")?.value,
            texto: document.querySelector("#preview-ref-ofertas")?.innerHTML,
            musica: document.querySelector("#musica_ofertas")?.value,
            autor: document.querySelector("#autor_ofertas")?.value,
            oracaoOfertas: document.querySelector("#oracao_ofertas")?.value
        }
    }),
    5: () => ({
        intercessao: {
            musica: document.querySelector("#musica_intercessao")?.value,
            autor: document.querySelector("#autor_intercessao")?.value,
            quemOrara: document.querySelector("#intercessor_input")?.value
        }
    }),
    6: () => ({
        edificacao: {
            pregador: document.querySelector("#pregador_input")?.value,
            musicaPos: document.querySelector("#musica_pos_mensagem")?.value,
            autorPos: document.querySelector("#autor_pos_mensagem")?.value
        },
        oracaoFinal: document.querySelector("#bencao_input")?.value,
        louvorFinal: {
            musica: document.querySelector("#musica_final")?.value,
            autor: document.querySelector("#autor_final")?.value
        }
    }),
    7: () => ({
        louvoresCeia: {
            pao1: {
                musica: document.querySelector('[data-index="ceia_pao_1"]')?.value,
                autor: document.querySelectorAll('.autor-louvor-item')[0]?.value
            },
            vinho: {
                musica: document.querySelector('[data-index="ceia_vinho"]')?.value,
                autor: document.querySelectorAll('.autor-louvor-item')[1]?.value
            },
            pao2: {
                musica: document.querySelector('[data-index="ceia_pao_2"]')?.value,
                autor: document.querySelectorAll('.autor-louvor-item')[2]?.value
            }
        }
    }),
    8: () => {
        return {
            cronograma: capturarItensPersonalizados()
        };
    }
};

export function obterResumoOrdenado(dados) {
    const resumo = {
        tipo: dados.tipoCulto,
        data: dados.dataCulto || dados.data,
        dirigenteGeral: dados.dirigenteCulto,
        id: dados.id || Date.now()
    };

    if (dados.tipoCulto !== "Personalizado") {

        if (dados.louvoresAbertura?.length > 0) {
            resumo.louvoresAbertura = dados.louvoresAbertura;
            resumo.dirigenteLouvor = dados.dirigenteLouvor;
        }

        if (dados.leituraCongregacional?.referencia) {
            resumo.leituraCongregacional = dados.leituraCongregacional;
        }

        if (dados.visitantes?.musica) resumo.visitantes = dados.visitantes;
        if (dados.ofertas?.referencia || dados.ofertas?.musica) resumo.ofertas = dados.ofertas;

        if (dados.intercessao?.musica || dados.intercessao?.quemOrara) {
            resumo.intercessao = dados.intercessao;
        }

        if (dados.edificacao?.pregador) {
            resumo.edificacao = dados.edificacao;
        }

        if (dados.tipoCulto.includes("Ceia") && dados.louvoresCeia) {
            const itensCeia = [];

            if (dados.louvoresCeia.pao1?.musica) {
                itensCeia.push({
                    label: "Pão",
                    musica: dados.louvoresCeia.pao1.musica,
                    autor: dados.louvoresCeia.pao1.autor
                });
            }

            if (dados.louvoresCeia.vinho?.musica) {
                itensCeia.push({
                    label: "Vinho",
                    musica: dados.louvoresCeia.vinho.musica,
                    autor: dados.louvoresCeia.vinho.autor
                });
            }

            if (dados.louvoresCeia.pao2?.musica) {
                itensCeia.push({
                    label: "Pão",
                    musica: dados.louvoresCeia.pao2.musica,
                    autor: dados.louvoresCeia.pao2.autor
                });
            }

            if (itensCeia.length > 0) {
                resumo.ceia = itensCeia;
            }

        }

        if (dados.oracaoFinal || dados.louvorFinal?.musica) {
            resumo.oracaoFinal = dados.oracaoFinal;
            if (dados.louvorFinal?.musica) resumo.louvorFinal = dados.louvorFinal;
        }
    } else if (dados.tipoCulto === "Personalizado") {
        const tipoParaExibir = (dados.tipo === "Personalizado" && dados.nomeEvento)
                ? dados.nomeEvento
                : dados.tipo;

        return {
            id: dados.id || Date.now(),
            tipo: tipoParaExibir,
            tipoOriginal: dados.tipo,
            data: dados.dataCulto || dados.data,
            dirigenteGeral: dados.dirigenteGeral,
            momentos: capturarItensPersonalizados || []
        };
    }

    if (dados.oracaoFinal) {
        resumo.oracaoFinal = dados.oracaoFinal;
    }

    return resumo;
}