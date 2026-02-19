export function infosInicias(dados) {
    return `
        <div class="text-center">
            <h4 class="fw-bold">Informações Iniciais</h4>
            <span class="badge bg-primary-subtle text-primary mb-3">${dados.tipoCulto}</span>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Data do Culto</label>
            <input type="date" id="data_input" class="form-control" value="${dados.dataCulto}">
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Dirigente do Culto</label>
            <input type="text" id="dirigente_input" class="form-control" placeholder="Ex: Ir. Fulano / Pr. João" value="${dados.dirigenteGeral}">
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
            <input type="text" id="dirigente_louvor" class="form-control" 
                placeholder="Ex: Júnior / Cléber" 
                value="${dados.dirigenteLouvor || ''}">
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Quantos louvores?</label>
            <input type="number" id="qtd_louvores" class="form-control mb-3" 
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
            <input type="text" class="form-control louvor-item mb-1" 
                data-index="${id}" placeholder="Nome da música" value="${valor?.musica || ''}">
            <ul id="sugestoes-musica-${id}" class="list-group lista-sugestoes" style="display: none;"></ul>
            <input type="text" class="form-control autor-louvor-item" 
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
                <input type="text" class="form-control referencia-biblica-input" data-index="leitura" id="ref_leitura" class="form-control" 
                    placeholder="Ex: Salmos 23:1-6" value="${dados.leituraCongregacional.referencia}">
                <button class="btn btn-primary btn-buscar-ref" data-index="leitura" id="btn_buscar_leitura" type="button">
                    <i class='bx bx-search'></i>
                </button>
            </div>
        </div>
        <div id="preview-ref-leitura" class="small text-muted p-2 bg-light rounded" 
            style="min-height: 50px; font-style: italic; line-height: 1.5;">
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
                    <input type="text" id="musica_visitante" class="form-control louvor-item mb-2" 
                        data-index="visitantes" placeholder="Nome da música" 
                        value="${dados.visitantes?.musica || ''}">
                    <ul id="sugestoes-musica-visitantes" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    
                    <input type="text" id="autor_visitante" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.visitantes?.autor || ''}">
                </div>
            </div>
        </div>

        <div class="card bg-light border-0">
            <div class="card-body p-3">
                <h6 class="fw-bold text-success mb-3"><i class='bx bx-coin-stack'></i> Dízimos e Ofertas</h6>
                
                <label class="form-label small fw-semibold">Referência Bíblica</label>
                <div class="input-group mb-2">
                    <input type="text" class="form-control referencia-biblica-input" 
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
                    <input type="text" id="musica_ofertas" class="form-control louvor-item mb-2" 
                        data-index="ofertas" placeholder="Música da oferta" 
                        value="${dados.ofertas?.musica || ''}">
                    <ul id="sugestoes-musica-ofertas" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    
                    <input type="text" id="autor_ofertas" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.ofertas?.autor || ''}">
                </div>

                <div class="mt-3 pt-3 border-top">
                    <label class="form-label small fw-semibold text-success">Oração pelas Ofertas</label>
                    <input type="text" id="oracao_ofertas" class="form-control" 
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
                <label class="form-label small fw-bold text-primary">Música de Preparação</label>
                <div class="busca-musica-container" style="position: relative;">
                    <input type="text" id="musica_intercessao" 
                           class="form-control louvor-item mb-1" 
                           data-index="${index}"
                           placeholder="Nome da música" 
                           value="${dados.intercessao?.musica || ''}" />
                    
                    <ul id="sugestoes-musica-${index}" class="list-group lista-sugestoes"
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    
                    <input type="text" id="autor_intercessao" 
                           class="form-control autor-louvor-item" 
                           placeholder="Autor/Banda" 
                           value="${dados.intercessao?.autor || ''}" />
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label small fw-bold text-primary">Oração Intercessória</label>
                <input type="text" id="intercessor_input" class="form-control" 
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
                    <input type="text" id="pregador_input" class="form-control" 
                        placeholder="Ex: Ir. Rubem Alves" value="${dados.edificacao?.pregador || ''}">
                </div>
                
                <div class="busca-musica-container" style="position: relative;">
                    <label class="form-label small fw-semibold">Música Pós-Mensagem</label>
                    <input type="text" id="musica_pos_mensagem" class="form-control louvor-item mb-1" 
                        data-index="pos_mensagem" placeholder="Nome da música" 
                        value="${dados.edificacao?.musicaPos || ''}">
                    <ul id="sugestoes-musica-pos_mensagem" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    <input type="text" id="autor_pos_mensagem" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.edificacao?.autorPos || ''}">
                </div>
            </div>
        </div>

        <div class="card bg-light border-0">
            <div class="card-body p-3">
                <h6 class="fw-bold text-primary mb-3"><i class='bx bx-church'></i> Oração final e benção</h6>
                <div class="mb-3">
                    <label class="form-label small fw-semibold">Responsável pela Bênção</label>
                    <input type="text" id="bencao_input" class="form-control" 
                        placeholder="Ex: Pr. Etevaldo" value="${dados.oracaoFinal || ''}">
                </div>

                <div class="busca-musica-container" style="position: relative;">
                    <label class="form-label small fw-semibold">Música Final</label>
                    <input type="text" id="musica_final" class="form-control louvor-item mb-1" 
                        data-index="final" placeholder="Ex: A Bênção" 
                        value="${dados.louvorFinal?.musica || ''}">
                    <ul id="sugestoes-musica-final" class="list-group lista-sugestoes" 
                        style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>
                    <input type="text" id="autor_final" class="form-control autor-louvor-item" 
                        placeholder="Autor" value="${dados.louvorFinal?.autor || ''}">
                </div>
            </div>
        </div>
    `;
}