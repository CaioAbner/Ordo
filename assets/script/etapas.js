export function infosInicias(dados) {
    return `

        <div class="d-flex justify-content-start w-100 mb-4">
            <button class="btn btn-sm btn-light text-muted border d-flex align-items-center gap-1" 
                    onclick="window.location.href='index.html'" 
                    style="font-size: 0.75rem; border-radius: 8px; padding: 5px 10px;"
                    title="Clique aqui para voltar para a página inicial">
                <i class='bx bx-home-alt'></i> Sair
            </button>
        </div>

        <div class="text-center">
            <h4 class="fw-bold">Informações Iniciais</h4>
            <span class="badge bg-primary-subtle text-primary mb-3">${dados.tipoCulto}</span>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Data do Culto</label>
            <input required type="date" id="data_input" class="form-control" value="${dados.dataCulto}">
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Dirigente do Culto</label>
            <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="dirigente_input" class="form-control" placeholder="Ex: Ir. Fulano / Pr. João" value="${dados.dirigenteGeral}">
        </div>`;
}

export function louvores(dados) {
    return `
        <div class="text-center">
            <h4 class="fw-bold">Louvores de Abertura</h4>
            <p class="small text-muted">Defina a quantidade, as músicas e o dirigente</p>
        </div>
        <div class="mb-3 p-3 bg-light rounded border-start border-primary border-4">
            <label class="form-label fw-semibold">Dirigente do Louvor</label>
            <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="dirigente_louvor" class="form-control" 
                placeholder="Ex: Júnior / Cléber" 
                value="${dados.dirigenteLouvor || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Quantos louvores?</label>
            <input required type="number" id="qtd_louvores" class="form-control mb-3" 
                placeholder="Ex: 3" value="${dados.louvoresAbertura.length > 0 ? dados.louvoresAbertura.length : ''}">
        </div>
        <div id="lista_inputs_louvores" class="d-flex flex-column gap-2"></div>
    `;
}

export function louvoresCeia(dados) {
    return `
        <div class="text-center mb-4">
            <h4 class="fw-bold">Momento da Santa Ceia</h4>
            <p class="small text-muted">Músicas intercaladas para a distribuição</p>
        </div>

        <div class="d-flex flex-column gap-3">
            <div class="p-3 bg-light rounded border-start border-primary border-4">
                <h6 class="fw-bold mb-2 text-primary"><i class="bx bx-baguette"/></i> 1º Louvor (Pão)</h6>
                ${componenteMusicaBasico("ceia_pao_1", dados.louvoresCeia?.pao1)}
            </div>

            <div class="p-3 bg-light rounded border-start border-danger border-4">
                <h6 class="fw-bold mb-2 text-danger"><i class="bx bx-wine"/></i> 2º Louvor (Vinho)</h6>
                ${componenteMusicaBasico("ceia_vinho", dados.louvoresCeia?.vinho)}
            </div>

            <div class="p-3 bg-light rounded border-start border-primary border-4">
                <h6 class="fw-bold mb-2 text-primary"><i class="bx bx-baguette"/></i> 3º Louvor (Pão)</h6>
                ${componenteMusicaBasico("ceia_pao_2", dados.louvoresCeia?.pao2)}
            </div>
        </div>
    `;
}

function componenteMusicaBasico(id, valor) {
    return `
        <div class="busca-musica-container" style="position: relative;">
            <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" class="form-control louvor-item mb-1" 
                data-index="${id}" placeholder="Nome da música" value="${valor?.musica || ''}">
            <ul id="sugestoes-musica-${id}" class="list-group lista-sugestoes" style="display: none;"></ul>
            <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" class="form-control autor-louvor-item" 
                placeholder="Autor" value="${valor?.autor || ''}">
        </div>
    `;
}

