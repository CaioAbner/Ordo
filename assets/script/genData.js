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
    })
};

export function obterResumoOrdenado(dados) {

    const resumoBase = {
        tipo: dados.tipoCulto,
        data: dados.dataCulto,
        dirigenteGeral: dados.dirigenteCulto,
        id: dados.id || Date.now()
    };

    switch (dados.tipoCulto) {

        case "Celebração Dominical":
            return {
                ...resumoBase,
                abertura: { dirigente: dados.dirigenteLouvor, musicas: dados.louvoresAbertura },
                leitura: dados.leituraCongregacional,
                visitantes: dados.visitantes,
                ofertas: dados.ofertas,
                intercessao: dados.intercessao,
                edificacao: dados.edificacao,
                encerramento: { bencao: dados.oracaoFinal, musicaFinal: dados.louvorFinal }
            };

        case "Oração e Doutrina":
            return {
                ...resumoBase,
                leitura: dados.leituraCongregacional,
                abertura: { dirigente: dados.dirigenteLouvor, musicas: dados.louvoresAbertura },
                edificacao: dados.edificacao,
                encerramento: { bencao: dados.oracaoFinal }
            };

        case "Celebração Dominical - Ceia":
            return {
                ...resumoBase,
                abertura: { dirigente: dados.dirigenteLouvor, musicas: dados.louvoresAbertura },
                leitura: dados.leituraCongregacional,
                visitantes: dados.visitantes,
                ofertas: dados.ofertas,
                edificacao: dados.edificacao,
                momentoCeia: {
                    pao1: dados.louvoresCeia?.pao1,
                    vinho: dados.louvoresCeia?.vinho,
                    pao2: dados.louvoresCeia?.pao2
                },
                encerramento: { bencao: dados.oracaoFinal, musicaFinal: dados.louvorFinal }
            };

        default:
            return resumoBase;

    }

}