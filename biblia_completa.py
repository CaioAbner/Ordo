import requests
import json
import time

# Mapeamento completo para a API (Sua Sigla -> ID da API)
livros = [
    {"minha_sigla": "gn", "api_id": "GEN", "nome": "Gênesis", "caps": 50},
    {"minha_sigla": "ex", "api_id": "EXO", "nome": "Êxodo", "caps": 40},
    {"minha_sigla": "lv", "api_id": "LEV", "nome": "Levítico", "caps": 27},
    {"minha_sigla": "nm", "api_id": "NUM", "nome": "Números", "caps": 36},
    {"minha_sigla": "dt", "api_id": "DEU", "nome": "Deuteronômio", "caps": 34},
    {"minha_sigla": "js", "api_id": "JOS", "nome": "Josué", "caps": 24},
    {"minha_sigla": "jz", "api_id": "JDG", "nome": "Juízes", "caps": 21},
    {"minha_sigla": "rt", "api_id": "RUT", "nome": "Rute", "caps": 4},
    {"minha_sigla": "1sm", "api_id": "1SA", "nome": "1 Samuel", "caps": 31},
    {"minha_sigla": "2sm", "api_id": "2SA", "nome": "2 Samuel", "caps": 24},
    {"minha_sigla": "1rs", "api_id": "1KI", "nome": "1 Reis", "caps": 22},
    {"minha_sigla": "2rs", "api_id": "2KI", "nome": "2 Reis", "caps": 25},
    {"minha_sigla": "1cr", "api_id": "1CH", "nome": "1 Crônicas", "caps": 29},
    {"minha_sigla": "2cr", "api_id": "2CH", "nome": "2 Crônicas", "caps": 36},
    {"minha_sigla": "ed", "api_id": "EZR", "nome": "Esdras", "caps": 10},
    {"minha_sigla": "ne", "api_id": "NEH", "nome": "Neemias", "caps": 13},
    {"minha_sigla": "et", "api_id": "EST", "nome": "Ester", "caps": 10},
    {"minha_sigla": "jó", "api_id": "JOB", "nome": "Jó", "caps": 42},
    {"minha_sigla": "sl", "api_id": "PSA", "nome": "Salmos", "caps": 150},
    {"minha_sigla": "pv", "api_id": "PRO", "nome": "Provérbios", "caps": 31},
    {"minha_sigla": "ec", "api_id": "ECC", "nome": "Eclesiastes", "caps": 12},
    {"minha_sigla": "ct", "api_id": "SNG", "nome": "Cânticos", "caps": 8},
    {"minha_sigla": "is", "api_id": "ISA", "nome": "Isaías", "caps": 66},
    {"minha_sigla": "jr", "api_id": "JER", "nome": "Jeremias", "caps": 52},
    {"minha_sigla": "lm", "api_id": "LAM", "nome": "Lamentações", "caps": 5},
    {"minha_sigla": "ez", "api_id": "EZK", "nome": "Ezequiel", "caps": 48},
    {"minha_sigla": "dn", "api_id": "DAN", "nome": "Daniel", "caps": 12},
    {"minha_sigla": "os", "api_id": "HOS", "nome": "Oseias", "caps": 14},
    {"minha_sigla": "jl", "api_id": "JOL", "nome": "Joel", "caps": 3},
    {"minha_sigla": "am", "api_id": "AMO", "nome": "Amós", "caps": 9},
    {"minha_sigla": "ob", "api_id": "OBA", "nome": "Obadias", "caps": 1},
    {"minha_sigla": "jn", "api_id": "JON", "nome": "Jonas", "caps": 4},
    {"minha_sigla": "mq", "api_id": "MIC", "nome": "Miqueias", "caps": 7},
    {"minha_sigla": "na", "api_id": "NAM", "nome": "Naum", "caps": 3},
    {"minha_sigla": "hab", "api_id": "HAB", "nome": "Habacuque", "caps": 3},
    {"minha_sigla": "sf", "api_id": "ZEP", "nome": "Sofonias", "caps": 3},
    {"minha_sigla": "ag", "api_id": "HAG", "nome": "Ageu", "caps": 2},
    {"minha_sigla": "zc", "api_id": "ZEC", "nome": "Zacarias", "caps": 14},
    {"minha_sigla": "ml", "api_id": "MAL", "nome": "Malaquias", "caps": 4},
    {"minha_sigla": "mt", "api_id": "MAT", "nome": "Mateus", "caps": 28},
    {"minha_sigla": "mc", "api_id": "MRK", "nome": "Marcos", "caps": 16},
    {"minha_sigla": "lc", "api_id": "LUK", "nome": "Lucas", "caps": 24},
    {"minha_sigla": "jo", "api_id": "JHN", "nome": "João", "caps": 21},
    {"minha_sigla": "at", "api_id": "ACT", "nome": "Atos", "caps": 28},
    {"minha_sigla": "rm", "api_id": "ROM", "nome": "Romanos", "caps": 16},
    {"minha_sigla": "1co", "api_id": "1CO", "nome": "1 Coríntios", "caps": 16},
    {"minha_sigla": "2co", "api_id": "2CO", "nome": "2 Coríntios", "caps": 13},
    {"minha_sigla": "gl", "api_id": "GAL", "nome": "Gálatas", "caps": 6},
    {"minha_sigla": "ef", "api_id": "EPH", "nome": "Efésios", "caps": 6},
    {"minha_sigla": "fp", "api_id": "PHP", "nome": "Filipenses", "caps": 4},
    {"minha_sigla": "cl", "api_id": "COL", "nome": "Colossenses", "caps": 4},
    {"minha_sigla": "1ts", "api_id": "1TH", "nome": "1 Tessalonicenses", "caps": 5},
    {"minha_sigla": "2ts", "api_id": "2TH", "nome": "2 Tessalonicenses", "caps": 3},
    {"minha_sigla": "1tm", "api_id": "1TI", "nome": "1 Timóteo", "caps": 6},
    {"minha_sigla": "2tm", "api_id": "2TI", "nome": "2 Timóteo", "caps": 4},
    {"minha_sigla": "tt", "api_id": "TIT", "nome": "Tito", "caps": 3},
    {"minha_sigla": "fm", "api_id": "PHM", "nome": "Filemon", "caps": 1},
    {"minha_sigla": "hb", "api_id": "HEB", "nome": "Hebreus", "caps": 13},
    {"minha_sigla": "tg", "api_id": "JAS", "nome": "Tiago", "caps": 5},
    {"minha_sigla": "1pe", "api_id": "1PE", "nome": "1 Pedro", "caps": 5},
    {"minha_sigla": "2pe", "api_id": "2PE", "nome": "2 Pedro", "caps": 3},
    {"minha_sigla": "1jo", "api_id": "1JN", "nome": "1 João", "caps": 5},
    {"minha_sigla": "2jo", "api_id": "2JN", "nome": "2 João", "caps": 1},
    {"minha_sigla": "3jo", "api_id": "3JN", "nome": "3 João", "caps": 1},
    {"minha_sigla": "jd", "api_id": "JUD", "nome": "Judas", "caps": 1},
    {"minha_sigla": "ap", "api_id": "REV", "nome": "Apocalipse", "caps": 22}
]