export function leituraCongregacional(dados) {
    return `
        <div class="text-center">
            <h4 class="fw-bold">Leitura Bíblica Congregacional</h4>
            <p class="small text-muted">Escolha o texto principal que será lido com toda a igreja</p>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Referência Bíblica</label>
            <div class="input-group mb-2">
                <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" class="form-control referencia-biblica-input" data-index="leitura" id="ref_leitura" class="form-control" 
                    placeholder="Ex: Salmos 23:1-6" value="${dados.leituraCongregacional.referencia}">
                <button class="btn btn-primary btn-buscar-ref" data-index="leitura" id="btn_buscar_leitura" type="button">
                    <i class='bx bx-search'></i>
                </button>
            </div>
        </div>
        <div id="preview-ref-leitura" class="small text-muted p-2 bg-light rounded" 
            style="min-height: 60px; font-style: italic; line-height: 1.5;">
            ${dados.leituraCongregacional.texto || '<span class="text-muted">O texto aparecerá aqui...</span>'}
        </div>
    `;
}

export function visitantesEOfertas(dados) {
    return `
        <div class="text-center mb-4">
            <h4 class="fw-bold">Visitantes e Ofertas</h4>
            <p class="small text-muted">Saudação aos visitantes e momento do ofertório</p>
        </div>

        <div class="card bg-light border-0 mb-3">
            <div class="card-body p-3">
                  <h6 class="fw-bold text-primary mb-3"><i class='bx bx-group'></i> Visitantes</h6>
                <div class="busca-musica-container" style="position: relative;">
                    <label class="form-label small fw-semibold">Música de Boas-vindas</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="musica_visitante" class="form-control louvor-item mb-2" 
                        data-index="visitantes" placeholder="Nome da música" 
                        value="${dados.visitantes?.musica || ''}">
                    <ul id="sugestoes-musica-visitantes" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="autor_visitante" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.visitantes?.autor || ''}">
                </div>
            </div>
        </div>

        <div class="card bg-light border-0">
            <div class="card-body p-3">
                <h6 class="fw-bold text-success mb-3"><i class='bx bx-coin-stack'></i> Dízimos e Ofertas</h6>
                
                <label class="form-label small fw-semibold">Referência Bíblica</label>
                <div class="input-group mb-2">
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" class="form-control referencia-biblica-input" 
                        data-index="ofertas" id="ref_ofertas" 
                        placeholder="Ex: 2 Coríntios 9:7" value="${dados.ofertas?.referencia || ''}">
                    <button class="btn btn-success btn-buscar-ref" data-index="ofertas" type="button">
                        <i class='bx bx-search'></i>
                    </button>
                </div>
                <div id="preview-ref-ofertas" class="small text-muted p-2 bg-white rounded mb-3 border" style="min-height: 40px; font-style: italic;">
                    ${dados.ofertas?.texto || 'O texto das ofertas aparecerá aqui...'}
                </div>

                <div class="busca-musica-container" style="position: relative;">
                    <label class="form-label small fw-semibold">Música do Ofertório</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="musica_ofertas" class="form-control louvor-item mb-2" 
                        data-index="ofertas" placeholder="Música da oferta" 
                        value="${dados.ofertas?.musica || ''}">
                    <ul id="sugestoes-musica-ofertas" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="autor_ofertas" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.ofertas?.autor || ''}">
                </div>

                <div class="mt-3 pt-3 border-top">
                    <label class="form-label small fw-semibold text-success">Oração pelas Ofertas</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="oracao_ofertas" class="form-control" 
                        placeholder="Nome do irmão que fará a oração.." 
                        value="${dados.ofertas?.oracaoOfertas || ''}">
                </div>

            </div>
        </div>
    `;
}

