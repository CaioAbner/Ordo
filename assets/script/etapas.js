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
            <input type="text" id="dirigente_input" class="form-control" placeholder="Ex: Ir. Fulano / Pr. João" value="${dados.dirigenteCulto}">
        </div>`;
}

export function louvores(dados) {
    return `
        <div class="text-center">
                <h4 class="fw-bold">Louvores de Abertura</h4>
                <p class="small text-muted">Defina a quantidade e os nomes das músicas, além das referências bíblicas que as acompanham</p>
            </div>
            <div class="mb-3">
                <label class="form-label fw-semibold">Quantos louvores?</label>
                <input type="number" id="qtd_louvores" class="form-control mb-3" placeholder="Ex: 3" value="${dados.louvoresAbertura.length > 0 ? dados.louvoresAbertura.length : ''}">
            </div>
        <div id="lista_inputs_louvores" class="d-flex flex-column gap-2"></div>
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

export function visitantes(dados) {
    return `
        <div class="text-center">
            <h4 class="fw-bold">Visitantes</h4>
            <p class="small text-muted">Saudação e música para os novos irmãos</p>
        </div>
        <div class="busca-musica-container" style="position: relative;">
            <label class="form-label fw-semibold">Música de Boas-vindas</label>
            <input type="text" id="musica_visitante" class="form-control louvor-item mb-1" 
                data-index="visitantes" placeholder="Nome da música" 
                value="${dados.visitantes?.musica || ''}">
            
            <ul id="sugestoes-musica-visitantes" class="list-group lista-sugestoes" 
                style="position: absolute; z-index: 1000; width: 100%; display: none;"></ul>

            <input type="text" id="autor_visitante" class="form-control autor-louvor-item" 
                placeholder="Autor" value="${dados.visitantes?.autor || ''}">
        </div>
    `;
}