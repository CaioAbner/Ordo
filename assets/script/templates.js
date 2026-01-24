export const templates = {
    etapa1: (dados) => `
        <div class="text-center">
            <h4 class="fw-bold">Informações Iniciais</h4>
            <span class="badge bg-primary-subtle text-primary mb-3">${dados.tipoCulto}</span>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Data do Culto</label>
            <input type="date" id="data_input" class="form-control" value="${dados.dataCulto}">
        </div>
        `,
    
    itemLouvor: (i, dadosAnteriores) => `
        <div class="border-bottom pb-3 mb-2">
            <label class="small fw-bold text-primary">Música ${i}</label>
            <div class="input-group mb-1">
                <input type="text" class="form-control referencia-louvor-item" 
                    data-index="${i - 1}" value="${dadosAnteriores.referencia}">
                <button class="btn btn-primary btn-buscar-ref" data-index="${i - 1}">
                    <i class='bx bx-search'></i>
                </button>
            </div>
            <div id="preview-ref-${i - 1}" class="small text-muted mb-2 p-2 bg-light rounded">
                ${dadosAnteriores.referencia ? 'Clique na lupa para carregar...' : 'Aguardando...'}
            </div>
            </div>
    `
};