export function intercessao(dados) {
    const index = "inter"; 
    
    return `
        <div class="step-content">
            <h5 class="fw-bold mb-3">Momento de Intercessão</h5>
            
            <div class="mb-4">
                <label class="form-label small fw-bold text-primary">Música da Intercessão</label>
                <div class="busca-musica-container" style="position: relative;">
                    <input type="text" id="musica_intercessao" 
                           class="form-control louvor-item mb-1" 
                           data-index="${index}"
                           placeholder="Nome da música" 
                           required
                           oninput="this.value = this.value.replace(/[0-9]/g, '')"
                           value="${dados.intercessao?.musica || ''}" />
                    
                    <ul id="sugestoes-musica-${index}" class="list-group lista-sugestoes"
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    
                    <input type="text" id="autor_intercessao" 
                           class="form-control autor-louvor-item" 
                           placeholder="Autor/Banda" 
                           required
                           oninput="this.value = this.value.replace(/[0-9]/g, '')"
                           value="${dados.intercessao?.autor || ''}" />
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold text-primary">Oração Intercessória</label>
                <input requerid oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="intercessor_input" class="form-control" 
                       value="${dados.intercessao?.quemOrara || ''}" placeholder="Quem fará a oração?">
            </div>
        </div>
    `;
}

export function edificacaoEEncerramento(dados) {
    return `
        <div class="text-center mb-4">
            <h4 class="fw-bold">Edificação e Encerramento</h4>
            <p class="small text-muted">Mensagem, oração final e louvores de despedida</p>
        </div>

        <div class="card bg-light border-0 mb-3">
            <div class="card-body p-3">
                <h6 class="fw-bold text-primary mb-3"><i class='bx bx-book-bookmark'></i> Edificação da nossa fé</h6>
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Pregador (Mensagem)</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="pregador_input" class="form-control" 
                        placeholder="Ex: Ir. Fulano" value="${dados.edificacao?.pregador || ''}">
                </div>
                
                <div class="busca-musica-container" style="position: relative;">
                    <label class="form-label small fw-semibold">Música Pós-Mensagem</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="musica_pos_mensagem" class="form-control louvor-item mb-1" 
                        data-index="pos_mensagem" placeholder="Nome da música" 
                        value="${dados.edificacao?.musicaPos || ''}">
                    <ul id="sugestoes-musica-pos_mensagem" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="autor_pos_mensagem" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.edificacao?.autorPos || ''}">
                </div>
            </div>
        </div>

        <div class="card bg-light border-0">
            <div class="card-body p-3">
                <h6 class="fw-bold text-primary mb-3"><i class='bx bx-church'></i> Oração final e benção</h6>
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Responsável pela Bênção</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="bencao_input" class="form-control" 
                        placeholder="Ex: Pr. Etevaldo" value="${dados.oracaoFinal || ''}">
                </div>

                <div class="busca-musica-container" style="position: relative;">
                    <label class="form-label small fw-semibold">Música Final</label>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="musica_final" class="form-control louvor-item mb-1" 
                        data-index="final" placeholder="Ex: A Bênção" 
                        value="${dados.louvorFinal?.musica || ''}">
                    <ul id="sugestoes-musica-final" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="autor_final" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.louvorFinal?.autor || ''}">
                </div>
            </div>
        </div>
    `;
}

export function cultoPersonalizado(dados) {
    return `
        <div class="p-3">
            <div class="mb-4">
                <label class="form-label fw-bold">Nome do Culto / Evento</label>
                <input required oninput="this.value = this.value.replace(/[0-9]/g, '')" type="text" id="nome-culto-personalizado" class="form-control" 
                       placeholder="Ex: Congresso Identidade" value="${dados.nomePersonalizado || ''}">
            </div>

            <div id="container-momentos">
                </div>

            <button type="button" class="btn btn-primary w-100 py-3 mt-3 border-dashed" style="border-style: dashed !important;" onclick="abrirSeletorModulos()">
                <i class='bx bx-plus-circle'></i> Adicionar Momento
            </button>
        </div>

        <div id="seletor-modulos" class="d-none mt-3 p-3 border rounded bg-white shadow-sm">
            <h6 class="fw-bold mb-3 text-center">Selecione os momentos que deseja adicionar ao seu culto.</h6>
            <div class="row g-2">
                <div class="col-6"><button class="btn btn-outline-primary w-100 text-start btn-sm" onclick="criarMomento('louvor')"><i class='bx bx-music'></i> Louvor</button></div>
                <div class="col-6"><button class="btn btn-outline-success w-100 text-start btn-sm" onclick="criarMomento('leitura')"><i class='bx bx-book-open'></i> Leitura</button></div>
                <div class="col-6"><button class="btn btn-outline-dark w-100 text-start btn-sm" onclick="criarMomento('edificacao')"><i class='bx bx-microphone'></i> Edificação</button></div>
                <div class="col-6"><button class="btn btn-outline-danger w-100 text-start btn-sm" onclick="criarMomento('ceia')"><i class='bx bx-wine'></i> Ceia</button></div>
                <div class="col-6"><button class="btn btn-outline-info w-100 text-start btn-sm" onclick="criarMomento('intercessao')"><i class="bx bx-church"></i> Intercessão</button></div>
                <div class="col-6"><button class="btn btn-outline-success w-100 text-start btn-sm" onclick="criarMomento('ofertas')"><i class='bx bx-coin-stack'></i> Ofertas</button></div>
                <div class="col-6"><button class="btn btn-outline-warning w-100 text-start btn-sm" onclick="criarMomento('visitantes')"><i class='bx bx-group'></i> Visitantes</button></div>
                <div class="col-6"><button class="btn btn-outline-secondary w-100 text-start btn-sm" onclick="criarMomento('avisos')"><i class='bx bx-bell'></i> Avisos</button></div>
            </div>
        </div>
    `;
}