biblia_final = {}
translation = "ara"

def limpar_texto(conteudo_api):
    # Transforma os pedaços de texto da API em uma frase só
    # Resolve o erro da imagem_01aaa8.png onde "Senhor" vinha separado
    texto_unido = ""
    for item in conteudo_api:
        if isinstance(item, str):
            texto_unido += item
        elif isinstance(item, dict) and 'text' in item:
            texto_unido += item['text']
    return texto_unido.strip()

print("--- INICIANDO DOWNLOAD (DADOS LIMPOS) ---")

for livro in livros:
    sigla = livro['minha_sigla']
    print(f"Baixando {livro['nome']}...")
    biblia_final[sigla] = {"nome": livro["nome"], "capitulos": {}}
    
    for cap_num in range(1, livro['caps'] + 1):
        # URL seguindo a documentação: api/{trans}/{book}/{cap}.json
        url = f"https://bible.helloao.org/api/{translation}/{livro['api_id']}/{cap_num}.json"
        
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                data = r.json()
                versiculos = []
                # Filtra apenas o conteúdo do tipo 'verse'
                for item in data['chapter']['content']:
                    if item['type'] == 'verse':
                        versiculos.append(limpar_texto(item['content']))
                
                biblia_final[sigla]["capitulos"][str(cap_num)] = versiculos
            else:
                print(f"  Erro no Cap {cap_num}: Status {r.status_code}")
        except Exception as e:
            print(f"  Falha na conexão no Cap {cap_num}: {e}")
        
        time.sleep(0.1) # Pausa para evitar bloqueio de IP

# Gera o arquivo final para o seu App
with open("biblia_completa.js", "w", encoding="utf-8") as f:
    f.write(f"const bibliaData = {json.dumps(biblia_final, ensure_ascii=False, indent=2)};")

print("\n--- FINALIZADO! Verifique o arquivo biblia_completa.js ---")