export async function buscarPassagem(referencia) {

    if (!referencia || referencia.length < 3) return "";

    try {
        const res = await fetch(`https://bible-api.com/${encodeURIComponent(referencia)}?translation=almeida`);
        const data = await res.json();

        if (!data.verses) return "Passagem não encontrada.";

        return data.verses.map(v => 
            `<sup style="font-size: 0.7em; font-weight: bold; color: #888; margin-right: 2px;">${v.verse}</sup>${v.text}`
        ).join("");

    } catch (error) {
        console.error("Erro na Api da Bíblia: ", error);
        return "Erro ao carregar versículos.";
    }
}