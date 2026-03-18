export const CustomService = {
    
    extrairCronograma: () => {
        const blocos = document.querySelectorAll(".momento-item, [data-tipo]");
        const cronograma = [];

        console.log(`Encontramos ${blocos.length} blocos para cronograma.`);

        blocos.forEach((bloco) => {
            const tipo = bloco.dataset.tipo;
            const id = bloco.id.replace("momento-", "");
            
            const tituloManual = bloco.querySelector(".input-titulo-momento")?.value;

            let dadosMomento = {
                tipo: tipo,
                titulo: tituloManual || "" 
            };

            switch (tipo) {
                case "louvor":  
                    const musicas = [];

                    const dirigenteLouvor = document.querySelector("#dirigenteLouvor")?.value || ""
                    bloco.querySelectorAll(".musica-personalizada-item").forEach((item, index) => {
                        const previewTexto = item.querySelector(`[id^="preview-ref-"]`)?.innerHTML || "";
                        musicas.push({
                            musica: item.querySelector(".louvor-item")?.value || "",
                            autor: item.querySelector(".autor-louvor-item")?.value || "",
                            referencia: item.querySelector(".referencia-louvor-item")?.value || "",
                            texto: previewTexto
                        });
                    });
                    dadosMomento.musicas = musicas;
                    dadosMomento.dirigenteLouvor = dirigenteLouvor;
                    break;
                
                case "leitura":
                    dadosMomento.referencia = bloco.querySelector(".referencia-biblica-input")?.value;
                    dadosMomento.texto = document.querySelector(`#preview-ref-${id}`)?.innerHTML || "";
                    break;

                case "edificacao":
                    dadosMomento.pregador = bloco.querySelector(".pregador-input")?.value;
                    dadosMomento.musicaPos = bloco.querySelector(".musica-pos-input")?.value;
                    dadosMomento.autorPos = bloco.querySelector(".musica-pos-input ~ .autor-louvor-item")?.value;
                    dadosMomento.oracaoFinal = bloco.querySelector(".oracao-final-input")?.value;
                    dadosMomento.musicaFinal = bloco.querySelector(".musica-final-input")?.value;
                    dadosMomento.autorFinal = bloco.querySelector(".musica-final-input ~ .autor-louvor-item")?.value;
                    break;
                
                case "ceia":
                    const musicasCeia = [];
                    bloco.querySelectorAll(".musica-ceia-item").forEach(item => {
                        const nomeMusica = item.querySelector(".louvor-item")?.value;
                        
                        if (nomeMusica) {
                            musicasCeia.push({
                                musica: nomeMusica,
                                autor: item.querySelector(".autor-louvor-item")?.value || "",
                                elemento: item.querySelector("input[type='radio']:checked")?.value || "Pão"
                            });
                        }
                    });
                    dadosMomento.musicas = musicasCeia;
                    break;

                case "intercessao":
                    dadosMomento.musica = bloco.querySelector(".louvor-item")?.value;
                    dadosMomento.autor = bloco.querySelector(".autor-louvor-item")?.value;
                    dadosMomento.pessoa = bloco.querySelector(".intercessor-input")?.value;
                    break;

                case "ofertas":
                    dadosMomento.referencia = bloco.querySelector(".referencia-biblica-input")?.value;
                    dadosMomento.texto = document.querySelector(`#preview-ref-ofertas-${id}`)?.innerHTML || "";
                    dadosMomento.musica = bloco.querySelector(".louvor-item")?.value;
                    dadosMomento.autor = bloco.querySelector(".autor-louvor-item")?.value;
                    dadosMomento.quemOrara = bloco.querySelector(".oracao-ofertas-input")?.value;
                    break;

                case "visitantes":
                    dadosMomento.musica = bloco.querySelector(".louvor-item")?.value;
                    dadosMomento.autor = bloco.querySelector(".autor-louvor-item")?.value;
                    break;

                case "avisos":
                    dadosMomento.texto = bloco.querySelector("textarea")?.value || "";
                    break;
            }

            cronograma.push(dadosMomento);
        });

        return cronograma;
    },

    salvarProgresso: (dadosBoletim) => {
        const cronograma = CustomService.extrairCronograma();
        dadosBoletim.cronograma = cronograma;
        
        dadosBoletim.dataCulto = document.querySelector("#data_input")?.value || dadosBoletim.dataCulto;
        dadosBoletim.dirigenteCulto = document.querySelector("#dirigente_input")?.value || dadosBoletim.dirigenteCulto;

        localStorage.setItem("boletim_atual", JSON.stringify(dadosBoletim));
        console.log("Rascunho Personalizado atualizado!");
    },

    prepararParaHistorico: (dadosBoletim) => {
        const nomeTipo = document.querySelector("#nome-culto-personalizado")?.value || "Culto Personalizado";
        
        return {
            id: dadosBoletim.id || Date.now(),
            tipo: nomeTipo,
            data: dadosBoletim.dataCulto,
            dirigenteGeral: dadosBoletim.dirigenteCulto,
            cronograma: dadosBoletim.cronograma || [],
            tipoCulto: "Personalizado"
        };
    }
};