export function gerarHtmlBloco(tipo) {
    const labels = {
        louvor: { titulo: "Música/Louvor", cor: "primary" },
        leitura: { titulo: "Leitura Bíblica", cor: "success" },
        edificacao: { titulo: "Mensagem/Pregador", cor: "dark" },
        texto: { titulo: "Texto Livre/Avisos", cor: "secondary" }
    };

    const config = labels[tipo] || { titulo: "Outros", cor: "secondary" };

    return `
        <div class="bloco-item-personalizado border-start border-4 border-${config.cor} bg-white p-3 mb-3 shadow-sm rounded position-relative" data-tipo="${tipo}">
            <button type="button" class="btn-remove-bloco btn btn-link text-danger position-absolute top-0 end-0 mt-1">
                <i class='bx bx-trash'></i>
            </button>
            
            <small class="fw-bold text-${config.cor} text-uppercase" style="font-size: 10px;">${config.titulo}</small>
            
            <div class="mt-2">
                <input type="text" class="form-control form-control-sm mb-2 input-titulo" placeholder="Título opcional">
                
                ${tipo === 'louvor' ? `
                    <input type="text" required class="form-control form-control-sm mb-1 louvor-item" placeholder="Nome da música">
                    <input type="text" required class="form-control form-control-sm autor-louvor-item" placeholder="Autor">
                ` : ''}

                ${tipo === 'leitura' ? `
                    <div class="input-group input-group-sm mb-1">
                        <input type="text" required class="form-control referencia-biblica-input" placeholder="Ex: Salmos 23">
                        <button class="btn btn-outline-secondary btn-buscar-ref" type="button"><i class='bx bx-search'></i></button>
                    </div>
                    <div class="small text-muted p-2 bg-light rounded preview-ref">Versículos aparecerão aqui...</div>
                ` : ''}

                ${tipo === 'edificacao' ? `
                    <input type="text" required oninput="this.value = this.value.replace(/[0-9]/g, '')" class="form-control form-control-sm mb-1 pregador-input" placeholder="Nome do Pregador">
                    <div class="busca-musica-container" style="position: relative;">
                        <input type="text" class="form-control form-control-sm mb-1 louvor-item musica-pos-input" placeholder="Música pós mensagem">
                        <input type="text" class="form-control form-control-sm mb-1 autor-louvor-item" placeholder="Autor música pós">
                    </div>

                    <input type="text" required class="form-control form-control-sm mb-1 oracao-final-input" placeholder="Oração Final">
                    
                    <div class="busca-musica-container" style="position: relative;">
                        <input type="text" required class="form-control form-control-sm mb-1 louvor-item musica-final-input" placeholder="Música Final">
                        <input type="text" required class="form-control form-control-sm autor-louvor-item" placeholder="Autor música final">
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}